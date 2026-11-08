"""Repeatable local demonstration using generated, fictional operational events."""

from __future__ import annotations

import argparse
import csv
import io
import sqlite3
import json
import random
from dataclasses import dataclass, field
from datetime import date, timedelta
from pathlib import Path

from health_ingest.events import ObjectEvent
from health_ingest.pipeline import Pipeline


@dataclass
class LocalStorage:
    content: bytes
    curated: dict[str, bytes] = field(default_factory=dict)
    rejected: list[str] = field(default_factory=list)

    def read(self, event):
        return self.content

    def write_curated(self, key, data):
        self.curated[key] = data
        return f"s3://demo-bucket/{key}"

    def quarantine(self, event, reason):
        self.rejected.append(reason)


@dataclass
class LocalLedger:
    states: dict[str, str] = field(default_factory=dict)

    def acquire(self, event_id, tenant, token):
        if event_id in self.states:
            return "DONE" if self.states[event_id] in {"COMPLETED", "REJECTED"} else "BUSY"
        self.states[event_id] = "PROCESSING"
        return "ACQUIRED"

    def finish(self, event_id, token, status, rows):
        self.states[event_id] = status


class SqliteWarehouse:
    """Local verification of business-key upserts with revision ordering."""

    def __init__(self, storage: LocalStorage):
        self.storage = storage
        self.conn = sqlite3.connect(":memory:")
        self.conn.execute("""
            CREATE TABLE utilization_events (
                tenant_id TEXT NOT NULL,
                record_id TEXT NOT NULL,
                service_date TEXT NOT NULL,
                service_code TEXT NOT NULL,
                units INTEGER NOT NULL,
                amount_usd TEXT NOT NULL,
                revision INTEGER NOT NULL,
                PRIMARY KEY (tenant_id, record_id)
            )
        """)
        self.calls: list[str] = []

    def merge(self, uri: str, event_id: str) -> None:
        _, _, path = uri.partition("s3://demo-bucket/")
        if not path or path not in self.storage.curated:
            raise ValueError("Missing curated object")
        contents = self.storage.curated[path].decode("utf-8")
        rows = list(csv.DictReader(io.StringIO(contents)))
        with self.conn:
            self.conn.executemany("""
                INSERT INTO utilization_events (
                    tenant_id, record_id, service_date, service_code, units, amount_usd, revision
                ) VALUES (:tenant_id, :record_id, :service_date, :service_code, :units, :amount_usd, :revision)
                ON CONFLICT (tenant_id, record_id) DO UPDATE SET
                    service_date = excluded.service_date,
                    service_code = excluded.service_code,
                    units = excluded.units,
                    amount_usd = excluded.amount_usd,
                    revision = excluded.revision
                WHERE excluded.revision >= utilization_events.revision
            """, rows)
        self.calls.append(uri)

    def count(self) -> int:
        return self.conn.execute("SELECT COUNT(*) FROM utilization_events").fetchone()[0]


@dataclass
class LocalWarehouse:
    calls: list[str] = field(default_factory=list)

    def merge(self, uri, event_id):
        self.calls.append(uri)


def generate_data(count: int, tenant: str = "demo-clinic", seed: int = 7) -> bytes:
    import csv
    import io

    randomizer = random.Random(seed)
    output = io.StringIO(newline="")
    writer = csv.writer(output, lineterminator="\n")
    writer.writerow(["tenant_id", "record_id", "service_date", "service_code", "units", "amount_usd", "revision"])
    start = date(2025, 1, 1)
    for i in range(count):
        writer.writerow([
            tenant, f"EVT-{i:06}", (start + timedelta(days=randomizer.randrange(300))).isoformat(),
            randomizer.choice(["VISIT", "LAB", "CONSULT"]), randomizer.randint(1, 4),
            f"{randomizer.randrange(5000, 30000) / 100:.2f}", 1,
        ])
    return output.getvalue().encode()


def main():
    parser = argparse.ArgumentParser(description="Run the ingestion pipeline without AWS")
    parser.add_argument("--rows", type=int, default=100)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    if not 1 <= args.rows <= 10_000:
        parser.error("--rows must be between 1 and 10000")
    content = generate_data(args.rows)
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_bytes(content)
    storage, ledger = LocalStorage(content), LocalLedger()
    warehouse = SqliteWarehouse(storage)
    pipeline = Pipeline(storage, ledger, warehouse)
    event = ObjectEvent("demo-bucket", "incoming/demo-clinic/batch.csv", "v1", None, "demo-clinic")
    first, replay = pipeline.ingest(event), pipeline.ingest(event)
    print(json.dumps({"first": first.__dict__, "replay": replay.__dict__,
                      "curated_objects": len(storage.curated), "warehouse_merges": len(warehouse.calls),
                      "reporting_rows": warehouse.count()}, indent=2))


if __name__ == "__main__":
    main()

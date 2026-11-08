"""Simple local throughput measurement; does not model AWS or Redshift latency."""

from __future__ import annotations

import argparse
import time

from health_ingest.demo import LocalLedger, LocalStorage, SqliteWarehouse, generate_data
from health_ingest.events import ObjectEvent
from health_ingest.pipeline import Pipeline


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--rows", type=int, default=10000)
    args = parser.parse_args()
    if not 1 <= args.rows <= 10000:
        parser.error("--rows must be between 1 and 10000")
    storage = LocalStorage(generate_data(args.rows))
    warehouse = SqliteWarehouse(storage)
    pipeline = Pipeline(storage, LocalLedger(), warehouse)
    event = ObjectEvent("demo-bucket", "incoming/demo-clinic/batch.csv", "v1", None, "demo-clinic")
    started = time.perf_counter()
    outcome = pipeline.ingest(event)
    elapsed = time.perf_counter() - started
    print(f"Rows={outcome.rows}, elapsed={elapsed:.3f}s, rows/s={outcome.rows / elapsed:.0f}")
    print("Local data validation + SQLite only; not a cloud performance result.")


if __name__ == "__main__":
    main()

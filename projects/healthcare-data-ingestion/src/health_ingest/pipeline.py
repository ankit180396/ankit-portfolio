"""Orchestrate ingestion through replaceable storage, lease, and warehouse adapters."""

from __future__ import annotations

import hashlib
import logging
from uuid import uuid4
from dataclasses import dataclass
from typing import Literal, Protocol

from health_ingest.domain import InvalidBatch, normalize_csv
from health_ingest.events import ObjectEvent

LOG = logging.getLogger(__name__)
AcquireResult = Literal["ACQUIRED", "DONE", "BUSY"]


class Storage(Protocol):
    def read(self, event: ObjectEvent) -> bytes: ...
    def write_curated(self, key: str, data: bytes) -> str: ...
    def quarantine(self, event: ObjectEvent, reason: str) -> None: ...


class Ledger(Protocol):
    def acquire(self, event_id: str, tenant: str, token: str) -> AcquireResult: ...
    def finish(self, event_id: str, token: str, status: str, rows: int) -> None: ...


class Warehouse(Protocol):
    def merge(self, csv_uri: str, event_id: str) -> None: ...


class BusyLease(RuntimeError):
    """Another worker owns the active lease; SQS should retry this notification."""


@dataclass(frozen=True)
class Outcome:
    status: Literal["COMPLETED", "REJECTED", "ALREADY_PROCESSED"]
    rows: int = 0


class Pipeline:
    def __init__(self, storage: Storage, ledger: Ledger, warehouse: Warehouse):
        self.storage = storage
        self.ledger = ledger
        self.warehouse = warehouse

    def ingest(self, event: ObjectEvent) -> Outcome:
        event_id = event.identity
        token = uuid4().hex
        state = self.ledger.acquire(event_id, event.tenant, token)
        if state == "DONE":
            return Outcome("ALREADY_PROCESSED")
        if state == "BUSY":
            raise BusyLease("Active ingestion lease; retry later")
        try:
            normalized, rows = normalize_csv(self.storage.read(event), event.tenant)
        except InvalidBatch as exc:
            # Only schema/data errors are permanent. I/O and AWS failures still retry.
            self.storage.quarantine(event, str(exc))
            self.ledger.finish(event_id, token, "REJECTED", 0)
            LOG.warning("batch_rejected", extra={"event_id": event_id, "tenant": event.tenant})
            return Outcome("REJECTED")
        curated_key = f"curated/{event.tenant}/{event_id}.csv"
        csv_uri = self.storage.write_curated(curated_key, normalized)
        self.warehouse.merge(csv_uri, event_id)
        # If the final state write fails, the next attempt safely repeats the MERGE.
        self.ledger.finish(event_id, token, "COMPLETED", rows)
        LOG.info("batch_completed", extra={"event_id": event_id, "rows": rows})
        return Outcome("COMPLETED", rows)


def sqs_handler(event: dict, pipeline: Pipeline) -> dict:
    failures = []
    from health_ingest.events import parse_sqs_body

    for record in event.get("Records", []):
        try:
            for object_event in parse_sqs_body(record["body"]):
                pipeline.ingest(object_event)
        except Exception:
            # A malformed notification is retried a finite number of times, then DLQ'd.
            LOG.exception("sqs_message_failed", extra={"message_id": record.get("messageId")})
            failures.append({"itemIdentifier": record["messageId"]})
    return {"batchItemFailures": failures}

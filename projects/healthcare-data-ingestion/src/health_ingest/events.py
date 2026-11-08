"""S3 notifications carried by SQS (including URL-encoded object keys)."""

from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from urllib.parse import unquote_plus

from health_ingest.domain import InvalidBatch, validate_tenant


@dataclass(frozen=True)
class ObjectEvent:
    bucket: str
    key: str
    version: str | None
    etag: str | None
    tenant: str

    @property
    def identity(self) -> str:
        parts = [self.bucket, self.key, self.version or "", self.etag or ""]
        return hashlib.sha256("\x00".join(parts).encode()).hexdigest()


def parse_sqs_body(body: str) -> list[ObjectEvent]:
    try:
        message = json.loads(body)
        records = message["Records"]
        if not isinstance(records, list) or not records:
            raise ValueError("Records must be a nonempty list")
    except (ValueError, TypeError, KeyError) as exc:
        raise InvalidBatch("Invalid S3 event envelope") from exc
    events = []
    for record in records:
        try:
            if not record["eventName"].startswith("ObjectCreated:"):
                raise InvalidBatch("Unexpected S3 event type")
            bucket = record["s3"]["bucket"]["name"]
            object_info = record["s3"]["object"]
            key = unquote_plus(object_info["key"])
            parts = key.split("/")
            if len(parts) != 3 or parts[0] != "incoming" or not parts[2].endswith(".csv"):
                raise InvalidBatch("Object must match incoming/<tenant>/<file>.csv")
            tenant = validate_tenant(parts[1])
            if not parts[2] or parts[2] in (".", ".."):
                raise InvalidBatch("Invalid file name")
            events.append(ObjectEvent(
                bucket=bucket, key=key, tenant=tenant,
                version=object_info.get("versionId"), etag=object_info.get("eTag"),
            ))
        except (KeyError, TypeError, AttributeError) as exc:
            raise InvalidBatch("Malformed S3 object notification") from exc
    return events

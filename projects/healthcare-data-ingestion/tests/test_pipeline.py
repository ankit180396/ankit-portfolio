import json

import pytest

from health_ingest.demo import LocalLedger, LocalStorage, LocalWarehouse, generate_data
from health_ingest.domain import InvalidBatch
from health_ingest.events import ObjectEvent, parse_sqs_body
from health_ingest.pipeline import BusyLease, Pipeline, sqs_handler


def event(version="v1"):
    return ObjectEvent("raw-bucket", "incoming/demo-clinic/batch.csv", version, "etag", "demo-clinic")


def test_full_processing_then_idempotent_replay():
    storage, ledger, warehouse = LocalStorage(generate_data(3)), LocalLedger(), LocalWarehouse()
    pipe = Pipeline(storage, ledger, warehouse)
    assert pipe.ingest(event()).status == "COMPLETED"
    assert pipe.ingest(event()).status == "ALREADY_PROCESSED"
    assert len(storage.curated) == len(warehouse.calls) == 1
    assert ledger.states[event().identity] == "COMPLETED"


def test_new_object_version_is_a_new_job():
    storage, ledger, warehouse = LocalStorage(generate_data(2)), LocalLedger(), LocalWarehouse()
    pipe = Pipeline(storage, ledger, warehouse)
    pipe.ingest(event("v1"))
    pipe.ingest(event("v2"))
    assert len(storage.curated) == len(warehouse.calls) == 2


def test_invalid_batch_is_quarantined_not_merged():
    storage, ledger, warehouse = LocalStorage(b"wrong"), LocalLedger(), LocalWarehouse()
    assert Pipeline(storage, ledger, warehouse).ingest(event()).status == "REJECTED"
    assert storage.rejected and not warehouse.calls
    assert ledger.states[event().identity] == "REJECTED"


def test_warehouse_failure_never_marks_complete():
    class BrokenWarehouse:
        def merge(self, csv_uri, event_id):
            raise TimeoutError("temporary data API failure")

    storage, ledger = LocalStorage(generate_data(1)), LocalLedger()
    with pytest.raises(TimeoutError):
        Pipeline(storage, ledger, BrokenWarehouse()).ingest(event())
    assert ledger.states[event().identity] == "PROCESSING"


def test_busy_lease_raises_for_retry():
    storage, ledger, warehouse = LocalStorage(generate_data(1)), LocalLedger(), LocalWarehouse()
    ledger.states[event().identity] = "PROCESSING"
    with pytest.raises(BusyLease):
        Pipeline(storage, ledger, warehouse).ingest(event())


def envelope(key="incoming/demo-clinic/batch.csv"):
    return json.dumps({"Records": [{
        "eventName": "ObjectCreated:Put", "s3": {"bucket": {"name": "raw-bucket"},
        "object": {"key": key, "versionId": "v1", "eTag": "etag"}},
    }]})


def test_parse_sqs_url_decoding():
    assert parse_sqs_body(envelope("incoming/demo-clinic/batch+file.csv"))[0].key == (
        "incoming/demo-clinic/batch file.csv"
    )


def test_key_tenant_and_prefix_validation():
    for key in ("incoming/demo-clinic/other.txt", "incoming/INVALID/a.csv", "foo/demo-clinic/a.csv"):
        with pytest.raises(InvalidBatch):
            parse_sqs_body(envelope(key))


def test_partial_sqs_failure_only_retries_failed_message():
    storage, ledger, warehouse = LocalStorage(generate_data(3)), LocalLedger(), LocalWarehouse()
    pipe = Pipeline(storage, ledger, warehouse)
    batch = {"Records": [
        {"messageId": "good", "body": envelope()},
        {"messageId": "bad", "body": "not json"},
    ]}
    assert sqs_handler(batch, pipe) == {"batchItemFailures": [{"itemIdentifier": "bad"}]}
    assert len(warehouse.calls) == 1


def test_sqs_retry_of_completed_notification_is_safe():
    storage, ledger, warehouse = LocalStorage(generate_data(1)), LocalLedger(), LocalWarehouse()
    pipe = Pipeline(storage, ledger, warehouse)
    batch = {"Records": [{"messageId": "m1", "body": envelope()}]}
    assert sqs_handler(batch, pipe) == {"batchItemFailures": []}
    assert sqs_handler(batch, pipe) == {"batchItemFailures": []}
    assert len(warehouse.calls) == 1

"""End-to-end ingestion with a real local SQL engine and no cloud dependencies."""

from health_ingest.demo import LocalLedger, LocalStorage, SqliteWarehouse, generate_data
from health_ingest.events import ObjectEvent
from health_ingest.pipeline import Pipeline


def event(version):
    return ObjectEvent("demo-bucket", "incoming/demo-clinic/sample.csv", version, "etag", "demo-clinic")


def test_end_to_end_upsert_and_replay():
    storage, ledger = LocalStorage(generate_data(10)), LocalLedger()
    warehouse = SqliteWarehouse(storage)
    pipeline = Pipeline(storage, ledger, warehouse)

    assert pipeline.ingest(event("v1")).rows == 10
    assert pipeline.ingest(event("v1")).status == "ALREADY_PROCESSED"
    assert warehouse.count() == 10

    # A new version of the same source object can contain a higher revision.
    content = storage.content.decode().replace("125.00", "125.10")
    content = content.replace(",1\n", ",2\n")
    storage.content = content.encode()
    pipeline.ingest(event("v2"))
    assert warehouse.count() == 10

    # The older revision must not overwrite the newest value.
    storage.content = generate_data(10)
    pipeline.ingest(event("v3"))
    assert warehouse.count() == 10
    assert warehouse.conn.execute("SELECT MIN(revision) FROM utilization_events").fetchone()[0] == 2


def test_tenants_cannot_collide_on_record_id():
    tenant_one = LocalStorage(generate_data(2, tenant="tenant-one"))
    ledger = LocalLedger()
    warehouse = SqliteWarehouse(tenant_one)
    Pipeline(tenant_one, ledger, warehouse).ingest(
        ObjectEvent("demo-bucket", "incoming/tenant-one/a.csv", "v1", None, "tenant-one")
    )
    tenant_one.content = generate_data(2, tenant="tenant-two")
    Pipeline(tenant_one, ledger, warehouse).ingest(
        ObjectEvent("demo-bucket", "incoming/tenant-two/b.csv", "v1", None, "tenant-two")
    )
    assert warehouse.count() == 4

import pytest

from health_ingest.demo import generate_data
from health_ingest.domain import InvalidBatch, normalize_csv

HEADER = b"tenant_id,record_id,service_date,service_code,units,amount_usd,revision\n"


def row(record="A-1", tenant="demo-clinic", revision="1", amount="19.99", units="2"):
    return f"{tenant},{record},2025-03-04,LAB,{units},{amount},{revision}\n".encode()


def test_normalizes_valid_batch_and_preserves_decimals():
    result, count = normalize_csv(HEADER + row(), "demo-clinic")
    assert count == 1
    assert b"19.99" in result
    assert result.startswith(HEADER)


def test_latest_revision_wins_regardless_of_order():
    result, count = normalize_csv(HEADER + row(revision="3", amount="33.10") + row(), "demo-clinic")
    assert count == 1
    assert b"33.10,3" in result
    assert b"19.99,1" not in result


def test_conflicting_equal_revision_is_rejected_atomically():
    with pytest.raises(InvalidBatch, match="conflicting revision"):
        normalize_csv(HEADER + row() + row(amount="20.01"), "demo-clinic")


@pytest.mark.parametrize("payload,reason", [
    (HEADER + row(tenant="other-tenant"), "Tenant mismatch"),
    (HEADER + row(units="-1"), "units"),
    (HEADER + row(amount="NaN"), "Amount"),
    (HEADER + row(amount="1.234"), "decimal places"),
    (HEADER + row(amount="10000001"), "Amount"),
    (HEADER + row(record="bad value"), "record"),
    (HEADER + row(revision="0"), "revision"),
    (HEADER + b"", "no records"),
    (b"tenant_id,record_id\nfoo,bar", "header"),
    (HEADER + row() + b"x,y\n", "field count"),
    (b"\xff\xfe", "UTF-8"),
])
def test_rejects_invalid_batches(payload, reason):
    with pytest.raises(InvalidBatch, match=reason):
        normalize_csv(payload, "demo-clinic")


def test_generated_data_is_repeatable_and_safe():
    original = generate_data(25)
    assert original == generate_data(25)
    normalized, count = normalize_csv(original, "demo-clinic")
    assert count == 25
    assert b"patient" not in normalized.lower()


def test_size_limit_is_enforced():
    from health_ingest.domain import MAX_BYTES
    with pytest.raises(InvalidBatch, match="5 MiB"):
        normalize_csv(b"x" * (MAX_BYTES + 1), "demo-clinic")

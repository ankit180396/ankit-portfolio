"""Exercise conditional lease transitions without needing DynamoDB credentials."""

from types import SimpleNamespace

import pytest

from health_ingest.aws_adapters import DynamoLedger


class ConditionalFailed(Exception):
    pass


class FakeTable:
    def __init__(self):
        self.meta = SimpleNamespace(client=SimpleNamespace(
            exceptions=SimpleNamespace(ConditionalCheckFailedException=ConditionalFailed)
        ))
        self.items = {}

    def put_item(self, Item, ConditionExpression):
        if Item["pk"] in self.items:
            raise ConditionalFailed()
        self.items[Item["pk"]] = dict(Item)

    def get_item(self, Key, ConsistentRead):
        return {"Item": dict(self.items[Key["pk"]])}

    def update_item(self, Key, UpdateExpression, ConditionExpression,
                    ExpressionAttributeNames, ExpressionAttributeValues):
        values = ExpressionAttributeValues
        item = self.items[Key["pk"]]
        if ":now" in values:
            if item["state"] != "PROCESSING" or item["lease_until"] >= values[":now"]:
                raise ConditionalFailed()
            item.update(lease_until=values[":deadline"], token=values[":token"])
        else:
            if item["state"] != "PROCESSING" or item["token"] != values[":token"]:
                raise ConditionalFailed()
            item.update(state=values[":status"], row_count=values[":rows"])
            item.pop("lease_until", None)


def test_duplicate_acquisition_does_not_get_two_active_leases():
    table = FakeTable()
    ledger = DynamoLedger(table)
    assert ledger.acquire("object-1", "tenant-a", "owner-a") == "ACQUIRED"
    assert ledger.acquire("object-1", "tenant-a", "owner-b") == "BUSY"
    ledger.finish("object-1", "owner-a", "COMPLETED", 10)
    assert ledger.acquire("object-1", "tenant-a", "owner-b") == "DONE"


def test_expired_lease_can_be_reclaimed_but_old_owner_is_fenced_out():
    table = FakeTable()
    ledger = DynamoLedger(table)
    ledger.acquire("object-1", "tenant-a", "old")
    table.items["object-1"]["lease_until"] = 0
    assert ledger.acquire("object-1", "tenant-a", "new") == "ACQUIRED"
    with pytest.raises(ConditionalFailed):
        ledger.finish("object-1", "old", "COMPLETED", 1)
    ledger.finish("object-1", "new", "COMPLETED", 2)
    assert table.items["object-1"]["row_count"] == 2

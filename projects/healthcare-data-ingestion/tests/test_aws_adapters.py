from io import BytesIO
from unittest.mock import Mock, call, patch

import pytest

from health_ingest.aws_adapters import RedshiftWarehouse, S3Storage
from health_ingest.events import ObjectEvent


def object_event():
    return ObjectEvent("raw", "incoming/demo-clinic/daily.csv", "v1", "etag", "demo-clinic")


def test_s3_reads_an_exact_version_and_writes_encrypted_curated_data():
    s3 = Mock()
    s3.get_object.return_value = {"ContentLength": 3, "Body": BytesIO(b"abc")}
    storage = S3Storage(s3, "raw", "curated")
    assert storage.read(object_event()) == b"abc"
    s3.get_object.assert_called_once_with(Bucket="raw", Key="incoming/demo-clinic/daily.csv", VersionId="v1")
    assert storage.write_curated("curated/demo-clinic/s.csv", b"abc") == "s3://curated/curated/demo-clinic/s.csv"
    assert s3.put_object.call_args.kwargs["ServerSideEncryption"] == "AES256"


def test_cross_bucket_notifications_are_not_read():
    with pytest.raises(ValueError, match="not authorized"):
        S3Storage(Mock(), "other", "curated").read(object_event())


def test_redshift_builds_transactional_copy_and_merge_and_polls():
    client = Mock()
    client.batch_execute_statement.return_value = {"Id": "statement-1"}
    client.describe_statement.side_effect = [{"Status": "STARTED"}, {"Status": "FINISHED"}]
    warehouse = RedshiftWarehouse(client, "wg", "analytics", "secret", "arn:aws:iam::123456789012:role/copy")
    with patch("health_ingest.aws_adapters.time.sleep"):
        warehouse.merge(f"s3://curated/curated/demo-clinic/{'a' * 64}.csv", "event-1")
    sqls = client.batch_execute_statement.call_args.kwargs["Sqls"]
    assert "CREATE TEMP TABLE" in sqls[0]
    assert "COPY stage_utilization" in sqls[1]
    assert "MERGE INTO" in sqls[2]
    assert "CASE WHEN src.revision >= public.utilization_events.revision" in sqls[2]
    assert client.describe_statement.call_count == 2


def test_redshift_failure_bubbles_to_queue_retry():
    client = Mock()
    client.batch_execute_statement.return_value = {"Id": "statement-1"}
    client.describe_statement.return_value = {"Status": "FAILED"}
    warehouse = RedshiftWarehouse(client, "wg", "analytics", "secret", "role")
    with pytest.raises(RuntimeError, match="FAILED"):
        warehouse.merge(f"s3://curated/curated/demo-clinic/{'a'*64}.csv", "event-1")


def test_redshift_rejects_unsafe_curated_uri():
    with pytest.raises(ValueError, match="URI"):
        RedshiftWarehouse(Mock(), "wg", "analytics", "secret", "role").merge("s3://a/x';drop table a", "event")

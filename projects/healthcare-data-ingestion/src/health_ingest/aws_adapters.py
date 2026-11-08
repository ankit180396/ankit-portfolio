"""AWS adapters. Credentials are resolved using the standard SDK provider chain."""

from __future__ import annotations

import hashlib
import json
import re
import time
from datetime import datetime, timezone

from health_ingest.events import ObjectEvent


def _sql_literal(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


class S3Storage:
    def __init__(self, s3, raw_bucket: str, output_bucket: str):
        self.s3 = s3
        self.raw_bucket = raw_bucket
        self.output_bucket = output_bucket

    def read(self, event: ObjectEvent) -> bytes:
        if event.bucket != self.raw_bucket:
            raise ValueError("Notification bucket is not authorized")
        args = {"Bucket": event.bucket, "Key": event.key}
        if event.version:
            args["VersionId"] = event.version
        obj = self.s3.get_object(**args)
        # Read a bounded amount; do not download unexpectedly large objects into memory.
        from health_ingest.domain import MAX_BYTES, InvalidBatch

        if obj.get("ContentLength", 0) > MAX_BYTES:
            raise InvalidBatch("File exceeds 5 MiB")
        content = obj["Body"].read(MAX_BYTES + 1)
        return content

    def write_curated(self, key: str, data: bytes) -> str:
        self.s3.put_object(
            Bucket=self.output_bucket, Key=key, Body=data, ContentType="text/csv",
            ServerSideEncryption="AES256",
        )
        return f"s3://{self.output_bucket}/{key}"

    def quarantine(self, event: ObjectEvent, reason: str) -> None:
        payload = {
            "source_bucket": event.bucket,
            "source_key": event.key,
            "source_version": event.version,
            "error": reason[:240],
            "event_id": event.identity,
        }
        self.s3.put_object(
            Bucket=self.output_bucket, Key=f"quarantine/{event.tenant}/{event.identity}.json",
            Body=json.dumps(payload, sort_keys=True).encode(), ContentType="application/json",
            ServerSideEncryption="AES256",
        )


class DynamoLedger:
    """Conditional lease acquisition prevents simultaneous processing of one object.

    The lease exceeds the Lambda runtime. An expired lease can be reclaimed after a
    crash; the Redshift operation remains re-runnable using stable object keys.
    """

    def __init__(self, table, lease_seconds: int = 1200):
        self.table = table
        self.lease_seconds = lease_seconds

    def acquire(self, event_id: str, tenant: str, token: str) -> str:
        now = int(time.time())
        try:
            self.table.put_item(
                Item={
                    "pk": event_id, "tenant": tenant, "state": "PROCESSING",
                    "lease_until": now + self.lease_seconds, "token": token,
                    "expires_at": now + 30 * 86400,
                },
                ConditionExpression="attribute_not_exists(pk)",
            )
            return "ACQUIRED"
        except self.table.meta.client.exceptions.ConditionalCheckFailedException:
            pass
        current = self.table.get_item(Key={"pk": event_id}, ConsistentRead=True).get("Item", {})
        if current.get("state") in {"COMPLETED", "REJECTED"}:
            return "DONE"
        try:
            self.table.update_item(
                Key={"pk": event_id},
                UpdateExpression="SET lease_until = :deadline, #s = :working, #t = :token",
                ConditionExpression="#s = :working AND lease_until < :now",
                ExpressionAttributeNames={"#s": "state", "#t": "token"},
                ExpressionAttributeValues={
                    ":deadline": now + self.lease_seconds, ":working": "PROCESSING",
                    ":token": token, ":now": now,
                },
            )
            return "ACQUIRED"
        except self.table.meta.client.exceptions.ConditionalCheckFailedException:
            return "BUSY"

    def finish(self, event_id: str, token: str, status: str, rows: int) -> None:
        self.table.update_item(
            Key={"pk": event_id},
            UpdateExpression="SET #s = :status, row_count = :rows, finished_at = :finished REMOVE lease_until",
            ConditionExpression="#s = :working AND #t = :token",
            ExpressionAttributeNames={"#s": "state", "#t": "token"},
            ExpressionAttributeValues={
                ":status": status, ":rows": rows, ":working": "PROCESSING",
                ":token": token, ":finished": datetime.now(timezone.utc).isoformat(),
            },
        )


class RedshiftWarehouse:
    def __init__(self, client, workgroup: str, database: str, secret_arn: str,
                 copy_role_arn: str, polling_seconds: int = 420):
        self.client = client
        self.workgroup = workgroup
        self.database = database
        self.secret_arn = secret_arn
        self.copy_role_arn = copy_role_arn
        self.polling_seconds = polling_seconds

    def merge(self, csv_uri: str, event_id: str) -> None:
        if not re.fullmatch(r"s3://[a-zA-Z0-9.\-_]+/curated/[a-z0-9-]+/[0-9a-f]{64}\.csv", csv_uri):
            raise ValueError("Unexpected curated object URI")
        stage = "stage_utilization"  # isolated temporary table for this SQL session
        copy = (f"COPY {stage} (tenant_id,record_id,service_date,service_code,units,amount_usd,revision) "
                f"FROM {_sql_literal(csv_uri)} IAM_ROLE {_sql_literal(self.copy_role_arn)} "
                "CSV IGNOREHEADER 1 DATEFORMAT 'auto' ACCEPTINVCHARS")
        columns = ("service_date", "service_code", "units", "amount_usd", "revision")
        changes = ", ".join(
            f"{col} = CASE WHEN src.revision >= public.utilization_events.revision THEN src.{col} ELSE public.utilization_events.{col} END"
            for col in columns
        )
        names = "tenant_id, record_id, service_date, service_code, units, amount_usd, revision"
        values = ", ".join(f"src.{col}" for col in names.split(", "))
        merge = (
            "MERGE INTO public.utilization_events USING stage_utilization AS src "
            "ON public.utilization_events.tenant_id = src.tenant_id AND public.utilization_events.record_id = src.record_id "
            f"WHEN MATCHED THEN UPDATE SET {changes} "
            f"WHEN NOT MATCHED THEN INSERT ({names}) VALUES ({values})"
        )
        statement = self.client.batch_execute_statement(
            WorkgroupName=self.workgroup, Database=self.database, SecretArn=self.secret_arn,
            ClientToken=hashlib.sha256(event_id.encode()).hexdigest()[:64],
            StatementName=f"utilization-{event_id[:16]}",
            Sqls=[f"CREATE TEMP TABLE {stage} (LIKE public.utilization_events)", copy, merge],
        )
        statement_id = statement["Id"]
        deadline = time.monotonic() + self.polling_seconds
        while time.monotonic() < deadline:
            details = self.client.describe_statement(Id=statement_id)
            state = details["Status"]
            if state == "FINISHED":
                return
            if state in {"FAILED", "ABORTED"}:
                # Avoid including raw SQL or file contents in logs.
                raise RuntimeError(f"Redshift operation {statement_id} ended with {state}")
            time.sleep(2)
        raise TimeoutError(f"Redshift statement {statement_id} exceeded polling budget")

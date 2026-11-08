# Operations runbook

## Deployment prerequisites

- Dedicated AWS account or sandbox; AWS SAM CLI; Python 3.12 toolchain.
- Existing Redshift Serverless workgroup, credential secret, database schema, and external `COPY` role with read access to the curated bucket.
- A reviewed CloudFormation change set and agreed alert destination. CloudWatch alarm is created but no notification subscription is configured.
- Inputs contain only synthetic or approved non-personal operational data.

## Pre-release checks

1. Run `python -m pytest -q` from the project root.
2. Run `python -m health_ingest.demo --rows 1000` and check the replay reports no second merge.
3. Validate template with `sam validate --template-file infra/template.yaml --lint` when SAM/cfn-lint are installed.
4. Apply the warehouse schema and verify the loader has Redshift Data API permissions and the warehouse `COPY` role can read the output bucket.
5. Deploy to sandbox. Upload a single known CSV and verify the exact row count, high-revision behavior, and no duplicate on redelivery.

## Triage a failed batch

1. Identify affected tenant, object key, and S3 version, without dumping record contents into tickets or logs.
2. Inspect the DynamoDB event key and state. `REJECTED` means the error manifest under `quarantine/` should explain a permanent data-contract violation.
3. For `PROCESSING`, check the lease timestamp, Lambda invocation outcome, Redshift statement status, and whether the SQS message is still invisible.
4. For `FAILED`/`ABORTED` warehouse statements, inspect sanitized Redshift diagnostic detail and the IAM `COPY` role. Check table schema compatibility, credentials, and cluster availability.
5. For repeated transient errors, inspect DLQ depth and oldest message age. After the root cause is fixed, redrive messages using AWS tooling and verify the resulting records before closing the incident.

## Replay principles

- Do not delete completed ledger entries to force replay without understanding the original transaction.
- A source correction should use a new S3 object version and an incremented business-record `revision`.
- Preserve the original event envelope for investigation; never copy sensitive values into public support artifacts.
- Review failed partial batch records individually; do not bulk-resubmit unrelated successful events.

## Rollback

CloudFormation rollback reverts infrastructure configuration but does not reverse data already merged into Redshift or erase S3 objects. Stop new ingestion by disabling the event source mapping, correct the application or schema, then resume and replay. Data repair requires separately reviewed SQL with a snapshot or backup.

# Healthcare Utilization Data Platform

A small, production-oriented ingestion service for multi-tenant operational utilization data. It accepts CSV objects, validates the complete batch, resolves record revisions, and loads a reporting table through an event-driven AWS workflow.

The example domain is intentionally narrow: **fictional operational events, no patients, no identifiers tied to individuals, and no confidential source data**. The repository includes a deterministic data generator and a runnable local mode. The AWS adapters and deployment template are included, but an AWS deployment and live Redshift execution have not been verified.

## Architecture

```text
S3 /incoming/<tenant>/*.csv
             |
       ObjectCreated
             v
     SQS standard queue --------> dead-letter queue / CloudWatch alarm
             |
             v
        Lambda (Python)
             |----------------> DynamoDB processing lease + final state
             |----------------> validation / revision deduplication
             |----------------> S3 /quarantine (bad batches)
             v
      S3 /curated (canonical CSV)
             |
             v
     Redshift Data API
       CREATE TEMP TABLE
       COPY from S3
       MERGE by tenant + record id
             |
             v
     Reporting fact table
```

**Why this shape:** SQS absorbs bursts and redeliveries; DynamoDB conditional writes prevent simultaneous work on the same object; validated files are deterministic for safe replay; Redshift staging and `MERGE` handle updates instead of append-only inserts. Invalid batches are quarantined as a unit to avoid silently incomplete reports. Real infrastructure requires existing Redshift Serverless resources and a warehouse `COPY` role.

## Run locally

Python 3.11+ is required. No AWS account is needed for the demo.

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -e '.[dev]'
python -m health_ingest.demo --rows 100 --output /tmp/utilization.csv
python -m pytest -q
```

On Windows, activate `.venv\Scripts\activate`. The demo generates 100 fictional rows, processes them, submits the same notification again, and reports that the second delivery did not repeat the merge. `examples/valid.csv` illustrates higher-revision updates within one batch.

## Input contract

Each uploaded object is placed at `incoming/<tenant-id>/<filename>.csv` in the raw bucket. UTF-8 CSV fields must appear in this order:

| Field | Rule |
| --- | --- |
| `tenant_id` | Lowercase slug; must equal tenant segment of object key |
| `record_id` | Stable, non-person identifier used for upsert |
| `service_date` | ISO date from year 2000 through today |
| `service_code` | Uppercase alphanumeric operational category |
| `units` | Integer from 1 to 10,000 |
| `amount_usd` | Nonnegative decimal, at most two fractional digits |
| `revision` | Positive integer; larger value supersedes an earlier one |

Maximum object size: 5 MiB. Maximum rows per batch: 10,000. A batch with inconsistent headers, tenant mismatch, invalid records, or two conflicting values at the same revision is rejected entirely. Identical rows at the same revision are harmless. Multiple revisions for one record within a file resolve to the highest revision before loading.

## AWS deployment outline

1. Provision or select a Redshift Serverless workgroup, its database credential in Secrets Manager, and an IAM role that permits Redshift `COPY` to read the output bucket. **These resources are not created here.**
2. Execute `sql/001_schema.sql` against that database. Ensure the warehouse role has the required `SELECT`, `INSERT`, and `UPDATE` permissions.
3. Build and deploy the infrastructure using AWS SAM, providing the external workgroup, database, secret ARN, and `COPY` role ARN.
4. Upload an input CSV to `s3://<raw-bucket>/incoming/demo-clinic/sample.csv` and inspect the DynamoDB job record, curated object, CloudWatch logs, and Redshift table.

```bash
sam build --template-file infra/template.yaml
sam deploy --guided --template-file infra/template.yaml
```

SAM creates the raw/curated S3 buckets, SQS queue and dead-letter queue, Lambda, DynamoDB table, and a CloudWatch alarm. Real cloud execution incurs AWS charges. Use a dedicated sandbox account and carefully review the stack, IAM permissions, names, and costs first. The IAM grants in the template should be further scoped to your deployed Redshift resources before a regulated production rollout.

## Reliability and verification

- S3/SQS are at-least-once transports. No exactly-once delivery claim is made.
- Per-object identity combines bucket, key, version, and ETag. A conditional lease serializes concurrent attempts; successful replays are skipped.
- The canonical S3 output key and Redshift `MERGE` make interrupted loads safely repeatable. A higher revision wins over an older revision.
- The Redshift Data API executes the temporary-table, `COPY`, and `MERGE` statements in a single transaction and is polled for final status.
- SQS partial failure responses isolate unsuccessful messages. Repeated failures enter a dead-letter queue for investigation.
- Tests cover data contracts, tenant isolation, duplicate/revision behavior, failure paths, event decoding, and SQL generation. Unit tests run without AWS services.

## Repository layout

```text
src/health_ingest/   Core validation, pipeline, AWS adapters, Lambda entry, demo
infra/template.yaml  AWS SAM infrastructure
sql/001_schema.sql   Redshift reporting table
examples/            Small fictional sample
scripts/             Local verification helpers
tests/               Repeatable unit and integration-style tests
docs/                Architecture decisions, operations, security boundaries
```

See [architecture and tradeoffs](docs/architecture.md), [operations runbook](docs/runbook.md), and [security boundaries](docs/security.md). The project is a reference implementation rather than a claim of deployed operational metrics.

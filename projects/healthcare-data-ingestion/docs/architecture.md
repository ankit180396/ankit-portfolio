# Architecture and engineering decisions

## Problem

Operational reporting workloads often arrive as uneven batches. Upload notifications may be duplicated, source rows may be reissued with new revisions, and a long-running warehouse load can fail after staging. A naïve `INSERT` pipeline makes duplicate records and partial reports likely. This implementation separates transport, validation, concurrency control, and warehouse loading into independently testable components.

## Data and system boundaries

- **Producer:** uploads a UTF-8 CSV under an explicitly scoped tenant prefix.
- **Ingestion boundary:** S3 invokes the queue, not Lambda directly. Queue redrives and throttling protect against bursts.
- **Validation:** an entire batch must satisfy an exact schema. Unexpected columns are rejected; no sensitive personal fields belong here.
- **Idempotency:** DynamoDB conditionally establishes a processing lease keyed by source object identity. Reprocessing a completed object returns without loading it again. The lease duration exceeds the Lambda timeout.
- **Curated storage:** canonical CSV with a deterministic object key. Revisions within one upload are collapsed to one row per record ID.
- **Warehouse:** Redshift Data API submits a transactional `CREATE TEMP TABLE` → `COPY` → `MERGE` sequence. This makes the load re-runnable after a crash between warehouse commit and DynamoDB completion.

## Failure modes and recovery

| Failure | Behavior | Recovery |
| --- | --- | --- |
| Malformed CSV or cross-tenant row | No warehouse write; event marked `REJECTED`; error manifest saved | Producer uploads corrected object |
| Transient S3, DynamoDB, or Redshift issue | Handler marks SQS message failed | SQS retries after visibility timeout |
| Simultaneous duplicate notification | Second worker gets a busy lease | Retry after the active worker finishes or lease expires |
| Worker dies after warehouse commit | DynamoDB remains `PROCESSING` | Retry reuses client token when possible or safely re-runs `MERGE` |
| Repeated infrastructure failures | SQS redrive policy sends event to DLQ | Operator fixes root cause and replays deliberately |
| Out-of-order record revision | `MERGE` preserves the higher revision | Later valid revision is accepted |

The system offers **idempotent effects under supported assumptions**, not exactly-once transport. Independent object versions can race over a business key. The revision-aware `MERGE` prevents a lower revision from overwriting a higher revision, but shared-key concurrent updates may require serialization or explicit conflict handling at higher load. For large volumes, partitioned queue design or staged bulk jobs would be preferable.

## Why not Pandas or direct inserts?

Streaming CSV parsing limits memory relative to whole-file DataFrames for a small Lambda worker and keeps validation rules visible. Per-batch row count is bounded, and warehouse loading uses S3 `COPY` rather than row-by-row SQL calls. Redshift uniqueness constraints are informational; deduplication has to be enforced in the data path, not assumed from a primary-key declaration.

## Observability

Log object IDs, record counts, elapsed duration, and error classes; avoid logging record values. Watch SQS oldest-message age, DLQ depth, Lambda errors/duration, Redshift statement failures/queueing, and DynamoDB conditional-write pressure. Alert thresholds must be calibrated after load testing.

## Known limitations and next steps

- The AWS stack and Redshift SQL have not been integration-tested against an AWS account in this repository. Test in a sandbox before production claims.
- A worker synchronously waits for Redshift Data API completion. For lengthy loads, prefer separate submit and completion handlers using EventBridge or Step Functions rather than increasing Lambda duration.
- The 5 MiB / 10,000-row limits are deliberate. Larger files should move to chunked/Spark or Glue batch processing, with object-level reconciliations.
- Warehouse reconciliation of existing duplicate target rows and cross-batch revisions should run as a separate controlled maintenance operation.
- S3 server-side encryption and private buckets are baseline safeguards, not a complete regulated-data security program. Use KMS, IAM boundaries, organization policies, private endpoints, audit trails, data classification, and retention approvals as appropriate.
- Report queries should be measured with `EXPLAIN` and query plans on representative data before selecting final `DISTKEY`/`SORTKEY` values.

# Security and data-use boundaries

This repository uses generated **fictional operational utilization records**. The fixture contains no person, patient, diagnosis, birthdate, address, or other private identifier. It is not a clinical record model and should not be treated as one.

## Controls in the sample

- Input schema is a fixed allowlist. Extra columns are rejected rather than ignored.
- Tenant slug in every record must match the S3 path tenant. Event notifications must originate from the configured raw bucket.
- Processing state is separated by an object-specific digest. Curated output is placed under a scoped tenant prefix.
- Source S3 bucket is private and versioned. Buckets use server-side encryption and block public access.
- The event queue uses SQS-managed encryption; DynamoDB uses encryption at rest.
- Warehouse rows carry a tenant key. Analytics consumers **must enforce tenant-filtered authorization** independently; a row column alone is not access control.
- No AWS credential, key, record payload, or account-specific secret is committed.

## Before use with real regulated data

This is not a HIPAA certification, compliance assessment, or ready-made production environment. Verify legal and contractual basis, approved service configuration, data classification, encryption-key ownership, access auditability, security monitoring, retention/deletion rules, identity and authorization, incident response, and applicable agreements. Use network isolation and scoped IAM policies, including resource-restricted Redshift Data API access where supported. Prevent arbitrary user-controlled bucket names, paths, and SQL fragments from reaching warehouse commands.

Synthetic operational data is sufficient to demonstrate the code and failure-handling behavior without exposing employer information.

"""AWS Lambda entry point for SQS notifications."""

from __future__ import annotations

import logging
import os

import boto3

from health_ingest.aws_adapters import DynamoLedger, RedshiftWarehouse, S3Storage
from health_ingest.pipeline import Pipeline, sqs_handler

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s %(message)s")


def _pipeline() -> Pipeline:
    region = os.getenv("AWS_REGION", "us-east-1")
    session = boto3.Session(region_name=region)
    return Pipeline(
        S3Storage(session.client("s3"), os.environ["RAW_BUCKET"], os.environ["OUTPUT_BUCKET"]),
        DynamoLedger(session.resource("dynamodb").Table(os.environ["LEDGER_TABLE"])),
        RedshiftWarehouse(
            session.client("redshift-data"), os.environ["REDSHIFT_WORKGROUP"],
            os.environ["REDSHIFT_DATABASE"], os.environ["REDSHIFT_SECRET_ARN"],
            os.environ["REDSHIFT_COPY_ROLE_ARN"],
        ),
    )


_service = None


def lambda_handler(event, context):
    global _service
    if _service is None:
        _service = _pipeline()
    return sqs_handler(event, _service)

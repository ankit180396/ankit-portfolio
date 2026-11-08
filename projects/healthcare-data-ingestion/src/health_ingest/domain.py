"""Pure transformation and validation logic; no cloud dependencies."""

from __future__ import annotations

import csv
import io
import re
from dataclasses import dataclass
from datetime import date
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP

FIELDS = (
    "tenant_id", "record_id", "service_date", "service_code",
    "units", "amount_usd", "revision",
)
TENANT_PATTERN = re.compile(r"[a-z0-9][a-z0-9-]{1,31}\Z")
RECORD_PATTERN = re.compile(r"[A-Za-z0-9][A-Za-z0-9_-]{0,63}\Z")
SERVICE_PATTERN = re.compile(r"[A-Z0-9][A-Z0-9_-]{1,19}\Z")
MAX_BYTES = 5 * 1024 * 1024
MAX_ROWS = 10_000


class InvalidBatch(ValueError):
    """A batch is permanently invalid and should be quarantined."""


@dataclass(frozen=True)
class UtilizationRow:
    tenant_id: str
    record_id: str
    service_date: str
    service_code: str
    units: int
    amount_usd: Decimal
    revision: int

    def as_csv(self) -> dict[str, str]:
        return {
            "tenant_id": self.tenant_id,
            "record_id": self.record_id,
            "service_date": self.service_date,
            "service_code": self.service_code,
            "units": str(self.units),
            "amount_usd": f"{self.amount_usd:.2f}",
            "revision": str(self.revision),
        }


def validate_tenant(tenant: str) -> str:
    if not TENANT_PATTERN.fullmatch(tenant):
        raise InvalidBatch("Invalid tenant identifier")
    return tenant


def _bounded_integer(value: str, name: str, minimum: int, maximum: int) -> int:
    if not value or not re.fullmatch(r"[0-9]+", value):
        raise InvalidBatch(f"{name} must be an unsigned integer")
    number = int(value)
    if not minimum <= number <= maximum:
        raise InvalidBatch(f"{name} is outside the permitted range")
    return number


def _parse_row(row: dict[str, str], expected_tenant: str) -> UtilizationRow:
    if row["tenant_id"] != expected_tenant:
        raise InvalidBatch("Tenant mismatch between object key and payload")
    if not RECORD_PATTERN.fullmatch(row["record_id"]):
        raise InvalidBatch("Invalid record identifier")
    if not SERVICE_PATTERN.fullmatch(row["service_code"]):
        raise InvalidBatch("Invalid service code")
    try:
        when = date.fromisoformat(row["service_date"])
    except ValueError as exc:
        raise InvalidBatch("Invalid ISO service date") from exc
    if when.year < 2000 or when > date.today():
        raise InvalidBatch("Service date is out of range")
    units = _bounded_integer(row["units"], "units", 1, 10_000)
    revision = _bounded_integer(row["revision"], "revision", 1, 1_000_000)
    try:
        amount = Decimal(row["amount_usd"])
    except (InvalidOperation, TypeError) as exc:
        raise InvalidBatch("Invalid amount") from exc
    if not amount.is_finite() or amount < 0 or amount > 10_000_000:
        raise InvalidBatch("Amount is out of range")
    if amount.as_tuple().exponent < -2:
        raise InvalidBatch("Amount may have at most two decimal places")
    amount = amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    return UtilizationRow(
        expected_tenant, row["record_id"], when.isoformat(), row["service_code"],
        units, amount, revision,
    )


def normalize_csv(content: bytes, expected_tenant: str) -> tuple[bytes, int]:
    """Validate the whole object and resolve in-file revisions before writing any output.

    Duplicate (tenant_id, record_id) rows retain the highest revision; conflicting
    values at the same revision cause rejection rather than arbitrary selection.
    """
    validate_tenant(expected_tenant)
    if not content or len(content) > MAX_BYTES:
        raise InvalidBatch("File must be nonempty and at most 5 MiB")
    try:
        raw = content.decode("utf-8-sig")
    except UnicodeDecodeError as exc:
        raise InvalidBatch("File must be UTF-8") from exc
    reader = csv.DictReader(io.StringIO(raw, newline=""), strict=True)
    if reader.fieldnames != list(FIELDS):
        raise InvalidBatch("Incorrect CSV header or unexpected columns")
    latest: dict[str, UtilizationRow] = {}
    count = 0
    try:
        for count, row in enumerate(reader, start=1):
            if count > MAX_ROWS:
                raise InvalidBatch("Batch exceeds row limit")
            if None in row or any(value is None for value in row.values()):
                raise InvalidBatch(f"Row {count}: incorrect field count")
            try:
                item = _parse_row(row, expected_tenant)
            except InvalidBatch as exc:
                raise InvalidBatch(f"Row {count}: {exc}") from exc
            previous = latest.get(item.record_id)
            if previous is None or item.revision > previous.revision:
                latest[item.record_id] = item
            elif item.revision == previous.revision and item != previous:
                raise InvalidBatch(f"Row {count}: conflicting revision for record")
    except csv.Error as exc:
        raise InvalidBatch("Malformed CSV syntax") from exc
    if not count:
        raise InvalidBatch("Batch contains no records")
    output = io.StringIO(newline="")
    writer = csv.DictWriter(output, fieldnames=FIELDS, lineterminator="\n")
    writer.writeheader()
    for item in sorted(latest.values(), key=lambda value: value.record_id):
        writer.writerow(item.as_csv())
    return output.getvalue().encode("utf-8"), len(latest)

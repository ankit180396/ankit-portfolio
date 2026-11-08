"""Check the standalone project for accidentally committed sensitive sample content."""

from __future__ import annotations

import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]
EXCLUDE = {".git", ".venv", "__pycache__", ".pytest_cache", ".ruff_cache"}
PATTERNS = {
    "aws_access_key": re.compile(r"AKIA[0-9A-Z]{16}"),
    "private_key": re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
}


def main() -> None:
    problems = []
    for file in ROOT.rglob("*"):
        if not file.is_file() or any(part in EXCLUDE for part in file.relative_to(ROOT).parts):
            continue
        if file.suffix not in {".py", ".yaml", ".yml", ".md", ".sql", ".csv", ".txt", ".toml"}:
            continue
        content = file.read_text(encoding="utf-8", errors="replace")
        for name, pattern in PATTERNS.items():
            if pattern.search(content):
                problems.append(f"{file.relative_to(ROOT)}: {name}")
    if problems:
        raise SystemExit("Potential secret patterns found:\n" + "\n".join(problems))
    print("Project source checks passed")


if __name__ == "__main__":
    main()

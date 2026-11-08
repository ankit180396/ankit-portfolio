.PHONY: install test demo lint
install:
	python -m pip install -e '.[dev]'
test:
	python -m pytest -q
demo:
	python -m health_ingest.demo --rows 100
lint:
	python -m ruff check src tests

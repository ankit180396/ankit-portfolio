-- Deploy once to the selected Redshift Serverless database, before enabling ingestion.
-- Uniqueness is enforced in ingestion and reconciliation code; Redshift primary keys
-- are informational and do not reject duplicates.
CREATE TABLE IF NOT EXISTS public.utilization_events (
    tenant_id VARCHAR(32) NOT NULL,
    record_id VARCHAR(64) NOT NULL,
    service_date DATE NOT NULL,
    service_code VARCHAR(20) NOT NULL,
    units INTEGER NOT NULL,
    amount_usd DECIMAL(14,2) NOT NULL,
    revision INTEGER NOT NULL,
    PRIMARY KEY (tenant_id, record_id)
)
DISTSTYLE AUTO
SORTKEY (tenant_id, service_date);

-- Example report. Tenant filter is mandatory for data isolation.
-- EXPLAIN this query against production-sized data before altering sort keys.
-- SELECT date_trunc('month', service_date) AS month,
--        service_code, sum(units) AS units, sum(amount_usd) AS amount_usd
-- FROM public.utilization_events
-- WHERE tenant_id = :tenant_id AND service_date >= :start_date
-- GROUP BY 1, 2 ORDER BY 1, 2;

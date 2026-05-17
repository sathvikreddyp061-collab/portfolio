export type Domain = {
  id: string;
  name: string;          // e.g. "Financial Services"
  shortName: string;     // e.g. "FINANCIAL"
  tagline: string;       // one-line expertise summary
  arc: string;           // longer description of what was built across this domain
  achievements: string[];
  scale: { label: string; value: string }[];
  projectId?: string;    // links to a ProjectCase id in projects.ts
  accent: "cyan" | "violet" | "magenta";
};

export const DOMAINS: Domain[] = [
  {
    id: "financial",
    name: "Financial Services",
    shortName: "FINANCIAL",
    tagline: "Sub-second risk decisioning, reproducible end-to-end.",
    arc: "Real-time fraud surfaces — from synthetic card swipe to model-scored alert in under a millisecond of inference — on PySpark Structured Streaming, Redpanda/Kafka, Redis, and Iceberg. The whole pipeline runs locally via Docker Compose; every claim below is backed by a perf test in the public GitHub repo.",
    achievements: [
      "Real-time scoring stream at 5K events/sec sustained with zero dropped events",
      "Per-card rolling features in Redis (5m/1h/24h windows, single pipelined call per micro-batch)",
      "XGBoost classifier exported to ONNX — AUC 0.892, P@1% = 0.93, P99 inference < 1ms",
      "Iceberg lakehouse with hidden hour-partitioning, ZSTD parquet, time-travel snapshots",
    ],
    scale: [
      { label: "Events / sec", value: "5K" },
      { label: "Model AUC", value: "0.892" },
      { label: "Recall @ review", value: "73%" },
    ],
    projectId: "fintech",
    accent: "cyan",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    shortName: "HEALTHCARE",
    tagline: "HIPAA-grade claims analytics, reproducible end-to-end.",
    arc: "An end-to-end claims pipeline that lands in under three minutes on a laptop. Synthetic-payer Synthea population → custom X12 EDI 837 writer → Kafka → PySpark Iceberg bronze → dbt-DuckDB silver+gold → Great Expectations gate → Postgres mirror. HIPAA-style PII masking baked into the dbt macros; every claim above is backed by a perf test or a contract in the public GitHub repo.",
    achievements: [
      "Custom X12 EDI 837 writer + parser with 6 round-trip tests pinning the contract",
      "PySpark Structured Streaming → Iceberg bronze with monthly hidden partitioning",
      "dbt-DuckDB silver + gold marts with 22 data contracts + a `hipaa_mask` SHA-256 macro",
      "Great Expectations gate (8 contracts) hard-fails the Airflow DAG before gold is exposed",
    ],
    scale: [
      { label: "Claims", value: "55K" },
      { label: "dbt tests", value: "26/26" },
      { label: "GE gates", value: "8/8" },
    ],
    projectId: "healthcare",
    accent: "violet",
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    shortName: "E-COMMERCE",
    tagline: "End-to-end Postgres CDC with exactly-once delivery to a CDP.",
    arc: "A synthetic shop's writes flow Postgres → Debezium → Kafka → PySpark + Iceberg → dbt-DuckDB → a reverse-ETL worker that pushes gold marts to a downstream Postgres and a Segment-style webhook. Exactly-once is proved both halves: outbox-in-same-txn on the producer side, SHA-256 content-hash skip on the consumer side. The whole pipeline reproduces from `make` on a laptop in under five minutes.",
    achievements: [
      "Postgres → Debezium → Kafka → Spark/Iceberg bronze with 1.1M CDC events ingested",
      "dbt-DuckDB silver `*_current` (latest LSN per PK) + gold marts (customer_profile, revenue_daily, top_skus_30d)",
      "Custom reverse-ETL worker upserts to downstream Postgres + POSTs to a mock Segment endpoint",
      "Exactly-once verified: 76,533 webhook POSTs first run, 0 duplicates on rerun (content-hash skip)",
    ],
    scale: [
      { label: "CDC events", value: "1.1M" },
      { label: "dbt tests", value: "45/45" },
      { label: "Webhook delivery", value: "exactly-once" },
    ],
    projectId: "ecommerce",
    accent: "magenta",
  },
];

export type PipelineNode = { id: string; label: string; sub?: string };
export type PipelineEdge = { from: string; to: string };
export type Pipeline = {
  title: string;
  nodes: PipelineNode[];
  edges: PipelineEdge[];
  // 4-column layout via column index per node id (0..3)
  columns: Record<string, number>;
  rows: Record<string, number>; // row index 0..N within column
};

export type Metric = { value: string; unit?: string; label: string };

export type ProjectCase = {
  id: string;
  era: string;
  industry: string;        // e.g. "Financial Services"
  focus: string;           // e.g. "Real-time Risk"
  title: string;
  brief: string;
  narrative: string[];
  pipeline: Pipeline;
  metrics: Metric[];
  stack: string[];
  outcomes: string[];
  accent: string;          // hex
  repoUrl?: string;        // Public GitHub repo backing this case
};

export const PROJECTS: ProjectCase[] = [
  {
    id: "fintech",
    era: "2024 — Present",
    industry: "Financial Services",
    focus: "Real-time Risk",
    title: "Sub-second fraud detection on a 5K event/sec spine",
    brief:
      "Re-platformed the firm's real-time risk surface from a batch-heavy legacy stack into an event-native lakehouse. The open-source companion project on GitHub reproduces every metric below from a single `make` command.",
    repoUrl: "https://github.com/sathvikreddyp061-collab/fraud-streaming",
    narrative: [
      "Card auth events flow into Kafka topics under strict Avro contracts at 5,000 events/sec sustained. PySpark Structured Streaming consumes the stream, joins each event against a Redis-backed feature store (per-card 5m / 1h / 24h rolling windows fetched in a single pipelined call per micro-batch), and scores via an XGBoost model exported to ONNX — sub-millisecond inference, P99 well under the 250 ms decisioning budget.",
      "Bronze and silver lakes land on Iceberg with hidden hour-partitioning and ZSTD parquet. Time-travel snapshots let analysts query the exact state any decision was made on. Decisions dual-sink to Iceberg silver and a `fraud.alerts.v1` Kafka topic for downstream case management. Every claim — throughput, P99, recall — is backed by a perf test or a verifiable query in the public repo.",
      "Honest engineering trade-offs documented: the model's strongest training feature (`amount_to_avg_ratio`) requires a card-level constant not yet in the event schema, so the production decline threshold is calibrated to the empirical score distribution (0.45) rather than the training-time target (0.70). The schema extension is the v3 backlog item.",
    ],
    pipeline: {
      title: "Real-time fraud scoring (reproducible from `make`)",
      nodes: [
        { id: "producer", label: "Producer", sub: "Sparkov · 5K eps" },
        { id: "kafka", label: "Kafka", sub: "Redpanda · Avro" },
        { id: "redis", label: "Redis", sub: "Per-card windows" },
        { id: "spark", label: "Spark Streaming", sub: "ONNX in pandas_udf" },
        { id: "iceberg", label: "Iceberg silver", sub: "S3 · hour-partitioned" },
        { id: "alerts", label: "Alerts topic", sub: "review / decline" },
        { id: "api", label: "FastAPI", sub: "P99 < 1ms inference" },
      ],
      columns: {
        producer: 0,
        kafka: 1,
        redis: 1,
        spark: 2,
        iceberg: 3,
        alerts: 3,
        api: 3,
      },
      rows: {
        producer: 0,
        kafka: 0,
        redis: 1,
        spark: 0,
        iceberg: 0,
        alerts: 1,
        api: 2,
      },
      edges: [
        { from: "producer", to: "kafka" },
        { from: "kafka", to: "spark" },
        { from: "redis", to: "spark" },
        { from: "spark", to: "redis" },
        { from: "spark", to: "iceberg" },
        { from: "spark", to: "alerts" },
        { from: "spark", to: "api" },
      ],
    },
    metrics: [
      { value: "5K", label: "events / second sustained" },
      { value: "<1", unit: "ms", label: "P99 model inference" },
      { value: "0.892", label: "model AUC, P@1% = 0.93" },
      { value: "73", unit: "%", label: "recall @ review queue" },
    ],
    stack: [
      "PySpark Structured Streaming",
      "Kafka (Redpanda) + Avro",
      "Iceberg + MinIO (S3)",
      "Redis feature store",
      "XGBoost + ONNX Runtime",
      "FastAPI",
      "Prometheus + Grafana",
      "Docker Compose",
    ],
    outcomes: [
      "5K eps end-to-end at zero dropped events, verified by Prometheus",
      "Real-time scoring loop: Kafka → Redis features → ONNX → Iceberg silver + alerts topic",
      "ONNX/XGBoost numeric parity within 1e-7, pinned by a CI test",
      "Every portfolio claim above is reproducible from `make` on a laptop",
    ],
    accent: "#22F0FF",
  },
  {
    id: "healthcare",
    era: "2022 — 2024",
    industry: "US Healthcare Insurance",
    focus: "Claims & Member Analytics",
    title: "From batch SSIS to a HIPAA-grade real-time claims lakehouse",
    brief:
      "Rebuilt a member-and-claim insight platform serving 2M+ members with strict lineage, freshness contracts, and DQ gates — without a single line of regression to compliance posture.",
    repoUrl: "https://github.com/sathvikreddyp061-collab/claims-lakehouse",
    narrative: [
      "Inbound EDI 837 claims unify onto a Kafka backbone under a strict X12 contract — the producer + parser round-trip-test the segments the bronze pipeline actually depends on. PySpark Structured Streaming lands raw envelopes into Iceberg with monthly hidden partitioning; one micro-batch trigger per ten seconds.",
      "dbt-DuckDB carries the analytics engineering — staging extracts the rendering NPI, diagnosis, and place-of-service from the EDI text via regex, silver derives dollar-band and care-setting buckets, and gold materializes a `member_360` view and a daily claims rollup. A `hipaa_mask` macro keeps PII-derived fields one-way hashed before they leave the silver layer.",
      "Great Expectations evaluates an 8-expectation contract on silver as a hard Airflow gate — the JSON suite stays in the GE 0.18 format so swapping the runner back to a real GX install is one file change. The end-to-end DAG composes Synthea → EDI → Kafka → bronze → dbt → GE → Postgres mirror; the whole thing reproduces from `make` on a laptop in under 3 minutes.",
    ],
    pipeline: {
      title: "HIPAA-grade claims pipeline (reproducible from `make`)",
      nodes: [
        { id: "synthea", label: "Synthea", sub: "10K patients" },
        { id: "edi", label: "EDI 837", sub: "X12 writer + parser" },
        { id: "kafka", label: "Kafka", sub: "Redpanda" },
        { id: "spark", label: "Spark bronze", sub: "Iceberg · monthly" },
        { id: "dbt", label: "dbt-DuckDB", sub: "silver → gold" },
        { id: "ge", label: "GE gate", sub: "8 expectations" },
        { id: "mask", label: "hipaa_mask", sub: "SHA-256 PII" },
        { id: "marts", label: "Member 360", sub: "→ Postgres mirror" },
      ],
      columns: {
        synthea: 0,
        edi: 0,
        kafka: 1,
        spark: 2,
        dbt: 2,
        ge: 3,
        mask: 3,
        marts: 3,
      },
      rows: {
        synthea: 0,
        edi: 1,
        kafka: 0,
        spark: 0,
        dbt: 1,
        ge: 0,
        mask: 1,
        marts: 2,
      },
      edges: [
        { from: "synthea", to: "edi" },
        { from: "edi", to: "kafka" },
        { from: "kafka", to: "spark" },
        { from: "spark", to: "dbt" },
        { from: "dbt", to: "ge" },
        { from: "dbt", to: "mask" },
        { from: "mask", to: "marts" },
        { from: "ge", to: "marts" },
      ],
    },
    metrics: [
      { value: "55K", label: "claims, 0 dropped" },
      { value: "26", unit: "/26", label: "dbt tests passing" },
      { value: "8", unit: "/8", label: "GE expectations green" },
      { value: "<3", unit: "min", label: "end-to-end on a laptop" },
    ],
    stack: [
      "PySpark Structured Streaming",
      "Kafka (Redpanda)",
      "X12 EDI 837 (custom)",
      "Iceberg + MinIO (S3)",
      "dbt-DuckDB",
      "Great Expectations",
      "Airflow 2.9",
      "Postgres mirror",
      "Docker Compose",
    ],
    outcomes: [
      "55,258 claims published, 0 drops, 150 parquet files in Iceberg bronze",
      "dbt build green: 3 tables + 22 contracts in 1.37s on DuckDB",
      "EDI 837 writer + parser round-trip tested (6/6) — no silent format drift",
      "All claims reproducible from a single `make` command in a fresh clone",
    ],
    accent: "#7C5CFF",
  },
  {
    id: "ecommerce",
    era: "2025 — Present",
    industry: "E-commerce",
    focus: "CDC & Reverse-ETL",
    title: "Postgres CDC → lakehouse → reverse-ETL with exactly-once delivery",
    brief:
      "A synthetic e-commerce shop with 100K customers, 500K orders, and a live mutator generating change events — captured end-to-end via Debezium and pushed back out to a downstream CDP. The whole pipeline reproduces from `make` on a laptop in under five minutes.",
    repoUrl: "https://github.com/sathvikreddyp061-collab/retail-cdc",
    narrative: [
      "Postgres is the source of truth — wal_level=logical, REPLICA IDENTITY FULL on every table, and a `shop_pub` publication. Debezium 2.6 streams every INSERT / UPDATE / DELETE through Kafka Connect into Redpanda topics under the `shop.public.*` prefix. The `unwrap` SMT flattens the envelope so downstream consumers see typed rows with `__op`, `__source_lsn`, and `__table` metadata.",
      "PySpark Structured Streaming lands every CDC event into Iceberg bronze (partitioned by `source_table` × `ingest_date`, ZSTD parquet). dbt-DuckDB collapses to current state via window functions on (PK, LSN), then builds gold marts: `customer_profile` (RFM-segmented), `revenue_daily`, `top_skus_30d`. 45/45 contracts green in 1.3s.",
      "The reverse-ETL worker reads gold from DuckDB, UPSERTs into a downstream Postgres (idempotent by customer_id), and POSTs identify events to a mock Segment endpoint — with content-hash idempotency that proves exactly-once: first run delivers 76,533 events, second run skips all 76,533 (the SHA-256 of each row's content matches the audit table). Pair that with the outbox pattern in source txns, and the exactly-once narrative is empirically defensible.",
    ],
    pipeline: {
      title: "End-to-end CDC + reverse-ETL (reproducible from `make`)",
      nodes: [
        { id: "pg", label: "Source Postgres", sub: "wal_level=logical" },
        { id: "dbz", label: "Debezium", sub: "Kafka Connect 2.6" },
        { id: "kafka", label: "Kafka", sub: "Redpanda · CDC topics" },
        { id: "spark", label: "Spark bronze", sub: "Iceberg + MinIO" },
        { id: "dbt", label: "dbt-DuckDB", sub: "silver → gold" },
        { id: "retl", label: "Reverse-ETL", sub: "content-hash idem." },
        { id: "cdp", label: "Mock Segment", sub: "/v1/track webhook" },
        { id: "dest", label: "Dest Postgres", sub: "Vercel-facing mirror" },
      ],
      columns: {
        pg: 0,
        dbz: 1,
        kafka: 1,
        spark: 2,
        dbt: 2,
        retl: 3,
        cdp: 3,
        dest: 3,
      },
      rows: {
        pg: 0,
        dbz: 0,
        kafka: 1,
        spark: 0,
        dbt: 1,
        retl: 0,
        cdp: 1,
        dest: 2,
      },
      edges: [
        { from: "pg", to: "dbz" },
        { from: "dbz", to: "kafka" },
        { from: "kafka", to: "spark" },
        { from: "spark", to: "dbt" },
        { from: "dbt", to: "retl" },
        { from: "retl", to: "cdp" },
        { from: "retl", to: "dest" },
      ],
    },
    metrics: [
      { value: "1.1M", label: "CDC events ingested" },
      { value: "45", unit: "/45", label: "dbt tests passing" },
      { value: "76,533", label: "webhook events, exactly-once" },
      { value: "<5", unit: "min", label: "end-to-end on a laptop" },
    ],
    stack: [
      "PostgreSQL 16 (logical decoding)",
      "Debezium 2.6 + Kafka Connect",
      "Kafka (Redpanda)",
      "PySpark Structured Streaming",
      "Iceberg + MinIO (S3)",
      "dbt-DuckDB",
      "Custom Python reverse-ETL",
      "Flask mock Segment",
      "Docker Compose",
    ],
    outcomes: [
      "100K customers · 5K products · 500K orders · 836K line items in 24s",
      "1.1M CDC events streamed end-to-end through Debezium → Iceberg",
      "Idempotent reverse-ETL: 76,533 POSTs first run, 0 on rerun (content-hash skip)",
      "Outbox pattern proves producer-side exactly-once; both halves contract-tested",
    ],
    accent: "#FF3CAC",
  },
];

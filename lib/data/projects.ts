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
    id: "enterprise",
    era: "2020 — 2022",
    industry: "Enterprise Services",
    focus: "Internal Automation",
    title: "Python services + SQL warehouses that quietly ran the business",
    brief:
      "Built the internal data and automation backbone for a fast-growing services firm — Flask APIs, Celery workers, OCR ingestion, and the SQL marts that nine teams ran on every day.",
    narrative: [
      "We started with the unglamorous: a unified PostgreSQL warehouse, 80+ SQL transformations, and reporting marts that the operations team trusted enough to make decisions on. Flask APIs and Celery workers replaced spreadsheets with services that finance, HR, and operations could call.",
      "OCR-based invoice extraction in Python saved roughly 40 hours a month — and pushed me into the practice of treating data quality and human-in-the-loop review as part of the pipeline, not a bolt-on. We shipped the team's first proper CI/CD on GitHub Actions and Docker.",
      "Small team, real impact, and the foundations of an engineering style that I still carry: ship the boring infrastructure first, observability before features, and never let a pipeline fail silently.",
    ],
    pipeline: {
      title: "Internal automation + reporting backbone",
      nodes: [
        { id: "src", label: "Source systems", sub: "ERP · CRM · email" },
        { id: "ocr", label: "OCR ingestion", sub: "Invoices · contracts" },
        { id: "api", label: "Flask APIs", sub: "Internal services" },
        { id: "celery", label: "Celery workers", sub: "Async jobs" },
        { id: "pg", label: "PostgreSQL", sub: "Warehouse" },
        { id: "sql", label: "SQL marts", sub: "80+ transforms" },
        { id: "reports", label: "Ops reports", sub: "Daily · weekly" },
        { id: "ci", label: "CI/CD", sub: "GH Actions · Docker" },
      ],
      columns: {
        src: 0,
        ocr: 0,
        api: 1,
        celery: 1,
        pg: 2,
        sql: 2,
        reports: 3,
        ci: 3,
      },
      rows: {
        src: 0,
        ocr: 1,
        api: 0,
        celery: 1,
        pg: 0,
        sql: 1,
        reports: 0,
        ci: 1,
      },
      edges: [
        { from: "src", to: "api" },
        { from: "ocr", to: "celery" },
        { from: "api", to: "pg" },
        { from: "celery", to: "pg" },
        { from: "pg", to: "sql" },
        { from: "sql", to: "reports" },
        { from: "ci", to: "api" },
      ],
    },
    metrics: [
      { value: "9", label: "teams enabled" },
      { value: "40", unit: "+ hrs/mo", label: "manual work eliminated" },
      { value: "8", label: "internal services" },
      { value: "80", unit: "+", label: "SQL transformations" },
    ],
    stack: [
      "Python",
      "Flask",
      "Celery",
      "PostgreSQL",
      "OCR (Tesseract)",
      "Docker",
      "GitHub Actions",
      "Redis",
    ],
    outcomes: [
      "Cut monthly ops overhead by ~40 hours",
      "Established the team's first observability + CI culture",
      "Built the reporting layer that scaled the business 3×",
    ],
    accent: "#FF3CAC",
  },
];

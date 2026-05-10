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
  industry: string;        // e.g. "Global Investment Bank"
  focus: string;           // e.g. "Real-time Risk"
  title: string;
  brief: string;
  narrative: string[];
  pipeline: Pipeline;
  metrics: Metric[];
  stack: string[];
  outcomes: string[];
  accent: string; // hex
};

export const PROJECTS: ProjectCase[] = [
  {
    id: "barclays",
    era: "2024 — Present",
    industry: "Global Investment Bank",
    focus: "Real-time Risk",
    title: "Sub-second fraud detection on a 2.4M event/sec spine",
    brief:
      "Re-platformed the firm's real-time risk surface from a batch-heavy legacy stack into an event-native lakehouse with embedded AI document understanding.",
    narrative: [
      "Card auth, transfers, and onboarding events flow into MSK Kafka topics under strict Avro contracts. Spark Structured Streaming consumes and enriches against Redis-backed feature stores, then scores transactions using SageMaker-hosted models in under 200 ms end-to-end.",
      "On the side, KYC document onboarding runs through a Bedrock + Titan pipeline — Rekognition for face match, Titan for embedding the policy corpus, and an agent that reasons over the result with permissioned tools. Decisions land back on Kafka so downstream dashboards, audit, and case management see the same source of truth.",
      "Iceberg on S3 became the lakehouse table format — time travel and schema evolution let analysts time-travel back to the exact state any decision was made. Adaptive Query Execution and partition-aware compaction cut nightly Spark cost 38% over six months.",
    ],
    pipeline: {
      title: "Real-time fraud + document understanding",
      nodes: [
        { id: "auth", label: "Card auth", sub: "Edge gateway" },
        { id: "kyc", label: "Onboarding", sub: "Doc + face" },
        { id: "kafka", label: "MSK Kafka", sub: "Avro · 80 topics" },
        { id: "spark", label: "Spark Streaming", sub: "Enrich + score" },
        { id: "bedrock", label: "Bedrock + Titan", sub: "Doc understanding" },
        { id: "feast", label: "Feature store", sub: "Redis · Feast" },
        { id: "iceberg", label: "Iceberg lake", sub: "S3 · gold" },
        { id: "redshift", label: "Redshift", sub: "Risk marts" },
        { id: "alerts", label: "Alerts + cases", sub: "Sub-200ms" },
      ],
      columns: {
        auth: 0,
        kyc: 0,
        kafka: 1,
        spark: 2,
        bedrock: 2,
        feast: 1,
        iceberg: 3,
        redshift: 3,
        alerts: 3,
      },
      rows: {
        auth: 0,
        kyc: 1,
        kafka: 0,
        feast: 1,
        spark: 0,
        bedrock: 1,
        iceberg: 0,
        redshift: 1,
        alerts: 2,
      },
      edges: [
        { from: "auth", to: "kafka" },
        { from: "kyc", to: "kafka" },
        { from: "kafka", to: "spark" },
        { from: "feast", to: "spark" },
        { from: "kafka", to: "bedrock" },
        { from: "spark", to: "iceberg" },
        { from: "spark", to: "redshift" },
        { from: "spark", to: "alerts" },
        { from: "bedrock", to: "alerts" },
        { from: "iceberg", to: "redshift" },
      ],
    },
    metrics: [
      { value: "2.4M", label: "events / second peak" },
      { value: "180", unit: "ms", label: "P99 decision latency" },
      { value: "38", unit: "%", label: "nightly cost reduction" },
      { value: "11", label: "production models" },
    ],
    stack: [
      "Spark Structured Streaming",
      "MSK Kafka",
      "Iceberg",
      "Redshift",
      "SageMaker",
      "Bedrock",
      "Titan",
      "Rekognition",
      "Airflow",
      "Step Functions",
      "Terraform",
    ],
    outcomes: [
      "Fraud false-positive rate down 27% vs. legacy rules engine",
      "Single source of truth for risk, ops, audit, and exec dashboards",
      "Time-travel debugging cut RCA from days to hours",
    ],
    accent: "#22F0FF",
  },
  {
    id: "abcbs",
    era: "2022 — 2024",
    industry: "US Healthcare Insurance",
    focus: "Claims & Member Analytics",
    title: "From batch SSIS to a HIPAA-grade real-time claims lakehouse",
    brief:
      "Rebuilt a member-and-claim insight platform serving 4M+ members with strict lineage, freshness contracts, and DQ gates — without a single line of regression to compliance posture.",
    narrative: [
      "Inbound EDI 837 claims, eligibility files, and member portal events were unified onto a Kafka backbone with Schema Registry. PySpark jobs landed bronze, dbt + Snowflake produced the silver and gold marts, and Great Expectations ran as a hard gate in Airflow before any downstream consumer could read.",
      "We wired a real-time member event stream with Glue Streaming for sub-minute updates to benefit summaries — the highest-impact change for member-portal NPS in two years. Compliance got first-class treatment: row-level masking, lineage in dbt docs, and audit trails in CloudTrail.",
      "240+ DAGs share a small set of reusable Airflow task groups; SLA misses dropped by half in the first quarter. The dbt semantic layer powers 90+ analyst dashboards without analysts having to think about claims joins.",
    ],
    pipeline: {
      title: "HIPAA-grade claims + member analytics",
      nodes: [
        { id: "edi", label: "EDI 837", sub: "Claims feed" },
        { id: "elig", label: "Eligibility", sub: "Daily files" },
        { id: "portal", label: "Member portal", sub: "Events" },
        { id: "kafka", label: "Kafka", sub: "Schema Registry" },
        { id: "glue", label: "Glue Streaming", sub: "Real-time" },
        { id: "spark", label: "PySpark bronze", sub: "Land + validate" },
        { id: "ge", label: "Great Expectations", sub: "DQ gates" },
        { id: "dbt", label: "dbt + Snowflake", sub: "silver → gold" },
        { id: "marts", label: "Member 360 marts", sub: "RLS · masking" },
        { id: "bi", label: "Power BI · Tableau", sub: "90+ dashboards" },
      ],
      columns: {
        edi: 0,
        elig: 0,
        portal: 0,
        kafka: 1,
        glue: 1,
        spark: 2,
        ge: 2,
        dbt: 2,
        marts: 3,
        bi: 3,
      },
      rows: {
        edi: 0,
        elig: 1,
        portal: 2,
        kafka: 0,
        glue: 1,
        spark: 0,
        ge: 1,
        dbt: 2,
        marts: 0,
        bi: 1,
      },
      edges: [
        { from: "edi", to: "kafka" },
        { from: "elig", to: "kafka" },
        { from: "portal", to: "glue" },
        { from: "kafka", to: "spark" },
        { from: "glue", to: "spark" },
        { from: "spark", to: "ge" },
        { from: "ge", to: "dbt" },
        { from: "dbt", to: "marts" },
        { from: "marts", to: "bi" },
      ],
    },
    metrics: [
      { value: "4M", unit: "+", label: "members served" },
      { value: "1.6M", label: "claims processed daily" },
      { value: "240", unit: "+", label: "Airflow DAGs" },
      { value: "50", unit: "%", label: "fewer SLA misses" },
    ],
    stack: [
      "PySpark",
      "Airflow",
      "Snowflake",
      "dbt",
      "Glue Streaming",
      "Kafka",
      "Great Expectations",
      "Power BI",
      "Tableau",
      "GitHub Actions",
    ],
    outcomes: [
      "Sub-minute member benefit summaries in the portal",
      "Lineage + DQ baked into CI — no silent regressions in 14 months",
      "Analyst self-service unlocked via the dbt semantic layer",
    ],
    accent: "#7C5CFF",
  },
  {
    id: "narvee",
    era: "2020 — 2022",
    industry: "Enterprise Services",
    focus: "Internal Automation",
    title: "Python services + SQL warehouses that quietly ran the business",
    brief:
      "Built the internal data and automation backbone for a fast-growing services firm — Flask APIs, Celery workers, OCR ingestion, and the SQL marts that nine teams ran on every day.",
    narrative: [
      "We started with the unglamorous: a unified PostgreSQL warehouse, 200+ SQL transformations, and reporting marts that the operations team trusted enough to make decisions on. Flask APIs and Celery workers replaced spreadsheets with services that finance, HR, and operations could call.",
      "OCR-based invoice extraction in Python saved roughly 120 hours a month — and pushed me into the practice of treating data quality and human-in-the-loop review as part of the pipeline, not a bolt-on. We shipped the team's first proper CI/CD on GitHub Actions and Docker.",
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
        { id: "sql", label: "SQL marts", sub: "200+ transforms" },
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
      { value: "120", unit: "+ hrs/mo", label: "manual work eliminated" },
      { value: "14", label: "internal services" },
      { value: "200", unit: "+", label: "SQL transformations" },
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
      "Cut monthly ops overhead by ~120 hours",
      "Established the team's first observability + CI culture",
      "Built the reporting layer that scaled the business 3×",
    ],
    accent: "#FF3CAC",
  },
];

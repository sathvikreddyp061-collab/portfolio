export type TechService = {
  id: string;
  name: string;
  glyph: string; // short text glyph rendered as logo placeholder
  blurb: string;
  use: string;
};

export type TechCluster = {
  id: string;
  name: string;
  category: "Cloud" | "Compute" | "Streaming" | "Orchestration" | "Warehouse" | "AI" | "Lang" | "Viz";
  glyph: string;
  color: string; // hex
  tagline: string;
  logo?: string; // path under /public, e.g. "/logos/aws.svg"
  services: TechService[];
};

export const TECH_CLUSTERS: TechCluster[] = [
  {
    id: "aws",
    name: "AWS",
    category: "Cloud",
    glyph: "AWS",
    color: "#FF9900",
    tagline: "Cloud-native data foundations",
    logo: "https://api.iconify.design/logos/aws.svg",
    services: [
      { id: "s3", name: "S3", glyph: "S3", blurb: "Object lake storage", use: "Bronze/silver/gold lake on Iceberg with lifecycle tiering." },
      { id: "glue", name: "Glue", glyph: "GL", blurb: "Serverless ETL", use: "Crawlers + Spark jobs feeding the partitioned curated zone." },
      { id: "athena", name: "Athena", glyph: "AT", blurb: "Federated SQL", use: "Ad-hoc forensics across S3 + Iceberg without moving data." },
      { id: "redshift", name: "Redshift", glyph: "RS", blurb: "MPP warehouse", use: "Risk + finance marts with materialized views & RA3 nodes." },
      { id: "lambda", name: "Lambda", glyph: "λ", blurb: "Event functions", use: "Webhook ingestion, schema validation, alert fan-out." },
      { id: "stepfn", name: "Step Functions", glyph: "SF", blurb: "Workflows", use: "Composing Glue + Lambda + ECS into resilient state machines." },
      { id: "cw", name: "CloudWatch", glyph: "CW", blurb: "Telemetry", use: "Custom metrics on lag, freshness, DAG SLAs." },
      { id: "ct", name: "CloudTrail", glyph: "CT", blurb: "Audit", use: "Compliance audit trail of every privileged data action." },
      { id: "iam", name: "IAM", glyph: "IAM", blurb: "Identity", use: "Least-privilege roles + ABAC on tag-bound data domains." },
      { id: "sage", name: "SageMaker", glyph: "SM", blurb: "ML platform", use: "Training, registry, and batch inference for fraud models." },
      { id: "bedrock", name: "Bedrock", glyph: "BR", blurb: "Foundation models", use: "RAG over knowledge ops; document understanding for KYC." },
      { id: "titan", name: "Titan", glyph: "TI", blurb: "Embeddings + text", use: "Embedding compliance docs into a pgvector store." },
      { id: "rek", name: "Rekognition", glyph: "RK", blurb: "Vision", use: "ID-card OCR & face match for onboarding flows." },
    ],
  },
  {
    id: "spark",
    name: "Apache Spark",
    category: "Compute",
    glyph: "SPK",
    color: "#E25A1C",
    tagline: "Distributed compute at petabyte scale",
    logo: "https://api.iconify.design/logos/apache-spark.svg",
    services: [
      { id: "ss", name: "Structured Streaming", glyph: "SS", blurb: "Micro-batch streams", use: "Sub-second fraud scoring at 2.4M events/s." },
      { id: "ds", name: "Datasets API", glyph: "DS", blurb: "Typed transforms", use: "Strong-typed PySpark transforms across silver layer." },
      { id: "aqe", name: "AQE", glyph: "AQ", blurb: "Adaptive execution", use: "Skew + shuffle adaptation cut nightly cost 38%." },
      { id: "ice", name: "Iceberg", glyph: "IB", blurb: "Open table format", use: "Time travel + schema evolution on the lakehouse." },
      { id: "delta", name: "Delta Lake", glyph: "DL", blurb: "ACID lake", use: "MERGE for slowly-changing dimensions in healthcare claims." },
    ],
  },
  {
    id: "kafka",
    name: "Kafka",
    category: "Streaming",
    glyph: "KFK",
    color: "#22F0FF",
    tagline: "The event spine of the system",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg",
    services: [
      { id: "ks", name: "Kafka Streams", glyph: "KS", blurb: "Stream proc", use: "Stateful enrichment of card auth streams." },
      { id: "sr", name: "Schema Registry", glyph: "SR", blurb: "Avro/Proto", use: "Backward-compatible contracts for 80+ topics." },
      { id: "kc", name: "Kafka Connect", glyph: "KC", blurb: "CDC", use: "Debezium → Postgres CDC into the lake in seconds." },
      { id: "msk", name: "MSK", glyph: "MK", blurb: "Managed Kafka", use: "Multi-AZ MSK clusters with IAM auth." },
    ],
  },
  {
    id: "airflow",
    name: "Airflow",
    category: "Orchestration",
    glyph: "AF",
    color: "#017CEE",
    tagline: "Composing the choreography",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apacheairflow/apacheairflow-original.svg",
    services: [
      { id: "tg", name: "Task Groups", glyph: "TG", blurb: "Modular DAGs", use: "240+ DAGs sharing reusable claims subgraphs." },
      { id: "ds", name: "Datasets", glyph: "DT", blurb: "Data-aware sched", use: "DAGs trigger only when freshness contracts upstream are met." },
      { id: "kp", name: "KubernetesPodOperator", glyph: "KP", blurb: "Per-task isolation", use: "Heavy Spark submissions in ephemeral pods." },
    ],
  },
  {
    id: "databricks",
    name: "Databricks",
    category: "Compute",
    glyph: "DBX",
    color: "#FF3621",
    tagline: "The unified lakehouse runtime",
    logo: "https://api.iconify.design/simple-icons/databricks.svg?color=%23FF3621",
    services: [
      { id: "uc", name: "Unity Catalog", glyph: "UC", blurb: "Governance", use: "Cross-workspace lineage + row-level masking." },
      { id: "dlt", name: "DLT", glyph: "DL", blurb: "Declarative pipelines", use: "Bronze → silver → gold with built-in expectations." },
      { id: "mlf", name: "MLflow", glyph: "MF", blurb: "Model lifecycle", use: "Registry + staging promotion gates for fraud models." },
      { id: "wf", name: "Workflows", glyph: "WF", blurb: "Job orchestration", use: "Multi-task jobs replacing brittle cron pipelines." },
    ],
  },
  {
    id: "dbt",
    name: "dbt",
    category: "Warehouse",
    glyph: "DBT",
    color: "#FF694A",
    tagline: "Analytics engineering as software",
    logo: "https://api.iconify.design/logos/dbt-icon.svg",
    services: [
      { id: "tests", name: "Tests", glyph: "TS", blurb: "Data contracts", use: "Schema + freshness tests block bad merges in CI." },
      { id: "docs", name: "Docs", glyph: "DC", blurb: "Lineage UI", use: "Self-service lineage for 90+ analyst dashboards." },
      { id: "macros", name: "Macros", glyph: "MC", blurb: "DRY SQL", use: "Reusable HIPAA masking macros across marts." },
    ],
  },
  {
    id: "python",
    name: "Python",
    category: "Lang",
    glyph: "PY",
    color: "#3776AB",
    tagline: "Glue, services, and serious data work",
    logo: "https://api.iconify.design/logos/python.svg",
    services: [
      { id: "pandas", name: "Pandas", glyph: "PD", blurb: "DataFrames", use: "Fast prototyping before promoting to PySpark." },
      { id: "fastapi", name: "FastAPI", glyph: "FA", blurb: "APIs", use: "Internal serving layer for model + lookup endpoints." },
      { id: "pydantic", name: "Pydantic", glyph: "PY", blurb: "Schemas", use: "Strict event validation at every ingestion edge." },
      { id: "great", name: "Great Expectations", glyph: "GE", blurb: "DQ", use: "Wired into Airflow + CI to fail loudly, not silently." },
    ],
  },
  {
    id: "sql",
    name: "SQL",
    category: "Lang",
    glyph: "SQL",
    color: "#00758F",
    tagline: "The honest interface to data",
    logo: "https://api.iconify.design/logos/postgresql.svg",
    services: [
      { id: "win", name: "Window Functions", glyph: "WF", blurb: "Set ops", use: "Sessionization + cohorting at the warehouse layer." },
      { id: "ctes", name: "Recursive CTEs", glyph: "CT", blurb: "Graph traversal", use: "Member-claim-provider graph walks." },
      { id: "tuning", name: "Query Tuning", glyph: "QT", blurb: "Plans", use: "Distribution + sort keys for sub-second Redshift queries." },
    ],
  },
  {
    id: "ai",
    name: "AI Stack",
    category: "AI",
    glyph: "AI",
    color: "#7C5CFF",
    tagline: "Embedded intelligence in pipelines",
    logo: "https://api.iconify.design/logos/openai-icon.svg",
    services: [
      { id: "rag", name: "RAG", glyph: "RG", blurb: "Retrieval-augmented", use: "Compliance Q&A grounded in policy corpus." },
      { id: "emb", name: "Embeddings", glyph: "EM", blurb: "Vector search", use: "Titan embeddings into pgvector for semantic lookup." },
      { id: "tools", name: "Tool-using agents", glyph: "TA", blurb: "Function calling", use: "Agents that query warehouses with permissioned tools." },
    ],
  },
  {
    id: "viz",
    name: "Viz & Product",
    category: "Viz",
    glyph: "VZ",
    color: "#22F0FF",
    tagline: "Where signal meets human",
    logo: "https://api.iconify.design/logos/tableau-icon.svg",
    services: [
      { id: "tab", name: "Tableau", glyph: "TB", blurb: "Exec analytics", use: "Risk + ops dashboards over Redshift extracts." },
      { id: "pbi", name: "Power BI", glyph: "PB", blurb: "Enterprise BI", use: "Healthcare member analytics with row-level security." },
      { id: "seg", name: "Segment", glyph: "SG", blurb: "CDP", use: "Unified product event collection with downstream fan-out." },
      { id: "mix", name: "Mixpanel", glyph: "MX", blurb: "Product analytics", use: "Feature adoption funnels for internal tooling." },
    ],
  },
];

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
    tagline: "HIPAA-grade real-time analytics for 2M+ members.",
    arc: "Rebuilt the claims-to-insight pipeline so 2M+ members got accurate, near-real-time benefit views — without sacrificing HIPAA, lineage, or auditability. Lakehouse + dbt semantic layer powering 30+ analyst dashboards downstream.",
    achievements: [
      "Migrated legacy SSIS workloads to PySpark + Airflow, cutting SLA misses 30%",
      "Built dbt + Snowflake semantic layer powering 30+ analyst dashboards",
      "Implemented Great Expectations gates wired into CI for every claims feed",
      "Real-time member event ingestion via Kafka + Glue Streaming",
    ],
    scale: [
      { label: "Members", value: "2M+" },
      { label: "Daily claims", value: "250K" },
      { label: "DAGs", value: "80+" },
    ],
    projectId: "healthcare",
    accent: "violet",
  },
  {
    id: "enterprise",
    name: "Enterprise Services",
    shortName: "ENTERPRISE",
    tagline: "Internal automation and reporting that quietly runs the business.",
    arc: "The kind of plumbing that quietly runs a business — Python services, SQL warehouses, and the automation that lets a five-person team punch above its weight. Observability and CI shipped before features.",
    achievements: [
      "Designed Flask APIs and Celery workers powering internal back-office tools",
      "Authored 80+ SQL transformations + reporting marts on PostgreSQL",
      "Automated invoice extraction with OCR + Python, saving ~40 hrs/month",
      "Set up the team's first CI/CD on GitHub Actions and Docker",
    ],
    scale: [
      { label: "Teams enabled", value: "9" },
      { label: "Hours saved/mo", value: "40+" },
      { label: "Services", value: "8" },
    ],
    projectId: "enterprise",
    accent: "magenta",
  },
];

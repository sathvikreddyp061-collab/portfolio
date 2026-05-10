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
    tagline: "Sub-second risk decisioning at investment-bank scale.",
    arc: "Real-time fraud surfaces — from raw card swipe to model-scored alert in under 200ms — on Spark Structured Streaming, Kafka, and AWS. Embedded foundation models for KYC document understanding feed the same decision plane.",
    achievements: [
      "Streaming fraud detection at 2.4M events/second with sub-second decisioning",
      "Embedded foundation models for KYC document understanding",
      "Cut nightly Spark batch cost 38% via adaptive shuffle and Iceberg compaction",
      "Designed a Redshift + Iceberg lakehouse serving risk, ops, and exec analytics",
    ],
    scale: [
      { label: "Events / sec", value: "2.4M" },
      { label: "Latency P99", value: "180ms" },
      { label: "Models in prod", value: "11" },
    ],
    projectId: "barclays",
    accent: "cyan",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    shortName: "HEALTHCARE",
    tagline: "HIPAA-grade real-time analytics for 4M+ members.",
    arc: "Rebuilt the claims-to-insight pipeline so 4M+ members got accurate, near-real-time benefit views — without sacrificing HIPAA, lineage, or auditability. Lakehouse + dbt semantic layer powering 90+ analyst dashboards downstream.",
    achievements: [
      "Migrated legacy SSIS workloads to PySpark + Airflow, halving SLA misses",
      "Built dbt + Snowflake semantic layer powering 90+ analyst dashboards",
      "Implemented Great Expectations gates wired into CI for every claims feed",
      "Real-time member event ingestion via Kafka + Glue Streaming",
    ],
    scale: [
      { label: "Members", value: "4M+" },
      { label: "Daily claims", value: "1.6M" },
      { label: "DAGs", value: "240+" },
    ],
    projectId: "abcbs",
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
      "Authored 200+ SQL transformations + reporting marts on PostgreSQL",
      "Automated invoice extraction with OCR + Python, saving ~120 hrs/month",
      "Set up the team's first CI/CD on GitHub Actions and Docker",
    ],
    scale: [
      { label: "Teams enabled", value: "9" },
      { label: "Hours saved/mo", value: "120+" },
      { label: "Services", value: "14" },
    ],
    projectId: "narvee",
    accent: "magenta",
  },
];

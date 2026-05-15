# Portfolio

My personal portfolio. Built it to show the work I have actually shipped as a data engineer over the last few years, with case studies, pipelines, and the tech stack laid out the way I would explain them in an interview.

The site has a hero scene with a 3D photo frame and a particle field, a tech stack section with an orbital constellation of tools I have used, an animated timeline of my career, three full project case studies with pipeline diagrams, and a contact section with a terminal style form.

## View the site

https://portfolio-fawn-beta-zjvbplk2vx.vercel.app

## What I do

Data engineering at scale

- Real time streaming on Spark Structured Streaming and Kafka. Built a fraud decision surface that scores card auth in under 200 ms at 2.4M events per second.
- Lakehouse design on Iceberg and Delta over S3. Adaptive query execution and partition aware compaction cut nightly Spark cost by 38 percent.
- Batch and streaming pipelines in PySpark, Glue Streaming, and Databricks. 240 plus Airflow DAGs in production across regulated workloads.

Cloud and platform

- AWS across data and ML: S3, Glue, Athena, Redshift, Lambda, Step Functions, MSK, SageMaker, Bedrock, Titan, Rekognition, CloudWatch, CloudTrail, IAM.
- Infrastructure as code with Terraform. CI/CD on GitHub Actions and Docker.

Warehousing and analytics engineering

- Snowflake and Redshift at multi terabyte scale.
- dbt semantic layer powering 90 plus analyst dashboards. Tests and freshness checks wired into CI so bad data does not ship.
- Strong SQL. Window functions, recursive CTEs, distribution and sort key tuning for sub second queries.

AI in production pipelines

- Foundation model use in real workloads. RAG over policy corpora, Titan embeddings into pgvector, document understanding with Bedrock for KYC, face match with Rekognition.
- Tool using agents with permissioned access to warehouses.

Data quality and governance

- Great Expectations and dbt tests as hard gates in Airflow and CI.
- HIPAA grade lineage, row level security, masking macros, audit trails through CloudTrail.

Python and services

- Flask, FastAPI, Celery, Pandas, Pydantic. Internal APIs and async workers that nine teams ran on every day.
- OCR ingestion pipelines that saved roughly 120 hours of manual work a month.

Frontend (this site is the proof)

- Next.js with the App Router, React 18, TypeScript strict.
- Three.js, React Three Fiber, Drei, custom GLSL shaders, Framer Motion, Tailwind, Lenis.

## Tech stack on this site

Framework

- Next.js (App Router)
- React 18
- TypeScript with strict mode

Styling

- Tailwind CSS 3
- Custom CSS for the neon glow, glass panels, scanlines, and the cyber grid

3D and graphics

- Three.js (r169)
- React Three Fiber
- Drei
- Custom GLSL shaders for the particle field

Motion and scroll

- Framer Motion for section transitions and scroll driven animations
- Lenis for smooth scrolling
- Animated SVG paths for the project pipeline diagrams

Tooling

- ESLint
- PostCSS
- pnpm (npm and yarn also work)

## Running it locally

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000. Needs Node 18 or newer.

# Portfolio

My personal portfolio site. Built it to show the work I have actually shipped as a data engineer over the last few years, with the case studies, pipelines, and tech stack laid out the way I would explain them in an interview.

The site has a hero scene with a 3D photo frame and a particle field, a tech stack section with an orbital constellation of tools I have used, an animated timeline of my career, three full project case studies with pipeline diagrams, and a contact section with a terminal style form.

## Live site

https://portfolio-fawn-beta-zjvbplk2vx.vercel.app

Hosted on Vercel. The repo is linked to the project so every push to `main` redeploys automatically. Pull requests get their own preview URL.

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

## Run it locally

You need Node 18 or newer.

```bash
cd portfolio
pnpm install
pnpm dev
```

Open http://localhost:3000.

If you do not have pnpm, `npm install` and `npm run dev` work the same way.

## Deploy your own copy to Vercel

This project is already linked to a Vercel project under my account. If you fork the repo and want to host your own version, either path below works.

### From the terminal

```bash
npm i -g vercel
vercel login
cd portfolio
vercel             # first time, links the project
vercel --prod      # push live
```

### From the Vercel dashboard

1. Push your fork to GitHub.
2. Go to https://vercel.com/new and import the repo.
3. Set the root directory to `portfolio`.
4. Framework preset should auto detect as Next.js. No environment variables are needed.
5. Click Deploy.

Once linked, every push to `main` triggers an auto deploy.

## After the first deploy

- Add your custom domain under Project Settings, Domains in the Vercel dashboard.
- Drop your real `avatar.jpg`, `resume.pdf`, and a 1200x630 `og.png` into `public/` so link previews and the resume button work.

## Known things to clean up

Not blocking, but worth fixing on the next pass:

- Next.js installed version (14.2.30) has a known security advisory. Bump it with `npm i next@latest` and redeploy. Reference: https://nextjs.org/blog/security-update-2025-12-11
- `@studio-freight/lenis` has been renamed to `lenis`. Migrate the import when convenient.
- `uuid@9` and `three-mesh-bvh@0.7.8` are deprecated but harmless for now.
- The ESLint config has a stale `extensions` option, so lint is silently skipped during the Vercel build until that is removed.

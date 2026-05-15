# Sathvik Reddy Puli — Cinematic Portfolio

A production-grade Next.js 15 + React 18 + TypeScript portfolio as a Senior Data Engineer.
Built as a cinematic, GPU-accelerated experience with Three.js, GSAP-style motion, Framer Motion,
Tailwind, and Lenis smooth scrolling.

## Stack used:

- **Next.js 15 (App Router)** + **React 18** + **TypeScript** (strict)
- **TailwindCSS 3** with custom `neon-*`, `glass`, scanlines, cyber-grid layers
- **React Three Fiber** + **Drei** + **Three.js r169** for the hero scene & tech universe
- **Custom GLSL shaders** for the particle field
- **Framer Motion** for scroll-driven storytelling and section transitions
- **Lenis** for buttery smooth-scroll
- **SVG flow diagrams** with animated dashed paths for per-project pipelines

## Getting started

```bash
cd portfolio
pnpm install        # or npm install / yarn install
pnpm dev            # http://localhost:3000
```

Production:

```bash
pnpm build
pnpm start
```

Type-check:

```bash
pnpm type-check
```

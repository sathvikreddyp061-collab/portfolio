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

## What's inside

```
portfolio/
├── app/
│   ├── layout.tsx          # Metadata, viewport, providers
│   ├── page.tsx            # Section composition (with dynamic R3F splits)
│   ├── providers.tsx       # SmoothScroll + CustomCursor
│   └── globals.css         # Design system tokens, glass, grids, scanlines
├── components/
│   ├── nav/Nav.tsx         # Pill nav w/ active layoutId, mobile sheet
│   ├── cursor/CustomCursor.tsx
│   ├── scroll/SmoothScroll.tsx   # Lenis lifecycle
│   ├── hero/
│   │   ├── Hero.tsx              # Headline, role cycler, CTAs, marquee
│   │   ├── HeroScene.tsx         # R3F canvas, scroll-aware camera
│   │   ├── PhotoFrame.tsx        # Holographic 3D photo frame
│   │   ├── ParticleField.tsx     # Custom GLSL particles
│   │   ├── NeuralNetwork.tsx     # Procedural node-graph
│   │   └── RoleCycler.tsx        # Animated rotating roles
│   ├── about/
│   │   ├── About.tsx
│   │   ├── StatsCounter.tsx      # Eased count-up stats
│   │   └── Timeline.tsx          # Floating-node career arc
│   ├── stack/
│   │   ├── TechUniverse.tsx      # 3D orbital tech constellation
│   │   └── EcosystemPanel.tsx    # Hover/click slide-out ecosystem
│   ├── projects/
│   │   ├── Projects.tsx
│   │   ├── ProjectShowcase.tsx
│   │   └── PipelineDiagram.tsx   # Animated SVG dataflow
│   ├── contact/
│   │   ├── Contact.tsx           # Holographic terminal + form
│   │   └── Terminal.tsx
│   ├── footer/Footer.tsx
│   └── ui/                       # SectionHeader, MagneticButton, CyberGrid
├── lib/
│   ├── data/                     # Source-of-truth content
│   │   ├── tech.ts
│   │   ├── projects.ts
│   │   └── timeline.ts
│   ├── hooks/                    # useMousePos, useReducedMotion
│   └── utils.ts
├── public/                       # Add /og.png, /resume.pdf, /avatar.jpg here
├── next.config.mjs               # Webpack rule for .glsl, package optimizations
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

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

## Customization

- **Add your photo**: drop a square image at `public/avatar.jpg` and replace the
  `INITIALS` monogram in `components/hero/PhotoFrame.tsx` with `<img src="/avatar.jpg" />`
  inside the inner glass card.
- **Resume PDF**: drop `public/resume.pdf` and update the `Resume` channel `href`
  in `components/contact/Contact.tsx`.
- **OG image**: drop `public/og.png` (1200×630) — Next will pick it up automatically.
- **Edit content**: all copy lives in `lib/data/*.ts` — no JSX edits needed for new
  projects, timeline entries, or technologies.
- **Calendar**: change the `cal.com` URL in `Contact.tsx` to your own booking link.

## Performance notes

- The R3F hero and tech universe are loaded with `next/dynamic({ ssr: false })`
  to keep the main bundle lean and avoid SSR mismatches around WebGL.
- `dpr={[1, 1.6]}` clamps device pixel ratio to keep mid-range mobiles responsive.
- Particle field uses additive blending and `depthWrite={false}` for cheap glow.
- The neural-net edge buffer is reused across frames and `setDrawRange` clamps
  draws to actually-active segments.
- Lenis is disabled when `prefers-reduced-motion: reduce` is set.
- Custom cursor is hidden on `pointer: coarse` (touch devices).
- `experimental.optimizePackageImports` strips unused exports from `three` /
  `framer-motion` / `gsap` / `drei`.

## Accessibility

- Respects `prefers-reduced-motion` (no smooth-scroll, animations dampened).
- Keyboard-friendly nav links and form fields.
- Sufficient contrast across glass surfaces (text/65 minimum on dark).
- Touch devices fall back to native cursor + reduced 3D interactions.

## Deploy

### Vercel (recommended)

```bash
# from /portfolio
vercel --prod
```

Or push the repo and import in the Vercel dashboard. No environment variables
required out of the box. Set the framework preset to **Next.js** and the
build command to `pnpm build` (or `next build`).

### Other platforms

Any Node host that supports Next.js 15 (Cloudflare Pages w/ Node runtime,
Netlify, Fly.io, AWS Amplify, your own EC2 box) will work — there is no server-only
behavior beyond the standard App Router rendering.

## License

All visual design and copy © Sathvik Reddy Puli. Source code MIT — fork freely.

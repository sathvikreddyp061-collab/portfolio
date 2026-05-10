"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import RoleCycler from "./RoleCycler";
import MagneticButton from "@/components/ui/MagneticButton";
import { useIsTouch } from "@/lib/hooks/useIsTouch";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } },
};
const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.2, 0.8, 0.2, 1] } },
};

export default function Hero() {
  // Subtle parallax on the background photo as the mouse moves.
  // Skipped on touch devices — saves a pointermove listener + spring tick on mobile.
  const isTouch = useIsTouch();
  const sectionRef = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 });
  const photoX = useTransform(sx, (v) => v * 18);
  const photoY = useTransform(sy, (v) => v * 12);
  const photoScale = useTransform(sx, () => (isTouch ? 1 : 1.06));

  useEffect(() => {
    if (isTouch) return;
    const onMove = (e: PointerEvent) => {
      const r = sectionRef.current?.getBoundingClientRect();
      if (!r) return;
      mx.set((e.clientX - (r.left + r.width / 2)) / (r.width / 2));
      my.set((e.clientY - (r.top + r.height / 2)) / (r.height / 2));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my, isTouch]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-eager
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden"
    >
      {/* ============================================================
          BACKGROUND LAYER STACK (deepest → topmost)
          ============================================================ */}

      {/* 1. Base black */}
      <div aria-hidden className="absolute inset-0 -z-30 bg-ink-deep" />

      {/* 2. The portrait — full-bleed on the right (desktop), centered behind text (mobile).
            Uses next/image so the browser gets AVIF/WebP at the right size for its viewport. */}
      <motion.div
        aria-hidden
        style={{ x: photoX, y: photoY, scale: photoScale }}
        className="absolute inset-y-0 right-0 -z-20 w-full md:w-[68%] lg:w-[60%]"
      >
        <Image
          src="/avatar.jpg"
          alt=""
          fill
          priority
          quality={75}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 68vw, 60vw"
          className="object-cover"
          style={{
            objectPosition: "55% 18%",
            filter: "saturate(0.85) contrast(1.05)",
          }}
        />
      </motion.div>

      {/* 3. Left-to-right dark gradient — desktop: text on left readable, photo breathes on right.
            Mobile: stronger overlay since photo sits behind text. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 md:hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(2,3,10,0.55) 0%, rgba(2,3,10,0.85) 60%, #02030a 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden md:block"
        style={{
          background:
            "linear-gradient(90deg, #02030a 0%, rgba(2,3,10,0.95) 30%, rgba(2,3,10,0.7) 50%, rgba(2,3,10,0.35) 75%, rgba(2,3,10,0.18) 100%)",
        }}
      />

      {/* 4. Top + bottom soft fades, plus right-edge fade so the photo
            doesn't end in a hard line */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(2,3,10,0.6) 0%, transparent 18%, transparent 78%, #02030a 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-32 md:w-48"
        style={{
          background: "linear-gradient(270deg, #02030a 0%, transparent 100%)",
        }}
      />

      {/* 5. Subtle ambient color wash — single accent, restrained */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 18% 32%, rgba(34,240,255,0.10), transparent 70%)",
        }}
      />

      {/* 6. Scan lines — very subtle, premium "treated film" feel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(255,255,255,1) 3px, transparent 4px)",
        }}
      />

      {/* 7. Slow scan sweep — single thin bar that drifts down every 9s.
             Hidden on mobile to save GPU compositing. */}
      <div aria-hidden className="hero-scan pointer-events-none absolute inset-x-0 -z-10 hidden h-px md:block" />

      {/* 8. Edge frame — thin vertical guides on the far left for that "magazine" feel */}
      <div className="pointer-events-none absolute left-6 top-0 z-10 hidden h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent md:block" />
      <div className="pointer-events-none absolute left-12 top-0 z-10 hidden h-full w-px bg-gradient-to-b from-transparent via-white/[0.04] to-transparent md:block" />

      {/* ============================================================
          CONTENT
          ============================================================ */}

      <div className="container-app relative z-20 flex flex-1 flex-col justify-center pt-28 pb-24 md:pt-32">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex max-w-[640px] flex-col gap-7"
        >
          {/* Eyebrow */}
          <motion.div variants={item} className="flex flex-wrap items-center gap-3">
            <span className="chip">
              <span className="h-1.5 w-1.5 animate-glow rounded-full bg-neon-cyan shadow-[0_0_10px_rgba(34,240,255,0.9)]" />
              Frisco, Texas · Open to remote, hybrid, on-site
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={item}
            className="font-display font-semibold leading-[0.95] tracking-tight"
            style={{
              fontSize: "clamp(3rem, 8vw, 6.5rem)",
              textShadow: "0 4px 60px rgba(0,0,0,0.6)",
            }}
          >
            <span className="block text-white">Sathvik Reddy</span>
            <span className="block text-gradient-cyber">Puli.</span>
          </motion.h1>

          {/* Role line */}
          <motion.div
            variants={item}
            className="font-display font-medium leading-tight"
            style={{ fontSize: "clamp(1.2rem, 2.4vw, 2rem)" }}
          >
            <span className="text-white/60">I am a </span>
            <RoleCycler />
          </motion.div>

          {/* Lead paragraph — shorter, more confident */}
          <motion.p
            variants={item}
            className="max-w-xl text-pretty text-base leading-relaxed text-white/70 md:text-lg"
          >
            Five years architecting <span className="text-white">real-time data systems</span>{" "}
            for global fintech and US healthcare. Spark on Databricks, Kafka streams, AWS
            lakehouses, embedded AI on Bedrock — I turn streaming chaos into sub-second
            decisions.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="mt-2 flex flex-wrap items-center gap-4">
            <MagneticButton href="#projects">
              <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan shadow-[0_0_10px_rgba(34,240,255,0.9)]" />
              Enter the work
            </MagneticButton>
            <MagneticButton href="#contact" className="border-white/20 bg-transparent">
              Open a channel →
            </MagneticButton>
          </motion.div>

          {/* Inline stats — minimal, confident */}
          <motion.div variants={item} className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-4">
            {[
              { k: "5+", v: "Years" },
              { k: "3", v: "Domains" },
              { k: "120+", v: "Pipelines shipped" },
              { k: "2.4M", v: "Events/sec peak" },
            ].map((s) => (
              <div key={s.v} className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  {s.k}
                </span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-white/45">
                  {s.v}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Identity tag — bottom right of the photo */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 1 }}
        className="pointer-events-none absolute bottom-28 right-8 z-10 hidden flex-col items-end gap-2 md:flex"
      >
        <span className="rounded-full border border-white/15 bg-black/55 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.32em] text-white/85 backdrop-blur-md">
          <span className="mr-2 inline-block h-1.5 w-1.5 animate-glow rounded-full bg-neon-cyan align-middle shadow-[0_0_10px_rgba(34,240,255,0.9)]" />
          identity · authenticated
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/45">
          frame · 0001 · live
        </span>
      </motion.div>

      {/* Marquee strip — domains served */}
      <div className="relative z-10 border-y border-white/[0.06] bg-black/40 backdrop-blur-md">
        <div className="container-app flex items-center justify-between py-4 text-[10px] uppercase tracking-[0.32em] text-white/55">
          <span className="font-mono text-neon-cyan">// domains served</span>
          <div className="hidden items-center gap-6 md:flex">
            <span>Global Investment Banking</span>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span>US Healthcare Insurance</span>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span>Enterprise Services</span>
          </div>
          <span className="font-mono">scroll · ↓</span>
        </div>
      </div>

      <style jsx>{`
        .hero-scan {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(34, 240, 255, 0.55) 50%,
            transparent 100%
          );
          box-shadow: 0 0 12px rgba(34, 240, 255, 0.45);
          animation: hero-scan 9s linear infinite;
        }
        @keyframes hero-scan {
          0%   { top: -2%; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 102%; opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-scan { animation: none; }
        }
      `}</style>
    </section>
  );
}

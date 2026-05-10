"use client";

import { useEffect, useRef } from "react";

/**
 * Cinematic section divider — a thin full-bleed strip placed between sections.
 * Features:
 *   - Top + bottom glowing rules
 *   - Drifting starfield (canvas, GPU-cheap)
 *   - Animated label with next-section index + name
 *   - Subtle scan-line sweep
 * Pure CSS + 1 small canvas. No Three.js, no heavy deps.
 */
export default function SectionDivider({
  index,
  label,
  accent = "#22f0ff",
}: {
  index: string;
  label: string;
  accent?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Tiny drifting-stars canvas — runs only when the divider is on screen.
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    let raf = 0;
    let running = false;
    let stars: { x: number; y: number; vx: number; size: number; alpha: number }[] = [];

    const resize = () => {
      const r = cv.getBoundingClientRect();
      cv.width = Math.floor(r.width * dpr);
      cv.height = Math.floor(r.height * dpr);
      cv.style.width = r.width + "px";
      cv.style.height = r.height + "px";
      // Re-seed stars
      const count = Math.max(40, Math.floor(r.width / 18));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * cv.width,
        y: Math.random() * cv.height,
        vx: (0.3 + Math.random() * 0.7) * dpr,
        size: (Math.random() < 0.85 ? 0.7 : 1.4) * dpr,
        alpha: 0.4 + Math.random() * 0.6,
      }));
    };

    const tick = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, cv.width, cv.height);
      for (const s of stars) {
        s.x += s.vx;
        if (s.x > cv.width + 4) s.x = -4;
        ctx.beginPath();
        ctx.fillStyle = `rgba(188,239,255,${s.alpha})`;
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          resize();
          raf = requestAnimationFrame(tick);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.01 }
    );
    io.observe(cv);

    const onResize = () => {
      if (running) resize();
    };
    window.addEventListener("resize", onResize);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="relative isolate w-full overflow-hidden"
      style={{ height: "120px" }}
    >
      {/* Top glowing rule */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${accent}aa 50%, transparent 100%)`,
          boxShadow: `0 0 12px ${accent}88`,
        }}
      />

      {/* Drifting starfield canvas — fills the strip */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Subtle scan sweep that drifts horizontally every 8s */}
      <div
        className="divider-scan pointer-events-none absolute inset-y-0 w-1/3"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${accent}33 50%, transparent 100%)`,
        }}
      />

      {/* Label — sits dead center */}
      <div className="container-app relative flex h-full items-center justify-center">
        <div className="flex items-center gap-4">
          <span className="hidden h-px w-16 sm:block" style={{ background: `linear-gradient(90deg, transparent, ${accent}88)` }} />

          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/55 px-4 py-1.5 backdrop-blur-md">
            <span
              className="h-1.5 w-1.5 animate-glow rounded-full"
              style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/55">
              transmission
            </span>
            <span className="font-mono text-[11px] font-semibold tracking-[0.32em]" style={{ color: accent }}>
              {index}
            </span>
            <span className="hidden h-3 w-px bg-white/15 sm:inline-block" />
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.32em] text-white/85 sm:inline-block">
              {label}
            </span>
            <span className="font-mono text-[11px] text-white/40">→</span>
          </div>

          <span className="hidden h-px w-16 sm:block" style={{ background: `linear-gradient(270deg, transparent, ${accent}88)` }} />
        </div>
      </div>

      {/* Bottom glowing rule */}
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${accent}aa 50%, transparent 100%)`,
          boxShadow: `0 0 12px ${accent}88`,
        }}
      />

      <style jsx>{`
        .divider-scan {
          left: -33%;
          animation: divider-scan 9s linear infinite;
          mix-blend-mode: screen;
        }
        @keyframes divider-scan {
          0%   { left: -40%; opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { left: 110%; opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .divider-scan { animation: none; }
        }
      `}</style>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient cinematic backdrop — pure CSS, no WebGL.
 *  - Slow-drifting gradient mesh (3 blurred orbs)
 *  - Subtle cyber grid with mask fade
 *  - Cursor-following spotlight
 *  - Animated noise / scanline texture
 *  Premium look, near-zero CPU/GPU cost.
 */
export default function HeroBackdrop() {
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      if (spotRef.current) {
        spotRef.current.style.background = `radial-gradient(420px 320px at ${cx}px ${cy}px, rgba(124,92,255,0.18), rgba(34,240,255,0.10) 35%, transparent 70%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Base deep field */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, #02030a 0%, #04061a 50%, #02030a 100%)" }}
      />

      {/* Drifting mesh orbs — pure CSS animations */}
      <div className="orb orb-cyan" />
      <div className="orb orb-violet" />
      <div className="orb orb-magenta" />

      {/* Cyber grid with radial mask */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(124,92,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(34,240,255,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 45%, #000 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 45%, #000 30%, transparent 80%)",
        }}
      />

      {/* Horizon line — subtle bright sweep */}
      <div
        className="absolute inset-x-0 top-1/2 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(34,240,255,0.5) 30%, rgba(124,92,255,0.5) 70%, transparent)",
          boxShadow: "0 0 30px rgba(124,92,255,0.35)",
        }}
      />

      {/* Cursor spotlight */}
      <div ref={spotRef} className="absolute inset-0" />

      {/* Vignette to fade everything into the page */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, transparent 35%, rgba(2,3,10,0.6) 75%, #02030a 100%)",
        }}
      />

      <style jsx>{`
        .orb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(80px);
          opacity: 0.55;
          will-change: transform;
        }
        .orb-cyan {
          width: 540px;
          height: 540px;
          left: -10%;
          top: 10%;
          background: radial-gradient(circle at 50% 50%, rgba(34, 240, 255, 0.45), transparent 70%);
          animation: drift1 22s ease-in-out infinite;
        }
        .orb-violet {
          width: 620px;
          height: 620px;
          right: -8%;
          top: -10%;
          background: radial-gradient(circle at 50% 50%, rgba(124, 92, 255, 0.5), transparent 70%);
          animation: drift2 28s ease-in-out infinite;
        }
        .orb-magenta {
          width: 460px;
          height: 460px;
          left: 35%;
          bottom: -15%;
          background: radial-gradient(circle at 50% 50%, rgba(255, 60, 172, 0.32), transparent 70%);
          animation: drift3 26s ease-in-out infinite;
        }
        @keyframes drift1 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50%      { transform: translate3d(80px, 60px, 0) scale(1.08); }
        }
        @keyframes drift2 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50%      { transform: translate3d(-90px, 80px, 0) scale(1.05); }
        }
        @keyframes drift3 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50%      { transform: translate3d(60px, -70px, 0) scale(1.1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .orb { animation: none; }
        }
      `}</style>
    </div>
  );
}

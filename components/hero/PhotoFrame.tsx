"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

export default function PhotoFrame() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 140, damping: 18 });
  const sy = useSpring(my, { stiffness: 140, damping: 18 });
  const rx = useTransform(sy, (v) => v * -10);
  const ry = useTransform(sx, (v) => v * 10);
  const px = useTransform(sx, (v) => v * 14);
  const py = useTransform(sy, (v) => v * 14);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - (r.left + r.width / 2)) / (r.width / 2));
    my.set((e.clientY - (r.top + r.height / 2)) / (r.height / 2));
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className="perspective-1000 group relative aspect-square w-[260px] sm:w-[300px] md:w-[360px] lg:w-[420px]"
      initial={{ opacity: 0, scale: 0.85, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.1, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="relative h-full w-full"
      >
        {/* Outer holo aura */}
        <div
          className="absolute -inset-6 rounded-[36px] opacity-70 blur-2xl transition group-hover:opacity-100"
          style={{
            background:
              "conic-gradient(from 120deg at 50% 50%, rgba(34,240,255,0.65), rgba(124,92,255,0.55), rgba(255,60,172,0.55), rgba(34,240,255,0.65))",
          }}
        />
        {/* Glass card */}
        <div className="glass relative h-full w-full overflow-hidden rounded-[28px] scanlines">
          {/* Inner gradient face */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 35%, rgba(34,240,255,0.18), rgba(2,3,10,0.6) 70%), linear-gradient(180deg, rgba(124,92,255,0.18), rgba(2,3,10,0.9))",
            }}
          />
          {/* Cyber grid */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(rgba(34,240,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,255,0.18) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
              maskImage:
                "radial-gradient(ellipse 80% 60% at 50% 50%, #000 50%, transparent 80%)",
            }}
          />

          {/* Avatar — your photo inside a glowing holographic disc with orbital HUD */}
          <motion.div
            style={{ x: px, y: py }}
            className="absolute inset-0 grid place-items-center"
          >
            <div className="relative grid place-items-center">
              {/* Pulsing breathing aura */}
              <div className="hud-aura absolute -inset-10 rounded-full" />

              {/* Orbital ring system — 3 concentric SVG arcs at different speeds */}
              <svg
                viewBox="0 0 400 400"
                className="hud-orbit-1 pointer-events-none absolute h-[105%] w-[105%]"
                aria-hidden
              >
                <circle
                  cx="200"
                  cy="200"
                  r="170"
                  fill="none"
                  stroke="rgba(34,240,255,0.55)"
                  strokeWidth="1"
                  strokeDasharray="2 8"
                />
                <circle cx="200" cy="30" r="3" fill="#22f0ff">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="1.6s" repeatCount="indefinite" />
                </circle>
              </svg>
              <svg
                viewBox="0 0 400 400"
                className="hud-orbit-2 pointer-events-none absolute h-[120%] w-[120%]"
                aria-hidden
              >
                <circle
                  cx="200"
                  cy="200"
                  r="190"
                  fill="none"
                  stroke="rgba(124,92,255,0.4)"
                  strokeWidth="1"
                  strokeDasharray="6 14"
                />
                <circle cx="20" cy="200" r="2.5" fill="#7c5cff">
                  <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="380" cy="200" r="2" fill="#ff3cac">
                  <animate attributeName="opacity" values="0.4;1;0.4" dur="2.4s" repeatCount="indefinite" />
                </circle>
              </svg>
              <svg
                viewBox="0 0 400 400"
                className="hud-orbit-3 pointer-events-none absolute h-[138%] w-[138%]"
                aria-hidden
              >
                {/* Two arc segments instead of full ring — looks more like a HUD */}
                <path
                  d="M 200 20 A 180 180 0 0 1 380 200"
                  fill="none"
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                <path
                  d="M 200 380 A 180 180 0 0 1 20 200"
                  fill="none"
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                {/* Tick marks at NSEW */}
                {[0, 90, 180, 270].map((deg) => (
                  <line
                    key={deg}
                    x1="200"
                    y1="14"
                    x2="200"
                    y2="26"
                    stroke="rgba(34,240,255,0.6)"
                    strokeWidth="1.5"
                    transform={`rotate(${deg} 200 200)`}
                  />
                ))}
              </svg>

              {/* The photo disc itself */}
              <div className="relative h-44 w-44 overflow-hidden rounded-full border border-white/20 shadow-glow backdrop-blur-md md:h-60 md:w-60">
                <img
                  src="/avatar.jpg"
                  alt="Sathvik Reddy Puli"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: "50% 25%" }}
                />
                {/* Holographic tint */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(70% 60% at 50% 30%, rgba(34,240,255,0.10), transparent 70%), linear-gradient(180deg, transparent 60%, rgba(2,3,10,0.45) 100%)",
                    mixBlendMode: "screen",
                  }}
                />
                {/* Vertical scan-line shimmer */}
                <div className="hud-shimmer pointer-events-none absolute inset-0" />
                {/* Inner ring stroke */}
                <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/20" />
              </div>

              {/* Orbiting tech chips — two rings, opposite directions, 10 tools total.
                  Math: outer wrapper rotates the orbit, inner element counter-rotates the
                  text by the SAME duration & delay so labels stay perfectly upright. */}
              {(() => {
                // Inner ring — clockwise, faster, tighter
                const inner = [
                  { label: "Kafka", color: "#22f0ff" },
                  { label: "Spark", color: "#E25A1C" },
                  { label: "Python", color: "#3776AB" },
                  { label: "SQL", color: "#00B5E2" },
                  { label: "dbt", color: "#FF694A" },
                ];
                // Outer ring — counter-clockwise, slower, wider
                const outer = [
                  { label: "AWS", color: "#FF9900" },
                  { label: "Airflow", color: "#7c5cff" },
                  { label: "Bedrock", color: "#ff3cac" },
                  { label: "Databricks", color: "#FF3621" },
                  { label: "Snowflake", color: "#29B5E8" },
                ];

                const innerDur = 28;
                const outerDur = 40;
                const innerRadius = 142;
                const outerRadius = 178;

                const Chip = ({ label, color }: { label: string; color: string }) => (
                  <div
                    className="rounded-full border border-white/15 bg-black/65 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/90 backdrop-blur-md"
                    style={{
                      boxShadow: `0 0 14px ${color}55, inset 0 0 8px ${color}22`,
                    }}
                  >
                    <span
                      className="mr-1.5 inline-block h-1 w-1 rounded-full align-middle"
                      style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                    />
                    {label}
                  </div>
                );

                return (
                  <>
                    {/* INNER ring chips — clockwise */}
                    {inner.map((chip, i) => {
                      const startAngle = (360 / inner.length) * i;
                      // Negative delay starts each chip already-rotated by its share of the loop
                      const delay = -(startAngle / 360) * innerDur;
                      return (
                        <div
                          key={`in-${chip.label}`}
                          className="orbit-spin pointer-events-none absolute left-1/2 top-1/2 hidden h-0 w-0 md:block"
                          style={{
                            ["--dur" as any]: `${innerDur}s`,
                            animationDelay: `${delay}s`,
                          }}
                        >
                          <div
                            className="orbit-counter absolute"
                            style={{
                              ["--dur" as any]: `${innerDur}s`,
                              left: `${innerRadius}px`,
                              top: 0,
                              transform: "translate(-50%, -50%)",
                              animationDelay: `${delay}s`,
                            }}
                          >
                            <Chip label={chip.label} color={chip.color} />
                          </div>
                        </div>
                      );
                    })}

                    {/* OUTER ring chips — counter-clockwise (negative direction) */}
                    {outer.map((chip, i) => {
                      const startAngle = (360 / outer.length) * i + 36; // offset so they don't align with inner
                      const delay = -(startAngle / 360) * outerDur;
                      return (
                        <div
                          key={`out-${chip.label}`}
                          className="orbit-spin-rev pointer-events-none absolute left-1/2 top-1/2 hidden h-0 w-0 md:block"
                          style={{
                            ["--dur" as any]: `${outerDur}s`,
                            animationDelay: `${delay}s`,
                          }}
                        >
                          <div
                            className="orbit-counter-rev absolute"
                            style={{
                              ["--dur" as any]: `${outerDur}s`,
                              left: `${outerRadius}px`,
                              top: 0,
                              transform: "translate(-50%, -50%)",
                              animationDelay: `${delay}s`,
                            }}
                          >
                            <Chip label={chip.label} color={chip.color} />
                          </div>
                        </div>
                      );
                    })}
                  </>
                );
              })()}
            </div>
          </motion.div>

          {/* Floating badge */}
          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 backdrop-blur-md">
            <span className="h-1.5 w-1.5 animate-glow rounded-full bg-neon-cyan shadow-[0_0_10px_rgba(34,240,255,0.9)]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/80">
              identity · authenticated
            </span>
          </div>

          {/* Telemetry rail */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between rounded-xl border border-white/10 bg-black/40 px-3 py-2 backdrop-blur-md">
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/45">
                signal
              </span>
              <div className="flex items-end gap-[2px]">
                {[3, 5, 8, 11, 9, 13, 7, 12, 16, 11].map((h, i) => (
                  <span
                    key={i}
                    className="block w-[3px] rounded-sm bg-gradient-to-t from-neon-violet to-neon-cyan"
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/45">
                throughput
              </div>
              <div className="font-mono text-xs text-white">
                <span className="text-neon-cyan">50K</span>{" "}
                <span className="text-white/55">events/s</span>
              </div>
            </div>
          </div>

          {/* Sweep line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 animate-scanline bg-gradient-to-b from-neon-cyan/15 to-transparent" />
        </div>

        {/* Floating glass shards */}
        <motion.div
          style={{ x: px, y: py, transform: "translateZ(60px)" }}
          className="pointer-events-none absolute -right-6 top-10 hidden rounded-2xl border border-white/15 bg-white/[0.04] px-3 py-2 backdrop-blur-md md:block"
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
            uptime
          </div>
          <div className="font-display text-lg text-white">99.997%</div>
        </motion.div>
        <motion.div
          style={{ x: px, y: py, transform: "translateZ(60px)" }}
          className="pointer-events-none absolute -left-8 bottom-12 hidden rounded-2xl border border-white/15 bg-white/[0.04] px-3 py-2 backdrop-blur-md md:block"
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
            pipelines
          </div>
          <div className="font-display text-lg text-white">
            <span className="text-neon-cyan">120+</span>
          </div>
        </motion.div>
      </motion.div>

      <style jsx>{`
        /* Breathing aura — subtle radial pulse behind the disc */
        .hud-aura {
          background: radial-gradient(
            circle at 50% 50%,
            rgba(34, 240, 255, 0.18),
            rgba(124, 92, 255, 0.10) 45%,
            transparent 70%
          );
          filter: blur(28px);
          animation: hud-pulse 4s ease-in-out infinite;
          will-change: transform, opacity;
        }
        @keyframes hud-pulse {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50%      { opacity: 1;    transform: scale(1.07); }
        }

        /* Three concentric rings rotating at different speeds */
        .hud-orbit-1 { animation: hud-spin 28s linear infinite; }
        .hud-orbit-2 { animation: hud-spin-rev 38s linear infinite; }
        .hud-orbit-3 { animation: hud-spin 60s linear infinite; }
        @keyframes hud-spin     { to { transform: rotate(360deg); } }
        @keyframes hud-spin-rev { to { transform: rotate(-360deg); } }

        /* Photo scan-line shimmer — diagonal sweep that crosses the disc periodically */
        .hud-shimmer {
          background: linear-gradient(
            115deg,
            transparent 30%,
            rgba(255, 255, 255, 0.18) 48%,
            rgba(34, 240, 255, 0.22) 50%,
            rgba(255, 255, 255, 0.18) 52%,
            transparent 70%
          );
          background-size: 220% 220%;
          mix-blend-mode: screen;
          animation: hud-shimmer 6s ease-in-out infinite;
        }
        @keyframes hud-shimmer {
          0%, 35% { background-position: 200% -50%; opacity: 0; }
          50%     { opacity: 1; }
          75%     { background-position: -100% 150%; opacity: 0; }
          100%    { background-position: -100% 150%; opacity: 0; }
        }

        /* Orbit math — wrapper rotates the orbit, child counter-rotates SAME duration
           and SAME negative animation-delay so text stays perfectly upright at every
           angle. Two variants for clockwise (inner) and counter-clockwise (outer). */
        .orbit-spin {
          animation: orbit-spin var(--dur) linear infinite;
          will-change: transform;
        }
        .orbit-counter {
          animation: orbit-counter var(--dur) linear infinite;
          white-space: nowrap;
          will-change: transform;
        }
        .orbit-spin-rev {
          animation: orbit-spin-rev var(--dur) linear infinite;
          will-change: transform;
        }
        .orbit-counter-rev {
          animation: orbit-counter-rev var(--dur) linear infinite;
          white-space: nowrap;
          will-change: transform;
        }
        @keyframes orbit-spin         { to { transform: rotate(360deg); } }
        @keyframes orbit-counter      { to { transform: translate(-50%, -50%) rotate(-360deg); } }
        @keyframes orbit-spin-rev     { to { transform: rotate(-360deg); } }
        @keyframes orbit-counter-rev  { to { transform: translate(-50%, -50%) rotate(360deg); } }

        @media (prefers-reduced-motion: reduce) {
          .hud-aura, .hud-orbit-1, .hud-orbit-2, .hud-orbit-3,
          .hud-shimmer,
          .orbit-spin, .orbit-counter,
          .orbit-spin-rev, .orbit-counter-rev {
            animation: none;
          }
        }
      `}</style>
    </motion.div>
  );
}

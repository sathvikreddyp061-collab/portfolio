"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

type Stat = { label: string; value: number; suffix?: string; prefix?: string; decimals?: number };

const STATS: Stat[] = [
  { label: "Years engineering", value: 5, suffix: "+" },
  { label: "Pipelines in prod", value: 120, suffix: "+" },
  { label: "Events / second", value: 2.4, suffix: "M", decimals: 1 },
  { label: "Cost saved", value: 38, suffix: "%" },
];

function Counter({ stat }: { stat: Stat }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const duration = 1500;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(stat.value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, stat.value]);

  return (
    <div ref={ref} className="glass relative overflow-hidden rounded-2xl p-6">
      <div
        className="absolute -inset-1 -z-10 opacity-30 blur-2xl"
        style={{
          background:
            "conic-gradient(from 220deg at 50% 50%, rgba(34,240,255,0.5), rgba(124,92,255,0.5), transparent 60%)",
        }}
      />
      <div className="font-display text-5xl font-semibold tracking-tight text-white md:text-6xl">
        {stat.prefix}
        {v.toFixed(stat.decimals ?? 0)}
        <span className="text-gradient-cyber">{stat.suffix}</span>
      </div>
      <div className="mt-2 text-[10px] uppercase tracking-[0.28em] text-white/55">
        {stat.label}
      </div>
    </div>
  );
}

export default function StatsCounter() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.7 }}
      className="grid grid-cols-2 gap-4 md:grid-cols-4"
    >
      {STATS.map((s) => (
        <Counter key={s.label} stat={s} />
      ))}
    </motion.div>
  );
}

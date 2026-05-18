"use client";

import { motion } from "framer-motion";
import { DOMAINS, Domain } from "@/lib/data/timeline";
import { cn } from "@/lib/utils";

const ACCENTS: Record<Domain["accent"], { dot: string; halo: string; text: string; ring: string }> = {
  cyan: {
    dot: "bg-neon-cyan shadow-[0_0_18px_rgba(34,240,255,0.9)]",
    halo: "from-neon-cyan/25 via-neon-cyan/5 to-transparent",
    text: "text-neon-cyan",
    ring: "rgba(34,240,255,0.55)",
  },
  violet: {
    dot: "bg-neon-violet shadow-[0_0_18px_rgba(124,92,255,0.9)]",
    halo: "from-neon-violet/25 via-neon-violet/5 to-transparent",
    text: "text-neon-violet",
    ring: "rgba(124,92,255,0.55)",
  },
  magenta: {
    dot: "bg-neon-magenta shadow-[0_0_18px_rgba(255,60,172,0.9)]",
    halo: "from-neon-magenta/25 via-neon-magenta/5 to-transparent",
    text: "text-neon-magenta",
    ring: "rgba(255,60,172,0.55)",
  },
};

/**
 * Domain expertise grid — three domain cards in place of the old career
 * timeline. Each card is a portfolio-style summary of a domain plus a deep
 * link to its detailed project case study below.
 */
export default function Timeline() {
  return (
    <div className="mt-16 grid gap-6 md:grid-cols-3">
      {DOMAINS.map((d, i) => {
        const a = ACCENTS[d.accent];
        return (
          <motion.a
            key={d.id}
            href={d.projectId ? `#projects` : undefined}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.3, delay: i * 0.03, ease: [0.2, 0.8, 0.2, 1] }}
            data-cursor="hover"
            className="glass group relative flex flex-col gap-5 overflow-hidden rounded-2xl p-6 transition hover:-translate-y-1 hover:bg-white/[0.03]"
            style={{ ["--ring" as any]: a.ring }}
          >
            {/* Accent halo */}
            <div
              className={cn(
                "absolute -inset-px -z-10 rounded-2xl bg-gradient-to-br opacity-50 blur-2xl transition group-hover:opacity-100",
                a.halo
              )}
            />

            {/* Top stripe — accent line that brightens on hover */}
            <span
              className="absolute inset-x-0 top-0 h-px"
              style={{
                background: `linear-gradient(90deg, transparent 0%, var(--ring) 50%, transparent 100%)`,
              }}
            />

            {/* Header — domain shortcode + status pulse */}
            <div className="flex items-center justify-between">
              <span className={cn("font-mono text-[10px] uppercase tracking-[0.32em]", a.text)}>
                // {d.shortName}
              </span>
              <span className="flex items-center gap-1.5">
                <span className={cn("h-2 w-2 rounded-full", a.dot)} />
                <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/55">
                  live
                </span>
              </span>
            </div>

            {/* Domain name */}
            <h3 className="font-display text-3xl font-semibold leading-tight tracking-tight text-white">
              {d.name}
            </h3>

            {/* Tagline */}
            <p className="text-sm leading-relaxed text-white/70">{d.tagline}</p>

            {/* Scale metrics */}
            <div className="grid grid-cols-3 gap-2.5">
              {d.scale.map((s) => (
                <div key={s.label} className="hairline rounded-xl bg-white/[0.02] p-3">
                  <div className={cn("font-display text-xl font-semibold tracking-tight", a.text)}>
                    {s.value}
                  </div>
                  <div className="mt-1 text-[9px] uppercase tracking-[0.22em] text-white/50">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Key wins — narrative bullets fill the empty middle space */}
            <ul className="space-y-2 border-t border-white/[0.06] pt-4">
              {d.achievements.slice(0, 3).map((ach) => (
                <li
                  key={ach}
                  className="flex gap-2.5 text-xs leading-relaxed text-white/65"
                >
                  <span
                    className={cn(
                      "mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full",
                      a.dot
                    )}
                  />
                  <span>{ach}</span>
                </li>
              ))}
            </ul>

            {/* Footer — call to scroll to detailed project case */}
            <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/55">
                view case study
              </span>
              <span
                className={cn(
                  "font-mono text-base transition group-hover:translate-x-1",
                  a.text
                )}
              >
                ↓
              </span>
            </div>
          </motion.a>
        );
      })}
    </div>
  );
}

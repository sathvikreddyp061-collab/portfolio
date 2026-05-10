"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TechCluster } from "@/lib/data/tech";

/**
 * Ecosystem detail panel — sits as a sibling next to the 3D canvas (NOT
 * overlaid on top of it) so the globe stays fully visible while a cluster is
 * being inspected. Slides in from the right when a cluster is selected.
 */
export default function EcosystemPanel({
  cluster,
  onClose,
}: {
  cluster: TechCluster | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence mode="wait">
      {cluster && (
        <motion.aside
          key={cluster.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ type: "spring", stiffness: 220, damping: 28 }}
          className="glass relative flex h-[540px] w-full flex-col overflow-hidden rounded-3xl md:h-[640px]"
        >
          {/* Accent halo */}
          <div
            className="pointer-events-none absolute -inset-1 -z-10 opacity-50 blur-2xl"
            style={{
              background: `radial-gradient(60% 50% at 0% 0%, ${cluster.color}55, transparent 70%)`,
            }}
          />

          <header className="flex items-center justify-between border-b border-white/10 p-5">
            <div className="flex items-center gap-4">
              <div
                className="grid h-12 w-12 place-items-center rounded-xl border border-white/15 bg-white/[0.04] backdrop-blur-md"
                style={{ boxShadow: `0 0 30px ${cluster.color}55, inset 0 0 12px ${cluster.color}33` }}
              >
                {cluster.logo ? (
                  <img
                    src={cluster.logo}
                    alt={cluster.name}
                    width={24}
                    height={24}
                    style={{ filter: `drop-shadow(0 0 6px ${cluster.color})` }}
                  />
                ) : (
                  <span className="font-mono text-[11px] font-semibold tracking-wider text-white">
                    {cluster.glyph}
                  </span>
                )}
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.32em] text-white/55">
                  {cluster.category}
                </div>
                <div className="font-display text-2xl font-semibold text-white">
                  {cluster.name}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/70 hover:text-white"
              data-cursor="hover"
            >
              ESC ✕
            </button>
          </header>

          <p className="border-b border-white/10 p-5 text-sm text-white/75">
            {cluster.tagline}
          </p>

          <div className="grid flex-1 grid-cols-1 gap-2 overflow-y-auto p-4 sm:grid-cols-2">
            {cluster.services.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                className="hairline group relative overflow-hidden rounded-xl bg-white/[0.02] p-4 transition hover:bg-white/[0.05]"
                data-cursor="hover"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 font-mono text-[10px] font-semibold tracking-wider text-white"
                    style={{
                      background: `linear-gradient(135deg, ${cluster.color}33, transparent)`,
                    }}
                  >
                    {s.glyph}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{s.name}</span>
                    <span className="text-[10px] uppercase tracking-[0.22em] text-white/45">
                      {s.blurb}
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-white/65">{s.use}</p>
                <span
                  className="absolute inset-x-0 bottom-0 h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${cluster.color}, transparent)`,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

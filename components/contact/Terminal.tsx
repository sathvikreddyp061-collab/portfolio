"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const LINES = [
  { tag: "boot", text: "init handshake → secure channel" },
  { tag: "auth", text: "verify identity · keypair OK" },
  { tag: "ping", text: "round-trip 14ms · channel stable" },
  { tag: "ready", text: "awaiting your transmission…" },
];

export default function Terminal() {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setShown((v) => Math.min(v + 1, LINES.length)), 380);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="glass relative overflow-hidden rounded-2xl">
      <div className="flex items-center gap-2 border-b border-white/10 bg-black/40 px-4 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-neon-magenta/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-neon-amber/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-neon-lime/80" />
        <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.32em] text-white/55">
          srp/relay · channel
        </span>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.28em] text-neon-cyan">
          encrypted
        </span>
      </div>
      <div className="space-y-2 p-5 font-mono text-xs leading-relaxed text-white/85">
        {LINES.slice(0, shown).map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="flex gap-3"
          >
            <span className="w-16 text-neon-cyan">[{l.tag}]</span>
            <span className="text-white/80">{l.text}</span>
          </motion.div>
        ))}
        {shown >= LINES.length && (
          <div className="mt-3 flex items-center gap-2 text-white">
            <span className="text-neon-cyan">{"›"}</span>
            <span>compose your message</span>
            <span className="ml-1 inline-block h-3 w-2 animate-glow bg-neon-cyan" />
          </div>
        )}
      </div>
    </div>
  );
}

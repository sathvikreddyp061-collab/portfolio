"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type SectionHeaderProps = {
  index: string;
  kicker: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeader({
  index,
  kicker,
  title,
  subtitle,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-white/55">
        <span className="font-mono text-neon-cyan">{index}</span>
        <span className="h-px w-10 bg-gradient-to-r from-neon-cyan/70 to-transparent" />
        <span>{kicker}</span>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
        className="text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl"
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.35, delay: 0.05, ease: [0.2, 0.8, 0.2, 1] }}
          className="max-w-2xl text-pretty text-base leading-relaxed text-white/65 md:text-lg"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

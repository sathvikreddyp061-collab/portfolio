"use client";

import { ReactNode, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  strength?: number;
  type?: "button" | "submit";
};

export default function MagneticButton({
  children,
  className,
  href,
  onClick,
  strength = 22,
  type = "button",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 220, damping: 18, mass: 0.5 });
  const rx = useTransform(sy, (v) => v * -0.3);
  const ry = useTransform(sx, (v) => v * 0.3);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mx.set(((e.clientX - cx) / (rect.width / 2)) * strength);
    my.set(((e.clientY - cy) / (rect.height / 2)) * strength);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const Tag: any = href ? "a" : "button";
  const tagProps = href ? { href } : { type, onClick };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className="inline-block"
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
      data-cursor="hover"
    >
      <motion.div style={{ x: sx, y: sy }}>
        <Tag
          {...tagProps}
          className={cn(
            "group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm uppercase tracking-[0.22em] text-white backdrop-blur-md transition hover:border-white/30",
            className
          )}
        >
          <span className="relative z-10">{children}</span>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-0 opacity-0 transition group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(120px 80px at var(--x,50%) var(--y,50%), rgba(124,92,255,0.45), transparent 60%)",
            }}
          />
        </Tag>
      </motion.div>
    </motion.div>
  );
}

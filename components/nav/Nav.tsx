"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const sections = [
  { id: "hero", label: "Index" },
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [active, setActive] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { threshold: [0.25, 0.55, 0.75] }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const goTo = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[100] transition-all duration-500",
        scrolled ? "py-2" : "py-5"
      )}
    >
      <div className="container-app flex items-center justify-between">
        <button
          onClick={() => goTo("hero")}
          className="group flex items-center gap-3"
          data-cursor="hover"
        >
          <span className="relative inline-grid h-9 w-9 place-items-center rounded-xl border border-white/15 bg-white/[0.04] backdrop-blur-md">
            <span className="absolute inset-0 rounded-xl opacity-60 blur-md transition group-hover:opacity-100"
                  style={{ background: "conic-gradient(from 180deg at 50% 50%, #22f0ff, #7c5cff, #ff3cac, #22f0ff)" }} />
            <span className="relative font-mono text-[11px] font-semibold tracking-widest text-white/90">
              SR
            </span>
          </span>
          <div className="hidden flex-col leading-none md:flex">
            <span className="text-[11px] uppercase tracking-[0.32em] text-white/50">
              Sathvik Reddy Puli
            </span>
            <span className="text-[10px] uppercase tracking-[0.4em] text-neon-cyan/80">
              Senior Data Engineer
            </span>
          </div>
        </button>

        <nav
          className={cn(
            "hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 backdrop-blur-2xl md:flex",
            scrolled && "shadow-glow-soft"
          )}
        >
          {sections.map((s) => {
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => goTo(s.id)}
                data-cursor="hover"
                className={cn(
                  "relative rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.22em] transition",
                  isActive ? "text-white" : "text-white/55 hover:text-white"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-neon-violet/30 via-neon-cyan/25 to-neon-magenta/25 ring-1 ring-white/15"
                  />
                )}
                {s.label}
              </button>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <a
            href="#contact"
            data-cursor="hover"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white backdrop-blur-md transition hover:border-white/30"
          >
            <span className="h-1.5 w-1.5 animate-glow rounded-full bg-neon-cyan shadow-[0_0_12px_rgba(34,240,255,0.8)]" />
            Available · Q3 2026
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md md:hidden"
        >
          <span className="flex h-3 w-4 flex-col justify-between">
            <span
              className={cn(
                "h-[2px] w-full bg-white transition",
                open ? "translate-y-[5px] rotate-45" : ""
              )}
            />
            <span className={cn("h-[2px] w-full bg-white transition", open ? "opacity-0" : "")} />
            <span
              className={cn(
                "h-[2px] w-full bg-white transition",
                open ? "-translate-y-[5px] -rotate-45" : ""
              )}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="container-app md:hidden"
          >
            <div className="mt-3 grid gap-1 rounded-2xl border border-white/10 bg-ink-glass p-2 backdrop-blur-2xl">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => goTo(s.id)}
                  className={cn(
                    "rounded-xl px-4 py-3 text-left text-sm uppercase tracking-[0.22em] transition",
                    active === s.id
                      ? "bg-white/[0.06] text-white"
                      : "text-white/60 hover:bg-white/[0.04] hover:text-white"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

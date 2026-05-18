"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import CyberGrid from "@/components/ui/CyberGrid";
import Terminal from "./Terminal";

const CHANNELS = [
  {
    label: "Email",
    value: "sathvikreddyp061@gmail.com",
    href: "mailto:sathvikreddyp061@gmail.com",
    glyph: "@",
  },
  {
    label: "Phone",
    value: "+1 940 220 9117",
    href: "tel:+19402209117",
    glyph: "☎",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/sathvik-0d138",
    href: "https://www.linkedin.com/in/sathvik-0d138/",
    glyph: "in",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="relative isolate w-full overflow-hidden py-20 md:py-28">
      <CyberGrid />

      {/* Cinematic ending halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[60%]"
      >
        <div
          className="absolute inset-0 blur-3xl"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, rgba(34,240,255,0.22), rgba(124,92,255,0.18) 35%, transparent 70%)",
          }}
        />
      </div>

      <div className="container-app relative">
        <SectionHeader
          index="04"
          kicker="Open a channel · transmit"
          title={
            <>
              Let's build the{" "}
              <span className="text-gradient-cyber">future together</span>.
            </>
          }
          subtitle={
            <>
              Whether you're rebuilding a streaming spine, embedding LLMs into a regulated
              workflow, or trying to make a 3 AM page disappear — pick a slot and let's talk.
            </>
          }
        />
      </div>

      <div className="container-app relative mt-14 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* Cal.com — primary CTA */}
        <motion.a
          href="https://cal.com/sathvik-reddy/15min"
          target="_blank"
          rel="noreferrer"
          data-cursor="hover"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.3 }}
          className="glass group relative flex flex-col justify-between overflow-hidden rounded-3xl p-6 md:p-10"
        >
          <div
            className="pointer-events-none absolute -inset-1 -z-10 opacity-40 blur-2xl"
            style={{
              background:
                "conic-gradient(from 200deg at 50% 50%, rgba(34,240,255,0.45), rgba(124,92,255,0.45), rgba(255,60,172,0.35), rgba(34,240,255,0.45))",
            }}
          />

          {/* Header tag */}
          <div className="mb-8 flex items-center gap-3">
            <span className="h-1.5 w-1.5 animate-glow rounded-full bg-neon-cyan shadow-[0_0_10px_rgba(34,240,255,0.9)]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/60">
              synchronous mode · cal.com
            </span>
          </div>

          {/* Headline */}
          <div className="flex flex-col gap-5">
            <h3
              className="font-display font-semibold leading-[1.05] tracking-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
            >
              Book a{" "}
              <span className="text-gradient-cyber">15-minute intro</span>
            </h3>
            <p className="max-w-md text-pretty text-base leading-relaxed text-white/70 md:text-lg">
              Architecture review · pipeline triage · system design.
              Pick a slot — Google Meet link auto-attaches to the invite.
            </p>
          </div>

          {/* Footer row — slot hints + arrow */}
          <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-wrap items-center gap-2">
              {["MON", "TUE", "WED", "THU", "FRI"].map((d) => (
                <span
                  key={d}
                  className="hairline rounded-md bg-white/[0.02] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white/65"
                >
                  {d}
                </span>
              ))}
              <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
                · CT · 30 min slots
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-white/70">
                cal.com/sathvik-reddy/15min
              </span>
              <span
                className="grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-white/[0.04] text-2xl text-white transition group-hover:translate-x-1 group-hover:bg-white/[0.08]"
                style={{ boxShadow: "0 0 30px rgba(34,240,255,0.45)" }}
              >
                ↗
              </span>
            </div>
          </div>
        </motion.a>

        {/* Channels + terminal */}
        <div className="flex flex-col gap-6">
          <Terminal />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {CHANNELS.map((c, i) => (
              <motion.a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                data-cursor="hover"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: i * 0.02 }}
                className="hairline group relative overflow-hidden rounded-2xl bg-white/[0.02] p-4 transition hover:bg-white/[0.05]"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-gradient-to-br from-neon-violet/20 to-neon-cyan/20 font-mono text-xs text-white">
                    {c.glyph}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-white/55">
                      {c.label}
                    </div>
                    <div className="truncate text-sm font-medium text-white">{c.value}</div>
                  </div>
                </div>
                <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/60 to-transparent opacity-0 transition group-hover:opacity-100" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

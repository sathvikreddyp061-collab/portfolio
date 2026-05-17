"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ProjectCase } from "@/lib/data/projects";
import PipelineDiagram from "./PipelineDiagram";
import ProjectVisual from "./ProjectVisual";
import { useIsTouch } from "@/lib/hooks/useIsTouch";

export default function ProjectShowcase({
  project,
  index,
}: {
  project: ProjectCase;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouch();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Scroll-bound transforms cause repaint jitter on mobile while the iOS Safari
  // URL bar animates. Hold them flat on touch devices.
  const rawY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const rawHalo = useTransform(scrollYProgress, [0, 0.5, 1], [0.25, 0.55, 0.25]);
  const y = isTouch ? 0 : rawY;
  const halo = isTouch ? 0.35 : rawHalo;

  return (
    <article
      ref={ref}
      className="relative isolate"
      style={{ ["--accent" as any]: project.accent }}
    >
      {/* Mood halo */}
      <motion.div
        aria-hidden
        style={{ opacity: halo }}
        className="pointer-events-none absolute -inset-x-32 -top-24 -z-10 h-[60%]"
      >
        <div
          className="absolute inset-0 blur-3xl"
          style={{
            background: `radial-gradient(60% 50% at 50% 30%, ${project.accent}33, transparent 70%)`,
          }}
        />
      </motion.div>

      <div className="container-app relative">
        {/* Domain banner — industry as huge accent text, focus as subtitle. The
            project lives under a domain, not a client. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="mb-8"
        >
          <div className="mb-3 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em] text-white/55">
            <span style={{ color: project.accent }}>
              {String(index + 1).padStart(2, "0")} · case
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
          </div>
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <h2
              className="font-display font-bold uppercase leading-[0.95] tracking-tight"
              style={{
                fontSize: "clamp(2.25rem, 5.5vw, 5rem)",
                color: project.accent,
                letterSpacing: "-0.025em",
                textShadow: `0 0 40px ${project.accent}55`,
              }}
            >
              {project.industry}
            </h2>
            <span
              className="font-display font-medium uppercase tracking-tight text-white/85"
              style={{ fontSize: "clamp(1rem, 2vw, 1.75rem)" }}
            >
              · {project.focus}
            </span>
          </div>
        </motion.div>

        {/* Header — title+brief on the left, project narrative repositioned
            into the right column (was empty / context card). */}
        <motion.div
          style={{ y }}
          className="grid items-start gap-8 md:grid-cols-[1.1fr_1fr] md:gap-12"
        >
          <div>
            <h3 className="max-w-3xl font-display text-3xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
              {project.title}
            </h3>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/70 md:text-lg">
              {project.brief}
            </p>
          </div>

          {/* Narrative card — moved up here from the body so the empty space
              under the title is filled with the actual story of the project. */}
          <div className="glass relative overflow-hidden rounded-2xl p-6 md:p-7">
            <div
              className="pointer-events-none absolute -inset-px -z-10 rounded-2xl opacity-50 blur-2xl"
              style={{ background: `radial-gradient(60% 50% at 100% 0%, ${project.accent}33, transparent 70%)` }}
            />
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.32em]" style={{ color: project.accent }}>
                // narrative
              </span>
              {project.repoUrl ? (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-colors hover:bg-white/[0.06]"
                  style={{ boxShadow: `inset 0 0 0 1px ${project.accent}44` }}
                >
                  <span
                    className="h-1.5 w-1.5 animate-glow rounded-full"
                    style={{ background: project.accent, boxShadow: `0 0 10px ${project.accent}` }}
                  />
                  <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/75 group-hover:text-white">
                    view on github →
                  </span>
                </a>
              ) : (
                <span className="flex items-center gap-1.5">
                  <span
                    className="h-1.5 w-1.5 animate-glow rounded-full"
                    style={{ background: project.accent, boxShadow: `0 0 10px ${project.accent}` }}
                  />
                  <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/55">
                    production · live
                  </span>
                </span>
              )}
            </div>
            <div className="mt-4 space-y-3.5 text-sm leading-relaxed text-white/75 md:text-[15px]">
              {project.narrative.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Metrics */}
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {project.metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="hairline relative overflow-hidden rounded-xl bg-white/[0.02] p-4"
            >
              <div className="font-display text-3xl font-semibold tracking-tight text-white">
                {m.value}
                {m.unit && <span className="ml-1 text-base text-white/55">{m.unit}</span>}
              </div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.22em] text-white/55">
                {m.label}
              </div>
              <span
                className="absolute inset-x-0 bottom-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${project.accent}, transparent)`,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Body grid — items-start so columns don't stretch.
            Left column gets the pipeline + a project-specific live ops panel. */}
        <div className="mt-12 grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.1fr_1fr]">
          {/* Pipeline + live ops panel */}
          <div className="flex flex-col gap-6">
            <PipelineDiagram pipeline={project.pipeline} accent={project.accent} />
            <ProjectVisual project={project} />
          </div>

          {/* Outcomes + stack — narrative moved up into the header right column */}
          <div className="flex flex-col gap-6">
            <div className="glass relative overflow-hidden rounded-2xl p-6">
              <div className="text-[10px] uppercase tracking-[0.32em] text-white/55">
                Outcomes
              </div>
              <ul className="mt-4 space-y-3">
                {project.outcomes.map((o) => (
                  <li
                    key={o}
                    className="flex items-start gap-3 text-sm leading-relaxed text-white/85"
                  >
                    <span
                      className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{
                        background: project.accent,
                        boxShadow: `0 0 10px ${project.accent}`,
                      }}
                    />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass relative overflow-hidden rounded-2xl p-6">
              <div className="text-[10px] uppercase tracking-[0.32em] text-white/55">
                Stack
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((t) => (
                  <span
                    key={t}
                    className="hairline rounded-full bg-white/[0.03] px-3 py-1 text-[11px] text-white/80"
                    style={{ boxShadow: `inset 0 0 0 1px ${project.accent}22` }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

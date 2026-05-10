"use client";

import SectionHeader from "@/components/ui/SectionHeader";
import CyberGrid from "@/components/ui/CyberGrid";
import ProjectShowcase from "./ProjectShowcase";
import { PROJECTS } from "@/lib/data/projects";

export default function Projects() {
  return (
    <section id="projects" className="relative isolate w-full py-20 md:py-28">
      <CyberGrid />

      <div className="container-app relative">
        <SectionHeader
          index="03"
          kicker="Field work · case studies"
          title={
            <>
              Real systems shipped to{" "}
              <span className="text-gradient-cyber">production</span>.
            </>
          }
          subtitle={
            <>
              These aren't pet projects. Each case is a system that runs today, serving real
              customers — instrumented, observed, and accountable for SLAs measured in
              milliseconds and dollars.
            </>
          }
        />
      </div>

      <div className="mt-16 space-y-24 md:space-y-28">
        {PROJECTS.map((p, i) => (
          <ProjectShowcase key={p.id} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}

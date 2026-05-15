"use client";

import SectionHeader from "@/components/ui/SectionHeader";
import CyberGrid from "@/components/ui/CyberGrid";
import StatsCounter from "./StatsCounter";
import Timeline from "./Timeline";

export default function About() {
  return (
    <section
      id="about"
      className="relative isolate w-full py-20 md:py-28"
    >
      <CyberGrid />

      <div className="container-app relative">
        <SectionHeader
          index="01"
          kicker="Domains · Surfaces"
          title={
            <>
              Three domains, three definitions of{" "}
              <span className="text-gradient">real-time</span>.
            </>
          }
          subtitle={
            <>
              Whether it's a card swipe scoring sub-250ms, a member benefit summary
              refreshing in seconds, or invoices flowing through OCR overnight — the
              fundamentals don't change. Only the constraints do.
            </>
          }
        />

        <div className="mt-14">
          <StatsCounter />
        </div>

        <Timeline />
      </div>
    </section>
  );
}

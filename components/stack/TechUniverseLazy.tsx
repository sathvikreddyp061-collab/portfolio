"use client";

import dynamic from "next/dynamic";

const TechUniverse = dynamic(() => import("./TechUniverse"), {
  ssr: false,
  loading: () => (
    <section className="relative flex min-h-[60vh] items-center justify-center">
      <div className="text-xs uppercase tracking-[0.3em] text-white/40">
        Booting tech universe…
      </div>
    </section>
  ),
});

export default function TechUniverseLazy() {
  return <TechUniverse />;
}

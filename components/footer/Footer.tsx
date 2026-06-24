"use client";

export default function Footer() {
  return (
    <footer className="relative isolate border-t border-white/[0.06] py-10">
      <div className="container-app flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/15 bg-white/[0.04] font-mono text-[10px] font-semibold tracking-widest text-white/85">
            SR
          </span>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.32em] text-white/55">
              Sathvik Reddy Puli
            </span>
            <span className="text-[10px] uppercase tracking-[0.32em] text-neon-cyan">
              Senior Data Engineer
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] uppercase tracking-[0.22em] text-white/55">
          <a href="mailto:sathvikreddyp061@gmail.com" data-cursor="hover" className="hover:text-white">
            sathvikreddyp061@gmail.com
          </a>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <a href="tel:+19402209117" data-cursor="hover" className="hover:text-white">
            +1 940 220 9117
          </a>
        </div>

        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-white/45">
          <span className="font-mono text-neon-cyan">// uptime 99.997%</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}

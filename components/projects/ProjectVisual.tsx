"use client";

import { useEffect, useMemo, useState } from "react";
import { ProjectCase } from "@/lib/data/projects";

/**
 * Project-specific live ops panel — sits under each pipeline diagram and fills
 * the otherwise-empty left column with believable, animated telemetry. Each
 * project gets its own unique panel matched to its domain.
 *
 * Pure SVG + React state with setInterval — no Three.js, no heavy deps.
 * Animations pause when the user prefers reduced motion (handled by browser CSS).
 */
export default function ProjectVisual({ project }: { project: ProjectCase }) {
  switch (project.id) {
    case "fintech":
      return <FintechVisual color={project.accent} />;
    case "healthcare":
      return <HealthcareVisual color={project.accent} />;
    case "enterprise":
      return <EnterpriseVisual color={project.accent} />;
    default:
      return null;
  }
}

/* ---------------------------- Financial — fraud feed ---------------------------- */

type Decision = { id: string; status: "APPROVED" | "BLOCKED" | "REVIEW"; latency: number };

function FintechVisual({ color }: { color: string }) {
  // Deterministic initial state so SSR matches the first client render.
  // Random data is added in useEffect (after hydration).
  const [tps, setTps] = useState(2.4);
  const [p99, setP99] = useState(180);
  const [feed, setFeed] = useState<Decision[]>([]);
  const [spark, setSpark] = useState<number[]>(() => new Array(28).fill(60));

  useEffect(() => {
    // Seed with random data once we're on the client
    setFeed(seedDecisions(5));
    setSpark(seedSpark(28));

    const id = setInterval(() => {
      setTps((v) => clamp(v + (Math.random() - 0.5) * 0.05, 2.1, 2.7));
      setP99((v) => Math.round(clamp(v + (Math.random() - 0.5) * 12, 140, 220)));
      setSpark((s) => [...s.slice(1), Math.round(40 + Math.random() * 60)]);
      if (Math.random() < 0.6) {
        setFeed((f) => [makeDecision(), ...f].slice(0, 5));
      }
    }, 1200);
    return () => clearInterval(id);
  }, []);

  return (
    <Frame title="// realtime · fraud spine" color={color}>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="events / sec" value={`${tps.toFixed(2)}M`} color={color} />
        <Stat label="P99 decision" value={`${p99}ms`} />
      </div>

      <div className="mt-4">
        <Sparkline data={spark} color={color} />
        <div className="mt-1 flex justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-white/40">
          <span>last 30s</span>
          <span>tps · live</span>
        </div>
      </div>

      <div className="mt-4 hairline rounded-xl bg-white/[0.02] p-3">
        <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
          <span>recent decisions</span>
          <span className="flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full"
              style={{ background: color, boxShadow: `0 0 8px ${color}` }}
            />
            streaming
          </span>
        </div>
        <ul className="space-y-1.5">
          {feed.map((d) => (
            <li
              key={d.id}
              className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-black/30 px-3 py-1.5 font-mono text-[11px]"
            >
              <span className="flex items-center gap-2">
                <StatusDot status={d.status} />
                <span className="text-white/85">{d.id}</span>
              </span>
              <span className="flex items-center gap-3">
                <span
                  style={{
                    color:
                      d.status === "APPROVED"
                        ? "#A8FF60"
                        : d.status === "BLOCKED"
                          ? "#ff5c8a"
                          : "#FFB400",
                  }}
                >
                  {d.status}
                </span>
                <span className="text-white/45">{d.latency}ms</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Frame>
  );
}

function makeDecision(): Decision {
  const r = Math.random();
  const status: Decision["status"] = r < 0.78 ? "APPROVED" : r < 0.92 ? "BLOCKED" : "REVIEW";
  return {
    id: `TXN_${Math.random().toString(36).slice(2, 6).toUpperCase()}${Math.floor(Math.random() * 9999)}`,
    status,
    latency: Math.round(80 + Math.random() * 160),
  };
}

function seedDecisions(n: number): Decision[] {
  return Array.from({ length: n }, makeDecision);
}

/* --------------------------- Healthcare — claims pipeline --------------------------- */

function HealthcareVisual({ color }: { color: string }) {
  // Deterministic initial state — random values populate after mount.
  const [bars, setBars] = useState<number[]>(() => new Array(14).fill(55));
  const [claimsToday, setClaimsToday] = useState(1_482_117);
  const [memberHits, setMemberHits] = useState(284_412);

  useEffect(() => {
    setBars(Array.from({ length: 14 }, () => 30 + Math.random() * 60));

    const id = setInterval(() => {
      setBars((b) => [...b.slice(1), 35 + Math.random() * 55]);
      setClaimsToday((v) => v + Math.floor(40 + Math.random() * 90));
      setMemberHits((v) => v + Math.floor(15 + Math.random() * 40));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const dagStatus = useMemo(
    () => Array.from({ length: 18 }, (_, i) => (i === 13 ? "warn" : i === 4 ? "warn" : "ok")),
    []
  );

  return (
    <Frame title="// claims pipeline · live" color={color}>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="claims today" value={fmt(claimsToday)} color={color} />
        <Stat label="member API hits" value={fmt(memberHits)} />
      </div>

      <div className="mt-4 hairline rounded-xl bg-white/[0.02] p-3">
        <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
          <span>throughput · last 14m</span>
          <span className="flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full"
              style={{ background: color, boxShadow: `0 0 8px ${color}` }}
            />
            ingesting
          </span>
        </div>
        <div className="flex h-20 items-end gap-1.5">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm transition-all duration-700"
              style={{
                height: `${h}%`,
                background: `linear-gradient(180deg, ${color} 0%, ${color}33 100%)`,
                boxShadow: `0 0 8px ${color}55`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {[
          { label: "HIPAA", ok: true },
          { label: "Lineage", ok: true },
          { label: "DQ Gates", ok: true },
          { label: "SOC2", ok: true },
          { label: "Audit Trail", ok: true },
        ].map((c) => (
          <span
            key={c.label}
            className="hairline flex items-center gap-1.5 rounded-full bg-white/[0.02] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/75"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-neon-lime shadow-[0_0_6px_rgba(168,255,96,0.9)]" />
            {c.label}
          </span>
        ))}
      </div>

      <div className="mt-4 hairline rounded-xl bg-white/[0.02] p-3">
        <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
          <span>airflow · 18 dags</span>
          <span>16 ok · 2 warn</span>
        </div>
        <div className="grid grid-cols-9 gap-1.5">
          {dagStatus.map((s, i) => (
            <span
              key={i}
              className={`h-3 w-3 rounded-sm ${s === "ok" ? "" : "animate-pulse"}`}
              style={{
                background: s === "ok" ? "rgba(168,255,96,0.9)" : "rgba(255,180,0,0.95)",
                boxShadow:
                  s === "ok"
                    ? "0 0 6px rgba(168,255,96,0.65)"
                    : "0 0 8px rgba(255,180,0,0.85)",
              }}
            />
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* ---------------------------- Enterprise — services health -------------------------- */

function EnterpriseVisual({ color }: { color: string }) {
  const services = useMemo(
    () => [
      { name: "Flask · Auth", lat: 42 },
      { name: "Flask · Billing", lat: 61 },
      { name: "Flask · Reports", lat: 38 },
      { name: "Celery · OCR", lat: 184 },
      { name: "Celery · Email", lat: 22 },
      { name: "Postgres", lat: 8 },
      { name: "Redis", lat: 2 },
      { name: "GitHub Actions", lat: 14 },
    ],
    []
  );
  const [latencies, setLatencies] = useState(services.map((s) => s.lat));
  const [logs, setLogs] = useState<{ t: string; msg: string }[]>(() => [
    { t: "12:42", msg: "Invoice batch processed · 312 documents" },
    { t: "12:38", msg: "Member sync · OK · 4.2k records" },
    { t: "12:31", msg: "Nightly backup completed · 1.4 GB" },
  ]);

  useEffect(() => {
    const id = setInterval(() => {
      setLatencies((l) => l.map((v) => Math.max(2, Math.round(v + (Math.random() - 0.5) * 16))));
      if (Math.random() < 0.4) {
        const samples = [
          "OCR job dispatched · 18 invoices",
          "Cache warm · OK",
          "DB migration applied",
          "Webhook delivered · /finance",
          "Report regenerated · ops weekly",
          "Backup snapshot · daily",
          "Cron tick · 12 jobs OK",
        ];
        const msg = samples[Math.floor(Math.random() * samples.length)];
        const t = new Date();
        const ts = `${pad(t.getHours())}:${pad(t.getMinutes())}`;
        setLogs((curr) => [{ t: ts, msg }, ...curr].slice(0, 5));
      }
    }, 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <Frame title="// services · health" color={color}>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="services" value="14" color={color} />
        <Stat label="uptime · 30d" value="99.4%" />
      </div>

      <div className="mt-4 hairline rounded-xl bg-white/[0.02] p-3">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
          live latency · ms
        </div>
        <ul className="grid grid-cols-2 gap-1.5">
          {services.map((s, i) => (
            <li
              key={s.name}
              className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-black/30 px-2.5 py-1.5 font-mono text-[11px]"
            >
              <span className="flex items-center gap-2 truncate">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-neon-lime"
                  style={{ boxShadow: "0 0 6px rgba(168,255,96,0.85)" }}
                />
                <span className="truncate text-white/85">{s.name}</span>
              </span>
              <span
                style={{
                  color:
                    latencies[i] < 50 ? "#A8FF60" : latencies[i] < 150 ? "#FFB400" : "#ff5c8a",
                }}
              >
                {latencies[i]}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 hairline rounded-xl bg-white/[0.02] p-3">
        <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
          <span>automation log</span>
          <span className="flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full"
              style={{ background: color, boxShadow: `0 0 8px ${color}` }}
            />
            running
          </span>
        </div>
        <ul className="space-y-1.5">
          {logs.map((l, i) => (
            <li key={`${l.t}-${i}`} className="flex gap-3 font-mono text-[11px] text-white/75">
              <span className="shrink-0 text-white/40">[{l.t}]</span>
              <span className="truncate">{l.msg}</span>
            </li>
          ))}
        </ul>
      </div>
    </Frame>
  );
}

/* ------------------------------- SHARED PIECES ------------------------------- */

function Frame({
  title,
  color,
  children,
}: {
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="hairline relative overflow-hidden rounded-2xl bg-black/30 p-4">
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.28em]">
        <span style={{ color }}>{title}</span>
        <span className="text-white/40">live · ops</span>
      </div>
      {children}
      <span
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }}
      />
    </div>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="hairline rounded-xl bg-white/[0.02] px-3 py-3">
      <div
        className="font-display text-2xl font-semibold tracking-tight"
        style={{ color: color ?? "#fff" }}
      >
        {value}
      </div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
        {label}
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: Decision["status"] }) {
  const map = {
    APPROVED: { color: "#A8FF60", char: "✓" },
    BLOCKED: { color: "#ff5c8a", char: "✗" },
    REVIEW: { color: "#FFB400", char: "⚠" },
  };
  const s = map[status];
  return (
    <span
      className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px]"
      style={{
        background: `${s.color}22`,
        color: s.color,
        boxShadow: `0 0 6px ${s.color}55`,
      }}
    >
      {s.char}
    </span>
  );
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 320;
  const h = 60;
  const max = Math.max(...data, 1);
  const step = w / Math.max(data.length - 1, 1);
  const path = data
    .map((v, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (v / max) * (h - 6) - 3}`)
    .join(" ");
  const fillPath = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-16 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sg-${color.replace("#", "")}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#sg-${color.replace("#", "")})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function seedSpark(n: number) {
  return Array.from({ length: n }, () => Math.round(40 + Math.random() * 60));
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
function pad(n: number) {
  return n.toString().padStart(2, "0");
}
function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

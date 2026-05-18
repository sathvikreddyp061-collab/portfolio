"use client";

import { useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Pipeline } from "@/lib/data/projects";

type Layout = {
  width: number;
  height: number;
  nodeW: number;
  nodeH: number;
  positions: Record<string, { x: number; y: number }>;
};

function buildLayout(p: Pipeline): Layout {
  const cols = 4;
  const colWidth = 240;
  const rowHeight = 96;
  const padX = 20;
  const padY = 20;
  const nodeW = 200;
  const nodeH = 64;

  const colCounts: number[] = Array(cols).fill(0);
  Object.values(p.columns).forEach((c) => (colCounts[c] = Math.max(colCounts[c], 0)));
  Object.entries(p.rows).forEach(([id, r]) => {
    const c = p.columns[id];
    colCounts[c] = Math.max(colCounts[c], r + 1);
  });

  const maxRows = Math.max(...colCounts, 1);
  const width = padX * 2 + colWidth * cols;
  const height = padY * 2 + rowHeight * maxRows;

  const positions: Layout["positions"] = {};
  Object.keys(p.columns).forEach((id) => {
    const col = p.columns[id];
    const row = p.rows[id] ?? 0;
    const x = padX + col * colWidth + (colWidth - nodeW) / 2;
    const y = padY + row * rowHeight + (rowHeight - nodeH) / 2;
    positions[id] = { x, y };
  });

  return { width, height, nodeW, nodeH, positions };
}

type Anchor = { x: number; y: number };
type Box = { x: number; y: number; w: number; h: number };

// Pick anchor sides + a smooth cubic that always leaves and arrives perpendicular
// to the box edge it's attached to. Cases:
//   - same column: bottom → top (or top → bottom) with vertical tangents
//   - going right: right edge → left edge with horizontal tangents
//   - going left:  left edge  → right edge with horizontal tangents
// Returns the endpoints too so the calling code can position the glow dots
// exactly on the box edge instead of guessing.
function routeEdge(source: Box, target: Box): { d: string; a: Anchor; b: Anchor } {
  const sCenter = { x: source.x + source.w / 2, y: source.y + source.h / 2 };
  const tCenter = { x: target.x + target.w / 2, y: target.y + target.h / 2 };
  const dx = tCenter.x - sCenter.x;
  const dy = tCenter.y - sCenter.y;

  // Same column (or columns overlap horizontally) → route vertically
  if (Math.abs(dx) < source.w / 2 + target.w / 2) {
    const goingDown = dy >= 0;
    const a = { x: sCenter.x, y: goingDown ? source.y + source.h : source.y };
    const b = { x: tCenter.x, y: goingDown ? target.y : target.y + target.h };
    const midY = (a.y + b.y) / 2;
    return { d: `M ${a.x} ${a.y} C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y}`, a, b };
  }

  // Cross-column → route horizontally, anchoring on the side that faces the target
  const goingRight = dx > 0;
  const a = { x: goingRight ? source.x + source.w : source.x, y: sCenter.y };
  const b = { x: goingRight ? target.x : target.x + target.w, y: tCenter.y };
  const midX = (a.x + b.x) / 2;
  return { d: `M ${a.x} ${a.y} C ${midX} ${a.y}, ${midX} ${b.y}, ${b.x} ${b.y}`, a, b };
}

export default function PipelineDiagram({
  pipeline,
  accent,
}: {
  pipeline: Pipeline;
  accent: string;
}) {
  const layout = useMemo(() => buildLayout(pipeline), [pipeline]);
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Tracking the wrapping <div> is reliable across browsers.
  // IntersectionObserver on SVG <g> children is flaky, especially on mobile,
  // which left nodes stuck at opacity 0.
  const inView = useInView(wrapperRef, { once: true, margin: "-10% 0px" });
  // Note: the dashed flow used to be JS-animated via a per-diagram RAF that
  // called setProperty('--flow-offset', ...) every frame. With three diagrams
  // that was three RAFs writing styles forever, even when the diagrams were
  // offscreen — visibly competing with scroll. It's now a pure CSS keyframe
  // (see the <style jsx> block below) which the compositor can run on its
  // own thread.

  return (
    <div ref={wrapperRef} className="hairline relative overflow-hidden rounded-2xl bg-black/30 p-2">
      {/* Right-edge fade tells mobile users the diagram scrolls horizontally. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-2 right-2 z-10 w-12 rounded-r-2xl bg-gradient-to-l from-black/80 to-transparent md:hidden"
      />
      <div className="overflow-x-auto">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          width="100%"
          height={layout.height}
          style={{ minWidth: layout.width }}
          className="block pipeline-svg"
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Endpoint dot for clearly anchoring the connection to each node */}
            <radialGradient id={`endcap-${accent.replace("#", "")}`}>
              <stop offset="0%" stopColor={accent} stopOpacity="1" />
              <stop offset="60%" stopColor={accent} stopOpacity="0.6" />
              <stop offset="100%" stopColor={accent} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background grid */}
          <g opacity="0.18">
            {Array.from({ length: Math.ceil(layout.width / 24) }).map((_, i) => (
              <line
                key={`v${i}`}
                x1={i * 24}
                y1={0}
                x2={i * 24}
                y2={layout.height}
                stroke="#22f0ff"
                strokeOpacity="0.18"
                strokeWidth="0.5"
              />
            ))}
            {Array.from({ length: Math.ceil(layout.height / 24) }).map((_, i) => (
              <line
                key={`h${i}`}
                x1={0}
                y1={i * 24}
                x2={layout.width}
                y2={i * 24}
                stroke="#7c5cff"
                strokeOpacity="0.18"
                strokeWidth="0.5"
              />
            ))}
          </g>

          {/* Edges — drawn as clean solid lines so connections clearly anchor to each
              node, with an animated dashed flow on top for the "live data" feel and
              small glowing endpoint dots so the eye can follow every connection. */}
          {pipeline.edges.map((e, i) => {
            const a = layout.positions[e.from];
            const b = layout.positions[e.to];
            if (!a || !b) return null;
            const { d, a: aAnchor, b: bAnchor } = routeEdge(
              { x: a.x, y: a.y, w: layout.nodeW, h: layout.nodeH },
              { x: b.x, y: b.y, w: layout.nodeW, h: layout.nodeH }
            );
            const endcap = `url(#endcap-${accent.replace("#", "")})`;
            return (
              <g key={i}>
                {/* Solid background line — full opacity, no fade at endpoints */}
                <path
                  d={d}
                  stroke={accent}
                  strokeOpacity="0.55"
                  strokeWidth="1.4"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Endpoint glow at the source node */}
                <circle cx={aAnchor.x} cy={aAnchor.y} r="4" fill={endcap} />
                {/* Endpoint glow at the target node */}
                <circle cx={bAnchor.x} cy={bAnchor.y} r="4" fill={endcap} />
                {/* Animated dashed flow on top — stroke-dashoffset driven by a
                    pure CSS keyframe (see <style jsx>) so the compositor runs
                    it without main-thread work. */}
                <motion.path
                  d={d}
                  stroke={accent}
                  strokeWidth="1.6"
                  fill="none"
                  strokeDasharray="6 14"
                  strokeLinecap="round"
                  className="pipeline-flow"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                  transition={{ duration: 1.2, delay: i * 0.04, ease: [0.2, 0.8, 0.2, 1] }}
                  style={{ filter: "url(#glow)" }}
                />
              </g>
            );
          })}

          {/* Nodes */}
          {Object.entries(layout.positions).map(([id, p], i) => {
            const node = pipeline.nodes.find((n) => n.id === id)!;
            return (
              <motion.g
                key={id}
                initial={{ opacity: 0, y: 6 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <rect
                  x={p.x}
                  y={p.y}
                  width={layout.nodeW}
                  height={layout.nodeH}
                  rx={12}
                  fill="rgba(8,10,20,0.85)"
                  stroke={accent}
                  strokeOpacity="0.55"
                  strokeWidth="1"
                />
                <rect
                  x={p.x}
                  y={p.y}
                  width={layout.nodeW}
                  height={2}
                  rx={1}
                  fill={accent}
                  opacity="0.85"
                />
                <text
                  x={p.x + 16}
                  y={p.y + 26}
                  fill="#fff"
                  fontSize="13"
                  fontWeight="600"
                  fontFamily="Inter, system-ui, sans-serif"
                >
                  {node.label}
                </text>
                {node.sub && (
                  <text
                    x={p.x + 16}
                    y={p.y + 44}
                    fill="rgba(255,255,255,0.55)"
                    fontSize="10"
                    fontFamily="Inter, system-ui, sans-serif"
                    style={{ letterSpacing: "0.18em", textTransform: "uppercase" }}
                  >
                    {node.sub}
                  </text>
                )}
                {/* status dot */}
                <circle
                  cx={p.x + layout.nodeW - 14}
                  cy={p.y + 14}
                  r="3"
                  fill={accent}
                  opacity="0.95"
                >
                  <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" />
                </circle>
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 text-[10px] uppercase tracking-[0.28em] text-white/55">
        <span className="font-mono" style={{ color: accent }}>
          // {pipeline.title}
        </span>
        <span className="hidden md:inline">
          flow · animated · gpu accelerated
        </span>
      </div>

      <style jsx>{`
        .pipeline-svg :global(.pipeline-flow) {
          animation: pipeline-flow 0.9s linear infinite;
        }
        @keyframes pipeline-flow {
          to { stroke-dashoffset: -20; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pipeline-svg :global(.pipeline-flow) { animation: none; }
        }
      `}</style>
    </div>
  );
}

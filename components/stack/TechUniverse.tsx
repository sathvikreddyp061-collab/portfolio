"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import SectionHeader from "@/components/ui/SectionHeader";
import CyberGrid from "@/components/ui/CyberGrid";
import EcosystemPanel from "./EcosystemPanel";
import { TECH_CLUSTERS, TechCluster } from "@/lib/data/tech";
import { useMousePos } from "@/lib/hooks/useMousePos";
import { useIsTouch } from "@/lib/hooks/useIsTouch";

/** Pulsing dual-layer core: solid emissive sphere + outer wireframe shell that breathes. */
function CoreOrb() {
  const wireRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const auraRef = useRef<THREE.Mesh>(null);
  const innerMatRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state, dt) => {
    if (wireRef.current) {
      wireRef.current.rotation.y += dt * 0.22;
      wireRef.current.rotation.x += dt * 0.08;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= dt * 0.14;
    }
    // Breathing: pulse emissive intensity and aura scale
    const t = state.clock.elapsedTime;
    const pulse = 0.5 + 0.5 * Math.sin(t * 1.6);
    if (innerMatRef.current) {
      innerMatRef.current.emissiveIntensity = 0.6 + pulse * 0.7;
    }
    if (auraRef.current) {
      const s = 1.05 + pulse * 0.18;
      auraRef.current.scale.set(s, s, s);
      (auraRef.current.material as THREE.MeshBasicMaterial).opacity = 0.08 + pulse * 0.12;
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
      {/* Outer wireframe shell */}
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshBasicMaterial color="#22f0ff" wireframe transparent opacity={0.55} />
      </mesh>
      {/* Inner glowing core */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.55, 2]} />
        <meshStandardMaterial
          ref={innerMatRef}
          color="#0a0c1a"
          emissive="#7c5cff"
          emissiveIntensity={0.9}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      {/* Soft outer aura sphere — additive blend */}
      <mesh ref={auraRef}>
        <sphereGeometry args={[1.45, 32, 32]} />
        <meshBasicMaterial
          color="#22f0ff"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </Float>
  );
}

/** Sparse starfield backdrop — additive points, no shaders. */
function Starfield({ count = 220 }: { count?: number }) {
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 12 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      a[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      a[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      a[i * 3 + 2] = r * Math.cos(phi);
    }
    return a;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#bcefff"
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * Energy beam — a glowing line from the core to a tracked node, plus a small
 * "data packet" orb that travels along the beam from core → node continuously.
 * Pulses brighter when the node is hovered.
 */
function EnergyBeam({
  targetRef,
  color,
  hovered,
}: {
  targetRef: React.MutableRefObject<THREE.Vector3>;
  color: string;
  hovered: boolean;
}) {
  const lineRef = useRef<THREE.Line>(null);
  const matRef = useRef<THREE.LineBasicMaterial>(null);
  const orbRef = useRef<THREE.Mesh>(null);
  const orbMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const phase = useRef(Math.random());
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(2 * 3), 3));
    return g;
  }, []);

  useFrame((state, dt) => {
    if (!lineRef.current || !matRef.current) return;

    // 1. Update line endpoints to track the (moving) node
    const arr = (geo.getAttribute("position") as THREE.BufferAttribute).array as Float32Array;
    arr[3] = targetRef.current.x;
    arr[4] = targetRef.current.y;
    arr[5] = targetRef.current.z;
    (geo.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;

    // 2. Pulse the line opacity in a sine wave (with hover boost)
    const pulse = 0.5 + 0.5 * Math.sin(state.clock.elapsedTime * 1.6 + phase.current * 8);
    matRef.current.opacity = (hovered ? 0.85 : 0.28) + pulse * 0.12;

    // 3. Move the "data packet" orb along the beam, faster on hover
    phase.current = (phase.current + dt * (hovered ? 1.1 : 0.45)) % 1;
    if (orbRef.current) {
      const t = phase.current;
      orbRef.current.position.set(
        targetRef.current.x * t,
        targetRef.current.y * t,
        targetRef.current.z * t
      );
      const s = hovered ? 0.18 : 0.10;
      orbRef.current.scale.setScalar(s);
    }
    if (orbMatRef.current) {
      orbMatRef.current.opacity = hovered ? 1 : 0.75;
    }
  });

  return (
    <>
      {/* @ts-expect-error - r3f's <line> JSX intrinsic clashes with SVG line types */}
      <line ref={lineRef} geometry={geo}>
        <lineBasicMaterial
          ref={matRef}
          color={color}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </line>
      <mesh ref={orbRef}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial
          ref={orbMatRef}
          color={color}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
}

function OrbitNode({
  cluster,
  index,
  total,
  hoveredId,
  onHover,
  onSelect,
  baseRadius,
  positionRef,
}: {
  cluster: TechCluster;
  index: number;
  total: number;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (c: TechCluster) => void;
  baseRadius: number;
  positionRef?: React.MutableRefObject<THREE.Vector3>;
}) {
  const group = useRef<THREE.Group>(null);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  const ringSpeed = useMemo(() => 0.06 + (index % 3) * 0.04, [index]);
  const tilt = useMemo(() => (index / total) * Math.PI * 2, [index, total]);
  const radius = useMemo(() => baseRadius + (index % 2 === 0 ? 0 : 0.7), [baseRadius, index]);
  const isHovered = hoveredId === cluster.id;

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime * ringSpeed + phase;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    const y = Math.sin(t * 1.4 + index) * 0.6;
    group.current.position.set(x, y, z);
    group.current.rotation.y = -t + Math.PI / 2;
    const targetScale = isHovered ? 1.55 : hoveredId ? 0.8 : 1;
    group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);
    if (positionRef) positionRef.current.set(x, y, z);
  });

  return (
    <group ref={group} rotation={[tilt * 0.05, 0, 0]}>
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.4}>
        {/* Invisible sphere collider — keeps R3F pointer events working for hover/click on the node */}
        <mesh
          visible={false}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(cluster.id);
            document.body.style.cursor = "none";
          }}
          onPointerOut={() => onHover(null)}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(cluster);
          }}
        >
          <sphereGeometry args={[0.55, 12, 12]} />
        </mesh>

        {/* Inner glow halo */}
        <mesh>
          <ringGeometry args={[0.7, 0.74, 64]} />
          <meshBasicMaterial
            color={cluster.color}
            transparent
            opacity={isHovered ? 0.85 : 0.28}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Outer pulse halo — only visible on hover */}
        <mesh>
          <ringGeometry args={[0.95, 1.02, 64]} />
          <meshBasicMaterial
            color={cluster.color}
            transparent
            opacity={isHovered ? 0.45 : 0}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Logo badge — glowing glass card holding the brand mark */}
        <Html
          center
          distanceFactor={6}
          position={[0, 0, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div
            className="grid select-none place-items-center rounded-2xl border bg-black/70 backdrop-blur-md transition-all duration-200"
            style={{
              width: 72,
              height: 72,
              borderColor: isHovered ? cluster.color : "rgba(255,255,255,0.18)",
              boxShadow: isHovered
                ? `0 0 40px ${cluster.color}, inset 0 0 16px ${cluster.color}55`
                : `0 0 20px ${cluster.color}66, inset 0 0 12px ${cluster.color}33`,
              transform: isHovered ? "scale(1.18)" : "scale(1)",
            }}
          >
            {cluster.logo ? (
              <img
                src={cluster.logo}
                alt={cluster.name}
                width={44}
                height={44}
                style={{
                  filter: `drop-shadow(0 0 8px ${cluster.color})`,
                  pointerEvents: "none",
                }}
              />
            ) : (
              <span
                className="font-mono text-sm font-bold text-white"
                style={{ filter: `drop-shadow(0 0 8px ${cluster.color})` }}
              >
                {cluster.glyph}
              </span>
            )}
          </div>
        </Html>

        {/* Name + category label below the badge */}
        <Html
          center
          distanceFactor={9}
          position={[0, -1.15, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div
            className="select-none whitespace-nowrap rounded-2xl border bg-black/70 px-3 py-1.5 text-center backdrop-blur-md transition-all duration-200"
            style={{
              borderColor: isHovered ? cluster.color : "rgba(255,255,255,0.10)",
              boxShadow: isHovered
                ? `0 0 30px ${cluster.color}, inset 0 0 12px ${cluster.color}55`
                : `0 0 18px ${cluster.color}44`,
              transform: isHovered ? "scale(1.1)" : "scale(1)",
            }}
          >
            <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white">
              {cluster.name}
            </div>
            <div
              className="font-mono text-[8px] uppercase tracking-[0.32em]"
              style={{ color: isHovered ? cluster.color : "rgba(255,255,255,0.45)" }}
            >
              {cluster.category}
            </div>
          </div>
        </Html>
      </Float>
    </group>
  );
}

function OrbitRing({ radius, color = "#22f0ff", opacity = 0.15 }: { radius: number; color?: string; opacity?: number }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.005, radius + 0.005, 128]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Scene({
  hovered,
  setHovered,
  onSelect,
  isTouch,
}: {
  hovered: string | null;
  setHovered: (id: string | null) => void;
  onSelect: (c: TechCluster) => void;
  isTouch: boolean;
}) {
  const mouseRef = useMousePos();
  const groupRef = useRef<THREE.Group>(null);

  // One position ref per cluster, kept in sync by each OrbitNode each frame.
  // Beams read from these to draw dynamic lines from the core to each node.
  const positionRefs = useMemo(
    () => TECH_CLUSTERS.map(() => ({ current: new THREE.Vector3() })),
    []
  );

  useFrame(() => {
    if (!groupRef.current) return;
    const m = mouseRef.current;
    // Mouse-driven group rotation, plus a slight bias toward the hovered node
    let bx = m.nx * 0.4;
    let by = -m.ny * 0.18;
    if (hovered) {
      const idx = TECH_CLUSTERS.findIndex((c) => c.id === hovered);
      if (idx >= 0) {
        const p = positionRefs[idx].current;
        bx += -p.x * 0.04;
        by += p.y * 0.04;
      }
    }
    groupRef.current.rotation.y += (bx - groupRef.current.rotation.y) * 0.04;
    groupRef.current.rotation.x += (by - groupRef.current.rotation.x) * 0.04;
  });

  return (
    <>
      <ambientLight intensity={0.45} />
      <pointLight position={[6, 6, 6]} intensity={1.4} color="#22f0ff" />
      <pointLight position={[-6, -3, 3]} intensity={1.1} color="#7c5cff" />
      <pointLight position={[0, 0, -4]} intensity={0.6} color="#ff3cac" />

      {/* Background starfield — fewer stars on mobile to save fillrate */}
      <Starfield count={isTouch ? 90 : 220} />

      <group ref={groupRef}>
        <CoreOrb />

        {/* Three orbit rings at different inclinations — feels like a real solar system */}
        <group rotation={[0, 0, 0]}>
          <OrbitRing radius={3.2} color="#22f0ff" opacity={0.18} />
        </group>
        <group rotation={[0.35, 0.25, 0]}>
          <OrbitRing radius={3.9} color="#7c5cff" opacity={0.14} />
        </group>
        <group rotation={[-0.3, -0.2, 0.1]}>
          <OrbitRing radius={4.4} color="#ff3cac" opacity={0.10} />
        </group>

        {/* Energy beams — desktop only. Each beam = 1 line + 1 sphere updated every frame.
            Skipping on mobile saves ~20 draw calls per frame. */}
        {!isTouch &&
          TECH_CLUSTERS.map((c, i) => (
            <EnergyBeam
              key={`beam-${c.id}`}
              targetRef={positionRefs[i]}
              color={c.color}
              hovered={hovered === c.id}
            />
          ))}

        {/* Orbiting tech nodes */}
        {TECH_CLUSTERS.map((c, i) => (
          <OrbitNode
            key={c.id}
            cluster={c}
            index={i}
            total={TECH_CLUSTERS.length}
            hoveredId={hovered}
            onHover={setHovered}
            onSelect={onSelect}
            baseRadius={3.2}
            positionRef={positionRefs[i]}
          />
        ))}
      </group>
    </>
  );
}

export default function TechUniverse() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [active, setActive] = useState<TechCluster | null>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const [canvasVisible, setCanvasVisible] = useState(false);
  const isTouch = useIsTouch();

  useEffect(() => {
    if (!canvasWrapRef.current) return;
    const io = new IntersectionObserver(
      ([entry]) => setCanvasVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    io.observe(canvasWrapRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="stack"
      className="relative isolate w-full overflow-hidden py-20 md:py-28"
    >
      <CyberGrid />

      <div className="container-app relative">
        <SectionHeader
          index="02"
          kicker="Technology Universe · interactive"
          title={
            <>
              The constellation I work{" "}
              <span className="text-gradient-cyber">across</span>.
            </>
          }
          subtitle={
            <>
              Hover the orbiting nodes to lift each technology, click to expand its full ecosystem
              with the real services I've shipped on. Drag the canvas to rotate the universe.
            </>
          }
        />
      </div>

      <div className="container-app relative mt-12">
        {/* Canvas + ecosystem panel — side-by-side on desktop when a cluster is
            selected so the panel never occludes the globe. Stack vertically on
            mobile where horizontal space is tight. */}
        <div
          className={`grid gap-6 transition-[grid-template-columns] duration-500 ease-out ${
            active ? "lg:grid-cols-[3fr_2fr]" : "grid-cols-1"
          }`}
        >
          <div
            ref={canvasWrapRef}
            className="glass relative h-[540px] w-full overflow-hidden rounded-3xl md:h-[640px]"
          >
            {/* Coordinate frame */}
            <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 backdrop-blur-md">
              <span className="h-1.5 w-1.5 animate-glow rounded-full bg-neon-cyan shadow-[0_0_10px_rgba(34,240,255,0.9)]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/70">
                cluster · live
              </span>
            </div>
            <div className="pointer-events-none absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-black/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-white/70 backdrop-blur-md">
              drag · zoom · click
            </div>

            <Canvas
              dpr={isTouch ? [1, 1] : [1, 1.4]}
              frameloop={canvasVisible ? "always" : "demand"}
              gl={{
                antialias: false,
                alpha: true,
                powerPreference: "high-performance",
                stencil: false,
                depth: true,
              }}
              camera={{ position: [0, 1.6, 8], fov: 55 }}
            >
              <color attach="background" args={["#02030a"]} />
              <fog attach="fog" args={["#02030a", 9, 18]} />
              <Suspense fallback={null}>
                <Scene
                  hovered={hovered}
                  setHovered={setHovered}
                  onSelect={setActive}
                  isTouch={isTouch}
                />
              </Suspense>
              <OrbitControls
                enablePan={false}
                enableZoom={!isTouch}
                minDistance={6}
                maxDistance={12}
                autoRotate
                autoRotateSpeed={isTouch ? 0.25 : 0.4}
              />
            </Canvas>
          </div>

          <EcosystemPanel cluster={active} onClose={() => setActive(null)} />
        </div>

        {/* Cluster legend grid */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {TECH_CLUSTERS.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c)}
              onMouseEnter={() => setHovered(c.id)}
              onMouseLeave={() => setHovered(null)}
              data-cursor="hover"
              className="group hairline relative overflow-hidden rounded-xl bg-white/[0.02] px-4 py-3 text-left transition hover:bg-white/[0.05]"
            >
              <div className="flex items-center gap-3">
                <span
                  className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 font-mono text-[10px] font-semibold tracking-wider text-white"
                  style={{
                    background: `linear-gradient(135deg, ${c.color}55, transparent 70%)`,
                    boxShadow: `inset 0 0 10px ${c.color}33`,
                  }}
                >
                  {c.logo ? (
                    <img
                      src={c.logo}
                      alt={c.name}
                      width={18}
                      height={18}
                      style={{ filter: `drop-shadow(0 0 4px ${c.color})` }}
                    />
                  ) : (
                    c.glyph
                  )}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-white">{c.name}</div>
                  <div className="truncate text-[10px] uppercase tracking-[0.22em] text-white/45">
                    {c.category}
                  </div>
                </div>
              </div>
              <span
                className="absolute inset-x-0 bottom-0 h-px opacity-60 transition group-hover:opacity-100"
                style={{
                  background: `linear-gradient(90deg, transparent, ${c.color}, transparent)`,
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

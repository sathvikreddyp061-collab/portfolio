"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Node = { p: THREE.Vector3; v: THREE.Vector3 };

export default function NeuralNetwork({
  nodes = 70,
  bound = 6,
  linkDist = 1.6,
  mouseRef,
}: {
  nodes?: number;
  bound?: number;
  linkDist?: number;
  mouseRef?: React.MutableRefObject<{ nx: number; ny: number }>;
}) {
  const linesRef = useRef<THREE.LineSegments>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const frameCount = useRef(0);
  const lastDrawCount = useRef(0);

  const ns: Node[] = useMemo(() => {
    return Array.from({ length: nodes }, () => ({
      p: new THREE.Vector3(
        (Math.random() - 0.5) * bound * 2,
        (Math.random() - 0.5) * bound * 1.2,
        (Math.random() - 0.5) * bound * 0.6
      ),
      v: new THREE.Vector3(
        (Math.random() - 0.5) * 0.012,
        (Math.random() - 0.5) * 0.012,
        (Math.random() - 0.5) * 0.006
      ),
    }));
  }, [nodes, bound]);

  const linePositions = useMemo(() => new Float32Array(nodes * nodes * 6), [nodes]);
  const lineColors = useMemo(() => new Float32Array(nodes * nodes * 6), [nodes]);
  const pointPositions = useMemo(() => new Float32Array(nodes * 3), [nodes]);

  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));
    return g;
  }, [linePositions, lineColors]);

  const pointGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pointPositions, 3));
    return g;
  }, [pointPositions]);

  useFrame(() => {
    const mx = mouseRef?.current?.nx ?? 0;
    const my = mouseRef?.current?.ny ?? 0;

    for (let i = 0; i < ns.length; i++) {
      const n = ns[i];
      n.p.add(n.v);
      // gentle attract toward cursor in screen plane
      n.v.x += (mx * 1.6 - n.p.x) * 0.00005;
      n.v.y += (-my * 1.0 - n.p.y) * 0.00005;
      // soft bounds
      if (Math.abs(n.p.x) > bound) n.v.x *= -1;
      if (Math.abs(n.p.y) > bound * 0.7) n.v.y *= -1;
      if (Math.abs(n.p.z) > bound * 0.4) n.v.z *= -1;
      pointPositions[i * 3] = n.p.x;
      pointPositions[i * 3 + 1] = n.p.y;
      pointPositions[i * 3 + 2] = n.p.z;
    }

    // Edge graph is O(n²) — recompute every 3rd frame to keep it cheap.
    // Visually indistinguishable because edges fade by distance anyway.
    frameCount.current++;
    const recomputeEdges = frameCount.current % 3 === 0;

    if (recomputeEdges) {
      let li = 0;
      let ci = 0;
      const maxD2 = linkDist * linkDist;
      for (let i = 0; i < ns.length; i++) {
        for (let j = i + 1; j < ns.length; j++) {
          const a = ns[i].p;
          const b = ns[j].p;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dz = a.z - b.z;
          const d2 = dx * dx + dy * dy + dz * dz;
          if (d2 > maxD2) continue;
          const t = 1 - d2 / maxD2;
          linePositions[li++] = a.x;
          linePositions[li++] = a.y;
          linePositions[li++] = a.z;
          linePositions[li++] = b.x;
          linePositions[li++] = b.y;
          linePositions[li++] = b.z;
          const r = 0.13 + 0.55 * (1 - t);
          const g = 0.85 * t + 0.35 * (1 - t);
          lineColors[ci++] = r;
          lineColors[ci++] = g;
          lineColors[ci++] = 1.0;
          lineColors[ci++] = r;
          lineColors[ci++] = g;
          lineColors[ci++] = 1.0;
        }
      }
      lastDrawCount.current = li / 3;
      (lineGeo.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
      (lineGeo.getAttribute("color") as THREE.BufferAttribute).needsUpdate = true;
      lineGeo.setDrawRange(0, lastDrawCount.current);
    }

    (pointGeo.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <group>
      <lineSegments ref={linesRef} geometry={lineGeo}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
      <points ref={pointsRef} geometry={pointGeo}>
        <pointsMaterial
          size={0.06}
          color="#bcefff"
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

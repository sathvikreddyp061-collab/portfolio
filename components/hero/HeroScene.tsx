"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import ParticleField from "./ParticleField";
import { useMousePos } from "@/lib/hooks/useMousePos";

function CameraRig({ mouseRef }: { mouseRef: React.MutableRefObject<{ nx: number; ny: number }> }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 0));
  useFrame(() => {
    const m = mouseRef.current;
    const tx = m.nx * 0.8;
    const ty = -m.ny * 0.45;
    camera.position.x += (tx - camera.position.x) * 0.04;
    camera.position.y += (ty - camera.position.y) * 0.04;
    camera.lookAt(target.current);
  });
  return null;
}

function ScrollFade() {
  const { camera } = useThree();
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const z = 12 + Math.min(y / 80, 8);
      (camera as THREE.PerspectiveCamera).position.z = z;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [camera]);
  return null;
}

export default function HeroScene() {
  const mouseRef = useMousePos();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  // Pause rendering when the hero scrolls offscreen
  useEffect(() => {
    if (!wrapRef.current) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.05 }
    );
    io.observe(wrapRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="h-full w-full">
      <Canvas
        dpr={[1, 1.4]}
        frameloop={active ? "always" : "demand"}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          alpha: true,
          stencil: false,
          depth: true,
        }}
        camera={{ position: [0, 0, 12], fov: 55, near: 0.1, far: 80 }}
      >
        <color attach="background" args={["#02030a"]} />
        <fog attach="fog" args={["#02030a", 14, 32]} />

        <ambientLight intensity={0.5} />
        <pointLight position={[6, 4, 4]} intensity={1.2} color="#22f0ff" />
        <pointLight position={[-6, -3, 2]} intensity={1.0} color="#7c5cff" />

        <ParticleField mouseRef={mouseRef as any} count={900} />

        <CameraRig mouseRef={mouseRef as any} />
        <ScrollFade />
      </Canvas>
    </div>
  );
}

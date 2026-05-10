"use client";

import { useEffect, useRef } from "react";
import { lerp } from "@/lib/utils";

/**
 * Cinematic 3D cursor — minimal & clean:
 *  - Inner orb: glossy gradient bead with depth (the dot you're "pointing" with)
 *  - Outer ring: gradient stroke that springs to the cursor with damping
 *  - Velocity-aware tilt + spin for a sense of motion (3D feel without bloom)
 *  - Hover: orb shrinks (focus point), ring expands and brightens (reticle)
 */
export default function CustomCursor() {
  const orbRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const target = useRef({ x: 0, y: 0 });
  const orb = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });

  const hover = useRef(false);
  const visible = useRef(false);
  const pressed = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      visible.current = true;

      const el = e.target as HTMLElement | null;
      hover.current = !!el?.closest(
        "a, button, [data-cursor='hover'], [role='button'], input, textarea, select, label, summary"
      );
    };

    const onDown = () => (pressed.current = true);
    const onUp = () => (pressed.current = false);
    const onLeave = () => (visible.current = false);
    const onEnter = () => (visible.current = true);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    let raf = 0;
    let prevX = 0;
    let prevY = 0;
    let ringRot = 0;

    const tick = () => {
      // Two-layer parallax — orb snaps fast, ring trails with spring damping
      orb.current.x = lerp(orb.current.x, target.current.x, 0.6);
      orb.current.y = lerp(orb.current.y, target.current.y, 0.6);
      ring.current.x = lerp(ring.current.x, target.current.x, 0.22);
      ring.current.y = lerp(ring.current.y, target.current.y, 0.22);

      vel.current.x = orb.current.x - prevX;
      vel.current.y = orb.current.y - prevY;
      prevX = orb.current.x;
      prevY = orb.current.y;

      const speed = Math.hypot(vel.current.x, vel.current.y);
      const angle = Math.atan2(vel.current.y, vel.current.x) * (180 / Math.PI);
      ringRot += speed * 0.4;

      const targetVisible = visible.current ? 1 : 0;
      const isHover = hover.current;
      const isPress = pressed.current;

      if (orbRef.current) {
        const scale = isPress ? 0.6 : isHover ? 0.45 : 1;
        orbRef.current.style.transform =
          `translate3d(${orb.current.x}px, ${orb.current.y}px, 0) ` +
          `translate(-50%, -50%) scale(${scale})`;
        orbRef.current.style.opacity = String(targetVisible);
      }

      if (ringRef.current) {
        const scale = isHover ? 1.85 : isPress ? 0.85 : 1;
        ringRef.current.style.transform =
          `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) ` +
          `translate(-50%, -50%) ` +
          `rotateZ(${angle + ringRot * 0.05}deg) ` +
          `rotateX(${vel.current.y * 0.4}deg) ` +
          `rotateY(${vel.current.x * -0.4}deg) ` +
          `scale(${scale})`;
        ringRef.current.style.opacity = String(targetVisible * (isHover ? 1 : 0.8));
      }

      ringRot *= 0.985;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Outer ring — gradient donut, tilts with motion */}
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[120] hidden h-9 w-9 rounded-full opacity-0 will-change-transform md:block"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(34,240,255,0.9), rgba(124,92,255,0.9), rgba(255,60,172,0.9), rgba(34,240,255,0.9))",
          transformStyle: "preserve-3d",
          transition: "opacity 220ms ease",
          WebkitMask:
            "radial-gradient(circle, transparent 62%, #000 63%, #000 100%)",
          mask: "radial-gradient(circle, transparent 62%, #000 63%, #000 100%)",
        }}
      />

      {/* Inner orb — glossy 3D bead */}
      <div
        ref={orbRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[121] hidden h-2.5 w-2.5 rounded-full opacity-0 will-change-transform md:block"
        style={{
          background:
            "radial-gradient(circle at 32% 30%, #ffffff 0%, rgba(180,235,255,0.95) 35%, rgba(124,92,255,0.95) 75%, rgba(20,10,40,0.9) 100%)",
          boxShadow: "inset 0 0 4px rgba(255,255,255,0.55)",
          transition: "opacity 200ms ease",
        }}
      />
    </>
  );
}

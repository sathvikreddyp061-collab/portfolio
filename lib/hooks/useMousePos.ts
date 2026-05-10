"use client";

import { useEffect, useRef } from "react";

export type MouseState = {
  x: number;
  y: number;
  nx: number; // normalized -1..1 across viewport
  ny: number;
};

const state: MouseState = { x: 0, y: 0, nx: 0, ny: 0 };
let bound = false;

function bindOnce() {
  if (bound || typeof window === "undefined") return;
  bound = true;
  window.addEventListener(
    "pointermove",
    (e) => {
      state.x = e.clientX;
      state.y = e.clientY;
      state.nx = (e.clientX / window.innerWidth) * 2 - 1;
      state.ny = (e.clientY / window.innerHeight) * 2 - 1;
    },
    { passive: true }
  );
}

/** Returns a stable ref whose .current updates with the latest mouse coords (no re-renders). */
export function useMousePos() {
  const ref = useRef<MouseState>(state);
  useEffect(() => {
    bindOnce();
  }, []);
  return ref;
}

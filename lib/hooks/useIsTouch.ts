"use client";

import { useEffect, useState } from "react";

/**
 * Returns true on touch / coarse-pointer devices (phones, tablets).
 * Use this to skip mouse-parallax, hover handlers, and other desktop-only effects.
 */
export function useIsTouch() {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setTouch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return touch;
}

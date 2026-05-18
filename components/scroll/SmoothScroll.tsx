"use client";

import { ReactNode } from "react";

// Lenis was the single biggest source of perceived scroll lag — even at
// duration 0.4-0.8s the wheel always trails the input by that much. Native
// browser scroll is instant, so we now pass children through unchanged and
// rely on the OS's own momentum scrolling. Anchor jumps from <Nav> still
// glide because they use `scrollIntoView({ behavior: 'smooth' })`, which is
// a native CSS feature that doesn't add per-frame work.
export default function SmoothScroll({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

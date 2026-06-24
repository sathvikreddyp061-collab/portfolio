"use client";

import { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SmoothScroll from "@/components/scroll/SmoothScroll";
import CustomCursor from "@/components/cursor/CustomCursor";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <CustomCursor />
      {children}
      {/* Privacy-friendly visitor counts + real-user performance metrics. */}
      <Analytics />
      <SpeedInsights />
    </SmoothScroll>
  );
}

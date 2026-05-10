"use client";

import { ReactNode } from "react";
import SmoothScroll from "@/components/scroll/SmoothScroll";
import CustomCursor from "@/components/cursor/CustomCursor";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <CustomCursor />
      {children}
    </SmoothScroll>
  );
}

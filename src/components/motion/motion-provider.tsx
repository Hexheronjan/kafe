"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { DemoStoreProvider } from "@/lib/demo-store";
import { CartProvider } from "@/components/public/cart";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <DemoStoreProvider>
        <CartProvider>{children}</CartProvider>
      </DemoStoreProvider>
    </MotionConfig>
  );
}

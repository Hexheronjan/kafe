"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/utils";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
      className="flex min-h-dvh flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}

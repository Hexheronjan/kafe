"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

export function CursorGlow() {
  const reduce = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);
  const x = useMotionValue(-300);
  const y = useMotionValue(-300);
  const sx = useSpring(x, { stiffness: 120, damping: 24, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 120, damping: 24, mass: 0.4 });

  useEffect(() => {
    if (reduce) return;
    const mq = window.matchMedia("(pointer: fine)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFinePointer(mq.matches);
    const move = (e: MouseEvent) => {
      x.set(e.clientX - 180);
      y.set(e.clientY - 180);
    };
    if (mq.matches) window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [reduce, x, y]);

  if (reduce || !finePointer) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed top-0 left-0 z-[85] h-[360px] w-[360px] rounded-full opacity-20 mix-blend-multiply blur-3xl"
    >
      <div className="h-full w-full rounded-full bg-[radial-gradient(circle,var(--brand)_0%,transparent_70%)]" />
    </motion.div>
  );
}

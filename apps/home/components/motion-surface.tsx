"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type MotionSurfaceProps = {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
};

export function MotionSurface({
  children,
  className = "",
  interactive = false,
}: MotionSurfaceProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={false}
      whileHover={
        interactive && !shouldReduceMotion
          ? {
              y: -4,
            }
          : undefined
      }
      transition={{
        duration: 0.28,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

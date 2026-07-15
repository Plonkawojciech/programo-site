"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Shared scroll-entrance animation — fade + rise on view. Hardened so it NEVER
// leaves content permanently invisible:
//   - initial opacity is 0 (never negative), y-offset capped at 24px
//   - viewport margin only trims 8% off the bottom, so short/above-the-fold
//     sections still trigger
//   - a 1.2 s mount fallback forces the visible state even if the
//     IntersectionObserver never fires
//   - prefers-reduced-motion renders content statically (no initial offset)
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const offset = Math.min(Math.max(y, 0), 24);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShown(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: offset }}
      animate={shown ? { opacity: 1, y: 0 } : undefined}
      whileInView={{ opacity: 1, y: 0 }}
      onViewportEnter={() => setShown(true)}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

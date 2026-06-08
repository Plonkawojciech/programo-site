"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

// Shared scroll-entrance animation — the exact pattern the homepage uses
// (fade + rise, ease [0.16,1,0.3,1], once on view). Thin client wrapper so the
// static, server-rendered landing content can still animate in like the homepage.
export default function Reveal({
  children,
  delay = 0,
  y = 40,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

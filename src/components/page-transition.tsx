"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { easeEntry, durationMedium } from "@/lib/motion";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduce
          ? { duration: 0 }
          : { duration: durationMedium, ease: easeEntry as [number, number, number, number] }
      }
    >
      {children}
    </motion.div>
  );
}

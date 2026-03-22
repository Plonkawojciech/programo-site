"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { easeEntry, durationMedium } from "@/lib/motion";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: easeEntry as [number, number, number, number],
      }}
    >
      {children}
    </motion.div>
  );
}

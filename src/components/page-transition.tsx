"use client";

import { type ReactNode } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { easeEntry } from "@/lib/motion";
import { CustomCursor } from "@/components/ui/custom-cursor";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: easeEntry as [number, number, number, number],
      }}
    >
      {/* Scroll progress — thin gold line at very top */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[1px] z-[9998] origin-left"
        style={{
          scaleX: smoothProgress,
          backgroundColor: "#C8A44E",
        }}
      />

      {/* Custom cursor */}
      <CustomCursor />

      {children}
    </motion.div>
  );
}

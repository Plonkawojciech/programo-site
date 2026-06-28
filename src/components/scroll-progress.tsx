"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    damping: 40,
    stiffness: 200,
    mass: 0.3,
  });

  return (
    /* Top horizontal scroll-progress bar (mobile only) */
    <motion.div
      style={{ scaleX: scaleY, originX: 0 }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--theme-accent)] to-[var(--theme-text-1)] z-[60] md:hidden pointer-events-none"
    />
  );
}

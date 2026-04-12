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
    <>
      {/* Vertical progress bar on the right side */}
      <div className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-[60] hidden md:flex flex-col items-center gap-3 pointer-events-none">
        {/* Track */}
        <div className="relative h-[40vh] w-[2px] bg-[var(--theme-text-1)]/10 rounded-full overflow-hidden">
          <motion.div
            style={{ scaleY, originY: 0 }}
            className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-[var(--theme-accent)] via-[var(--theme-text-1)] to-[var(--theme-accent)] rounded-full"
          />
        </div>

        {/* Percentage indicator */}
        <motion.span
          className="text-[9px] font-mono uppercase tracking-[0.2em] text-[var(--theme-accent)]/60 mt-2"
        >
          SCROLL
        </motion.span>
      </div>

      {/* Top horizontal bar for mobile */}
      <motion.div
        style={{ scaleX: scaleY, originX: 0 }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--theme-accent)] to-[var(--theme-text-1)] z-[60] md:hidden pointer-events-none"
      />
    </>
  );
}

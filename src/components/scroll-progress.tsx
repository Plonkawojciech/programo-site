"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  // Under reduced-motion the spring lag itself is unwanted extra motion (the
  // bar should track the scroll position 1:1, not settle into place after
  // it), so it's tightened to near-instant instead of removed outright — the
  // indicator still needs to reflect real scroll position.
  const scaleY = useSpring(
    scrollYProgress,
    reduce ? { damping: 100, stiffness: 1000, mass: 0.1 } : { damping: 40, stiffness: 200, mass: 0.3 }
  );

  // Mobile only. The desktop build used to carry a vertical rail plus a "SCROLL"
  // caption pinned beside the hero; it labelled an affordance every visitor
  // already has and sat in the one place the eye needs to reach the phone field.
  // Narrow screens keep the top bar because there the page is long enough that
  // "how far in am I" is a real question.
  return (
    <motion.div
      style={{ scaleX: scaleY, originX: 0 }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--theme-accent)] to-[var(--theme-text-1)] z-[60] md:hidden pointer-events-none"
    />
  );
}

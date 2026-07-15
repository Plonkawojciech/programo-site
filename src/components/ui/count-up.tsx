"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Animated number counter that runs once when it enters the viewport. Only the
 * numeric part of `value` is animated; any prefix/suffix is preserved verbatim,
 * so "~7500", "24 h", "do 24 h" and "10+" all work. Values without digits
 * (e.g. "PL · EN") render as-is. Respects prefers-reduced-motion.
 */
export default function CountUp({
  value,
  duration = 1400,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();

  // Split into [prefix, digits, suffix]. Thousands separators (space/comma/dot)
  // inside the number are dropped for the animation and not re-inserted.
  const match = value.match(/^(\D*)([\d][\d\s.,]*\d|\d)(.*)$/);
  const target = match ? Number(match[2].replace(/[\s.,]/g, "")) : null;
  const prefix = match ? match[1] : "";
  const suffix = match ? match[3] : "";

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (target === null) return;
    if (reduce || !inView) {
      setCurrent(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic for a natural settle
      const eased = 1 - Math.pow(1 - t, 3);
      setCurrent(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, target, duration]);

  if (target === null) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {prefix}
      {current}
      {suffix}
    </span>
  );
}

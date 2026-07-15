"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Animated number counter that runs once when it enters the viewport. Only the
 * numeric part of `value` is animated; any prefix/suffix is preserved verbatim,
 * so "~7500", "24 h", "do 24 h" and "10+" all work. Values without digits
 * (e.g. "PL · EN") render as-is.
 *
 * The final value is what renders on the server and on the first client paint,
 * so crawlers, fast scrolls and prefers-reduced-motion users always read the
 * truth — never a transitional "0" or a plausible-but-wrong figure. The reveal
 * animation only sweeps the final stretch (~70% → 100%) over a short window.
 */
export default function CountUp({
  value,
  duration = 900,
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

  // Start at the final value so SSR and hydration render the truth.
  const [current, setCurrent] = useState(target ?? 0);

  useEffect(() => {
    if (target === null) return;
    if (reduce || !inView) {
      setCurrent(target);
      return;
    }
    // Sweep only the last ~30% so no intermediate frame reads as a real, lower
    // number (e.g. "20 h" standing in for "24 h").
    const from = Math.round(target * 0.7);
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic for a natural settle
      const eased = 1 - Math.pow(1 - t, 3);
      setCurrent(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    setCurrent(from);
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

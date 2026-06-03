"use client";

import { useEffect, useState } from "react";

/**
 * Returns true only on platforms whose scroll input is inherently smooth
 * (Apple desktop trackpad + any touch device with momentum scrolling), or when
 * the user hasn't asked to reduce motion.
 *
 * Scroll-linked animations (parallax, scroll-driven scale/transforms) feel
 * buttery on macOS/iOS because the scroll stream is continuous. On Windows /
 * Linux desktops the mouse wheel delivers large discrete deltas, so the same
 * scroll-linked springs/transforms visibly lurch and stutter. On those
 * platforms we render the affected elements statically instead.
 *
 * Defaults to `true` on the server / first paint (Apple-first, and scroll-linked
 * values are 0 until the user scrolls anyway), then corrects on mount.
 */
export function useSmoothInput(): boolean {
  const [smooth, setSmooth] = useState(true);

  useEffect(() => {
    try {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const ua = navigator.userAgent || "";
      const plat = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform
        || navigator.platform
        || "";
      const isApple = /Mac|iPhone|iPad|iPod/i.test(plat) || /Macintosh|iPhone|iPad|iPod/i.test(ua);
      const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
      setSmooth(!reduced && (isApple || isTouch));
    } catch {
      setSmooth(true);
    }
  }, []);

  return smooth;
}

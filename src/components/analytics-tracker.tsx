"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureAttribution, trackContactClick, trackScrollDepth } from "@/lib/tracking";

const SCROLL_THRESHOLDS = [25, 50, 75, 100] as const;

/**
 * Mounted once globally (in Providers). On load it captures ad attribution
 * (gclid/UTM) and tracks clicks on tel:/mailto: links across the whole site
 * via event delegation — no need to wire every link individually. It also emits
 * scroll-depth milestones (25/50/75/100), fired once per page and reset when the
 * pathname changes.
 */
export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    captureAttribution();

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (href.startsWith("tel:")) trackContactClick("phone", href);
      else if (href.startsWith("mailto:")) trackContactClick("email", href);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Scroll depth — one event per threshold per page; `fired` resets on navigation
  // because the effect re-runs when `pathname` changes.
  useEffect(() => {
    const fired = new Set<number>();

    const check = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      // Very short pages have nothing to scroll — treat as fully seen.
      const pct = scrollable <= 0 ? 100 : (window.scrollY / scrollable) * 100;
      for (const threshold of SCROLL_THRESHOLDS) {
        if (pct >= threshold && !fired.has(threshold)) {
          fired.add(threshold);
          trackScrollDepth(threshold);
        }
      }
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [pathname]);

  return null;
}

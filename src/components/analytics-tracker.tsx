"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { captureAttribution } from "@/lib/analytics/attribution";
import { flush, track, trackPageView, trackSessionContext } from "@/lib/analytics/client";
import { initEngagement } from "@/lib/analytics/engagement";

const SCROLL_THRESHOLDS = [25, 50, 75, 90, 100] as const;

/**
 * Destinations that mean "this visitor is moving toward contacting us".
 * Everything here is a step in the funnel, not ordinary navigation.
 */
const CONVERSION_HREFS = [
  "/kontakt",
  "#kontakt",
  "#kontakt-main",
  "/cennik",
  "#wycena",
  "#formularz",
];

function hrefOf(el: Element): string {
  return el.getAttribute("href") || "";
}

function isConversionTarget(el: Element): boolean {
  const href = hrefOf(el);
  if (!href) return false;
  // tel:/mailto: are reported as contact_click, which is a stronger signal —
  // counting them twice would inflate the CTA numbers.
  if (href.startsWith("tel:") || href.startsWith("mailto:")) return false;
  return CONVERSION_HREFS.some((h) => href === h || href.endsWith(h) || href.startsWith(h));
}

/** Short, stable label for where a CTA points. */
function destinationOf(el: Element): string {
  const href = hrefOf(el);
  if (!href) return el.getAttribute("data-cta") ?? "unknown";
  return href.split("?")[0].slice(0, 60);
}

/**
 * Mounted once globally (in Providers). Owns every site-wide listener:
 *
 *  - captures ad/AI attribution on landing and on each route change
 *  - emits one session_context per session, and ai_referral when an AI assistant
 *    sent the visitor
 *  - tel:/mailto: clicks, CTA clicks and outbound links via event delegation,
 *    so no individual link needs wiring
 *  - scroll depth, per page, reset on navigation
 *  - behavioural signals (rage/dead clicks, exit intent, engaged time, section
 *    views, copied contact details, JS errors) — see analytics/engagement.ts
 */
export default function AnalyticsTracker() {
  const pathname = usePathname();
  // The long-lived listeners below are installed once and must not be torn down
  // on navigation, but they still need the *current* path when they fire. A ref
  // gives them that without putting `pathname` in their dependency array.
  const pathRef = useRef(pathname);
  useEffect(() => {
    pathRef.current = pathname;
  }, [pathname]);

  // --- one-time: attribution, session context, delegated clicks, behaviour ---
  useEffect(() => {
    captureAttribution();
    trackSessionContext();

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.("a");

      // A CTA is recognised by where it LEADS, not by an attribute someone has
      // to remember to add. An explicit data-cta still wins when a specific
      // button deserves a stable name of its own.
      //
      // This matters because the question a CTA event answers is "which
      // placement earns its space" — and a placement that was added without
      // tagging is precisely the one nobody is measuring.
      const explicit = target?.closest?.("[data-cta]");
      const cta = explicit ?? (anchor && isConversionTarget(anchor) ? anchor : null);
      if (cta) {
        const section = cta.closest("[data-section],section[id]");
        track("cta_click", {
          cta:
            explicit?.getAttribute("data-cta") ??
            `${section?.getAttribute("data-section") ?? section?.getAttribute("id") ?? "page"}:${destinationOf(cta)}`,
          page_path: pathRef.current,
          destination: destinationOf(cta),
          section: section?.getAttribute("data-section") ?? section?.getAttribute("id") ?? undefined,
          label: (cta.textContent || "").trim().slice(0, 60) || undefined,
        });
      }

      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (href.startsWith("tel:")) {
        track("contact_click", { method: "phone", link_url: href, page_path: pathRef.current });
        // A phone click is often the end of the visit — get it out immediately.
        flush(true);
      } else if (href.startsWith("mailto:")) {
        track("contact_click", { method: "email", link_url: href, page_path: pathRef.current });
        flush(true);
      } else if (/^https?:\/\//i.test(href) && !href.includes(window.location.host)) {
        track("outbound_click", { link_url: href.slice(0, 300), page_path: pathRef.current });
      }
    };

    document.addEventListener("click", onClick, true);
    const stopEngagement = initEngagement(() => pathRef.current);

    return () => {
      document.removeEventListener("click", onClick, true);
      stopEngagement();
    };
  }, []);

  // --- per route: page view + scroll depth ----------------------------------
  useEffect(() => {
    captureAttribution();
    trackPageView(pathname, typeof document !== "undefined" ? document.title : undefined);

    const fired = new Set<number>();

    const measure = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      // Very short pages have nothing to scroll — treat as fully seen.
      const pct = scrollable <= 0 ? 100 : (window.scrollY / scrollable) * 100;
      for (const threshold of SCROLL_THRESHOLDS) {
        if (pct >= threshold && !fired.has(threshold)) {
          fired.add(threshold);
          track("scroll_depth", { percent: threshold, page_path: pathname });
        }
      }
      // Every threshold crossed — nothing left to watch on this page.
      if (fired.size === SCROLL_THRESHOLDS.length) detach();
    };

    // Scroll fires far more often than once per frame. Reading scrollHeight in
    // the handler forces layout, so coalescing to one measurement per frame is
    // the difference between a few reads and a few hundred during one flick.
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        measure();
      });
    };

    const detach = () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return detach;
  }, [pathname]);

  return null;
}

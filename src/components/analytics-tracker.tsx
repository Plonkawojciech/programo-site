"use client";

import { useEffect } from "react";
import { captureAttribution, trackContactClick } from "@/lib/tracking";

/**
 * Mounted once globally (in Providers). On load it captures ad attribution
 * (gclid/UTM) and tracks clicks on tel:/mailto: links across the whole site
 * via event delegation — no need to wire every link individually.
 */
export default function AnalyticsTracker() {
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

  return null;
}

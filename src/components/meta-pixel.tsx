"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useConsent } from "@/lib/consent";

// Meta Pixel, mounted only after marketing consent.
//
// Deliberately "don't load at all" rather than Meta's own "load then revoke"
// pattern: merely fetching fbevents.js from Meta's domain already discloses the
// visitor's IP and user agent to a third party, which is the disclosure the
// consent is supposed to gate. `fbq('consent','revoke')` is kept as the safety
// net for consent withdrawn mid-session, once the script is already in memory.
//
// The dataset id is public by design (it ships in the page), so NEXT_PUBLIC_ is
// correct here. The CAPI access token is NOT — that stays server-side.
const DATASET_ID = process.env.NEXT_PUBLIC_META_DATASET_ID;

export default function MetaPixel() {
  const { consent } = useConsent();
  const pathname = usePathname();
  const loaded = useRef(false);

  // --- load the library, once, on first marketing consent ------------------
  useEffect(() => {
    if (!DATASET_ID || !consent.marketing || loaded.current) return;
    if (typeof window === "undefined") return;
    // Fresh alias: reading through `window.fbq` below would keep TypeScript's
    // narrowing from the guard, which cannot see that the loader assigns it.
    const w = window as unknown as { fbq?: (...args: unknown[]) => void };
    if (w.fbq) {
      loaded.current = true;
      return;
    }
    loaded.current = true;

    // Meta's canonical loader, minus the trailing fbq('track','PageView') —
    // page views are fired from the effect below instead, so the first load and
    // every client-side route change go through exactly one code path. Leaving
    // it in the snippet is the usual cause of a doubled PageView in App Router.
    /* eslint-disable @typescript-eslint/no-explicit-any */
    (function (f: any, b: Document, e: string, v: string) {
      if (f.fbq) return;
      const n: any = function (...args: unknown[]) {
        // Queue calls until fbevents.js arrives and swaps in callMethod.
        if (n.callMethod) n.callMethod(...args);
        else n.queue.push(args);
      };
      f.fbq = n;
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      const t = b.createElement(e) as HTMLScriptElement;
      t.async = true;
      t.src = v;
      const s = b.getElementsByTagName(e)[0];
      s.parentNode?.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable @typescript-eslint/no-explicit-any */

    // Re-cast rather than reusing `w`: the guard above narrowed `w.fbq` to
    // undefined, and TypeScript cannot see that the loader just assigned it.
    (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq?.("init", DATASET_ID);
  }, [consent.marketing]);

  // --- page views, including client-side navigation -------------------------
  useEffect(() => {
    if (!DATASET_ID || !consent.marketing) return;
    window.fbq?.("track", "PageView");
  }, [pathname, consent.marketing]);

  // --- consent withdrawn mid-session ---------------------------------------
  useEffect(() => {
    if (consent.marketing || typeof window === "undefined" || !window.fbq) return;
    window.fbq("consent", "revoke");
    // Meta's cookies outlive the script, so clear them too — otherwise a later
    // server-side CAPI call could still read _fbp/_fbc from the request.
    for (const name of ["_fbp", "_fbc"]) {
      document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
    }
  }, [consent.marketing]);

  return null;
}

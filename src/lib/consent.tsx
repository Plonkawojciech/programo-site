"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useClientValue } from "@/lib/use-client-value";

export type ConsentCategories = {
  analytics: boolean;
  marketing: boolean;
};

export type ConsentState = ConsentCategories & {
  decided: boolean;
};

const STORAGE_KEY = "programo-consent-v1";
const CLARITY_ID = "wxezq44wx0";

const DEFAULT_STATE: ConsentState = {
  analytics: false,
  marketing: false,
  decided: false,
};

type ConsentContextValue = {
  consent: ConsentState;
  acceptAll: () => void;
  rejectAll: () => void;
  save: (categories: ConsentCategories) => void;
  openSettings: () => void;
  settingsOpen: boolean;
  closeSettings: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

function readStoredConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    return {
      analytics: !!parsed.analytics,
      marketing: !!parsed.marketing,
      decided: true,
    };
  } catch {
    return null; // ignore corrupt storage
  }
}

type GtagFn = (...args: unknown[]) => void;
type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[] };
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFn;
    clarity?: ClarityFn;
  }
}

function loadClarity() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (window.clarity) return; // already loaded
  // Microsoft Clarity loader (mirrors official snippet)
  (function (c, l, a, r, i) {
    const cw = c as unknown as Record<string, ClarityFn>;
    cw[a] =
      cw[a] ||
      (function () {
        const fn = function (...args: unknown[]) {
          (fn.q = fn.q || []).push(args);
        } as ClarityFn;
        return fn;
      })();
    const t = l.createElement(r) as HTMLScriptElement;
    t.async = true;
    t.src = "https://www.clarity.ms/tag/" + i;
    const y = l.getElementsByTagName(r)[0];
    y.parentNode?.insertBefore(t, y);
  })(window, document, "clarity", "script", CLARITY_ID);
}

import { CONSENT_COOKIE } from "@/lib/analytics/consent-cookie";
import { track } from "@/lib/analytics/client";
import { clearIdentity, persistPendingIdentity } from "@/lib/analytics/identity";
import { clearAttribution, persistPendingAttribution } from "@/lib/analytics/attribution";

export { CONSENT_COOKIE };

/** How the visitor reached the decision — one click or a deliberate choice. */
type ConsentAction = "accept_all" | "reject_all" | "save_custom";

/**
 * Mirrors the consent decision into a first-party cookie.
 *
 * localStorage is invisible to the server, and server-side conversion APIs
 * (Meta CAPI, GA4 Measurement Protocol) must NOT fire without marketing
 * consent. A flag posted in a request body is a claim by the client, not
 * evidence; a cookie the browser attaches to every request is what the route
 * handler can actually check. Strictly necessary — it exists solely to
 * remember and enforce the visitor's own choice.
 */
function writeConsentCookie(categories: ConsentCategories) {
  if (typeof document === "undefined") return;
  try {
    const value = encodeURIComponent(
      JSON.stringify({ analytics: categories.analytics, marketing: categories.marketing }),
    );
    const oneYear = 60 * 60 * 24 * 365;
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${CONSENT_COOKIE}=${value}; Path=/; Max-Age=${oneYear}; SameSite=Lax${secure}`;
  } catch {
    /* cookies disabled — the server then sees no consent and sends nothing,
       which is the correct fail-closed behaviour */
  }
}

function pushConsent(categories: ConsentCategories) {
  if (typeof window === "undefined") return;
  writeConsentCookie(categories);
  window.dataLayer = window.dataLayer || [];
  const gtag: GtagFn =
    window.gtag ||
    function (...args: unknown[]) {
      window.dataLayer!.push(args);
    };
  window.gtag = gtag;

  gtag("consent", "update", {
    ad_storage: categories.marketing ? "granted" : "denied",
    ad_user_data: categories.marketing ? "granted" : "denied",
    ad_personalization: categories.marketing ? "granted" : "denied",
    analytics_storage: categories.analytics ? "granted" : "denied",
  });

  // Load Microsoft Clarity only after analytics consent is granted
  if (categories.analytics) {
    loadClarity();
  }

  // Clarity needs its OWN consent signal, separate from loading the script.
  // Since 31 Oct 2025 Clarity enforces this for EEA/UK/CH traffic: without a
  // consentv2 call it runs in "no-consent mode" — a fresh id per page view, no
  // cookies, no session stitching — which makes recordings and heatmaps
  // effectively useless. Loading the script after consent is NOT enough.
  // (The older clarity('consent', bool) API forces one flag onto both storage
  // types and is being phased out, so we always use v2.)
  if (typeof window !== "undefined" && typeof window.clarity === "function") {
    window.clarity("consentv2", {
      ad_Storage: categories.marketing ? "granted" : "denied",
      analytics_Storage: categories.analytics ? "granted" : "denied",
    });
  }
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  // Stored consent read once via useSyncExternalStore (hydration matches the
  // server, then one re-render with the real value); user actions in this
  // session override it.
  const stored = useClientValue<ConsentState | null>(readStoredConsent, null);
  const [override, setOverride] = useState<ConsentState | null>(null);
  const consent = override ?? stored ?? DEFAULT_STATE;
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Replay stored consent into gtag/Clarity on load (external-system sync —
  // the legitimate job of an effect; no setState here).
  useEffect(() => {
    if (stored && !override) {
      pushConsent({ analytics: stored.analytics, marketing: stored.marketing });
    }
  }, [stored, override]);

  const persist = useCallback((categories: ConsentCategories, action: ConsentAction = "save_custom") => {
    const next: ConsentState = { ...categories, decided: true };
    setOverride(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore quota errors */
    }
    pushConsent(categories);

    // The denominator under every other number we collect. If half the
    // visitors decline analytics, every metric is roughly half the truth — and
    // without this event there is no way to know by how much. Recorded AFTER
    // pushConsent so a grant is already in effect and the event is allowed
    // through; a rejection is intentionally not recorded, because recording it
    // would require the very storage the visitor just declined.
    if (categories.analytics) {
      // Identity and attribution were in memory only until now; promote both so
      // the visit that led to the decision is not split from what follows, and
      // the campaign that brought the visitor here survives the next page load.
      persistPendingIdentity();
      persistPendingAttribution();
      track("consent_update", {
        analytics: categories.analytics,
        marketing: categories.marketing,
        action,
      });
    } else {
      // Withdrawal has to erase what was already written, not merely stop
      // writing more. Meta's cookies are cleared separately in meta-pixel.tsx.
      clearIdentity();
      clearAttribution();
      try {
        sessionStorage.removeItem("programo-lead-fired");
      } catch {
        /* ignore */
      }
    }

    // Clarity has no stop/teardown API. If analytics consent is being withdrawn while
    // a Clarity session is already recording, a reload is the only way to actually
    // honour the withdrawal within the same visit (GDPR), so do it after persisting.
    if (!categories.analytics && typeof window !== "undefined" && "clarity" in window) {
      window.location.reload();
    }
  }, []);

  const acceptAll = useCallback(() => {
    persist({ analytics: true, marketing: true }, "accept_all");
    setSettingsOpen(false);
  }, [persist]);

  const rejectAll = useCallback(() => {
    persist({ analytics: false, marketing: false }, "reject_all");
    setSettingsOpen(false);
  }, [persist]);

  const save = useCallback(
    (categories: ConsentCategories) => {
      persist(categories);
      setSettingsOpen(false);
    },
    [persist],
  );

  const value: ConsentContextValue = {
    consent,
    acceptAll,
    rejectAll,
    save,
    openSettings: () => setSettingsOpen(true),
    settingsOpen,
    closeSettings: () => setSettingsOpen(false),
  };

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    return {
      consent: DEFAULT_STATE,
      acceptAll: () => {},
      rejectAll: () => {},
      save: () => {},
      openSettings: () => {},
      settingsOpen: false,
      closeSettings: () => {},
    };
  }
  return ctx;
}

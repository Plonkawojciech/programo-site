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

function pushConsent(categories: ConsentCategories) {
  if (typeof window === "undefined") return;
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

  const persist = useCallback((categories: ConsentCategories) => {
    const next: ConsentState = { ...categories, decided: true };
    setOverride(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore quota errors */
    }
    pushConsent(categories);
    // Clarity has no stop/teardown API. If analytics consent is being withdrawn while
    // a Clarity session is already recording, a reload is the only way to actually
    // honour the withdrawal within the same visit (GDPR), so do it after persisting.
    if (!categories.analytics && typeof window !== "undefined" && "clarity" in window) {
      window.location.reload();
    }
  }, []);

  const acceptAll = useCallback(() => {
    persist({ analytics: true, marketing: true });
    setSettingsOpen(false);
  }, [persist]);

  const rejectAll = useCallback(() => {
    persist({ analytics: false, marketing: false });
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

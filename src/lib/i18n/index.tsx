"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { track } from "@/lib/analytics/client";
import { translations, type Lang, type TranslationKey } from "./dictionary";
import { useClientValue } from "@/lib/use-client-value";

// Re-exported so every existing `import { translations, type TranslationKey }
// from "@/lib/i18n"` call site keeps working unchanged — the dictionary itself
// now lives in ./dictionary (no "use client"), see that file for why.
export { translations };
export type { Lang, TranslationKey };

interface I18nContextType {
  lang: Lang;
  toggle: () => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  // Match the Polish server HTML during hydration, then restore the saved
  // language using the same client-value hook as the theme provider.
  const saved = useClientValue<Lang>(() => {
    try {
      const saved = localStorage.getItem("programo-lang");
      if (saved === "en" || saved === "pl") return saved;
    } catch { /* Storage can be unavailable in private browser contexts. */ }
    return "pl";
  }, "pl");
  const [override, setOverride] = useState<Lang | null>(null);
  const lang = override ?? saved;

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const toggle = useCallback(() => {
    const next = lang === "pl" ? "en" : "pl";
    setOverride(next);
    try { localStorage.setItem("programo-lang", next); } catch { /* Keep the UI usable without storage. */ }
    // Measures whether anyone actually wants the English version. That is the
    // open question behind the /en/ + hreflang decision: today the English
    // copy exists only client-side, so it is invisible to search engines, and
    // the honest choice is either to make it indexable or to drop it. This
    // event is the evidence that call should be based on.
    track("language_switch", { from_lang: lang, to_lang: next, page_path: window.location.pathname });
  }, [lang]);

  const t = useCallback(
    (key: TranslationKey) => translations[key]?.[lang] ?? key,
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, toggle, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

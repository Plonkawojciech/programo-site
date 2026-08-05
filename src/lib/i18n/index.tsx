"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { track } from "@/lib/analytics/client";
import { translations, type Lang, type TranslationKey } from "./dictionary";

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
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("programo-lang");
      if (saved === "en" || saved === "pl") return saved;
    }
    return "pl";
  });

  useEffect(() => {
    localStorage.setItem("programo-lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggle = useCallback(() => {
    setLang((prev) => {
      const next = prev === "pl" ? "en" : "pl";
      // Measures whether anyone actually wants the English version. That is the
      // open question behind the /en/ + hreflang decision: today the English
      // copy exists only client-side, so it is invisible to search engines, and
      // the honest choice is either to make it indexable or to drop it. This
      // event is the evidence that call should be based on.
      track("language_switch", { from_lang: prev, to_lang: next, page_path: window.location.pathname });
      return next;
    });
  }, []);

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

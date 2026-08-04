"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useClientValue } from "@/lib/use-client-value";
import { track } from "@/lib/analytics/client";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Saved theme read via useSyncExternalStore: hydration renders "light" like
  // the server, then React re-renders once with the stored value — same timing
  // as the old mount-effect, without setState-in-effect.
  const saved = useClientValue<Theme>(() => {
    const s = localStorage.getItem("programo-theme");
    return s === "dark" ? "dark" : "light";
  }, "light");
  const [override, setOverride] = useState<Theme | null>(null);
  const theme = override ?? saved;

  // Keep the DOM attribute in sync (initial load and every toggle).
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setOverride(next);
    localStorage.setItem("programo-theme", next);
    // Low stakes on its own, but it answers "which theme should the design
    // treat as the default" with data instead of taste.
    track("theme_switch", { from_theme: theme, to_theme: next });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Fallback for SSR/unmounted
    return { theme: "light" as Theme, toggle: () => {} };
  }
  return ctx;
}

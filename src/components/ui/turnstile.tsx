"use client";

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import { useTheme } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";

/**
 * Cloudflare Turnstile widget — the browser half of the anti-bot gate on every
 * lead form. Server half + the env-var contract: src/lib/turnstile.ts.
 *
 * Renders NOTHING when NEXT_PUBLIC_TURNSTILE_SITE_KEY is unset, so a deploy
 * without the keys leaves the forms exactly as they were. Read at module load:
 * the value is inlined at build time, never at runtime.
 *
 * Hand-rolled on the explicit-render API rather than a wrapper package: the
 * whole contract is render / reset / remove, and the forms need exactly one
 * behaviour from it — a token before submit and a fresh widget after, because
 * a Turnstile token is single-use.
 */

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
export const TURNSTILE_ENABLED = Boolean(SITE_KEY);

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__programoTurnstileReady";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    __programoTurnstileReady?: () => void;
  }
}

// One script tag per page no matter how many forms render — the landing pages
// stack three of them. Resolved once api.js calls the onload hook.
let scriptReady: Promise<TurnstileApi> | null = null;
function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptReady) return scriptReady;
  scriptReady = new Promise<TurnstileApi>((resolve) => {
    window.__programoTurnstileReady = () => resolve(window.turnstile as TurnstileApi);
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    document.head.appendChild(s);
  });
  return scriptReady;
}

export type TurnstileHandle = {
  /** Call after EVERY submit attempt — success or failure. The token is spent. */
  reset: () => void;
};

export default function Turnstile({
  ref,
  onToken,
  className,
}: {
  ref?: Ref<TurnstileHandle>;
  /** Fires with the token when solved, with null when it expires or errors. */
  onToken: (token: string | null) => void;
  className?: string;
}) {
  const { theme } = useTheme();
  const { lang } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  // Latest callback without re-rendering the widget when the parent re-renders.
  // Synced in an effect, not during render — the compiler lint forbids the
  // render-time write and here nothing reads it before commit anyway.
  const onTokenRef = useRef(onToken);
  useEffect(() => {
    onTokenRef.current = onToken;
  });

  useImperativeHandle(ref, () => ({
    reset() {
      const id = widgetIdRef.current;
      if (id && window.turnstile) window.turnstile.reset(id);
      onTokenRef.current(null);
    },
  }));

  useEffect(() => {
    if (!SITE_KEY || !containerRef.current) return;
    let cancelled = false;
    const el = containerRef.current;

    loadTurnstile().then((api) => {
      if (cancelled) return;
      widgetIdRef.current = api.render(el, {
        sitekey: SITE_KEY,
        theme,
        language: lang,
        // Fills the form column instead of a fixed 300px box.
        size: "flexible",
        callback: (token: string) => onTokenRef.current(token),
        "expired-callback": () => onTokenRef.current(null),
        "error-callback": () => onTokenRef.current(null),
        "timeout-callback": () => onTokenRef.current(null),
      });
    });

    return () => {
      cancelled = true;
      const id = widgetIdRef.current;
      if (id && window.turnstile) {
        try {
          window.turnstile.remove(id);
        } catch {
          /* already gone */
        }
      }
      widgetIdRef.current = null;
      onTokenRef.current(null);
    };
    // Theme / language switch re-renders the widget in the new skin.
  }, [theme, lang]);

  if (!SITE_KEY) return null;
  return <div ref={containerRef} className={className} />;
}

"use client";

import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import { useTheme } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
export const TURNSTILE_ENABLED = true;

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
  scriptReady = new Promise<TurnstileApi>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      scriptReady = null;
      reject(new Error("Turnstile loading timed out"));
    }, 15_000);
    window.__programoTurnstileReady = () => {
      window.clearTimeout(timeout);
      resolve(window.turnstile as TurnstileApi);
    };
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onerror = () => { window.clearTimeout(timeout); scriptReady = null; reject(new Error("Turnstile script unavailable")); };
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
  const { lang, t } = useI18n();
  const [failed, setFailed] = useState(false);
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
    let resizeObserver: ResizeObserver | null = null;
    const el = containerRef.current;

    loadTurnstile().then((api) => {
      if (cancelled) return;
      // Flexible widgets have a 300px minimum. Padded mobile form columns can
      // be narrower; use the official compact widget rather than clip its UI.
      const sizeForColumn = () => el.clientWidth < 300 ? "compact" : "flexible";
      let size = sizeForColumn();
      const render = () => {
        if (widgetIdRef.current) api.remove(widgetIdRef.current);
        onTokenRef.current(null);
        widgetIdRef.current = api.render(el, {
        sitekey: SITE_KEY,
        action: "contact",
        theme,
        language: lang,
        size,
        callback: (token: string) => { setFailed(false); onTokenRef.current(token); },
        "expired-callback": () => onTokenRef.current(null),
        "error-callback": () => { setFailed(true); onTokenRef.current(null); },
        "timeout-callback": () => onTokenRef.current(null),
        });
      };
      render();
      resizeObserver = new ResizeObserver(() => {
        const nextSize = sizeForColumn();
        if (!cancelled && nextSize !== size) { size = nextSize; render(); }
      });
      resizeObserver.observe(el);
    }).catch(() => { if (!cancelled) { setFailed(true); onTokenRef.current(null); } });

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
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

  return (
    <div className={className}>
      <div ref={containerRef} />
      {(!SITE_KEY || failed) && <p role="status" className="text-sm text-red-600 dark:text-red-300">{t("forms.turnstileUnavailable")}</p>}
      {process.env.NEXT_PUBLIC_TURNSTILE_TEST_MODE === "true" && <p className="text-xs text-[var(--muted)]">{t("forms.turnstileTestMode")}</p>}
    </div>
  );
}

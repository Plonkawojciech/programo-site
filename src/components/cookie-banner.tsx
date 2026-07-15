"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useConsent } from "@/lib/consent";

export default function CookieBanner() {
  const { t } = useI18n();
  const {
    consent,
    acceptAll,
    rejectAll,
    save,
    settingsOpen,
    openSettings,
    closeSettings,
  } = useConsent();

  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (settingsOpen) {
      setAnalytics(consent.analytics);
      setMarketing(consent.marketing);
    }
  }, [settingsOpen, consent.analytics, consent.marketing]);

  const showBanner = mounted && !consent.decided && !settingsOpen;

  // Lock body scroll ONLY while the user-initiated settings modal is open.
  // The first-touch consent banner is a NON-blocking bottom bar — it must never
  // lock scroll or cover the hero/lead form. The old full-screen blocking modal
  // hid the above-the-fold form from 100% of (new) paid traffic = killed leads.
  useEffect(() => {
    if (settingsOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [settingsOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* First-touch consent — NON-blocking bottom bar. No full-screen overlay,
          no scroll lock, never covers the hero/lead form. Three explicit actions
          incl. a real "Reject all" (RODO-friendly, removes the dark-pattern). */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: "115%" }}
            animate={{ y: 0 }}
            exit={{ y: "115%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label={t("cookie.title")}
            style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 0.5rem)" }}
            className="fixed inset-x-0 bottom-0 z-[100] px-2 pt-2 sm:px-4 sm:pt-4"
          >
            {/* Compact on mobile: shortened copy on one line + all three actions
                in a single row, so the bar stays short and never covers the hero
                CTA at 390×844. Desktop layout is unchanged (full copy, row). */}
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-2.5 rounded-2xl border border-outline-variant/60 bg-surface-container/95 p-3 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)] backdrop-blur-md md:flex-row md:items-center md:gap-6 md:p-5">
              <p className="flex-1 text-xs leading-snug text-on-surface-variant md:text-sm md:leading-relaxed">
                <span className="md:hidden">{t("cookie.descShort")} </span>
                <span className="hidden md:inline">{t("cookie.desc")} </span>
                <Link
                  href="/polityka-prywatnosci"
                  className="font-medium text-on-surface underline decoration-on-surface-variant/60 underline-offset-2 transition-colors hover:text-primary"
                >
                  {t("cookie.privacyLink")}
                </Link>
                .
              </p>
              {/* Mobile: normal case, tight tracking so all three actions fit one
                  row at 375–390px. Desktop restores uppercase + wide tracking. */}
              <div className="flex shrink-0 items-center gap-2 md:gap-3">
                <button
                  type="button"
                  onClick={openSettings}
                  className="shrink-0 px-1 py-2 text-[11px] font-medium text-on-surface-variant underline underline-offset-4 transition-colors hover:text-on-surface md:px-2 md:text-xs md:uppercase md:tracking-widest"
                >
                  {t("cookie.customize")}
                </button>
                <button
                  type="button"
                  onClick={rejectAll}
                  className="flex-1 whitespace-nowrap rounded-full border-2 border-outline-variant/60 bg-surface px-3 py-2 text-[11px] font-medium text-on-surface transition-all hover:border-outline-variant hover:bg-on-surface/5 md:flex-none md:px-5 md:py-2.5 md:text-xs md:uppercase md:tracking-widest"
                >
                  {t("cookie.rejectAll")}
                </button>
                <button
                  type="button"
                  onClick={acceptAll}
                  className="flex-1 whitespace-nowrap rounded-full bg-primary px-3 py-2 text-[11px] font-semibold text-on-primary shadow-lg shadow-primary/20 transition-all hover:bg-primary-container hover:text-on-primary-container md:flex-none md:px-5 md:py-2.5 md:text-xs md:uppercase md:tracking-widest"
                >
                  {t("cookie.acceptAll")}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings modal */}
      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[110] flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm p-0 md:p-6"
            onClick={closeSettings}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 1.5rem)" }}
              className="w-full max-w-lg rounded-t-3xl md:rounded-3xl bg-surface-container border-2 border-outline-variant/60 shadow-[0_-20px_60px_-12px_rgba(0,0,0,0.6)] md:shadow-2xl p-6 md:p-9 max-h-[90vh] overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label={t("cookie.settingsTitle")}
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-headline text-xl md:text-2xl font-semibold tracking-tight text-on-surface">
                  {t("cookie.settingsTitle")}
                </h2>
                <button
                  type="button"
                  onClick={closeSettings}
                  aria-label="Close"
                  className="text-on-surface hover:bg-on-surface/10 transition-colors rounded-full p-2 -mt-1 -mr-1"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                {t("cookie.settingsDesc")}
              </p>

              <div className="mt-6 md:mt-7 flex flex-col gap-2">
                <ConsentRow
                  title={t("cookie.necessaryTitle")}
                  desc={t("cookie.necessaryDesc")}
                  checked
                  disabled
                  onChange={() => {}}
                />
                <ConsentRow
                  title={t("cookie.analyticsTitle")}
                  desc={t("cookie.analyticsDesc")}
                  checked={analytics}
                  onChange={setAnalytics}
                />
                <ConsentRow
                  title={t("cookie.marketingTitle")}
                  desc={t("cookie.marketingDesc")}
                  checked={marketing}
                  onChange={setMarketing}
                />
              </div>

              <div className="mt-7 md:mt-8 flex flex-col-reverse md:flex-row gap-2 md:gap-3">
                <button
                  type="button"
                  onClick={rejectAll}
                  className="flex-1 border-2 border-outline-variant/60 bg-surface text-on-surface px-5 py-3 rounded-full text-xs uppercase tracking-widest font-medium hover:bg-on-surface/5 hover:border-outline-variant transition-all"
                >
                  {t("cookie.rejectAll")}
                </button>
                <button
                  type="button"
                  onClick={() => save({ analytics, marketing })}
                  className="flex-1 bg-primary text-on-primary px-5 py-3 rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all shadow-md"
                >
                  {t("cookie.savePrefs")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ConsentRow({
  title,
  desc,
  checked,
  disabled = false,
  onChange,
}: {
  title: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-outline-variant/40 last:border-0">
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-on-surface">{title}</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-on-surface-variant">
          {desc}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors mt-0.5 ${
          checked ? "bg-primary" : "bg-on-surface/25"
        } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:opacity-90"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

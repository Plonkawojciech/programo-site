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

  if (!mounted) return null;

  const showBanner = !consent.decided && !settingsOpen;

  return (
    <>
      {/* Bottom banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label={t("cookie.title")}
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
            className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto md:max-w-md z-[100]"
          >
            <div className="rounded-2xl md:rounded-3xl bg-surface-container border-2 border-outline-variant/60 shadow-[0_25px_60px_-12px_rgba(0,0,0,0.6)] p-5 md:p-7">
              <h2 className="font-headline text-base md:text-xl font-semibold tracking-tight text-on-surface">
                {t("cookie.title")}
              </h2>
              <p className="mt-2 text-xs md:text-sm leading-relaxed text-on-surface-variant">
                {t("cookie.desc")}{" "}
                <Link
                  href="/polityka-prywatnosci"
                  className="underline decoration-on-surface-variant/60 underline-offset-2 text-on-surface font-medium hover:text-primary transition-colors"
                >
                  {t("cookie.privacyLink")}
                </Link>
                .
              </p>

              <div className="mt-4 md:mt-5 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={acceptAll}
                  className="w-full bg-primary text-on-primary px-5 py-3 rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all shadow-md"
                >
                  {t("cookie.acceptAll")}
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={rejectAll}
                    className="flex-1 border-2 border-outline-variant/60 bg-surface text-on-surface px-4 py-2.5 rounded-full text-xs uppercase tracking-widest font-medium hover:bg-on-surface/5 hover:border-outline-variant transition-all"
                  >
                    {t("cookie.rejectAll")}
                  </button>
                  <button
                    type="button"
                    onClick={openSettings}
                    className="flex-1 text-on-surface px-4 py-2.5 rounded-full text-xs uppercase tracking-widest font-medium hover:bg-on-surface/5 transition-colors"
                  >
                    {t("cookie.customize")}
                  </button>
                </div>
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

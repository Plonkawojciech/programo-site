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
            className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-auto md:max-w-md z-[100]"
          >
            <div className="liquid-glass rounded-3xl bg-surface-container/95 backdrop-blur-xl border border-outline-variant/20 shadow-2xl p-6 md:p-7">
              <h2 className="font-headline text-lg md:text-xl font-semibold tracking-tight text-on-surface">
                {t("cookie.title")}
              </h2>
              <p className="mt-2 text-xs md:text-sm font-light leading-relaxed text-on-surface-variant">
                {t("cookie.desc")}{" "}
                <Link
                  href="/polityka-prywatnosci"
                  className="underline decoration-on-surface-variant/40 underline-offset-2 hover:text-on-surface transition-colors"
                >
                  {t("cookie.privacyLink")}
                </Link>
                .
              </p>

              <div className="mt-5 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={acceptAll}
                  className="w-full bg-primary text-on-primary px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-primary-container transition-all"
                >
                  {t("cookie.acceptAll")}
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={rejectAll}
                    className="flex-1 border border-outline-variant/40 text-on-surface px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-medium hover:bg-on-surface/5 transition-all"
                  >
                    {t("cookie.rejectAll")}
                  </button>
                  <button
                    type="button"
                    onClick={openSettings}
                    className="flex-1 text-on-surface-variant px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-medium hover:text-on-surface transition-colors"
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
            className="fixed inset-0 z-[110] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-6"
            onClick={closeSettings}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-3xl bg-surface-container border border-outline-variant/30 shadow-2xl p-7 md:p-9"
              role="dialog"
              aria-modal="true"
              aria-label={t("cookie.settingsTitle")}
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-headline text-2xl font-semibold tracking-tight text-on-surface">
                  {t("cookie.settingsTitle")}
                </h2>
                <button
                  type="button"
                  onClick={closeSettings}
                  aria-label="Close"
                  className="text-on-surface-variant hover:text-on-surface transition-colors -mt-1 -mr-1 p-1"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="mt-3 text-sm font-light leading-relaxed text-on-surface-variant">
                {t("cookie.settingsDesc")}
              </p>

              <div className="mt-7 flex flex-col gap-4">
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

              <div className="mt-8 flex flex-col-reverse md:flex-row gap-2 md:gap-3">
                <button
                  type="button"
                  onClick={rejectAll}
                  className="flex-1 border border-outline-variant/40 text-on-surface px-5 py-3 rounded-full text-xs uppercase tracking-widest font-medium hover:bg-on-surface/5 transition-all"
                >
                  {t("cookie.rejectAll")}
                </button>
                <button
                  type="button"
                  onClick={() => save({ analytics, marketing })}
                  className="flex-1 bg-primary text-on-primary px-5 py-3 rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-primary-container transition-all"
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
    <div className="flex items-start justify-between gap-4 py-3 border-b border-outline-variant/20 last:border-0">
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-on-surface">{title}</h3>
        <p className="mt-1 text-xs font-light leading-relaxed text-on-surface-variant">
          {desc}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-on-surface/15"
        } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

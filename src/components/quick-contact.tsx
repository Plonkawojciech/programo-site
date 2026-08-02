"use client";

import { useState, useId } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { getAttribution, trackLead, trackContactClick } from "@/lib/tracking";
import { easeEntry, durationMedium } from "@/lib/motion";

type FormState = "idle" | "submitting" | "success" | "error";

export default function QuickContact() {
  const { t } = useI18n();
  const prefersReduced = useReducedMotion();
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [consent, setConsent] = useState(false);

  const phoneId = useId();
  const nameId = useId();
  const contextId = useId();
  const consentId = useId();
  const errorId = useId();

  const reveal = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-12% 0px" },
        transition: { duration: durationMedium, ease: easeEntry },
      };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent) {
      setErrorMsg(t("qc.consentRequired"));
      setState("error");
      return;
    }
    setState("submitting");
    setErrorMsg("");

    const fd = new FormData(e.currentTarget);
    const phone = String(fd.get("phone") || "").trim();
    const name = String(fd.get("name") || "").trim();
    const context = String(fd.get("context") || "").trim();

    // The phone number is the whole lead. /api/contact waives name, email and
    // message whenever a dialable number is present, so nothing is invented
    // here to get past validation — blank fields are sent blank.
    const payload = {
      name,
      email: "",
      phone,
      message: context.slice(0, 2000),
      projectType: "",
      budget: "",
      consent: true as const,
      consentTimestamp: new Date().toISOString(),
      ...getAttribution(),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data?.error || t("qc.error"));
        setState("error");
        return;
      }

      setState("success");
      trackLead({ form: "quick-contact" });
      (e.target as HTMLFormElement).reset();
      setConsent(false);
    } catch {
      setErrorMsg(t("qc.error"));
      setState("error");
    }
  }

  return (
    <section
      id="kontakt-main"
      className="scroll-mt-24 bg-surface py-section-major"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left column: heading + direct contact */}
          <motion.div {...reveal} className="flex flex-col gap-10">
            <div>
              <h2 className="font-headline text-h2 font-bold tracking-[-0.02em] text-on-surface text-balance">
                {t("qc.title")}
              </h2>
              <p className="mt-5 max-w-[50ch] text-lead text-on-surface-variant leading-relaxed text-pretty">
                {t("qc.subtitle")}
              </p>
            </div>

            {/* Direct call alternative */}
            <div className="flex flex-col gap-5 border-t border-outline-variant pt-8">
              <p className="text-sm font-medium text-on-surface-variant">
                {t("qc.orCall")}
              </p>
              <a
                href="tel:+48797222363"
                onClick={() => trackContactClick("phone", "tel:+48797222363")}
                className="inline-flex items-center gap-3 font-headline text-h3 font-bold tracking-[-0.02em] text-on-surface transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5 shrink-0 text-primary"
                >
                  <path d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-.65 1.548l-.654.436a.25.25 0 00-.106.258c.344 1.632 1.543 2.831 3.175 3.175a.25.25 0 00.258-.106l.436-.654a1.5 1.5 0 011.548-.65l3.223.716A1.5 1.5 0 0118 12.352v1.148A1.5 1.5 0 0116.5 15h-1.5A12.5 12.5 0 012 3.5z" />
                </svg>
                +48 797 222 363
              </a>
              <a
                href="mailto:biuro@programo.pl"
                onClick={() => trackContactClick("email", "mailto:biuro@programo.pl")}
                className="text-on-surface-variant font-medium transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded"
              >
                {t("qc.orEmail")}: biuro@programo.pl
              </a>
            </div>
          </motion.div>

          {/* Right column: form */}
          <motion.div
            {...(prefersReduced
              ? {}
              : {
                  initial: { opacity: 0, y: 16 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: "-8% 0px" },
                  transition: {
                    delay: 0.1,
                    duration: durationMedium,
                    ease: easeEntry,
                  },
                })}
          >
            {state === "success" ? (
              <div
                className="flex flex-col gap-5"
                role="status"
                aria-live="polite"
              >
                <h3 className="font-headline text-h3 font-bold tracking-[-0.02em] text-on-surface">
                  {t("qc.successTitle")}
                </h3>
                <p className="max-w-[50ch] text-on-surface-variant leading-relaxed text-pretty">
                  {t("qc.successBody")}
                </p>
                <button
                  type="button"
                  onClick={() => setState("idle")}
                  className="mt-2 self-start text-sm font-medium text-primary transition-colors hover:text-on-surface cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded"
                >
                  {t("qc.successAgain")}
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-6"
              >
                {/* Phone — primary field */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor={phoneId}
                    className="text-sm font-medium text-on-surface"
                  >
                    {t("qc.phoneLabel")} *
                  </label>
                  <input
                    id={phoneId}
                    type="tel"
                    name="phone"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder={t("qc.phonePlaceholder")}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3.5 text-lg text-on-surface placeholder:text-on-surface-variant outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Name — optional */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor={nameId}
                    className="text-sm font-medium text-on-surface-variant"
                  >
                    {t("qc.nameLabel")}
                  </label>
                  <input
                    id={nameId}
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder={t("qc.namePlaceholder")}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3.5 text-on-surface placeholder:text-on-surface-variant outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Context — optional, maps to `message` */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor={contextId}
                    className="text-sm font-medium text-on-surface-variant"
                  >
                    {t("qc.contextLabel")}
                  </label>
                  <input
                    id={contextId}
                    type="text"
                    name="context"
                    placeholder={t("qc.contextPlaceholder")}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3.5 text-on-surface placeholder:text-on-surface-variant outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Consent */}
                <label
                  className="flex items-start gap-3 cursor-pointer group"
                >
                  <span className="relative shrink-0 mt-0.5">
                    <input
                      id={consentId}
                      type="checkbox"
                      name="consent"
                      checked={consent}
                      onChange={(e) => {
                        setConsent(e.target.checked);
                        if (state === "error") {
                          setState("idle");
                          setErrorMsg("");
                        }
                      }}
                      required
                      aria-describedby={state === "error" ? errorId : undefined}
                      className="peer h-5 w-5 appearance-none rounded border border-outline-variant bg-transparent transition-colors checked:bg-primary checked:border-primary hover:border-on-surface-variant focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 cursor-pointer"
                    />
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      className="pointer-events-none absolute inset-0 m-auto h-3 w-3 opacity-0 peer-checked:opacity-100 transition-opacity text-on-primary"
                    >
                      <path
                        d="M3 8l3.5 3.5L13 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  </span>
                  <span className="text-sm leading-relaxed text-on-surface-variant group-hover:text-on-surface transition-colors">
                    {t("qc.consentLabel")}{" "}
                    <Link
                      href="/polityka-prywatnosci"
                      className="underline decoration-outline-variant underline-offset-2 hover:text-on-surface transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t("qc.privacyLink")}
                    </Link>
                    .
                  </span>
                </label>

                {/* Submit + trust + error */}
                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={state === "submitting"}
                    className="w-full md:w-auto md:self-start inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-lg text-base font-medium transition-colors hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                  >
                    {state === "submitting" ? t("qc.sending") : t("qc.send")}
                  </button>

                  <p className="text-sm text-on-surface-variant">
                    {t("qc.trust")}
                  </p>

                  {state === "error" && (
                    <p
                      id={errorId}
                      role="alert"
                      className="flex items-start gap-2 text-sm font-medium text-red-500"
                    >
                      <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      {errorMsg || t("qc.error")}
                    </p>
                  )}
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

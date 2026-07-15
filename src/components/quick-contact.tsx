"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { getAttribution, trackLead } from "@/lib/tracking";

type TKey = Parameters<ReturnType<typeof useI18n>["t"]>[0];
type FormState = "idle" | "submitting" | "success";
type FieldErrors = {
  name?: string;
  contact?: string;
  consent?: string;
  server?: string;
};

const PROJECT_TYPES: { key: string; tKey: TKey }[] = [
  { key: "web", tKey: "quick.type.web" },
  { key: "mobile", tKey: "quick.type.mobile" },
  { key: "store", tKey: "quick.type.store" },
  { key: "marketing", tKey: "quick.type.marketing" },
  { key: "other", tKey: "quick.type.other" },
];

const labelClass =
  "text-xs font-bold uppercase tracking-widest text-on-surface-variant";
const chipBase =
  "min-h-[48px] rounded-full border px-4 py-2 text-sm font-medium transition-colors cursor-pointer";
const inputClass =
  "min-h-[48px] w-full bg-transparent border-b border-outline-variant/40 py-3 text-lg text-on-surface placeholder:text-on-surface/70 outline-none focus:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 transition-colors";

// Loose but useful phone sanity check: at least 9 digits, only phone-ish chars.
function isLikelyPhone(v: string): boolean {
  const digits = v.replace(/\D/g, "");
  return digits.length >= 9 && /^[+]?[\d\s()-]+$/.test(v.trim());
}
function isLikelyEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
      <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export default function QuickContact({ formId = "quick-contact" }: { formId?: string } = {}) {
  const { t } = useI18n();
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [consent, setConsent] = useState(false);
  const [projectType, setProjectType] = useState<TKey | null>(null);
  // Guards the primary Google Ads "Lead" conversion against a double-fire from a
  // rapid double-submit (before the button's disabled state applies) or any re-render race.
  const submittingRef = useRef(false);
  const successRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the success message so keyboard/screen-reader users are told
  // the submission worked, since the form disappears (pattern from compact-lead-form.tsx).
  useEffect(() => {
    if (state === "success") successRef.current?.focus();
  }, [state]);

  function clearFieldError(field: keyof FieldErrors) {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittingRef.current) return;

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const contactRaw = String(formData.get("contact") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const isEmail = contactRaw.includes("@");
    const email = isEmail ? contactRaw : "";
    const phone = isEmail ? "" : contactRaw;

    const nextErrors: FieldErrors = {};
    if (!name) nextErrors.name = t("quick.nameRequired");
    if (!contactRaw) {
      nextErrors.contact = t("quick.contactRequired");
    } else if (isEmail && !isLikelyEmail(contactRaw)) {
      nextErrors.contact = t("quick.emailInvalid");
    } else if (!isEmail && !isLikelyPhone(contactRaw)) {
      nextErrors.contact = t("quick.phoneInvalid");
    }
    if (!consent) nextErrors.consent = t("quick.consentRequired");

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    submittingRef.current = true;
    setState("submitting");
    setErrors({});

    const payload = {
      name,
      email,
      phone,
      message,
      projectType: projectType ? t(projectType) : "",
      consent: true,
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
        setErrors({ server: data?.error || t("quick.error") });
        setState("idle");
        return;
      }

      // Success branch only (API returned ok) — fire the primary Google Ads "Lead"
      // conversion exactly once per successful submit.
      setState("success");
      trackLead({ form: formId, email, phone });
      (e.target as HTMLFormElement).reset();
      setConsent(false);
      setProjectType(null);
    } catch {
      setErrors({ server: t("quick.error") });
      setState("idle");
    } finally {
      submittingRef.current = false;
    }
  }

  return (
    <section id="kontakt-main" className="relative bg-surface py-24 md:py-32 lg:py-40 border-t border-outline-variant/20 scroll-mt-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left side: heading + direct contact channels */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            <div>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-primary"
              >
                {t("contact.label")}
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-6 font-headline text-4xl md:text-6xl 2xl:text-7xl font-bold tracking-tighter text-on-surface"
              >
                {t("quick.title")}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="mt-6 text-lg md:text-xl font-light text-on-surface/70 leading-relaxed max-w-md"
              >
                {t("quick.subtitle")}
              </motion.p>
            </div>

            {/* Direct contact channels — founders + email + SLA */}
            <div className="flex flex-col gap-6 border-t border-outline-variant/30 pt-10">
              <a href="mailto:biuro@programo.pl" className="group flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  {t("quick.aside.emailLabel")}
                </span>
                <span className="font-headline text-xl md:text-2xl font-medium text-on-surface group-hover:text-primary transition-colors">
                  biuro@programo.pl
                </span>
              </a>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <a href="tel:+48797222363" className="group flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    {t("quick.aside.wojciechName")}
                  </span>
                  <span className="text-base font-medium text-on-surface group-hover:text-primary transition-colors">
                    +48 797 222 363
                  </span>
                </a>
                <a href="tel:+48509123434" className="group flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    {t("quick.aside.bartoszName")}
                  </span>
                  <span className="text-base font-medium text-on-surface group-hover:text-primary transition-colors">
                    +48 509 123 434
                  </span>
                </a>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-on-surface-variant">
                <span>{t("quick.aside.location")}</span>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-primary">{t("quick.aside.sla")}</span>
              </div>
            </div>
          </div>

          {/* Right side: form */}
          <div className="lg:col-span-7">
            {state === "success" ? (
              <motion.div
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-start gap-6 bg-surface-container/40 border border-primary/40 rounded-3xl p-8 md:p-12"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
                    <path d="M4 12.5l5 5L20 6.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h3
                  ref={successRef}
                  tabIndex={-1}
                  className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-on-surface outline-none"
                >
                  {t("quick.successTitle")}
                </h3>
                <p className="text-base md:text-lg font-light leading-relaxed text-on-surface/70 max-w-lg">
                  {t("quick.successBody")}
                </p>
                <button
                  type="button"
                  onClick={() => setState("idle")}
                  className="mt-2 inline-flex items-center gap-2 text-sm uppercase tracking-widest font-medium text-primary hover:gap-4 transition-all cursor-pointer"
                >
                  {t("quick.successAgain")} <span aria-hidden="true">→</span>
                </button>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                noValidate
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col gap-8 bg-surface-container/40 border border-outline-variant/30 rounded-3xl p-8 md:p-12"
              >
                {/* Project type chips */}
                <div className="flex flex-col gap-3">
                  <span className={labelClass}>{t("quick.typeLabel")}</span>
                  <div className="flex flex-wrap gap-2.5">
                    {PROJECT_TYPES.map((opt) => {
                      const active = projectType === opt.tKey;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setProjectType(active ? null : opt.tKey)}
                          className={`${chipBase} ${
                            active
                              ? "border-primary bg-primary text-on-primary"
                              : "border-outline-variant/40 text-on-surface-variant hover:border-primary hover:text-on-surface"
                          }`}
                        >
                          {t(opt.tKey)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Data (name, contact, consent, submit) | Message — 2 columns on desktop.
                    items-start keeps the right column at its natural height instead of
                    stretching to match the taller left column (was ~450px of dead space
                    inside a 7-row textarea). */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 md:items-start">
                  <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="quick-name" className={labelClass}>
                        {t("quick.name")}
                      </label>
                      <input
                        id="quick-name"
                        type="text"
                        name="name"
                        required
                        autoComplete="name"
                        aria-invalid={errors.name ? true : undefined}
                        aria-describedby={errors.name ? "quick-name-error" : undefined}
                        className={inputClass}
                        placeholder={t("quick.namePlaceholder")}
                        onChange={() => clearFieldError("name")}
                      />
                      {errors.name && (
                        <p id="quick-name-error" role="alert" className="text-sm text-red-500">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="quick-contact" className={labelClass}>
                        {t("quick.contactLabel")}
                      </label>
                      <input
                        id="quick-contact"
                        type="text"
                        name="contact"
                        required
                        autoComplete="tel"
                        inputMode="text"
                        aria-invalid={errors.contact ? true : undefined}
                        aria-describedby={errors.contact ? "quick-contact-error" : undefined}
                        className={inputClass}
                        placeholder={t("quick.contactPlaceholder")}
                        onChange={() => clearFieldError("contact")}
                      />
                      {errors.contact && (
                        <p id="quick-contact-error" role="alert" className="text-sm text-red-500">
                          {errors.contact}
                        </p>
                      )}
                    </div>

                    <label className="flex min-h-[48px] items-start gap-3.5 cursor-pointer group rounded-2xl border border-outline-variant/60 bg-surface/70 p-4">
                      <span className="relative shrink-0 mt-0.5">
                        <input
                          type="checkbox"
                          name="consent"
                          checked={consent}
                          onChange={(e) => {
                            setConsent(e.target.checked);
                            clearFieldError("consent");
                          }}
                          required
                          aria-invalid={errors.consent ? true : undefined}
                          aria-describedby={errors.consent ? "quick-consent-error" : undefined}
                          className="peer h-5 w-5 appearance-none rounded-md border-2 border-outline bg-surface transition-colors checked:bg-primary checked:border-primary hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 cursor-pointer"
                        />
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 16 16"
                          className="pointer-events-none absolute inset-0 m-auto h-3.5 w-3.5 opacity-0 peer-checked:opacity-100 transition-opacity text-on-primary"
                        >
                          <path
                            d="M3 8l3.5 3.5L13 5"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                          />
                        </svg>
                      </span>
                      <span className="text-sm leading-relaxed text-on-surface/80 group-hover:text-on-surface transition-colors">
                        {t("quick.consentLabel")}{" "}
                        <Link
                          href="/polityka-prywatnosci"
                          className="font-medium text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {t("quick.privacyLink")}
                        </Link>
                        .
                      </span>
                    </label>
                    {errors.consent && (
                      <p id="quick-consent-error" role="alert" className="-mt-4 text-sm text-red-500">
                        {errors.consent}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="quick-message" className={labelClass}>
                      {t("quick.message")}{" "}
                      <span className="normal-case font-normal text-on-surface-variant">
                        {t("quick.optional")}
                      </span>
                    </label>
                    <textarea
                      id="quick-message"
                      name="message"
                      rows={4}
                      className={`${inputClass} resize-none`}
                      placeholder={t("quick.messagePlaceholder")}
                    />
                  </div>
                </div>

                {/* Submit spans full width, always after both columns (name/contact/consent +
                    message) regardless of viewport — keeps the mobile field order sane.
                    No border-t here: with the textarea back to its natural height the
                    fields end right above this block, so a rule line only reads as an
                    orphaned stray under it. */}
                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={state === "submitting"}
                    className="w-full md:w-auto md:self-start inline-flex min-h-[48px] items-center justify-center gap-3 bg-primary text-on-primary px-8 py-4 rounded-full text-sm uppercase tracking-widest font-medium hover:bg-primary-container transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:gap-5"
                  >
                    {state === "submitting" ? (
                      <>
                        <Spinner />
                        {t("quick.sending")}
                      </>
                    ) : (
                      <>
                        {t("quick.send")} <span aria-hidden="true">→</span>
                      </>
                    )}
                  </button>
                  {errors.server && (
                    <p role="alert" className="text-sm text-red-500">
                      {errors.server}
                    </p>
                  )}
                  <p className="text-xs font-light text-on-surface-variant/80 leading-relaxed">
                    {t("quick.trust")}
                  </p>
                </div>
              </motion.form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

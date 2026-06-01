"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { getAttribution, trackLead } from "@/lib/tracking";

type TKey = Parameters<ReturnType<typeof useI18n>["t"]>[0];
type FormState = "idle" | "submitting" | "success" | "error";

const PROJECT_TYPES: { key: string; tKey: TKey }[] = [
  { key: "web", tKey: "quick.type.web" },
  { key: "saas", tKey: "quick.type.saas" },
  { key: "mobile", tKey: "quick.type.mobile" },
  { key: "ai", tKey: "quick.type.ai" },
  { key: "other", tKey: "quick.type.other" },
];

const BUDGETS: { key: string; tKey: TKey }[] = [
  { key: "s", tKey: "quick.budget.s" },
  { key: "m", tKey: "quick.budget.m" },
  { key: "l", tKey: "quick.budget.l" },
  { key: "xl", tKey: "quick.budget.xl" },
  { key: "unsure", tKey: "quick.budget.unsure" },
];

const labelClass =
  "text-xs font-bold uppercase tracking-widest text-on-surface-variant";
const chipBase =
  "rounded-full border px-4 py-2 text-sm font-medium transition-colors cursor-pointer";
const inputClass =
  "w-full bg-transparent border-b border-outline-variant/40 py-3 text-lg text-on-surface placeholder:text-on-surface/30 outline-none focus:border-primary transition-colors";

export default function QuickContact() {
  const { t } = useI18n();
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [consent, setConsent] = useState(false);
  const [projectType, setProjectType] = useState<TKey | null>(null);
  const [budget, setBudget] = useState<TKey | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent) {
      setErrorMsg(t("quick.consentRequired"));
      setState("error");
      return;
    }
    setState("submitting");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      message: String(formData.get("message") || ""),
      projectType: projectType ? t(projectType) : "",
      budget: budget ? t(budget) : "",
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
        setErrorMsg(data?.error || t("quick.error"));
        setState("error");
        return;
      }

      setState("success");
      trackLead({ form: "quick-contact" });
      (e.target as HTMLFormElement).reset();
      setConsent(false);
      setProjectType(null);
      setBudget(null);
    } catch {
      setErrorMsg(t("quick.error"));
      setState("error");
    }
  }

  return (
    <section id="kontakt-main" className="relative bg-surface py-24 md:py-32 lg:py-40 border-t border-outline-variant/20 scroll-mt-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left side: heading + alt contacts */}
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

            {/* Alt contact channels */}
            <div className="flex flex-col gap-6 border-t border-outline-variant/30 pt-10">
              <a
                href="mailto:biuro@programo.pl"
                className="group flex flex-col gap-1"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Email
                </span>
                <span className="font-headline text-xl md:text-2xl font-medium text-on-surface group-hover:text-primary transition-colors">
                  biuro@programo.pl
                </span>
              </a>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <a
                  href="tel:+48797222363"
                  className="group flex flex-col gap-1"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Wojciech
                  </span>
                  <span className="text-base font-medium text-on-surface group-hover:text-primary transition-colors">
                    +48 797 222 363
                  </span>
                </a>
                <a
                  href="tel:+48509123434"
                  className="group flex flex-col gap-1"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Bartosz
                  </span>
                  <span className="text-base font-medium text-on-surface group-hover:text-primary transition-colors">
                    +48 509 123 434
                  </span>
                </a>
              </div>

              <div className="mt-2 text-sm text-on-surface-variant">
                Poznań, Polska
              </div>
            </div>
          </div>

          {/* Right side: form */}
          <div className="lg:col-span-7">
            {state === "success" ? (
              <motion.div
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
                <h3 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-on-surface">
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col gap-7 bg-surface-container/40 border border-outline-variant/30 rounded-3xl p-8 md:p-12"
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

                {/* Budget chips */}
                <div className="flex flex-col gap-3">
                  <span className={labelClass}>{t("quick.budgetLabel")}</span>
                  <div className="flex flex-wrap gap-2.5">
                    {BUDGETS.map((opt) => {
                      const active = budget === opt.tKey;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setBudget(active ? null : opt.tKey)}
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

                <div className="flex flex-col gap-2">
                  <label className={labelClass}>{t("quick.name")} *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className={inputClass}
                    placeholder="Jan Kowalski"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>{t("quick.email")} *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className={inputClass}
                      placeholder="jan@firma.pl"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>{t("quick.phone")}</label>
                    <input
                      type="tel"
                      name="phone"
                      className={inputClass}
                      placeholder="+48 600 000 000"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClass}>{t("quick.message")} *</label>
                  <textarea
                    name="message"
                    required
                    minLength={20}
                    rows={5}
                    className={`${inputClass} resize-none`}
                    placeholder="Mam pomysł na aplikację / stronę / system..."
                  />
                </div>

                <label className="mt-1 flex items-start gap-3 cursor-pointer group">
                  <span className="relative shrink-0 mt-0.5">
                    <input
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
                      className="peer h-[18px] w-[18px] appearance-none rounded-[5px] border border-outline-variant/50 bg-transparent transition-colors checked:bg-primary checked:border-primary hover:border-on-surface/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 cursor-pointer"
                    />
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      className="pointer-events-none absolute inset-0 m-auto h-[12px] w-[12px] opacity-0 peer-checked:opacity-100 transition-opacity text-on-primary"
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
                  <span className="text-[13px] md:text-sm font-light leading-relaxed text-on-surface-variant group-hover:text-on-surface/90 transition-colors">
                    {t("quick.consentLabel")}{" "}
                    <Link
                      href="/polityka-prywatnosci"
                      className="underline decoration-on-surface-variant/40 underline-offset-2 hover:text-on-surface"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t("quick.privacyLink")}
                    </Link>
                    .
                  </span>
                </label>

                <div className="flex flex-col gap-3 mt-1">
                  <button
                    type="submit"
                    disabled={state === "submitting" || !consent}
                    className="w-full md:w-auto md:self-start inline-flex items-center justify-center gap-3 bg-primary text-on-primary px-8 py-4 rounded-full text-sm uppercase tracking-widest font-medium hover:bg-primary-container transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:gap-5"
                  >
                    {state === "submitting" ? t("quick.sending") : t("quick.send")}{" "}
                    <span>→</span>
                  </button>

                  <p className="text-xs font-light text-on-surface-variant/80 leading-relaxed">
                    {t("quick.trust")}
                  </p>

                  {state === "error" && (
                    <p className="text-sm text-red-500">
                      {errorMsg || t("quick.error")}
                    </p>
                  )}
                </div>
              </motion.form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

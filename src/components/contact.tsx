"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";

type FormState = "idle" | "submitting" | "success" | "error";

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function Contact() {
  const { t } = useI18n();
  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [toast, setToast] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function validate(form: FormData): FormErrors {
    const errs: FormErrors = {};
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const subject = form.get("subject") as string;
    const message = form.get("message") as string;

    if (!name || name.trim() === "") errs.name = t("contact.form.errorRequired");
    if (!email || email.trim() === "") {
      errs.email = t("contact.form.errorRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = t("contact.form.errorEmail");
    }
    if (!subject || subject.trim() === "") errs.subject = t("contact.form.errorRequired");
    if (!message || message.trim() === "") {
      errs.message = t("contact.form.errorRequired");
    } else if (message.length < 20) {
      errs.message = t("contact.form.errorMinLength");
    } else if (message.length > 2000) {
      errs.message = t("contact.form.errorMaxLength");
    }

    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = new FormData(formRef.current!);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setFormState("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          subject: form.get("subject"),
          message: form.get("message"),
        }),
      });
      if (res.status === 429) {
        setToast(t("contact.form.rateLimitToast"));
        setFormState("error");
        return;
      }
      if (!res.ok) throw new Error("Failed");
      setFormState("success");
      setToast(t("contact.form.successToast"));
      formRef.current?.reset();
    } catch {
      setFormState("error");
      setToast(t("contact.form.errorToast"));
    }
  }

  return (
    <section id="contact" className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 gap-16 md:gap-20 lg:grid-cols-2">
          {/* Left: Info */}
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-xs font-semibold uppercase tracking-[0.3em] text-on-surface-variant mb-4 block"
            >
              {t("contact.label")}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold tracking-tight text-on-surface md:text-6xl"
            >
              <span className="gradient-text">Let&apos;s Connect.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-6 max-w-md text-base text-on-surface-variant"
            >
              {t("contact.desc")}
            </motion.p>

            <div className="mt-12 flex flex-col gap-8">
              <div className="group cursor-pointer">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
                  Email
                </span>
                <a
                  href="mailto:kontakt@programo.pl"
                  className="mt-2 block text-lg font-medium text-on-surface transition-colors group-hover:text-primary md:text-xl"
                >
                  kontakt@programo.pl
                </a>
              </div>

              <div className="flex flex-col md:flex-row gap-8 md:gap-16">
                <div className="group cursor-pointer">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
                    Wojciech
                  </span>
                  <a
                    href="mailto:wojciech.plonka@programo.pl"
                    className="mt-1 block text-sm text-on-surface-variant transition-colors group-hover:text-primary break-all md:break-normal"
                  >
                    wojciech.plonka@programo.pl
                  </a>
                </div>
                <div className="group cursor-pointer">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">
                    Bartosz
                  </span>
                  <a
                    href="mailto:bartosz.kolaj@programo.pl"
                    className="mt-1 block text-sm text-on-surface-variant transition-colors group-hover:text-primary break-all md:break-normal"
                  >
                    bartosz.kolaj@programo.pl
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
              {/* Name input card */}
              <div className="bento-card focus-gradient p-5">
                <label htmlFor="contact-name" className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant block mb-2">
                  {t("contact.form.name")}
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder={t("contact.form.namePlaceholder")}
                  className="w-full bg-transparent text-on-surface text-base font-medium outline-none placeholder:text-on-surface-variant/30"
                />
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
              </div>

              {/* Email input card */}
              <div className="bento-card focus-gradient p-5">
                <label htmlFor="contact-email" className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant block mb-2">
                  {t("contact.form.email")}
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder={t("contact.form.emailPlaceholder")}
                  className="w-full bg-transparent text-on-surface text-base font-medium outline-none placeholder:text-on-surface-variant/30"
                />
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
              </div>

              {/* Subject select card */}
              <div className="bento-card focus-gradient p-5">
                <label htmlFor="contact-subject" className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant block mb-2">
                  {t("contact.form.subject")}
                </label>
                <select
                  id="contact-subject"
                  name="subject"
                  className="w-full bg-transparent text-on-surface text-base font-medium outline-none appearance-none cursor-pointer"
                >
                  <option value="" className="bg-surface text-on-surface">{t("contact.form.subjectPlaceholder")}</option>
                  <option value="Współpraca" className="bg-surface text-on-surface">{t("contact.form.subjectCollab")}</option>
                  <option value="Wycena projektu" className="bg-surface text-on-surface">{t("contact.form.subjectQuote")}</option>
                  <option value="Pytanie techniczne" className="bg-surface text-on-surface">{t("contact.form.subjectTech")}</option>
                  <option value="Inne" className="bg-surface text-on-surface">{t("contact.form.subjectOther")}</option>
                </select>
                {errors.subject && <p className="mt-1 text-xs text-red-400">{errors.subject}</p>}
              </div>

              {/* Message input card */}
              <div className="bento-card focus-gradient p-5">
                <label htmlFor="contact-message" className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant block mb-2">
                  {t("contact.form.message")}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  placeholder={t("contact.form.messagePlaceholder")}
                  className="w-full bg-transparent text-on-surface text-base font-medium outline-none placeholder:text-on-surface-variant/30 resize-none"
                />
                {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={formState === "submitting"}
                className="mt-2 w-full rounded-full bg-gradient-to-r from-primary via-secondary to-tertiary py-3.5 text-sm font-semibold text-white transition-all hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.4)] active:scale-[0.98] disabled:opacity-50"
              >
                <AnimatePresence mode="wait">
                  {formState === "submitting" ? (
                    <motion.span key="sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {t("contact.form.submitting")}
                    </motion.span>
                  ) : formState === "success" ? (
                    <motion.span key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {t("contact.form.submitted")}
                    </motion.span>
                  ) : (
                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {t("contact.form.submit")}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </form>

            {/* Toast */}
            <AnimatePresence>
              {toast && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-4 text-sm text-center text-on-surface-variant"
                >
                  {toast}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

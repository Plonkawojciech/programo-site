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
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLSelectElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const subjects = [
    { value: "Współpraca", label: t("contact.form.subjectCollab") },
    { value: "Wycena projektu", label: t("contact.form.subjectQuote") },
    { value: "Pytanie techniczne", label: t("contact.form.subjectTech") },
    { value: "Inne", label: t("contact.form.subjectOther") },
  ];

  function validate(): FormErrors {
    const errs: FormErrors = {};
    const name = nameRef.current?.value.trim() || "";
    const email = emailRef.current?.value.trim() || "";
    const subject = subjectRef.current?.value || "";
    const message = messageRef.current?.value.trim() || "";

    if (!name) errs.name = t("contact.form.errorRequired");
    if (!email) {
      errs.email = t("contact.form.errorRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = t("contact.form.errorEmail");
    }
    if (!subject) errs.subject = t("contact.form.errorRequired");
    if (!message) {
      errs.message = t("contact.form.errorRequired");
    } else if (message.length < 20) {
      errs.message = t("contact.form.errorMinLength");
    } else if (message.length > 2000) {
      errs.message = t("contact.form.errorMaxLength");
    }

    return errs;
  }

  function focusFirstError(errs: FormErrors) {
    if (errs.name) nameRef.current?.focus();
    else if (errs.email) emailRef.current?.focus();
    else if (errs.subject) subjectRef.current?.focus();
    else if (errs.message) messageRef.current?.focus();
  }

  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      focusFirstError(errs);
      return;
    }

    setFormState("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameRef.current?.value.trim(),
          email: emailRef.current?.value.trim(),
          subject: subjectRef.current?.value,
          message: messageRef.current?.value.trim(),
        }),
      });

      if (res.status === 429) {
        setFormState("error");
        showToast(t("contact.form.rateLimitToast"), "error");
        return;
      }

      if (!res.ok) {
        setFormState("error");
        showToast(t("contact.form.errorToast"), "error");
        return;
      }

      setFormState("success");
      showToast(t("contact.form.successToast"), "success");
      formRef.current?.reset();
      setTimeout(() => setFormState("idle"), 3000);
    } catch {
      setFormState("error");
      showToast(t("contact.form.errorToast"), "error");
    }
  }

  const inputClasses = (hasError: boolean) =>
    `w-full rounded-xl border bg-inverse-surface/5 px-4 py-3 text-sm text-inverse-on-surface placeholder:text-inverse-on-surface/30 outline-none transition-all duration-300 focus:ring-2 focus:ring-inverse-on-surface/20 ${
      hasError
        ? "border-red-400"
        : "border-inverse-on-surface/15 focus:border-inverse-on-surface/30"
    }`;

  return (
    <section id="contact" className="py-20 md:py-28 lg:py-32 px-8 md:px-24 max-w-[1920px] mx-auto">
      <div className="bg-on-surface text-surface rounded-[32px] px-8 md:px-16 py-20 md:py-24 relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <p className="mb-3 text-[11px] font-medium tracking-[0.2em] uppercase text-primary-container">
              {t("contact.label")}
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tighter leading-none mb-12 text-inverse-on-surface">
              {t("contact.title1")}
              <br />
              {t("contact.title2")}
            </h2>
            <p className="text-base font-normal leading-relaxed text-surface-container-high/80 max-w-md mb-12">
              {t("contact.desc")}
            </p>

            {/* Email links */}
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-primary-container mb-2">
                  kontakt@programo.pl
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                <a
                  href="mailto:wojciech.plonka@programo.pl"
                  className="text-lg md:text-xl font-normal text-inverse-on-surface hover:text-primary-container transition-colors"
                >
                  wojciech.plonka@programo.pl
                </a>
              </div>
              <div>
                <a
                  href="mailto:bartosz.kolaj@programo.pl"
                  className="text-lg md:text-xl font-normal text-inverse-on-surface hover:text-primary-container transition-colors"
                >
                  bartosz.kolaj@programo.pl
                </a>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-7 lg:pl-12">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              noValidate
              className="space-y-6"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-2 block text-[11px] font-medium tracking-wider uppercase text-inverse-on-surface/60"
                >
                  {t("contact.form.name")} *
                </label>
                <input
                  ref={nameRef}
                  id="contact-name"
                  type="text"
                  placeholder={t("contact.form.namePlaceholder")}
                  aria-describedby={
                    errors.name ? "contact-name-error" : undefined
                  }
                  aria-invalid={!!errors.name}
                  className={inputClasses(!!errors.name)}
                  onChange={() =>
                    errors.name &&
                    setErrors((prev) => ({ ...prev, name: undefined }))
                  }
                />
                {errors.name && (
                  <p
                    id="contact-name-error"
                    className="mt-1 text-xs text-red-400"
                    role="alert"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-2 block text-[11px] font-medium tracking-wider uppercase text-inverse-on-surface/60"
                >
                  {t("contact.form.email")} *
                </label>
                <input
                  ref={emailRef}
                  id="contact-email"
                  type="email"
                  placeholder={t("contact.form.emailPlaceholder")}
                  aria-describedby={
                    errors.email ? "contact-email-error" : undefined
                  }
                  aria-invalid={!!errors.email}
                  className={inputClasses(!!errors.email)}
                  onChange={() =>
                    errors.email &&
                    setErrors((prev) => ({ ...prev, email: undefined }))
                  }
                />
                {errors.email && (
                  <p
                    id="contact-email-error"
                    className="mt-1 text-xs text-red-400"
                    role="alert"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="contact-subject"
                  className="mb-2 block text-[11px] font-medium tracking-wider uppercase text-inverse-on-surface/60"
                >
                  {t("contact.form.subject")} *
                </label>
                <select
                  ref={subjectRef}
                  id="contact-subject"
                  defaultValue=""
                  aria-describedby={
                    errors.subject ? "contact-subject-error" : undefined
                  }
                  aria-invalid={!!errors.subject}
                  className={inputClasses(!!errors.subject)}
                  onChange={() =>
                    errors.subject &&
                    setErrors((prev) => ({ ...prev, subject: undefined }))
                  }
                >
                  <option value="" disabled>
                    {t("contact.form.subjectPlaceholder")}
                  </option>
                  {subjects.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                {errors.subject && (
                  <p
                    id="contact-subject-error"
                    className="mt-1 text-xs text-red-400"
                    role="alert"
                  >
                    {errors.subject}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-2 block text-[11px] font-medium tracking-wider uppercase text-inverse-on-surface/60"
                >
                  {t("contact.form.message")} *
                </label>
                <textarea
                  ref={messageRef}
                  id="contact-message"
                  rows={5}
                  placeholder={t("contact.form.messagePlaceholder")}
                  aria-describedby={
                    errors.message ? "contact-message-error" : undefined
                  }
                  aria-invalid={!!errors.message}
                  className={`${inputClasses(!!errors.message)} resize-y`}
                  onChange={() =>
                    errors.message &&
                    setErrors((prev) => ({ ...prev, message: undefined }))
                  }
                />
                {errors.message && (
                  <p
                    id="contact-message-error"
                    className="mt-1 text-xs text-red-400"
                    role="alert"
                  >
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={formState === "submitting"}
                whileHover={{
                  scale: formState === "submitting" ? 1 : 1.02,
                }}
                whileTap={{ scale: formState === "submitting" ? 1 : 0.98 }}
                className={`w-full rounded-full px-8 py-4 text-sm font-medium tracking-wider uppercase transition-all duration-300 min-h-[44px] ${
                  formState === "success"
                    ? "bg-emerald-500 text-white"
                    : "bg-inverse-on-surface text-inverse-surface hover:bg-primary-container hover:text-on-primary-container"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {formState === "submitting"
                  ? t("contact.form.submitting")
                  : formState === "success"
                    ? t("contact.form.submitted")
                    : t("contact.form.submit")}
              </motion.button>
            </form>
          </div>
        </div>

        {/* Background gradient */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full px-6 py-3 text-sm font-medium shadow-lg ${
              toast.type === "success"
                ? "bg-emerald-500 text-white"
                : "bg-red-500 text-white"
            }`}
            role="status"
            aria-live="polite"
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

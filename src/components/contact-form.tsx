"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";

type FormState = "idle" | "submitting" | "success" | "error";

type ContactFormProps = {
  compact?: boolean;
  source?: string;
};

type FormErrors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

const subjectValues = [
  "Wycena projektu",
  "Współpraca",
  "Pytanie techniczne",
  "Inne",
] as const;

function getFormData(form: HTMLFormElement) {
  const data = new FormData(form);
  return {
    name: String(data.get("name") || "").trim(),
    email: String(data.get("email") || "").trim(),
    phone: String(data.get("phone") || "").trim(),
    subject: String(data.get("subject") || "").trim(),
    message: String(data.get("message") || "").trim(),
  };
}

export default function ContactForm({ compact = false, source = "contact" }: ContactFormProps) {
  const { t, lang } = useI18n();
  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [toast, setToast] = useState("");

  const copy = {
    phone: lang === "pl" ? "Telefon" : "Phone",
    phonePlaceholder: lang === "pl" ? "+48 000 000 000" : "+48 000 000 000",
    helper:
      lang === "pl"
        ? "Odpowiadamy zwykle tego samego dnia roboczego."
        : "We usually reply the same business day.",
  };

  function validate(form: ReturnType<typeof getFormData>) {
    const nextErrors: FormErrors = {};
    if (!form.name) nextErrors.name = t("contact.form.errorRequired");
    if (!form.email) {
      nextErrors.email = t("contact.form.errorRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = t("contact.form.errorEmail");
    }
    if (!form.subject) nextErrors.subject = t("contact.form.errorRequired");
    if (!form.message) {
      nextErrors.message = t("contact.form.errorRequired");
    } else if (form.message.length < 20) {
      nextErrors.message = t("contact.form.errorMinLength");
    } else if (form.message.length > 2000) {
      nextErrors.message = t("contact.form.errorMaxLength");
    }
    return nextErrors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = getFormData(form);
    const nextErrors = validate(data);
    setErrors(nextErrors);
    setToast("");

    if (Object.keys(nextErrors).length > 0) return;

    setFormState("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          source,
          message: `${data.message}\n\nŹródło: ${source}`,
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || "Failed to send");
      }

      form.reset();
      setFormState("success");
      setToast(t("contact.form.successToast"));
    } catch {
      setFormState("error");
      setToast(t("contact.form.errorToast"));
    }
  }

  const inputClass =
    "mt-2 w-full rounded-[8px] bg-[#f7f4ed]/75 px-4 py-3 text-sm text-[#161616] outline-none transition focus:bg-white focus:shadow-[0_0_0_2px_rgba(8,47,43,0.18)]";
  const labelClass = "block text-xs font-semibold uppercase tracking-normal text-[#4f5855]";
  const errorClass = "mt-2 text-xs font-medium text-red-700";

  return (
    <form
      onSubmit={handleSubmit}
      className={compact ? "space-y-4" : "space-y-5"}
      noValidate
    >
      <div className={compact ? "grid gap-4 md:grid-cols-2" : "grid gap-5 md:grid-cols-2"}>
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            {t("contact.form.name")}
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder={t("contact.form.namePlaceholder")}
            className={inputClass}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
          />
          {errors.name && (
            <p id="contact-name-error" className={errorClass}>
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className={labelClass}>
            {t("contact.form.email")}
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={t("contact.form.emailPlaceholder")}
            className={inputClass}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
          />
          {errors.email && (
            <p id="contact-email-error" className={errorClass}>
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className={compact ? "grid gap-4 md:grid-cols-2" : "grid gap-5 md:grid-cols-2"}>
        <div>
          <label htmlFor="contact-subject" className={labelClass}>
            {t("contact.form.subject")}
          </label>
          <select
            id="contact-subject"
            name="subject"
            defaultValue=""
            className={`${inputClass} appearance-none`}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? "contact-subject-error" : undefined}
          >
            <option value="" disabled>
              {t("contact.form.subjectPlaceholder")}
            </option>
            {subjectValues.map((subject) => (
              <option key={subject} value={subject}>
                {lang === "pl"
                  ? subject
                  : subject === "Wycena projektu"
                    ? "Project quote"
                    : subject === "Współpraca"
                      ? "Collaboration"
                      : subject === "Pytanie techniczne"
                        ? "Technical question"
                        : "Other"}
              </option>
            ))}
          </select>
          {errors.subject && (
            <p id="contact-subject-error" className={errorClass}>
              {errors.subject}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-phone" className={labelClass}>
            {copy.phone}
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder={copy.phonePlaceholder}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          {t("contact.form.message")}
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={compact ? 3 : 6}
          placeholder={t("contact.form.messagePlaceholder")}
          className={`${inputClass} resize-none`}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
        />
        {errors.message && (
          <p id="contact-message-error" className={errorClass}>
            {errors.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={formState === "submitting"}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#082f2b] px-7 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(8,47,43,0.16)] transition hover:-translate-y-0.5 hover:bg-[#12463f] disabled:cursor-wait disabled:opacity-70"
        >
          {formState === "submitting"
            ? t("contact.form.submitting")
            : formState === "success"
              ? t("contact.form.submitted")
              : t("contact.form.submit")}
        </button>
        <p className="text-xs leading-relaxed text-[#606966]">{copy.helper}</p>
      </div>

      {toast && (
        <p
          role="status"
          className={`text-sm font-medium ${formState === "success" ? "text-[#0d5c4f]" : "text-red-700"}`}
        >
          {toast}
        </p>
      )}
    </form>
  );
}

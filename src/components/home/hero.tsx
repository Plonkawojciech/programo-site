"use client";

import { useState, useRef, useId } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { getAttribution, trackLead } from "@/lib/tracking";

type PhoneFormState = "idle" | "submitting" | "success" | "error";

/**
 * Homepage hero - conversion-first rebuild (2026-08).
 *
 * Structure: headline, one-liner, inline phone capture, then a full-width shot
 * of four shipped projects. Single column at every breakpoint.
 *
 * The proof image replaced a single WSafeFinanse screenshot (2026-08-03): one
 * client's site is weaker evidence than four, and that particular project is
 * not one we lead with. Don't put it back in a right-hand column - see the
 * comment on the `figure` for the measurements.
 *
 * The phone capture posts to /api/contact with a number and nothing else. That
 * shape is only valid because the route waives the `name` requirement when the
 * phone carries >= 9 digits (see the `superRefine` in api/contact/route.ts and
 * the "phone-only lead" tests). Don't reinstate a required name there without
 * changing this form too - the failure is silent, a 400 the visitor reads as
 * "the form is broken" while we never see the lead at all.
 *
 * Nothing here animates. This is the LCP surface and it holds the only
 * conversion control on the page, so it renders complete in the SSR HTML. An
 * opacity or transform gate here would cost money twice: it delays LCP past
 * hydration, and it hides the form from anyone whose JS is slow or blocked.
 */
export default function HomeHero() {
  const { t } = useI18n();

  // --- Phone form state ---
  const [formState, setFormState] = useState<PhoneFormState>("idle");
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Accessible IDs
  const phoneInputId = useId();
  const errorId = useId();
  const successId = useId();

  // --- Validation ---
  function validatePhone(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) return t("home.hero.phoneErrorEmpty");
    // Strip formatting, count digits
    const digits = trimmed.replace(/[\s\-\(\)\+]/g, "");
    if (digits.length < 9 || !/^\d+$/.test(digits)) {
      return t("home.hero.phoneErrorInvalid");
    }
    return null;
  }

  // --- Submit ---
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const validationError = validatePhone(phone);
    if (validationError) {
      setErrorMsg(validationError);
      setFormState("error");
      // Don't clear the phone input on validation error
      return;
    }

    setFormState("submitting");
    setErrorMsg("");

    // Phone-only lead. The message names the originating form, which is the one
    // thing the inbox cannot infer from the number itself.
    const payload = {
      name: "",
      email: "",
      phone: phone.trim(),
      message: "Prośba o kontakt telefoniczny - formularz w nagłówku strony głównej.",
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
        setErrorMsg(t("home.hero.phoneErrorNetwork"));
        setFormState("error");
        return;
      }

      setFormState("success");
      trackLead({ form: "hero-phone", method: "phone" });
    } catch {
      setErrorMsg(t("home.hero.phoneErrorNetwork"));
      setFormState("error");
    }
  }

  return (
    <section className="relative bg-surface pt-28 pb-section-major md:pt-36 lg:pt-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        {/* ── Text + form ── */}
        {/* 4xl, not 3xl: at the display size the headline breaks to four lines
            below ~890px and to three above it. */}
        <div className="max-w-4xl">
          {/* Headline - text-display token (carries its own 1.04 leading),
              Archivo with wdth axis */}
          <h1 className="font-headline text-display font-bold tracking-[-0.025em] text-on-surface text-balance [font-stretch:108%]">
            {t("home.hero.headline.v2")}
          </h1>

          {/* Description - one sentence, max 65ch */}
          <p className="mt-6 max-w-[60ch] text-lead leading-relaxed text-on-surface-variant text-pretty">
            {t("home.hero.desc.v2")}
          </p>

          {/* ── Phone capture form ── */}
          {/* Capped narrower than the headline: a single phone field stretched
              to 896px reads as an unfinished layout. */}
          <div className="mt-10 max-w-2xl">
            {formState === "success" ? (
              <p
                id={successId}
                role="status"
                aria-live="polite"
                className="text-lead font-medium text-primary"
              >
                {t("home.hero.phoneSuccess")}
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-3">
                  <div className="flex flex-1 flex-col gap-1.5">
                    <label
                      htmlFor={phoneInputId}
                      className="sr-only"
                    >
                      {t("home.hero.phoneLabel")}
                    </label>
                    <input
                      ref={inputRef}
                      id={phoneInputId}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      name="phone"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        // Clear error when user starts typing again
                        if (formState === "error") {
                          setFormState("idle");
                          setErrorMsg("");
                        }
                      }}
                      placeholder={t("home.hero.phonePlaceholder")}
                      aria-describedby={
                        formState === "error" && errorMsg ? errorId : undefined
                      }
                      aria-invalid={formState === "error" ? "true" : undefined}
                      className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3.5 text-on-surface placeholder:text-on-surface-variant outline-none transition-colors focus:border-primary sm:min-w-[240px]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={formState === "submitting"}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-on-primary transition-colors hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formState === "submitting"
                      ? t("home.hero.phoneSending")
                      : t("home.hero.phoneCta")}
                  </button>
                </div>

                {/* Error message */}
                {formState === "error" && errorMsg && (
                  <p
                    id={errorId}
                    role="alert"
                    aria-live="assertive"
                    className="text-sm text-error"
                  >
                    {errorMsg}
                  </p>
                )}

                {/* Reassurance + consent micro-copy. Consent here is given by
                    the act of submitting under a clear notice, so the notice
                    has to carry the privacy policy link with it. */}
                <p className="text-sm text-on-surface-variant">
                  {t("home.hero.phoneReassurance")}{" "}
                  {t("home.hero.phoneConsentNote")}{" "}
                  <a
                    href="/polityka-prywatnosci"
                    className="underline underline-offset-2 transition-colors hover:text-primary"
                  >
                    {t("quick.privacyLink")}
                  </a>
                </p>
              </form>
            )}
          </div>

          {/* Secondary link to portfolio - visually subdued */}
          <div className="mt-6">
            <a
              href="#realizacje"
              className="inline-flex min-h-[24px] items-center gap-2 py-1 text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
            >
              {t("home.hero.ctaSecondary")}
              <span aria-hidden="true" className="transition-transform duration-300 ease-out">
                &darr;
              </span>
            </a>
          </div>
        </div>

        {/* ── Proof strip - four shipped projects, seen without scrolling ──
            Full width rather than a right-hand column: at the display size the
            headline needs ~890px to stay on three lines, so a two-column split
            pushes it to five, and four devices squeezed into a 600px column are
            too small to read as real work. */}
        <figure className="mt-14 lg:mt-16">
          {/* Full-bleed on phones. Inside the 24px gutter the four devices come
              out ~90px wide each and read as blur; the extra 48px is the
              difference between "some screens" and legible product shots on the
              screen most of this audience arrives on.
              calc(100%+3rem), not w-screen: 100vw counts the classic scrollbar
              that clientWidth doesn't, so on Windows/Linux Chrome it overflows
              by ~15px. Percentages measure the container, which is correct. */}
          <Image
            src="/screenshots/realizacje-hero.webp"
            alt={t("home.hero.showcaseAlt")}
            width={1672}
            height={941}
            priority
            sizes="(max-width: 1400px) 100vw, 1400px"
            className="-mx-6 w-[calc(100%+3rem)] max-w-none md:mx-0 md:w-full md:rounded-2xl"
          />
          {/* Conditional because this string is owner-editable from the dev
              editor; cleared copy would otherwise leave a floating rule. */}
          {t("home.hero.showcaseCaption").trim() && (
            <figcaption className="mt-4 flex items-center gap-2 text-sm text-on-surface-variant">
              <span aria-hidden="true" className="h-px w-5 bg-outline-variant" />
              {t("home.hero.showcaseCaption")}
            </figcaption>
          )}
        </figure>
      </div>
    </section>
  );
}

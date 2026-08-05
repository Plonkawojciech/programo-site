"use client";

import { useState, useRef, useId } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { getAttribution, trackLead } from "@/lib/tracking";

type PhoneFormState = "idle" | "submitting" | "success" | "error";

/**
 * Homepage hero - conversion-first rebuild (2026-08).
 *
 * Structure: headline, one-liner, inline phone capture. Single column at every
 * breakpoint, over a heavily blurred photograph.
 *
 * The device mockup that used to close this section was removed on 2026-08-06
 * at the owner's request and replaced by that background. The proof it carried
 * did not disappear from the page - ProjectsMarquee below shows the same work
 * at a size where it is actually legible, which the four shrunken devices
 * never were on a phone.
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
    <section className="relative isolate overflow-hidden bg-surface pt-28 pb-section-major md:pt-36 lg:pt-40">
      {/* Background photograph, blurred to a suggestion of a desk rather than a
          picture of one. Two rules govern every number below.

          (1) The scrim is what buys the contrast, not the opacity. Deviation of
          the composite from the flat surface colour is (1 - scrimAlpha) x
          imageOpacity. Under the text the scrim sits at 0.86-0.92, so the
          background moves at most ~5% off `--theme-bg-1` - measured, not
          guessed. On the right, where no copy ever lands at md+, it opens to
          0.45 and the photo actually reads.

          (2) The image is mirrored. The desk and laptops sit on the LEFT of the
          source frame, which is exactly where the headline, the phone field and
          the consent line live. Flipped, the busy half falls into the empty
          right column and the near-black half slides under the copy. At this
          blur radius nothing is legible as a mirrored object.

          scale(1.3) is not styling: `filter: blur()` samples transparency past
          the element edge, so an unscaled layer would show a pale rim inside
          `overflow-hidden`. 30% overscan clears the ~42px bleed of a 14px blur
          at every breakpoint, including a short mobile hero.

          14px, not 26: at 26 the photo stopped being a photo. Nothing read as a
          desk, only as a glow, which is not what was asked for. 14 kills the
          text on the screens and the grain but keeps the lids, the monitor and
          the window frame as recognisable shapes. */}
      <style>{`
        .hero-bg__img {
          transform: scale(-1.3, 1.3);
          filter: blur(14px) saturate(0.9);
          opacity: 0.5;
        }
        [data-theme="light"] .hero-bg__img { opacity: 0.28; }

        .hero-bg__scrim {
          background: linear-gradient(
            to bottom,
            rgba(var(--theme-bg-1-rgb), 0.78) 0%,
            rgba(var(--theme-bg-1-rgb), 0.78) 55%,
            rgb(var(--theme-bg-1-rgb)) 100%
          );
        }
        @media (min-width: 768px) {
          .hero-bg__scrim {
            background:
              linear-gradient(to bottom, rgba(var(--theme-bg-1-rgb), 0) 60%, rgb(var(--theme-bg-1-rgb)) 100%),
              linear-gradient(to right,
                rgba(var(--theme-bg-1-rgb), 0.90) 0%,
                rgba(var(--theme-bg-1-rgb), 0.84) 38%,
                rgba(var(--theme-bg-1-rgb), 0.25) 100%);
          }
        }
      `}</style>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src="/hero-bg.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero-bg__img object-cover object-center"
        />
        <div className="hero-bg__scrim absolute inset-0" />
      </div>

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
      </div>
    </section>
  );
}

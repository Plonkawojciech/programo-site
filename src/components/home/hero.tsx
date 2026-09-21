"use client";

import { useState, useRef, useId, useEffect } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { getAttribution, prepareLeadConversion, trackLead } from "@/lib/tracking";
import { track } from "@/lib/analytics/client";
import { useFormAnalytics } from "@/lib/analytics/use-form-analytics";
import Turnstile, { TURNSTILE_ENABLED, type TurnstileHandle } from "@/components/ui/turnstile";
import Honeypot from "@/components/ui/honeypot";
import { useFormChallenge } from "@/lib/form-challenge-client";
import { HONEYPOT_FIELD } from "@/lib/form-challenge-shared";

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
 * The capture takes a first name, a phone number and an explicit consent tick,
 * as of 2026-08-08. It used to post a number and nothing else, leaning on the
 * route's waiver of `name` for a dialable phone (the `superRefine` in
 * contact-schema.ts). That waiver still stands and still guards the endpoint -
 * this form simply no longer relies on it.
 *
 * The consent is a real checkbox and not the notice it replaced. The old copy
 * read "Wysyłając numer, wyrażasz zgodę na kontakt telefoniczny", which asks the
 * visitor to agree by doing the thing they came to do. Consent bundled into a
 * submit is not given by a clear affirmative action, and a callback is precisely
 * the case where you want the record to be unambiguous. `consent` in the payload
 * now mirrors the box; unticked, nothing is sent.
 *
 * Adding two controls to the primary CTA costs conversions and that is a known,
 * accepted trade - the owner asked for both. If the name ever needs to come back
 * out, drop the field and its guard; the endpoint accepts a phone-only lead
 * unchanged, so nothing downstream has to move.
 *
 * Nothing here animates. This is the LCP surface and it holds the only
 * conversion control on the page, so it renders complete in the SSR HTML. An
 * opacity or transform gate here would cost money twice: it delays LCP past
 * hydration, and it hides the form from anyone whose JS is slow or blocked.
 */
export default function HomeHero() {
  const { t } = useI18n();
  // Puts the hero into the same viewed → started → error → submit funnel as the
  // other forms; until now the most prominent form on the site was invisible to it.
  const fa = useFormAnalytics("hero-phone");

  // --- Phone form state ---
  const [formState, setFormState] = useState<PhoneFormState>("idle");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  // Anti-bot token from the Turnstile widget; null until solved and again
  // after every submit, because a token is spent the moment it is verified.
  const turnstileRef = useRef<TurnstileHandle>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  // Keyless anti-bot: pre-solved on mount, handed over at submit.
  const challenge = useFormChallenge();

  // Accessible IDs
  const nameInputId = useId();
  const phoneInputId = useId();
  const consentId = useId();
  const errorId = useId();
  const successId = useId();
  /** The success block replaces the form, so focus has to be moved into it
   *  deliberately - otherwise a keyboard or screen-reader user is left on a
   *  button that no longer exists and hears nothing. Matches CompactLeadForm. */
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (formState === "success") successHeadingRef.current?.focus();
  }, [formState]);

  /** Which control the current error belongs to, so focus and aria-invalid land
   *  on it rather than colouring every field red at once. */
  const [errorField, setErrorField] = useState<"name" | "phone" | "consent" | "turnstile" | null>(null);

  // --- Validation ---
  function validate(): { field: "name" | "phone" | "consent" | "turnstile"; message: string } | null {
    if (!name.trim()) {
      return { field: "name", message: t("home.hero.errorName") };
    }
    const trimmed = phone.trim();
    if (!trimmed) {
      return { field: "phone", message: t("home.hero.phoneErrorEmpty") };
    }
    // Strip formatting, count digits
    const digits = trimmed.replace(/[\s\-\(\)\+]/g, "");
    if (digits.length < 9 || !/^\d+$/.test(digits)) {
      return { field: "phone", message: t("home.hero.phoneErrorInvalid") };
    }
    // The endpoint is the hard guard (it rejects consent !== true with 400);
    // this check exists so the visitor is told why, in their own language,
    // without a round trip.
    if (!consent) {
      return { field: "consent", message: t("forms.consentPhoneRequired") };
    }
    if (TURNSTILE_ENABLED && !turnstileToken) {
      return { field: "turnstile", message: t("forms.turnstileRequired") };
    }
    return null;
  }

  // --- Submit ---
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const honeypot = String(new FormData(e.currentTarget).get(HONEYPOT_FIELD) || "");

    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError.message);
      setErrorField(validationError.field);
      setFormState("error");
      fa.reportErrors({ [validationError.field]: validationError.message });
      // Don't clear what was typed on a validation error
      return;
    }

    setFormState("submitting");
    setErrorMsg("");
    setErrorField(null);

    // The message names the originating form, which is the one thing the inbox
    // cannot infer from the number itself.
    const payload = {
      name: name.trim(),
      email: "",
      phone: phone.trim(),
      message: "Prośba o kontakt telefoniczny - formularz w nagłówku strony głównej.",
      projectType: "",
      budget: "",
      // Literal true, and only reachable once the box is ticked - validate()
      // returns above otherwise. The endpoint's schema demands the literal, so
      // this can never be a variable that quietly carries `false` through.
      consent: true as const,
      consentTimestamp: new Date().toISOString(),
      ...getAttribution(),
    };

    try {
      // Without this the browser Pixel and the server-side CAPI hit generate
      // DIFFERENT event ids for the same submission, so Meta counts the most
      // prominent form on the site twice, and GA4's Measurement Protocol has no
      // client id to attach the conversion to.
      const conversion = await prepareLeadConversion();

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          form_id: "hero-phone",
          turnstileToken: turnstileToken ?? undefined,
          ...(await challenge.take() ?? {}),
          [HONEYPOT_FIELD]: honeypot,
          ...conversion,
        }),
      });

      if (!res.ok) {
        setErrorMsg(t("home.hero.phoneErrorNetwork"));
        setFormState("error");
        fa.reportErrors({ server: String(res.status) }, "server");
        track("form_submit_failed", {
          form_id: "hero-phone",
          http_status: res.status,
          message: "server",
        });
        return;
      }

      setFormState("success");
      fa.markSubmitted();
      trackLead({
        form: "hero-phone",
        method: "phone",
        phone,
        eventId: conversion.event_id,
        seconds: fa.elapsedSeconds(),
      });
    } catch {
      setErrorMsg(t("home.hero.phoneErrorNetwork"));
      setFormState("error");
      fa.reportErrors({ server: "network" }, "server");
      track("form_submit_failed", { form_id: "hero-phone", http_status: 0, message: "network" });
    } finally {
      // Spent either way — the server consumed it whether it said yes or no.
      turnstileRef.current?.reset();
      challenge.refresh();
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
          `overflow-hidden`. 30% overscan clears the ~30px bleed of a 10px blur
          at every breakpoint, including a short mobile hero.

          10px, not 26: at 26 the photo stopped being a photo - nothing read as
          a desk, only as a glow. 10 still kills the text on the screens and the
          grain, but the lids, the monitor, the mug and the window frame keep
          their edges instead of dissolving into each other. */}
      <style>{`
        .hero-bg__img {
          transform: scale(-1.3, 1.3);
          filter: blur(10px) saturate(0.9);
          opacity: 0.5;
        }
        /* Jaśniejszy motyw potrzebuje WIĘKSZEJ krycia niż ciemny, nie
           mniejszej. Zdjęcie jest niemal czarne: na ciemnym tle dokłada
           różnicę, na jasnym musi ją najpierw wyrobić. Przy 0.28 znikało
           zupełnie - zostawał płaski off-white. */
        [data-theme="light"] .hero-bg__img { opacity: 0.42; }

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

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
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
              <div
                id={successId}
                role="status"
                aria-live="polite"
                className="flex items-start gap-4 rounded-2xl bg-card p-6 shadow-card"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                    <path d="M4 12.5l5 5L20 6.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <h3
                    ref={successHeadingRef}
                    tabIndex={-1}
                    className="font-semibold text-on-surface outline-none"
                  >
                    {t("home.hero.phoneSuccess")}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                    {t("home.hero.phoneSuccessBody")}
                  </p>
                </div>
              </div>
            ) : (
              <form
                // Passing the RefObject itself (as quick-contact does); the rule
                // misreads it as a `.current` read during render.
                // eslint-disable-next-line react-hooks/refs
                ref={fa.ref}
                onSubmit={handleSubmit}
                noValidate
                className="relative flex flex-col gap-4"
              >
                <Honeypot />
                {/* Name and phone share a row from sm up. Two short fields
                    stacked would push the consent tick and the button below the
                    fold on a phone, which is where this form earns its living. */}
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
                  <div className="flex flex-col gap-1.5 sm:w-[38%]">
                    <label htmlFor={nameInputId} className="sr-only">
                      {t("home.hero.nameLabel")}
                    </label>
                    <input
                      id={nameInputId}
                      type="text"
                      autoComplete="given-name"
                      name="name"
                      value={name}
                      onFocus={() => fa.onFieldFocus("name")}
                      onBlur={(e) => fa.onFieldBlur("name", e.target.value)}
                      onChange={(e) => {
                        fa.onFieldInput("name");
                        setName(e.target.value);
                        if (formState === "error") {
                          setFormState("idle");
                          setErrorMsg("");
                          setErrorField(null);
                        }
                      }}
                      placeholder={t("home.hero.namePlaceholder")}
                      aria-describedby={errorField === "name" ? errorId : undefined}
                      aria-invalid={errorField === "name" ? "true" : undefined}
                      className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3.5 text-on-surface placeholder:text-on-surface-variant outline-none transition-colors focus:border-primary"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5">
                    <label htmlFor={phoneInputId} className="sr-only">
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
                      onFocus={() => fa.onFieldFocus("phone")}
                      onBlur={(e) => fa.onFieldBlur("phone", e.target.value)}
                      onChange={(e) => {
                        fa.onFieldInput("phone");
                        setPhone(e.target.value);
                        // Clear error when user starts typing again
                        if (formState === "error") {
                          setFormState("idle");
                          setErrorMsg("");
                          setErrorField(null);
                        }
                      }}
                      placeholder={t("home.hero.phonePlaceholder")}
                      aria-describedby={errorField === "phone" ? errorId : undefined}
                      aria-invalid={errorField === "phone" ? "true" : undefined}
                      className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3.5 text-on-surface placeholder:text-on-surface-variant outline-none transition-colors focus:border-primary sm:min-w-[220px]"
                    />
                  </div>
                </div>

                {/* Consent. The whole row is the label, so the hit target is the
                    sentence and not just the 20px box - this is the control the
                    lead legally hinges on and it is being tapped with a thumb. */}
                <label
                  htmlFor={consentId}
                  className="flex min-h-[48px] cursor-pointer items-start gap-3 rounded-xl bg-surface-container-low/70 p-3.5"
                >
                  <span className="relative mt-0.5 shrink-0">
                    <input
                      id={consentId}
                      type="checkbox"
                      name="consent"
                      checked={consent}
                      onFocus={() => fa.onFieldFocus("consent")}
                      onChange={(e) => {
                        fa.onFieldInput("consent");
                        setConsent(e.target.checked);
                        if (formState === "error" && errorField === "consent") {
                          setFormState("idle");
                          setErrorMsg("");
                          setErrorField(null);
                        }
                      }}
                      required
                      aria-describedby={errorField === "consent" ? errorId : undefined}
                      aria-invalid={errorField === "consent" ? "true" : undefined}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-on-surface-variant bg-surface transition-colors checked:border-primary checked:bg-primary hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                    />
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      className="pointer-events-none absolute inset-0 m-auto h-3.5 w-3.5 text-on-primary opacity-0 transition-opacity peer-checked:opacity-100"
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
                  <span className="text-xs leading-relaxed text-on-surface/80">
                    {t("forms.consentPhone")}{" "}
                    <a
                      href="/polityka-prywatnosci"
                      className="font-medium text-primary underline underline-offset-2"
                    >
                      {t("quick.privacyLink")}
                    </a>
                    .
                  </span>
                </label>

                <Turnstile
                  ref={turnstileRef}
                  onToken={(tok) => {
                    setTurnstileToken(tok);
                    if (tok && errorField === "turnstile") {
                      setErrorMsg("");
                      setErrorField(null);
                      setFormState("idle");
                    }
                  }}
                />

                <button
                  type="submit"
                  disabled={formState === "submitting"}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 sm:self-start sm:px-10"
                >
                  {formState === "submitting"
                    ? t("home.hero.phoneSending")
                    : t("home.hero.phoneCta")}
                </button>

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

                <p className="text-sm text-on-surface-variant">
                  {t("home.hero.phoneReassurance")}
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

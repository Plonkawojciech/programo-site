"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getAttribution, trackLead } from "@/lib/tracking";

type FormState = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-3 text-base text-on-surface outline-none transition placeholder:text-on-surface-variant/50 focus:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2";

// A short, above-the-fold lead-catcher for the Polish Ads landings: name +
// phone + RODO consent only. Posts to the same /api/contact as the full form
// and fires the Google Ads "Lead" conversion at most once per session (guarded
// in tracking.ts). Meant to sit mid-page as the quick gate, in ADDITION to the
// full QuickContact form at the bottom.
export default function CompactLeadForm({
  formId,
  anchorId,
  projectType,
  eyebrow = "Szybki kontakt",
  heading = "Zostaw numer — oddzwonimy z wyceną",
  sub = "Zostaw imię i numer — odezwiemy się tego samego dnia roboczego. Bez zobowiązań i bez spamu.",
}: {
  /** Unique label for conversion attribution + field ids, e.g. "strony-compact". */
  formId: string;
  /** DOM id for the section anchor (hero CTA target). Defaults to formId. */
  anchorId?: string;
  /** Pre-tags the lead, e.g. "Strona / landing" or "Sklep internetowy". */
  projectType?: string;
  eyebrow?: string;
  heading?: string;
  sub?: string;
}) {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const submittingRef = useRef(false);
  const successRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the success message so keyboard/screen-reader users (and anyone
  // who scrolled) are told the submission worked, since the form button vanishes.
  useEffect(() => {
    if (state === "success") successRef.current?.focus();
  }, [state]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittingRef.current) return;
    if (!consent) {
      setError("Zaznacz zgodę, żebyśmy mogli się z Tobą skontaktować.");
      setState("error");
      return;
    }
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    if (!name) {
      setError("Podaj imię.");
      setState("error");
      return;
    }
    if (!phone) {
      setError("Podaj numer telefonu.");
      setState("error");
      return;
    }

    submittingRef.current = true;
    setState("submitting");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          subject: "Wycena projektu",
          projectType: projectType || "",
          consent: true,
          consentTimestamp: new Date().toISOString(),
          ...getAttribution(),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || "Nie udało się wysłać. Spróbuj ponownie lub zadzwoń.");
        setState("error");
        return;
      }
      setState("success");
      trackLead({ form: formId });
      (e.target as HTMLFormElement).reset();
      setConsent(false);
    } catch {
      setError("Nie udało się wysłać. Spróbuj ponownie lub zadzwoń.");
      setState("error");
    } finally {
      submittingRef.current = false;
    }
  }

  return (
    <section
      id={anchorId ?? formId}
      className="relative bg-surface py-16 md:py-20 scroll-mt-28"
    >
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-24">
        <div className="rounded-3xl border border-primary/30 bg-primary/5 p-7 md:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.15fr]">
            <div>
              <p className="mb-3 text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-primary">
                {eyebrow}
              </p>
              <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
                {heading}
              </h2>
              <p className="mt-4 max-w-md text-lg font-light leading-relaxed text-on-surface/70">
                {sub}
              </p>
              <a
                href="tel:+48509123434"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant underline underline-offset-4 transition hover:text-on-surface"
              >
                …albo zadzwoń od razu: 509 123 434
              </a>
            </div>

            {state === "success" ? (
              <div
                role="status"
                aria-live="polite"
                className="flex items-start gap-4 rounded-2xl border border-primary/40 bg-surface p-6"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                    <path d="M4 12.5l5 5L20 6.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <h3
                    ref={successRef}
                    tabIndex={-1}
                    className="font-semibold text-on-surface outline-none"
                  >
                    Dzięki — mamy Twój numer.
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                    Odezwiemy się tego samego dnia roboczego. Jeśli się spieszysz, zadzwoń: 509 123 434.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor={`${formId}-name`}
                      className="text-xs font-bold uppercase tracking-widest text-on-surface-variant"
                    >
                      Imię
                    </label>
                    <input
                      id={`${formId}-name`}
                      type="text"
                      name="name"
                      required
                      autoComplete="name"
                      placeholder="Jan"
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor={`${formId}-phone`}
                      className="text-xs font-bold uppercase tracking-widest text-on-surface-variant"
                    >
                      Telefon
                    </label>
                    <input
                      id={`${formId}-phone`}
                      type="tel"
                      name="phone"
                      required
                      autoComplete="tel"
                      placeholder="+48 600 000 000"
                      className={inputClass}
                    />
                  </div>
                </div>

                <label className="flex items-start gap-3 rounded-2xl border border-outline-variant/60 bg-surface/70 p-3.5">
                  <span className="relative mt-0.5 shrink-0">
                    <input
                      type="checkbox"
                      name="consent"
                      checked={consent}
                      onChange={(e) => {
                        setConsent(e.target.checked);
                        if (state === "error") {
                          setState("idle");
                          setError("");
                        }
                      }}
                      required
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-outline bg-surface transition-colors checked:border-primary checked:bg-primary hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                    />
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      className="pointer-events-none absolute inset-0 m-auto h-3.5 w-3.5 text-on-primary opacity-0 transition-opacity peer-checked:opacity-100"
                    >
                      <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </span>
                  <span className="text-xs leading-relaxed text-on-surface/80">
                    Zgadzam się na kontakt w sprawie zapytania (
                    <Link
                      href="/polityka-prywatnosci"
                      className="font-medium text-primary underline underline-offset-2"
                    >
                      polityka prywatności
                    </Link>
                    ).
                  </span>
                </label>

                <div className="flex flex-col gap-2">
                  <button
                    type="submit"
                    disabled={state === "submitting" || !consent}
                    className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-medium uppercase tracking-widest text-on-primary transition-all hover:gap-5 hover:bg-primary-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:self-start"
                  >
                    {state === "submitting" ? "Wysyłam…" : "Oddzwońcie do mnie"}
                    <span aria-hidden="true">→</span>
                  </button>
                  {state === "error" && (
                    <p className="text-sm text-red-500">{error}</p>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

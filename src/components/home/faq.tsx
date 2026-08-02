"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { easeEntry, durationMedium } from "@/lib/motion";

type TKey = Parameters<ReturnType<typeof useI18n>["t"]>[0];

/**
 * 6 questions, ordered by buyer fear sequence:
 * 1. Cost (biggest anxiety)
 * 2. Timeline
 * 3. "I only have an idea" (permission to call without a spec)
 * 4. Code ownership (lock-in fear)
 * 5. Post-launch support (abandonment fear)
 * 6. How to start (bridge to contact form)
 *
 * Cut from original 8:
 * - "Czy wystawiacie fakturę VAT?" — trivial, not an objection
 * - "Czy pracujecie zdalnie?" — trivial, not an objection
 *
 * Uses native <details>/<summary> so all answers are in the DOM for
 * SSR, crawlers, and screen readers regardless of open/closed state.
 */
const faqs: { q: TKey; a: TKey }[] = [
  { q: "home.faq.r.q1", a: "home.faq.r.a1" },
  { q: "home.faq.r.q2", a: "home.faq.r.a2" },
  { q: "home.faq.r.q3", a: "home.faq.r.a3" },
  { q: "home.faq.r.q4", a: "home.faq.r.a4" },
  { q: "home.faq.r.q5", a: "home.faq.r.a5" },
  { q: "home.faq.r.q6", a: "home.faq.r.a6" },
];

export default function Faq() {
  const { t } = useI18n();
  const prefersReduced = useReducedMotion();

  const reveal = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 14 } as const,
        whileInView: { opacity: 1, y: 0 } as const,
        viewport: { once: true, margin: "-10% 0px" } as const,
        transition: { duration: durationMedium, ease: easeEntry } as const,
      };

  return (
    <section className="bg-surface-dim py-section-tight">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          {/* Left column: heading */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <motion.h2
              {...reveal}
              className="font-headline text-h2 font-bold tracking-[-0.02em] text-on-surface text-balance"
            >
              {t("home.faq.r.title")}
            </motion.h2>
          </div>

          {/* Right column: accordion with native <details> */}
          <div className="flex flex-col">
            {faqs.map((item, i) => {
              const isLast = i === faqs.length - 1;
              return (
                <details
                  key={item.q}
                  className="group border-t border-outline-variant last:border-b"
                  {...(i === 0 ? { open: true } : {})}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
                    <span className="font-headline text-h4 font-bold tracking-tight text-on-surface">
                      {t(item.q)}
                    </span>
                    <span
                      aria-hidden="true"
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-outline-variant text-on-surface-variant transition-transform duration-300 ease-out group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <div className="pb-6">
                    <p className="max-w-[65ch] text-base leading-relaxed text-on-surface-variant text-pretty">
                      {t(item.a)}
                    </p>
                    {/* Last question ("Od czego zacząć?") bridges to the contact form */}
                    {isLast && (
                      <Link
                        href="#kontakt-main"
                        className="group/cta mt-4 inline-flex items-center gap-2 text-base font-medium text-primary transition-colors hover:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        {t("home.faq.r.cta")}
                        <span
                          aria-hidden="true"
                          className="transition-transform duration-300 ease-out group-hover/cta:translate-y-0.5"
                        >
                          &darr;
                        </span>
                      </Link>
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

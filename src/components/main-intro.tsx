"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import CompactLeadForm from "@/components/compact-lead-form";

// Conversion-first homepage hero (redesign 2026-07). Two columns on desktop:
// editorial headline + dual CTA on the left, a short lead-catcher form on the
// right. On mobile the form drops below, but the headline and at least one CTA
// stay above the fold. Copy comes 1:1 from the content deck (home.hero.*).
export default function MainIntro() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden bg-surface pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Left: headline + CTAs */}
          <div>
            <motion.span
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-primary"
            >
              {t("home.hero.eyebrow")}
            </motion.span>

            <motion.h1
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 font-headline text-[2rem] leading-[1.08] font-bold tracking-tight text-on-surface md:text-6xl md:tracking-tighter 2xl:text-7xl"
            >
              {t("home.hero.h1")}
            </motion.h1>

            <motion.p
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mt-6 max-w-xl text-base md:text-xl font-light leading-relaxed text-on-surface/70"
            >
              {t("home.hero.sub")}
            </motion.p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="tel:+48509123434"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-medium uppercase tracking-widest text-on-primary transition-all hover:gap-5 hover:bg-primary-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                  <path d="M6.5 3.5l3 1 1 4-2 1.5a11 11 0 005 5l1.5-2 4 1 1 3a2 2 0 01-2 2.3A16 16 0 014.2 6.5 2 2 0 016.5 3.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t("home.hero.ctaCall")}
              </a>
              <a
                href="#kontakt"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-on-surface/30 px-6 py-3.5 text-sm font-medium uppercase tracking-widest text-on-surface transition-all hover:gap-5 hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
              >
                {t("home.hero.ctaConsult")} <span aria-hidden="true">→</span>
              </a>
            </div>

            <p className="mt-6 flex items-center gap-2.5 text-xs font-medium uppercase tracking-widest text-on-surface-variant">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" aria-hidden="true">
                  <path d="M4 12.5l5 5L20 6.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {t("home.reply")}
            </p>
          </div>

          {/* Right: lead-catcher form (drops below on mobile) */}
          <CompactLeadForm
            bare
            formId="home-hero"
            anchorId="home-hero"
            heading={t("home.hero.formHeading")}
          />
        </div>
      </div>
    </section>
  );
}

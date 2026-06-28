"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import ContactCtaLink from "@/components/contact-cta-link";
import { easeEntry } from "@/lib/motion";

/**
 * Homepage hero — conversion-first.
 * Left: problem-led headline + two CTAs + proof line.
 * Right: a real CLIENT screenshot (WSafeFinanse), never an own product.
 * Mobile: text + CTAs come first, screenshot follows.
 */
export default function HomeHero() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden bg-surface pt-32 pb-20 md:pt-40 md:pb-28 lg:pt-44 lg:pb-32">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-14 px-6 md:px-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-24">
        {/* Text column */}
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeEntry }}
            className="inline-flex items-center gap-2 rounded-full border border-outline-variant/40 bg-surface-container/40 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant"
          >
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
            {t("home.hero.eyebrow")}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeEntry, delay: 0.06 }}
            className="mt-6 font-headline text-[clamp(2.4rem,5.4vw,4.4rem)] font-bold leading-[1.04] tracking-[-0.03em] text-on-surface text-balance"
          >
            {t("home.hero.headline")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeEntry, delay: 0.14 }}
            className="mt-7 max-w-[60ch] text-lg font-light leading-relaxed text-on-surface/75 md:text-xl"
          >
            {t("home.hero.desc")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeEntry, delay: 0.22 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap"
          >
            <ContactCtaLink className="group inline-flex items-center justify-center gap-3 rounded-full bg-primary px-7 py-4 text-sm font-medium uppercase tracking-widest text-on-primary transition-colors hover:bg-primary-container">
              {t("home.hero.ctaPrimary")}
              <span aria-hidden="true" className="transition-transform duration-300 ease-out group-hover:translate-x-1">→</span>
            </ContactCtaLink>
            <a
              href="#realizacje"
              className="group inline-flex items-center justify-center gap-3 rounded-full border border-on-surface/25 px-7 py-4 text-sm font-medium uppercase tracking-widest text-on-surface transition-colors hover:border-primary hover:text-primary"
            >
              {t("home.hero.ctaSecondary")}
              <span aria-hidden="true" className="transition-transform duration-300 ease-out group-hover:translate-x-1">→</span>
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.34 }}
            className="mt-7 text-sm font-medium text-on-surface-variant"
          >
            {t("home.hero.proof")}
          </motion.p>
        </div>

        {/* Screenshot column */}
        <motion.figure
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: easeEntry, delay: 0.18 }}
          className="relative"
        >
          <div className="relative aspect-[16/11] overflow-hidden rounded-3xl border border-outline-variant/40 bg-surface-container/40 shadow-2xl shadow-black/10">
            <Image
              src="/screenshots/wsafefinanse-hero.webp"
              alt={t("home.hero.shotAlt")}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 620px"
              className="object-cover object-top"
            />
          </div>
          <figcaption className="mt-4 flex items-center gap-2 text-sm text-on-surface-variant">
            <span aria-hidden="true" className="h-px w-6 bg-outline-variant" />
            {t("home.hero.shotCaption")}
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}

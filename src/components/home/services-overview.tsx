"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { easeEntry, durationMedium } from "@/lib/motion";

/**
 * Three service blocks, each anchored to a buyer situation.
 * Block 1 & 2 are full-width with more presence (sites/shops and systems/automation).
 * Block 3 is more compact (MVP/product validation) — secondary for the target audience.
 */
const blocks: {
  situationKey: TranslationKey;
  bodyKey: TranslationKey;
  labelKey: TranslationKey;
  linkKey: TranslationKey;
  href: string;
}[] = [
  {
    situationKey: "home.svc.block1.situation",
    bodyKey: "home.svc.block1.body",
    labelKey: "home.svc.block1.label",
    linkKey: "home.svc.block1.link",
    href: "/sklepy-internetowe",
  },
  {
    situationKey: "home.svc.block2.situation",
    bodyKey: "home.svc.block2.body",
    labelKey: "home.svc.block2.label",
    linkKey: "home.svc.block2.link",
    href: "/oferta",
  },
  {
    situationKey: "home.svc.block3.situation",
    bodyKey: "home.svc.block3.body",
    labelKey: "home.svc.block3.label",
    linkKey: "home.svc.block3.link",
    href: "/oferta",
  },
];

export default function ServicesOverview() {
  const { t } = useI18n();
  const prefersReduced = useReducedMotion();

  const reveal = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 16 } as const,
        whileInView: { opacity: 1, y: 0 } as const,
        viewport: { once: true, margin: "-12% 0px" } as const,
        transition: { duration: durationMedium, ease: easeEntry } as const,
      };

  return (
    <section
      id="uslugi"
      className="scroll-mt-24 bg-surface py-section"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        {/* Section heading */}
        <motion.h2
          {...reveal}
          className="font-headline text-h2 font-bold tracking-[-0.02em] text-on-surface text-balance [font-stretch:110%]"
        >
          {t("home.svc.title")}
        </motion.h2>

        {/* Service blocks — stacked, separated by hairlines */}
        <div className="mt-12 md:mt-16">
          {blocks.map((block, i) => {
            const isLast = i === blocks.length - 1;
            return (
              <motion.article
                key={block.situationKey}
                {...(prefersReduced
                  ? {}
                  : {
                      initial: { opacity: 0, y: 12 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true, margin: "-8% 0px" },
                      transition: {
                        duration: durationMedium,
                        ease: easeEntry,
                        delay: 0.06,
                      },
                    })}
                className={`border-t border-outline-variant py-10 md:py-14 ${
                  isLast ? "border-b" : ""
                }`}
              >
                <div
                  className={`grid grid-cols-1 gap-6 ${
                    isLast
                      ? "md:grid-cols-[1fr_1.2fr] md:gap-10"
                      : "lg:grid-cols-[1fr_1fr] lg:gap-16"
                  }`}
                >
                  {/* Left: situation (buyer's problem) */}
                  <div>
                    <h3 className="font-headline text-h3 font-bold tracking-[-0.02em] text-on-surface text-balance [font-stretch:105%]">
                      {t(block.situationKey)}
                    </h3>
                    {/* The service name is metadata under the situation, not a
                        second headline — it stays at body size. */}
                    <p className="mt-2 text-base text-on-surface-variant">
                      {t(block.labelKey)}
                    </p>
                  </div>

                  {/* Right: what we do + link */}
                  <div className="flex flex-col gap-5">
                    <p className="max-w-[60ch] text-lead leading-relaxed text-on-surface-variant text-pretty">
                      {t(block.bodyKey)}
                    </p>
                    <Link
                      href={block.href}
                      className="group inline-flex items-center gap-2 text-lead font-medium text-primary transition-colors hover:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {t(block.linkKey)}
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-300 ease-out group-hover:translate-x-1"
                      >
                        &rarr;
                      </span>
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Pricing link — secondary, quiet */}
        <div className="mt-10 md:mt-14">
          <Link
            href="/cennik"
            className="group inline-flex items-center gap-2 text-on-surface-variant transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("home.svc.pricing")}
            <span
              aria-hidden="true"
              className="transition-transform duration-300 ease-out group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

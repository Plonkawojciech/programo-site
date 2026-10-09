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
  /** Rows copied from the /cennik table (src/components/pricing.tsx): name key, net range in PLN, term key. */
  prices: { nameKey: TranslationKey; from: number; to: number; terminKey?: TranslationKey }[];
}[] = [
  {
    situationKey: "home.svc.block1.situation",
    bodyKey: "home.svc.block1.body",
    labelKey: "home.svc.block1.label",
    linkKey: "home.svc.block1.link",
    href: "/strony-internetowe",
    prices: [
      { nameKey: "pricing.itemWebsite.name", from: 2000, to: 6000, terminKey: "pricing.itemWebsite.termin" },
      { nameKey: "pricing.itemStoreWoo.name", from: 4000, to: 8000, terminKey: "pricing.itemStoreWoo.termin" },
    ],
  },
  {
    situationKey: "home.svc.block2.situation",
    bodyKey: "home.svc.block2.body",
    labelKey: "home.svc.block2.label",
    linkKey: "home.svc.block2.link",
    href: "/aplikacje-webowe-dla-firm",
    prices: [
      { nameKey: "pricing.itemWebapp.name", from: 4000, to: 8000, terminKey: "pricing.itemWebapp.termin" },
      { nameKey: "pricing.itemAutomation.name", from: 1500, to: 6000, terminKey: "pricing.itemAutomation.termin" },
    ],
  },
  {
    situationKey: "home.svc.block3.situation",
    bodyKey: "home.svc.block3.body",
    labelKey: "home.svc.block3.label",
    linkKey: "home.svc.block3.link",
    href: "/aplikacje-mobilne-dla-firm",
    prices: [{ nameKey: "pricing.itemMobile.name", from: 4000, to: 8000, terminKey: "pricing.itemMobile.termin" }],
  },
];

const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");

export default function ServicesOverview() {
  const { t } = useI18n();
  const prefersReduced = useReducedMotion();

  // Keep text visible before hydration, including with reduced motion.
  const reveal = (delay = 0) =>
    ({
      initial: false,
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-8% 0px" },
      transition: prefersReduced ? { duration: 0 } : { duration: durationMedium, ease: easeEntry, delay },
    }) as const;

  return (
    <section
      id="uslugi"
      className="scroll-mt-24 bg-surface py-section"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        {/* Section heading */}
        <motion.h2
          {...reveal()}
          className="font-headline text-h2 font-bold tracking-[-0.02em] text-on-surface text-balance [font-stretch:110%]"
        >
          {t("home.svc.title")}
        </motion.h2>

        <p className="mt-4 max-w-[60ch] text-base text-on-surface-variant">{t("home.svc.priceNote")}</p>

        {/* Service blocks — stacked, separated by hairlines */}
        <div className="mt-12 md:mt-16">
          {blocks.map((block, i) => {
            const isLast = i === blocks.length - 1;
            return (
              <motion.article
                key={block.situationKey}
                {...reveal(0.06)}
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
                    {/* Net ranges from /cennik, so a visitor knows the order of
                        magnitude before calling. Manual thousands separator:
                        Intl output depends on the runtime's ICU data. */}
                    <dl className="max-w-[60ch] border-t border-outline-variant/60">
                      {block.prices.map((row) => (
                        <div key={row.nameKey} className="flex items-baseline justify-between gap-4 border-b border-outline-variant/60 py-3">
                          <dt className="text-base text-on-surface">
                            {t(row.nameKey)}
                            {row.terminKey && <span className="block text-sm text-on-surface-variant">{t(row.terminKey)}</span>}
                          </dt>
                          <dd className="shrink-0 font-headline text-base font-bold tabular-nums text-on-surface">
                            {fmt(row.from)} – {fmt(row.to)} zł
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <Link
                      href={block.href}
                      className="group inline-flex min-h-11 items-center gap-2 text-lead font-medium text-primary transition-colors hover:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
      </div>
    </section>
  );
}

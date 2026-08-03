"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { easeEntry, durationMedium } from "@/lib/motion";
import { trackContactClick } from "@/lib/tracking";

const founders: {
  nameKey: TranslationKey;
  focusKey: TranslationKey;
  descKey: TranslationKey;
  phone: string;
  phoneDisplay: string;
}[] = [
  {
    nameKey: "home.team.wojtek.name",
    focusKey: "founders.wojtek.focus",
    descKey: "home.team.wojtek.desc",
    phone: "+48797222363",
    phoneDisplay: "+48 797 222 363",
  },
  {
    nameKey: "home.team.bartek.name",
    focusKey: "founders.bartek.focus",
    descKey: "home.team.bartek.desc",
    phone: "+48509123434",
    phoneDisplay: "+48 509 123 434",
  },
];

export default function Founders() {
  const { t } = useI18n();
  const prefersReduced = useReducedMotion();

  const reveal = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-12% 0px" },
        transition: { duration: durationMedium, ease: easeEntry },
      };

  return (
    <section
      id="o-nas"
      className="scroll-mt-24 bg-surface py-section-major"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        {/* Section heading */}
        <motion.div {...reveal} className="max-w-3xl">
          <h2 className="font-headline text-h2 font-bold tracking-[-0.02em] text-on-surface text-balance">
            {t("founders.title")}
          </h2>
          <p className="mt-5 max-w-[55ch] text-lead text-on-surface-variant leading-relaxed text-pretty">
            {t("founders.subtitle")}
          </p>
        </motion.div>

        {/* Founders — stacked, not in matching cards */}
        <div className="mt-16 flex flex-col gap-16 md:gap-20">
          {founders.map((f, i) => (
            <motion.div
              key={f.nameKey}
              {...(prefersReduced
                ? {}
                : {
                    initial: { opacity: 0, y: 16 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, margin: "-8% 0px" },
                    transition: {
                      delay: i * 0.1,
                      duration: durationMedium,
                      ease: easeEntry,
                    },
                  })}
              className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-16 md:items-baseline"
            >
              {/* Left: identity */}
              <div>
                <h3 className="font-headline text-h3 font-bold tracking-[-0.02em] text-on-surface">
                  {t(f.nameKey)}
                </h3>
                <p className="mt-2 text-on-surface-variant text-base">
                  {t(f.focusKey)}
                </p>
                <p className="mt-4 max-w-[50ch] text-on-surface-variant leading-relaxed text-pretty">
                  {t(f.descKey)}
                </p>
              </div>

              {/* Right: direct phone */}
              <a
                href={`tel:${f.phone}`}
                onClick={() =>
                  trackContactClick("phone", `tel:${f.phone}`)
                }
                className="inline-flex items-center gap-2 text-on-surface font-headline text-lg font-medium transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4 shrink-0"
                >
                  <path d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-.65 1.548l-.654.436a.25.25 0 00-.106.258c.344 1.632 1.543 2.831 3.175 3.175a.25.25 0 00.258-.106l.436-.654a1.5 1.5 0 011.548-.65l3.223.716A1.5 1.5 0 0118 12.352v1.148A1.5 1.5 0 0116.5 15h-1.5A12.5 12.5 0 012 3.5z" />
                </svg>
                {f.phoneDisplay}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Shared contact — email + location */}
        <motion.div
          {...(prefersReduced
            ? {}
            : {
                initial: { opacity: 0 },
                whileInView: { opacity: 1 },
                viewport: { once: true, margin: "-8% 0px" },
                transition: {
                  delay: 0.2,
                  duration: durationMedium,
                  ease: easeEntry,
                },
              })}
          className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-outline-variant pt-8"
        >
          <a
            href="mailto:biuro@programo.pl"
            onClick={() =>
              trackContactClick("email", "mailto:biuro@programo.pl")
            }
            className="text-on-surface font-medium transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded"
          >
            biuro@programo.pl
          </a>
          <span className="text-on-surface-variant" aria-hidden="true">
            ·
          </span>
          <span className="text-on-surface-variant">
            {t("founders.location")}
          </span>
        </motion.div>
      </div>
    </section>
  );
}

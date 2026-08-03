"use client";

import { motion } from "framer-motion";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { easeEntry, durationMedium, staggerItem } from "@/lib/motion";

const steps: { titleKey: TranslationKey; descKey: TranslationKey }[] = [
  { titleKey: "home.process.1.title", descKey: "home.process.1.desc.v2" },
  { titleKey: "home.process.2.title", descKey: "home.process.2.desc.v2" },
  { titleKey: "home.process.3.title", descKey: "home.process.3.desc.v2" },
  { titleKey: "home.process.4.title", descKey: "home.process.4.desc.v2" },
];

const terms: TranslationKey[] = [
  "home.process.terms.1",
  "home.process.terms.2",
  "home.process.terms.3",
  "home.process.terms.4",
];

export default function Process() {
  const { t } = useI18n();

  return (
    <section
      id="jak-pracujemy"
      aria-labelledby="process-heading"
      className="scroll-mt-24 bg-surface-container-low py-section-tight"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        {/* ---------- heading ---------- */}
        <motion.h2
          id="process-heading"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: durationMedium, ease: easeEntry }}
          style={{ willChange: "opacity, transform" }}
          className="max-w-2xl font-headline text-h2 tracking-[-0.02em] text-on-surface text-balance"
        >
          {t("home.process.title.v2")}
        </motion.h2>

        {/* ---------- steps (ordered list — semantics match content) ---------- */}
        <ol
          className="mt-10 grid grid-cols-1 gap-y-8 gap-x-10 md:mt-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-x-12"
          role="list"
        >
          {steps.map((step, i) => (
            <motion.li
              key={step.titleKey}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{
                delay: i * staggerItem,
                duration: durationMedium,
                ease: easeEntry,
              }}
              style={{ willChange: "opacity, transform" }}
              className="flex flex-col gap-3"
            >
              <h3 className="font-headline text-h4 tracking-[-0.01em] text-on-surface">
                <span
                  className="mr-2 text-on-surface-variant"
                  aria-hidden="true"
                >
                  {i + 1}.
                </span>
                {t(step.titleKey)}
              </h3>
              <p className="max-w-[50ch] text-base leading-relaxed text-on-surface-variant text-pretty">
                {t(step.descKey)}
              </p>
            </motion.li>
          ))}
        </ol>

        {/* ---------- terms bar (absorbed from WhyUs) ---------- */}
        <motion.aside
          aria-label={t("home.process.terms.label")}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-5% 0px" }}
          transition={{ duration: durationMedium, ease: easeEntry, delay: 0.1 }}
          style={{ willChange: "opacity" }}
          className="mt-10 border-t border-outline-variant pt-6 md:mt-12"
        >
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-on-surface-variant md:gap-x-8">
            {terms.map((key, i) => (
              <li key={key} className="flex items-baseline gap-1.5">
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="hidden text-on-surface-variant/50 md:inline"
                  >
                    /
                  </span>
                )}
                {t(key)}
              </li>
            ))}
          </ul>
        </motion.aside>
      </div>
    </section>
  );
}

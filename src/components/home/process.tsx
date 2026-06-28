"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { easeEntry, durationMedium, staggerItem } from "@/lib/motion";

type TKey = Parameters<ReturnType<typeof useI18n>["t"]>[0];

const steps: { titleKey: TKey; descKey: TKey }[] = [
  { titleKey: "home.process.1.title", descKey: "home.process.1.desc" },
  { titleKey: "home.process.2.title", descKey: "home.process.2.desc" },
  { titleKey: "home.process.3.title", descKey: "home.process.3.desc" },
  { titleKey: "home.process.4.title", descKey: "home.process.4.desc" },
];

export default function Process() {
  const { t } = useI18n();

  return (
    <section
      id="jak-pracujemy"
      className="relative scroll-mt-24 border-t border-outline-variant/20 bg-surface py-20 md:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: durationMedium, ease: easeEntry }}
            className="font-mono text-sm text-primary"
          >
            {t("home.process.eyebrow")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: durationMedium, ease: easeEntry, delay: 0.05 }}
            className="mt-4 font-headline text-3xl font-bold tracking-[-0.02em] text-on-surface md:text-5xl text-balance"
          >
            {t("home.process.title")}
          </motion.h2>
        </div>

        <ol className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-outline-variant/30 bg-outline-variant/20 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.li
              key={step.titleKey}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ delay: i * staggerItem, duration: durationMedium, ease: easeEntry }}
              className="flex flex-col gap-4 bg-surface p-8 md:p-9"
            >
              <span
                aria-hidden="true"
                className="font-headline text-4xl font-bold tracking-tight text-primary/30"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-headline text-xl font-bold tracking-tight text-on-surface md:text-2xl">
                {t(step.titleKey)}
              </h3>
              <p className="text-base font-light leading-relaxed text-on-surface/70">
                {t(step.descKey)}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

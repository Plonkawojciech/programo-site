"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { easeEntry, durationMedium, staggerItem } from "@/lib/motion";

type TKey = Parameters<ReturnType<typeof useI18n>["t"]>[0];

const items: { titleKey: TKey; descKey: TKey }[] = [
  { titleKey: "home.why.1.title", descKey: "home.why.1.desc" },
  { titleKey: "home.why.2.title", descKey: "home.why.2.desc" },
  { titleKey: "home.why.3.title", descKey: "home.why.3.desc" },
  { titleKey: "home.why.4.title", descKey: "home.why.4.desc" },
];

export default function WhyUs() {
  const { t } = useI18n();

  return (
    <section className="relative border-t border-outline-variant/20 bg-surface-container/30 py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: durationMedium, ease: easeEntry }}
          className="max-w-2xl font-headline text-3xl font-bold tracking-[-0.02em] text-on-surface md:text-5xl text-balance"
        >
          {t("home.why.title")}
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-12 sm:grid-cols-2 md:gap-x-16">
          {items.map((item, i) => (
            <motion.div
              key={item.titleKey}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ delay: (i % 2) * staggerItem, duration: durationMedium, ease: easeEntry }}
              className="flex flex-col gap-4 border-t border-outline-variant/30 pt-7"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-headline text-2xl font-bold tracking-tight text-on-surface md:text-[1.7rem]">
                {t(item.titleKey)}
              </h3>
              <p className="max-w-[52ch] text-base font-light leading-relaxed text-on-surface/70 md:text-lg">
                {t(item.descKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { easeEntry, durationMedium, staggerItem } from "@/lib/motion";

type TKey = Parameters<ReturnType<typeof useI18n>["t"]>[0];

const items: { titleKey: TKey; descKey: TKey }[] = [
  { titleKey: "home.sit.1.title", descKey: "home.sit.1.desc" },
  { titleKey: "home.sit.2.title", descKey: "home.sit.2.desc" },
  { titleKey: "home.sit.3.title", descKey: "home.sit.3.desc" },
];

export default function Situations() {
  const { t } = useI18n();

  return (
    <section className="relative border-t border-outline-variant/20 bg-surface py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <div className="max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: durationMedium, ease: easeEntry }}
            className="font-headline text-3xl font-bold tracking-[-0.02em] text-on-surface md:text-5xl text-balance"
          >
            {t("home.sit.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: durationMedium, ease: easeEntry, delay: 0.08 }}
            className="mt-5 max-w-[60ch] text-lg font-light leading-relaxed text-on-surface/70"
          >
            {t("home.sit.subtitle")}
          </motion.p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-outline-variant/30 bg-outline-variant/20 md:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.titleKey}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ delay: i * staggerItem, duration: durationMedium, ease: easeEntry }}
              className="flex flex-col gap-4 bg-surface p-8 md:p-10"
            >
              <span className="font-mono text-sm text-primary">{`0${i + 1}`}</span>
              <h3 className="font-headline text-2xl font-bold tracking-tight text-on-surface md:text-[1.65rem]">
                {t(item.titleKey)}
              </h3>
              <p className="text-base font-light leading-relaxed text-on-surface/70">
                {t(item.descKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

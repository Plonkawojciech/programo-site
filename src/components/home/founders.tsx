"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { easeEntry, durationMedium, staggerItem } from "@/lib/motion";

type TKey = Parameters<ReturnType<typeof useI18n>["t"]>[0];

const founders: { nameKey: TKey; roleKey: TKey; descKey: TKey; initials: string }[] = [
  {
    nameKey: "home.team.wojtek.name",
    roleKey: "home.team.wojtek.role",
    descKey: "home.team.wojtek.desc",
    initials: "WP",
  },
  {
    nameKey: "home.team.bartek.name",
    roleKey: "home.team.bartek.role",
    descKey: "home.team.bartek.desc",
    initials: "BK",
  },
];

export default function Founders() {
  const { t } = useI18n();

  return (
    <section
      id="o-nas"
      className="relative scroll-mt-24 border-t border-outline-variant/20 bg-surface-container/30 py-20 md:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <div className="max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: durationMedium, ease: easeEntry }}
            className="font-headline text-3xl font-bold tracking-[-0.02em] text-on-surface md:text-5xl text-balance"
          >
            {t("home.team.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: durationMedium, ease: easeEntry, delay: 0.08 }}
            className="mt-5 max-w-[60ch] text-lg font-light leading-relaxed text-on-surface/70"
          >
            {t("home.team.subtitle")}
          </motion.p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
          {founders.map((f, i) => (
            <motion.div
              key={f.initials}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ delay: i * staggerItem, duration: durationMedium, ease: easeEntry }}
              className="flex flex-col gap-5 rounded-3xl border border-outline-variant/30 bg-surface p-8 md:p-10"
            >
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/12 font-headline text-lg font-bold text-primary"
                >
                  {f.initials}
                </span>
                <div className="flex flex-col">
                  <h3 className="font-headline text-2xl font-bold tracking-tight text-on-surface">
                    {t(f.nameKey)}
                  </h3>
                  <p className="mt-1 font-mono text-xs uppercase tracking-widest text-on-surface-variant">
                    {t(f.roleKey)}
                  </p>
                </div>
              </div>
              <p className="text-base font-light leading-relaxed text-on-surface/75 md:text-lg">
                {t(f.descKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

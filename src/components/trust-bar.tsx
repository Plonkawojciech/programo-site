"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import CountUp from "@/components/ui/count-up";

type TKey = Parameters<ReturnType<typeof useI18n>["t"]>[0];

// Real clients (proper nouns — not translated). Content deck 1.2.
const CLIENTS = [
  "Jedmar",
  "WKS Poznań",
  "W. Safe Finance",
  "Skup Nieruchomości",
  "Domki Poznaniak",
];

const STATS: { valueKey: TKey; labelKey: TKey }[] = [
  { valueKey: "home.trust.stat1.value", labelKey: "home.trust.stat1.label" },
  { valueKey: "home.trust.stat2.value", labelKey: "home.trust.stat2.label" },
  { valueKey: "home.trust.stat3.value", labelKey: "home.trust.stat3.label" },
];

// Bezargumentowy default export — używany też przez landingi (/strony-internetowe,
// /sklepy-internetowe). Nie dodawać propsów.
export default function TrustBar() {
  const { t } = useI18n();

  return (
    <section className="relative bg-surface border-t border-outline-variant/20">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24 py-16 md:py-20">
        {/* Client wordmark strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6"
        >
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-on-surface-variant">
            {t("home.trust.eyebrow")}
          </span>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 md:gap-x-12">
            {CLIENTS.map((name) => (
              <span
                key={name}
                className="font-headline text-xl md:text-3xl font-bold tracking-tight text-on-surface/45"
              >
                {name}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Proof numbers */}
        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 border-t border-outline-variant/20 pt-12 sm:grid-cols-3">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.valueKey}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-2 border-l border-outline-variant/30 pl-5 md:pl-6"
            >
              <CountUp
                value={t(stat.valueKey)}
                className="font-headline text-4xl md:text-5xl font-bold tracking-tighter text-on-surface"
              />
              <span className="max-w-[16rem] text-[11px] md:text-xs font-medium uppercase tracking-widest text-on-surface-variant leading-snug">
                {t(stat.labelKey)}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

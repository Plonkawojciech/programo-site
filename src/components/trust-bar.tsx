"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { projects } from "@/lib/projects";

type TKey = Parameters<ReturnType<typeof useI18n>["t"]>[0];

const stats: { valueKey: TKey; labelKey: TKey }[] = [
  { valueKey: "trust.stat1.value", labelKey: "trust.stat1.label" },
  { valueKey: "trust.stat2.value", labelKey: "trust.stat2.label" },
  { valueKey: "trust.stat3.value", labelKey: "trust.stat3.label" },
  { valueKey: "trust.stat4.value", labelKey: "trust.stat4.label" },
];

// Real, shipped products — wordmark strip links straight to each case study.
const WORDMARK_SLUGS = [
  "estalo",
  "jedmar",
  "solvio",
  "rejestr-pro",
  "wks-poznan",
];

export default function TrustBar() {
  const { t } = useI18n();
  const wordmarks = WORDMARK_SLUGS.map((slug) =>
    projects.find((p) => p.slug === slug)
  ).filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <section className="relative bg-surface border-t border-outline-variant/20">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24 py-16 md:py-20">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.valueKey}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-2 border-l border-outline-variant/30 pl-5 md:pl-6"
            >
              <span className="font-headline text-4xl md:text-5xl font-bold tracking-tighter text-on-surface">
                {t(stat.valueKey)}
              </span>
              <span className="text-[11px] md:text-xs font-medium uppercase tracking-widest text-on-surface-variant leading-snug">
                {t(stat.labelKey)}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Wordmark strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8 }}
          className="mt-14 md:mt-20 flex flex-col gap-6 border-t border-outline-variant/20 pt-10"
        >
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-on-surface-variant">
            {t("trust.eyebrow")}
          </span>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-5 md:gap-x-14">
            {wordmarks.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-on-surface/45 hover:text-on-surface transition-colors duration-300"
              >
                {p.title}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

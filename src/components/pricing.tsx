"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

type TKey = Parameters<ReturnType<typeof useI18n>["t"]>[0];

interface Factor {
  nameKey: TKey;
  descKey: TKey;
  features: TKey[];
  featured?: boolean;
}

// What actually drives the cost of a project — shown instead of a fixed price
// list, because every project starts from a different goal and scope.
const factors: Factor[] = [
  {
    nameKey: "pricing.factor1.name",
    descKey: "pricing.factor1.desc",
    features: ["pricing.factor1.f1", "pricing.factor1.f2", "pricing.factor1.f3"],
  },
  {
    nameKey: "pricing.factor2.name",
    descKey: "pricing.factor2.desc",
    features: ["pricing.factor2.f1", "pricing.factor2.f2", "pricing.factor2.f3"],
    featured: true,
  },
  {
    nameKey: "pricing.factor3.name",
    descKey: "pricing.factor3.desc",
    features: ["pricing.factor3.f1", "pricing.factor3.f2", "pricing.factor3.f3"],
  },
];

export default function Pricing() {
  const { t } = useI18n();

  return (
    <section className="relative bg-surface py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-[2560px] px-6 md:px-24 2xl:px-40">
        {/* Header */}
        <div className="mb-20 md:mb-28 flex flex-col gap-6 max-w-4xl">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-primary"
          >
            {t("pricing.label")}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-headline text-4xl font-bold tracking-tighter text-on-surface md:text-7xl 2xl:text-[6vw]"
          >
            {t("pricing.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl font-light text-on-surface/70 max-w-3xl leading-relaxed"
          >
            {t("pricing.desc")}
          </motion.p>
        </div>

        {/* Cost drivers — what shapes an individual quote */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {factors.map((factor, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`relative flex flex-col rounded-3xl border p-8 md:p-10 ${
                factor.featured
                  ? "border-primary bg-primary/5 shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
                  : "border-outline-variant/30 bg-surface-container/40"
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-headline text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
                {t(factor.nameKey)}
              </h3>
              <p className="mt-4 text-on-surface-variant text-sm md:text-base font-light leading-relaxed">
                {t(factor.descKey)}
              </p>
              <ul className="mt-8 flex flex-col gap-4">
                {factor.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 text-sm md:text-base text-on-surface/80"
                  >
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    {t(f)}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* CTA band — the only call to action: get an individual quote */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 md:mt-10 flex flex-col items-start gap-8 rounded-3xl border border-primary/40 bg-primary/5 p-8 md:p-12 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="max-w-2xl">
            <h2 className="font-headline text-2xl md:text-4xl font-bold tracking-tight text-on-surface">
              {t("pricing.ctaTitle")}
            </h2>
            <p className="mt-3 text-base md:text-lg font-light text-on-surface/70 leading-relaxed">
              {t("pricing.ctaDesc")}
            </p>
            <p className="mt-4 text-sm font-medium text-on-surface-variant">
              {t("pricing.promise")}
            </p>
          </div>
          <Link
            href="/kontakt"
            className="shrink-0 inline-flex items-center justify-center gap-3 rounded-full bg-primary px-8 py-4 text-sm uppercase tracking-widest font-medium text-on-primary transition-all hover:bg-primary-container hover:gap-5"
          >
            {t("pricing.cta")} <span aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

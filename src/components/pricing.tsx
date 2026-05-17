"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

type TKey = Parameters<ReturnType<typeof useI18n>["t"]>[0];

interface PricingTier {
  nameKey: TKey;
  priceKey: TKey;
  descKey: TKey;
  features: TKey[];
  featured?: boolean;
}

const tiers: PricingTier[] = [
  {
    nameKey: "pricing.starter.name",
    priceKey: "pricing.starter.price",
    descKey: "pricing.starter.desc",
    features: [
      "pricing.starter.f1",
      "pricing.starter.f2",
      "pricing.starter.f3",
      "pricing.starter.f4",
    ],
  },
  {
    nameKey: "pricing.business.name",
    priceKey: "pricing.business.price",
    descKey: "pricing.business.desc",
    features: [
      "pricing.business.f1",
      "pricing.business.f2",
      "pricing.business.f3",
      "pricing.business.f4",
    ],
    featured: true,
  },
  {
    nameKey: "pricing.saas.name",
    priceKey: "pricing.saas.price",
    descKey: "pricing.saas.desc",
    features: [
      "pricing.saas.f1",
      "pricing.saas.f2",
      "pricing.saas.f3",
      "pricing.saas.f4",
    ],
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
            className="text-lg md:text-xl font-light text-on-surface/70 max-w-3xl"
          >
            {t("pricing.desc")}
          </motion.p>
        </div>

        {/* Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`relative flex flex-col rounded-3xl border p-8 md:p-10 ${
                tier.featured
                  ? "border-primary bg-primary/5 shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
                  : "border-outline-variant/30 bg-surface-container/40"
              }`}
            >
              {tier.featured && (
                <span className="absolute -top-3 left-8 bg-primary text-on-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  Popular
                </span>
              )}
              <h3 className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
                {t(tier.nameKey)}
              </h3>
              <p className="mt-4 text-on-surface-variant text-sm md:text-base font-light leading-relaxed">
                {t(tier.descKey)}
              </p>
              <div className="mt-8 mb-8 pb-8 border-b border-outline-variant/30">
                <span className="font-headline text-4xl md:text-5xl font-bold tracking-tighter text-on-surface">
                  {t(tier.priceKey)}
                </span>
              </div>
              <ul className="flex flex-col gap-4 mb-10">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm md:text-base text-on-surface/80">
                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    {t(f)}
                  </li>
                ))}
              </ul>
              <Link
                href="/kontakt"
                className={`mt-auto inline-flex items-center justify-center rounded-full px-6 py-3 text-sm uppercase tracking-widest font-medium transition-all ${
                  tier.featured
                    ? "bg-primary text-on-primary hover:bg-primary-container"
                    : "bg-surface-container text-on-surface border border-outline-variant/30 hover:border-primary"
                }`}
              >
                {t("pricing.cta")}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

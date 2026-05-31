"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import ContactCtaLink from "@/components/contact-cta-link";

type TKey = Parameters<ReturnType<typeof useI18n>["t"]>[0];

interface ValueItem {
  titleKey: TKey;
  descKey: TKey;
  number: string;
}

const values: ValueItem[] = [
  {
    titleKey: "main.values.problem.title",
    descKey: "main.values.problem.desc",
    number: "01",
  },
  {
    titleKey: "main.values.craft.title",
    descKey: "main.values.craft.desc",
    number: "02",
  },
  {
    titleKey: "main.values.speed.title",
    descKey: "main.values.speed.desc",
    number: "03",
  },
];

export default function MainIntro() {
  const { t } = useI18n();

  return (
    <section className="relative bg-surface py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-[2560px] px-6 md:px-24 2xl:px-40">
        {/* Headline */}
        <div className="max-w-5xl">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-primary"
          >
            {t("main.intro.label")}
          </motion.span>
          <motion.h1
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 font-headline text-4xl md:text-7xl 2xl:text-[6vw] font-bold tracking-tighter text-on-surface leading-[1.05]"
          >
            {t("main.intro.headline")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-10 text-xl md:text-2xl font-light text-on-surface/70 max-w-3xl leading-relaxed"
          >
            {t("main.intro.subheadline")}
          </motion.p>

          {/* CTAs */}
          <div className="mt-12 flex flex-wrap gap-4">
            <ContactCtaLink className="inline-flex items-center gap-3 bg-primary text-on-primary px-6 py-3.5 rounded-full text-sm uppercase tracking-widest font-medium hover:bg-primary-container transition-all hover:gap-5">
              {t("main.cta.primary")} <span>→</span>
            </ContactCtaLink>
            <Link
              href="/oferta"
              className="inline-flex items-center gap-3 border border-outline-variant/40 text-on-surface px-6 py-3.5 rounded-full text-sm uppercase tracking-widest font-medium hover:border-primary transition-all hover:gap-5"
            >
              {t("main.cta.offer")} <span>→</span>
            </Link>
          </div>
        </div>

        {/* Values */}
        <div className="mt-24 md:mt-40">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-on-surface-variant mb-12 md:mb-20"
          >
            {t("main.values.title")}
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {values.map((v, i) => (
              <motion.div
                key={v.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ delay: i * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-4 border-t border-outline-variant/30 pt-8"
              >
                <span className="font-mono text-xs uppercase tracking-widest text-primary">
                  {v.number}
                </span>
                <h4 className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
                  {t(v.titleKey)}
                </h4>
                <p className="text-base md:text-lg font-light leading-relaxed text-on-surface/70">
                  {t(v.descKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

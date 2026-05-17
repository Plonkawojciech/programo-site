"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

type TKey = Parameters<ReturnType<typeof useI18n>["t"]>[0];

interface OfferItem {
  titleKey: TKey;
  descKey: TKey;
  number: string;
}

const offerItems: OfferItem[] = [
  { titleKey: "offer.web.title", descKey: "offer.web.desc", number: "01" },
  { titleKey: "offer.saas.title", descKey: "offer.saas.desc", number: "02" },
  { titleKey: "offer.mobile.title", descKey: "offer.mobile.desc", number: "03" },
  { titleKey: "offer.ai.title", descKey: "offer.ai.desc", number: "04" },
  { titleKey: "offer.consulting.title", descKey: "offer.consulting.desc", number: "05" },
];

export default function Offer() {
  const { t } = useI18n();

  return (
    <section className="relative bg-surface py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-[2560px] px-6 md:px-24 2xl:px-40">
        {/* Header */}
        <div className="mb-20 md:mb-32 flex flex-col gap-6 max-w-4xl">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-primary"
          >
            {t("offer.label")}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-headline text-5xl font-bold tracking-tighter text-on-surface md:text-8xl 2xl:text-[8vw]"
          >
            {t("offer.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl font-light text-on-surface/70 max-w-3xl"
          >
            {t("offer.desc")}
          </motion.p>
        </div>

        {/* Offer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-outline-variant/20">
          {offerItems.map((item, i) => (
            <motion.div
              key={item.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="group relative bg-surface p-8 md:p-12 transition-colors hover:bg-surface-container"
            >
              <span className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-on-surface-variant">
                {item.number}
              </span>
              <h2 className="mt-4 font-headline text-3xl md:text-4xl 2xl:text-5xl font-bold tracking-tighter text-on-surface">
                {t(item.titleKey)}
              </h2>
              <p className="mt-6 text-base md:text-lg font-light leading-relaxed text-on-surface/70">
                {t(item.descKey)}
              </p>
            </motion.div>
          ))}

          {/* CTA cell */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ delay: offerItems.length * 0.1, duration: 0.6 }}
            className="relative bg-primary p-8 md:p-12 flex flex-col justify-between gap-8"
          >
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-on-primary/70">
              {String(offerItems.length + 1).padStart(2, "0")}
            </span>
            <h2 className="font-headline text-3xl md:text-4xl 2xl:text-5xl font-bold tracking-tighter text-on-primary">
              {t("main.cta.primary")}
            </h2>
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-3 text-on-primary text-sm uppercase tracking-widest font-medium group-hover:gap-5 transition-all w-fit border-b border-on-primary/40 pb-1"
            >
              {t("nav.cta")} <span>→</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

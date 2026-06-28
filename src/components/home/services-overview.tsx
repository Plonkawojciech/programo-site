"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { easeEntry, durationMedium, staggerItem } from "@/lib/motion";

type TKey = Parameters<ReturnType<typeof useI18n>["t"]>[0];

const services: { titleKey: TKey; descKey: TKey; href: string }[] = [
  { titleKey: "home.services.web.title", descKey: "home.services.web.desc", href: "/oferta" },
  { titleKey: "home.services.shop.title", descKey: "home.services.shop.desc", href: "/sklepy-internetowe" },
  { titleKey: "home.services.saas.title", descKey: "home.services.saas.desc", href: "/oferta" },
  { titleKey: "home.services.ai.title", descKey: "home.services.ai.desc", href: "/oferta" },
  { titleKey: "home.services.mobile.title", descKey: "home.services.mobile.desc", href: "/oferta" },
];

export default function ServicesOverview() {
  const { t } = useI18n();

  return (
    <section
      id="uslugi"
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
            {t("home.services.eyebrow")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: durationMedium, ease: easeEntry, delay: 0.05 }}
            className="mt-4 font-headline text-3xl font-bold tracking-[-0.02em] text-on-surface md:text-5xl text-balance"
          >
            {t("home.services.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: durationMedium, ease: easeEntry, delay: 0.1 }}
            className="mt-5 max-w-[60ch] text-lg font-light leading-relaxed text-on-surface/70"
          >
            {t("home.services.subtitle")}
          </motion.p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-outline-variant/30 bg-outline-variant/20 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={s.titleKey}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ delay: (i % 3) * staggerItem, duration: durationMedium, ease: easeEntry }}
              className="bg-surface"
            >
              <Link
                href={s.href}
                className="group flex h-full flex-col gap-4 p-8 transition-colors hover:bg-surface-container/40 md:p-9"
              >
                <h3 className="font-headline text-xl font-bold tracking-tight text-on-surface md:text-2xl">
                  {t(s.titleKey)}
                </h3>
                <p className="flex-1 text-base font-light leading-relaxed text-on-surface/70">
                  {t(s.descKey)}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                  {t("home.services.more")}
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 ease-out group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </Link>
            </motion.div>
          ))}

          <div className="flex items-center justify-center bg-surface p-8 md:p-9">
            <Link
              href="/oferta"
              className="group inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-medium uppercase tracking-widest text-on-primary transition-colors hover:bg-primary-container"
            >
              {t("home.services.cta")}
              <span
                aria-hidden="true"
                className="transition-transform duration-300 ease-out group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

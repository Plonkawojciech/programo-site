"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { projects, type ProjectStatus } from "@/lib/projects";
import { easeEntry, durationMedium, staggerItem } from "@/lib/motion";

const ORDER = ["estalo", "solvio", "rejestr-pro", "athlix"];

const statusKey: Record<ProjectStatus, "work.live" | "work.inDevelopment" | "work.comingSoon"> = {
  live: "work.live",
  development: "work.inDevelopment",
  planned: "work.comingSoon",
};

const ownProducts = ORDER.map((slug) => projects.find((p) => p.slug === slug)).filter(
  (p): p is NonNullable<typeof p> => Boolean(p)
);

export default function OwnProducts() {
  const { lang, t } = useI18n();

  return (
    <section className="relative border-t border-outline-variant/20 bg-surface-container/30 py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: durationMedium, ease: easeEntry }}
            className="font-mono text-sm text-primary"
          >
            {t("home.products.eyebrow")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: durationMedium, ease: easeEntry, delay: 0.05 }}
            className="mt-4 font-headline text-3xl font-bold tracking-[-0.02em] text-on-surface md:text-5xl text-balance"
          >
            {t("home.products.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: durationMedium, ease: easeEntry, delay: 0.1 }}
            className="mt-5 max-w-[60ch] text-lg font-light leading-relaxed text-on-surface/70"
          >
            {t("home.products.subtitle")}
          </motion.p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ownProducts.map((p, i) => {
            const cover = p.screenshots?.[0];
            return (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ delay: (i % 4) * staggerItem, duration: durationMedium, ease: easeEntry }}
              >
                <Link
                  href={`/projects/${p.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface transition-colors hover:border-primary/40"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-outline-variant/20">
                    {cover ? (
                      <Image
                        src={cover}
                        alt={p.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="font-headline text-3xl font-bold text-on-surface/15">
                          {p.title}
                        </span>
                      </div>
                    )}
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-surface/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-on-surface backdrop-blur-sm">
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {t(statusKey[p.status])}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-2 p-6">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-headline text-xl font-bold tracking-tight text-on-surface">
                        {p.title}
                      </h3>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                        {t("home.products.badge")}
                      </span>
                    </div>
                    <p className="text-sm font-light leading-relaxed text-on-surface/70">
                      {p.subtitle[lang]}
                    </p>
                    {p.metric ? (
                      <p className="mt-auto pt-3 font-mono text-xs text-primary">{p.metric[lang]}</p>
                    ) : null}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: durationMedium, ease: easeEntry, delay: 0.1 }}
          className="mt-12 flex justify-center"
        >
          <Link
            href="/projekty"
            className="group inline-flex items-center gap-3 rounded-full border border-on-surface/25 px-7 py-3.5 text-sm font-medium uppercase tracking-widest text-on-surface transition-colors hover:border-primary hover:text-primary"
          >
            {t("home.products.viewAll")}
            <span
              aria-hidden="true"
              className="transition-transform duration-300 ease-out group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

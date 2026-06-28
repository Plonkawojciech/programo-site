"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { easeEntry, durationMedium, staggerItem } from "@/lib/motion";

type TKey = Parameters<ReturnType<typeof useI18n>["t"]>[0];

interface WorkItem {
  slug: string;
  image: string;
  categoryKey: TKey;
  problemKey: TKey;
  solutionKey: TKey;
  effectKey: TKey;
  name: string;
}

const items: WorkItem[] = [
  {
    slug: "wsafefinanse",
    image: "/screenshots/wsafefinanse-hero.webp",
    categoryKey: "home.work.wsafefinanse.category",
    problemKey: "home.work.wsafefinanse.problem",
    solutionKey: "home.work.wsafefinanse.solution",
    effectKey: "home.work.wsafefinanse.effect",
    name: "WSafe Finanse",
  },
  {
    slug: "jedmar",
    image: "/screenshots/jedmar-hero.webp",
    categoryKey: "home.work.jedmar.category",
    problemKey: "home.work.jedmar.problem",
    solutionKey: "home.work.jedmar.solution",
    effectKey: "home.work.jedmar.effect",
    name: "Jedmar",
  },
];

export default function ClientWork() {
  const { t } = useI18n();

  return (
    <section
      id="realizacje"
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
            {t("home.work.eyebrow")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: durationMedium, ease: easeEntry, delay: 0.05 }}
            className="mt-4 font-headline text-3xl font-bold tracking-[-0.02em] text-on-surface md:text-5xl text-balance"
          >
            {t("home.work.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: durationMedium, ease: easeEntry, delay: 0.1 }}
            className="mt-5 max-w-[60ch] text-lg font-light leading-relaxed text-on-surface/70"
          >
            {t("home.work.subtitle")}
          </motion.p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          {items.map((item, i) => (
            <motion.article
              key={item.slug}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ delay: i * staggerItem, duration: durationMedium, ease: easeEntry }}
              className="group flex flex-col overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface-container/30"
            >
              <Link
                href={`/projects/${item.slug}`}
                className="relative block aspect-[16/10] overflow-hidden bg-outline-variant/20"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 640px"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </Link>

              <div className="flex flex-1 flex-col gap-6 p-8 md:p-10">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="font-headline text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
                    {item.name}
                  </h3>
                  <span className="font-mono text-xs uppercase tracking-widest text-on-surface-variant">
                    {t(item.categoryKey)}
                  </span>
                </div>

                <dl className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-[8rem_1fr] sm:gap-4">
                    <dt className="font-mono text-xs uppercase tracking-widest text-on-surface-variant pt-0.5">
                      {t("home.work.problem")}
                    </dt>
                    <dd className="text-base font-light leading-relaxed text-on-surface/75">
                      {t(item.problemKey)}
                    </dd>
                  </div>
                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-[8rem_1fr] sm:gap-4">
                    <dt className="font-mono text-xs uppercase tracking-widest text-on-surface-variant pt-0.5">
                      {t("home.work.solution")}
                    </dt>
                    <dd className="text-base font-light leading-relaxed text-on-surface/75">
                      {t(item.solutionKey)}
                    </dd>
                  </div>
                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-[8rem_1fr] sm:gap-4">
                    <dt className="font-mono text-xs uppercase tracking-widest text-primary pt-0.5">
                      {t("home.work.effect")}
                    </dt>
                    <dd className="text-base font-normal leading-relaxed text-on-surface">
                      {t(item.effectKey)}
                    </dd>
                  </div>
                </dl>

                <Link
                  href={`/projects/${item.slug}`}
                  className="group/cta mt-auto inline-flex items-center gap-2 pt-2 text-sm font-medium uppercase tracking-widest text-primary"
                >
                  {t("home.work.cta")}
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 ease-out group-hover/cta:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </div>
            </motion.article>
          ))}
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
            {t("home.work.viewAll")}
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

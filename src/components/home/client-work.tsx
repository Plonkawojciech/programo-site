"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { easeEntry, durationMedium, staggerItem } from "@/lib/motion";
import { getProjectBySlug } from "@/lib/projects";

interface CaseStudy {
  slug: string;
  image: string;
  imgAltKey: TranslationKey;
  categoryKey: TranslationKey;
  problemKey: TranslationKey;
  solutionKey: TranslationKey;
  effectKey: TranslationKey;
}

// Order is the pitch order, not chronology: Jedmar leads because it is the one
// piece of client work that shipped to the App Store and Google Play, so it
// carries the most weight with someone comparing vendors. W. Safe Finance
// closes the section.
const cases: CaseStudy[] = [
  {
    slug: "jedmar",
    image: "/screenshots/jedmar-hero.webp",
    imgAltKey: "home.work.jedmar.imgAlt",
    categoryKey: "home.work.jedmar.category",
    problemKey: "home.work.jedmar.problem",
    solutionKey: "home.work.jedmar.solution",
    effectKey: "home.work.jedmar.effect",
  },
  {
    // Key namespace is `wks` while the project slug is `wks-poznan`; the two are
    // deliberately not kept in sync — the dictionary keys are shorter by design.
    slug: "wks-poznan",
    image: "/screenshots/wks-hero.webp",
    imgAltKey: "home.work.wks.imgAlt",
    categoryKey: "home.work.wks.category",
    problemKey: "home.work.wks.problem",
    solutionKey: "home.work.wks.solution",
    effectKey: "home.work.wks.effect",
  },
  {
    slug: "wsafefinanse",
    image: "/screenshots/wsafefinanse-hero.webp",
    imgAltKey: "home.work.wsafefinanse.imgAlt",
    categoryKey: "home.work.wsafefinanse.category",
    problemKey: "home.work.wsafefinanse.problem",
    solutionKey: "home.work.wsafefinanse.solution",
    effectKey: "home.work.wsafefinanse.effect",
  },
];

/* ── Narrative block for a single case study ─────────────────────────── */

function CaseNarrative({
  c,
  t,
  reduced,
}: {
  c: CaseStudy;
  t: ReturnType<typeof useI18n>["t"];
  reduced: boolean;
}) {
  const base = reduced
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: 16 };
  const visible = { opacity: 1, y: 0 };
  const transition = (d: number) => ({
    delay: d,
    duration: durationMedium,
    ease: easeEntry,
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h3 className="font-headline text-h3 font-semibold tracking-tight text-on-surface">
          {/* Read from the project record rather than repeated here. A second
              copy of a client's name is a second thing to keep correct, and it
              had already drifted — this rendered "WKS Poznan" while the project
              page, the trust bar and the case study all said "WKS Poznań". */}
          {getProjectBySlug(c.slug)?.title ?? c.slug}
        </h3>
        <span className="text-sm text-on-surface-variant">
          {t(c.categoryKey)}
        </span>
      </div>

      <dl className="flex flex-col gap-4">
        {(
          [
            { label: "home.work.problem" as TranslationKey, value: c.problemKey, accent: false },
            { label: "home.work.solution" as TranslationKey, value: c.solutionKey, accent: false },
            { label: "home.work.effect" as TranslationKey, value: c.effectKey, accent: true },
          ]
        ).map((row, ri) => (
          <motion.div
            key={ri}
            initial={base}
            whileInView={visible}
            viewport={{ once: true, margin: "-5% 0px" }}
            transition={transition(ri * staggerItem)}
            className="flex flex-col gap-1"
          >
            <dt className="text-sm font-medium text-on-surface-variant">
              {t(row.label)}
            </dt>
            <dd
              className={
                row.accent
                  ? "text-base leading-relaxed text-on-surface"
                  : "text-base leading-relaxed text-on-surface-variant"
              }
            >
              {t(row.value)}
            </dd>
          </motion.div>
        ))}
      </dl>

      <Link
        href={`/projects/${c.slug}`}
        className="group/link mt-1 inline-flex w-fit items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-on-surface focus-visible:text-on-surface"
      >
        {t("home.work.cta")}
        <span
          aria-hidden="true"
          className="transition-transform duration-300 ease-out group-hover/link:translate-x-1"
        >
          &rarr;
        </span>
      </Link>
    </div>
  );
}

/* ── Main section ────────────────────────────────────────────────────── */

export default function ClientWork() {
  const { t } = useI18n();
  const reduced = useReducedMotion() ?? false;

  const featured = cases[0];
  const secondary = cases.slice(1);

  return (
    <section
      id="realizacje"
      className="relative scroll-mt-24 bg-surface-dim py-section-major"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        {/* ── Section heading ──────────────────────────────────── */}
        <div className="max-w-2xl">
          <h2 className="font-headline text-h2 font-semibold tracking-tight text-on-surface text-balance [font-stretch:110%]">
            {t("home.work.title.v2")}
          </h2>
          <p className="mt-4 max-w-[60ch] text-lead leading-relaxed text-on-surface-variant text-pretty">
            {t("home.work.subtitle.v2")}
          </p>
        </div>

        {/* ── Featured case study (larger weight) ─────────────── */}
        <div className="mt-12 grid grid-cols-1 items-start gap-8 lg:mt-16 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <Link
            href={`/projects/${featured.slug}`}
            className="group relative block aspect-[16/10] overflow-hidden rounded-lg bg-surface-container"
          >
            <Image
              src={featured.image}
              alt={t(featured.imgAltKey)}
              fill
              sizes="(max-width: 1024px) 100vw, 680px"
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
          </Link>

          <CaseNarrative c={featured} t={t} reduced={reduced} />
        </div>

        {/* ── Secondary case studies (compact rows) ───────────── */}
        <div className="mt-12 border-t border-outline-variant pt-10 lg:mt-16 lg:pt-12">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
            {secondary.map((c) => (
              <article key={c.slug} className="flex flex-col gap-5">
                <Link
                  href={`/projects/${c.slug}`}
                  className="group relative block aspect-[16/10] overflow-hidden rounded-lg bg-surface-container"
                >
                  <Image
                    src={c.image}
                    alt={t(c.imgAltKey)}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1400px) 50vw, 640px"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                </Link>

                <CaseNarrative c={c} t={t} reduced={reduced} />
              </article>
            ))}
          </div>
        </div>

        {/* ── View all link ───────────────────────────────────── */}
        <div className="mt-12 flex justify-center lg:mt-16">
          <Link
            href="/projekty"
            className="group inline-flex items-center gap-3 rounded-full border border-outline px-7 py-3.5 text-sm font-medium uppercase tracking-widest text-on-surface transition-colors hover:border-primary hover:text-primary"
          >
            {t("home.work.viewAll")}
            <span
              aria-hidden="true"
              className="transition-transform duration-300 ease-out group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

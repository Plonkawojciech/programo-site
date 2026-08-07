"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { getProjectBySlug } from "@/lib/projects";
import { trackPortfolioClick } from "@/lib/tracking";

interface CaseStudy {
  slug: string;
  image: string;
  imgAltKey: TranslationKey;
  categoryKey: TranslationKey;
}

// The caption is a label, not a paragraph. `home.work.*.effect` — two full
// sentences each — was written for the narrative layout this replaced; over a
// screenshot it turned into a three-line wall the visitor scrolls past. It still
// lives in the dictionary and still gets read, on the case study page the button
// leads to. Here the name and the category do the work.

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
  },
  {
    // Key namespace is `wks` while the project slug is `wks-poznan`; the two are
    // deliberately not kept in sync — the dictionary keys are shorter by design.
    slug: "wks-poznan",
    image: "/screenshots/wks-hero.webp",
    imgAltKey: "home.work.wks.imgAlt",
    categoryKey: "home.work.wks.category",
  },
  {
    slug: "wsafefinanse",
    image: "/screenshots/wsafefinanse-hero.webp",
    imgAltKey: "home.work.wsafefinanse.imgAlt",
    categoryKey: "home.work.wsafefinanse.category",
  },
];

/* ── Main section ────────────────────────────────────────────────────── */

export default function ClientWork() {
  const { t } = useI18n();
  const reduced = useReducedMotion() ?? false;
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Which slide is under the middle of the rail. Measured from the DOM rather
  // than tracked as state the buttons also write to, because the rail is a
  // native scroller: a drag, a trackpad flick, a shift-wheel and a dot click all
  // have to land on the same answer, and only the scroll position knows.
  const syncActive = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const middle = rail.scrollLeft + rail.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    Array.from(rail.children).forEach((child, i) => {
      const el = child as HTMLElement;
      const dist = Math.abs(el.offsetLeft + el.offsetWidth / 2 - middle);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActive(best);
  }, []);

  useEffect(() => {
    syncActive();
  }, [syncActive]);

  const goTo = (i: number) => {
    const rail = railRef.current;
    const el = rail?.children[i] as HTMLElement | undefined;
    if (!rail || !el) return;
    rail.scrollTo({
      left: el.offsetLeft - (rail.clientWidth - el.offsetWidth) / 2,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  // Padding is asymmetric on purpose. OwnProducts sits directly below on the
  // same `bg-surface-dim` with no divider — the two are one sunken room, so the
  // seam between them has to be the tightest boundary on the page (104px at
  // 1440, against 132–156 everywhere else). A symmetric `py-section-major` here
  // would add its 104 to OwnProducts' own top padding and open a gap wider than
  // the ones separating rooms.
  return (
    <section
      id="realizacje"
      className="relative scroll-mt-24 overflow-hidden bg-surface-dim pt-section-major pb-section-tight"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <div className="max-w-2xl">
          <h2 className="font-headline text-h2 font-semibold tracking-tight text-on-surface text-balance [font-stretch:110%]">
            {t("home.work.title.v2")}
          </h2>
          <p className="mt-4 max-w-[60ch] text-lead leading-relaxed text-on-surface-variant text-pretty">
            {t("home.work.subtitle.v2")}
          </p>
        </div>
      </div>

      {/* ── Snap rail ────────────────────────────────────────────
          Full-bleed on purpose: the slide is narrower than the viewport and
          centred, so the neighbours are clipped by the screen edge instead of
          by a container. That clipped edge is the entire affordance — it says
          "there is more this way" without a caption or an arrow.
          `--slide` drives both the slide width and the rail's own side padding,
          so one number keeps the active card centred at every breakpoint. */}
      <div
        ref={railRef}
        onScroll={syncActive}
        role="group"
        aria-roledescription="karuzela"
        aria-label={t("home.work.title.v2")}
        className="scrollbar-none mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[max(1.5rem,calc((100%-var(--slide))/2))] pb-2 [--slide:88vw] md:mt-14 md:gap-6 md:[--slide:74vw] lg:[--slide:min(62vw,1080px)]"
      >
        {cases.map((c, i) => {
          const project = getProjectBySlug(c.slug);
          return (
            <article
              key={c.slug}
              className="w-[var(--slide)] shrink-0 snap-center"
              aria-label={`${i + 1} z ${cases.length}`}
            >
              <Link
                href={`/projects/${c.slug}`}
                onClick={() => trackPortfolioClick(c.slug, `/projects/${c.slug}`)}
                className="group relative block aspect-[4/3] overflow-hidden rounded-2xl shadow-card transition-shadow duration-300 hover:shadow-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 sm:aspect-[16/10] lg:aspect-[16/9]"
              >
                <Image
                  src={c.image}
                  alt={t(c.imgAltKey)}
                  fill
                  sizes="(max-width: 768px) 88vw, (max-width: 1024px) 74vw, 1080px"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  priority={i === 0}
                />

                {/* Scrim. The caption sits inside the bottom band where this is
                    at least 75% black, so white text clears 4.5:1 against ANY
                    screenshot underneath — even a blown-out white one, which
                    composites to #404040 at worst. Contrast here cannot be
                    audited from the DOM, so it is guaranteed by the alpha
                    instead of measured. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/75 to-transparent"
                />

                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 md:flex-row md:items-center md:gap-5 md:p-7">
                  <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[#111] transition-transform duration-300 group-hover:-translate-y-0.5">
                    {t("home.work.cta")}
                    <span aria-hidden="true">&rarr;</span>
                  </span>
                  <p className="text-sm leading-snug text-white text-pretty md:text-base">
                    <span className="font-semibold">
                      {project?.title ?? c.slug}
                    </span>
                    <span className="text-white/70"> · {t(c.categoryKey)}</span>
                  </p>
                </div>
              </Link>
            </article>
          );
        })}
      </div>

      {/* ── Dots ─────────────────────────────────────────────────
          Real buttons, not decoration: they are the keyboard route along the
          rail. The active one is a stretched bar rather than a bigger circle so
          position is readable without relying on colour alone. */}
      <div className="mt-6 flex items-center justify-center gap-2.5">
        {cases.map((c, i) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`${getProjectBySlug(c.slug)?.title ?? c.slug}`}
            aria-current={i === active}
            className="group flex h-6 items-center px-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
          >
            <span
              aria-hidden="true"
              className={`block h-1.5 rounded-full transition-all duration-300 ${
                i === active
                  ? "w-7 bg-on-surface"
                  : "w-1.5 bg-outline group-hover:bg-on-surface-variant"
              }`}
            />
          </button>
        ))}
      </div>

      <div className="mx-auto mt-10 flex max-w-[1400px] justify-center px-6 md:px-12 lg:px-24">
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
    </section>
  );
}

"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import Reveal from "@/components/ui/reveal";

type TKey = Parameters<ReturnType<typeof useI18n>["t"]>[0];

interface Pillar {
  titleKey: TKey;
  descKey: TKey;
  exampleKey: TKey;
  bulletKeys: TKey[];
  href: string;
}

// Same four pillars as the homepage (content-deck-2026-07.md section 1.3),
// expanded here with a "what you get" list and a link to the matching
// subpage — content-deck section 2.
const pillars: Pillar[] = [
  {
    titleKey: "offer.pillar1.title",
    descKey: "offer.pillar1.desc",
    exampleKey: "offer.pillar1.example",
    bulletKeys: ["offer.pillar1.b1", "offer.pillar1.b2", "offer.pillar1.b3", "offer.pillar1.b4", "offer.pillar1.b5"],
    href: "/oferta",
  },
  {
    titleKey: "offer.pillar2.title",
    descKey: "offer.pillar2.desc",
    exampleKey: "offer.pillar2.example",
    bulletKeys: ["offer.pillar2.b1", "offer.pillar2.b2", "offer.pillar2.b3", "offer.pillar2.b4", "offer.pillar2.b5"],
    href: "/oferta",
  },
  {
    titleKey: "offer.pillar3.title",
    descKey: "offer.pillar3.desc",
    exampleKey: "offer.pillar3.example",
    bulletKeys: ["offer.pillar3.b1", "offer.pillar3.b2", "offer.pillar3.b3", "offer.pillar3.b4", "offer.pillar3.b5"],
    href: "/sklepy-internetowe",
  },
  {
    titleKey: "offer.pillar4.title",
    descKey: "offer.pillar4.desc",
    exampleKey: "offer.pillar4.example",
    bulletKeys: ["offer.pillar4.b1", "offer.pillar4.b2", "offer.pillar4.b3", "offer.pillar4.b4", "offer.pillar4.b5"],
    href: "/strony-tracking-reklamy",
  },
];

export default function Offer() {
  const { t } = useI18n();

  return (
    <section className="relative bg-surface py-section">
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-24">
        <Reveal className="mb-12 max-w-3xl md:mb-16">
          <h1 className="font-headline text-4xl font-bold tracking-tighter text-on-surface md:text-7xl">
            {t("offer.title")}
          </h1>
          <p className="mt-6 text-lg font-light leading-relaxed text-on-surface/70 md:text-xl">
            {t("offer.lead")}
          </p>
        </Reveal>

        {/* Numbered list, so the numeral in the heading is decoration the
            screen reader can skip — the <ol> already carries the count. */}
        <ol role="list" className="flex flex-col gap-10 md:gap-14">
          {pillars.map((p, i) => (
            <li key={p.titleKey}>
              <Reveal
                delay={Math.min(i * 0.08, 0.3)}
                className="grid gap-8 border-t border-outline-variant/30 pt-10 md:pt-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16"
              >
                <div>
                  {/* Owner-editable: an empty <h2> still occupies a line box
                      at 36-40px and breaks the heading outline for screen
                      readers, so drop the element rather than render it blank. */}
                  {t(p.titleKey).trim() && (
                    <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
                      <span className="mr-2 text-on-surface-variant" aria-hidden="true">
                        {i + 1}.
                      </span>
                      {t(p.titleKey)}
                    </h2>
                  )}
                  <p className="mt-5 max-w-2xl text-base font-light leading-relaxed text-on-surface/70 md:text-lg">
                    {t(p.descKey)}
                  </p>
                  <Link
                    href={p.href}
                    className="mt-6 inline-flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-primary transition-all hover:gap-5"
                  >
                    {t("offer.seeExample")}: {t(p.exampleKey)}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
                <div className="rounded-3xl bg-card p-6 shadow-card md:p-8">
                  <ul className="flex flex-col gap-3.5">
                    {p.bulletKeys.map((k) => (
                      <li key={k} className="flex items-start gap-3 text-sm leading-relaxed text-on-surface/80 md:text-base">
                        <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {t(k)}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal className="mt-14 flex flex-col items-start gap-6 rounded-3xl bg-primary p-8 md:mt-20 md:flex-row md:items-center md:justify-between md:p-12">
          <h2 className="font-headline text-2xl font-bold tracking-tight text-on-primary md:text-4xl">
            {t("main.cta.primary")}
          </h2>
          <Link
            href="/kontakt#kontakt-main"
            className="inline-flex shrink-0 items-center gap-3 border-b border-on-primary/40 pb-1 text-sm font-medium uppercase tracking-widest text-on-primary transition-all hover:gap-5"
          >
            {t("nav.cta")} <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

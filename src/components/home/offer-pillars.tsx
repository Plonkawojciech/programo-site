"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import Reveal from "@/components/ui/reveal";

type TKey = Parameters<ReturnType<typeof useI18n>["t"]>[0];

const PILLARS: {
  number: string;
  href: string;
  titleKey: TKey;
  descKey: TKey;
  exampleKey: TKey;
}[] = [
  {
    number: "01",
    href: "/oferta",
    titleKey: "home.offer.p1.title",
    descKey: "home.offer.p1.desc",
    exampleKey: "home.offer.p1.example",
  },
  {
    number: "02",
    href: "/oferta",
    titleKey: "home.offer.p2.title",
    descKey: "home.offer.p2.desc",
    exampleKey: "home.offer.p2.example",
  },
  {
    number: "03",
    href: "/sklepy-internetowe",
    titleKey: "home.offer.p3.title",
    descKey: "home.offer.p3.desc",
    exampleKey: "home.offer.p3.example",
  },
  {
    number: "04",
    href: "/strony-tracking-reklamy",
    titleKey: "home.offer.p4.title",
    descKey: "home.offer.p4.desc",
    exampleKey: "home.offer.p4.example",
  },
];

export default function OfferPillars() {
  const { t } = useI18n();

  return (
    <section className="relative bg-surface py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <Reveal className="mb-14 max-w-3xl md:mb-20">
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-primary">
            {t("home.offer.eyebrow")}
          </p>
          <p className="mt-6 font-headline text-2xl md:text-4xl font-light leading-snug tracking-tight text-on-surface">
            {t("home.offer.intro")}
          </p>
        </Reveal>

        <div className="grid gap-x-10 gap-y-12 md:grid-cols-2">
          {PILLARS.map((p, i) => (
            <Reveal key={p.number} delay={(i % 2) * 0.1}>
              <Link
                href={p.href}
                className="group card-hover flex h-full flex-col gap-4 border-t border-outline-variant/30 pt-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
              >
                <span className="font-mono text-xs uppercase tracking-widest text-on-surface-variant transition-colors group-hover:text-primary">
                  {p.number}
                </span>
                <h3 className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-on-surface transition-colors group-hover:text-primary">
                  {t(p.titleKey)}
                </h3>
                <p className="text-base font-light leading-relaxed text-on-surface/70">
                  {t(p.descKey)}
                </p>
                <span className="mt-2 flex flex-col gap-1 border-l-2 border-primary/40 pl-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    {t("home.offer.exampleLabel")}
                  </span>
                  <span className="text-sm font-medium text-on-surface/80">
                    {t(p.exampleKey)}
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

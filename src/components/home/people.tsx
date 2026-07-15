"use client";

import { useI18n } from "@/lib/i18n";
import Reveal from "@/components/ui/reveal";

type TKey = Parameters<ReturnType<typeof useI18n>["t"]>[0];

const PEOPLE: {
  name: string;
  initials: string;
  roleKey: TKey;
  descKey: TKey;
  phoneDisplay: string;
  phoneHref: string;
}[] = [
  {
    name: "Wojciech Płonka",
    initials: "WP",
    roleKey: "home.people.wojtek.role",
    descKey: "home.people.wojtek.desc",
    phoneDisplay: "797 222 363",
    phoneHref: "tel:+48797222363",
  },
  {
    name: "Bartosz Kolaj",
    initials: "BK",
    roleKey: "home.people.bartosz.role",
    descKey: "home.people.bartosz.desc",
    phoneDisplay: "509 123 434",
    phoneHref: "tel:+48509123434",
  },
];

export default function People() {
  const { t } = useI18n();

  return (
    <section className="relative bg-surface py-24 md:py-32 border-t border-outline-variant/20">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <Reveal className="mb-14 max-w-3xl md:mb-20">
          <h2 className="font-headline text-3xl md:text-5xl font-bold tracking-tight text-on-surface">
            {t("home.people.title")}
          </h2>
          <p className="mt-6 text-lg font-light leading-relaxed text-on-surface/70">
            {t("home.people.intro")}
          </p>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2 md:gap-10">
          {PEOPLE.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.1}>
              <div className="flex h-full flex-col gap-6 rounded-3xl border border-outline-variant/40 bg-surface-container-low p-7 md:p-9">
                <div className="flex items-center gap-5">
                  <span
                    aria-hidden="true"
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/12 font-headline text-xl font-bold tracking-tight text-primary"
                  >
                    {p.initials}
                  </span>
                  <div>
                    <h3 className="font-headline text-2xl font-bold tracking-tight text-on-surface">
                      {p.name}
                    </h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-widest text-primary">
                      {t(p.roleKey)}
                    </p>
                  </div>
                </div>

                <p className="text-base font-light leading-relaxed text-on-surface/75">
                  {t(p.descKey)}
                </p>

                <div className="mt-auto border-t border-outline-variant/30 pt-6">
                  <a href={p.phoneHref} className="group flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      {t("home.people.phoneLabel")}
                    </span>
                    <span className="text-base font-medium text-on-surface transition-colors group-hover:text-primary">
                      {p.phoneDisplay}
                    </span>
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Both founders share one inbox — stated once here instead of repeating
            biuro@programo.pl under each card. */}
        <p className="mt-10 text-sm text-on-surface-variant md:mt-12">
          {t("home.people.sharedEmailLabel")}:{" "}
          <a
            href="mailto:biuro@programo.pl"
            className="font-medium text-on-surface underline decoration-on-surface-variant/40 underline-offset-4 transition-colors hover:text-primary"
          >
            biuro@programo.pl
          </a>
        </p>
      </div>
    </section>
  );
}

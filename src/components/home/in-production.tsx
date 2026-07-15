"use client";

import { useI18n } from "@/lib/i18n";
import Reveal from "@/components/ui/reveal";

export default function InProduction() {
  const { t } = useI18n();

  return (
    <section className="relative bg-primary text-on-primary">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24 py-14 md:py-16">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-center md:gap-10">
          <span className="flex shrink-0 items-center gap-2.5 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em]">
            <span aria-hidden="true" className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-on-primary/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-on-primary" />
            </span>
            {t("home.production.eyebrow")}
          </span>
          <p className="font-headline text-xl md:text-2xl font-medium leading-snug tracking-tight">
            {t("home.production.text")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

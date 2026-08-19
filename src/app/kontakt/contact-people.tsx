"use client";

import { useI18n } from "@/lib/i18n";
import Reveal from "@/components/ui/reveal";
import FounderCards from "@/components/founder-cards";

// /kontakt — twarze przed pełnym formularzem: "wiesz, kto odbierze telefon".
// Same kafle siedzą w `FounderCards`, bo ta sama para zdjęć jest też na /o-nas.
export default function ContactPeople() {
  const { t } = useI18n();

  return (
    <section className="bg-surface py-section-tight">
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-24">
        <Reveal className="max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-on-surface-variant">
            {t("contactPeople.eyebrow")}
          </span>
          <h2 className="mt-4 font-headline text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
            {t("contactPeople.title")}
          </h2>
        </Reveal>

        <div className="mt-10 md:mt-14">
          <FounderCards />
        </div>
      </div>
    </section>
  );
}

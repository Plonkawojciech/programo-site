"use client";

import { useI18n } from "@/lib/i18n";
import FounderCards from "@/components/founder-cards";

/**
 * Who answers the phone. Returned to the homepage on 2026-10-04: the earlier
 * Founders section (removed 2026-08-05) was two names over an empty block,
 * while this one carries the portraits and direct numbers from FounderCards,
 * the same component /o-nas and /kontakt render.
 */
export default function People() {
  const { t } = useI18n();
  return (
    <section className="bg-surface py-section-tight">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <div className="mb-10 max-w-2xl md:mb-14">
          <h2 className="font-headline text-h2 font-bold tracking-[-0.02em] text-on-surface text-balance">{t("home.people.title")}</h2>
          <p className="mt-4 text-lead leading-relaxed text-on-surface-variant text-pretty">{t("home.people.lead")}</p>
        </div>
        <div className="max-w-4xl">
          <FounderCards />
        </div>
      </div>
    </section>
  );
}

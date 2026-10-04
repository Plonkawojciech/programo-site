"use client";

import { useI18n, type TranslationKey } from "@/lib/i18n";
import { staggerItem } from "@/lib/motion";
import Reveal from "@/components/ui/reveal";

const steps: { titleKey: TranslationKey; descKey: TranslationKey }[] = [
  { titleKey: "home.process.1.title", descKey: "home.process.1.desc.v2" },
  { titleKey: "home.process.2.title", descKey: "home.process.2.desc.v2" },
  { titleKey: "home.process.3.title", descKey: "home.process.3.desc.v2" },
  { titleKey: "home.process.4.title", descKey: "home.process.4.desc.v2" },
];

export default function Process() {
  const { t } = useI18n();

  return (
    <section
      id="jak-pracujemy"
      aria-labelledby="process-heading"
      className="scroll-mt-24 bg-surface-container-low py-section-tight"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        {/* ---------- heading ---------- */}
        <Reveal
          as="h2"
          id="process-heading"
          y={12}
          className="max-w-2xl font-headline text-h2 tracking-[-0.02em] text-on-surface text-balance"
        >
          {t("home.process.title.v2")}
        </Reveal>

        {/* ---------- steps (ordered list — semantics match content) ---------- */}
        <ol
          className="mt-10 grid grid-cols-1 gap-y-8 gap-x-10 md:mt-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-x-12"
          role="list"
        >
          {steps.map((step, i) => (
            <Reveal
              as="li"
              key={step.titleKey}
              delay={i * staggerItem}
              y={14}
              className="flex flex-col gap-3"
            >
              <h3 className="font-headline text-h4 tracking-[-0.01em] text-on-surface">
                <span
                  className="mr-2 text-on-surface-variant"
                  aria-hidden="true"
                >
                  {i + 1}.
                </span>
                {t(step.titleKey)}
              </h3>
              <p className="max-w-[50ch] text-base leading-relaxed text-on-surface-variant text-pretty">
                {t(step.descKey)}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import Reveal from "@/components/ui/reveal";

type TKey = Parameters<ReturnType<typeof useI18n>["t"]>[0];

const ITEMS: { qKey: TKey; aKey: TKey }[] = [
  { qKey: "home.faq.q1", aKey: "home.faq.a1" },
  { qKey: "home.faq.q2", aKey: "home.faq.a2" },
  { qKey: "home.faq.q3", aKey: "home.faq.a3" },
  { qKey: "home.faq.q4", aKey: "home.faq.a4" },
  { qKey: "home.faq.q5", aKey: "home.faq.a5" },
];

export default function Faq() {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(0);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ITEMS.map((item) => ({
      "@type": "Question",
      name: t(item.qKey),
      acceptedAnswer: { "@type": "Answer", text: t(item.aKey) },
    })),
  };

  return (
    <section className="relative bg-surface py-24 md:py-32 border-t border-outline-variant/20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto max-w-[900px] px-6 md:px-12">
        <Reveal className="mb-12 md:mb-16">
          <h2 className="font-headline text-3xl md:text-5xl font-bold tracking-tight text-on-surface">
            {t("home.faq.title")}
          </h2>
        </Reveal>

        <div className="flex flex-col divide-y divide-outline-variant/30 border-t border-outline-variant/30">
          {ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.qKey} delay={(i % 3) * 0.06}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-trigger-${i}`}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                  >
                    <span className="font-headline text-xl md:text-2xl font-bold tracking-tight text-on-surface">
                      {t(item.qKey)}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-outline-variant/50 text-on-surface-variant transition-transform duration-300 ${
                        isOpen ? "rotate-45 border-primary text-primary" : ""
                      }`}
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  hidden={!isOpen}
                  className="pb-7"
                >
                  <p className="max-w-2xl text-base md:text-lg font-light leading-relaxed text-on-surface/75">
                    {t(item.aKey)}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

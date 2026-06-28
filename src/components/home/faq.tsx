"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { easeEntry, durationMedium, durationFast } from "@/lib/motion";

type TKey = Parameters<ReturnType<typeof useI18n>["t"]>[0];

const faqs: { q: TKey; a: TKey }[] = [
  { q: "home.faq.q1", a: "home.faq.a1" },
  { q: "home.faq.q2", a: "home.faq.a2" },
  { q: "home.faq.q3", a: "home.faq.a3" },
  { q: "home.faq.q4", a: "home.faq.a4" },
  { q: "home.faq.q5", a: "home.faq.a5" },
  { q: "home.faq.q6", a: "home.faq.a6" },
  { q: "home.faq.q7", a: "home.faq.a7" },
  { q: "home.faq.q8", a: "home.faq.a8" },
];

export default function Faq() {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative border-t border-outline-variant/20 bg-surface py-20 md:py-28 lg:py-32">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 md:px-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <motion.span
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: durationMedium, ease: easeEntry }}
            className="font-mono text-sm text-primary"
          >
            {t("home.faq.eyebrow")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: durationMedium, ease: easeEntry, delay: 0.05 }}
            className="mt-4 font-headline text-3xl font-bold tracking-[-0.02em] text-on-surface md:text-5xl text-balance"
          >
            {t("home.faq.title")}
          </motion.h2>
        </div>

        <ul className="flex flex-col">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            const panelId = `faq-panel-${i}`;
            const btnId = `faq-button-${i}`;
            return (
              <li key={item.q} className="border-b border-outline-variant/30 first:border-t">
                <h3>
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-primary"
                  >
                    <span className="font-headline text-lg font-bold tracking-tight text-on-surface md:text-xl">
                      {t(item.q)}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-outline-variant/50 text-on-surface-variant transition-transform duration-300 ease-out ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={btnId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: durationFast, ease: easeEntry }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[65ch] pb-6 text-base font-light leading-relaxed text-on-surface/70">
                        {t(item.a)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

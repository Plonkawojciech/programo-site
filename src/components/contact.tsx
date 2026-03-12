"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export default function Contact() {
  const { t } = useI18n();

  return (
    <section id="contact" className="bg-sage px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="mb-3 text-sm tracking-[0.2em] uppercase text-beige-light/50">
            {t("contact.label")}
          </p>
          <h2 className="font-serif text-4xl tracking-tight text-beige-light md:text-5xl lg:text-6xl">
            {t("contact.title1")}
            <br />
            {t("contact.title2")}
          </h2>
          <p className="mx-auto mt-6 max-w-md text-beige-light/60">
            {t("contact.desc")}
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <motion.a
              href="mailto:wojciech.plonka@programo.pl"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 rounded-full border border-beige-light/20 px-8 py-4 text-sm tracking-wide text-beige-light transition-all duration-300 hover:border-beige-light/40 hover:bg-beige-light/5"
            >
              <span>wojciech.plonka@programo.pl</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </motion.a>
            <motion.a
              href="mailto:bartosz.kolaj@programo.pl"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 rounded-full border border-beige-light/20 px-8 py-4 text-sm tracking-wide text-beige-light transition-all duration-300 hover:border-beige-light/40 hover:bg-beige-light/5"
            >
              <span>bartosz.kolaj@programo.pl</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}

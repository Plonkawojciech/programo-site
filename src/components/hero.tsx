"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 + i * 0.12,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center px-6 pt-20 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-6 text-sm tracking-[0.2em] uppercase text-sage-muted"
        >
          {t("hero.label")}
        </motion.p>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="font-serif text-[clamp(3rem,8vw,7rem)] leading-[0.95] tracking-tight text-sage"
        >
          Programo
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-8 max-w-xl text-lg leading-relaxed text-sage-muted md:text-xl"
        >
          {t("hero.desc")}
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-12 flex flex-wrap items-center gap-6"
        >
          <a
            href="#work"
            className="group inline-flex items-center gap-2 text-sm tracking-wide text-sage transition-opacity hover:opacity-70"
          >
            <span>{t("hero.browse")}</span>
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </a>
          <a
            href="#about"
            className="group inline-flex items-center gap-2 text-sm tracking-wide text-sage-muted transition-colors hover:text-sage"
          >
            <span>{t("hero.about")}</span>
          </a>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 text-sm tracking-wide text-sage-muted transition-colors hover:text-sage"
          >
            <span>{t("hero.contact")}</span>
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="h-10 w-[1px] bg-sage/20"
        />
      </motion.div>
    </section>
  );
}

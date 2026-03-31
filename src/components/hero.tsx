"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import MagneticWrapper from "@/components/magnetic";

export default function Hero() {
  const { t } = useI18n();
  const container = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const smoothY = useSpring(y, { damping: 20, stiffness: 100 });

  // Individual letter animation delays
  const programoLetters = ["P", "R", "O", "G", "R", "A"];
  const moLetters = ["M", "O"];

  return (
    <section
      ref={container}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#F0F0EC] px-6 pt-20"
    >
      <motion.div
        style={{ y: smoothY, opacity }}
        className="relative z-10 flex flex-col items-center text-center w-full"
      >
        {/* Massive headline */}
        <h1 className="relative flex flex-col items-center font-headline leading-[0.85] tracking-tighter text-[#0A0A0A]">
          {/* PROGRA */}
          <span className="flex overflow-hidden">
            {programoLetters.map((letter, i) => (
              <motion.span
                key={`p-${i}`}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 1.2,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.6 + i * 0.04,
                }}
                className="block text-[20vw] font-bold md:text-[18vw] lg:text-[16vw]"
              >
                {letter}
              </motion.span>
            ))}
          </span>

          {/* MO — italic coral */}
          <span className="flex overflow-hidden">
            {moLetters.map((letter, i) => (
              <motion.span
                key={`m-${i}`}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 1.2,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.6 + (programoLetters.length + i) * 0.04,
                }}
                className="block text-[20vw] font-bold italic text-primary md:text-[18vw] lg:text-[16vw]"
              >
                {letter}
              </motion.span>
            ))}
          </span>
        </h1>

        {/* Description — small, wide tracking */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.4 }}
          className="mt-12 max-w-md text-[13px] font-light uppercase leading-relaxed tracking-[0.3em] text-on-surface-variant md:mt-16 md:text-sm"
        >
          {t("hero.desc")}
        </motion.p>

        {/* CTA circle button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="mt-16"
        >
          <MagneticWrapper strength={0.5}>
            <a
              href="#work"
              className="group relative flex h-36 w-36 items-center justify-center rounded-full border border-on-surface/20 text-[11px] font-bold uppercase tracking-[0.3em] text-on-surface transition-all duration-500 hover:border-primary hover:text-primary md:h-44 md:w-44"
            >
              <span className="relative z-10">{t("hero.browse")}</span>
            </a>
          </MagneticWrapper>
        </motion.div>
      </motion.div>

      {/* Rotating circular badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-20 right-8 md:bottom-16 md:right-16 lg:right-24"
      >
        <svg
          className="h-24 w-24 animate-spin-slow md:h-32 md:w-32"
          viewBox="0 0 200 200"
        >
          <defs>
            <path
              id="circlePath"
              d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
            />
          </defs>
          <text className="fill-on-surface/40 text-[15px] font-medium uppercase tracking-[0.4em]">
            <textPath href="#circlePath">
              Software Studio &bull; Poznan &bull; Est. 2026 &bull;&nbsp;
            </textPath>
          </text>
        </svg>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-on-surface-variant/50">
            Scroll
          </span>
          <motion.span
            className="block text-on-surface-variant/50 text-lg animate-bounce-arrow"
          >
            &darr;
          </motion.span>
        </div>
      </motion.div>
    </section>
  );
}

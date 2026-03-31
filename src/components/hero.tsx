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

  const y = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const smoothY = useSpring(y, { damping: 20, stiffness: 100 });

  // Word-by-word description animation
  const descWords = t("hero.desc").split(" ");

  return (
    <section
      ref={container}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20"
    >
      {/* Gradient Mesh Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Cyan orb top-left */}
        <div className="mesh-orb-1 absolute -top-[20%] -left-[10%] h-[60vh] w-[60vh] rounded-full bg-[#00E5FF]/[0.06] blur-[120px]" />
        {/* Amber orb bottom-right */}
        <div className="mesh-orb-2 absolute -bottom-[20%] -right-[10%] h-[50vh] w-[50vh] rounded-full bg-[#FFB800]/[0.05] blur-[120px]" />
        {/* Subtle center glow */}
        <div className="mesh-orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[40vh] w-[40vh] rounded-full bg-[#00E5FF]/[0.03] blur-[100px]" />
      </div>

      <motion.div
        style={{ y: smoothY, scale, opacity }}
        className="relative z-10 flex flex-col items-center text-center w-full max-w-[2560px] px-6"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-6 text-xs 2xl:text-sm font-bold uppercase tracking-[0.4em] text-primary"
        >
          {t("hero.label")}
        </motion.span>

        <h1 className="relative flex flex-col items-center font-headline text-[20vw] font-bold leading-[0.85] tracking-tighter text-on-surface md:text-[17vw] lg:text-[15vw] 2xl:text-[13vw] min-[2560px]:text-[300px]">
          <span className="overflow-hidden w-full text-center">
            <motion.span
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: "inset(0 0 0 0)" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              className="block"
            >
              PROGRA
            </motion.span>
          </span>
          <span className="overflow-hidden w-full text-center">
            <motion.span
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: "inset(0 0 0 0)" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
              className="block italic text-primary"
            >
              MO
            </motion.span>
          </span>
        </h1>

        {/* Word-by-word description */}
        <div className="mt-12 md:mt-16 max-w-[90vw] md:max-w-lg 2xl:max-w-2xl flex flex-wrap justify-center gap-x-[0.35em]">
          {descWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              className="text-base font-light leading-relaxed text-on-surface-variant md:text-xl 2xl:text-2xl"
            >
              {word}
            </motion.span>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="mt-16 2xl:mt-24 flex flex-wrap justify-center gap-8"
        >
          <MagneticWrapper strength={0.5}>
            <a
              href="#work"
              className="group relative flex h-40 w-40 2xl:h-48 2xl:w-48 items-center justify-center rounded-full border border-primary/40 text-sm 2xl:text-base font-bold uppercase tracking-widest text-on-surface transition-all duration-500 hover:bg-primary hover:text-surface hover:border-primary"
            >
              <span className="relative z-10">{t("hero.browse")}</span>
            </a>
          </MagneticWrapper>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator — thin animated line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/40">
            Scroll
          </span>
          <div className="scroll-indicator w-[1px] bg-gradient-to-b from-primary/80 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}

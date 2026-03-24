"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import dynamic from "next/dynamic";
import { useI18n } from "@/lib/i18n";
import MagneticWrapper from "@/components/magnetic";

const HeroBackground3D = dynamic(() => import("@/components/ui/hero-background-3d"), {
  ssr: false,
});

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
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -5]);

  const smoothY = useSpring(y, { damping: 20, stiffness: 100 });

  return (
    <section
      ref={container}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20 bg-transparent"
    >
      <HeroBackground3D />

      <motion.div
        style={{ y: smoothY, scale, opacity, rotateX: rotate }}
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

        <h1 className="relative flex flex-col items-center font-headline text-[18vw] font-bold leading-[0.8] tracking-tighter text-on-surface md:text-[13vw] lg:text-[11vw] 2xl:text-[9vw] min-[2560px]:text-[220px]">
          <span className="overflow-hidden w-full text-center">
            <motion.span
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              className="block"
            >
              PROGRA
            </motion.span>
          </span>
          <span className="overflow-hidden w-full text-center md:text-right md:pr-[10%] 2xl:pr-[15%]">
            <motion.span
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
              className="block italic text-primary"
            >
              MO
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="mt-12 md:mt-16 max-w-[90vw] md:max-w-lg 2xl:max-w-2xl text-base font-light leading-relaxed text-on-surface-variant md:text-xl 2xl:text-2xl"
        >
          {t("hero.desc")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-16 2xl:mt-24 flex flex-wrap justify-center gap-8"
        >
          <MagneticWrapper strength={0.5}>
            <a
              href="#work"
              className="group relative flex h-40 w-40 2xl:h-48 2xl:w-48 items-center justify-center rounded-full border border-primary/40 text-sm 2xl:text-base font-bold uppercase tracking-widest text-on-surface transition-colors hover:bg-primary hover:text-white"
            >
              <span className="relative z-10">{t("hero.browse")}</span>
            </a>
          </MagneticWrapper>
        </motion.div>
      </motion.div>

      {/* Scroll Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/60">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="h-12 w-[1px] bg-gradient-to-b from-primary/80 to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
}

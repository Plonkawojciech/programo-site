"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useI18n } from "@/lib/i18n";

function WordByWordReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <span className="inline">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block mr-[0.35em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero() {
  const { t } = useI18n();
  const container = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const smoothY = useSpring(y, { damping: 20, stiffness: 100 });

  const badgeText = "Software Studio \u2022 Pozna\u0144 \u2022 Est. 2026 \u2022 ";

  return (
    <section
      ref={container}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20 bg-dark"
    >
      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Coral orb */}
        <div
          className="orb-coral absolute top-[20%] left-[15%] w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full opacity-[0.08]"
          style={{
            background: "radial-gradient(circle, #FF3D00 0%, transparent 70%)",
          }}
        />
        {/* Cool blue orb */}
        <div
          className="orb-blue absolute bottom-[10%] right-[10%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full opacity-[0.06]"
          style={{
            background: "radial-gradient(circle, #3D5AFE 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Section number */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute top-8 left-8 text-[11px] font-medium tracking-[0.2em] text-coral z-20"
      >
        01
      </motion.span>

      <motion.div
        style={{ y: smoothY, scale, opacity }}
        className="relative z-10 flex flex-col items-center text-center w-full max-w-[2560px] px-6"
      >
        {/* Massive headline */}
        <h1 className="relative flex flex-col items-center font-headline text-[22vw] font-bold leading-[0.85] tracking-tighter text-text md:text-[20vw] lg:text-[18vw] 2xl:text-[16vw]">
          <span className="overflow-hidden w-full text-center">
            <motion.span
              initial={{ y: "120%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.6,
              }}
              className="block"
            >
              {"PROGRA".split("").map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "120%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 1,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.6 + i * 0.04,
                  }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
            </motion.span>
          </span>
          <span className="overflow-hidden w-full text-center">
            <motion.span
              initial={{ y: "120%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.85,
              }}
              className="block italic text-coral"
            >
              {"MO".split("").map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "120%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 1,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.85 + i * 0.04,
                  }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
            </motion.span>
          </span>
        </h1>

        {/* Description - word by word */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1, delay: 1.2 }}
          className="mt-12 md:mt-16 max-w-[90vw] md:max-w-md text-[13px] md:text-sm font-light leading-relaxed text-text-muted tracking-[0.15em] uppercase"
        >
          <WordByWordReveal text={t("hero.desc")} delay={1.3} />
        </motion.div>
      </motion.div>

      {/* Rotating SVG circular badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute right-8 md:right-16 lg:right-24 top-1/2 -translate-y-1/2 z-20"
      >
        <svg
          className="animate-spin-slow w-28 h-28 md:w-36 md:h-36"
          viewBox="0 0 200 200"
        >
          <defs>
            <path
              id="circlePath"
              d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
            />
          </defs>
          <text className="fill-text-muted text-[14px] uppercase tracking-[0.4em]">
            <textPath href="#circlePath">{badgeText}{badgeText}</textPath>
          </text>
        </svg>
      </motion.div>

      {/* Scroll Hint — coral pulsing line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-4">
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-text-muted/60">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="h-12 w-[1px] pulse-line"
            style={{
              background: "linear-gradient(to bottom, #FF3D00, transparent)",
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}

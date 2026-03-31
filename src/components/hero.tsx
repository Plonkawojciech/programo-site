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

  // Split description into words for sequential fade
  const descText = t("hero.desc");
  const words = descText.split(" ");

  return (
    <section
      ref={container}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20"
      style={{ backgroundColor: "#0A0808" }}
    >
      {/* Floating gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Gold orb */}
        <div
          className="absolute top-1/4 left-1/3 h-[500px] w-[500px] rounded-full animate-float-slow md:h-[800px] md:w-[800px]"
          style={{
            background: "radial-gradient(circle, rgba(200,164,78,0.08) 0%, transparent 70%)",
          }}
        />
        {/* Blue orb */}
        <div
          className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full animate-float-slow-reverse md:h-[700px] md:w-[700px]"
          style={{
            background: "radial-gradient(circle, rgba(42,58,92,0.05) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Thin horizontal gold line — full width */}
      <div
        className="absolute top-1/2 left-0 w-full h-[1px]"
        style={{ backgroundColor: "rgba(200, 164, 78, 0.02)" }}
      />

      {/* Section marker */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute top-32 left-6 md:left-10 font-headline text-xs italic"
        style={{ color: "#C8A44E", letterSpacing: "0.3em" }}
      >
        I
      </motion.span>

      <motion.div
        style={{ y: smoothY, scale, opacity }}
        className="relative z-10 flex flex-col items-center text-center w-full max-w-[2560px] px-6"
      >
        {/* PROGRAMO — massive Newsreader italic, gold, clip-path reveal */}
        <div className="overflow-hidden">
          <motion.h1
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            className="font-headline text-[18vw] font-bold italic leading-[0.85] tracking-tighter md:text-[15vw] lg:text-[13vw] 2xl:text-[11vw] min-[2560px]:text-[280px]"
            style={{ color: "#C8A44E" }}
          >
            PROGRAMO
          </motion.h1>
        </div>

        {/* Description — each word fades in sequentially */}
        <motion.p
          className="mt-12 md:mt-16 max-w-[90vw] md:max-w-lg 2xl:max-w-2xl text-base font-light leading-relaxed md:text-xl 2xl:text-2xl"
          style={{ color: "#8A8278" }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 1.2 + i * 0.04,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block mr-[0.3em]"
            >
              {word}
            </motion.span>
          ))}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.0 }}
          className="mt-16 2xl:mt-24"
        >
          <MagneticWrapper strength={0.5}>
            <a
              href="#work"
              className="group relative flex h-36 w-36 2xl:h-44 2xl:w-44 items-center justify-center rounded-full border text-[11px] 2xl:text-xs font-medium uppercase transition-all duration-500"
              style={{
                borderColor: "rgba(200, 164, 78, 0.3)",
                color: "#E8E0D0",
                letterSpacing: "0.3em",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#C8A44E";
                e.currentTarget.style.color = "#0A0808";
                e.currentTarget.style.borderColor = "#C8A44E";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#E8E0D0";
                e.currentTarget.style.borderColor = "rgba(200, 164, 78, 0.3)";
              }}
            >
              <span className="relative z-10">{t("hero.browse")}</span>
            </a>
          </MagneticWrapper>
        </motion.div>
      </motion.div>

      {/* Scroll indicator — gold circle with bouncing dot */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-4">
          <span
            className="text-[10px] font-medium uppercase"
            style={{ color: "#8A8278", letterSpacing: "0.3em" }}
          >
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="relative flex items-center justify-center"
          >
            <div
              className="h-8 w-8 rounded-full border"
              style={{ borderColor: "rgba(200, 164, 78, 0.3)" }}
            />
            <div
              className="absolute h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "#C8A44E" }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

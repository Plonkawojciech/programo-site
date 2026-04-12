"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function HorizontalIntro() {
  const container = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, { damping: 40, stiffness: 80 });

  // Use the wider range for desktop, narrower for mobile via CSS layout
  const xMain = useTransform(smoothProgress, [0, 1], ["0vw", "-130vw"]);
  const xBg = useTransform(smoothProgress, [0, 1], ["0vw", "-60vw"]);
  const xFg = useTransform(smoothProgress, [0, 1], ["0vw", "-300vw"]);
  const introOpacity = useTransform(smoothProgress, [0.85, 1], [1, 0]);
  const manifestoY = useTransform(smoothProgress, [0, 1], ["10%", "-10%"]);

  const programoLetters = "programo".split("");

  return (
    <section
      ref={container}
      className="relative bg-[var(--theme-bg-1)] cursor-default text-[var(--theme-text-1)] h-[200vh] md:h-[250vh]"
    >
      <motion.div
        style={{ opacity: introOpacity, contain: "layout style paint" }}
        className="sticky top-0 flex h-screen w-full items-center overflow-hidden"
      >
        {/* Background text (slow) */}
        <motion.div
          style={{ x: xBg }}
          className="absolute top-[15%] left-0 flex whitespace-nowrap opacity-[0.03] pointer-events-none select-none z-0 transform-gpu will-change-transform"
        >
          <span className="text-[30vw] md:text-[25vw] font-serif italic tracking-tighter leading-none text-[var(--theme-text-1)]">
            digital craftsmanship digital craftsmanship
          </span>
        </motion.div>

        {/* Main content track */}
        <motion.div
          style={{ x: xMain }}
          className="relative z-10 flex items-center h-full px-[8vw] md:px-[10vw] 2xl:px-[12vw] gap-[15vw] md:gap-[20vw] whitespace-nowrap transform-gpu will-change-transform"
        >
          {/* Title block — individual letter animations */}
          <div className="flex flex-col relative shrink-0">
            <h1 className="text-[18vw] md:text-[15vw] 2xl:text-[12vw] font-sans font-light tracking-tighter leading-none text-[var(--theme-text-1)] flex">
              {programoLetters.map((letter, i) => (
                <span
                  key={i}
                  className="inline-block animate-letterReveal"
                  style={{
                    animationDelay: `${0.3 + i * 0.08}s`,
                    animationFillMode: "both",
                  }}
                >
                  {letter}
                </span>
              ))}
            </h1>
            <p className="text-[var(--theme-text-2)] font-mono text-sm md:text-xl uppercase tracking-[0.5em] ml-2 mt-4 animate-fadeSlideIn" style={{ animationDelay: "1s", animationFillMode: "both" }}>
              Software Engineering
            </p>
          </div>

          {/* Manifesto block — subtle vertical parallax */}
          <motion.div style={{ y: manifestoY }} className="relative shrink-0 flex flex-col gap-6">
            <div className="w-48 md:w-64 h-[2px] bg-[var(--theme-border-1)] relative overflow-hidden">
              <motion.div
                className="absolute top-0 bottom-0 left-0 w-1/3 bg-[var(--theme-accent)] transform-gpu"
                animate={{ x: ["-100%", "300%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <h2 className="text-[8vw] md:text-[6vw] 2xl:text-[5vw] font-sans font-black tracking-tighter text-[var(--theme-text-1)] uppercase leading-none whitespace-normal max-w-[50vw] md:max-w-[30vw]">
              Digital<br />Precision
            </h2>
            <p className="text-[var(--theme-text-2)] font-mono text-xs md:text-sm uppercase tracking-[0.3em] whitespace-normal max-w-[40vw] md:max-w-[25vw]">
              Budujemy kompletne systemy software&apos;owe z chirurgiczn&#261; precyzj&#261;.
            </p>
          </motion.div>
        </motion.div>

        {/* Foreground ticker (fast) — more energetic with glow */}
        <motion.div
          style={{ x: xFg }}
          className="absolute bottom-8 md:bottom-12 left-0 flex whitespace-nowrap z-30 opacity-50 text-[var(--theme-text-2)] font-mono text-lg md:text-2xl tracking-[0.3em] md:tracking-[0.5em] transform-gpu will-change-transform"
        >
          {[...Array(8)].map((_, i) => (
            <span key={i} className="mx-6 md:mx-10 animate-tickerPulse" style={{ animationDelay: `${i * 0.3}s` }}>
              SCROLL TO EXPLORE // INIT.SEQUENCE // ENTER_SYSTEM //
            </span>
          ))}
        </motion.div>

        {/* Scroll hint (mobile only) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none md:hidden">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[var(--theme-text-2)]/50">
              scroll
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="h-6 w-px bg-[var(--theme-accent)]/30"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

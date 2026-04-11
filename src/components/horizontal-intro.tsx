"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function HorizontalIntro() {
  const container = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, { damping: 40, stiffness: 80 });

  const xMain = useTransform(smoothProgress, [0, 1], ["0vw", isMobile ? "-150vw" : "-120vw"]);
  const xBg = useTransform(smoothProgress, [0, 1], ["0vw", "-60vw"]);
  const xFg = useTransform(smoothProgress, [0, 1], ["0vw", "-300vw"]);
  const introOpacity = useTransform(smoothProgress, [0.85, 1], [1, 0]);

  return (
    <section
      ref={container}
      className="relative bg-[#051F20] cursor-default text-[#DAF1DE]"
      style={{ height: isMobile ? "200vh" : "250vh" }}
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
          <span className="text-[30vw] md:text-[25vw] font-serif italic tracking-tighter leading-none text-[#DAF1DE]">
            digital craftsmanship digital craftsmanship
          </span>
        </motion.div>

        {/* Main content track */}
        <motion.div
          style={{ x: xMain }}
          className="relative z-10 flex items-center h-full px-[8vw] md:px-[10vw] 2xl:px-[12vw] gap-[15vw] md:gap-[20vw] whitespace-nowrap transform-gpu will-change-transform"
        >
          {/* Title block */}
          <div className="flex flex-col relative shrink-0">
            <h1 className="text-[18vw] md:text-[15vw] 2xl:text-[12vw] font-sans font-light tracking-tighter leading-none text-[#DAF1DE]">
              programo
            </h1>
            <p className="text-[#8EB69B] font-mono text-sm md:text-xl uppercase tracking-[0.5em] ml-2 mt-4">
              Software Engineering
            </p>
          </div>

          {/* Manifesto block */}
          <div className="relative shrink-0 flex flex-col gap-6">
            <div className="w-48 md:w-64 h-[2px] bg-[#163832] relative overflow-hidden">
              <motion.div
                className="absolute top-0 bottom-0 left-0 w-1/3 bg-[#8EB69B] transform-gpu"
                animate={{ x: ["-100%", "300%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <h2 className="text-[8vw] md:text-[6vw] 2xl:text-[5vw] font-sans font-black tracking-tighter text-[#DAF1DE] uppercase leading-none whitespace-normal max-w-[50vw] md:max-w-[30vw]">
              Digital<br />Precision
            </h2>
            <p className="text-[#8EB69B] font-mono text-xs md:text-sm uppercase tracking-[0.3em] whitespace-normal max-w-[40vw] md:max-w-[25vw]">
              Budujemy kompletne systemy software&apos;owe z chirurgiczn&#261; precyzj&#261;.
            </p>
          </div>
        </motion.div>

        {/* Foreground ticker (fast) */}
        <motion.div
          style={{ x: xFg }}
          className="absolute bottom-8 md:bottom-12 left-0 flex whitespace-nowrap z-30 opacity-40 text-[#8EB69B] font-mono text-lg md:text-2xl tracking-[0.3em] md:tracking-[0.5em] transform-gpu will-change-transform"
        >
          {[...Array(5)].map((_, i) => (
            <span key={i} className="mx-8 md:mx-12">
              SCROLL TO EXPLORE // INIT.SEQUENCE // ENTER_SYSTEM //
            </span>
          ))}
        </motion.div>

        {/* Scroll hint (mobile only) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none md:hidden">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#8EB69B]/50">
              scroll
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="h-6 w-px bg-[#8EB69B]/30"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

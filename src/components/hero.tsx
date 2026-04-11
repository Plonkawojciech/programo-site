"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function Hero() {
  const container = useRef<HTMLElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
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

  // Horizontal tracks
  const xMain = useTransform(smoothProgress, [0, 1], ["0vw", "-200vw"]);
  const xBg = useTransform(smoothProgress, [0, 1], ["0vw", "-80vw"]);

  // Business card transforms
  const cardRotate = useTransform(smoothProgress, [0.1, 0.5], [8, -8]);
  const cardY = useTransform(smoothProgress, [0.1, 0.5], [0, 80]);

  // Scroll hint opacity — must be at top level
  const scrollHintOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);

  return (
    <section
      ref={container}
      className="relative h-[300vh] bg-[#FAF8F4] cursor-default text-[#1A1816]"
    >
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden" style={{ contain: "layout style paint" }}>

        {/* Soft Liquid Orbs */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "10%", "-5%", "0%"], y: ["0%", "-10%", "5%", "0%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-15%] left-[-5%] w-[50vw] h-[50vw] rounded-full bg-[#8EB69B]/15 blur-[40px] will-change-transform transform-gpu"
          />
          <motion.div
            animate={{ x: ["0%", "-10%", "8%", "0%"], y: ["0%", "12%", "-8%", "0%"] }}
            transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[30%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-[#C4A876]/10 blur-[40px] will-change-transform transform-gpu"
          />
          <motion.div
            animate={{ x: ["0%", "8%", "-12%", "0%"], y: ["0%", "5%", "-10%", "0%"] }}
            transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-10%] left-[25%] w-[45vw] h-[45vw] rounded-full bg-[#E8F0EA]/30 blur-[40px] will-change-transform transform-gpu"
          />
        </div>

        {/* Background text layer (slow) */}
        <motion.div
          style={{ x: xBg }}
          className="absolute top-[15%] left-0 flex whitespace-nowrap opacity-[0.03] pointer-events-none select-none z-0 transform-gpu will-change-transform"
        >
          <h1 className="text-[30vw] font-serif italic tracking-tighter leading-none text-[#1A1816]">
            digital craftsmanship digital craftsmanship
          </h1>
        </motion.div>

        {/* Main horizontal track */}
        <motion.div
          style={{ x: xMain }}
          className="relative z-10 flex items-center h-full px-[10vw] 2xl:px-[15vw] gap-[15vw] 2xl:gap-[20vw] whitespace-nowrap transform-gpu will-change-transform"
        >
          {/* 1. Title */}
          <div className="flex flex-col relative shrink-0">
            <h1 className="text-[14vw] font-sans font-light tracking-tighter leading-none text-[#1A1816]">
              programo
            </h1>
            <p className="text-[#6B6560] font-mono text-sm md:text-lg uppercase tracking-[0.5em] ml-2 mt-4">
              Software Engineering
            </p>
            <div className="mt-8 flex gap-4">
              <div className="h-px w-20 bg-[#8EB69B] mt-3" />
              <p className="text-[#6B6560] text-sm font-light max-w-[300px] whitespace-normal">
                Projektujemy i budujemy oprogramowanie, kt&oacute;re rozwiazuje realne problemy.
              </p>
            </div>
          </div>

          {/* 2. Glass Business Card */}
          <div className="relative shrink-0 w-[50vw] h-[60vh] flex items-center justify-center">
            {isMounted && (
              <motion.div
                style={{ rotate: isMobile ? 0 : cardRotate, y: isMobile ? 0 : cardY }}
                className="relative z-20 w-[85vw] md:w-[520px] 2xl:w-[640px] aspect-[1.6/1] transform-gpu will-change-transform"
              >
                {/* Glass card */}
                <div className="absolute inset-0 bg-white/70 md:backdrop-blur-[12px] rounded-2xl shadow-[0_20px_50px_rgba(26,24,22,0.08),0_0_0_1px_rgba(26,24,22,0.04)] overflow-hidden">
                  {/* Paper texture */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                       style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

                  {/* Top reflection */}
                  <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

                  <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-[#1A1816] text-2xl md:text-3xl font-bold tracking-tight uppercase">Programo</h2>
                        <p className="text-[#6B6560] text-[10px] mt-1 uppercase tracking-[0.3em] font-mono">Software Studio &middot; Poznan</p>
                      </div>
                      <div className="text-[#1A1816] font-bold text-xl tracking-tight flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#8EB69B] animate-pulse" />
                        pr.
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col gap-1 text-[#6B6560] text-[9px] md:text-[11px] font-mono uppercase tracking-wide">
                        <span>NIP: 7792604466</span>
                        <span>kontakt@programo.pl</span>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-[#FAF8F4] border border-[#E5E0D5] flex items-center justify-center">
                        <span className="text-[#8EB69B] font-bold text-lg">P</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* 3. Manifesto */}
          <div className="relative shrink-0 w-[40vw] flex flex-col gap-6">
            <div className="w-full h-px bg-[#E5E0D5] relative overflow-hidden">
              <motion.div className="absolute top-0 bottom-0 left-0 w-1/4 bg-[#8EB69B]" animate={{ x: ["-100%", "400%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
            </div>
            <h2 className="text-[8vw] 2xl:text-[10vw] font-sans font-light tracking-tighter text-[#1A1816] leading-none">
              Clean<br/>Code.
            </h2>
            <p className="text-[#6B6560] font-sans text-sm uppercase tracking-[0.3em] max-w-xs whitespace-normal">
              High-performance digital products built with precision and care.
            </p>
          </div>
        </motion.div>

        {/* Scroll Hint */}
        <motion.div
          style={{ opacity: scrollHintOpacity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
        >
          <div className="flex flex-col items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#6B6560]/60">Scroll</span>
            <motion.div animate={{ y: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }} className="h-10 w-px bg-[#8EB69B]/40" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

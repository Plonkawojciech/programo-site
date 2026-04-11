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

  const xMain = useTransform(smoothProgress, [0, 1], ["0vw", isMobile ? "-450vw" : "-250vw"]);
  const xBg = useTransform(smoothProgress, [0, 1], ["0vw", "-100vw"]);
  const xFg = useTransform(smoothProgress, [0, 1], ["0vw", "-400vw"]);

  const bgCardY = useTransform(smoothProgress, [0, 1], [-100, 200]);
  const cardRotate = useTransform(smoothProgress, [0, 1], [10, -30]);
  const cardY = useTransform(smoothProgress, [0, 1], [0, 300]);
  
  // No random in render, using a deterministic sequence
  const qrPattern = [1,0,1,1, 0,1,1,0, 1,1,0,1, 0,1,0,1];

  return (
    <section
      ref={container}
      className="relative h-[400vh] bg-[#051F20] cursor-default text-[#DAF1DE]"
    >
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden" style={{ contain: 'layout style paint' }}>
        
        {/* Massive Background Text */}
        <motion.div 
          style={{ x: xBg }}
          className="absolute top-[10%] left-0 flex whitespace-nowrap opacity-[0.03] pointer-events-none select-none z-0 transform-gpu will-change-transform"
        >
          <h1 className="text-[35vw] font-serif italic tracking-tighter leading-none text-[#DAF1DE]">
            digital craftsmanship digital craftsmanship digital craftsmanship
          </h1>
        </motion.div>

        {/* Main Horizontal Track */}
        <motion.div 
          style={{ x: xMain }}
          className="relative z-10 flex items-center h-full px-[10vw] 2xl:px-[15vw] gap-[20vw] 2xl:gap-[25vw] whitespace-nowrap transform-gpu will-change-transform"
        >
          {/* 1. Intro Typography */}
          <div className="flex flex-col relative shrink-0 transform-gpu will-change-[transform,opacity]">
            <h1 className="text-[15vw] 2xl:text-[12vw] font-sans font-light tracking-tighter leading-none text-[#DAF1DE] mix-blend-difference">
              programo
            </h1>
            <p className="text-[#8EB69B] font-mono text-xl md:text-3xl uppercase tracking-[0.5em] ml-2 mt-4">
              Software Engineering
            </p>
          </div>

          {/* 2. Abstract Geometric Composition & Card */}
          <div className="relative shrink-0 w-[60vw] h-[60vh] flex items-center justify-center transform-gpu will-change-transform">
            
            <motion.div 
              style={{ y: isMobile ? 0 : bgCardY, rotate: isMobile ? 0 : 5 }}
              className="absolute w-[40vw] h-[50vh] bg-[#0A2A28] border border-[#163832] right-0 top-0 opacity-80 z-0 flex items-end p-8 transform-gpu will-change-[transform,opacity]"
            >
              <h3 className="text-[#8EB69B] font-serif text-[8vw] italic leading-none opacity-50">engineering</h3>
            </motion.div>

            {/* Business Card Overlay */}
            {isMounted && (
              <motion.div 
                style={{ rotate: isMobile ? 0 : cardRotate, y: isMobile ? 0 : cardY }}
                className="absolute z-20 left-[10%] w-[90vw] md:w-[600px] 2xl:w-[700px] aspect-[1.6/1] bg-[#DAF1DE] rounded-2xl p-8 md:p-12 shadow-2xl border border-[#163832]/20 flex flex-col justify-between transform-gpu will-change-[transform,opacity]"
              >
                <div className="flex justify-between items-start">
                  <div className="max-w-[70%]">
                    <h2 className="text-[#051F20] text-3xl md:text-5xl font-bold font-sans tracking-tight uppercase">Programo</h2>
                    <p className="text-[#163832] text-sm md:text-base mt-2 uppercase tracking-widest font-mono">Enterprise Solutions</p>
                  </div>
                  <div className="text-[#051F20] font-bold text-2xl tracking-tight flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#163832] animate-pulse" />
                    pr.
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div className="flex flex-col gap-1 text-[#163832] text-sm font-mono uppercase tracking-wide">
                    <span>NIP: 7792604466</span>
                    <span>KRS: 0001233841</span>
                    <span>Poznań, PL</span>
                    <span className="mt-2 text-[#051F20] font-bold normal-case text-xl md:text-2xl">kontakt@programo.pl</span>
                  </div>
                  
                  {/* Decorative QR-like grid */}
                  <div className="grid grid-cols-4 grid-rows-4 gap-1 w-20 h-20 bg-[#051F20]/5 p-1 rounded-sm border border-[#051F20]/10">
                    {qrPattern.map((isActive, i) => (
                      <div key={i} className={`w-full h-full rounded-[2px] ${isActive ? 'bg-[#051F20]' : 'bg-transparent'}`} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* 3. Tech Specs Module */}
          <div className="relative shrink-0 w-[50vw] flex flex-col gap-8 transform-gpu">
            <div className="w-full h-[2px] bg-[#163832] relative overflow-hidden">
               <motion.div className="absolute top-0 bottom-0 left-0 w-1/3 bg-[#8EB69B] transform-gpu" animate={{ x: ["-100%", "300%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
            </div>
            <h2 className="text-[10vw] 2xl:text-[10vw] font-sans font-black tracking-tighter text-[#DAF1DE] uppercase leading-none mix-blend-difference">
              Systems<br/>Online
            </h2>
            <div className="flex gap-8 font-mono text-xl text-[#8EB69B] uppercase tracking-widest">
              <span>// Architecture</span>
              <span>// Data Ops</span>
              <span>// Scale</span>
            </div>
          </div>
          
        </motion.div>

        {/* Foreground fast moving ticker */}
        <motion.div 
          style={{ x: xFg }}
          className="absolute bottom-12 left-0 flex whitespace-nowrap z-30 opacity-60 text-[#8EB69B] font-mono text-2xl tracking-[0.5em] transform-gpu will-change-transform"
        >
           {[...Array(5)].map((_, i) => (
             <span key={i} className="mx-12">SCROLL TO EXPLORE // INIT.SEQUENCE // HORIZONTAL_TRACK_ACTIVE //</span>
           ))}
        </motion.div>
      </div>
    </section>
  );
}

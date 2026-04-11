"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";

const qrPattern = [
  1, 0, 1, 1, 0,
  1, 1, 0, 1, 1,
  0, 1, 1, 0, 0,
  1, 0, 0, 1, 1,
  0, 1, 1, 1, 0
];

export default function Hero() {
  const container = useRef<HTMLElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"],
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 2; 
    const y = (clientY / innerHeight - 0.5) * 2; 
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [15, -15]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-15, 15]), { stiffness: 100, damping: 30 });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section
      ref={container}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#051F20]"
    >
      <motion.div 
        style={{ y, opacity }} 
        className="relative z-10 flex flex-col items-center justify-center w-full max-w-[2560px] px-6"
      >
        {/* Title */}
        <motion.div style={{ y: titleY }} className="z-0 mb-16 md:mb-24">
          <motion.h1 
            className="text-[12vw] md:text-[8vw] lg:text-[120px] font-sans font-light text-[#DAF1DE] tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            programo
          </motion.h1>
        </motion.div>

        {/* 3D Cards Container */}
        {isMounted && (
          <div className="relative w-full max-w-[340px] md:max-w-[480px] aspect-[1.6/1] z-10" style={{ perspective: "1500px" }}>
            <motion.div
              className="w-full h-full relative will-change-transform transform-gpu"
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            >
              {/* Card 1: Back */}
              <motion.div 
                className="absolute inset-0 bg-[#0A2A28] rounded-xl shadow-lg flex items-center justify-center border border-[#163832] will-change-transform transform-gpu"
                style={{
                  transform: "translateZ(-20px) rotateZ(-2deg)",
                }}
              >
                {/* Monogram */}
                <div className="text-[#DAF1DE] text-6xl md:text-8xl font-serif italic font-light opacity-50 tracking-tighter pr-2">
                  pr
                </div>
              </motion.div>

              {/* Card 2: Front */}
              <motion.div 
                className="absolute inset-0 bg-[#DAF1DE] rounded-xl shadow-2xl p-6 md:p-8 flex flex-col justify-between border border-white/20 will-change-transform transform-gpu"
                style={{ transform: "translateZ(30px) rotateZ(0deg)" }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-[#051F20] text-lg md:text-xl font-medium font-sans tracking-tight leading-none">Programo Sp. z o.o.</h2>
                    <p className="text-[#163832] text-[10px] md:text-xs mt-2 uppercase tracking-[0.1em] font-normal opacity-80">Software Engineering</p>
                  </div>
                  {/* Mini logo */}
                  <div className="text-[#051F20] font-medium text-sm md:text-base tracking-tight flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#163832] inline-block" />
                    programo.
                  </div>
                </div>

                <div className="flex justify-between items-end mt-8 md:mt-12">
                  <div className="flex flex-col gap-1 text-[#163832] text-[10px] md:text-xs font-normal opacity-90 tracking-wide">
                    <span>NIP: 7792604466</span>
                    <span>KRS: 0000000000</span>
                    <span>Poznań, Polska</span>
                    <span className="mt-1 font-medium">kontakt@programo.pl</span>
                  </div>

                  {/* Fake QR */}
                  <div className="grid grid-cols-5 grid-rows-5 gap-[1px] md:gap-[2px] w-10 h-10 md:w-14 md:h-14 p-1 rounded-sm border border-[#163832]/20">
                    {qrPattern.map((isActive, i) => (
                      <div 
                        key={i} 
                        className={`w-full h-full rounded-[1px] ${isActive ? 'bg-[#051F20]' : 'bg-transparent'}`} 
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Scroll Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
      >
        <div className="flex flex-col items-center gap-4">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#DAF1DE]/50">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="h-8 w-[1px] bg-[#DAF1DE]/30"
          />
        </div>
      </motion.div>
    </section>
  );
}

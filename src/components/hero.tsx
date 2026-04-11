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

const BackgroundOrbs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Moving gradient orb 1 */}
      <motion.div
        className="absolute top-[10%] left-[20%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full bg-[#8EB69B] mix-blend-screen filter blur-[120px] md:blur-[180px] opacity-30"
        animate={{
          x: [0, 150, -100, 0],
          y: [0, -150, 100, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      {/* Moving gradient orb 2 */}
      <motion.div
        className="absolute bottom-[10%] right-[10%] w-[250px] h-[250px] md:w-[500px] md:h-[500px] rounded-full bg-[#DAF1DE] mix-blend-screen filter blur-[100px] md:blur-[150px] opacity-20"
        animate={{
          x: [0, -150, 100, 0],
          y: [0, 150, -100, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      {/* Noise Texture */}
      <div 
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
    </div>
  );
};

const GeometricStar = () => (
  <motion.div 
    className="absolute bottom-16 right-16 md:bottom-32 md:right-32 text-[#DAF1DE] z-20 pointer-events-none drop-shadow-[0_0_15px_rgba(218,241,222,0.6)]"
    animate={{ rotate: 360 }}
    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
  >
    <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 0 L22 18 L40 20 L22 22 L20 40 L18 22 L0 20 L18 18 Z" fill="currentColor" />
    </svg>
  </motion.div>
);

const FloatingShapes = () => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
    <motion.div
      className="absolute top-[25%] left-[15%] w-24 h-24 border border-[#8EB69B]/20 rounded-full"
      animate={{ y: [0, -50, 0], x: [0, 30, 0], rotate: [0, 180, 360] }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
    />
    <motion.div
      className="absolute bottom-[35%] left-[20%] w-16 h-16 border border-[#DAF1DE]/10 rotate-45"
      animate={{ y: [0, 40, 0], x: [0, -20, 0], rotate: [45, 135, 45] }}
      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
    />
    <motion.div
      className="absolute top-[60%] right-[25%] w-12 h-12 bg-[#8EB69B]/10 rounded-full blur-md"
      animate={{ y: [0, -60, 0], scale: [1, 1.5, 1] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

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

  const y = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <section
      ref={container}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#051F20] to-[#8EB69B]"
    >
      <BackgroundOrbs />
      <FloatingShapes />
      <GeometricStar />

      <motion.div 
        style={{ y, opacity }} 
        className="relative z-10 flex flex-col items-center justify-center w-full max-w-[2560px] px-6"
      >
        {/* Title */}
        <motion.div style={{ y: titleY }} className="z-0">
          <motion.h1 
            className="text-[16vw] md:text-[12vw] lg:text-[180px] font-sans font-bold text-[#DAF1DE] tracking-tighter"
            initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ textShadow: "0 0 40px rgba(218,241,222,0.3), 0 0 80px rgba(142,182,155,0.2)" }}
          >
            <motion.span
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="block"
            >
              programo
            </motion.span>
          </motion.h1>
        </motion.div>

        {/* 3D Cards Container */}
        {isMounted && (
          <div className="relative w-full max-w-[320px] md:max-w-[480px] aspect-[1.6/1] z-10 mt-[-2rem] md:mt-[-4rem]" style={{ perspective: "1500px" }}>
            <motion.div
              className="w-full h-full relative"
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              initial={{ scale: 0.8, opacity: 0, rotateZ: -10, y: 50 }}
              animate={{ scale: 1, opacity: 1, rotateZ: 0, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
            >
              {/* Card 1: Back */}
              <motion.div 
                className="absolute inset-0 bg-[#163832] rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center border border-[#8EB69B]/20"
                style={{
                  transform: "translateZ(-30px) rotateZ(-6deg)",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`
                }}
              >
                {/* Monogram */}
                <div className="text-[#DAF1DE] text-8xl md:text-[10rem] font-serif italic font-bold drop-shadow-[0_0_30px_rgba(218,241,222,0.3)] opacity-90 tracking-tighter pr-4">
                  pr
                </div>
              </motion.div>

              {/* Card 2: Front */}
              <motion.div 
                className="absolute inset-0 bg-[#DAF1DE] rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.4)] p-6 md:p-8 flex flex-col justify-between border border-white/40 backdrop-blur-sm"
                style={{ transform: "translateZ(40px) rotateZ(4deg) translateX(5%) translateY(5%)" }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-[#051F20] text-xl md:text-2xl font-bold font-sans tracking-tight leading-none">Bartosz Kolaj</h2>
                    <p className="text-[#163832] text-[10px] md:text-xs mt-2 uppercase tracking-[0.2em] font-semibold opacity-80">Founder & Developer</p>
                  </div>
                  {/* Mini logo */}
                  <div className="text-[#051F20] font-bold text-sm md:text-base tracking-tighter flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#163832] inline-block" />
                    programo.
                  </div>
                </div>

                <div className="flex justify-between items-end mt-8 md:mt-12">
                  <div className="flex flex-col gap-1 text-[#163832] text-xs md:text-sm font-medium opacity-90">
                    <span className="hover:text-[#051F20] transition-colors cursor-pointer">+48 123 456 789</span>
                    <span className="hover:text-[#051F20] transition-colors cursor-pointer">bartosz@programo.com</span>
                    <span className="hover:text-[#051F20] transition-colors cursor-pointer">www.programo.com</span>
                  </div>

                  {/* Fake QR */}
                  <div className="grid grid-cols-5 grid-rows-5 gap-[1px] md:gap-[2px] w-12 h-12 md:w-16 md:h-16 bg-[#051F20]/5 p-1 rounded-sm border border-[#163832]/10">
                    {qrPattern.map((isActive, i) => (
                      <div 
                        key={i} 
                        className={`w-full h-full rounded-[1px] ${isActive ? 'bg-[#163832]' : 'bg-transparent'}`} 
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
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#DAF1DE]/60">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 15, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="h-12 w-[1px] bg-gradient-to-b from-[#DAF1DE] to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
}

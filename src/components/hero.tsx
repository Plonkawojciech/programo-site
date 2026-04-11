"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";

export default function Hero() {
  const container = useRef<HTMLElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
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

  const tiltX = useSpring(useTransform(mouseY, [-1, 1], [15, -15]), { stiffness: 100, damping: 30 });
  const tiltY = useSpring(useTransform(mouseX, [-1, 1], [-15, 15]), { stiffness: 100, damping: 30 });

  // Scroll animations — scale reduced from 40x to 15x for GPU performance
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.5], [1, 1.1, 15]);
  const smoothScale = useSpring(scale, { stiffness: 80, damping: 20 });

  const flipProgress = useTransform(scrollYProgress, [0.0, 0.2], [0, 180]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const rotateX = useTransform(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return 0;
    const scroll = scrollYProgress.get();
    const tilt = tiltX.get();
    return scroll > 0.1 ? 0 : tilt * (1 - scroll * 10);
  });

  const rotateY = useTransform(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return 0;
    const scroll = scrollYProgress.get();
    const tilt = tiltY.get();
    const flip = flipProgress.get();
    return flip + (scroll > 0.1 ? 0 : tilt * (1 - scroll * 10));
  });

  const textOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const cardContentOpacity = useTransform(scrollYProgress, [0.2, 0.35], [1, 0]);

  // Tech Overlay — simplified: removed 3D perspective/z transforms for performance
  const techOverlayOpacity = useTransform(scrollYProgress, [0.4, 0.5, 0.9, 1.0], [0, 1, 1, 0]);
  const techOverlayScale = useTransform(scrollYProgress, [0.4, 0.7, 1.0], [0.9, 1, 1.1]);

  // Fix: useTransform must be called unconditionally (React Rules of Hooks)
  const techDisplayValue = useTransform(techOverlayOpacity, v => v > 0 ? 'flex' : 'none');

  // Floating background elements
  const bgTextY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);

  return (
    <section
      ref={container}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-[300vh] bg-white cursor-default"
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">

        {/* Subtle Background Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.05] z-0 transform-gpu"
          style={{
            backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "100px 100px"
          }}
        />

        {/* Giant floating background text */}
        <motion.div
          style={{ opacity: textOpacity, y: bgTextY }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 transform-gpu will-change-[transform,opacity]"
        >
          <h1 className="text-[12vw] font-sans font-bold text-black/[0.02] tracking-tighter uppercase whitespace-nowrap select-none">
            pure minimalism
          </h1>
        </motion.div>

        {/* Foreground Title */}
        <motion.div style={{ opacity: textOpacity }} className="absolute z-10 top-[20%] flex flex-col items-center pointer-events-none transform-gpu will-change-opacity">
          <h1 className="text-[10vw] md:text-[6vw] 2xl:text-[8vw] font-sans font-bold text-black tracking-tight leading-none mb-4">
            programo
          </h1>
          <div className="h-px w-12 bg-black mb-4" />
          <p className="text-black/60 font-sans text-[10px] md:text-xs uppercase tracking-[0.5em]">Digital Excellence</p>
        </motion.div>

        {/* 3D Card Container */}
        {isMounted && (
          <motion.div
            className="relative w-full max-w-[340px] md:max-w-[500px] 2xl:max-w-[580px] aspect-[1.6/1] z-20 will-change-transform transform-gpu pointer-events-none"
            style={{
              scale: smoothScale,
              rotateX,
              rotateY,
              transformStyle: "preserve-3d"
            }}
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* BACK OF CARD (Initially Visible) */}
            <div
              className="absolute inset-0 bg-white rounded-sm shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-[#E0E0E0] overflow-hidden transform-gpu translate-z-0"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(0deg)",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center transform-gpu">
                <div className="text-black font-bold text-4xl tracking-tighter flex items-center gap-4">
                  <div className="w-8 h-8 bg-black rounded-full" />
                  programo.
                </div>
              </div>
            </div>

            {/* FRONT OF CARD (Revealed on flip) */}
            <div
              className="absolute inset-0 bg-white rounded-sm shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-[#E0E0E0] overflow-hidden transform-gpu translate-z-0"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)"
              }}
            >
              <div
                className="absolute inset-0 opacity-[0.05] transform-gpu"
                style={{
                  backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
                  backgroundSize: "20px 20px"
                }}
              />

              <motion.div style={{ opacity: cardContentOpacity }} className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between transform-gpu will-change-opacity">
                <div className="flex justify-between items-start transform-gpu">
                  <div className="transform-gpu">
                    <h2 className="text-black text-xl md:text-2xl font-bold tracking-tighter uppercase">Programo</h2>
                    <p className="text-black/40 text-[9px] md:text-[11px] mt-1 uppercase tracking-[0.3em] font-sans">Software Engineering</p>
                  </div>
                  <div className="text-black font-bold text-lg tracking-tighter">
                    pr.
                  </div>
                </div>

                <div className="flex justify-between items-end transform-gpu">
                  <div className="flex flex-col gap-1 text-black/60 text-[9px] md:text-[11px] font-sans uppercase tracking-widest transform-gpu">
                    <span>Poznań, Poland</span>
                    <span className="text-black font-medium normal-case tracking-normal mt-1">hello@programo.site</span>
                  </div>

                  <div className="w-10 h-10 bg-black" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Tech Overlay (Minimalist Content) — renders always but hidden via display */}
        {!isMobile && (
          <motion.div
            style={{
              opacity: techOverlayOpacity,
              display: techDisplayValue,
            }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-white transform-gpu"
          >
            <motion.div
              style={{
                scale: techOverlayScale,
              }}
              className="w-full max-w-5xl aspect-video flex flex-col items-center justify-center text-center p-12 transform-gpu will-change-transform"
            >
              <h2 className="text-black text-6xl md:text-8xl 2xl:text-[10vw] font-bold tracking-tighter mb-8 uppercase">
                Clean Code.
              </h2>
              <div className="h-px w-32 bg-black mb-8" />
              <p className="text-black/40 text-sm md:text-base uppercase tracking-[0.5em] max-w-2xl leading-relaxed">
                We build high-performance digital products with surgical precision and minimalist aesthetics.
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Scroll Hint */}
        <motion.div
          style={{ opacity: textOpacity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
        >
          <div className="flex flex-col items-center gap-4">
            <span className="text-[10px] font-sans uppercase tracking-[0.4em] text-black/30">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="h-12 w-px bg-black/10"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

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

  const tiltX = useSpring(useTransform(mouseY, [-1, 1], [20, -20]), { stiffness: 100, damping: 30 });
  const tiltY = useSpring(useTransform(mouseX, [-1, 1], [-20, 20]), { stiffness: 100, damping: 30 });

  // Scroll animations mapped continuously
  // 0.0 - 0.2: Card flips
  // 0.2 - 0.5: Card scales up massively
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.5], [1, 1.2, 60]);
  const smoothScale = useSpring(scale, { stiffness: 80, damping: 20 });
  
  const flipProgress = useTransform(scrollYProgress, [0.0, 0.2], [0, 180]);
  
  const rotateX = useTransform(() => {
    const scroll = scrollYProgress.get();
    const tilt = tiltX.get();
    return scroll > 0.1 ? 0 : tilt * (1 - scroll * 10);
  });
  
  const rotateY = useTransform(() => {
    const scroll = scrollYProgress.get();
    const tilt = tiltY.get();
    const flip = flipProgress.get();
    return flip + (scroll > 0.1 ? 0 : tilt * (1 - scroll * 10));
  });
  
  const textOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const cardContentOpacity = useTransform(scrollYProgress, [0.2, 0.35], [1, 0]);
  
  // Tech Overlay Animations
  // 0.4 - 0.5: Reveal fades in
  // 0.7 - 1.0: Fades out as it flies past camera
  const techOverlayOpacity = useTransform(scrollYProgress, [0.4, 0.5, 0.9, 1.0], [0, 1, 1, 0]);
  
  // Z-axis fly in and scale for the grid
  const techGridZ = useTransform(scrollYProgress, [0.4, 0.7, 1.0], [-1500, 0, 1500]);
  const techGridScale = useTransform(scrollYProgress, [0.4, 0.7, 1.0], [0.5, 1, 2.5]);

  // Modules scatter (fly in and pull apart)
  const m1X = useTransform(scrollYProgress, [0.4, 0.7, 1.0], [-800, 0, -1500]);
  const m1Y = useTransform(scrollYProgress, [0.4, 0.7, 1.0], [-800, 0, -1500]);
  const m1Z = useTransform(scrollYProgress, [0.4, 0.7, 1.0], [-1000, 0, 500]);
  
  const m2X = useTransform(scrollYProgress, [0.4, 0.7, 1.0], [400, 0, 800]);
  const m2Y = useTransform(scrollYProgress, [0.4, 0.7, 1.0], [-600, 0, -1200]);
  const m2Z = useTransform(scrollYProgress, [0.4, 0.7, 1.0], [-800, 0, 400]);
  
  const m3X = useTransform(scrollYProgress, [0.4, 0.7, 1.0], [800, 0, 1500]);
  const m3Y = useTransform(scrollYProgress, [0.4, 0.7, 1.0], [-600, 0, -1200]);
  const m3Z = useTransform(scrollYProgress, [0.4, 0.7, 1.0], [-1200, 0, 600]);

  const m4X = useTransform(scrollYProgress, [0.4, 0.7, 1.0], [800, 0, 1500]);
  const m4Y = useTransform(scrollYProgress, [0.4, 0.7, 1.0], [400, 0, 800]);
  const m4Z = useTransform(scrollYProgress, [0.4, 0.7, 1.0], [-900, 0, 450]);
  
  const m5X = useTransform(scrollYProgress, [0.4, 0.7, 1.0], [-800, 0, -1500]);
  const m5Y = useTransform(scrollYProgress, [0.4, 0.7, 1.0], [800, 0, 1500]);
  const m5Z = useTransform(scrollYProgress, [0.4, 0.7, 1.0], [-1100, 0, 550]);

  const m6X = useTransform(scrollYProgress, [0.4, 0.7, 1.0], [0, 0, 0]);
  const m6Y = useTransform(scrollYProgress, [0.4, 0.7, 1.0], [800, 0, 1500]);
  const m6Z = useTransform(scrollYProgress, [0.4, 0.7, 1.0], [-700, 0, 350]);

  // Floating background elements
  const bg1Y = useTransform(scrollYProgress, [0, 1], [0, -600]);
  const bg1Rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const bg2Y = useTransform(scrollYProgress, [0, 1], [0, 800]);
  const bg2Rotate = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const bgTextY = useTransform(scrollYProgress, [0, 0.2], [0, -150]);

  return (
    <section
      ref={container}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-[350vh] bg-[#FCFCFA] cursor-default"
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        
        {/* Geometric Pattern Background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" 
          style={{ 
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%238EB69B' stroke-width='1' stroke-opacity='1'%3E%3Cpath d='M30 0L60 30L30 60L0 30z'/%3E%3Cpath d='M15 15h30v30H15z'/%3E%3Cpath d='M0 0l60 60M60 0L0 60'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        {/* Floating background elements for "crazy" vibe */}
        <motion.div 
           style={{ y: bg1Y, rotate: bg1Rotate }}
           className="absolute top-[10%] right-[10%] w-64 h-64 border border-[#051F20]/5 rounded-full pointer-events-none z-0"
        />
        <motion.div 
           style={{ y: bg2Y, rotate: bg2Rotate }}
           className="absolute bottom-[20%] left-[5%] w-32 h-32 bg-[#051F20]/5 pointer-events-none z-0"
        />

        {/* Giant floating background text */}
        <motion.div 
          style={{ opacity: textOpacity, y: bgTextY }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        >
          <h1 className="text-[15vw] font-serif font-light text-[#051F20]/5 tracking-tighter italic whitespace-nowrap select-none">
            digital craftsmanship
          </h1>
        </motion.div>

        {/* Foreground Title */}
        <motion.div style={{ opacity: textOpacity }} className="absolute z-10 top-[15%] md:top-[15%] flex flex-col items-center pointer-events-none">
          <h1 className="text-[14vw] md:text-[9vw] font-sans font-light text-[#051F20] tracking-tighter leading-none mb-2">
            programo
          </h1>
          <p className="text-[#163832] font-mono text-[10px] md:text-xs uppercase tracking-[0.4em]">Software Engineering</p>
        </motion.div>

        {/* 3D Card Container */}
        {isMounted && (
          <motion.div
            className="relative w-full max-w-[340px] md:max-w-[480px] aspect-[1.6/1] z-20 will-change-transform transform-gpu pointer-events-none"
            style={{ 
              scale: smoothScale, 
              rotateX, 
              rotateY, 
              transformStyle: "preserve-3d" 
            }}
            initial={{ scale: 0.8, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* BACK OF CARD (Initially Visible) */}
            <div 
              className="absolute inset-0 bg-[#051F20] rounded-2xl shadow-2xl border border-[#163832]/50 overflow-hidden"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(0deg)",
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%238EB69B' stroke-width='1' stroke-opacity='0.2'%3E%3Cpath d='M30 0L60 30L30 60L0 30z'/%3E%3Cpath d='M15 15h30v30H15z'/%3E%3Cpath d='M0 0l60 60M60 0L0 60'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-[#DAF1DE] font-bold text-5xl tracking-tighter drop-shadow-[0_0_15px_rgba(218,241,222,0.5)] flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#8EB69B] inline-block animate-pulse shadow-[0_0_10px_#8EB69B]" />
                  pr.
                </div>
              </div>
            </div>

            {/* FRONT OF CARD (Revealed on flip) */}
            <div 
              className="absolute inset-0 bg-[#DAF1DE] rounded-2xl shadow-2xl border border-[#163832]/20 overflow-hidden"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)"
              }}
            >
              <motion.div style={{ opacity: cardContentOpacity }} className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="max-w-[70%]">
                    <h2 className="text-[#051F20] text-lg md:text-xl font-bold font-sans tracking-tight leading-tight uppercase">Programo</h2>
                    <p className="text-[#163832] text-[8px] md:text-[10px] mt-1.5 uppercase tracking-widest font-mono">Enterprise Solutions</p>
                  </div>
                  <div className="text-[#051F20] font-bold text-sm tracking-tight flex items-center gap-2 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#163832] inline-block animate-pulse" />
                    pr.
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div className="flex flex-col gap-0.5 text-[#163832] text-[8px] md:text-[10px] font-mono opacity-80 uppercase tracking-wide">
                    <span>NIP: 7792604466</span>
                    <span>KRS: 0001233841</span>
                    <span>Located in Poznań</span>
                    <span className="mt-1.5 text-[#051F20] font-bold normal-case tracking-normal">kontakt@programo.pl</span>
                  </div>

                  <div className="grid grid-cols-5 grid-rows-5 gap-[2px] w-12 h-12 bg-[#051F20]/5 p-1 rounded-sm border border-[#051F20]/10">
                    {qrPattern.map((isActive, i) => (
                      <div key={i} className={`w-full h-full rounded-[1px] ${isActive ? 'bg-[#051F20]' : 'bg-transparent'}`} />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Tech / AI Modules Overlay (Revealed when card covers screen) */}
        <motion.div 
          style={{ 
            opacity: techOverlayOpacity, 
            display: useTransform(techOverlayOpacity, v => v > 0 ? 'flex' : 'none'),
            perspective: "1200px"
          }}
          className="absolute inset-0 z-30 flex items-center justify-center p-4 md:p-8 xl:p-16 bg-[#051F20]"
        >
          <motion.div 
            style={{ 
              z: techGridZ, 
              scale: techGridScale,
              transformStyle: "preserve-3d"
            }}
            className="w-full max-w-6xl aspect-video grid grid-cols-2 md:grid-cols-4 grid-rows-4 md:grid-rows-3 gap-px bg-[#163832]/30"
          >
            
            <motion.div style={{ x: m1X, y: m1Y, z: m1Z }} className="col-span-2 row-span-2 bg-[#051F20] p-8 flex flex-col justify-end relative overflow-hidden group hover:bg-[#0A2A28] transition-colors shadow-2xl">
              <motion.div 
                animate={{ y: ["-100%", "100%"] }} 
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8EB69B]/40 to-transparent" 
              />
              <span className="text-[#8EB69B] font-mono text-[10px] md:text-xs mb-4 uppercase tracking-[0.3em]">Module // 01</span>
              <h3 className="text-[#DAF1DE] text-4xl md:text-6xl font-serif italic tracking-tighter">Artificial<br/>Intelligence</h3>
            </motion.div>
            
            <motion.div style={{ x: m2X, y: m2Y, z: m2Z }} className="bg-[#051F20] p-6 flex flex-col justify-between hover:bg-[#0A2A28] transition-colors cursor-default shadow-2xl">
               <span className="text-[#8EB69B] font-mono text-[10px] uppercase tracking-widest">SYS.STATUS</span>
               <div className="flex gap-1 items-end h-16">
                  {[40, 70, 45, 90, 60, 85, 30, 80].map((h, i) => (
                    <motion.div key={i} className="w-full bg-[#163832]" animate={{ height: [`${h}%`, `${(h * 1.5) % 100}%`, `${h}%`] }} transition={{ duration: 1.5, repeat: Infinity, delay: i*0.1 }} />
                  ))}
               </div>
            </motion.div>
            
            <motion.div style={{ x: m3X, y: m3Y, z: m3Z }} className="bg-[#051F20] p-6 flex flex-col items-center justify-center relative hover:bg-[#0A2A28] transition-colors shadow-2xl">
               <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="w-20 h-20 rounded-full border border-dashed border-[#8EB69B]/50 absolute" />
               <motion.div animate={{ rotate: -360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} className="w-16 h-16 rounded-full border border-dotted border-[#8EB69B] absolute" />
               <div className="text-[#DAF1DE] font-mono text-[10px] z-10">ML/OP</div>
            </motion.div>

            <motion.div style={{ x: m4X, y: m4Y, z: m4Z }} className="row-span-2 bg-[#051F20] p-6 flex flex-col justify-end hover:bg-[#0A2A28] transition-colors cursor-default shadow-2xl">
              <span className="text-[#8EB69B] font-mono text-[10px] mb-4 uppercase tracking-[0.3em]">Module // 02</span>
              <h3 className="text-[#DAF1DE] text-2xl md:text-3xl font-sans font-light tracking-tight">Hardware<br/>Integration</h3>
              <div className="mt-8 w-full h-1 bg-[#163832] rounded-full overflow-hidden">
                <motion.div className="h-full bg-[#8EB69B]" animate={{ x: ["-100%", "100%"] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
              </div>
            </motion.div>
            
            <motion.div style={{ x: m5X, y: m5Y, z: m5Z }} className="col-span-2 bg-[#051F20] p-6 flex items-end justify-between hover:bg-[#0A2A28] transition-colors cursor-default shadow-2xl">
               <div className="text-[#DAF1DE]/50 text-xs font-mono">PROCESSING DATA_STREAM...</div>
               <span className="text-[#DAF1DE] bg-[#163832] px-2 py-1 rounded font-mono text-[10px] animate-pulse">ACTIVE</span>
            </motion.div>
            
            <motion.div style={{ x: m6X, y: m6Y, z: m6Z }} className="col-span-3 bg-[#051F20] p-6 flex items-center gap-6 hover:bg-[#0A2A28] transition-colors cursor-default shadow-2xl">
               <div className="w-4 h-4 rounded-full bg-[#DAF1DE] animate-ping" />
               <div className="text-[#8EB69B] text-xs font-mono flex flex-col gap-1">
                 <span>Neural Net Cluster Online.</span>
                 <span>Latency: 12ms. Zero packet loss.</span>
               </div>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Scroll Hint */}
        <motion.div
          style={{ opacity: textOpacity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
        >
          <div className="flex flex-col items-center gap-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#051F20]/50">
              Scroll to Enter
            </span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="h-10 w-px bg-[#051F20]/20"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
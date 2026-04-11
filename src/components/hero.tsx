"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const qrPattern = [
  1, 0, 1, 1, 0,
  1, 1, 0, 1, 1,
  0, 1, 1, 0, 0,
  1, 0, 0, 1, 1,
  0, 1, 1, 1, 0
];

function AIScannerCell() {
  const [scannerPos, setScannerPos] = useState({ x: 50, y: 50 });
  const handleScannerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setScannerPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div 
      className="col-span-1 row-span-2 bg-[#051F20] relative overflow-hidden cursor-crosshair group"
      onMouseMove={handleScannerMove}
    >
      {/* Interactive Scanner Line */}
      <motion.div 
        className="absolute left-0 right-0 h-[1px] bg-[#DAF1DE] shadow-[0_0_10px_#DAF1DE] z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
        animate={{ top: scannerPos.y }}
        transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
      />
      <motion.div 
        className="absolute top-0 bottom-0 w-[1px] bg-[#DAF1DE] shadow-[0_0_10px_#DAF1DE] z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
        animate={{ left: scannerPos.x }}
        transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
      />
      
      <div className="absolute top-4 left-4 text-[#8EB69B] font-mono text-[10px] uppercase tracking-widest z-10 mix-blend-difference">
        AI_SCANNER
      </div>
      <div className="w-full h-full p-4 flex flex-col gap-2 opacity-30 mt-8 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="h-1 md:h-2 w-full bg-[#163832] rounded" style={{ width: `${30 + (i * 23) % 70}%` }} />
        ))}
      </div>
      
      {/* Ambient auto scanner */}
      <motion.div 
        className="absolute left-0 right-0 h-16 bg-gradient-to-b from-transparent via-[#8EB69B]/10 to-transparent pointer-events-none z-10"
        animate={{ top: ["-20%", "120%", "-20%"] }}
        transition={{ duration: 4, ease: "linear", repeat: Infinity }}
      />
    </div>
  );
}

export default function Hero() {
  const container = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section
      ref={container}
      className="relative h-[200vh] bg-[#051F20]"
    >
      <motion.div 
        className="sticky top-0 h-screen w-full overflow-hidden bg-[#163832] p-[1px] flex flex-col"
        style={{ scale, opacity, rotateX, y, transformStyle: "preserve-3d", perspective: 1200 }}
      >
        <div className="w-full h-full grid grid-cols-2 md:grid-cols-4 grid-rows-6 md:grid-rows-4 gap-[1px]">
          {/* Cell 1: PR Logo */}
          <motion.div 
            className="col-span-2 row-span-2 bg-[#051F20] relative overflow-hidden group flex items-center justify-center"
            whileHover={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#0A2A28] to-[#051F20] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative text-[#DAF1DE] font-bold text-7xl md:text-[10vw] tracking-tighter drop-shadow-[0_0_15px_rgba(218,241,222,0.2)] flex items-center gap-4">
              <span className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-[#8EB69B] inline-block animate-pulse shadow-[0_0_10px_#8EB69B]" />
              pr.
            </div>
            <div className="absolute top-4 left-4 text-[#8EB69B] font-mono text-[10px] md:text-xs uppercase tracking-widest">programo_hub</div>
          </motion.div>

          {/* Cell 2: AI Scanner (Isolated component) */}
          <AIScannerCell />

          {/* Cell 3: NIP/KRS */}
          <motion.div 
            className="col-span-1 row-span-1 bg-[#051F20] p-4 md:p-6 flex flex-col justify-between group"
            whileHover={{ backgroundColor: "#0A2A28" }}
          >
            <span className="text-[#8EB69B] font-mono text-[10px] uppercase tracking-widest">ENTITY_DATA</span>
            <div className="flex flex-col gap-1 text-[#DAF1DE] font-mono text-[10px] md:text-sm">
              <span className="group-hover:translate-x-1 transition-transform">NIP: 7792604466</span>
              <span className="group-hover:translate-x-1 transition-transform delay-75">KRS: 0001233841</span>
            </div>
          </motion.div>

          {/* Cell 4: Contact */}
          <motion.div 
            className="col-span-1 row-span-1 bg-[#051F20] p-4 md:p-6 flex flex-col justify-between group" 
            whileHover={{ backgroundColor: "#0A2A28" }}
          >
            <span className="text-[#8EB69B] font-mono text-[10px] uppercase tracking-widest">COMMS_LINK</span>
            <span className="text-[#DAF1DE] font-mono text-[10px] md:text-sm truncate group-hover:text-[#8EB69B] transition-colors">kontakt@programo.pl</span>
          </motion.div>

          {/* Cell 5: Abstract Tech / Stats */}
          <motion.div 
            className="col-span-1 md:col-span-1 row-span-2 bg-[#051F20] p-4 md:p-6 flex flex-col justify-between overflow-hidden relative group" 
            whileHover={{ scale: 0.98 }}
          >
            <span className="text-[#8EB69B] font-mono text-[10px] uppercase tracking-widest z-10">SYS.LOAD_METRICS</span>
            <div className="flex gap-1 items-end h-24 md:h-32 z-10 mt-8">
              {[40, 70, 45, 90, 60, 85].map((h, i) => (
                <motion.div 
                  key={i} 
                  className="w-full bg-[#163832] group-hover:bg-[#8EB69B]/50 transition-colors" 
                  animate={{ height: [`${h}%`, `${(h * 1.5) % 100}%`, `${h}%`] }} 
                  transition={{ duration: 1.5 + (i * 0.1), repeat: Infinity }} 
                />
              ))}
            </div>
          </motion.div>

          {/* Cell 6: Digital Craftsmanship */}
          <motion.div className="col-span-2 md:col-span-2 row-span-1 bg-[#051F20] p-4 md:p-8 flex items-center justify-center relative overflow-hidden group cursor-default">
            <h2 className="text-[#DAF1DE] text-2xl md:text-4xl lg:text-5xl font-serif italic tracking-tighter mix-blend-difference z-10 pointer-events-none">
              digital craftsmanship
            </h2>
            <motion.div 
              className="absolute inset-0 bg-[#8EB69B]"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Cell 7: QR Pattern / Matrix */}
          <motion.div 
            className="col-span-1 md:col-span-1 row-span-1 bg-[#051F20] p-4 md:p-6 flex items-center justify-center group" 
            whileHover={{ backgroundColor: "#0A2A28" }}
          >
            <div className="grid grid-cols-5 grid-rows-5 gap-[2px] w-12 h-12 md:w-16 md:h-16 bg-[#051F20] border border-[#163832] p-1 group-hover:border-[#8EB69B] transition-colors">
              {qrPattern.map((isActive, i) => (
                <motion.div 
                  key={i} 
                  className={`w-full h-full ${isActive ? 'bg-[#8EB69B]' : 'bg-[#163832]'}`} 
                  animate={isActive ? { opacity: [1, 0.5, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity, delay: (i * 13) % 7 * 0.1 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Cell 8: Location */}
          <motion.div className="col-span-1 md:col-span-1 row-span-1 bg-[#051F20] p-4 md:p-6 flex flex-col justify-between group" whileHover={{ backgroundColor: "#0A2A28" }}>
            <span className="text-[#8EB69B] font-mono text-[10px] uppercase tracking-widest">LOC_COORDS</span>
            <span className="text-[#DAF1DE] font-mono text-xs md:text-sm group-hover:tracking-widest transition-all">POZNAŃ, PL</span>
          </motion.div>

          {/* Cell 9: Interactive Map/Radar */}
          <motion.div 
            className="col-span-2 md:col-span-2 row-span-1 bg-[#051F20] p-4 md:p-6 relative overflow-hidden flex items-center justify-center group" 
            whileHover={{ scale: 0.98 }}
          >
             <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="w-32 h-32 md:w-48 md:h-48 rounded-full border border-dashed border-[#163832] group-hover:border-[#8EB69B]/50 absolute transition-colors" />
             <motion.div animate={{ rotate: -360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} className="w-20 h-20 md:w-32 md:h-32 rounded-full border border-dotted border-[#8EB69B] absolute" />
             <div className="text-[#DAF1DE] font-mono text-[10px] md:text-xs z-10 bg-[#051F20] px-2 py-1 rounded-full border border-[#163832]">RADAR_ONLINE</div>
          </motion.div>

          {/* Cell 10: Scroll Hint */}
          <motion.div className="col-span-1 md:col-span-1 row-span-1 bg-[#051F20] p-4 md:p-6 flex items-center justify-center flex-col gap-2 group" whileHover={{ backgroundColor: "#0A2A28" }}>
            <span className="text-[#8EB69B] font-mono text-[10px] uppercase tracking-widest text-center">INIT_SEQUENCE</span>
            <div className="h-8 md:h-12 w-[1px] bg-[#163832] relative overflow-hidden mt-2">
               <motion.div className="absolute top-0 left-0 w-full h-1/2 bg-[#DAF1DE]" animate={{ y: ["-100%", "200%"] }} transition={{ duration: 1.5, repeat: Infinity }} />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
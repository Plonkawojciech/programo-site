"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = ["STRATEGIA", "KREACJA", "INŻYNIERIA", "STUDIO", "PROGRAMO"];

export default function Preloader() {
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 25);

    const wordInterval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 300);

    return () => {
      clearInterval(interval);
      clearInterval(wordInterval);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F0F0EC]"
          exit={{
            y: "-100%",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* Centered Word Cycle */}
          <div className="relative h-16 overflow-hidden text-center md:h-20">
            <AnimatePresence mode="wait">
              <motion.span
                key={index}
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -60, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="block font-headline text-4xl font-medium italic tracking-[0.2em] text-[#0A0A0A] md:text-6xl"
              >
                {words[index]}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Progress Number */}
          <div className="absolute bottom-12 right-12 flex items-baseline gap-1">
            <span className="text-[80px] font-bold leading-none tracking-tighter text-[#0A0A0A]/10 md:text-[140px]">
              {progress}
            </span>
          </div>

          {/* Bottom Bar — coral */}
          <div
            className="absolute bottom-0 left-0 h-[2px] bg-[#FF3D00] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

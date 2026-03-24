"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = ["STRATEGIA", "KREACJA", "INŻYNIERIA", "STUDIO", "PROGRAMO"];

export default function Preloader() {
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Płynny, ekskluzywny postęp
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500); // Dłuższa pauza na 100% dla efektu "zawieszenia"
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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-surface text-on-surface"
          exit={{ 
            clipPath: "inset(0 0 100% 0)",
            transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } 
          }}
        >
          {/* Centered Word Cycle */}
          <div className="relative h-12 overflow-hidden text-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={index}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="block font-headline text-3xl font-medium italic tracking-[0.2em] md:text-5xl text-primary"
              >
                {words[index]}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Progress Number - bardzo czytelny */}
          <div className="absolute bottom-12 right-12 flex items-baseline gap-2">
            <span className="text-[100px] font-bold leading-none tracking-tighter md:text-[180px] text-on-surface/10">
              {progress}
            </span>
            <span className="text-xl font-medium text-primary md:text-3xl">%</span>
          </div>

          {/* Bottom Bar */}
          <div className="absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

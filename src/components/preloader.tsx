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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ backgroundColor: "#0A0808" }}
          exit={{
            clipPath: "inset(100% 0 0 0)",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* Centered Word Cycle */}
          <div className="relative h-14 overflow-hidden text-center md:h-16">
            <AnimatePresence mode="wait">
              <motion.span
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="block font-headline text-3xl font-medium italic tracking-[0.2em] md:text-5xl"
                style={{ color: "#C8A44E" }}
              >
                {words[index]}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Progress Number — large translucent in bottom-right */}
          <div className="absolute bottom-12 right-12 flex items-baseline gap-2">
            <span
              className="text-[100px] font-bold leading-none tracking-tighter md:text-[180px]"
              style={{ color: "rgba(200, 164, 78, 0.08)" }}
            >
              {progress}
            </span>
            <span
              className="text-xl font-medium md:text-3xl"
              style={{ color: "#C8A44E" }}
            >
              %
            </span>
          </div>

          {/* Bottom progress bar — thin gold line */}
          <div
            className="absolute bottom-0 left-0 h-[1px] transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
              backgroundColor: "#C8A44E",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

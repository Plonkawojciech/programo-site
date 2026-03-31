"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = ["STRATEGIA", "KREACJA", "IN\u017bYNIERIA", "STUDIO", "PROGRAMO"];

export default function Preloader() {
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 400);
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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg"
          exit={{
            clipPath: "inset(0 0 100% 0)",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* Centered Word Cycle */}
          <div className="relative h-14 overflow-hidden text-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={index}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="block font-headline text-3xl font-medium tracking-[0.2em] md:text-5xl gradient-text"
              >
                {words[index]}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Progress bar at bottom with gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px]">
            <div
              className="h-full transition-all duration-100 ease-out"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #8B5CF6, #3B82F6, #06B6D4)",
              }}
            />
          </div>

          {/* Small progress text */}
          <div className="absolute bottom-8 right-8">
            <span className="text-sm font-medium text-on-surface-variant/40 tabular-nums">
              {progress}%
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { easeEntry, easePageTransition, durationMedium } from "@/lib/motion";

const BRAND_TEXT = "Programo";
const CHAR_STAGGER = 0.04;
const HOLD_DELAY = 0.3;
const CURTAIN_DURATION = 0.7;

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  // Total time: chars animation + hold + curtain slide
  const charsAnimDuration = BRAND_TEXT.length * CHAR_STAGGER + durationMedium;
  const totalDuration = charsAnimDuration + HOLD_DELAY + CURTAIN_DURATION;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, totalDuration * 1000);

    return () => clearTimeout(timer);
  }, [totalDuration]);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-on-surface"
          exit={{ y: "-100%" }}
          transition={{
            duration: CURTAIN_DURATION,
            ease: easePageTransition as [number, number, number, number],
            delay: 0,
          }}
        >
          <div className="flex overflow-hidden" aria-hidden="true">
            {BRAND_TEXT.split("").map((char, i) => (
              <motion.span
                key={i}
                className="font-headline text-5xl tracking-tight text-inverse-on-surface sm:text-7xl md:text-8xl"
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: durationMedium,
                  ease: easeEntry as [number, number, number, number],
                  delay: i * CHAR_STAGGER,
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

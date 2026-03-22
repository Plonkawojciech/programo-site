"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { easeEntry, easePageTransition } from "@/lib/motion";

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 500ms fade-in + 300ms hold = 800ms before exit
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-on-surface"
          exit={{ y: "-100%" }}
          transition={{
            duration: 0.5,
            ease: easePageTransition as [number, number, number, number],
          }}
        >
          <motion.span
            className="font-headline text-3xl font-semibold tracking-tight text-inverse-on-surface"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.4,
              ease: easeEntry as [number, number, number, number],
            }}
          >
            Programo
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

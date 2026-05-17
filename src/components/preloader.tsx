"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return prev + 5;
      });
    }, 15);

    return () => {
      clearInterval(interval);
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
            transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] }
          }}
        >
          {/* Signet + PROGRAMO wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-6"
          >
            <Image
              src="/programo-mark.svg"
              alt=""
              width={96}
              height={96}
              priority
              className="h-20 w-20 md:h-24 md:w-24"
            />
            <span className="block font-headline text-2xl font-medium italic tracking-[0.2em] md:text-4xl text-on-surface">
              PROGRAMO
            </span>
          </motion.div>

          {/* Progress Number */}
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

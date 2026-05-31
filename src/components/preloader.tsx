"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme";

export default function Preloader() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Show the branded intro only once per session so it never blocks
    // content paint (LCP) on repeat navigations / returning visitors.
    if (sessionStorage.getItem("programo-preloaded")) {
      setLoading(false);
      return;
    }

    // Drive progress off real wall-clock time (not a fixed number of ticks)
    // and hard-cap the total duration. This keeps the intro from stretching
    // out — and gating LCP — when the main thread is throttled (e.g. Lighthouse
    // mobile / slow devices), where tick-based timers drift badly.
    const DURATION = 650;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / DURATION) * 100));
      setProgress(pct);
      if (elapsed >= DURATION) {
        setLoading(false);
        sessionStorage.setItem("programo-preloaded", "1");
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-surface text-on-surface"
          exit={{
            clipPath: "inset(0 0 100% 0)",
            transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] }
          }}
        >
          {/* Full Programo logo */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center"
          >
            <Image
              key={theme}
              src={theme === "dark" ? "/programo-logo-white.svg" : "/programo-logo-dark.svg"}
              alt="Programo"
              width={480}
              height={340}
              priority
              className="h-auto w-[240px] md:w-[340px] select-none"
            />
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

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme";

/**
 * Minimal branded intro. NO percent counter, NO multi-second gate — the homepage
 * must paint immediately (LCP / Quality Score). We render a brief logo fade
 * (max 250 ms) once per session, and skip it entirely for paid/campaign traffic
 * and returning visitors. Content underneath is always rendered; the overlay
 * simply fades out on top of it.
 */
const FADE_MS = 250;

export default function Preloader() {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Skip the intro for paid / campaign traffic (cold, costly clicks) and for
    // repeat navigations / returning visitors, so it never delays content paint.
    let isPaid = false;
    try {
      const sp = new URLSearchParams(window.location.search);
      isPaid =
        sp.has("gclid") || sp.has("gbraid") || sp.has("wbraid") ||
        sp.has("utm_source") || sp.has("utm_medium") || sp.has("utm_campaign");
    } catch {
      /* ignore */
    }

    if (isPaid || sessionStorage.getItem("programo-preloaded")) {
      setVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem("programo-preloaded", "1");
      } catch {
        /* ignore */
      }
    }, FADE_MS);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="pointer-events-none fixed inset-0 z-[300] flex items-center justify-center bg-surface"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } }}
        >
          <Image
            key={theme}
            src={theme === "dark" ? "/programo-logo-white.svg" : "/programo-logo-dark.svg"}
            alt="Programo"
            width={480}
            height={340}
            priority
            className="h-auto w-[200px] md:w-[280px] select-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import BrowserFrame from "@/components/ui/browser-frame";
import PhoneFrame from "@/components/ui/phone-frame";

/**
 * Composition of a BrowserFrame (desktop screenshot) with a PhoneFrame overlapping
 * in front on the right. The phone gets a subtle vertical parallax as the block
 * scrolls through the viewport (disabled for prefers-reduced-motion).
 */
export default function DeviceDuo({
  url,
  desktopSrc,
  desktopAlt,
  phoneSrc,
  phoneAlt,
  priority = false,
  className,
}: {
  url: string;
  desktopSrc: string;
  desktopAlt: string;
  phoneSrc: string;
  phoneAlt: string;
  priority?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Small opposite-direction drift keeps the phone feeling like a separate layer.
  const phoneY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [28, -28]);

  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      {/* Desktop browser — leaves room on the right for the phone overlap */}
      <div className="md:pr-[18%]">
        <BrowserFrame
          url={url}
          src={desktopSrc}
          alt={desktopAlt}
          priority={priority}
        />
      </div>
      {/* Phone — overlaps front-right */}
      <motion.div
        style={{ y: phoneY }}
        className="absolute bottom-[-6%] right-0 w-[30%] max-w-[190px] md:w-[26%]"
      >
        <PhoneFrame src={phoneSrc} alt={phoneAlt} scrollOnHover priority={priority} />
      </motion.div>
    </div>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

export function CustomCursor() {
  const [cursorType, setCursorType] = useState<"default" | "pointer" | "view">("default");
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isPointer = window.getComputedStyle(target).cursor === "pointer";
      const isView = target.closest("[data-cursor='view']");

      if (isView) {
        setCursorType("view");
      } else if (isPointer) {
        setCursorType("pointer");
      } else {
        setCursorType("default");
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseleave", () => setIsVisible(false));
    window.addEventListener("mouseenter", () => setIsVisible(true));

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="pointer-events-none fixed left-0 top-0 z-[9998] flex items-center justify-center"
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          {/* Main dot with purple glow */}
          <motion.div
            className="rounded-full"
            animate={{
              width: cursorType === "default" ? 8 : cursorType === "view" ? 80 : 36,
              height: cursorType === "default" ? 8 : cursorType === "view" ? 80 : 36,
              backgroundColor: cursorType === "default" ? "#ffffff" : cursorType === "view" ? "rgba(139, 92, 246, 0.2)" : "rgba(139, 92, 246, 0.15)",
              boxShadow:
                cursorType === "default"
                  ? "0 0 8px 2px rgba(139, 92, 246, 0.3)"
                  : cursorType === "view"
                  ? "0 0 30px 5px rgba(139, 92, 246, 0.2)"
                  : "0 0 15px 3px rgba(139, 92, 246, 0.2)",
            }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
          />

          {/* Text for View type */}
          {cursorType === "view" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute text-[10px] font-bold uppercase tracking-widest text-white"
            >
              View
            </motion.span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

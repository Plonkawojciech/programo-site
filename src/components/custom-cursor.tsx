"use client";

import { useEffect, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { springCursor } from "@/lib/motion";

type CursorVariant = "default" | "pointer" | "view";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const [variant, setVariant] = useState<CursorVariant>("default");

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springX = useSpring(cursorX, springCursor);
  const springY = useSpring(cursorY, springCursor);

  const handleVariantChange = useCallback(
    (newVariant: CursorVariant) => {
      setVariant(newVariant);
    },
    []
  );

  useEffect(() => {
    // Detect touch device
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) {
      setIsTouchDevice(true);
      return;
    }
    setIsTouchDevice(false);

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );
      document.documentElement.removeEventListener(
        "mouseenter",
        handleMouseEnter
      );
    };
  }, [cursorX, cursorY, isVisible]);

  // Listen for interactive element hover
  useEffect(() => {
    if (isTouchDevice) return;

    const handleElementEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      const cursorAttr = target.closest("[data-cursor]")?.getAttribute("data-cursor");

      if (cursorAttr === "view") {
        handleVariantChange("view");
      } else if (cursorAttr === "pointer") {
        handleVariantChange("pointer");
      } else {
        // Default interactive element
        handleVariantChange("pointer");
      }
    };

    const handleElementLeave = () => {
      handleVariantChange("default");
    };

    // Selectors for interactive elements
    const selectors = 'a, button, [data-cursor="pointer"], [data-cursor="view"]';

    const addListeners = () => {
      const elements = document.querySelectorAll(selectors);
      elements.forEach((el) => {
        el.addEventListener("mouseenter", handleElementEnter);
        el.addEventListener("mouseleave", handleElementLeave);
      });
      return elements;
    };

    // Initial setup
    let currentElements = addListeners();

    // Observe DOM changes to catch dynamically added elements
    const observer = new MutationObserver(() => {
      // Remove old listeners
      currentElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleElementEnter);
        el.removeEventListener("mouseleave", handleElementLeave);
      });
      // Re-add
      currentElements = addListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      currentElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleElementEnter);
        el.removeEventListener("mouseleave", handleElementLeave);
      });
    };
  }, [isTouchDevice, handleVariantChange]);

  // Don't render on touch devices or during SSR
  if (isTouchDevice) return null;

  const size =
    variant === "view" ? 60 : variant === "pointer" ? 40 : 20;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999] flex items-center justify-center rounded-full"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        mixBlendMode: "difference",
      }}
      animate={{
        width: size,
        height: size,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        width: { type: "spring", ...springCursor },
        height: { type: "spring", ...springCursor },
        opacity: { duration: 0.15 },
      }}
    >
      <div className="h-full w-full rounded-full bg-white">
        <AnimatePresence>
          {variant === "view" && (
            <motion.span
              key="view-label"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
              className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-black mix-blend-difference"
            >
              View
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

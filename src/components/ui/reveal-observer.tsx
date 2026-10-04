"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

let fallbackObserver: IntersectionObserver | null = null;

function getFallbackObserver() {
  if (fallbackObserver || typeof IntersectionObserver === "undefined") {
    return fallbackObserver;
  }

  fallbackObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || !(entry.target instanceof Element)) continue;
        entry.target.setAttribute("data-inview", "");
        fallbackObserver?.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );

  return fallbackObserver;
}

export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (
      typeof CSS.supports === "function" &&
      CSS.supports("animation-timeline: view()")
    ) {
      return;
    }

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal:not([data-inview])"),
    );
    const observer = getFallbackObserver();

    if (!observer) {
      for (const element of elements) element.setAttribute("data-inview", "");
      return;
    }

    for (const element of elements) observer.observe(element);
    return () => {
      for (const element of elements) observer.unobserve(element);
    };
  }, [pathname]);

  return null;
}

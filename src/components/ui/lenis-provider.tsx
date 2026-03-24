"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode, useEffect } from "react";

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Wymuś przewijanie do góry przy ładowaniu strony
    window.scrollTo(0, 0);

    // Wyłącz natywne zachowanie przeglądarki przywracające pozycję scrolla
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1.1,
        touchMultiplier: 2,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}

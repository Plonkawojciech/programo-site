/**
 * Shared motion constants for premium animations.
 * Easing hierarchy inspired by Cuberto, COLLINS, and Locomotive.
 */

// --- Easing Curves ---

/** Sharp snap-in for elements appearing (Cuberto signature) */
export const easeEntry = [0.16, 1, 0.3, 1] as const;

/** Smooth ease-out for elements leaving */
export const easeExit = [0.4, 0, 0.2, 1] as const;

/** Subtle, quick for hover/micro-interactions */
export const easeHover = [0.25, 0.1, 0.25, 1] as const;

/** Dramatic ease-in-out for page/section transitions */
export const easePageTransition = [0.76, 0, 0.24, 1] as const;

/** Default ease for general-purpose animations */
export const easeDefault = [0.22, 1, 0.36, 1] as const;

// --- Spring Configs ---

/** Cursor follow spring */
export const springCursor = { stiffness: 150, damping: 15, mass: 0.1 };

/** Magnetic button spring */
export const springMagnetic = { stiffness: 150, damping: 15, mass: 0.27 };

/** Gentle spring for layout shifts */
export const springGentle = { stiffness: 100, damping: 20, mass: 0.5 };

// --- Duration Presets ---

export const durationFast = 0.3;
export const durationMedium = 0.6;
export const durationSlow = 0.9;
export const durationPageTransition = 1.2;

// --- Stagger Presets ---

/** Per-character stagger for split text */
export const staggerChar = 0.03;

/** Per-word stagger for paragraph reveals */
export const staggerWord = 0.02;

/** Per-item stagger for list/grid items */
export const staggerItem = 0.08;

// --- Reusable Variants ---

export const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durationMedium, ease: easeEntry },
  },
};

export const fadeInUpStagger = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * staggerItem,
      duration: durationMedium,
      ease: easeEntry,
    },
  }),
};

export const clipRevealUp = {
  hidden: { clipPath: "inset(100% 0 0 0)" },
  visible: {
    clipPath: "inset(0 0 0 0)",
    transition: { duration: durationSlow, ease: easeEntry },
  },
};

export const clipRevealLeft = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  visible: {
    clipPath: "inset(0 0 0 0)",
    transition: { duration: durationSlow, ease: easeEntry },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durationMedium, ease: easeEntry },
  },
};

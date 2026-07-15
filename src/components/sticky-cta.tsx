"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import ContactCtaLink from "@/components/contact-cta-link";

const PHONE = "+48509123434";
const PHONE_HREF = `tel:${PHONE}`;

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M6.5 3.5l3 1 1 4-2 1.5a11 11 0 005 5l1.5-2 4 1 1 3a2 2 0 01-2 2.3A16 16 0 014.2 6.5 2 2 0 016.5 3.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Fixed scroll threshold (not viewport-relative) — the CTA should appear at a
// consistent point regardless of hero height across pages/landings.
const SHOW_AFTER_SCROLL_PX = 400;

/**
 * Persistent contact CTA.
 * - Appears once the user has scrolled past SHOW_AFTER_SCROLL_PX.
 * - Hides whenever the contact section (#kontakt-main) is on screen.
 * - Two direct actions: tap-to-call (tracked as contact_click) + scroll-to-form.
 * - Mobile: full-width bottom bar. Desktop: floating pills, bottom-right.
 */
export default function StickyCta() {
  const { t } = useI18n();
  const [scrolledPastThreshold, setScrolledPastThreshold] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolledPastThreshold(window.scrollY > SHOW_AFTER_SCROLL_PX);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = document.getElementById("kontakt-main");
    if (!el) {
      setContactVisible(false);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setContactVisible(entry.isIntersecting),
      { rootMargin: "0px 0px -20% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  });

  // tel:/mailto: clicks are tracked globally via event delegation in
  // AnalyticsTracker — no per-link onClick here (avoids double contact_click).
  const show = scrolledPastThreshold && !contactVisible;

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Mobile: full-width bottom bar, two big actions. Safe-area padding
              keeps the bar clear of the iOS home indicator. */}
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden fixed inset-x-0 bottom-0 z-[var(--z-sticky)] grid grid-cols-2 gap-3 px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-4 bg-gradient-to-t from-surface via-surface/95 to-transparent backdrop-blur-sm"
          >
            <a
              href={PHONE_HREF}
              className="flex min-h-[48px] items-center justify-center gap-2.5 rounded-full bg-primary px-5 py-4 text-base font-semibold text-on-primary shadow-lg shadow-black/20 transition-transform active:scale-[0.98]"
            >
              <PhoneIcon className="h-5 w-5" />
              {t("sticky.call")}
            </a>
            <ContactCtaLink className="flex min-h-[48px] items-center justify-center gap-2 rounded-full border-2 border-primary bg-surface px-5 py-4 text-base font-semibold text-primary shadow-lg shadow-black/10 transition-transform active:scale-[0.98]">
              {t("sticky.write")} <span aria-hidden="true">→</span>
            </ContactCtaLink>
          </motion.div>

          {/* Desktop: floating pills, bottom-right */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:flex fixed bottom-6 right-6 z-[var(--z-sticky)] items-center gap-3"
          >
            <a
              href={PHONE_HREF}
              className="flex items-center gap-2.5 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-on-primary shadow-xl shadow-black/25 transition-all hover:gap-3.5 hover:bg-primary-container"
            >
              <PhoneIcon className="h-4.5 w-4.5" />
              {t("sticky.call")}: 509 123 434
            </a>
            <ContactCtaLink className="flex items-center gap-2 rounded-full border border-outline-variant/70 bg-surface px-6 py-3.5 text-sm font-semibold text-on-surface shadow-lg shadow-black/10 transition-colors hover:border-primary hover:text-primary">
              {t("sticky.write")} <span aria-hidden="true">→</span>
            </ContactCtaLink>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

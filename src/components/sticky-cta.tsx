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
 * - Mobile only (full-width bottom bar). Desktop already has a phone number
 *   and a CTA in the navbar — a second floating CTA there was one too many.
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

  // Hide while the main contact section OR any lead form is on screen: a bar
  // that says "Napisz" on top of the form the visitor is already filling in
  // is noise, and on a phone it covers the submit button.
  useEffect(() => {
    const targets = [
      document.getElementById("kontakt-main"),
      ...Array.from(document.querySelectorAll("form")),
    ].filter((el): el is HTMLElement => el instanceof HTMLElement);
    if (targets.length === 0) return; // contactVisible already starts as false
    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }
        setContactVisible(visible.size > 0);
      },
      { rootMargin: "0px 0px -20% 0px" }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // tel:/mailto: clicks are tracked globally via event delegation in
  // AnalyticsTracker — no per-link onClick here (avoids double contact_click).
  const show = scrolledPastThreshold && !contactVisible;

  return (
    <AnimatePresence>
      {show && (
        // Mobile only, full-width bottom bar, two big actions. Safe-area
        // padding keeps the bar clear of the iOS home indicator. Desktop
        // dropped its floating pill duplicate — the navbar already carries
        // a phone number and a CTA there.
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          // Lifted above the cookie bar while that is open (see CookieBanner).
          style={{ bottom: "var(--consent-bar-h, 0px)" }}
          className="md:hidden fixed inset-x-0 z-[var(--z-sticky)] grid grid-cols-2 gap-3 px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-4 bg-gradient-to-t from-surface via-surface/95 to-transparent backdrop-blur-sm"
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
      )}
    </AnimatePresence>
  );
}

"use client";

import Link from "next/link";
import type { ReactNode, MouseEvent } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
};

/**
 * Smart CTA link to the contact form.
 * - If the contact section (#kontakt-main) exists on the current page,
 *   smooth-scrolls to it instead of navigating.
 * - Otherwise navigates to /kontakt#kontakt-main; the browser will
 *   auto-scroll to the section on load.
 */
export default function ContactCtaLink({
  children,
  className,
  onNavigate,
}: Props) {
  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    // Respect modifier clicks / middle-click for "open in new tab" etc.
    if (
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0
    ) {
      onNavigate?.();
      return;
    }

    const el = document.getElementById("kontakt-main");
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Update URL hash without triggering a jump
      if (typeof window !== "undefined" && window.history?.replaceState) {
        window.history.replaceState(null, "", "#kontakt-main");
      }
    }
    onNavigate?.();
  }

  return (
    <Link
      href="/kontakt#kontakt-main"
      onClick={handleClick}
      className={className}
    >
      {children}
    </Link>
  );
}

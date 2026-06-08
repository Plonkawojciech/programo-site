import Link from "next/link";
import type { ReactNode } from "react";

// Canonical CTA button — identical classes to the homepage (MainIntro) so every
// call-to-action across the site (homepage + Ads landings) is visually consistent:
// pill, uppercase tracking, animated arrow that nudges on hover. Server-compatible
// (no hooks); renders <a> for #anchors/tel/mailto/external, <Link> for routes.
const base =
  "inline-flex items-center justify-center gap-3 rounded-full px-6 py-3.5 text-sm font-medium uppercase tracking-widest transition-all hover:gap-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2";

const variants = {
  primary: "bg-primary text-on-primary hover:bg-primary-container",
  secondary: "border border-on-surface/30 text-on-surface hover:border-primary",
} as const;

export default function CtaButton({
  href,
  variant = "primary",
  arrow = true,
  external = false,
  className = "",
  children,
}: {
  href: string;
  variant?: keyof typeof variants;
  arrow?: boolean;
  external?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const cls = `${base} ${variants[variant]} ${className}`;
  const content = (
    <>
      {children}
      {arrow && <span aria-hidden="true">→</span>}
    </>
  );

  const isPlainAnchor =
    external ||
    href.startsWith("tel:") ||
    href.startsWith("mailto:") ||
    href.startsWith("#");

  if (isPlainAnchor) {
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}

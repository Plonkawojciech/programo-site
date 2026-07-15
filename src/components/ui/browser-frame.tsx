"use client";

import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Browser window frame around a desktop screenshot. Chrome bar with three dots
 * and an address field showing the real domain (`url`). Renders `children` if
 * provided, otherwise the `src` screenshot.
 */
export default function BrowserFrame({
  url,
  src,
  alt,
  width = 1440,
  height = 900,
  priority = false,
  className,
  children,
}: {
  url: string;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  // Show a clean host (no protocol / trailing slash) in the address field.
  const host = url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-outline-variant/60 bg-surface-container shadow-[0_30px_60px_-25px_rgba(0,0,0,0.45)] ${className ?? ""}`}
    >
      {/* Chrome bar */}
      <div className="flex items-center gap-3 border-b border-outline-variant/50 bg-surface-container-high px-4 py-2.5">
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md bg-surface px-3 py-1.5 text-xs text-on-surface-variant">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V7a4 4 0 018 0v4" />
          </svg>
          <span className="truncate">{host}</span>
        </div>
      </div>
      {/* Content */}
      <div className="relative bg-surface">
        {children ?? (src && alt ? (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            priority={priority}
            sizes="(max-width: 768px) 100vw, 720px"
            className="h-auto w-full"
          />
        ) : null)}
      </div>
    </div>
  );
}

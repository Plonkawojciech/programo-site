"use client";

import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Premium browser-window frame around a desktop screenshot.
 *
 * Visual construction (outside → in):
 *  1. gradient bezel ring (hairline, reads as machined edge),
 *  2. chassis with layered green-tinted shadows (ambient + key + contact),
 *  3. macOS-style chrome bar: traffic lights, centered address capsule,
 *  4. content with a top hairline and a faint diagonal glass sheen.
 *
 * `tone` switches the chrome bar for dark screenshots ("dark") so frames can
 * match the product inside (auto = follow site theme tokens).
 */
export default function BrowserFrame({
  url,
  src,
  alt,
  width = 1440,
  height = 900,
  priority = false,
  tone = "auto",
  sizes = "(max-width: 768px) 100vw, 720px",
  className,
  children,
}: {
  url: string;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  tone?: "auto" | "dark";
  sizes?: string;
  className?: string;
  children?: ReactNode;
}) {
  const host = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const dark = tone === "dark";

  return (
    <div
      className={`group/frame rounded-[20px] p-px ${
        dark
          ? "bg-gradient-to-b from-white/20 via-white/8 to-black/40"
          : "bg-gradient-to-b from-white/90 via-outline-variant/40 to-outline-variant/70 dark:from-white/15 dark:via-white/5 dark:to-black/30"
      } shadow-[0_1px_2px_rgba(5,31,32,0.10),0_12px_24px_-8px_rgba(5,31,32,0.18),0_48px_96px_-24px_rgba(5,31,32,0.30)] ${className ?? ""}`}
    >
      <div
        className={`relative overflow-hidden rounded-[19px] ${
          dark ? "bg-[#101614]" : "bg-surface-container"
        }`}
      >
        {/* Chrome bar — neutral warm off-white, independent of the site theme so it
            never clashes with the screenshot (dark screenshots use tone="dark"). */}
        <div
          className={`relative flex items-center px-4 py-2.5 ${
            dark
              ? "border-b border-white/[0.07] bg-[#181f1c]"
              : "border-b border-black/[0.07] bg-gradient-to-b from-[#FAF8F4] to-[#EFEBE3] shadow-[inset_0_-1px_0_rgba(255,255,255,0.5)]"
          }`}
        >
          {/* Traffic lights */}
          <div className="flex shrink-0 items-center gap-[7px]" aria-hidden="true">
            <span className="h-[11px] w-[11px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#ff8a80,#ff5f57_60%)] shadow-[inset_0_0_1px_rgba(0,0,0,0.25)]" />
            <span className="h-[11px] w-[11px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffd54f,#febc2e_60%)] shadow-[inset_0_0_1px_rgba(0,0,0,0.2)]" />
            <span className="h-[11px] w-[11px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#69f0ae,#28c840_60%)] shadow-[inset_0_0_1px_rgba(0,0,0,0.2)]" />
          </div>
          {/* Centered address capsule (macOS Safari style) */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 flex max-w-[62%] -translate-x-1/2 -translate-y-1/2 items-center gap-1.5">
            <span
              className={`flex min-w-0 items-center gap-1.5 rounded-full px-3.5 py-[5px] text-[11px] leading-none tracking-wide ${
                dark
                  ? "bg-white/[0.07] text-white/60 shadow-[inset_0_1px_2px_rgba(0,0,0,0.35)]"
                  : "bg-white/85 text-[#5b6360] shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-3 w-3 shrink-0 opacity-70"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                aria-hidden="true"
              >
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V7a4 4 0 018 0v4" />
              </svg>
              <span className="truncate font-medium">{host}</span>
            </span>
          </div>
        </div>

        {/* Content */}
        <div className={`relative ${dark ? "bg-[#0c1210]" : "bg-surface"}`}>
          {children ??
            (src && alt ? (
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                priority={priority}
                sizes={sizes}
                className="h-auto w-full"
              />
            ) : null)}
          {/* Glass sheen — faint diagonal highlight, never blocks content */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0.035)_18%,transparent_34%)] mix-blend-soft-light"
          />
          {/* Top hairline separating bar from content */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-0 top-0 h-px ${
              dark ? "bg-white/[0.06]" : "bg-white/60 dark:bg-white/10"
            }`}
          />
        </div>
      </div>
    </div>
  );
}

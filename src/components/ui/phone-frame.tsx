"use client";

import Image from "next/image";

/**
 * Realistic iPhone frame around a mobile screenshot.
 *
 * Construction (outside → in): titanium edge with a vertical sheen and physical
 * side buttons, deep green-tinted layered shadow, black inner bezel, screen with
 * a faint glass glare. Dynamic island sits over the screenshot.
 *
 * `scrollOnHover` eases the (taller-than-frame) screenshot upward on hover to
 * reveal more of the page — desktop only.
 */
export default function PhoneFrame({
  src,
  alt,
  width = 390,
  height = 844,
  scrollOnHover = false,
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  scrollOnHover?: boolean;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`group relative aspect-[9/19.5] w-full select-none ${className ?? ""}`}>
      {/* Physical side buttons (behind the chassis edge) */}
      <div aria-hidden="true" className="absolute -left-[2px] top-[22%] h-[7%] w-[3px] rounded-l-md bg-neutral-700" />
      <div aria-hidden="true" className="absolute -left-[2px] top-[32%] h-[7%] w-[3px] rounded-l-md bg-neutral-700" />
      <div aria-hidden="true" className="absolute -right-[2px] top-[26%] h-[11%] w-[3px] rounded-r-md bg-neutral-700" />

      {/* Titanium edge + green-tinted layered shadow */}
      <div className="absolute inset-0 rounded-[44px] bg-[linear-gradient(180deg,#8a8f8d_0%,#4a4f4d_8%,#2b2f2e_50%,#4a4f4d_92%,#6a6f6d_100%)] p-[3px] shadow-[0_2px_4px_rgba(5,31,32,0.18),0_18px_36px_-12px_rgba(5,31,32,0.35),0_56px_100px_-32px_rgba(5,31,32,0.4)]">
        {/* Inner bezel */}
        <div className="relative h-full w-full overflow-hidden rounded-[41px] bg-black p-[6px]">
          {/* Screen */}
          <div className="relative h-full w-full overflow-hidden rounded-[35px] bg-surface">
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              priority={priority}
              sizes="(max-width: 768px) 60vw, 300px"
              className={`w-full ${
                scrollOnHover
                  ? "h-auto transition-transform duration-[3500ms] ease-linear md:group-hover:-translate-y-[38%]"
                  : "h-full object-cover object-top"
              }`}
            />
            {/* Glass glare — faint corner highlight */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[35px] bg-[linear-gradient(155deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.04)_16%,transparent_32%)] mix-blend-soft-light"
            />
          </div>
          {/* Dynamic island with camera dot */}
          <div className="pointer-events-none absolute left-1/2 top-[10px] z-10 flex h-[26px] w-[92px] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-[9px]">
            <span className="h-[8px] w-[8px] rounded-full bg-[#1a2030] shadow-[inset_0_0_2px_rgba(120,140,255,0.5)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

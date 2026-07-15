"use client";

import Image from "next/image";

/**
 * Realistic iPhone frame around a mobile screenshot. Thin metallic edge, deep
 * rounded corners, dynamic island and a soft deep shadow.
 *
 * `scrollOnHover` makes the screenshot ease upward on hover to reveal more of
 * the page (desktop only — the effect is disabled on touch since there is no
 * hover). The screenshot is intentionally taller than the frame so it has room
 * to travel.
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
      {/* Metallic outer edge + deep shadow */}
      <div className="absolute inset-0 rounded-[44px] bg-gradient-to-b from-neutral-600 via-neutral-800 to-neutral-900 p-[3px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)]">
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
          </div>
          {/* Dynamic island */}
          <div className="pointer-events-none absolute left-1/2 top-[10px] z-10 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-black" />
        </div>
      </div>
    </div>
  );
}

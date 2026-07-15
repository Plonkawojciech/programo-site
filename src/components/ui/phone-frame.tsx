"use client";

import Image from "next/image";

/**
 * Realistic iPhone frame around a mobile screenshot.
 *
 * All chassis dimensions (corner radii, bezel, dynamic island, side buttons)
 * are in container-query units, so the phone keeps true iPhone proportions at
 * ANY rendered width — a 120px card thumb and a 320px hero phone look
 * identical, just scaled. The wrapper sets `container-type: inline-size`.
 *
 * `scrollOnHover` eases the (taller-than-frame) screenshot upward on hover to
 * reveal more of the page — desktop only.
 * `fadeBottom` fades the lower edge of the screen to transparent — used when
 * the frame is intentionally cropped in a card so the cut reads as a soft peek.
 */
export default function PhoneFrame({
  src,
  alt,
  width = 390,
  height = 844,
  scrollOnHover = false,
  fadeBottom = false,
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  scrollOnHover?: boolean;
  fadeBottom?: boolean;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`group relative aspect-[9/19.5] w-full select-none [container-type:inline-size] ${className ?? ""}`}
    >
      {/* Physical side buttons (behind the chassis edge) */}
      <div aria-hidden="true" className="absolute -left-[0.8cqw] top-[21%] h-[6.5%] w-[1.2cqw] rounded-l-[1cqw] bg-neutral-700" />
      <div aria-hidden="true" className="absolute -left-[0.8cqw] top-[30%] h-[6.5%] w-[1.2cqw] rounded-l-[1cqw] bg-neutral-700" />
      <div aria-hidden="true" className="absolute -right-[0.8cqw] top-[24.5%] h-[10.5%] w-[1.2cqw] rounded-r-[1cqw] bg-neutral-700" />

      {/* Titanium edge + green-tinted layered shadow */}
      <div className="absolute inset-0 rounded-[16cqw] bg-[linear-gradient(180deg,#8a8f8d_0%,#4a4f4d_8%,#2b2f2e_50%,#4a4f4d_92%,#6a6f6d_100%)] p-[1cqw] shadow-[0_2px_4px_rgba(5,31,32,0.18),0_18px_36px_-12px_rgba(5,31,32,0.35),0_56px_100px_-32px_rgba(5,31,32,0.4)]">
        {/* Inner bezel */}
        <div className="relative h-full w-full overflow-hidden rounded-[15cqw] bg-black p-[2.2cqw]">
          {/* Screen */}
          <div
            className={`relative h-full w-full overflow-hidden rounded-[12.5cqw] bg-surface ${
              fadeBottom
                ? "[mask-image:linear-gradient(to_bottom,black_78%,transparent_100%)]"
                : ""
            }`}
          >
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
              className="pointer-events-none absolute inset-0 rounded-[12.5cqw] bg-[linear-gradient(155deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.04)_16%,transparent_32%)] mix-blend-soft-light"
            />
          </div>
          {/* Dynamic island with camera dot — true iPhone proportions */}
          <div className="pointer-events-none absolute left-1/2 top-[3cqw] z-10 flex h-[8.2cqw] w-[29cqw] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-[2.6cqw] ring-1 ring-white/5">
            <span className="h-[3.4cqw] w-[3.4cqw] rounded-full bg-[#1a2030] shadow-[inset_0_0_2px_rgba(120,140,255,0.5)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

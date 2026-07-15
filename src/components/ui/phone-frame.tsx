"use client";

import Image from "next/image";

/**
 * iPhone frame around a mobile screenshot — construction ported from the
 * estalo.pl mockup (.es-iphone), which is the reference look: a SINGLE
 * titanium rail (diagonal 145° graphite gradient + inset highlight/shadow
 * rings) with the screen set directly inside, one deep ambient shadow and a
 * small contact shadow. No separate black bezel layer, no camera dot.
 *
 * Dimensions are in container-query units so the phone keeps identical
 * proportions at every rendered width (reference: 286px-wide estalo mockup).
 *
 * `scrollOnHover` eases the (taller-than-frame) screenshot upward on hover to
 * reveal more of the page — desktop only.
 * `fadeBottom` fades the lower screen edge — used when a card intentionally
 * crops the frame so the cut reads as a soft peek.
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
    <div className={`relative w-full [container-type:inline-size] ${className ?? ""}`}>
      {/* Titanium side buttons (volume rocker + power) */}
      <div aria-hidden="true" className="absolute -left-[0.7cqw] top-[24%] h-[18%] w-[0.9cqw] rounded-[1cqw] bg-gradient-to-b from-[#51565e] to-[#20242b]" />
      <div aria-hidden="true" className="absolute -right-[0.7cqw] top-[31%] h-[27%] w-[0.9cqw] rounded-[1cqw] bg-gradient-to-b from-[#51565e] to-[#20242b]" />

      {/* Rail: single layer — diagonal graphite gradient + inset rings */}
      <div className="group relative aspect-[286/600] w-full select-none rounded-[16.4cqw] bg-[linear-gradient(145deg,#4a4f57_0%,#20242b_16%,#0c0e12_50%,#20242b_84%,#4a4f57_100%)] p-[3.5cqw] shadow-[0_2px_3px_rgba(2,6,23,0.14),0_48px_80px_-30px_rgba(2,6,23,0.55),inset_0_0_0_1px_rgba(255,255,255,0.16),inset_0_0_2px_2.5px_rgba(0,0,0,0.5)]">
        {/* Screen — set directly in the rail, hairline inset keeps the edge crisp */}
        <div
          className={`relative h-full w-full overflow-hidden rounded-[13.3cqw] bg-surface shadow-[inset_0_0_0_1.5px_rgba(0,0,0,0.55)] ${
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
        </div>
        {/* Dynamic island */}
        <div className="pointer-events-none absolute left-1/2 top-[5.6cqw] z-10 h-[8.4cqw] w-[28.7cqw] -translate-x-1/2 rounded-full bg-[#05070a] shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.05)]" />
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { durationMedium, easeEntry } from "@/lib/motion";

/**
 * Real clients (proper nouns — not translated). Content deck 1.2.
 * Ordered by how much we want to be judged on them, not alphabetically.
 *
 * Each mark is a flat alpha silhouette, not the client's colour artwork. The
 * sources are a JPEG with a baked-in white background, a navy+gold PNG, a gold
 * gradient ribbon and a photo of a printed swim cap; dropped into one row as-is
 * they read as scraped debris. As masks they carry only shape, so the row is
 * tinted from `currentColor` — one asset per client covers both themes, and no
 * client's brand colour fights the forest green.
 *
 * `ratio` is the mask's own width/height after trimming to its ink. `scale`
 * multiplies `--logo-h` and is normalised by *optical area*, not bounding-box
 * height: at equal height a 1.13:1 badge swamps a 4.45:1 wordmark.
 *
 * Skup Nieruchomości has no mark anywhere — its own site carries only our logo —
 * so it stays typeset, in the same colour at the same weight.
 */
type Client = { name: string; mask?: string; ratio?: number; scale?: number };

const CLIENTS: Client[] = [
  { name: "Jedmar", mask: "/logos/jedmar.png", ratio: 4.447, scale: 1 },
  // Above what equal area would give (1.85). A crest carrying two rings of
  // hairline type needs the extra size or it collapses into a smudge — equal
  // area is the right default, not a rule.
  { name: "WKS Poznań", mask: "/logos/wks-poznan.png", ratio: 1.13, scale: 2.35 },
  { name: "Skup Nieruchomości" },
  // Nudged up: its strokes are hairline next to the other three.
  { name: "Domki Poznaniak", mask: "/logos/domki-poznaniak.png", ratio: 3.984, scale: 1.18 },
  { name: "W. Safe Finance", mask: "/logos/wsafefinance.png", ratio: 3.052, scale: 1.21 },
];

// Bezargumentowy default export — używany też przez landingi (/strony-internetowe,
// /sklepy-internetowe). Nie dodawać propsów.
export default function TrustBar() {
  const { t } = useI18n();

  return (
    <section className="relative bg-surface border-t border-outline-variant/20">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24 py-section-tight">
        {/* Client logo strip — treated as above-the-fold like the hero:
            initial={false} instead of whileInView so it never renders as
            opacity:0 in SSR HTML (motion-report.md P0). */}
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: durationMedium, ease: easeEntry }}
          className="flex flex-col gap-6"
        >
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-on-surface-variant">
            {t("home.trust.eyebrow")}
          </span>
          {/* `--logo-h` is the one dial for the whole row; every mark scales off
              it, so the strip stays proportional at each breakpoint. 60% ink
              rather than the 45% the wordmarks used to run at — hairline logo
              strokes need the weight that display type does not (5.8:1 dark,
              4.5:1 light, both past AA). */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-6 text-on-surface/60 md:gap-x-14 [--logo-h:1.25rem] md:[--logo-h:1.75rem]">
            {CLIENTS.map((c) =>
              c.mask ? (
                <span
                  key={c.name}
                  role="img"
                  aria-label={c.name}
                  className="block shrink-0 bg-current"
                  style={{
                    height: `calc(var(--logo-h) * ${c.scale})`,
                    width: `calc(var(--logo-h) * ${(c.scale ?? 1) * (c.ratio ?? 1)})`,
                    // Safari still wants the prefix for the mask longhands.
                    WebkitMaskImage: `url("${c.mask}")`,
                    maskImage: `url("${c.mask}")`,
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                  }}
                />
              ) : (
                // Sized to the marks' cap height rather than to `--logo-h`: the
                // masks are full lockups (a wordmark over a second line, or a
                // badge), so matching their box height would set this at twice
                // the optical weight of everything beside it.
                <span
                  key={c.name}
                  className="font-headline text-[length:calc(var(--logo-h)*0.66)] font-bold tracking-tight"
                >
                  {c.name}
                </span>
              ),
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

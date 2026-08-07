"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { durationMedium, easeEntry } from "@/lib/motion";

/**
 * One claim: other people's judgement.
 *
 * A previous version paired this with a second labelled row carrying our own
 * SaaS marks. It was cut on the owner's call, and he was right — two labelled
 * rows of logos stop reading as evidence and start reading as a logo wall,
 * which is the template this site exists to avoid. Our own products already get
 * a full section further down with screenshots and honest status labels; a 20px
 * silhouette of a name nobody recognises added nothing to that and cost the
 * client row its focus.
 *
 * Proper nouns throughout — never translated.
 *
 * Every mark is a flat alpha silhouette, not the owner's colour artwork. The
 * sources are a JPEG with a baked-in white background, a navy+gold PNG, a gold
 * gradient ribbon and a photo of a printed swim cap; dropped into one row as-is
 * they read as scraped debris. As masks they carry only shape, so the row is
 * tinted from `currentColor` — one asset per name covers both themes, and no
 * brand colour fights the forest green.
 *
 * `ratio` is the mask's own width/height after trimming to its ink. `scale`
 * multiplies `--logo-h` and is normalised by *optical area*, not bounding-box
 * height: at equal height a 1.13:1 badge swamps a 4.45:1 wordmark.
 */
type Mark = { name: string; mask?: string; ratio?: number; scale?: number };

/**
 * Ordered by how much we want to be judged on them, not alphabetically.
 *
 * Skup Nieruchomości has no mark anywhere — its own site carries only our logo —
 * so it stays typeset, in the same colour at the same weight.
 */
const CLIENTS: Mark[] = [
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

/** Shared mask geometry. Safari still wants the prefix for the longhands. */
function maskStyle(m: Mark): React.CSSProperties {
  const scale = m.scale ?? 1;
  return {
    height: `calc(var(--logo-h) * ${scale})`,
    width: `calc(var(--logo-h) * ${scale * (m.ratio ?? 1)})`,
    WebkitMaskImage: `url("${m.mask}")`,
    maskImage: `url("${m.mask}")`,
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
  };
}

// Bezargumentowy default export — używany też przez landingi (/strony-internetowe,
// /sklepy-internetowe). Nie dodawać propsów.
export default function TrustBar() {
  const { t } = useI18n();

  return (
    <section className="relative bg-surface border-t border-on-surface-variant/20">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24 py-section-tight">
        {/* Treated as above-the-fold like the hero: initial={false} instead of
            whileInView so it never renders as opacity:0 in SSR HTML
            (motion-report.md P0).

            `--logo-h` is the one dial for the whole band; every mark scales off
            it, so the row stays proportional at each breakpoint. 60% ink rather
            than the 45% the wordmarks used to run at — hairline logo strokes need
            the weight that display type does not.

            From md the label sits beside the marks rather than above them, so
            the band reads as one line of specification instead of a stacked
            heading. On a phone there is no room for that column. */}
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: durationMedium, ease: easeEntry }}
          className="flex flex-col gap-3.5 text-on-surface/60 md:flex-row md:items-center md:gap-10 [--logo-h:1.25rem] md:[--logo-h:1.75rem]"
        >
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.28em] text-on-surface-variant md:w-36 md:text-xs lg:w-44">
            {t("home.trust.eyebrow")}
          </span>

          {/* Ragged wrap: five marks of wildly different widths, one of them
              typeset. A grid would column-align things that have no reason to
              align and open holes beside the narrow ones. */}
          <div className="flex flex-wrap items-center gap-x-7 gap-y-5 md:gap-x-12">
            {CLIENTS.map((c) =>
              c.mask ? (
                <span
                  key={c.name}
                  role="img"
                  aria-label={c.name}
                  className="block shrink-0 bg-current"
                  style={maskStyle(c)}
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

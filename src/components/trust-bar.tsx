"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { durationMedium, easeEntry } from "@/lib/motion";

/**
 * Two claims, not one. "Zaufali nam" is other people's judgement; "Własne
 * produkty" is our own money and time. They are different kinds of credibility
 * and merging them under one heading would say our own products hired us.
 * Hence two labelled rows in one band: the density does the work the old single
 * row could not, and each group still says something true.
 *
 * Proper nouns throughout — never translated.
 *
 * Every mark is a flat alpha silhouette, not the owner's colour artwork. The
 * client sources are a JPEG with a baked-in white background, a navy+gold PNG,
 * a gold gradient ribbon and a photo of a printed swim cap; dropped into one row
 * as-is they read as scraped debris. As masks they carry only shape, so the row
 * is tinted from `currentColor` — one asset per name covers both themes, and no
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

/**
 * Our own SaaS, in the order they are launched: Estalo runs in production with
 * billing, Rejestr Pro's web build is live, Solvio and PoolTimer are in
 * development. ePortal Prawny is left out — it has not launched.
 *
 * These four ship *with their names*, unlike the client row. A client logo works
 * mark-only because a Poznań business owner may recognise it; nobody recognises
 * Estalo or Solvio, so a bare mark would carry no information and would only
 * dilute the marks beside it. The name is the payload, the mark is the anchor.
 *
 * Estalo's mark is its real one, lifted from estalo.pl with the tile background
 * removed. The other three had no artwork at all — Rejestr Pro and Solvio were
 * still serving the stock Vercel favicon — so these are drawn here: one stroke
 * weight, rounded joins, one gesture each, and four silhouettes that cannot be
 * mistaken for one another at 20px (pitched roof / colonnade / torn receipt /
 * the only circle in the set).
 *
 * `scale` here equalises optical area the same way the client row does, then
 * nudges for ink that sits outside the mass: Solvio's torn tail and PoolTimer's
 * crown add bounding-box height without adding weight, so both go up.
 */
const PRODUCTS: Mark[] = [
  { name: "Estalo", mask: "/logos/estalo.svg", ratio: 0.947, scale: 1 },
  { name: "Rejestr Pro", mask: "/logos/rejestr-pro.svg", ratio: 1.261, scale: 0.88 },
  { name: "Solvio", mask: "/logos/solvio.svg", ratio: 0.8, scale: 1.12 },
  { name: "PoolTimer", mask: "/logos/pooltimer.svg", ratio: 0.827, scale: 1.14 },
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

/**
 * From md up the label sits beside its row, so the two claims read as one
 * two-line specification instead of two stacked sections, and a fixed column
 * width keeps both rows of marks starting on the same left edge.
 *
 * On a phone there is no room for that column, so the label goes above — and
 * the row itself changes shape, because free wrapping at 375px is what breaks
 * first. `items` lets each row pick its own mobile behaviour: ragged wrap is
 * fine for bare client marks, a fixed two-column grid is not optional for the
 * product lockups.
 */
function Row({
  label,
  items,
  children,
}: {
  label: string;
  items: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3.5 md:flex-row md:items-center md:gap-10">
      <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.28em] text-on-surface-variant md:w-36 md:text-xs lg:w-44">
        {label}
      </span>
      <div className={items}>{children}</div>
    </div>
  );
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
            it, so both rows stay proportional at each breakpoint. 60% ink rather
            than the 45% the wordmarks used to run at — hairline logo strokes need
            the weight that display type does not. */}
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: durationMedium, ease: easeEntry }}
          className="flex flex-col gap-7 text-on-surface/60 md:gap-8 [--logo-h:1.25rem] md:[--logo-h:1.75rem]"
        >
          {/* Ragged wrap: five marks of wildly different widths, one of them
              typeset. A grid would column-align things that have no reason to
              align and open holes beside the narrow ones. */}
          <Row
            label={t("home.trust.eyebrow")}
            items="flex flex-wrap items-center gap-x-7 gap-y-5 md:gap-x-12"
          >
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
          </Row>

          {/* This rule is the whole argument of the section: it is what makes
              two claims read as two claims instead of one long row. It has to
              be visible. outline-variant cannot do that — it is --theme-border-1,
              #163832 on #051F20, which tops out at 1.36:1 at FULL opacity and
              measured 1.1:1 at the /40 this used to run at. on-surface-variant
              is the one token that genuinely inverts with the theme, so a
              single value gives a real hairline in both. */}
          <div className="h-px bg-on-surface-variant/25" />

          {/* Four lockups of similar length, so on a phone they go into a fixed
              2×2 grid instead of wrapping 3+1. Wrapping would leave the fourth
              name alone on its own line looking like an afterthought; the grid
              reads as a set, which is the point. From md it is a plain row. */}
          <Row
            label={t("home.trust.own")}
            items="grid grid-cols-2 items-center gap-x-4 gap-y-4 md:flex md:flex-wrap md:gap-x-12 md:gap-y-5"
          >
            {PRODUCTS.map((p) => (
              // The mark is decorative here — the name is right beside it, and
              // labelling both would have a screen reader say "Estalo Estalo".
              <span key={p.name} className="flex shrink-0 items-center gap-2.5">
                <span aria-hidden className="block shrink-0 bg-current" style={maskStyle(p)} />
                <span className="font-headline text-[length:calc(var(--logo-h)*0.66)] font-bold tracking-tight">
                  {p.name}
                </span>
              </span>
            ))}
          </Row>
        </motion.div>
      </div>
    </section>
  );
}

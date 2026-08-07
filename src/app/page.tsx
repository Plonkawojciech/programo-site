import HomeHero from "@/components/home/hero";
import TrustBar from "@/components/trust-bar";
import ClientWork from "@/components/home/client-work";
import OwnProducts from "@/components/home/own-products";
import ServicesOverview from "@/components/home/services-overview";
import Process from "@/components/home/process";
import Faq from "@/components/home/faq";
import FaqSchema from "@/components/home/faq-schema";
import ContactBookend from "@/components/home/contact-bookend";

/**
 * Eight sections, read top to bottom as one argument:
 *   who we are → who trusts us → proof we've done it → what we do → how it
 *   goes → the objections → leave your number.
 *
 * Each section owns its own background and vertical rhythm; the order here is
 * the only thing this file decides. Three rules hold it together:
 *
 *   1. No two adjacent sections share a rhythm tier, so weight alternates
 *      instead of every band feeling equally important. The tiers in
 *      globals.css are HALF a boundary — what a visitor sees between two
 *      sections is one section's bottom tier plus the next one's top tier.
 *      Top to bottom at 1440px that reads 156 / 156 / 104 / 132 / 132 / 132 /
 *      156, then 136 down to the footer.
 *   2. ClientWork and OwnProducts deliberately share `bg-surface-dim` with no
 *      divider between them — they are two bands of one sunken room ("work we
 *      did for clients" / "work we did for ourselves"), not two sections. That
 *      104px seam is the tightest boundary on the page and has to stay that
 *      way; ClientWork carries an asymmetric `pb-section-tight` to hold it.
 *      Since 2026-08-07 the pair also reads as one showcase: a wide rail of
 *      three client projects, then a quiet row of five small product tiles.
 *      Both are horizontal snap rails, so the seam has to stay tight or the
 *      second row stops looking like the footnote to the first.
 *   3. TrustBar sits directly under the hero because logos and numbers are the
 *      cheapest proof to read; it is also shared with the Ads landings, so it
 *      stays a no-prop default export. ContactBookend closes the page because
 *      it owns the `#kontakt` anchor every navbar and landing CTA points at,
 *      and it wraps QuickContact (`#kontakt-main`, the FAQ's exit link).
 *
 * A ninth section, Founders, sat between Process and Faq until 2026-08-05. It
 * rendered the same two names and two phone numbers QuickContact already shows
 * in its aside, and once the owner cleared both bios it was two names over a
 * 241px void. Its one line worth keeping ("no departments a project travels
 * between") moved into that aside; nothing linked to its `#o-nas` anchor —
 * navbar and footer both point at the `/o-nas` route.
 */
export default function Home() {
  return (
    <>
      <HomeHero />
      <TrustBar />
      <ClientWork />
      <OwnProducts />
      <ServicesOverview />
      <Process />
      <FaqSchema />
      <Faq />
      <ContactBookend />
    </>
  );
}

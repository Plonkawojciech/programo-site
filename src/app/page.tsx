import HomeHero from "@/components/home/hero";
import TrustBar from "@/components/trust-bar";
import ClientWork from "@/components/home/client-work";
import OwnProducts from "@/components/home/own-products";
import ServicesOverview from "@/components/home/services-overview";
import Process from "@/components/home/process";
import Founders from "@/components/home/founders";
import Faq from "@/components/home/faq";
import FaqSchema from "@/components/home/faq-schema";
import ContactBookend from "@/components/home/contact-bookend";

/**
 * Nine sections, read top to bottom as one argument:
 *   who we are → who trusts us → proof we've done it → what we do → how it
 *   goes → who you'd work with → the objections → leave your number.
 *
 * Each section owns its own background and vertical rhythm; the order here is
 * the only thing this file decides. Three rules hold it together:
 *
 *   1. No two adjacent sections share a rhythm tier, so weight alternates
 *      instead of every band feeling equally important.
 *   2. ClientWork and OwnProducts deliberately share `bg-surface-dim` with no
 *      divider between them — they are two bands of one sunken room ("work we
 *      did for clients" / "work we did for ourselves"), not two sections.
 *   3. TrustBar sits directly under the hero because logos and numbers are the
 *      cheapest proof to read; it is also shared with the Ads landings, so it
 *      stays a no-prop default export. ContactBookend closes the page because
 *      it owns the `#kontakt` anchor every navbar and landing CTA points at,
 *      and it wraps QuickContact (`#kontakt-main`, the FAQ's exit link).
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
      <Founders />
      <FaqSchema />
      <Faq />
      <ContactBookend />
    </>
  );
}

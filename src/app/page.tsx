import HomeHero from "@/components/home/hero";
import ClientWork from "@/components/home/client-work";
import OwnProducts from "@/components/home/own-products";
import ServicesOverview from "@/components/home/services-overview";
import Process from "@/components/home/process";
import Founders from "@/components/home/founders";
import Faq from "@/components/home/faq";
import QuickContact from "@/components/quick-contact";

/**
 * Seven rooms, read top to bottom as one argument:
 *   who we are → proof we've done it → what we do → how it goes → who you'd
 *   work with → the objections → leave your number.
 *
 * Each section owns its own background and vertical rhythm; the order here is
 * the only thing this file decides. Two rules hold it together:
 *
 *   1. No two adjacent sections share a rhythm tier, so weight alternates
 *      instead of every band feeling equally important.
 *   2. ClientWork and OwnProducts deliberately share `bg-surface-dim` with no
 *      divider between them — they are two bands of one sunken room ("work we
 *      did for clients" / "work we did for ourselves"), not two sections.
 */
export default function Home() {
  return (
    <>
      <HomeHero />
      <ClientWork />
      <OwnProducts />
      <ServicesOverview />
      <Process />
      <Founders />
      <Faq />
      <QuickContact />
    </>
  );
}

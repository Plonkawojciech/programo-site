import HomeHero from "@/components/home/hero";
import Situations from "@/components/home/situations";
import ClientWork from "@/components/home/client-work";
import WhyUs from "@/components/home/why-us";
import Process from "@/components/home/process";
import Founders from "@/components/home/founders";
import ServicesOverview from "@/components/home/services-overview";
import OwnProducts from "@/components/home/own-products";
import Faq from "@/components/home/faq";
import QuickContact from "@/components/quick-contact";

export default function Home() {
  return (
    <>
      <HomeHero />
      <Situations />
      <ClientWork />
      <WhyUs />
      <Process />
      <Founders />
      <ServicesOverview />
      <OwnProducts />
      <Faq />
      <QuickContact />
    </>
  );
}

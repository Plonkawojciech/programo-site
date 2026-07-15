import MainIntro from "@/components/main-intro";
import TrustBar from "@/components/trust-bar";
import OfferPillars from "@/components/home/offer-pillars";
import PortfolioGrid from "@/components/home/portfolio-grid";
import FeaturedJedmar from "@/components/home/featured-jedmar";
import People from "@/components/home/people";
import InProduction from "@/components/home/in-production";
import Faq from "@/components/home/faq";
import ContactBookend from "@/components/home/contact-bookend";

export default function Home() {
  return (
    <>
      <MainIntro />
      <TrustBar />
      <OfferPillars />
      <PortfolioGrid />
      <FeaturedJedmar />
      <People />
      <InProduction />
      <Faq />
      <ContactBookend />
    </>
  );
}

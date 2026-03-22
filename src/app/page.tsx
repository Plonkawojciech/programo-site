"use client";

import { I18nProvider, useI18n } from "@/lib/i18n";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import FeaturedWork from "@/components/featured-work";
import About from "@/components/about";
import TechStack from "@/components/tech-stack";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import CustomCursor from "@/components/custom-cursor";
import Preloader from "@/components/preloader";
import PageTransition from "@/components/page-transition";

function HomeContent() {
  const { t } = useI18n();
  return (
    <>
      <PageTransition>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-sage focus:px-4 focus:py-2 focus:text-beige-light focus:outline-none"
        >
          {t("a11y.skipToContent")}
        </a>
        <Navbar />
        <main id="main-content">
          <Hero />
          <FeaturedWork />
          <About />
          <TechStack />
          <Contact />
        </main>
        <Footer />
      </PageTransition>
    </>
  );
}

export default function Home() {
  return (
    <I18nProvider>
      <Preloader />
      <CustomCursor />
      <HomeContent />
    </I18nProvider>
  );
}

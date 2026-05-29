"use client";

import type { ReactNode } from "react";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import { ConsentProvider } from "@/lib/consent";
import Preloader from "@/components/preloader";
import PageTransition from "@/components/page-transition";
import ScrollProgress from "@/components/scroll-progress";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CookieBanner from "@/components/cookie-banner";
import AnalyticsTracker from "@/components/analytics-tracker";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <ConsentProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary focus:shadow-lg"
          >
            Przejdź do treści
          </a>
          <Preloader />
          <ScrollProgress />
          <PageTransition>
            <Navbar />
            <main id="main-content">{children}</main>
            <Footer />
          </PageTransition>
          <CookieBanner />
          <AnalyticsTracker />
        </ConsentProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

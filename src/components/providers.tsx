"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import { ConsentProvider } from "@/lib/consent";
import PageTransition from "@/components/page-transition";
import ScrollProgress from "@/components/scroll-progress";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CookieBanner from "@/components/cookie-banner";
import AnalyticsTracker from "@/components/analytics-tracker";
import WebVitals from "@/components/web-vitals";
import StickyCta from "@/components/sticky-cta";

// Localhost source editor. The ternary is evaluated at module scope against a
// literal the bundler inlines, so in a production build this is `() => null`
// and the `import()` below is never reachable — the editor's code lands in a
// lazy chunk that production never requests. `ssr: false` because the whole
// thing reads the live DOM.
const DevEditor =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("@/components/dev/dev-editor"), { ssr: false })
    : () => null;

export default function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // /crm is a standalone internal panel — strip all marketing chrome
  // (navbar, footer, preloader, sticky CTA, cookie banner, analytics) so it
  // renders as a clean, focused app. Theme + i18n context still wrap it.
  const isBare = pathname?.startsWith("/crm") ?? false;

  return (
    <ThemeProvider>
      <I18nProvider>
        <ConsentProvider>
          {isBare ? (
            <main id="main-content">{children}</main>
          ) : (
            <>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary focus:shadow-lg"
              >
                Przejdź do treści
              </a>
              <ScrollProgress />
              <PageTransition>
                <Navbar />
                <main id="main-content">{children}</main>
                <Footer />
              </PageTransition>
              <StickyCta />
              <CookieBanner />
              <AnalyticsTracker />
              <WebVitals />
              <DevEditor />
            </>
          )}
        </ConsentProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

"use client";

import { I18nProvider, useI18n } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import Navbar from "@/components/navbar";
import ConversionLanding from "@/components/conversion-landing";
import LazyStudioSections from "@/components/lazy-studio-sections";

function HomeContent() {
  const { t } = useI18n();
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-sage focus:px-4 focus:py-2 focus:text-beige-light focus:outline-none"
      >
        {t("a11y.skipToContent")}
      </a>
      <Navbar />
      <main id="main-content">
        <h1 className="sr-only">
          Programo — Software House Poznań | Tworzenie oprogramowania, systemów SaaS i aplikacji webowych
        </h1>
        <ConversionLanding />
        <LazyStudioSections />
      </main>
    </>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <HomeContent />
      </I18nProvider>
    </ThemeProvider>
  );
}

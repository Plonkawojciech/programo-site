"use client";

import type { ReactNode } from "react";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import Preloader from "@/components/preloader";
import PageTransition from "@/components/page-transition";
import ScrollProgress from "@/components/scroll-progress";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <Preloader />
        <ScrollProgress />
        <PageTransition>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
        </PageTransition>
      </I18nProvider>
    </ThemeProvider>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { track } from "@/lib/analytics/client";

function NotFoundContent() {
  const { t } = useI18n();

  // Client component (app router doesn't allow a `metadata` export here) —
  // set the tab title directly so it doesn't stay stuck on whatever the
  // previous page set.
  useEffect(() => {
    document.title = "Strona nie znaleziona (404) | Programo";
    // Which URL was expected to exist, and who linked to it. Dead links in old
    // proposals, LinkedIn posts and renamed routes lose leads silently and are
    // among the cheapest things on the site to fix — once you can see them.
    track("page_not_found", {
      requested_path: window.location.pathname,
      referrer: document.referrer || undefined,
    });
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6">
      <h1 className="font-headline text-6xl text-on-surface md:text-8xl">404</h1>
      <p className="mt-4 text-lg text-on-surface-variant">{t("notFound.title")}</p>
      <p className="mt-2 text-sm text-on-surface-variant/70">{t("notFound.desc")}</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary/20 px-6 py-3 text-sm font-medium tracking-wide text-primary transition-all duration-300 hover:bg-primary hover:text-on-primary min-h-[44px]"
      >
        {t("notFound.back")}
      </Link>
    </div>
  );
}

export default function NotFound() {
  return (
    <I18nProvider>
      <NotFoundContent />
    </I18nProvider>
  );
}

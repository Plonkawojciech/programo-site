"use client";

import Link from "next/link";
import { I18nProvider, useI18n } from "@/lib/i18n";

function NotFoundContent() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark px-6">
      <h1 className="font-headline text-6xl text-text md:text-8xl">404</h1>
      <p className="mt-4 text-lg text-text-muted">{t("notFound.title")}</p>
      <p className="mt-2 text-sm text-text-muted/70">{t("notFound.desc")}</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-coral/20 px-6 py-3 text-sm font-medium tracking-wide text-coral transition-all duration-300 hover:bg-coral hover:text-dark min-h-[44px]"
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

"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function DemoCrossLink({ count }: { count: number }) {
  const { t } = useI18n();
  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 pb-16 md:px-12 md:pb-20 lg:px-24">
      <Link
        href="/dema"
        className="flex min-h-14 items-center justify-between gap-4 rounded-2xl border border-outline-variant/40 bg-card px-5 py-4 text-sm font-medium text-on-surface shadow-card transition hover:-translate-y-0.5 hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 motion-reduce:hover:translate-y-0"
      >
        <span>{t("demos.cross.projects").replace("{count}", String(count))}</span>
        <span aria-hidden="true" className="text-primary">→</span>
      </Link>
    </div>
  );
}

"use client";

import Image from "next/image";
import type { DemoView } from "@/lib/demos";
import PhoneFrame from "@/components/ui/phone-frame";
import { trackPortfolioClick } from "@/lib/tracking";

/**
 * One demo: desktop capture on a canvas tinted with the brand colour, the
 * phone capture of the same page overlapping its corner, then three lines of
 * text. Same raised-card language as the work grid above it.
 *
 * A named demo is one link to the live mock-up. A concept (see `disclosure`
 * in lib/demos.ts) has no link and no host: the card is a picture of the
 * design, not a pointer at a company.
 */
export function DemoCard({ demo, lang, alt }: { demo: DemoView; lang: "pl" | "en"; alt: string }) {
  const body = (
    <>
      <div
        className="relative aspect-[16/11] overflow-hidden"
        style={{ background: `linear-gradient(150deg, ${demo.accentColor}30 0%, ${demo.accentColor}12 60%, ${demo.accentColor}08 100%)` }}
      >
        <div className="absolute left-[6%] right-[14%] top-[11%] overflow-hidden rounded-lg shadow-[0_0_0_1px_rgba(5,31,32,0.08),0_18px_40px_-14px_rgba(5,31,32,0.4)] transition-transform duration-500 ease-out group-hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
          <Image
            src={demo.desktop}
            alt={alt}
            width={1600}
            height={1000}
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 42vw, 360px"
            className="h-auto w-full"
          />
        </div>
        <div className="absolute bottom-[-18%] right-[5%] w-[21%]" aria-hidden="true">
          <PhoneFrame src={demo.mobile} alt="" sizes="(max-width: 640px) 20vw, 96px" />
        </div>
        {demo.host && (
          <span className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-full bg-black/70 px-3 py-1.5 text-[10px] font-medium tracking-wide text-white backdrop-blur-sm">
            {demo.host}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-on-surface-variant">{demo.eyebrow[lang]}</p>
        <h3 className="mt-2 font-headline text-xl font-bold leading-tight tracking-tight text-on-surface text-balance md:text-2xl">
          {demo.title[lang]}
        </h3>
        <p className="mt-3 flex-1 text-sm font-light leading-relaxed text-on-surface/70 text-pretty">{demo.summary[lang]}</p>
        {demo.url && (
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            {lang === "pl" ? "Otwórz demo" : "Open the demo"}
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none">
              ↗
            </span>
          </span>
        )}
      </div>
    </>
  );

  const shell =
    "group flex h-full flex-col overflow-hidden rounded-2xl bg-card shadow-card transition duration-300 motion-reduce:transition-none";

  if (!demo.url) {
    return (
      <article data-industry={demo.industry} className={shell}>
        {body}
      </article>
    );
  }

  return (
    <article data-industry={demo.industry} className="h-full">
      <a
        href={demo.url}
        target="_blank"
        rel="nofollow noopener noreferrer"
        onClick={() => trackPortfolioClick(demo.slug, demo.url!)}
        className={`${shell} hover:-translate-y-1 hover:shadow-card-hover motion-reduce:hover:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
      >
        {body}
      </a>
    </article>
  );
}

"use client";

import Image from "next/image";
import type { Demo } from "@/lib/demos";
import { trackPortfolioClick } from "@/lib/tracking";

export type DemoWithScreenshot = Demo & { hasDesktopScreenshot: boolean };

function DomainPill({ host }: { host: string }) {
  return (
    <span className="pointer-events-none absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-[10px] font-medium tracking-wide text-white backdrop-blur-sm">
      <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 opacity-70" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V7a4 4 0 018 0v4" />
      </svg>
      {host}
    </span>
  );
}

function canvasTextColor(hex: string): "#051F20" | "#FFFFFF" {
  const [r, g, b] = [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.58 ? "#051F20" : "#FFFFFF";
}

export function DemoCard({ demo, lang, screenshotAlt }: { demo: DemoWithScreenshot; lang: "pl" | "en"; screenshotAlt: string }) {
  const meta = [demo.sector[lang], demo.city].filter(Boolean).join(" · ");

  return (
    <article
      data-industry={demo.industry}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-card shadow-card transition duration-300 motion-reduce:transition-none hover:-translate-y-1 hover:shadow-card-hover motion-reduce:hover:translate-y-0"
    >
      <a
        href={demo.url}
        target="_blank"
        rel="nofollow noopener noreferrer"
        onClick={() => trackPortfolioClick(demo.slug, demo.url)}
        aria-label={`${demo.name}: ${demo.sector[lang]}`}
        className="flex flex-1 flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-[-2px]"
      >
        <span className="h-1 w-full shrink-0" style={{ backgroundColor: demo.accentColor }} aria-hidden="true" />
        <div
          className="relative h-[230px] overflow-hidden sm:h-[250px] md:h-[270px]"
          style={
            demo.hasDesktopScreenshot
              ? { background: `linear-gradient(150deg, ${demo.accentColor}33 0%, ${demo.accentColor}12 58%, transparent 100%)` }
              : { backgroundColor: demo.accentColor }
          }
        >
          {demo.hasDesktopScreenshot ? (
            <div className="absolute left-[7%] right-[-5%] top-[13%] overflow-hidden rounded-lg border border-black/10 shadow-[0_10px_30px_-8px_rgba(5,31,32,0.35)] transition-transform duration-500 ease-out motion-reduce:transition-none group-hover:-translate-y-2 motion-reduce:group-hover:translate-y-0">
              <Image
                src={`/screenshots/demos/${demo.slug}-desktop.webp`}
                alt={screenshotAlt.replace("{name}", demo.name)}
                width={2400}
                height={1500}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 430px"
                className="h-auto w-full"
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center px-8">
              <span
                className="max-w-full text-center font-headline text-4xl font-bold leading-tight drop-shadow-sm md:text-5xl"
                style={{ color: canvasTextColor(demo.accentColor) }}
              >
                {demo.name}
              </span>
            </div>
          )}
          <DomainPill host={demo.host} />
        </div>

        <div className="flex flex-1 flex-col p-5 md:p-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-on-surface-variant">{meta}</p>
          <h3 className="mt-2 font-headline text-2xl font-bold leading-tight tracking-tight text-on-surface">{demo.name}</h3>
          <p className="mt-3 flex-1 text-sm font-light leading-relaxed text-on-surface/70">{demo.summary[lang]}</p>
          {demo.pages && (
            <div className="mt-5 flex flex-wrap gap-2">
              {demo.pages[lang].map((page) => (
                <span key={page} className="rounded-full border border-outline-variant/50 px-3 py-1 text-[11px] text-on-surface-variant">
                  {page}
                </span>
              ))}
            </div>
          )}
        </div>
      </a>

      {demo.variant && (
        <a
          href={demo.variant.url}
          target="_blank"
          rel="nofollow noopener noreferrer"
          onClick={() => trackPortfolioClick(`${demo.slug}-variant`, demo.variant!.url)}
          className="mx-5 mb-5 inline-flex min-h-11 items-center self-start text-sm font-medium text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 md:mx-6 md:mb-6"
        >
          {demo.variant.label[lang]}
        </a>
      )}
    </article>
  );
}

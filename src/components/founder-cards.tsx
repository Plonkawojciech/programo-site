"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import Reveal from "@/components/ui/reveal";

// Kafle z portretami założycieli. Używane na /kontakt i /o-nas — jedno miejsce,
// bo dwa niezależne warianty rozjechałyby się przy pierwszej zmianie zdjęcia.
//
// Zdjęcia są w dwóch wersjach, bo strona ma dwa motywy: białe tło do jasnego,
// zielona ściana do ciemnego. Podmiana leci CSS-em (.photo-light/.photo-dark
// w globals.css), a nie przez useTheme() — inaczej po hydracji mignęłoby złe
// zdjęcie, zanim provider zdąży odczytać localStorage.
//
// `unoptimized`: optymalizator obrazów Vercela oddaje na tych plikach HTTP 402
// (wyczerpany limit transformacji). Pliki są przygotowane pod docelowy rozmiar
// (1120x1400 WebP), więc /_next/image nic tu nie wnosił poza ryzykiem.
const FOUNDERS = [
  {
    name: "Wojciech Płonka",
    roleKey: "about.wojciech.role",
    slug: "wojciech-plonka",
    tel: "+48797222363",
    telLabel: "797 222 363",
  },
  {
    name: "Bartosz Kolaj",
    roleKey: "about.bartosz.role",
    slug: "bartosz-kolaj",
    tel: "+48509123434",
    telLabel: "509 123 434",
  },
] as const;

export default function FounderCards() {
  const { t } = useI18n();

  return (
    <div className="grid gap-8 sm:grid-cols-2 md:gap-12">
      {FOUNDERS.map((f, i) => (
        <Reveal key={f.slug} delay={i * 0.1}>
          <figure className="group flex flex-col gap-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-card shadow-card ring-1 ring-outline-variant/20 transition duration-500 focus-within:ring-primary/40 group-hover:shadow-card-hover group-hover:ring-primary/40">
              <Image
                src={`/team/${f.slug}-light.webp`}
                alt={`${f.name} - ${t(f.roleKey)}, Programo`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1400px) 45vw, 620px"
                className="photo-light object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                unoptimized
                priority={i === 0}
              />
              <Image
                src={`/team/${f.slug}-dark.webp`}
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1400px) 45vw, 620px"
                className="photo-dark object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                unoptimized
              />
              {/* Przyciemnienie tylko pod treścią, żeby twarz nie ciemniała. */}
              <div
                aria-hidden="true"
                className="portrait-veil pointer-events-none absolute inset-0 bg-gradient-to-t from-[#051F20]/85 via-[#051F20]/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100"
              />
              {/* Kontakt wjeżdża na hover, ale klikalny jest dopiero wtedy —
                  bez pointer-events-none niewidoczne linki łapałyby kursor.
                  Na urządzeniach bez hovera overlay jest widoczny na stałe
                  (@media (hover: none) w globals.css), więc numer nie musi być
                  dublowany w podpisie — dwa te same tel: linki to szum dla
                  czytnika ekranu i dla crawlera. */}
              <div className="portrait-overlay pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 flex-col gap-2 p-6 opacity-0 transition duration-500 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 md:p-8">
                <a
                  href={`tel:${f.tel}`}
                  className="w-fit font-headline text-2xl font-bold tracking-tight text-white underline-offset-4 transition hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4"
                >
                  {f.telLabel}
                </a>
                <a
                  href="mailto:biuro@programo.pl"
                  className="w-fit text-sm font-medium text-white/80 underline-offset-4 transition hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4"
                >
                  biuro@programo.pl
                </a>
              </div>
            </div>
            <figcaption className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-on-surface-variant">
                {t(f.roleKey)}
              </span>
              <span className="font-headline text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
                {f.name}
              </span>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}

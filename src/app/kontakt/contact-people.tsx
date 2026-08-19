"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import Reveal from "@/components/ui/reveal";

// /kontakt — twarze przed formularzem: "wiesz, kto odbierze telefon".
// Zdjęcia są w dwóch wersjach, bo strona ma dwa motywy: białe tło do jasnego,
// zielone do ciemnego. Podmiana leci CSS-em (.photo-light/.photo-dark w
// globals.css), a nie przez useTheme() — inaczej po hydracji mignęłoby złe
// zdjęcie, zanim provider zdąży odczytać localStorage.
const PEOPLE = [
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

export default function ContactPeople() {
  const { t } = useI18n();

  return (
    <section className="bg-surface py-section-tight">
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-24">
        <Reveal className="max-w-2xl">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-on-surface-variant">
            {t("contactPeople.eyebrow")}
          </span>
          <h2 className="mt-4 font-headline text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
            {t("contactPeople.title")}
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 md:mt-14 md:gap-12">
          {PEOPLE.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.1}>
              <figure className="flex flex-col gap-5">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-card shadow-card">
                  <Image
                    src={`/team/${p.slug}-light.webp`}
                    alt={`${p.name} - ${t(p.roleKey)}, Programo`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1400px) 45vw, 620px"
                    className="photo-light object-cover"
                    priority={i === 0}
                  />
                  <Image
                    src={`/team/${p.slug}-dark.webp`}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1400px) 45vw, 620px"
                    className="photo-dark object-cover"
                  />
                </div>
                <figcaption className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-on-surface-variant">
                    {t(p.roleKey)}
                  </span>
                  <span className="font-headline text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
                    {p.name}
                  </span>
                  <a
                    href={`tel:${p.tel}`}
                    className="mt-1 inline-flex w-fit items-center gap-2 text-sm font-medium text-primary underline underline-offset-4 transition hover:text-on-surface"
                  >
                    {p.telLabel}
                  </a>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

# Programo Site
---

Strona firmowa Programo s.c. (Wojciech Płonka + Bartosz Kolaj, Poznań) — landing pod konwersję
(telefon + formularz) z portfolio jako pokazem umiejętności. Redesign: 2026-07-15
(brief: `docs/redesign-brief-2026-07.md`, treści: `docs/content-deck-2026-07.md`).

## Tech Stack

- Next.js 16.1 (App Router), React 19, TypeScript
- Tailwind CSS v4, framer-motion v12, lenis (smooth scroll)
- Dwujęzyczność PL/EN: własny kontekst i18n w `src/lib/i18n/` (słowniki per domena w `dictionaries/`)
- Fonty: Newsreader (nagłówki) + Plus Jakarta Sans (body) przez next/font
- Leady: `/api/contact` → Resend + Redis CRM (`/crm`, token-gated) + webhook crm.programo.pl

## Struktura

```
src/
  app/
    page.tsx                    # Homepage (sekcje w src/components/home/)
    oferta/ cennik/ o-nas/ kontakt/ projekty/
    strony-internetowe/ sklepy-internetowe/ strony-tracking-reklamy/   # landingi ofertowe
    software-house-poznan/ ile-kosztuje-aplikacji/                     # SEO
    stack/ polityka-prywatnosci/
    projekty/                   # lista portfolio
    projects/[slug]/            # detale projektów (SSG z projects.ts)
    api/contact/ api/leads/     # lead pipeline
    api/crm-login/ api/crm-logout/
    crm/                        # wewnętrzny panel leadów (noindex)
  components/
    home/                       # sekcje homepage (offer-pillars, portfolio-grid, featured-jedmar, people, faq...)
    ui/                         # prymitywy: phone-frame, browser-frame, device-duo, count-up, reveal
    compact-lead-form.tsx       # krótki formularz (props: formId!)
    quick-contact.tsx           # pełny formularz
    navbar.tsx footer.tsx sticky-cta.tsx cookie-banner.tsx analytics-tracker.tsx
  lib/
    i18n/                       # provider + dictionaries/{common,home,offer,projects,about,pricing,contact,forms,marketing}.ts
    projects.ts                 # DANE portfolio (10 projektów, kategorie: produkty | dla-klientow | marketing)
    tracking.ts consent.tsx     # GA4 + Google Ads + Consent Mode v2
```

## Twarde zasady tego repo

- **Tracking nietykalny bez wyraźnego powodu**: GA4 `G-KT2R144BYG`, Ads `AW-18196600478`
  (konwersja lead z value 500 PLN, guard raz-na-sesję), Consent Mode v2 inline w `<head>`
  PRZED gtag.js. Każdy formularz ma unikalny `formId` i woła `trackLead`.
- **Paleta**: ciemna zieleń + mięta (`#051F20`/`#DAF1DE`/`#8EB69B`, tokeny w globals.css),
  light mode odwrócony. Logo i kolory NIE do zmiany.
- **Fakty w portfolio**: statusy i liczby tylko z `projects.ts` / briefu — zero zmyślonych
  statystyk. Kategorie uczciwie rozdzielają produkty własne od pracy dla klientów.
- Teksty przez `t()` z i18n (wyjątek: strony SEO `strony-internetowe`, `sklepy-internetowe`,
  `software-house-poznan`, `ile-kosztuje-aplikacji` — hardkodowany PL).
- Jedna obietnica czasu: „Odpowiadamy w 24 h". Zero emotek, zero kursywy w nagłówkach.
- Screenshoty produktów: `public/screenshots/v2/<slug>-{desktop,mobile}.webp`.

## Landminy

- **`public/screenshots/v2/` ma duplikaty assetów** pod starymi aliasami nazw
  (np. `eportalprawny-*` obok `eportal-prawny-*`). Przy dodawaniu screenshota sprawdź,
  czy nie tworzysz trzeciego wariantu tej samej rzeczy.
- **framer-motion `AnimatePresence` nie usuwa węzłów po exit** — podejrzenie artefaktu
  headless, niezbadane. Jeśli trafisz na duchy w DOM po animacji wyjścia, to znany problem,
  nie regresja od Twojej zmiany.

## Komendy

```bash
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint       # eslint
npm run test       # vitest run (8 plików: i18n parytet, projects, SEO, api kontrakt, komponenty)
npm run test:watch
npx tsc --noEmit   # typecheck — NIE jest częścią build, uruchom osobno
```

Bramka przed commitem: `npm run build && npx tsc --noEmit && npm run test`.

## Zmienne środowiskowe

Wzór w `.env.example`. Wymagane do pełnego działania lokalnie:
`RESEND_API_KEY`, `EMAIL_TO` (lead pipeline), `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`
(powiadomienia), `PAGESPEED_API_KEY`, `NEXT_PUBLIC_BOOKINGS_URL`.
Bez nich `npm run dev` wstanie, ale wysyłka leada padnie.

## Deploy

Prod: programo.pl serwowany z Vercela (auto-deploy z push na origin/main).
NIE uruchamiać `vercel --prod` ręcznie. Jeśli prod przestanie się aktualizować po pushu —
sprawdzić migrację na Coolify (zasada od 2026-07-15: docelowo wszystko na Coolify/Contabo).

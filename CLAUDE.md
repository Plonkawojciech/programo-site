# Programo Site
---

## 100% AI Codebase — Instrukcja dla agentów

> Ten codebase jest w **100% pisany i utrzymywany przez agenty AI** (Claude opus-4.6 / sonnet) via Claude Code. Nie ma kodu pisanego ręcznie przez człowieka.
>
> **OBOWIĄZEK:** Po każdej zmianie w tym projekcie zaktualizuj `progress.md` w root projektu:
> - Data (YYYY-MM-DD)
> - Krótki opis co zmieniono i dlaczego
> - Dotknięte pliki/moduły
>
> `progress.md` to semantyczny tracker historii projektu — git log rejestruje commity, ale `progress.md` daje kolejnym agentom pełny kontekst: co, dlaczego, jakie moduły.


Company portfolio website for Programo — the software studio of Wojciech Plonka and Bartosz Kolaj, based in Poznan.

## Tech Stack

- Next.js 16.1, React 19, TypeScript
- Tailwind CSS v4, framer-motion v12
- Bilingual PL/EN (custom i18n context in `src/lib/i18n.tsx`)
- Fonts: Newsreader (headline) + Plus Jakarta Sans (body) via next/font

## Project Structure

```
src/
  app/
    page.tsx              # Homepage = Hero+Situations+ClientWork+WhyUs+Process+Founders+Services+OwnProducts+Faq+QuickContact
    layout.tsx            # Root layout — metadata, fonts, ORAZ analityka/reklamy (patrz niżej)
    projects/[slug]/      # Individual project pages
    (oferta|cennik|projekty|o-nas|kontakt|audyt|sklepy-internetowe|
     software-house-poznan|ile-kosztuje-aplikacji|stack|polityka-prywatnosci)/
  components/
    home/                 # Sekcje strony głównej (hero, situations, client-work, why-us,
                          #   process, founders, services-overview, own-products, faq)
    quick-contact.tsx     # Główny formularz kontaktowy (NIE contact.tsx) — id="kontakt-main", trackLead
    navbar.tsx / footer.tsx
    scroll-progress.tsx   # Tylko mobilny górny pasek postępu (desktopowy SCROLL usunięty)
    cookie-banner.tsx / analytics-tracker.tsx   # ⚠️ analityka — patrz niżej
  lib/
    i18n.tsx              # useI18n() → { lang, toggle, t }
    motion.ts             # Tokeny ruchu (easeEntry, durationMedium, staggerItem, ...) — UŻYWAJ ich
    projects.ts           # Project data (Project[])
    tracking.ts           # ⚠️ atrybucja gclid/UTM — patrz niżej
```

## Running

```bash
npm run dev      # http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint
```

## Key Conventions

- All text uses `t("key")` from `useI18n()` hook — never hardcode PL/EN strings in JSX
- Project data lives in `src/lib/projects.ts` as a typed array (`Project[]`)
- Each project has: slug, title, subtitle, description, longDescription, status, tech, features (all bilingual)
- Statuses: `"live"` | `"development"` | `"planned"`
- All pages are client components wrapped in `<I18nProvider>`
- No database, no auth — purely static portfolio site
- Design: **dark forest-green theme jako DOMYŚLNY** (light mode opcjonalny przez toggle, `data-theme="light"`). Pill nav (liquid-glass), duża typografia, framer-motion.
- Paleta (dark, `:root` w globals.css): bg #051F20 (deep forest), text #DAF1DE (mint), accent/sage #8EB69B. Light: bg #FBFDFB, text #051F20, accent #235347.
- Tokeny semantyczne Tailwind v4 (`@theme inline`): surface, on-surface, on-surface-variant, primary (=accent), primary-container, outline-variant. NIE hardkoduj hexów — używaj tokenów.
- Fonty: Newsreader (headline) + Plus Jakarta Sans (body). UWAGA: oba są na liście „reflex-reject" impeccable (domyślne fonty AI) — ewentualna zmiana = osobna decyzja właściciela, nie ruszać bez zgody.

## ⚠️ STREFA NIETYKALNA — analityka / reklamy (NIE ruszać bez wyraźnej zgody)

Te elementy liczą wejścia/konwersje i kampanie Google/Meta Ads. Nie modyfikować przy zmianach wizualnych:
- `src/app/layout.tsx` — `<head>`: GA4 `G-TGLPLMVV91`, Microsoft Clarity `wxezq44wx0`, Google Consent Mode v2, gtag.js, preconnect, JSON-LD.
- `src/components/cookie-banner.tsx`, `src/components/analytics-tracker.tsx`, `src/lib/tracking.ts` (gclid/UTM, `trackLead`).

## Zainstalowane skille (ładują się przy starcie Claude W TYM folderze)

- **impeccable** (project-scoped, `.claude/skills/impeccable/`) — kombajn UI z pod-komendami: `/impeccable init|critique|audit|polish|animate|craft|...`. Najpierw `init` (tworzy PRODUCT.md/DESIGN.md — jeszcze ich nie ma).
- **design-taste-frontend**, **emil-design-eng**, **review-animations** (globalne, `~/.claude/skills/`) — anti-slop / polish / przegląd animacji.

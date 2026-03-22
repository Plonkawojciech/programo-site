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
    page.tsx              # Homepage (Hero, FeaturedWork, About, TechStack, Contact)
    layout.tsx            # Root layout (metadata, fonts)
    projects/[slug]/      # Individual project pages
  components/
    hero.tsx              # Hero section
    featured-work.tsx     # Project showcase grid
    about.tsx             # About section
    tech-stack.tsx        # Technologies section
    contact.tsx           # Contact form/CTA
    navbar.tsx            # Navigation bar
    footer.tsx            # Footer
  lib/
    i18n.tsx              # I18nProvider context + translations dictionary
    projects.ts           # Project data (Estalo, Baulx, Athlix, LearnAI)
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
- Design: light warm editorial theme (amber/cream palette), pill nav, large typography, framer-motion animations
- Color system: surface #f9f9f9, primary #775a19 (amber), on-surface #1a1c1c — Material Design 3 naming

# PROMPT RUNDA 4: programo-site — FULL PRODUCTION AUDIT

> Rundy 1-3 zrobione. Przeczytaj progress.md. NIE powtarzaj tego co juz zrobiono.
> ZASADY: (1) Po KAZDEJ zmianie wpisuj do progress.md. (2) Co 3-4 zmiany build+lint+test. (3) Rob WSZYSTKO. Dlugo i dokladnie.
> CEL: Kazdy pixel, kazda funkcja, kazdy endpoint, kazdy test — production-ready portfolio na programo.pl.

---

## 1. FULL PAGE-BY-PAGE AUDIT — 5 stron + 404

### 1.1 Homepage (/)
Sprawdz KAZDA z 6 sekcji pixel-perfect:

#### Hero
- [ ] Heading "Programo" czytelny na KAZDEJ szerokosci (320-1920px) — clamp() font-size
- [ ] Subtitle: jasno opisuje czym jest Programo (studio software z Poznania)
- [ ] CTA buttons (2): "Nasze projekty" (scroll do Featured Work) + "Kontakt" (scroll do Contact)
- [ ] Buttons: wyrazne, kontrastowe, hover state (scale/shadow), focus visible
- [ ] Mobile max 80vh: hero nie zajmuje calego ekranu, widac ze jest cos ponizej
- [ ] Mobile: buttons stack vertically (nie obok siebie)
- [ ] Animation: framer-motion fadeUp smooth, nie laguje, nie blokuje interakcji
- [ ] Background: nie spowalnia renderowania (nie heavy gradient/image)
- [ ] Scroll indicator: animowana strzalka/chevron na dole hero
- [ ] prefers-reduced-motion: animacje wylaczone gdy user preferuje

#### Featured Work
- [ ] 4 karty: Estalo, Baulx, Athlix, LearnAI — DOKLADNIE te 4, poprawna kolejnosc
- [ ] Kazda karta: logo/ikona, tytul, subtitle (PL/EN), status badge, tech chips, accent color border/glow
- [ ] Status badges kolory: live = green, development = yellow, planned = gray
- [ ] Hover: scale(1.02) + shadow + border glow (accent color)
- [ ] Rowna wysokosc: WSZYSTKIE 4 karty tej samej wysokosci (nie skacza)
- [ ] Klik na karte: href="/projects/[slug]" — sprawdz ze KAZDY link dziala
- [ ] Mobile: 1 kolumna, karty full-width
- [ ] Tablet: 2 kolumny
- [ ] Desktop: 4 kolumny (lub 2x2)
- [ ] Stagger animation: karty pojawiaja sie kolejno (0.1s delay miedzy nimi)

#### About
- [ ] Founderzy: Wojciech Plonka + Bartosz Kolaj
- [ ] Zdjecia lub placeholder avatary z inicjalami (WP, BK) — NIE broken img
- [ ] Bio: 2-3 zdania per osoba, po polsku (PL) i angielsku (EN)
- [ ] Stats: aktualne — ilosc produktow (4+), rok zalozenia (2024), lokalizacja (Poznan)
- [ ] Mobile: stack vertical (founderzy pod soba)
- [ ] Desktop: side-by-side

#### Tech Stack
- [ ] 15 technologii: Next.js, React, TypeScript, Tailwind, Supabase, Neon, Drizzle, Vercel, Capacitor, Azure OpenAI, Anthropic, Stripe, Resend, Three.js, Konva.js
- [ ] Kazda tech: ikona/logo + nazwa + krotki opis
- [ ] Grid layout: mobile 2 kolumny, tablet 3, desktop 5
- [ ] Ikony: czytelne, nie rozciagniete, consistent size
- [ ] Hover: subtle highlight

#### Contact
- [ ] Formularz: imie (required), email (required + walidacja), temat (select: Wspolpraca/Wycena/Pytanie/Inne), wiadomosc (required, 20-2000 zn.)
- [ ] Inline validation: czerwona ramka + tekst pod inputem na bledzie
- [ ] Submit button text: "Wyslij" -> "Wysylanie..." (disabled) -> "Wyslano!" (green, 2s) -> "Wyslij"
- [ ] Success: toast "Wiadomosc wyslana!", form reset (puste pola)
- [ ] Error: toast "Cos poszlo nie tak" (500) lub "Zbyt wiele wiadomosci" (429)
- [ ] Rate limit: 3 wiadomosci / 15 min per IP
- [ ] Email klikalny: mailto:kontakt@programo.pl
- [ ] Social links: GitHub + LinkedIn (ikony, target="_blank", rel="noopener")
- [ ] Accessibility: label+htmlFor na KAZDYM input, aria-describedby na errors, focus on first error
- [ ] Mobile: single column form, full width

#### Footer
- [ ] Copyright: "© 2024-2026 Programo" (rok dynamiczny)
- [ ] Lokalizacja: "Poznan, Polska"
- [ ] Social media icons: GitHub, LinkedIn — klikalne, target="_blank", rel="noopener"
- [ ] Linki do produktow: jesli sa — dzialaja
- [ ] Mobile: centered, stacked

### 1.2 Project Detail Pages (/projects/[slug]) — 4 strony
Sprawdz KAZDA z 4 stron (estalo, baulx, athlix, learnai):

- [ ] "Wroc" link: -> homepage, widoczny, dziala
- [ ] Hero: tytul projektu, dlugi opis (longDescription PL/EN), status badge, rok
- [ ] Live URL button: "Zobacz na zywo" -> external link (tylko dla live projektow)
- [ ] Estalo: live, estalo.pl, CRM features lista, role founderow
- [ ] Baulx: live, baulx.pl, 10 produktow model JetBrains, CNC timber
- [ ] Athlix: development, TrainPilot + TrainMate + Health, athlete ecosystem
- [ ] LearnAI: planned, kursy + AI, bez live URL
- [ ] Screenshots: <Image /> z proper alt text, width/height (no CLS), lazy loading
- [ ] Features lista: z ikonami, per project unikalne
- [ ] Tech stack chips: per project, klikalne? lub static
- [ ] Role founderow: "Wojciech Plonka — ...", "Bartosz Kolaj — ..."
- [ ] SEO: generateMetadata per projekt (unikalne title <60 chars, description <160)
- [ ] JSON-LD: SoftwareApplication schema per projekt
- [ ] Mobile: single column, full width images

### 1.3 404 Page
- [ ] Tekst: "Strona nie znaleziona" (PL) / "Page not found" (EN)
- [ ] Link "Wroc na strone glowna"
- [ ] Styl: consistent z reszta strony

### 1.4 Navbar (na KAZDEJ stronie)
- [ ] Logo "Programo": link do /, widoczny
- [ ] Desktop: pill design, linki do sekcji (Projekty, O nas, Technologie, Kontakt)
- [ ] Mobile: hamburger button, otwiera menu overlay, klik poza zamyka
- [ ] Language toggle: "PL" / "EN" button, aria-label="Zmien jezyk"
- [ ] Scroll behavior: sticky/fixed, background zmienia sie na scroll (blur/solid)
- [ ] Active link: podswietlony na aktualnej sekcji
- [ ] Mobile menu: animowane (slide-in lub fade), linki dzialaja, zamyka po kliknieciu

---

## 2. API AUDIT

### POST /api/contact
- [ ] Zod schema validation: name (required, min 1), email (required, email format), subject (enum), message (required, 20-2000)
- [ ] Invalid: 400 z { error: "Opis bledu per pole" }
- [ ] Rate limit: 3/15min per IP (in-memory Map), 429 z { error: "Too many requests" }
- [ ] XSS: name, message, subject — HTML entity encoding
- [ ] Email: Resend API (RESEND_API_KEY env), from: noreply@programo.pl, to: EMAIL_TO env fallback kontakt@programo.pl
- [ ] Email content: HTML formatted, subject "[Programo] {temat} — od {imie}"
- [ ] Success: 200 z { success: true }
- [ ] Resend error: 500 z { error: "Failed to send" }
- [ ] No RESEND_API_KEY: graceful fallback (log to console, return success for dev)

---

## 3. SEO COMPLETE AUDIT

### robots.ts
- [ ] User-agent: *, Allow: /, Sitemap: https://programo.pl/sitemap.xml

### sitemap.ts
- [ ] 5 URLs: /, /projects/estalo, /projects/baulx, /projects/athlix, /projects/learnai
- [ ] Priority: / = 1.0, projects = 0.8
- [ ] changeFrequency: monthly
- [ ] lastModified: new Date()

### JSON-LD
- [ ] Layout.tsx: Organization schema (name, url, founders, address Poznan PL, sameAs github)
- [ ] Project pages: SoftwareApplication schema (name, description, applicationCategory, operatingSystem, url, creator)

### Meta tags (KAZDA strona)
- [ ] Title: unikalne, max 60 chars
- [ ] Description: unikalne, max 160 chars
- [ ] og:title, og:description, og:image, og:url
- [ ] twitter:card = summary_large_image
- [ ] Canonical URL per strona

---

## 4. i18n DEEP AUDIT

Przelacz na EN i przejdz ABSOLUTNIE KAZDY element:
- [ ] Hero: heading, subtitle, CTA buttons ("Our projects", "Contact")
- [ ] Featured work: titles, subtitles, status badges (Live/Development/Planned), "View project"
- [ ] About: bios EN, stats labels
- [ ] Tech stack: section title, tech descriptions
- [ ] Contact: form labels, placeholders, error messages, success/error toasts, select options
- [ ] Footer: copyright, location "Poznan, Poland", social labels
- [ ] Project detail: ALL sections — title, description, features, tech, role, "Back", "View live"
- [ ] Nav: links, toggle label
- [ ] 404: text + link
- [ ] ZERO hardcoded Polish strings bez EN equivalent
- [ ] <html lang="pl"> zmienia sie na "en"
- [ ] localStorage "programo-lang" persisted
- [ ] Default: PL

---

## 5. TESTY — cel 80+

### Rozszerz istniejace + dodaj brakujace:
```
src/__tests__/i18n.test.ts (10):
- All PL keys exist in EN and vice versa
- No empty translation values
- No duplicate keys
- TranslationKey type covers all keys
- Toggle changes returned text
- Default language is PL
- Unknown key returns key itself
- Nested keys work
- Contact form keys complete (labels, errors, placeholders, toasts)
- Status labels translated (live, development, planned)

src/__tests__/projects.test.ts (12):
- All 4 projects exist
- Each has required fields: slug, title, subtitle, description, tech, features, status
- All slugs URL-safe
- generateStaticParams returns all 4
- Live projects (estalo, baulx) have liveUrl
- Development (athlix) has no liveUrl or correct
- Planned (learnai) has no liveUrl
- Features arrays non-empty per project
- Tech arrays non-empty
- Accent colors valid hex (#XXXXXX)
- Year field present and valid
- Role field present for both founders

src/__tests__/api/contact.test.ts (12):
- POST valid -> 200
- POST missing name -> 400
- POST missing email -> 400
- POST invalid email format -> 400
- POST missing message -> 400
- POST message <20 chars -> 400
- POST message >2000 chars -> 400
- POST invalid subject (not in enum) -> 400
- Rate limit after 3 attempts -> 429
- Rate limit resets after 15 min window
- XSS in message field sanitized
- XSS in name field sanitized

src/__tests__/components/hero.test.tsx (6):
- Renders heading "Programo"
- Renders 2 CTA buttons
- Language toggle changes heading text
- Mobile: buttons stack vertically (flex-col class)
- Animation attributes present (framer-motion data attrs)
- Scroll indicator element present

src/__tests__/components/featured-work.test.tsx (8):
- Renders exactly 4 project cards
- Each card has title and subtitle
- Status badges: live=green class, development=yellow, planned=gray
- Click on card has correct href /projects/[slug]
- Cards have equal height (same min-height class or flex)
- Tech chips visible per card
- Hover classes present
- Stagger animation delays different per card

src/__tests__/components/navbar.test.tsx (8):
- Renders nav links (Projekty, O nas, Technologie, Kontakt)
- Language toggle button visible
- PL/EN toggle changes button text
- Mobile: hamburger button visible at small viewport
- Active link styling present
- Accessibility: role="navigation", aria-label
- Logo links to /
- Scroll: background class changes (test with mock scroll)

src/__tests__/components/contact-form.test.tsx (10):
- Renders all 4 fields (name, email, subject select, message textarea)
- Name required validation (blur empty -> error)
- Email format validation (invalid -> error)
- Message min length validation (<20 -> error)
- Message max length (>2000 -> error)
- Submit button text changes on submit (Wyslij -> Wysylanie)
- Success: form resets (all fields empty)
- Error: toast appears with error message
- i18n: labels change on language toggle
- Subject select has 4 options

src/__tests__/components/footer.test.tsx (6):
- Renders copyright with current year (2026)
- Social links (GitHub, LinkedIn) have target="_blank" + rel="noopener"
- Location "Poznan" visible
- Links functional (href present)
- i18n: location changes to "Poznan, Poland" in EN
- Copyright text includes "Programo"

src/__tests__/seo.test.ts (8):
- robots.ts generates valid rules (Allow /, Sitemap URL)
- sitemap.ts includes all 5 URLs
- sitemap priorities correct (1.0 for /, 0.8 for projects)
- Layout has Organization JSON-LD with correct name/url/founders
- Project pages have SoftwareApplication JSON-LD
- All meta descriptions under 160 chars
- All titles under 60 chars
- Canonical URLs present on all pages
```

---

## 6. PERFORMANCE

- [ ] Fonts: display: 'swap', subsets: ['latin', 'latin-ext'], preload: true — na Inter + Playfair
- [ ] Images: width/height set (no CLS), priority na hero image, lazy na reszcie
- [ ] Above-the-fold: nie wymaga JS do renderowania (SSG)
- [ ] Bundle: npm run build -> sprawdz output, minimize JS
- [ ] framer-motion: lazy load jesli ciezki (next/dynamic)
- [ ] CSS: no unused styles (Tailwind purge)
- [ ] SSG: all 5 pages static (sprawdz build output — ○ Static)
- [ ] Lighthouse: Performance >95, Accessibility >95, SEO >95

---

## 7. ANIMATIONS

- [ ] prefers-reduced-motion: respect na KAZDEJ animacji (CSS + framer-motion)
- [ ] Nie blokuja interakcji (pointer-events active during animation)
- [ ] Scroll-triggered: poprawny threshold (nie za wczesnie, nie za pozno)
- [ ] GPU-accelerated: TYLKO transform/opacity (nie width/height/top/left)
- [ ] Smooth: 60fps, no jank

---

## 8. RESPONSIVE

### 320px mobile:
- [ ] Hero heading: nie overflow, czytelny, clamp font-size
- [ ] Cards: full-width, 1 kolumna
- [ ] Tech stack: 2 kolumny
- [ ] Footer: centered, nie chaotyczny
- [ ] Nav: hamburger dziala, menu overlay
- [ ] Contact form: full width inputs
- [ ] Scroll: smooth, no horizontal overflow

### 768px tablet:
- [ ] Cards: 2 kolumny
- [ ] Tech stack: 3 kolumny
- [ ] About: side-by-side founders

### 1280px+ desktop:
- [ ] Max-width container (max-w-6xl lub 7xl)
- [ ] Comfortable spacing
- [ ] Cards: 4 kolumny (lub 2x2)
- [ ] Tech stack: 5 kolumny

---

## 9. ACCESSIBILITY (WCAG 2.1 AA)

- [ ] Skip to content link: pierwszy element, sr-only, focus:not-sr-only, href="#main-content"
- [ ] <main id="main-content"> present
- [ ] Heading hierarchy: h1 "Programo" (1 per page), h2 (section titles), h3 (project titles, tech names)
- [ ] Nav: role="navigation", aria-label="Menu glowne"
- [ ] Footer: <footer> semantic tag
- [ ] Language toggle: aria-label="Zmien jezyk" / "Change language"
- [ ] Social links: aria-label per link + target="_blank" + rel="noopener noreferrer"
- [ ] Contact form: label+htmlFor on EVERY input, aria-describedby on error elements
- [ ] Images: opisowy alt text (nie "screenshot1.png")
- [ ] Color contrast: 4.5:1 minimum — sprawdz szary tekst na sage/beige bg!
- [ ] Focus visible: outline na KAZDYM interactive (buttons, links, inputs, cards, nav items)
- [ ] Tab order: przejdz CALA strone Tab-em, zero utkniec, logiczna kolejnosc
- [ ] Cards: role="article" lub <article> tag

---

## FINALIZACJA

- `npm run build` — 0 errors, 0 warnings, all 5 pages ○ Static
- `npm run lint` — 0 errors, 0 warnings
- `npm run test` — 80+ tests ALL passing
- Przejdz KAZDA strone w PL i EN — 0 console errors
- Lighthouse: >95 Performance, >95 Accessibility, >95 SEO
- Zaktualizuj progress.md

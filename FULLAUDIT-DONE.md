# Full Audit (wyglądowy) + Fix — DONE — 2026-07-15

## Build Status
- npm run build — OK (32 strony)
- npx tsc --noEmit — 0 błędów
- npx vitest run — 98/98 (8 plików)
- SSR opacity:0 na homepage: 41 → 1

## Naprawiono
| Obszar | Zakres | Kluczowe pliki |
|--------|--------|----------------|
| Mockupy urządzeń | Przeprojektowany BrowserFrame (neutralny pasek macOS z kapsułą adresu, warstwowe cienie, tone="dark", glass sheen) i PhoneFrame (tytanowa krawędź, przyciski boczne, dynamic island z kamerą, fadeBottom); grid home bez twardego cięcia ramek (wzorzec peek + gradient) | ui/browser-frame, ui/phone-frame, home/portfolio-grid |
| Zróżnicowanie portfolio | Pole `presentation` per projekt: PoolTimer/W.Safe/Rejestr/Solvio/ePortal = ciemny kanwas z bgColor+accentColor (PoolTimer z KOKPITEM trenera zamiast landingu), Estalo = mozaika 2 ramek (Enterprise+CRM), Jedmar = rząd telefonów, klienci = jasny DeviceDuo; karty /projekty z ciemnymi kaflami dla ciemnych produktów; h1 na /projekty | projects.ts, ProjectDetailClient, featured-work |
| Motion | initial={false} nad foldem, Reveal niżej; useReducedMotion w page-transition/scroll-progress/navbar/footer/cookie-banner; jeden system easingów z lib/motion; utility .card-hover; CtaButton + magnetic hover w hero | main-intro, trust-bar, tech-stack, projects-marquee, globals.css |
| Typografia | H3 w Newsreader + mint-karty na stronach SEO; miara 68–82 zn./linię (było 88–160); sieroty (nbsp) w stopce i nagłówkach | software-house-poznan, ile-kosztuje-aplikacji, strony-internetowe, footer |
| A11y | Escape+focus-trap (menu mobile, modal cookies), aria-expanded/controls, tap-targety 44px, kontrast 2.5–4:1 → 7.5–8.6:1, aria-describedby błędów formularzy, role="status" sukcesu, header landmark, naprawiony zdublowany main na 2 stronach, title 404 | navbar, cookie-banner, quick-contact, compact-lead-form |

## Pominięto (świadomie / do decyzji)
- Ciemne zrzuty produktowe dla ePortal/Rejestr/Solvio na kartach (ich realne strony są jasne — uczciwość > efekt); Solvio docelowo wariant „phones" po zrzutach iOS.
- Zgłoszony osobnym chipem: framer-motion AnimatePresence nie usuwa węzłów po exit (podejrzenie artefaktu headless; do zbadania w dedykowanej sesji — task_d298e033).
- Duplikaty assetów w /screenshots/v2 (stare aliasy nazw) — porządkowe, nieblokujące.

## Raporty źródłowe
docs/audit-visual/{mockupy,roznorodnosc,typografia,motion,ux-a11y}-report.md + FULLAUDIT-REPORT.md

# Full Audit Report (wyglądowy) — programo.pl — 2026-07-15

## Overall Risk Score: ŚREDNI (wizerunkowy, nie funkcjonalny)

## Executive Summary
Strona jest funkcjonalnie zdrowa (tracking, konwersja, treść), ale warstwa prezentacji ma
cztery systemowe słabości: (1) mockupy urządzeń były generyczne i ucinane w połowie na home,
(2) 7/10 detali projektów i 9/10 kart portfolio wygląda identycznie (jasny landing w tej samej
ramce), mimo że dane per projekt (accentColor/bgColor, nieużywane assety: kokpit PoolTimera,
ciemny dashboard Estalo Enterprise) pozwalają je zróżnicować, (3) motion nie ma jednego
systemu (5 hoverów kart, 14 plików ignoruje reduced-motion, 41 elementów niewidocznych w SSR),
(4) typografia i kontrast łamane punktowo (H3 bez Newsreader na stronach SEO, miara 90–160
znaków/linię, opacity-modyfikatory 2.2–4.4:1 poniżej AA, brak h1 na /projekty, brak Escape
w mobilnym menu). Szczegóły: docs/audit-visual/*.md.

## Problemy KRYTYCZNE (P0)
1. [MOCKUPY] home portfolio-grid.tsx — ramki twardo ucinane w połowie (h-[280px] overflow-hidden);
   wzorzec naprawy już istnieje w featured-work.tsx (rounded-none border-0 shadow-none + karta trzyma radius).
2. [MOCKUPY] estalo-mobile.webp — desktopowy layout ściśnięty w pionowym kadrze (zły zrzut źródłowy) → wymienić asset.
3. [RÓŻNORODNOŚĆ] 7/10 hero detali = identyczny jasny DeviceDuo; karty 9/10 = ten sam BrowserFrame →
   3 warianty hero (A jasny dla stron klienckich, B ciemny kanwas z bgColor/accentColor dla produktów,
   C rząd telefonów dla mobile-app, D mozaika 2 zrzutów dla Estalo) + ciemne karty dla ciemnych produktów.
4. [MOTION] prefers-reduced-motion nieobsłużone w 14 plikach framer-motion; 41 elementów opacity:0 w SSR.
5. [TYPOGRAFIA] H3 bez font-headline na /software-house-poznan i /ile-kosztuje-aplikacji; miara 131–160 zn./linię.
6. [A11Y] /projekty bez h1; brak Escape/focus-trap (mobilne menu, modal cookies); kontrast ~14 miejsc <4.5:1.

## Problemy WYSOKIE (P1)
- BrowserFrame bar w kolorze motywu strony (szałwiowy) nad ciemnymi zrzutami (wsafefinanse) → tone="dark" per zrzut.
- Chaos motion: lib/motion.ts używany w 2/15 plików; easing kopiowany literałem; 5 różnych liftów hover.
- max-w-[68ch] daje 90–96 zn./linię; sieroty w H1/stopce; wzorce (FAQ, karty osób) w 2–4 rozmiarach między stronami.
- Tap-targety mobile nav <44px; błędy formularzy bez aria-describedby; QuickContact sukces bez role="status"; brak <header>.

## Quick wins
- CtaButton w hero zamiast ręcznych klas; nagłówek 404 z własnym <title>; sprzątnięcie zdublowanych assetów
  (eportalprawny-* vs eportal-prawny-*, wks-* vs wks-poznan-*, skup-* vs skup-nieruchomosci-*).

## Co działa dobrze
DeviceDuo (wzorcowy), Reveal/CountUp (reduced-motion safe), FAQ accordion (wzorcowy),
skip-link, cookie banner z realnym „Tylko niezbędne", 100% obrazów z sensownym alt,
kontrast bazowych tokenów 5.7–16.8:1, scroll-snap w detalu Jedmara.

## Statystyki
| Obszar | P0 | P1 | P2 |
|--------|----|----|----|
| Mockupy | 2 | 2 | 3 |
| Różnorodność | 1 | 2 | 2 |
| Typografia/rytm | 2 | 4 | 6 |
| Motion | 2 | 2 | 2 |
| UX/a11y | 3 | 4 | 5 |
| **SUMA** | **10** | **14** | **18** |

Uwaga metodologiczna: „martwe pustki >200px" z wcześniejszego review to artefakt scroll-reveal
w headless — po wymuszeniu opacity:1 żadna strona nie ma realnych dziur (typografia-report).

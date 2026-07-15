# Audyt animacji i mikrointerakcji — programo.pl

Data: 2026-07-15
Zakres: `src/components`, `src/app`, `src/lib/motion.ts`, `src/app/globals.css`. Build weryfikowany na `http://localhost:3200`.
Metoda: pełny przegląd kodu (grep + Read wszystkich plików z `framer-motion`, Lenis, Reveal/CountUp), plus weryfikacja na żywo: fokus klawiaturą (Tab) na realnym DOM, `curl` surowego SSR HTML pod kątem stanów `opacity:0`. Interakcje myszą (hover) w przeglądarce podglądu okazały się niestabilne w tej sesji (samoistne, niewywołane przeze mnie przejścia między stronami) — te ustalenia oparte są więc o klasy `hover:` w kodzie, nie o zrzuty ekranu z realnym hoverem.

---

## Streszczenie

Strona ma dobrze zaprojektowany, ale **w większości nieużywany** system motion (`src/lib/motion.ts`). Trzy komponenty (`Reveal`, `CountUp`, `DeviceDuo`) są wzorcowe — każdy jawnie obsługuje `prefers-reduced-motion` i ma zabezpieczenie przed "zawieszeniem" w stanie niewidocznym. Reszta kodu (ok. 14 plików, w tym navbar, hero, cały footer, cookie banner, tech stack, quick-contact) korzysta z surowego `framer-motion` z ręcznie wpisywanymi wartościami czasu/easingu i **bez** sprawdzenia reduced-motion. Karty portfolio mają 5 różnych wariantów hovera zamiast jednego systemu.

Najważniejszy, policzalny fakt: **41 elementów na samej stronie głównej renderuje się w surowym SSR HTML z `opacity:0`** (sprawdzone przez `curl` builda produkcyjnego trybu dev, bez wykonania JS). Dopóki JS się nie zhydratuje, ten content nie istnieje wizualnie.

---

## Findingi

### P0 — `prefers-reduced-motion` nie jest respektowane dla animacji JS (framer-motion)

**Co jest:** globalna reguła w `src/app/globals.css:151-160`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

To zeruje **tylko** czyste animacje/transitiony CSS (świetnie działa dla `.animate-slide-left`, `.pm-track`, `.projects-marquee__track` — te mają nawet redundantnie własne media query). **Nie ma żadnego wpływu** na `framer-motion`, bo `motion.div` z propsami `animate`/`whileInView`/`initial` steruje transformem/opacity przez JS (rAF / WAAPI), nie przez CSS `transition`.

**Kto sprawdza `useReducedMotion()` (framer-motion), a kto nie:**

| Sprawdza (3 pliki) | NIE sprawdza (14 plików) |
|---|---|
| `src/components/ui/reveal.tsx` | `src/components/navbar.tsx` |
| `src/components/ui/count-up.tsx` | `src/components/footer.tsx` |
| `src/components/ui/device-duo.tsx` | `src/components/main-intro.tsx` |
| | `src/components/featured-work.tsx` |
| | `src/components/projects-marquee.tsx` |
| | `src/components/quick-contact.tsx` |
| | `src/components/cookie-banner.tsx` |
| | `src/components/sticky-cta.tsx` |
| | `src/components/tech-stack.tsx` |
| | `src/components/trust-bar.tsx` |
| | `src/components/page-transition.tsx` |
| | `src/components/scroll-progress.tsx` |
| | `src/app/kontakt/contact-hero.tsx` |
| | `src/app/polityka-prywatnosci/PrivacyPageClient.tsx` |
| | `src/app/crm/LoginForm.tsx`, `LeadsDashboard.tsx` |

**Efekt:** ktoś z ustawieniem "ogranicz ruch" (motion sickness, przedsionkowe) w systemie nadal dostaje pełny page-transition, mobile menu z `clipPath` circle-reveal, hero fade+rise, hover-scale w tech-stack itd. — na 82% powierzchni animowanego kodu.

**Rekomendacja:** dodać `useReducedMotion()` (lub scentralizować w `lib/motion.ts` jako helper `getTransition(reduce)`) wszędzie, gdzie występuje `motion.*` z `initial`/`animate` różnym od stanu końcowego. Najszybciej: przepisać te 14 plików na `<Reveal>` / warianty z `lib/motion.ts`, które już to obsługują (patrz P1).

---

### P0/P1 — 41 elementów strony głównej renderuje się niewidocznie w SSR HTML

**Dowód** (`curl http://localhost:3200/ | grep -o 'opacity:0'` → **41** trafień na samej stronie głównej):

```
style="opacity:0;transform:translateY(-30px)"   ← navbar (desktop)
style="opacity:0;transform:translateY(-20px)"   ← navbar (mobile)
style="opacity:0;transform:translateX(-16px)"   ← hero eyebrow
style="opacity:0"                                ← trust-bar client strip
style="opacity:0;transform:translateY(24px)"    ← Reveal-owe sekcje (×6+)
```

Framer-motion domyślnie renderuje `initial={{opacity: 0, ...}}` jako inline `style` już w SSR. Dopóki JS nie zhydratuje się i animacja nie ruszy, ten fragment DOM istnieje, ale jest wizualnie pusty. Na wolnym urządzeniu / wolnym łączu to realny, mierzalny "flash of invisible content" — nie tylko teoria.

`Reveal.tsx` ma na to świadome zabezpieczenie (komentarz w kodzie: "hardened so it NEVER leaves content permanently invisible" — fallback po 1.2 s + `viewport margin -8%`), ale te 41 wystąpień pochodzi też z komponentów, które go **nie** używają (navbar, hero, trust-bar pierwszy blok) i nie mają żadnego fallbacku poza samą hydratacją.

**Rekomendacja:** dla contentu above-the-fold (navbar, H1, hero eyebrow) rozważyć `initial={false}` (main-intro.tsx robi to już dla H1/P — dobry wzór, warto go rozszerzyć na eyebrow-span i na navbar) albo przenieść te elementy pod `Reveal`.

---

### P1 — Współdzielony system motion (`src/lib/motion.ts`) istnieje, ale prawie nikt go nie importuje

`src/lib/motion.ts` definiuje porządną hierarchię: `easeEntry = [0.16,1,0.3,1]`, `easeExit`, `easeHover`, `easePageTransition`, `durationFast=0.3 / durationMedium=0.6 / durationSlow=0.9`, `springGentle`, gotowe warianty `fadeInUp`, `scaleIn`, `clipRevealUp`. To dokładnie to, czego potrzeba do "jednego systemu motion".

W praktyni realnie importuje go tylko `navbar.tsx` (częściowo — jeden hardkodowany `duration: 0.6` nawet tam się przemyca, linia 281) i `page-transition.tsx`.

Wszędzie indziej ten sam krzywy easing `[0.16, 1, 0.3, 1]` jest **wklejony jako literał** (nie import) w ~13 plikach, ale z **dowolnym** czasem trwania zamiast trzymania się skali 0.3/0.6/0.9:

| Plik | `duration` użyte |
|---|---|
| `sticky-cta.tsx:80` | 0.35 |
| `tech-stack.tsx:119/128/137` | 0.6 / 0.8 / 0.8 |
| `main-intro.tsx:23/32/41` | 0.6 (bez ease) / 0.8 / 0.8 |
| `cookie-banner.tsx:65/123/131` | 0.4 / 0.25 (bez ease) / 0.35 |
| `quick-contact.tsx:215/244` | 0.5 / 0.6 (bez ease) |
| `trust-bar.tsx:37/63` | 0.8 (bez ease) / 0.6 |
| `featured-work.tsx:82` | 0.4 |
| `reveal.tsx:41` | 0.7 |
| `lenis-provider.tsx:21` | 1.2 (osobna skala — scroll, nie OK/źle, ale też nie z `lib/motion.ts`) |
| `contact-hero.tsx:15/23/31` | 0.5 (bez ease we wszystkich trzech) |
| `PrivacyPageClient.tsx:18` | 0.5 |
| `crm/LoginForm.tsx:46` | 0.7 (własna lokalna stała `EASE`, identyczna z `easeEntry`) |
| `crm/LeadsDashboard.tsx:478` | 0.3 (ta sama własna `EASE`) |

Efekt: 10 różnych wartości `duration` (0.25 → 1.2 s) zamiast 3 zdefiniowanych presetów, plus kilka miejsc bez `ease` w ogóle (domyślny easing framer-motion różni się od `easeEntry`, więc te elementy "czują się" subtelnie inaczej mimo tej samej krzywej-intencji). CRM nawet redeklaruje własną kopię stałej zamiast importu.

**Rekomendacja:** import `easeEntry`/`durationFast/Medium/Slow` (lub bezpośrednio `fadeInUp`/`scaleIn`) wszędzie zamiast literałów. Mechaniczna, tania zmiana — bez ryzyka wizualnego (te same wartości), ale usuwa dryf na przyszłość.

---

### P1 — Karty portfolio/tech: 5 różnych wariantów hover zamiast jednego

| Komponent | Lift (translate-y) | Border/shadow | Timing |
|---|---|---|---|
| `featured-work.tsx:89` (/projekty) | `-translate-y-1` | `border-primary/50` + `shadow-xl` | `duration-300` |
| `home/portfolio-grid.tsx:71` (home) | **brak** na kontenerze; tylko wewnętrzna ramka urządzenia `group-hover:-translate-y-1` | `border-primary/50` + custom shadow | `duration-300` (karta) / `duration-500` (ramka) |
| `projects-marquee.tsx:35` (home, marquee) | `-translate-y-2` | `border-primary/60` + `shadow-2xl` | `duration-500 ease-out` |
| `tech-stack.tsx:34` | `-translate-y-2.5` | custom glow-shadow | `duration-500` |
| `case-studies.tsx:66` (landingi Ads) | **brak** | tylko `border-outline` | `transition-colors` (brak duration → domyślne 150 ms Tailwind) |

Efekt: ten sam typ obiektu — "karta projektu z screenshotem" — podnosi się o 4 różne wartości (0 / 1 / 2 / 2.5) w 2 różne czasy (300/500 ms), a na landingach Ads w ogóle się nie podnosi. Odwiedzający, który przechodzi z home na /projekty, dostaje wizualnie inny "feel" karty dla identycznej treści.

**Rekomendacja:** jeden wariant karty (patrz tabela systemu niżej) używany wszędzie tam, gdzie karta = link do projektu/case study.

---

### P2 — `CtaButton` istnieje jako "kanoniczny" komponent, ale hero go nie używa

`src/components/ui/cta-button.tsx` ma komentarz wprost mówiący, że jego klasy są "identyczne jak na homepage (MainIntro), żeby każde CTA na stronie było spójne wizualnie". W praktyce `main-intro.tsx` (hero, najważniejsze miejsce na stronie) **nie renderuje `<CtaButton>`** — ręcznie duplikuje ten sam string klas (`hover:gap-5 hover:bg-primary-container ...`) bezpośrednio w JSX (main-intro.tsx:50, :59). Też `featured-work.tsx:222` i `home/portfolio-grid.tsx:149` robią to samo.

Sam wzorzec (strzałka `→` odsuwająca się na hover, `hover:gap-5`) jest dobry i spójnie odtworzony ręcznie w ~10 miejscach — ale skoro istnieje gotowy komponent do tego, kopiowanie klas zamiast importu to czysty dług: zmiana w `CtaButton` (np. nowy `duration-200` zamiast domyślnego) nie dotrze do hero.

**Rekomendacja:** podmienić ręczne `<a className="...">` na `<CtaButton>` wszędzie, gdzie się da (main-intro to ma być pierwszy kandydat — to najbardziej eksponowane CTA na stronie).

---

### P2 — Duplikacja logiki `Reveal` zamiast jego użycia

`Reveal.tsx` jest jedynym komponentem z pełnym zestawem zabezpieczeń (reduced-motion + fallback timer + capped offset). Mimo to następujące pliki reimplementują ten sam wzorzec (`initial={{opacity:0,y:N}}` → `animate`/`whileInView`) ręcznie, bez żadnego z tych zabezpieczeń: `main-intro.tsx`, `contact-hero.tsx`, `trust-bar.tsx` (pierwszy blok), `tech-stack.tsx`, `quick-contact.tsx`, `PrivacyPageClient.tsx`. To ok. 40% wszystkich scroll/mount-reveal-i na stronie omija komponent, który został wyraźnie zbudowany jako standard.

---

## Rzeczy, które działają dobrze (nie ruszać)

- **Scroll do `#kontakt`**: `ContactCtaLink` (`src/components/contact-cta-link.tsx`) robi `scrollIntoView({behavior:'smooth', block:'start'})` na `#kontakt-main` (id renderowany przez `quick-contact.tsx:138`, zagnieżdżony w `#kontakt` z `contact-bookend.tsx`) — działa poprawnie, potwierdzone w kodzie. Jedyny drobny minus: `main-intro.tsx` hero CTA "Bezpłatna konsultacja" używa zwykłego `href="#kontakt"` zamiast `<ContactCtaLink>`, więc jest to drugi, równoległy sposób dotarcia do tego samego miejsca (działa dzięki globalnemu `html{scroll-behavior:smooth}`, ale to niepotrzebny drugi kod-path).
- **Scroll-snap w detalu Jedmar (mobile)**: `ProjectDetailClient.tsx:49-57` — pasek 3 zrzutów telefonu w hero ma własny, samodzielny `overflow-x-auto` + `snap-x snap-mandatory` + `snap-center`, celowo odizolowany (`-mx-6 px-6`), żeby nigdy nie wywołać poziomego scrolla całego dokumentu. Zaimplementowane wyłącznie dla projektów typu `mobile-app` (Jedmar) — poprawnie.
- **`Reveal` / `CountUp` / `DeviceDuo`**: wzorcowe. `CountUp` renderuje finalną wartość na serwerze (żadnego "0 → X" freeze dla crawlerów/reduced-motion), `Reveal` ma fallback na wypadek, gdy IntersectionObserver nigdy nie odpali, `DeviceDuo` wyłącza parallax scrollowy pod `useReducedMotion`.
- **Focus-visible**: sprawdzone realnym Tab na żywym buildzie (nie programowym `.focus()`, które nie triggeruje `:focus-visible` w Chromium) — globalna reguła `:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px }` (globals.css:162) działa poprawnie i konsekwentnie na linkach nawigacji. Dodatkowo część interaktywnych elementów (CTA, karty, inputy formularza) ma też jawne klasy `focus-visible:outline-*` w Tailwind — redundantne z regułą globalną, ale nieszkodliwe.
- **Marquee (`tech-stack` CSS + `projects-marquee` CSS)**: obie karuzele mają własne, redundantne `@media (prefers-reduced-motion: reduce)` blokujące `animation`, plus pauzę na `:hover`/`:focus-within` — to jest wzorcowo zrobione (w przeciwieństwie do framer-motion gdzie indziej).

---

## Rekomendowany JEDEN system motion

| Element | Efekt | Timing / easing | Źródło (istnieje już) |
|---|---|---|---|
| Wejście sekcji przy scrollu (nagłówki, akapity, karty) | fade + rise 24px | `duration: 0.6s`, `ease: easeEntry [0.16,1,0.3,1]` | `Reveal` + `durationMedium`/`easeEntry` z `lib/motion.ts` |
| Wejście above-the-fold (navbar, H1 hero) | fade + rise **lub** `initial={false}` gdy element musi być natychmiast czytelny dla crawlerów/no-JS | `duration: 0.3s`, `easeEntry` | `durationFast` z `lib/motion.ts` |
| Karta portfolio/tech (hover) | `-translate-y-1.5` + `border-primary/50` + `shadow-xl` — **jedna** wartość lift dla wszystkich 4 miejsc | `duration: 0.3s`, `ease: easeHover [0.25,0.1,0.25,1]` | nowy wspólny util-class, np. `.card-hover` w globals.css |
| CTA z odsuwającą się strzałką | `gap-3 → gap-5` | `duration: 0.3s`, `ease: easeHover` | już istnieje w `cta-button.tsx` — użyć wszędzie |
| Modal / overlay (cookie settings, mobile menu) | fade / clipPath reveal | `duration: 0.35–0.4s`, `easePageTransition` | `easePageTransition` z `lib/motion.ts`, obecnie nieużywane |
| Marquee / auto-scroll | CSS `@keyframes` + `prefers-reduced-motion` blokujący `animation` | jak jest teraz | już OK, nie zmieniać |
| Spring (wskaźnik aktywnej zakładki nav, progress bar) | spring | `springGentle {stiffness:100, damping:20, mass:0.5}` | już zdefiniowane, używane tylko w navbar — rozszerzyć na inne layout-shifty |

Praktyczny plan wdrożenia: (1) każdy plik z literałem `[0.16, 1, 0.3, 1]` → import `easeEntry`; (2) każdy `duration: 0.X` poza {0.3, 0.6, 0.9} → zaokrąglić do najbliższego presetu; (3) ujednolicić lift kart do jednej klasy; (4) dodać `useReducedMotion()` (albo owinąć w `Reveal`) w 14 plikach z listy P0.

---

## 2-3 dodatki premium (tanie, duży efekt)

1. **Spójny hover-reveal na wszystkich kartach portfolio** (opisany wyżej jako P1) — to jest właśnie "jedna dopracowana mikrointerakcja" z brief-u: dziś to 5 wariantów, po ujednoliceniu staje się rozpoznawalnym podpisem marki przy każdym kliknięciu w projekt. Najtańsze z trzech (czysty CSS/Tailwind, zero nowego JS).

2. **Magnetic effect na głównym CTA hero** ("Bezpłatna konsultacja" / "Oddzwońcie do mnie" w `main-intro.tsx`) — przycisk lekko podąża za kursorem w promieniu ~20px (transform translate ograniczony do małego zakresu, `mousemove` + `springGentle` już zdefiniowany w `lib/motion.ts`, więc fizyka jest gotowa). Typowy "premium SaaS" sygnał, tania implementacja (~30 linii, jeden nowy hook `useMagnetic`), wysoki postrzegany efekt na najważniejszym elemencie konwersji strony.

3. **Parallax w `DeviceDuo` jest już zrobiony (telefon), ale tylko w Jedmar case study** — warto rozszerzyć identyczny wzorzec (telefon ±28px przeciwnie do kierunku scrolla) na `portfolio-grid.tsx` (home) i `featured-work.tsx` (/projekty), gdzie dziś `BrowserFrame`/`PhoneFrame` są całkowicie statyczne poza samym hover-liftem. Zero nowego kodu — `DeviceDuo` już istnieje i już respektuje reduced-motion, brakuje tylko użycia go w tych dwóch miejscach zamiast gołych `BrowserFrame`/`PhoneFrame`.

---

## Uwaga metodologiczna

Weryfikacja hover states i realnych zrzutów `:hover` w przeglądarce podglądu nie została domknięta w 100% — sesja przeglądarki wykazywała samoistne przejścia między podstronami niepowiązane z wykonywanymi akcjami (np. pojedyncze wywołanie `screenshot` zmieniało załadowaną stronę), co wygląda na artefakt narzędzia/sesji, a nie zachowanie samej strony. Ustalenia dot. hoverów opierają się więc o analizę klas Tailwind w kodzie źródłowym (wysoka pewność, bo klasy są jednoznaczne), nie o wizualne zrzuty stanu `:hover`. Fokus klawiaturą (Tab) został zweryfikowany na żywo i działał poprawnie. Rekomendowana ręczna weryfikacja hover states w prawdziwej przeglądarce Wojtka przed wdrożeniem zmian.

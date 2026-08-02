---
name: Programo
description: Studio software z Poznania — strona-wizytowka i kanal pozyskiwania klientow.
colors:
  forest-ink: "#051F20"
  mint-text: "#DAF1DE"
  sage-accent: "#8EB69B"
  forest-sunken: "#031517"
  forest-raised: "#0A2A28"
  forest-container: "#143531"
  forest-high: "#1D453D"
  hairline-subtle: "#163832"
  hairline-emphasis: "#235347"
  cream-surface: "#FAF8F4"
  cream-raised: "#F0EDE6"
  cream-ink: "#1A1816"
  cream-muted: "#6B6560"
  cream-border: "#E5E0D5"
  light-base: "#FBFDFB"
  light-raised: "#F1F7F2"
  light-container: "#E4EFE7"
  light-high: "#D3E6D9"
  light-accent: "#235347"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 1.63rem + 4.98vw, 5.25rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.025em"
    fontVariation: "wdth 108"
  h2:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.44rem + 2.49vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
    fontVariation: "wdth 110"
  h3:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 1.22rem + 1.24vw, 2.125rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  h4:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1.01rem + 0.5vw, 1.375rem)"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "-0.005em"
  lead:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.125rem, 0.96rem + 0.75vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    letterSpacing: "0.05em"
rounded:
  input: "8px"
  card: "16px"
  pill: "9999px"
  image: "16px"
  footer: "32px"
spacing:
  section-major: "clamp(6rem, 4rem + 8vw, 11rem)"
  section: "clamp(4.5rem, 3.6rem + 3.6vw, 7.5rem)"
  section-tight: "clamp(3rem, 2.6rem + 1.6vw, 4.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.sage-accent}"
    textColor: "{colors.forest-ink}"
    rounded: "{rounded.pill}"
    padding: "14px 32px"
  button-primary-hover:
    backgroundColor: "{colors.hairline-emphasis}"
    textColor: "{colors.mint-text}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.mint-text}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  input-default:
    backgroundColor: "{colors.forest-raised}"
    textColor: "{colors.mint-text}"
    rounded: "{rounded.input}"
    padding: "14px 16px"
  nav-link:
    textColor: "rgba(218, 241, 222, 0.88)"
    padding: "10px 0"
  nav-link-active:
    textColor: "{colors.mint-text}"
---

# Design System: Programo

## 1. Overview

**Creative North Star: "Las o zmierzchu"**

System wizualny Programo to ciemna, leśna paleta z jednym wyrazistym krojem display i typografią systemową na ciele tekstu. Strona jest próbką pracy studia -- każdy detal jest argumentem sprzedażowym albo kontrargumentem, ponieważ studio sprzedaje wykonanie oprogramowania. Wizualne decyzje są podporządkowane jednemu celowi konwersyjnemu: skłonić odwiedzającego do zostawienia numeru telefonu.

Estetyka jest spokojna, pewna siebie i precyzyjna. Nie próbuje się podobać -- próbuje wzbudzić zaufanie. Jest to system jednogłosowy: jeden kolor akcentu, jeden krój display, jeden styl elementów interaktywnych. Różnorodność powstaje z hierarchii głębokości (pięciostopniowa rampa surface) i z rytmu sekcji (trzy poziomy paddingu), nie z różnorodności kolorów ani kształtów.

System odrzuca: stockowe zdjęcia zespołu przy laptopach, niebieskie gradienty i fioletowe poświaty, sekcje "Nasze wartości" z ikonami w kółkach, ściany logotypów technologii, białe minimalistyczne hero w stylu Apple, awangardowy layout kosztem czytelności (custom cursor, poziomy scroll), korporacyjny dystans (granat + szarość), generyczny SaaS landing (hero z metryką, "Trusted by", gradient text). Jeśli efekt da się opisać jako "wygląda jak strona produktowa Apple" lub "wygląda jak polski software house z szablonu", jest do przerobienia.

**Kluczowe cechy:**
- Ciemny motyw domyślny -- leśna zieleń, projektowana jako stan główny; jasny motyw jest opcjonalnym przełącznikiem
- Jeden webfont (Archivo variable) wyłącznie na nagłówki; reszta na stosie systemowym, zero kosztu transferu dla body
- Pięciostopniowa rampa głębokości tła z równomiernym odstępem percepcyjnym (L* ok. 6 / 10 / 15 / 20 / 26)
- Trzystopniowy rytm sekcji (`section-major` / `section` / `section-tight`) -- sąsiednie sekcje nigdy nie dzielą tego samego poziomu
- WCAG 2.2 AA jako wymóg twardy, zweryfikowany audytem z kompozytowaniem pełnego łańcucha przezroczystości
- Nawigacja w formie frosted-glass pill, która podąża za motywem strony (nie odwraca go)
- `prefers-reduced-motion` obsłużone na trzech poziomach: CSS global, `MotionConfig reducedMotion="user"`, per-komponentowe branching na `useReducedMotion()`

## 2. Colors

Paleta leśnej zieleni -- od niemal czarnego dna (#031517) do mięty (#DAF1DE), z szałwią (#8EB69B) jako jedynym akcentem. Ograniczenie do jednego odcienia akcentu jest celowe: jego rzadkość nadaje mu wagę.

### Primary

- **Szalwiowy akcent** (#8EB69B): jedyny kolor wyróżniający elementy interaktywne (przyciski, linki, focus ring, wskaźnik aktywnej nawigacji, status "live"). W motywie jasnym zastąpiony ciemną zielenią #235347 dla zachowania kontrastu na białym tle. Używany oszczędnie -- jeśli zajmuje więcej niż 10% ekranu, system przestaje działać.

### Neutral

Rampa tła dark (`:root` w `globals.css:1-79`):
- **Zatopione dno** (#031517, `--theme-bg-0`): najgłębszy poziom -- insets, studnia footera, tła za mediami
- **Baza** (#051F20, `--theme-bg-1`): ciało strony, sekcje pełnej szerokości (hero, founders, quick-contact, services-overview)
- **Wyniesiony** (#0A2A28, `--theme-bg-2`): pasma spokojnych sekcji (process/`surface-container-low`)
- **Kontener** (#143531, `--theme-bg-3`): karty, panele, dropdown nawigacji
- **Wysoki kontener** (#1D453D, `--theme-bg-4`): hover, aktywne stany, zagnieżdżone panele

Rampa tła light (`[data-theme="light"]` w `globals.css:81-126`):
- #FFFFFF / #FBFDFB / #F1F7F2 / #E4EFE7 / #D3E6D9 -- lustrzane odbicie, "zatopione" to czysty biały

Tekst:
- **Miętowy tekst** (#DAF1DE, `--theme-text-1`): główny tekst w trybie ciemnym
- **Szałwiowy wtórny** (#8EB69B, `--theme-text-2`): tekst drugorzędny, opisy, placeholdery

Linie:
- **Cienka linia** (#163832, `--theme-border-1`): hairline na bg-0...bg-2
- **Mocna linia** (#235347, `--theme-border-2`): hairline na bg-3...bg-4, krawędzie akcentowe

Strefa alt (`--theme-alt-*`, odwrócona paleta):
- Dark: kremowe tło #FAF8F4 z ciemnym atramentem #1A1816
- Light: leśne tło #051F20 z miętowym tekstem #DAF1DE

**Zakres strefy alt: wyłącznie `src/components/about.tsx` (podstrona `/o-nas`).** To pozostałość sprzed redesignu, nie część systemu strony głównej. Redesign objął `/`, więc ta sekcja go nie przeszła i wciąż niesie ślady poprzedniego systemu (m.in. `font-serif` i `font-headline italic` z czasów pary Newsreader + Plus Jakarta Sans — po usunięciu Newsreadera `font-serif` spada na generyczny szeryf systemowy). Kremowe tło jest też dokładnie tym, przed czym ostrzega brief (nasycony domyślny wybór „ciepłej bieli"). Nie rozszerzaj tej strefy na nowe sekcje i nie traktuj jej jako wzorca — przy następnym podejściu do `/o-nas` należy ją zredukować do rampy leśnej.

Tokeny semantyczne Tailwind (zdefiniowane w `@theme inline` w `globals.css:128-169`) mapują 1:1 na rampę głębokości. Komponenty używają wyłącznie tokenów (`bg-surface`, `text-on-surface`, `border-outline-variant`), nigdy surowych hexów.

### Zasady kolorów

**Zasada jednego akcentu.** System ma jeden kolor akcentu (`--theme-accent`). Nie ma secondary ani tertiary. Jeśli nowy element potrzebuje wyróżnienia, używa akcentu; jeśli już go użyto w tej samej przestrzeni wizualnej, nowy element musi być neutralny. Wprowadzenie drugiego koloru akcentu wymaga jawnej decyzji właścicieli.

**Zasada żywego tokenu.** Każdy kolor w komponencie jest odwołaniem do `var(--theme-*)` lub tokenu Tailwind (`bg-surface-container`, `text-on-surface-variant`). Hardkodowany hex w JSX jest błędem -- łamie przełączanie motywów i utrudnia audyt kontrastu.

**Zasada rampy głębokości.** Pięć poziomów tła istnieje po to, żeby wyrazić hierarchię sekcji. Każda sąsiednia sekcja na stronie głównej używa innego poziomu (`surface` -> `surface-dim` -> `surface-container-low` -> `surface` -> ...). Dwie sąsiednie sekcje z tym samym tłem to utrata hierarchii, nie oszczędność.

## 3. Typography

**Display:** Archivo (variable font, oś `wdth` 75-125) -- jedyny webfont na stronie. Ładowany przez `next/font/google` w `layout.tsx:16-22` jako `--font-archivo` z ustawieniami `display: "swap"`, `preload: true`, subsety `latin` i `latin-ext`.

**Body:** stos systemowy (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`) -- zero kosztu transferu, natychmiastowy rendering, znany feeling dla odwiedzającego. Zdefiniowany jako `--font-body` w `globals.css:155-156`.

**Charakter pary:** kontrast szerokości. Archivo w nagłówkach jest ustawiony na `font-stretch: 105-110%` (rozciągnięty wariant), co odróżnia go od każdego systemowego UI sans. Reszta strony mówi głosem systemu operacyjnego odwiedzającego -- cicho, czytelnie, bez narzucania się. To nie jest para dwóch krojów z wizualną chemią; to celowe napięcie między jednym głośnym elementem a neutralnym tłem.

### Hierarchia

- **Display** (bold, `clamp(2.75rem, 1.63rem + 4.98vw, 5.25rem)`, line-height 1.04, tracking -0.025em, `font-stretch: 108%`): wyłącznie nagłówek hero. Sufit to 84px (5.25rem) -- poniżej progu 96px, od którego nagłówek zaczyna krzyczeć zamiast przemawiać. `globals.css:68`.
- **H2** (semibold/bold, `clamp(2rem, 1.44rem + 2.49vw, 3.25rem)`, tracking -0.02em, `font-stretch: 110%`): tytuły sekcji. Jeden na sekcję -- nigdy dwa H2 w jednej sekcji. `globals.css:69`.
- **H3** (bold/semibold, `clamp(1.5rem, 1.22rem + 1.24vw, 2.125rem)`, tracking -0.02em): podtytuły w sekcjach (nazwy case study, pytania FAQ, bloki usług). `globals.css:70`.
- **H4** (bold, `clamp(1.125rem, 1.01rem + 0.5vw, 1.375rem)`, tracking -0.01em): elementy w listach (kroki procesu, pytania FAQ). `globals.css:71`.
- **Lead** (regular 400, `clamp(1.125rem, 0.96rem + 0.75vw, 1.5rem)`, line-height 1.6): opisy pod nagłówkami sekcji, ciało bloków usługowych. Długość ograniczona do `max-w-[60ch]`. `globals.css:72`.
- **Body** (regular 400, 16px, line-height 1.6, tracking -0.005em): akapity odpowiedzi FAQ, opisy case study. Długość ograniczona do `max-w-[65ch]`. `globals.css:179-183`.
- **Label** (medium 500, 13px, uppercase, tracking 0.05em): linki nawigacji, CTA, tekst przycisków, systemowe etykiety (`navbar.tsx:153`, `navbar.tsx:214`).

### Zasady typograficzne

**Zasada jednego webfonta.** Archivo jest jedynym ładowanym krojem. Nie wolno dodawać drugiego webfonta -- to był świadomy wybór, w którym Newsreader + Plus Jakarta Sans zostały usunięte. Drugi krój oznacza dodatkowe żądanie HTTP, FOUT i ryzyko wejścia na listę "reflex-reject" narzędzi wykrywających generyczne fonty AI. Jeśli element wymaga odróżnienia od body, używa Archivo; jeśli to nie wystarcza, odróżnienie musi powstać z wagi, rozmiaru lub koloru, nie z innego kroju.

**Zasada sufitu display.** Nagłówek display nie przekracza 84px (5.25rem). Wartość jest zhardkodowana w clamp `--step-display`. Podniesienie sufitu wymaga jawnej decyzji -- jest to granica, od której nagłówek zaczyna wyglądać jak plakat zamiast interfejsu.

**Zasada szerokości osi.** Kontrast między nagłówkami a body powstaje z osi `wdth` Archivo (`font-stretch: 105-110%`). To jest jedyny mechanizm wyróżnienia typograficznego oprócz rozmiaru i wagi. Nie wolno go zastępować italic, uppercase na nagłówkach ani zmianą koloru nagłówka na akcent.

## 4. Elevation

System jest płaski w stanie spoczynku. Głębokość wyraża się przez rampę tonalną tła (pięć stopni), nie przez cienie. Cienie pojawiają się wyłącznie w dwóch kontekstach:

1. **Nawigacyjna pigułka** (`.liquid-glass` w `globals.css:295-350`): wielowarstwowy cień z delikatną poświatą akcentu (`0 0 24px rgba(accent, 0.10)`), który intensyfikuje się po scrollu (`data-scrolled="true"`). To jedyny element na stronie z prominentnym cieniem, i jest to celowe -- pigułka musi "unosić się" nad treścią strony.

2. **Cień edytorski** (`.editorial-shadow` w `globals.css:210-212`): `0 20px 40px rgba(0,0,0,0.4)` -- ciężki cień pod zrzutami ekranu w sekcji client-work, nadający im wagę drukowanego artefaktu.

3. **StickyCta** (`sticky-cta.tsx:54`): `shadow-lg shadow-black/20` -- mobilny sticky bar na dole ekranu potrzebuje cienia, żeby oddzielić się od treści pod nim.

Wszystko inne jest płaskie. Karty, panele, sekcje, inputy -- żadne z nich nie mają cienia w stanie domyślnym ani na hover.

### Frosted glass

Nawigacyjna pigułka używa `backdrop-filter: blur(18px) saturate(180%)`, wzmacnianego po scrollu do `blur(28px) saturate(200%)`. Specular highlight na górnej krawędzi (pseudo-element `::before` z gradientem) symuluje refrakcję światła. Jest to jedyny element na stronie z efektem frosted glass -- nie wolno go stosować do kart, tooltipów ani sekcji.

### Zasady głębokości

**Zasada płaskiego spoczynku.** Powierzchnia jest płaska domyślnie. Cień pojawia się wyłącznie jako odpowiedź na stan (hover pigułki nav, scroll-intensyfikacja) lub jako sygnał uniesienia nad viewport (sticky CTA, pigułka nav). Jeśli element nie pływa ponad viewport, nie ma cienia.

**Zasada jedynej pigułki.** Frosted glass (`backdrop-filter + blur`) jest zarezerwowany wyłącznie dla pigułki nawigacji. Dodanie drugiego elementu z frosted glass rozmywa unikalność tego sygnału wizualnego.

## 5. Components

### Buttons

Przyciski są pewne siebie i bezpośrednie -- zaokrąglone pigułki z jednolitym kolorem, bez cieni i gradientów.

- **Kształt:** pełne zaokrąglenie (`rounded-full`, tj. 9999px), co daje kształt pigułki. Wyjątek: przycisk submit w formularzu kontaktowym używa `rounded-lg` (8px) dla wizualnej spójności z polami formularza obok.
- **Primary:** `bg-primary text-on-primary`, padding `px-8 py-4` (formularz) lub `px-6 py-3.5` (hero), `px-5 py-2.5` (nav CTA). Tekst 13-14px, uppercase, tracking-wide/tracking-wider, font-medium/font-semibold. Na hover: `hover:bg-primary-container` (nav) lub `hover:brightness-110` (formularz).
- **Ghost / outlined:** border `border-outline`, tekst `text-on-surface`, na hover `hover:border-primary hover:text-primary`. Padding `px-7 py-3.5`. Uppercase, tracking-widest. Używany jako "Zobacz wszystkie" link w client-work i own-products (`client-work.tsx:207`, `own-products.tsx:111`).
- **Focus:** `focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2` -- konsekwentnie na każdym elemencie interaktywnym.
- **Disabled:** `disabled:opacity-50 disabled:cursor-not-allowed`.

### Inputs / Fields

Pola formularzy są ciche i precyzyjne -- nie rywalizują z nagłówkami o uwagę.

- **Styl:** `border border-outline-variant bg-surface-container-low`, zaokrąglenie `rounded-lg` (8px) lub `rounded-xl` (12px w hero). Padding `px-4 py-3.5`. Tekst `text-on-surface`, placeholder `placeholder:text-on-surface-variant`.
- **Focus:** `focus:border-primary focus:ring-1 focus:ring-primary` (formularz quick-contact) lub `focus:border-primary` bez ring (hero). Brak cienia, brak zmiany tła na focus -- zmiana koloru border jest wystarczającym sygnałem.
- **Checkbox:** `appearance-none`, `h-5 w-5 rounded border border-outline-variant bg-transparent`. Checked: `checked:bg-primary checked:border-primary` z SVG checkmark w `text-on-primary`.
- **Error:** tekst `text-red-500` (quick-contact) lub `text-red-400` (hero), z ikoną SVG i `role="alert" aria-live="assertive"`.

### Navigation

Pigułka nawigacyjna -- pływający element po środku górnej krawędzi viewportu z frosted-glass.

- **Desktop pill** (`navbar.tsx:132-240`): wycentrowana, `fixed top-6 left-1/2 -translate-x-1/2`. Liquid-glass background z `rounded-full`. Wewnętrzny padding `px-6 py-2.5`, linki w odstępach `gap-7`. Logo oddzielone -- `fixed top-5 left-8`, poza pigułką.
- **Mobile pill** (`navbar.tsx:282-354`): wycentrowana pigułka `max-w-fit mt-4 mx-auto` z hamburgerem, logo (78px), toggle motywu i toggle języka. Padding `px-5 py-0.5`, gap `gap-5`.
- **Tekst nav:** 13px, uppercase, font-medium, kolor `rgba(var(--theme-nav-text-rgb), 0.88)` (nieaktywne), `var(--theme-nav-text)` (aktywne/hover). Active indicator: `h-[2px] bg-primary rounded-full` z `layoutId="nav-indicator"` (framer-motion shared layout animation, `springGentle`).
- **Dropdown usług** (`navbar.tsx:183-205`): `rounded-2xl border border-outline-variant/40 bg-surface/95 backdrop-blur-xl shadow-2xl`. Pozycje: `rounded-xl px-4 py-3 hover:bg-surface-container/60`.
- **Mobile overlay** (`navbar.tsx:357-403`): `bg-surface/98 backdrop-blur-lg`, wejście przez `clipPath: circle(0% at 90% 5%)` -> `circle(150% at 90% 5%)`. Linki: `font-headline text-2xl font-normal`, staggered entrance z `easeEntry`.
- **Scroll intensyfikacja:** `data-scrolled="true"` (ustawiany po 40px scrolla) zwiększa blur i opacity pigułki.

**Zasada podążania za motywem.** Pigułka nawigacyjna NIE odwraca motywu strony. W trybie ciemnym: `rgba(218,241,222,0.07)` mint frost z miętowym tekstem. W trybie jasnym: `rgba(255,255,255,0.72)` white frost z ciemnym atramentem. Poprzednia wersja odwracała (jasna pigułka na ciemnym tle) -- to dawało nawigacji większą wagę wizualną niż nagłówek hero i obniżało kontrast nieaktywnych linków do 3.42:1. Opacity pigułki jest zależnością kontrastową tekstu nawigacji -- zmiana opacity wymaga ponownego audytu kontrastu.

### Cards / Containers

System celowo unika identycznych kart. Nie ma jednego wzorca "karta" powtarzanego w pięciu sekcjach (PRODUCT.md: anti-wzorzec "identyczne siatki kart `rounded-3xl` powtórzone w pięciu sekcjach").

- **Zrzuty ekranu case study** (`client-work.tsx:163`): `rounded-lg` (8px), `border border-outline-variant`, `bg-surface-container`, `aspect-[16/10]`. Na hover: `group-hover:scale-[1.02]` z `transition-transform duration-700 ease-out`.
- **Hero screenshot** (`hero.tsx:280`): `rounded-2xl` (16px), `border border-outline-variant`, `bg-surface-container-low`, `aspect-[16/11]`.
- **Kontener footer:** `rounded-t-[32px]`, `bg-surface-container-low`, `mt-12`.
- **Dropdown nawigacji:** `rounded-2xl`, `bg-surface/95`, `backdrop-blur-xl`.

Żaden z tych kontenerów nie ma cienia w stanie spoczynku.

### FAQ Accordion

Natywny `<details>/<summary>` -- wszystkie odpowiedzi są w DOM dla SSR, crawlerów i czytników ekranowych (`faq.tsx:67-103`).

- **Separator:** `border-t border-outline-variant`, ostatni element `last:border-b`.
- **Summary:** `py-5`, tekst `font-headline text-h4 font-bold tracking-tight text-on-surface`, na hover `hover:text-primary`.
- **Ikona:** `h-7 w-7 rounded-full border border-outline-variant`, zawartość `+`, `group-open:rotate-45` (obrót o 45 stopni tworzy x).
- **Odpowiedź:** `pb-6`, tekst body z `max-w-[65ch]`.
- **Pierwszy element otwarty domyślnie** (`open` attribute).

### Sticky CTA (mobile)

Mobilny pasek CTA na dole ekranu (`sticky-cta.tsx`): pojawia się po scrollu poniżej 60% wysokości viewportu, ukrywa się gdy sekcja #kontakt-main jest widoczna. Gradient `bg-gradient-to-t from-surface via-surface/95 to-transparent`, przycisk `rounded-full bg-primary shadow-lg`, respektuje `safe-area-inset-bottom`.

### Scroll Progress Bar (mobile)

Pasek postępu `h-[2px]` na górze viewportu, wyłącznie mobilny (`md:hidden`). Gradient `from-[var(--theme-accent)] to-[var(--theme-text-1)]`, spring animation (`damping: 40, stiffness: 200`). `scroll-progress.tsx:1-20`.

### Section Pattern

Sekcje strony głównej stosują wspólny wzorzec layoutowy (zdefiniowany empirycznie, nie jako komponent):

- **Container:** `mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24`
- **Rytm paddingu:** trzy stopnie -- `py-section-major` (hero, client-work, founders, quick-contact), `py-section` (services-overview), `py-section-tight` (process, faq, own-products). Sąsiednie sekcje nigdy nie dzielą stopnia.
- **Nagłówek sekcji:** `font-headline text-h2 font-bold tracking-[-0.02em] text-on-surface text-balance`, z opcjonalnym `[font-stretch:110%]`. Pod nagłówkiem: lead z `mt-4` lub `mt-5`, `max-w-[60ch]` lub `max-w-[55ch]`, `text-on-surface-variant`.
- **Alternacja tła:** `bg-surface` (baza) / `bg-surface-dim` (zatopione) / `bg-surface-container-low` (wyniesione) -- nigdy dwa razy pod rząd to samo.
- **Wejście animowane:** `initial: { opacity: 0, y: 12-18 }`, `whileInView: { opacity: 1, y: 0 }`, `viewport: { once: true, margin: "-8% 0px" }`, transition `durationMedium` z `easeEntry`. Reduced motion: pominięcie transform, zachowanie opacity fade lub instant.

### Motion Architecture

Ruch jest podporządkowany hierarchii, nie dekoracji. Tokeny w `motion.ts:1-99`.

- **Krzywe:** `easeEntry: [0.16, 1, 0.3, 1]` (snap-in, sygnatura Cuberto) dla wejść; `easeExit: [0.4, 0, 0.2, 1]` dla wyjść; `easeHover: [0.25, 0.1, 0.25, 1]` dla mikro-interakcji; `easePageTransition: [0.76, 0, 0.24, 1]` dla przejść stron.
- **Timing:** `durationFast: 0.3s` (hover, navbar entrance), `durationMedium: 0.6s` (wejścia sekcji, reveal), `durationSlow: 0.9s` (clip-reveal, screenshot entrance).
- **Stagger:** `staggerItem: 0.08s` (elementy list), `staggerChar: 0.03s` (split text), `staggerWord: 0.02s` (akapity).
- **Sprężyny:** `springGentle: { stiffness: 100, damping: 20, mass: 0.5 }` (layout shifts, nav indicator), `springMagnetic: { stiffness: 150, damping: 15, mass: 0.27 }` (przyciski magnetyczne).
- **Reusable variants:** `fadeInUp` (opacity 0 + y:40 -> 1/0), `clipRevealUp`, `clipRevealLeft`, `scaleIn` -- zdefiniowane w `motion.ts` i importowane w komponentach.
- **Reduced motion:** trzy warstwy ochrony. (1) `@media (prefers-reduced-motion: reduce)` w `globals.css:193-202` kasuje CSS animation/transition. (2) `MotionConfig reducedMotion="user"` w `providers.tsx:23` mówi framer-motion, żeby pomijał transform i layout animation, zostawiając opacity. (3) Per-komponentowy `useReducedMotion()` branch w hero, client-work, founders, services-overview, faq, quick-contact -- jeśli user preferuje reduced motion, warianty animacyjne są puste obiekty `{}` lub opacity-only fade. Treść nigdy nie jest ukryta za animacją wejścia.

## 6. Do's and Don'ts

### Do:

- **Do** używać wyłącznie tokenów semantycznych Tailwind (`bg-surface`, `text-on-surface-variant`, `border-outline`) zamiast surowych hexów w JSX. Hexy żyją w `globals.css` w jednym miejscu.
- **Do** testować kontrast tekstu nawigacji po każdej zmianie opacity pigułki -- pigułka jest mierzonym tłem dla tekstu nav, więc jej przezroczystość jest zależnością kontrastową.
- **Do** alternować tło sekcji (`surface` / `surface-dim` / `surface-container-low`) -- dwie sąsiednie sekcje z tym samym tłem to utrata hierarchii.
- **Do** używać trzech stopni paddingu sekcji (`section-major` / `section` / `section-tight`) i nigdy nie powtarzać stopnia w sąsiednich sekcjach.
- **Do** importować tokeny ruchu z `src/lib/motion.ts` zamiast hardkodować krzywe i timing w komponentach.
- **Do** obsługiwać `prefers-reduced-motion` w każdym nowym komponencie z animacją -- branch na `useReducedMotion()`, fallback do opacity-only lub pustych wariantów.
- **Do** używać `text-balance` na nagłówkach i `text-pretty` na akapitach, żeby unikać sierot typograficznych.
- **Do** zachować `max-w-[60ch]` (lead) lub `max-w-[65ch]` (body) na akapitach -- czytelna długość linii jest wymogiem, nie sugestią.
- **Do** prowadzić każdą sekcję nagłówkiem `text-h2` z opisem `text-lead` pod spodem, zachowując spójny wzorzec wejścia.
- **Do** każdemu elementowi interaktywnemu nadawać widoczny `focus-visible` z `outline-2 outline-primary outline-offset-2`.

### Don't:

- **Don't** odwracać pigułki nawigacyjnej (jasna w ciemnym motywie, ciemna w jasnym). Poprzednia wersja dawała 3.42:1 kontrast nieaktywnych linków i wizualnie przygniatała nagłówek hero. Pigułka podąża za motywem strony.
- **Don't** dodawać małych wersalikowych etykiet (`font-mono text-sm text-primary`) nad sekcjami -- to odruch wycięty świadomie (PRODUCT.md: "Odruchy do wycięcia").
- **Don't** używać numeracji 01 / 02 / 03 jako dekoracji w miejscach, które nie są sekwencją. Dopuszczalne wyłącznie w semantycznych listach uporządkowanych (Process).
- **Don't** powtarzać identycznej siatki kart `rounded-3xl` w wielu sekcjach. Każda sekcja ma własny układ dostosowany do treści.
- **Don't** stosować tego samego `opacity: 0 -> y: 24` jako domyślnego wejścia każdej sekcji bez zróżnicowania. Wartość `y` powinna odzwierciedlać wagę elementu (12px tekst pomocniczy, 16-18px nagłówek).
- **Don't** wprowadzać drugiego webfonta. System celowo zrezygnował z Newsreader + Plus Jakarta Sans na rzecz jednego Archivo + stosu systemowego. Drugi webfont wymaga jawnej decyzji właścicieli.
- **Don't** hardkodować hexów kolorów w komponentach -- łamie to przełączanie motywów. Każdy kolor przechodzi przez `var(--theme-*)` lub token Tailwind.
- **Don't** ukrywać treści za animacją wejścia -- `opacity: 0` jako stan domyślny bez fallbacku dla `prefers-reduced-motion` jest naruszeniem WCAG i jawnym zakazem w PRODUCT.md.
- **Don't** używać frosted glass (`backdrop-filter + blur`) na elementach innych niż pigułka nawigacyjna i dropdown nawigacji.
- **Don't** dodawać stockowych zdjęć ludzi przy laptopach, sekcji "Nasze wartości" z ikonkami w kółkach, ścian logotypów technologii, pop-upów z odliczaniem, dark-mode z fioletową poświatą, ani gradient text -- to anty-wzorce zdefiniowane w PRODUCT.md.
- **Don't** przekraczać sufitu 84px (5.25rem) na nagłówku display.
- **Don't** stosować uppercase na nagłówkach sekcji (H2, H3). Uppercase jest zarezerwowany wyłącznie dla tekstu w skali label (13px, nawigacja, CTA).
- **Don't** budować strony tak, żeby wyglądała jak "strona produktowa Apple" (białe minimalistyczne hero z ogromem pustki) ani jak "polski software house z szablonu" (niebieski gradient, stockowe zdjęcia, "kompleksowe rozwiązania").

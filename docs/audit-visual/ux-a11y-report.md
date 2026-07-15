# Audyt UX i dostępności (WCAG 2.1 AA) — programo.pl

Data: 2026-07-15
Zakres: build lokalny `http://localhost:3200` (Next 16.1, repo `programo-site`, main @ `350b975`)
Strony zbadane szczegółowo: `/`, `/projekty`, `/projects/jedmar`, `/oferta`, `/strony-tracking-reklamy`, `/kontakt`
Strony sprawdzone wyrywkowo: `/cennik`, `/o-nas`, `/sklepy-internetowe`, `/strony-internetowe`, `/stack`, `/nieistniejaca` (404)
Metoda: przegląd kodu źródłowego (grep + czytanie komponentów) + DOM/JS w przeglądarce (landmarki, h1/nagłówki, alt, focusable elements, tap-targety) + realne kontrasty policzone z wyrenderowanych pikseli (canvas 2D, `getComputedStyle().color` → Tailwind v4 renderuje kolory w `oklab()`, więc kontrast liczony jest z faktycznie narysowanego koloru, nie z tokenu).
Audyt jest **read-only** — żadne pliki produkcyjne nie zostały zmienione.

## Ocena ogólna

Codebase jest w bardzo dobrym stanie a11y jak na coś napisane w 100% przez agentów: wszystkie obrazy mają sensowny `alt`, wszystkie przyciski mają nazwę dostępną, formularze mają powiązane `<label>`, jest skip-link, FAQ ma poprawny wzorzec akordeonu (`aria-expanded`/`aria-controls`/`role="region"`), touch-targety głównych CTA i pól formularzy trzymają 44–48px, banner cookies jest RODO-poprawny (osobne Akceptuj/Odrzuć/Dostosuj) i nie blokuje strony. Największe realne problemy to: **kontrast tekstu pomocniczego** (systemowe nadużycie modyfikatorów opacity typu `/40`–`/60` na już i tak stonowanym `on-surface-variant`), **brak Escape/focus-trap** w dwóch nakładkach (mobilne menu, modal ustawień cookies) i **brak h1 na `/projekty`**.

---

## P0 — krytyczne

### P0-1. Brak `<h1>` na stronie `/projekty`
**Plik:** `src/components/featured-work.tsx:172`
Strona `/projekty` (`src/app/projekty/page.tsx`) renderuje wyłącznie `<FeaturedWork />`, a jedyny widoczny nagłówek sekcji to `<h2>` — na całej stronie nie ma ani jednego `<h1>` (potwierdzone w DOM: `h1Count: 0`, `headingOrder` zaczyna się od `H2`). Narusza WCAG 2.4.6 (Headings and Labels) i jest źle dla SEO tej podstrony portfolio.
`FeaturedWork` jest używany **tylko** na `/projekty`, więc zmiana jest bezpieczna.

```tsx
// src/components/featured-work.tsx:172 — PRZED
<h2 className="mt-6 font-headline text-4xl font-bold leading-[1.05] tracking-tight text-on-surface md:text-6xl 2xl:text-7xl">

// PO
<h1 className="mt-6 font-headline text-4xl font-bold leading-[1.05] tracking-tight text-on-surface md:text-6xl 2xl:text-7xl">
```
(i odpowiednio zamknięcie `</h1>`).

### P0-2. Kontrast tekstu pomocniczego poniżej AA w wielu miejscach (wspólny wzorzec: `text-on-surface-variant/NN`)
Zmierzone **z realnie wyrenderowanych pikseli** (canvas, oba motywy, świeży reload — nie z samej matematyki tokenów):

| Miejsce | Klasa | Tekst | Kontrast dark | Kontrast light | Próg |
|---|---|---|---|---|---|
| `src/components/tech-stack.tsx:65` | `text-[10px] font-bold ... text-on-surface-variant/40` | "Expertise Layer" | **2.25:1** | ~2.0:1 (obliczone) | 4.5:1 |
| `src/components/quick-contact.tsx:362` | `text-on-surface-variant/50` | "(opcjonalnie)" przy polu wiadomości | **2.90:1** | **2.48:1** | 4.5:1 |
| `src/components/compact-lead-form.tsx:17` | placeholder `text-on-surface-variant/50` (`inputClass`) | placeholdery pól Imię/Telefon | ~2.9:1 (obliczone) | ~2.5:1 (obliczone) | 4.5:1 |
| `src/components/quick-contact.tsx:31` | placeholder `text-on-surface/30` (`inputClass`) | placeholdery pól formularza pełnego | ~2.45:1 (obliczone) | ~1.93:1 (obliczone) | 4.5:1 |
| `src/components/footer.tsx:79,95,117` | `text-[10px] font-bold ... text-on-surface-variant/60` | nagłówki kolumn stopki ("Oferta"/"Projekty"/"Firma") | **3.34:1** | **2.94:1** | 4.5:1 |
| `src/components/footer.tsx:164` | `text-[10px] font-medium text-on-surface-variant/60` | "Odpowiadamy w 24 h" (status w stopce) | 3.34:1 | 2.94:1 | 4.5:1 |
| `src/components/footer.tsx:151,157` | `text-[10px] font-medium text-on-surface-variant/70` | copyright, przycisk "Ustawienia cookies" | **4.03:1** | **3.67:1** | 4.5:1 |
| `src/app/projects/[slug]/ProjectDetailClient.tsx:34,275,363,378` | `text-[10px] font-bold ... text-on-surface-variant/70` | etykiety "Rola"/"Rok", "Stack technologiczny", "Poprzedni/Następny projekt" | ~4.0–4.4:1 (obliczone) | ~3.7–3.9:1 (obliczone) | 4.5:1 |
| `src/app/projects/[slug]/ProjectDetailClient.tsx:183` | `text-on-surface-variant/60` | "· {rok}" w badge kategorii | ~3.3:1 (obliczone) | ~2.9:1 (obliczone) | 4.5:1 |
| `src/components/featured-work.tsx:104` | `text-on-surface-variant/50` | "· {rok}" w karcie projektu | ~2.9:1 (obliczone) | ~2.5:1 (obliczone) | 4.5:1 |
| `src/components/trust-bar.tsx:47` | `text-xl md:text-3xl font-bold text-on-surface/45` | nazwy klientów/technologii | 3.92:1 (duży tekst, próg 3:1 → **OK**) | **2.88:1 (duży tekst, próg 3:1 → FAIL)** | 3:1 (duży tekst) |

To nie pojedyncze literówki — to systemowy wzorzec: opacity-modyfikator nałożony na token, który sam w sobie ma dobry kontrast bazowy (7.6–8.6:1), ale przy `/40`–`/60` na ciemnym/jasnym tle spada poniżej AA. Najgorszy przypadek to `tech-stack.tsx` (2.25:1 — praktycznie nieczytelne dla słabowidzących).

**Poprawka (rekomendacja):** podnieść minimalną nieprzezroczystość `text-on-surface-variant` do `/80`+ dla tekstu 10–12px, albo zdefiniować osobny token `--color-on-surface-subtle` skalibrowany na ≥4.5:1 na obu tłach zamiast używać opacity-modyfikatorów na już przyciemnionym `on-surface-variant`. Przykładowa poprawka dla stopki:

```tsx
// src/components/footer.tsx:79 (i analogicznie 95, 117, 164) — PRZED
<span className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/60">

// PO — usunięcie modyfikatora opacity (bazowy token ma 7.6–8.6:1)
<span className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant">
```
To samo dotyczy `/70`, `/50`, `/40` na `on-surface-variant` we wszystkich wymienionych plikach — usunięcie modyfikatora opacity (lub obniżenie go maksymalnie do `/90`) rozwiązuje problem bez zmiany designu (kolor bazowy jest wystarczająco stonowany sam w sobie).

Dla placeholderów (`compact-lead-form.tsx:17`, `quick-contact.tsx:31`) niższy priorytet, bo pole ma osobny widoczny `<label>` — ale placeholder też jest tekstem w rozumieniu SC 1.4.3 i warto podnieść do `/70`+.

### P0-3. Brak Escape i focus-trap w nakładkach pełnoekranowych (mobilne menu + modal ustawień cookies)
W całym repo **nie ma ani jednej obsługi klawisza Escape** (`grep -rn "Escape" src` → 0 wyników) i nie ma implementacji focus-trap.

**a) Mobilne menu** — `src/components/navbar.tsx:274-330` (`AnimatePresence` overlay otwierany przez hamburger, linia 214-229):
- Przycisk hamburgera (linia 214) nie ma `aria-expanded` ani `aria-controls` — czytnik ekranu nie wie, czy menu jest otwarte.
- Po otwarciu menu fokus nie przenosi się do środka (np. na pierwszy link) i nie jest łapany w pułapkę — z klawiatury da się wytabować z widocznej nakładki do `<main>` znajdującego się "pod spodem" (wizualnie zasłoniętego), bo strona główna nie dostaje `aria-hidden`/`inert` gdy menu jest otwarte.
- Nie ma obsługi Escape do zamknięcia (jedyny sposób zamknięcia z klawiatury to wytabowanie z powrotem do hamburgera i wciśnięcie Enter/Space).

**b) Modal ustawień cookies** — `src/components/cookie-banner.tsx:117-200` (`role="dialog" aria-modal="true"`):
- To samo: brak Escape, brak focus-trap, brak przeniesienia fokusu do modala przy otwarciu i brak powrotu fokusu do przycisku wyzwalającego przy zamknięciu. Zamknięcie mysią (klik na tło, `onClick={closeSettings}` linia 125) działa, ale klawiatura/screen reader tego nie mają.

**Poprawka:** dodać wspólny hook `useFocusTrap`/`useEscapeToClose` (np. w `src/lib/`) i użyć go w obu miejscach:

```tsx
// src/lib/use-dialog-a11y.ts (nowy plik) — szkic
export function useEscapeToClose(isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);
}
```

Do `navbar.tsx`:
```tsx
// linia ~214 — dodać aria-expanded/aria-controls
<button
  onClick={() => setMobileOpen(!mobileOpen)}
  aria-expanded={mobileOpen}
  aria-controls="mobile-menu-overlay"
  aria-label="Toggle menu"
  ...
>
```
i `useEscapeToClose(mobileOpen, () => setMobileOpen(false))` w komponencie, plus `id="mobile-menu-overlay"` na `<motion.div>` nakładki (linia ~284).

Do `cookie-banner.tsx`: `useEscapeToClose(settingsOpen, closeSettings)` + focus na pierwszy fokusowalny element modala przy otwarciu (np. `useEffect` z `ref.current?.focus()` na przycisku "Zamknij").

---

## P1 — istotne

### P1-1. Tap-targety głównych przełączników nawigacji mobilnej < 44px
Zmierzone JS-em na `375×812` (iPhone SE), świeży `/`:

| Element | Plik:linia | Rozmiar | Wymagane |
|---|---|---|---|
| Hamburger (`aria-label="Toggle menu"`) | `src/components/navbar.tsx:214-229` (`h-8 w-8`) | **32×32px** | 44×44px |
| Przełącznik motywu (mobile) | `src/components/navbar.tsx:247-262` (`w-6 h-6`) | **24×24px** | 44×44px |
| Przełącznik języka (mobile) | `src/components/navbar.tsx:263-269` (brak `min-w`/`min-h`) | **17×21px** | 44×44px |

Uwaga: **desktopowy** przełącznik języka (linia 188) już ma `min-h-[44px] min-w-[44px]` — poprawka istnieje w kodzie, po prostu nie została powtórzona w wariancie mobilnym, gdzie dotyk jest jedynym sposobem interakcji.

```tsx
// src/components/navbar.tsx:214 — PRZED
<button
  onClick={() => setMobileOpen(!mobileOpen)}
  className="flex h-8 w-8 flex-col items-center justify-center gap-1.5"
  aria-label="Toggle menu"
>

// PO
<button
  onClick={() => setMobileOpen(!mobileOpen)}
  className="flex h-11 w-11 flex-col items-center justify-center gap-1.5"
  aria-label="Toggle menu"
  aria-expanded={mobileOpen}
>
```
Analogicznie `w-6 h-6` → `min-h-[44px] min-w-[44px]` (linia 250) i dodanie `min-h-[44px] min-w-[44px]` do przełącznika języka (linia 266).

### P1-2. Błędy formularzy nie są powiązane z polem przez `aria-describedby`
`src/components/quick-contact.tsx:279-313, 356, 398` i `src/components/compact-lead-form.tsx:170-211, 245, 276` — pole ma `aria-invalid={errors.x ? true : undefined}`, ale komunikat błędu (`<p className="text-sm text-red-500">{errors.x}</p>`) nie ma `id`, a input nie ma `aria-describedby` wskazującego na ten `id`. Czytnik ekranu poinformuje "pole nieprawidłowe", ale nie odczyta automatycznie treści błędu przy fokusie na polu.

```tsx
// src/components/quick-contact.tsx:282-293 — PRZED
<input
  id="quick-name"
  ...
  aria-invalid={errors.name ? true : undefined}
  ...
/>
{errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

// PO
<input
  id="quick-name"
  ...
  aria-invalid={errors.name ? true : undefined}
  aria-describedby={errors.name ? "quick-name-error" : undefined}
  ...
/>
{errors.name && <p id="quick-name-error" role="alert" className="text-sm text-red-500">{errors.name}</p>}
```
Ten sam wzorzec do powtórzenia dla `quick-contact` (`contact`, `consent`, `server`) i `compact-lead-form` (`name`, `phone`, `consent`, `server`).

### P1-3. `QuickContact` — brak `aria-live`/`role="status"` na komunikacie sukcesu
`src/components/quick-contact.tsx:211-236` — po udanym submicie formularz znika i pojawia się `<motion.div>` z podziękowaniem, ale bez `role="status"` / `aria-live="polite"` i bez przeniesienia fokusu. Dla porównania `CompactLeadForm` (`src/components/compact-lead-form.tsx:145-165`) robi to poprawnie: `role="status" aria-live="polite"` + `successRef.current?.focus()` w `useEffect` (linia 77-79). Użytkownicy czytników ekranu na `/kontakt` (pełny formularz `QuickContact`) nie dostaną potwierdzenia wysłania.

```tsx
// src/components/quick-contact.tsx:212-217 — PRZED
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
  className="flex flex-col items-start gap-6 bg-surface-container/40 border border-primary/40 rounded-3xl p-8 md:p-12"
>

// PO
<motion.div
  role="status"
  aria-live="polite"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
  className="flex flex-col items-start gap-6 bg-surface-container/40 border border-primary/40 rounded-3xl p-8 md:p-12"
>
```
plus `useRef`/`tabIndex={-1}`/`.focus()` na `<h3>{t("quick.successTitle")}</h3>` (linia 223) analogicznie do `compact-lead-form.tsx`.

### P1-4. Brak landmarku `<header>`
DOM-audit na `/` i pozostałych stronach: `document.querySelectorAll('header').length === 0`. `Navbar` (`src/components/navbar.tsx`) renderuje `<motion.div>`/`<motion.nav>` bezpośrednio, bez opakowania w `<header>`. `<nav>` jest obecny i ma `aria-label`, więc nawigacja jest osiągalna (SR-użytkownik może przeskoczyć do "navigation"), ale brak landmarku "banner" utrudnia szybkie skakanie po landmarkach ("go to header").

**Poprawka:** opakować oba warianty (desktop + mobile) w `<header>` w `src/components/navbar.tsx` (np. jeden wspólny `<header>` na zewnątrz obu `motion.div`/`motion.nav`).

---

## P2 — drobne / polish

### P2-1. `<nav>` nakładki mobilnego menu bez `aria-label`
`src/components/navbar.tsx:286` — `<nav className="flex flex-col items-center gap-8">` wewnątrz otwartej nakładki nie ma `aria-label`, podczas gdy pozostałe `<nav>` na stronie mają `aria-label={t("a11y.mainNav")}`. Gdy menu jest otwarte, w DOM są jednocześnie 2 elementy nawigacyjne — jeden nazwany, jeden nie. Dodać `aria-label={t("a11y.mainNav")}` (skoro to duplikat tej samej nawigacji, rozważyć raczej **usunięcie** górnego skróconego paska z linkami zamiast go dublować, albo `aria-hidden` na tym, który akurat nie pełni roli głównej nawigacji).

### P2-2. Tap-targety linków w stopce ~20px wysokości
`src/components/footer.tsx:82-90, 98-113, 120-128, 137-145` (linki ofertowe/projektowe/firmowe + kontaktowe) oraz przycisk `Ustawienia cookies` (linia 154-160) — na mobile (375px) mierzą **327×20px** (linki) / **127×17px** (przycisk cookies). To nie jest tekst inline w zdaniu (wyjątek WCAG 2.5.8 dla linków w biegnącym tekście tu nie ma zastosowania — każdy link to osobny wiersz), więc realny obszar dotyku to tylko wysokość linii. Rekomendacja: dodać `py-2` (lub `py-2.5`) do `<Link>`/`<button>` w kolumnach stopki, żeby wysokość dotykowa zbliżyła się do 44px, bez zmiany gęstości wizualnej (odstęp `gap-3` między linkami już jest, można go delikatnie zmniejszyć rekompensując paddingiem).

### P2-3. 404 (`/nieistniejaca`) nie ustawia własnego `<title>`
`src/app/not-found.tsx` to komponent kliencki (`"use client"`) bez `generateMetadata`/`metadata` — `document.title` zostaje tym, co ustawiła poprzednia strona (albo domyślny tytuł z `layout.tsx`, "Programo — Studio Software z Poznania"), zamiast czegoś w stylu "Strona nie znaleziona (404) | Programo". Sama strona 404 jest poza tym zrobiona dobrze: ma `h1`, czytelny komunikat, i działający link powrotny "Wróć na stronę główną" z `min-h-[44px]`.

```tsx
// src/app/not-found.tsx — dodać w NotFoundContent
useEffect(() => {
  document.title = "Strona nie znaleziona (404) | Programo";
}, []);
```

### P2-4. Panel `/crm` (wewnętrzne narzędzie) — słabszy wskaźnik fokusu
`src/app/crm/LoginForm.tsx:79,100` i `src/app/crm/LeadsDashboard.tsx:240,680` — pola `outline-none` mają tylko `focus:border-primary` (zmianę koloru obramowania), bez `focus-visible:outline`, w przeciwieństwie do publicznych formularzy (`quick-contact.tsx`, `compact-lead-form.tsx`), które mają oba. Niższy priorytet, bo to wewnętrzne narzędzie używane tylko przez Was dwóch, ale warto ujednolicić przy najbliższej zmianie w CRM.

### P2-5. Placeholder jako jedyny opis formatu w polu "Numer telefonu / kontakt"
Nie jest to naruszenie (każde pole ma właściwy `<label>`), ale `quick-contact.tsx` pole "Telefon lub e-mail" (`id="quick-contact"`, linia 297-313) nie tłumaczy w tekście stałym (poza placeholderem) że akceptowane są oba formaty — placeholder znika po rozpoczęciu pisania. Rozważyć krótki `<span className="text-xs text-on-surface-variant">` pod etykietą, niezależny od treści placeholdera.

---

## Rzeczy, które są zrobione dobrze (żeby nie zgubić kontekstu przy poprawkach)

- Wszystkie `<img>`/`next/image` mają sensowny, opisowy `alt` (zero brakujących, zero genererycznych typu "screenshot"/"image").
- Wszystkie `<button>` mają nazwę dostępną (`aria-label` lub tekst) — 0 wyjątków na zbadanych stronach.
- Formularze (`quick-contact.tsx`, `compact-lead-form.tsx`) mają poprawnie powiązane `<label htmlFor>` ↔ `id`, checkboxy zgody używają poprawnego **niejawnego** powiązania (input zagnieżdżony w `<label>`) — nie jest to błąd mimo że nie ma `id`/`for`.
- FAQ (`src/components/home/faq.tsx`) to wzorcowy akordeon: natywny `<button>` (Enter/Space działają out-of-the-box), `aria-expanded`, `aria-controls`/`id`, panel jako `role="region"` z `aria-labelledby`, plus `focus-visible:outline` na triggerze.
- Skip-link "Przejdź do treści" (`src/components/providers.tsx:31-36`) działa i prowadzi do `<main id="main-content">`.
- Cookie banner jest RODO-poprawny: nieblokujący pasek na dole, trzy realne akcje (Akceptuj/Odrzuć/Dostosuj), Consent Mode v2 ustawiony przed `gtag.js`.
- Touch-targety głównych CTA, checkboxów w formularzach i chipów typu projektu mają `min-h-[48px]` skonsekwentnie wpisane w klasy bazowe (`chipBase`, `inputClass`, etykiety checkboxów).
- Sticky CTA (`src/components/sticky-cta.tsx:81`) poprawnie liczy `env(safe-area-inset-bottom)`.
- Kontrast **głównego** tekstu (`on-surface` przy pełnej nieprzezroczystości i nawet przy `/70`–`/80`) jest bardzo dobry (6.3–16.8:1 zmierzone) — problem dotyczy wyłącznie tekstu pomocniczego (`on-surface-variant`) z dodatkowym modyfikatorem opacity.

---

## Podsumowanie priorytetów

| Priorytet | Liczba findingów | Szacowany nakład naprawy |
|---|---|---|
| P0 | 3 (h1 na /projekty, kontrast ~14 miejsc wg wspólnego wzorca, Escape/focus-trap w 2 nakładkach) | ~0.5–1 dnia |
| P1 | 4 (tap-targety mobile nav, aria-describedby błędów, aria-live sukcesu w QuickContact, brak `<header>`) | ~0.5 dnia |
| P2 | 5 (nazwa nav overlay, tap-targety stopki, tytuł 404, focus CRM, opis formatu pola kontakt) | ~2–3h |

Największa dźwignia: naprawa kontrastu to w praktyce jedna zmiana wzorca (usunięcie/podniesienie modyfikatora opacity na `text-on-surface-variant`) powtórzona w ~10 miejscach — nie wymaga zmiany palety ani design decyzji, token bazowy już ma wystarczający kontrast.

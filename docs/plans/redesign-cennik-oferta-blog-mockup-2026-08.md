# Redesign: cennik, oferta, blog, iPhone mockup — 2026-08-12

Zlecenie Wojtka (głosowe, skrócone): cennik dziś nie pokazuje żadnych liczb — ma
dostać realne widełki z `~/Programo/marketing/FIRMA/sprzedaz/cennik.md`. Oferta ma
być z nią spójna (te same produkty) i mniej tekstowa — realizacje mają być
widoczne, nie tylko wspomniane. Blog ma być responsywny i dostać 2 nowe wpisy ze
zdjęciami. iPhone mockup w galeriach jest źle wyskalowany.

**O nas (zdjęcia założycieli) jest CELOWO poza zakresem tej fazy** — brak zdjęcia
Bartka na dysku, Wojtek zdecydował: rób resztę teraz, O nas dorobimy jak zdjęcie
się znajdzie.

## Źródła prawdy

- Ceny: `~/Programo/marketing/FIRMA/sprzedaz/cennik.md` (28.07.2026) — **jedyne
  źródło liczb**, nic nie zmyślać, nic nie zaokrąglać "na oko".
- Reguła cennika: *"Klient słyszy kolumnę Standard, Start tylko za case study,
  opinię albo polecenie"* → publiczna strona pokazuje widełki **Standard–Rozszerzony**
  ("od [Standard] zł"), kolumna Start nigdy nie jest headline'ową liczbą na stronie.
- Portfolio/realizacje: wyłącznie `src/lib/projects.ts` (zero zmyślonych statystyk,
  uczciwy podział produkty/klienci — reguła z repo `CLAUDE.md`).
- Paleta: ciemna zieleń/mięta z `globals.css`, zero emotek, zero kursywy w nagłówkach
  (globalna zasada Wojtka + `CLAUDE.md` repo).
- Copy przez `t()` z i18n — każdy nowy string dostaje wpis PL **i** EN w
  odpowiednim `dictionaries/*.ts` (test parytetu i18n w `npm run test` musi przejść).

## Zakres

### 1. `/cennik` — `src/components/pricing.tsx` + `dictionaries/pricing.ts`

- Zachować sekcję procesu (rozmowa → widełki 24h → stała wycena) — treść już
  dobra, nie przepisywać bez potrzeby.
- Dodać pod nią (albo nad "co wpływa na cenę") czytelną tabelę/siatkę cen z
  trzema blokami 1:1 z `cennik.md`:
  1. **Projekty** — Landing page, Strona firmowa, Sklep Woo/Shopify, Sklep na
     własnym silniku, System/aplikacja webowa, Aplikacja mobilna iOS+Android.
     Kolumny: zakres, termin, widełki "od [Standard] do [Rozszerzony] zł".
  2. **Współpraca miesięczna** — opieka nad stroną, opieka nad sklepem/systemem,
     SEO, Google Ads, GA4+GTM (jednorazowo).
  3. **AI i automatyzacja** — audyt procesów, automatyzacja procesu, asystent na
     danych firmy, szkolenie zespołu, opieka po wdrożeniu.
- Prosto i czytelnie — to ma być skanowalne w 10 sekund, nie ściana liczb.
  Rozważyć proste taby/przełącznik między trzema blokami zamiast trzech tabel
  jedna pod drugą, jeśli tak wyjdzie czyściej (decyzja projektowa buildera +
  `frontend-design` skill, byle nie zagracić strony).
- Dopisać wprost (jednym zdaniem, nie akapitem) zasadę "stała cena, żadnych
  niespodzianek w umowie" — wzmocnić to, co już mówi `pricing.step3`, nie
  duplikować w innym miejscu.
- CTA i cała reszta sekcji zostaje.

### 2. `/oferta` — `src/components/offer.tsx` + `dictionaries/offer.ts`

- **Spójność z cennikiem**: filary oferty muszą 1:1 pokrywać się z tym, co jest
  w cenniku. Dziś brakuje piątego filaru: **AI i automatyzacja** — dodać go
  (treść z sekcji "AI i automatyzacja" w `cennik.md` jako punkt wyjścia do
  opisu, liczby tylko w cenniku, nie duplikować cen w ofercie).
- **Widoczne realizacje zamiast linijki tekstu**: każdy filar ma dziś tylko
  `offer.pillarN.example` jako zdanie. Zamienić na realną wizualkę — screenshot
  /kartę projektu z `projects.ts` (użyć istniejących komponentów: `PhoneFrame`,
  `BrowserFrame`, `DeviceDuo` — tych samych co na `/projekty`), klikalną do
  `/projects/[slug]`. Wybór projektu per filar: ten, który już jest wskazany w
  `offer.pillarN.example` (Estalo, Jedmar, Jedmar, Skup Nieruchomości) — dla
  nowego filaru AI wybrać najtrafniejszy projekt z `projects.ts` (sprawdzić czy
  taki jest; jeśli nie ma jednoznacznego przykładu AI, opisać filar bez
  fałszywego przykładu, uczciwie).
- **Mniej tekstu**: dziś `offer.pillarN.desc` to długie akapity + 5 bulletów.
  Skrócić opisy tam, gdzie wizualny przykład już mówi to samo (ta sama zasada,
  którą repo już stosowało 2026-08-05 — patrz komentarz w `dictionaries/offer.ts`).
  Nie przesadzać w drugą stronę — ma być prosto, nie pusto.
- Strona ma "dawać się przeklikiwać" — każdy filar/karta realizacji to link
  (do `/projects/[slug]` albo do podstrony ofertowej `strony-internetowe` /
  `sklepy-internetowe` / `strony-tracking-reklamy` tam gdzie już istnieją).
- Użytkownik nie ma się gubić — trzymać istniejący układ sekcji (Reveal, karty),
  nie wprowadzać nowych wzorców nawigacji bez potrzeby.

### 3. Blog — `src/app/blog/`, `src/components/blog/`, `src/content/blog/`

- **Responsywność**: dziś układ treści wygląda źle wyśrodkowany na dużych i
  małych ekranach. Zdiagnozować i naprawić grid/max-width w `blog/page.tsx`,
  `[slug]/page.tsx`, `post-card.tsx`, `featured-post.tsx` — sprawdzić realnie w
  przeglądarce (Chrome MCP albo `run` skill) na min. 3 szerokościach (375px,
  768px, 1440px+), nie tylko "kod wygląda ok".
- **2 nowe wpisy** (tematy dobiera builder/Wojtek-agent pod SEO, spójne z
  istniejącymi dwoma: "ile kosztuje aplikacja mobilna 2026" i "Next.js czy
  WordPress"). Muszą trzymać się nowej siatki cenowej z `/cennik` — jeśli wpis
  wspomina liczby, muszą być identyczne z `cennik.md`, zero rozjazdu.
  Proponowane kierunki (do potwierdzenia/dopracowania przez buildera):
  - "Ile kosztuje strona internetowa dla firmy w 2026" (dopełnienie już
    istniejącego wpisu o aplikacji mobilnej — ten sam format, spójne liczby).
  - "SaaS na zamówienie czy gotowe narzędzie — kiedy opłaca się własna
    aplikacja" (naturalnie prowadzi do filaru "Aplikacje webowe i SaaS" z
    oferty).
- **Zdjęcia**: każdy wpis (nowe i najlepiej też 2 istniejące, jeśli już są bez
  obrazków) dostaje 1 główne zdjęcie + 2 mniejsze w treści. Obrazki generuje
  **Codex** (`image_gen`, zgodnie z globalną zasadą) — delegować przez
  `~/.claude/codex/delegate.sh` w trybie `rw`, z jasnym opisem stylu (brand
  Programo: zieleń/mięta, bez fotorealistycznych ludzi udających stockowe
  zdjęcia, professional/minimal, zero emotek/gradientów AI-slop). Obejrzeć
  wynik `Read` przed wrzuceniem na stronę.

### 4. iPhone mockup — `src/components/ui/phone-frame.tsx`

- Zdiagnozować realny bug skalowania (za duży telefon, źle wyskalowany tekst/
  zdjęcie w środku) — komponent używa container query units (`cqw`), więc
  podejrzenie: albo miejsca użycia owijają go w kontener bez ustawionej
  szerokości/`container-type`, albo `width`/`height` propsy przekazywane do
  `<Image>` nie zgadzają się z realną proporcją zrzutu ekranu w niektórych
  miejscach użycia.
- Przejść WSZYSTKIE miejsca użycia `PhoneFrame` (grep) i sprawdzić realnie w
  przeglądarce, nie tylko w kodzie.
- Poprawka ma być w jednym miejscu (komponent), nie łatana per-strona.

## Poza zakresem tej fazy

- `/o-nas` — zdjęcia i interaktywność założycieli. Blokowane brakiem zdjęcia
  Bartka. Wraca jako osobne zadanie, gdy zdjęcie się pojawi.

## Kryteria weryfikacji (twarda bramka, agent sam odpala i wkleja output)

```bash
npm run build && npx tsc --noEmit && npm run test
```

Dodatkowo:
- Realny podgląd w przeglądarce (nie tylko "kod wygląda ok"): `/cennik`,
  `/oferta`, `/blog`, jeden wpis blogowy, jedna galeria z `PhoneFrame` — na
  szerokości mobile i desktop.
- Liczby na `/cennik` ręcznie porównane 1:1 z `cennik.md` (kopiuj-wklej, nie
  przepisywanie z pamięci).
- Każdy filar `/oferta` ma odpowiednik w `/cennik` i odwrotnie — brak produktu
  widocznego tylko w jednym miejscu.
- `npm run lint` czysty.

## Kolejność pracy (unika konfliktów w tym samym repo)

1. **Najpierw samodzielnie**: fix `phone-frame.tsx` (mały, izolowany, bazowy
   komponent — inne zadania mogą z niego korzystać po poprawce).
2. **Równolegle (2 buildery, git worktree izolacja)**:
   - A: `/cennik` + `/oferta` (jedno zadanie — muszą być spójne, robi je jeden
     agent żeby nie rozjechały się między sobą).
   - B: blog (responsywność + 2 wpisy + obrazki z Codexa).
3. Review (agent `reviewer`) na obu diffach przed mergem do `main`.
4. Merge, pełna bramka na `main`, commit + push (Vercel auto-deployuje z
   `origin/main` — **nie** `vercel --prod` ręcznie, zgodnie z `CLAUDE.md` repo).

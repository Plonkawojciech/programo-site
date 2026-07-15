# Audyt typografii, rytmu i spacingu — programo.pl

Data: 2026-07-15
Zakres: build lokalny `http://localhost:3200` (Next 16.1, repo `programo-site`)
Strony zbadane: `/`, `/projekty`, `/projects/jedmar`, `/projects/pooltimer`, `/oferta`,
`/strony-tracking-reklamy`, `/sklepy-internetowe`, `/strony-internetowe`, `/cennik`, `/o-nas`,
`/kontakt`, `/software-house-poznan`, `/ile-kosztuje-aplikacji`
Viewporty: desktop 1440px, mobile 390px (oba motywy sprawdzone dla kontrastu)
Metoda: headless Chrome — pełnostronicowe zrzuty (viewport rozciągany do pełnej wysokości strony,
`opacity:1!important` wymuszone globalnie żeby ominąć animacje scroll-reveal, które w tym
środowisku nie odpalają się przy sztucznym scrollu — patrz uwaga metodologiczna niżej) +
pomiar w DOM przez Range API (rzeczywista liczba znaków/słów per linia, wykrywanie sierot) +
`getComputedStyle` dla font-size/line-height/letter-spacing/padding + WCAG-kontrast liczony
matematycznie z tokenów CSS w obu motywach. Audyt jest **read-only** — żadne pliki nie zostały
zmienione.

**Uwaga metodologiczna:** w tym środowisku headless IntersectionObserver/`whileInView` (framer-motion)
nie odpala się przy programowym scrollu ani zmianie rozmiaru viewportu — elementy poniżej pierwszego
ekranu zostają na starcie na `opacity:0`. Bez obejścia dawało to fałszywe wrażenie "martwych,
pustych sekcji" (np. na `/oferta` sekcje 02–04 były całkowicie niewidoczne mimo istnienia w DOM).
Po wymuszeniu `opacity:1` globalnie wszystkie strony renderują się poprawnie i **nie znaleziono
żadnego rzeczywistego martwego odstępu >200px** — ten typ findingu nie pojawia się więc w tym
raporcie, mimo że pierwsze przebiegi sugerowały inaczej. Zostawiam to jako ostrzeżenie dla innych
agentów robiących podobny audyt automatyczny na tym repo.

## Ocena ogólna

Fundamenty są dobre: skala kontrastu bazowych tokenów (`text-1`/`text-2` na `bg-1..4`) przechodzi
WCAG AA z dużym zapasem w obu motywach (5.7–16.8:1), rytm pionowy sekcji trzyma się w większości
wzorca `py-24 md:py-32`, a fonty (Newsreader na nagłówkach, Plus Jakarta Sans na body) są słusznie
dobrane i ładnie się różnicują. Największy problem to **brak jednego źródła prawdy dla skali
typograficznej i komponentów**: strona nie ma ani jednego współdzielonego komponentu Button ani
Container — prawie każda sekcja/strona definiuje własne inline classNames dla nagłówków, przycisków
i kontenerów, więc te same wzorce UI (nagłówek FAQ, nagłówek "Zostaw numer", nazwisko członka
zespołu, "Wybrane realizacje") są stylowane po 2–4 różne sposoby w zależności od tego, kto/kiedy
pisał dany komponent. Drugi duży temat to długość linii w akapitach treści (`max-w-[68ch]` nie
robi tego co powinno) oraz dwie strony SEO (`/software-house-poznan`, `/ile-kosztuje-aplikacji`),
które wizualnie odjechały od reszty serwisu.

---

## GLOBALNE niespójności (tabela)

| Wzorzec / token | Powinno być | Gdzie łamane | Dowód |
|---|---|---|---|
| **H2 sekcji** | jedna skala na poziom hierarchii | 24px / 30px / 36px / 48px / 60px używane zamiennie dla "nagłówka sekcji" na różnych stronach, czasem na tej samej stronie | homepage: 24/48/60px; `/strony-tracking-reklamy`: 24/36/48/60px (4 rozmiary na jednej stronie); `/cennik`: 30/48px |
| **Ten sam nagłówek, różny rozmiar** | identyczny tekst = identyczny styl niezależnie od strony | "Zostaw numer — oddzwonimy w 24 h..." = **24px** w trybie `bare` (`compact-lead-form.tsx:285`, `text-2xl`, użyte w hero na `/` przez `main-intro.tsx:77`), ale **30/36px** (`text-3xl md:text-4xl`) w trybie domyślnym (`compact-lead-form.tsx:306`, użyte samodzielnie na `/kontakt`) — to jeden komponent z dwiema gałęziami renderu (`bare` vs default), które celowo różnią się layoutem, ale nikt nie zsynchronizował skali nagłówka między nimi | `compact-lead-form.tsx:285` (bare) vs `:306` (default) |
| **Nazwisko członka zespołu (H3)** | jeden komponent | homepage `home/people.tsx:61` → `text-2xl` (24px, `tracking-tight`); `/o-nas` `about.tsx:61` → `text-3xl md:text-4xl` (30/36px, `tracking-tighter`) — **dwa różne komponenty** dla tego samego UI-wzorca | `src/components/home/people.tsx:61` vs `src/components/about.tsx:61` |
| **"Wybrane realizacje" (H2)** | jeden komponent | homepage `portfolio-grid.tsx:45` → `text-3xl md:text-5xl` (30/48px); `/projekty` `featured-work.tsx:172` → `text-4xl md:text-6xl 2xl:text-7xl` (36/60/72px) — **dwa różne komponenty**, różnica sięga 24px na desktopie | `src/components/home/portfolio-grid.tsx:45` vs `src/components/featured-work.tsx:172` |
| **Nagłówek pytania FAQ (H3)** | jeden wzorzec akordeonu | homepage `home/faq.tsx:58` → `text-xl md:text-2xl` (20/24px); `marketing-tracking.tsx:159` (`/strony-tracking-reklamy`) → `text-xl` bez responsive stepu (20px na obu breakpointach); `/sklepy-internetowe:301` i `/strony-internetowe:312` → `text-xl md:text-2xl` (zgodne z home); **SEO-strony** (`software-house-poznan:215/249/264/274/285`, `ile-kosztuje-aplikacji:215/273`) → `text-lg`/`text-xl` **bez `font-headline`**, czyli renderują się w Plus Jakarta Sans zamiast Newsreader | min. 4 różne implementacje tego samego wzorca w 6 plikach |
| **Eyebrow/kicker tracking** | jeden token | `tracking-[0.3em]` **vs** `tracking-[0.4em]` używane naprzemiennie dla wizualnie identycznego wzorca (10px, uppercase, bold) | `0.3em`: `projects-marquee.tsx:76`, `footer.tsx:79/95/117`, `home/featured-jedmar.tsx:47`, `home/portfolio-grid.tsx:89`, `ProjectDetailClient.tsx:181`, `crm/LoginForm.tsx:66/86` — `0.4em`: `pricing.tsx:56/74`, `offer.tsx:101`, `trust-bar.tsx:40`, `about.tsx:58/79`, `home/in-production.tsx:13`, `software-house-poznan/page.tsx:155` |
| **Wysokość przycisku pill** | jeden komponent Button | brak wspólnego tokenu wysokości — `py-*` waha się 0.5/1/1.5/2/2.5/3/3.5/4, dając realne wysokości 41/48/50/52px na samej stronie głównej | `cta-button.tsx:8` (`py-3.5`) vs `navbar.tsx:192/211/293/323`, `sticky-cta.tsx:85/90`, `quick-contact.tsx:29/385` — jedyny komponent `ui/cta-button.tsx` używany tylko częściowo, reszta przycisków to ad-hoc inline style (**45 wystąpień** `rounded-full`+`px-*` poza `cta-button.tsx`) |
| **Kontener max-width** | mała, spójna skala (np. 3–4 kroki) | **15+ różnych wartości** w użyciu: `max-w-[1400px]` (powtórzone ręcznie w 20 plikach), `max-w-[1200px]`, `max-w-[900px]`, `max-w-[62%]`, `5xl/4xl/3xl/2xl/xl/md/sm/xs`, `max-w-[68ch]`, `max-w-[560px]`, `max-w-[190px]/[180px]/[16rem]`, `max-w-fit` | brak komponentu `Container` — `globals.css` `@theme inline` (linia 104) nie definiuje żadnego tokenu szerokości |
| **Miara tekstu akapitowego** | ~60–75 znaków/linię | `max-w-[68ch]` na kartach case-study (`ProjectDetailClient.tsx`) daje **90–96 znaków/linię** w Plus Jakarta Sans przy 1440px — jednostka `ch` nie trzyma zamierzonej miary w tym foncie/layoucie | zmierzone bezpośrednio w DOM (Range API) na `/projects/jedmar` i `/projects/pooltimer`, patrz sekcja per-strona |
| **Sieroty (orphans)** | brak samotnego słowa w ostatniej linii kluczowych nagłówków/CTA | wzorzec bardzo częsty — stopka "Oprogramowanie projektowane i budowane w Poznaniu." sieroci na **każdej** stronie (współdzielony `footer.tsx`), plus H1 hero na `/`, H2 "Zostaw numer..." na `/` i `/kontakt`, liczne akapity kart | patrz listy per-strona niżej |
| **Kontrast tekstu na opacity** | ≥4.5:1 dla tekstu <18px | tokeny `accent`/`text-2` z modyfikatorem opacity `/50`–`/72` (eyebrow, stopka, nieaktywne linki nav) spadają do **2.2–4.6:1** w obu motywach — poniżej AA | policzone matematycznie z realnych wartości hex, patrz sekcja Kontrast. Ten sam wzorzec (`text-on-surface-variant/NN`) opisany też w równoległym audycie `docs/audit-visual/ux-a11y-report.md` (P0-2) — traktować jako jeden, dobrze potwierdzony problem, nie duplikat |

---

## Kontrast (WCAG AA) — policzone z tokenów

Bazowe pary (bez modyfikatorów opacity) przechodzą AA z dużym zapasem w obu motywach:

| Para | Dark | Light |
|---|---|---|
| `text-1` (main) / `bg-1` | 14.4 | 16.79 |
| `text-2` (muted) / `bg-1` | 7.61 | 8.56 |
| `text-2` (muted) / `bg-4` | 5.66 | 7.34 |
| `alt-text` / `alt-bg` | 16.69 | 14.4 |
| `alt-muted` / `alt-bg` | 5.42 | 7.61 |

Wszystkie ≥4.5:1 — **brak problemu na poziomie samych tokenów**.

Problem pojawia się dopiero przy nakładaniu **opacity-modyfikatorów** (`/50`, `/60`, `/70`, `/72`)
na te tokeny dla drobnego tekstu (10–14px: eyebrow, stopka, nieaktywne linki nawigacji):

| Scenariusz | Dark | Light | Próg |
|---|---|---|---|
| `accent` @ 60% na `bg-1` | 3.59 | 2.9 | 4.5 — **FAIL** |
| `accent` @ 70% na `bg-1` | 4.41 | 3.61 | 4.5 — **FAIL** (light) / graniczne (dark) |
| `accent` @ 72% na `bg-1` | 4.59 | 3.77 | 4.5 — light FAIL |
| Nieaktywny link nav (pill nieprzewinięty) | 3.39 | **2.2** | 4.5 — **FAIL, najgorszy przypadek** |
| Nieaktywny link nav (pill przewinięty, bardziej kryjący) | 5.5 | 5.65 | OK |

Najgorszy realny przypadek: **nieaktywne linki w navbarze przed scrollem, motyw jasny — 2.2:1**,
czyli mniej niż połowa wymaganego progu. To samo zjawisko dla eyebrow/stopki opisuje szczegółowo
`docs/audit-visual/ux-a11y-report.md` (sekcja P0-2, z realnymi wartościami zmierzonymi z pikseli) —
odsyłam tam po plik:linia dla poszczególnych wystąpień, tu chodziło o potwierdzenie z drugiej,
niezależnej metody (matematyka tokenów), że problem jest realny w **obu** motywach, nie tylko jednym.

**Rekomendacja:** nie zdejmować kontrastu przez opacity na tekstach <18px. Jeśli potrzebny jest
"wyciszony" wariant eyebrow/stopki, użyć osobnego, skalibrowanego tokenu koloru (np.
`--color-on-surface-subtle`) zamiast `token/NN`.

---

## Findingi per strona

### `/` (homepage)

- **[P1] Sierota w H1** — "…udowadniamy to w **liczbach.**" zawija się do 5 linii, ostatnia to
  pojedyncze słowo. `main-intro.tsx` (h1 przez `home.hero.h1` w `dictionaries/home.ts:83-85`).
  Poprawka: twarda spacja przed ostatnim słowem albo lekka redakcja zdania.
- **[P1] Sierota w H2 formularza** — "Zostaw numer — oddzwonimy w 24 h z **konkretami.**"
  `compact-lead-form.tsx:285`, tekst z `home.ts:93-96`. Ta sama sierota powtarza się na `/kontakt`
  (ten sam komponent).
- **[P2] Skala H2 final-CTA nie pasuje do reszty strony** — "Opowiedz nam, co chcesz zbudować" = 60px,
  podczas gdy wszystkie pozostałe H2 na tej samej stronie ("Wybrane realizacje", nagłówek Jedmar,
  "Rozmawiasz z osobą…", "Częste pytania") = 48px. Jeśli to celowy akcent na CTA — OK, ale warto
  potwierdzić że to świadoma decyzja, nie przypadek.
- **[P1] 4 różne wysokości przycisku na jednej stronie** — navbar CTA 41px, "Zadzwoń: 509 123 434"
  48px, "Bezpłatna konsultacja"/"Oddzwońcie do mnie" 50px, "Wyślij zapytanie" (formularz kontaktowy)
  52px. Widoczne w jednym scrollu strony głównej.
- **[P2] Długie linie w body** — kilka akapitów (16–24px) sięga 80–96 znaków/linię (np. blok
  "Trwają prace nad kolejnymi czterema aplikacjami…", 96 zn.).
- **[P2] Sierota FAQ H3 rozmiar** — `home/faq.tsx:58`, `text-xl md:text-2xl` — jedyne miejsce w
  serwisie gdzie H3 FAQ nie ma `font-headline` (Newsreader) tylko domyślny body font — do
  zweryfikowania w kodzie czy to celowe (mniejszy kontrast wizualny dla pytań vs treści).

### `/projekty`

- **[P2] "Wybrane realizacje" = 60px** tutaj (`featured-work.tsx:172`, `2xl:text-7xl`) vs **48px**
  na homepage (`portfolio-grid.tsx:45`) dla identycznego tekstu — patrz tabela globalna.
- **[P2] Unikalny kontener `max-w-[62%]`** (9 wystąpień) — jedyna strona w audycie z
  procentowym `max-w`, kruche przy skrajnych szerokościach ekranu.
- **[P2] Sieroty w opisach kart** (współdzielony `ProjectCard`) — "Wyszukiwarka firm z KRS…",
  "2 kanały powiadomień o zapytaniu…" — powtarzają się wszędzie gdzie karta Rejestr Pro/W. Safe
  Finance jest używana (też na `/`).
- **[P3] Brak zrzutu ekranu** — miniatura karty "Rejestr Pro" renderuje się jako puste białe pole
  (brakujący asset w `public/screenshots/v2/`) — nie jest to typografia, ale warto zgłosić osobno.

### `/projects/jedmar` i `/projects/pooltimer` (wspólny szablon — dotyczy prawdopodobnie
wszystkich stron `/projects/[slug]`)

- **[P1] Niespójna skala H2 wewnątrz jednej strony** — "Historia projektu" = **36px**, podczas gdy
  "Co zbudowaliśmy" i finałowy CTA ("Chcesz zbudować coś podobnego?") = **48px** na tej samej
  stronie. Plik: `src/app/projects/[slug]/ProjectDetailClient.tsx` (sekcja Historia vs pozostałe).
- **[P1] Miara tekstu narracyjnego przekracza cel o ~30%** — akapity "Historia projektu"
  (18px, kontener `max-w-[68ch]`) renderują się na **90–96 znaków/linię** przy 1440px zamiast
  docelowych ~65–70. `ch` jako jednostka nie działa tu zgodnie z intencją (cyfra `0` w Plus Jakarta
  Sans jest relatywnie szeroka, więc 68ch daje więcej niż 68 rzeczywistych znaków tekstu PL).
  **Poprawka:** zamienić `max-w-[68ch]` na stały piksel, np. `max-w-[620px]`, albo obniżyć do
  `max-w-[50ch]`.
- **[P2] Sieroty w podpisach statystyk** (14–16px, np. "Skaner kodów kreskowych EAN — od kodu na
  opakowani…").
- **[P3, do weryfikacji przez dewelopera]** Podczas testów wysokość strony (`scrollHeight`) rosła
  przy kolejnych zmianach rozmiaru viewportu, a stopka + karta podglądu "następny projekt"
  renderowały się niestabilnie. Może to być artefakt metody testowej (headless + wymuszone resize),
  ale warto sprawdzić realny CLS (Cumulative Layout Shift) na tym szablonie w Lighthouse — nie
  potwierdzam tego jako pewny bug, tylko sygnał do sprawdzenia.
- H1 = 72px na obu stronach (spójne między sobą), ale o jeden krok większe niż H1 stron
  ofertowych/home (60px) — osobna, ale spójna skala dla stron projektowych, to raczej OK jako
  świadomy wybór.

### `/oferta`

Najczystsza strona w audycie. H2 konsekwentnie 36px w całej stronie. Jedyne uwagi:
- **[P2]** jedna sierota w stopce (wzorzec współdzielony, patrz globalne).
- **[P3]** jeden akapit intro na 81 znaków/linię — drobne przekroczenie.

### `/strony-tracking-reklamy`

- **[P1] Najwięcej sierot ze wszystkich stron** — flagowanych 5 nagłówków z 1-słowną ostatnią
  linią, w tym **sam H1** ("Strona, pomiar i reklamy Google — jeden zespół, jeden mierzalny
  **lejek**").
- **[P2] H2 "Wciąż się zastanawiasz? Zostaw numer" = 36px** — wartość niepasująca do dominującego
  na tej stronie wzorca 24/48/60px (patrz tabela globalna, ten sam tekst różni się jeszcze bardziej
  od 24px użytego na `/`).
- **[P3] Nieużyty semantyczny bullet** — akapit z ręcznym znakiem "▸" zamiast prawdziwej listy
  (`<ul>/<li>`) w komponencie `marketing-tracking.tsx` — drobna niespójność wzorca list.
- Do zweryfikowania w kodzie: strona ma **dwie osobne tablice FAQ** — jedną tylko do JSON-LD
  (`page.tsx:61`) i drugą do faktycznego renderu (`marketing-tracking.tsx:21`) — ryzyko rozjazdu
  treści przy przyszłej edycji (nie typografia, ale zauważone przy okazji).

### `/sklepy-internetowe`

- **[P1] 4 flagowane nagłówki** — sieroty w H2 "Masz sklep do zbudowania lub przyspieszenia?",
  "Co jeszcze potrafimy…", "Wciąż się rozglądasz? Zostaw numer" oraz w H3 FAQ.
- **[P1] FAQ H3 = 24px** (`page.tsx:301`) — trzeci różny rozmiar dla tego samego wzorca w serwisie
  (16px na home, 20px na tracking-reklamy, 24px tutaj i na strony-internetowe).
- **[P2] Długa linia 91 znaków** w opisie case-study Jedmar.
- **[P3]** miniatura case-study Jedmar (browser-frame) pusta — brakujący asset.

### `/strony-internetowe`

- **[P0] Najdłuższa linia w całym audycie — 160 znaków na jednej linii**, akapit "Prowadzimy też
  kampanie i tracking — pomiar konwersji…" (14px, pełna szerokość kontenera `max-w-[1400px]` bez
  węższego wrappera na tekst). To ponad dwukrotność zalecanej miary — pilna poprawka: owinąć ten
  akapit w `max-w-3xl` lub podobny.
- **[P2] 2 sieroty nagłówkowe** ("Strony i produkty, które zbudowaliśmy", "Wciąż się zastanawiasz?
  Zostaw numer" — ten sam 36px one-off co na innych stronach ofertowych) + kilka akapitów 85–90 zn.
- **[P3]** miniatura "W. Safe Finance" pusta — brakujący asset.

### `/cennik`

Strukturalnie czysta (brak flagowanych nagłówków), ale:
- **[P2]** H2 kroków procesu ("Rozmowa", "Widełki w 24 h", "Stała wycena") = **30px** — wartość
  używana gdzie indziej jako H3, tu pełni rolę H2.
- **[P2]** finałowe CTA H2 "Poznaj koszt swojego projektu" = **48px**, podczas gdy analogiczne CTA
  na `/`, `/oferta`, stronach ofertowych = 60px.
- **[P3]** 5 sierot w krótkich opisach kart "Co wpływa na cenę" (wąska kolumna karty, naturalny
  efekt uboczny — niska waga, ale częsty wzorzec wart rozwiązania przez `text-wrap: balance`
  na nagłówkach/krótkich blokach).

### `/o-nas`

- **[P1] Nazwisko członka zespołu = 36px** (`about.tsx:61`, `text-3xl md:text-4xl`) vs **24px** na
  homepage (`home/people.tsx:61`) dla identycznego UI-wzorca (imię + rola + telefon). Różnica jest
  dobrze widoczna wizualnie — na `/o-nas` nazwiska wyglądają jak osobny poziom hierarchii.
- Poza tym strona czysta — brak sierot/długich linii w głównej treści.

### `/kontakt`

- **[P1] H2 "Zostaw numer — oddzwonimy w 24 h z konkretami." = 36px** — to ten sam `CompactLeadForm`
  co na `/`, ale bez propa `bare` (tu renderowany samodzielnie, nie w karcie hero), więc trafia w
  gałąź kodu `compact-lead-form.tsx:306` (`text-3xl md:text-4xl`) zamiast `:285` (`text-2xl`)
  używanej na home. Sama różnica gałęzi jest uzasadniona (inny layout), ale skala 24px → 36px dla
  identycznego zdania nie została nigdzie świadomie zharmonizowana — warto ujednolicić.
- Reszta strony czysta, dobry rytm.

### `/software-house-poznan` (strona SEO, hardkodowana PL poza i18n)

- **[P0] H3 renderują się w Plus Jakarta Sans (body font) zamiast Newsreader** — narusza własną
  zasadę projektu z `CLAUDE.md` ("Fonty: Newsreader (nagłówki) + Plus Jakarta Sans (body)").
  Dotyczy wszystkich podtytułów kart usług i pytań FAQ:
  `src/app/software-house-poznan/page.tsx:215, 249, 264, 274, 285` — żaden nie ma `font-headline`.
  Wizualnie strona przez to wygląda jak inna generacja designu niż reszta serwisu (proste, cienkie
  obwódki kart zamiast wypełnionych miętowych kart używanych wszędzie indziej).
- **[P0] Najdłuższa linia FAQ w audycie — do 131 znaków** ("Siedziba Programo mieści się w
  Poznaniu, ale realizuj…", 16px) — kontener FAQ nie ma węższego wrappera na tekst odpowiedzi.
  Kilka innych akapitów FAQ na tej stronie: 88, 93, 94, 100, 109, 118, 122 znaków/linię —
  systematycznie gorzej niż reszta serwisu.
- **[P1] Sierota w H1.**
- **[P3, do weryfikacji]** stopka nie wyrenderowała się w rozsądnej wysokości podczas testów mimo
  potwierdzenia w DOM (`<footer>` istnieje, `rounded-t-[32px] mt-12`) — jak przy `/projects/[slug]`,
  możliwy artefakt metody testowej albo realny problem z wysokością layoutu; wart sprawdzenia
  realnym Lighthouse/CLS.

### `/ile-kosztuje-aplikacji` (strona SEO, ten sam szablon co wyżej)

- **[P0] Ten sam problem H3 = body font zamiast Newsreader** —
  `src/app/ile-kosztuje-aplikacji/page.tsx:215, 273` (i prawdopodobnie pozostałe karty czynników
  ceny, do potwierdzenia dokładnych numerów linii dla każdej z 6 kart).
- **[P1] Długie linie FAQ** — 88–95 znaków/linię, ten sam wzorzec braku węższego kontenera na
  tekst odpowiedzi co na stronie siostrzanej.
- **[P3]** ten sam sygnał niestabilnej wysokości/stopki co na `/software-house-poznan`.

---

## Rekomendacje priorytetowe (skrót)

1. **[P0]** Owinąć długie akapity FAQ/treści na `/strony-internetowe` i obu stronach SEO w węższy
   kontener (np. `max-w-2xl`/`max-w-3xl`) — to jedyne miejsca z liniami >100 znaków.
2. **[P0]** Dodać `font-headline` do wszystkich H3 na `/software-house-poznan` i
   `/ile-kosztuje-aplikacji`, żeby wrócić do reguły Newsreader-na-nagłówkach i ujednolicić z resztą
   serwisu wizualnie (docelowo: przepisać obie strony na te same komponenty co strony ofertowe,
   zamiast osobnego, starszego szablonu).
3. **[P1]** Skonsolidować skalę H2 do 2–3 kroków (np. 36px standard sekcji / 48px hero-sekcja /
   60px wyłącznie dla H1-poziomu CTA) i wymusić ją przez współdzielony komponent nagłówka sekcji
   zamiast inline `text-*` w każdym pliku.
4. **[P1]** Zunifikować komponent nagłówka FAQ (obecnie min. 4 różne implementacje) i komponent
   karty członka zespołu (`home/people.tsx` vs `about.tsx`) do jednego, współdzielonego.
5. **[P1]** Stworzyć `src/components/ui/button.tsx` z ustaloną skalą wysokości (np. sm/md/lg =
   40/48/56px) i przepisać na niego `cta-button.tsx` + ad-hoc przyciski w `navbar.tsx`,
   `sticky-cta.tsx`, `quick-contact.tsx`.
6. **[P1]** Stworzyć `src/components/ui/container.tsx` (lub token `--container-max` w
   `globals.css`) i zredukować 15+ wartości `max-w-*` do 3–4 kroków.
7. **[P2]** Zamienić `max-w-[68ch]` na stały piksel (`max-w-[620px]`) w `ProjectDetailClient.tsx`.
8. **[P2]** Ujednolicić `tracking-[0.3em]` vs `tracking-[0.4em]` dla eyebrow do jednej wartości.
9. **[P2]** Nie zdejmować kontrastu przez opacity-modyfikatory na tekście <18px — patrz sekcja
   Kontrast i `docs/audit-visual/ux-a11y-report.md` P0-2 po pełną listę wystąpień.
10. **[P3]** Dodać `text-wrap: balance` do kluczowych nagłówków (H1 hero, H2 CTA) — rozwiąże
    większość sierot bez ręcznych poprawek tekstu; dla współdzielonej stopki (`footer.tsx`) rozważyć
    twardą spację przed ostatnim słowem taguline'u, bo powtarza się na każdej stronie serwisu.

# Audyt mockupów urządzeń — programo.pl

Data: 2026-07-15
Zakres: `src/components/ui/browser-frame.tsx`, `phone-frame.tsx`, `device-duo.tsx` — kod + wizualna
weryfikacja na buildzie lokalnym (`http://localhost:3200`, Next 16.1) przez headless Chrome
(Playwright) w 1440×900 (desktop) i 390×844 (mobile), strony: home, `/projekty`,
`/projects/jedmar`, `/projects/estalo`, `/projects/skup-nieruchomosci`, `/projects/wsafefinanse`.

Kontekst od właściciela: *"symulacje web i iPhone'a są dramatyczne; na Estalo ładnie wygląda
iPhone, ale web musisz zrobić dużo lepiej"*. Audyt potwierdza to i namierza dokładną przyczynę
techniczną, a nie tylko "wrażenie".

Uwaga metodologiczna: interaktywna sesja przeglądarki w tym środowisku okazała się niestabilna
(nieoczekiwane nawigacje między wywołaniami), więc zrzuty finalne pochodzą z niezależnego
headless-Chrome (Playwright, świeży kontekst per strona, wolne przewijanie + `img.complete`
wait, żeby wykluczyć fałszywe alarmy od lazy-loadingu). Dwa pozorne błędy zostały tą metodą
**wykluczone jako artefakty pomiaru**, nie zgłaszam ich jako realne problemy:
- "Pusta ramka" w sekcji Jedmar na mobile — artefakt zbyt szybkiego scrolla w pierwszym
  przebiegu (lazy-loaded `<Image>` nie zdążył się doładować). Po spowolnieniu — obrazek ładuje
  się poprawnie.
- Pasek nawigacji "unoszący się" nad mockupem na stronach `/projects/*` — artefakt trybu
  `fullPage` w Playwright dla elementów `sticky`/`fixed` (CDP renderuje je powielone przy
  każdym "segmencie" długiego zrzutu). Zrzut pojedynczego viewportu potwierdza, że w realnym
  użytkowaniu nawigacja nie nachodzi na mockup.

---

## 1. BrowserFrame (`src/components/ui/browser-frame.tsx`)

### P0 — Kadr wycina ramkę w połowie w gridzie portfolio na home (`PortfolioGrid`)

`home/portfolio-grid.tsx` renderuje `BrowserFrame` bezpośrednio (bez modyfikacji), wewnątrz
kontenera o **stałej wysokości** `h-[280px] md:h-[320px] overflow-hidden` (linia 74 tego pliku).
`BrowserFrame` sam w sobie ma pełne zaokrąglenie `rounded-2xl`, border i cień
`shadow-[0_30px_60px_-25px_rgba(0,0,0,0.45)]` na **całym** komponencie (dół włącznie) — ale
przy realnych proporcjach zrzutu desktopowego (2880×1800 = 1.6:1) i szerokości karty na
desktopie (`max-w-[560px]`), sama ramka ma wysokość ~390 px, czyli **więcej niż kontener 320 px**.
Efekt: dolna krawędź ramki (zaokrąglony róg, border, cień) nigdy się nie renderuje — obraz jest
ucięty płaskim, ostrym cięciem w połowie treści zrzutu, bez żadnego fade/gradientu
sygnalizującego, że to celowe. To jest ramka, która "nie ma dna" — wygląda na złamaną/niedokończoną,
nie na świadomy podgląd.

Zweryfikowane wizualnie (zoom na `estalo.pl` kartę, desktop 1440): treść zrzutu urywa się
w pół zdania interfejsu, karta portfolio zaczyna się od razu białym tłem — brak zamknięcia ramki.
To dotyczy **wszystkich 5 kart z BrowserFrame** na home (Estalo, ePortal Prawny, WKS Poznań,
Skup Nieruchomości, Rejestr Pro) na desktopie. Na mobile (jedna kolumna, karta ~342 px szerokości)
proporcje wychodzą korzystniej (wysokość ramki ~215 px < 280 px kontenera) — tam problemu **nie ma**,
ramki zamykają się poprawnie z widocznym dolnym rogiem i cieniem.

**Dla porównania**: `/projekty` (`src/components/featured-work.tsx`, `CardMedia`) rozwiązuje ten
sam problem inaczej i poprawnie — nakłada `className="rounded-none border-0 shadow-none"` na
`BrowserFrame`, więc żadna "obietnica" pełnej ramki (róg, cień) nie jest łamana; kontener karty
(`rounded-t-2xl overflow-hidden`) sam dostarcza zaokrąglenie górne, a ucięcie na dole wygląda jak
świadomy "peek preview", nie jak błąd. **PortfolioGrid na home powinien użyć tego samego wzorca.**

Rekomendacja: w `PortfolioGrid`, dla wariantu `frame === "browser"`, przekazać
`className="rounded-none border-0 shadow-none"` do `BrowserFrame` (analogicznie do `featured-work.tsx`)
i pozostawić zaokrąglenie/cień na zewnętrznym kontenerze karty. Opcjonalnie dodać
`bg-gradient-to-t from-surface to-transparent` maskę ~24px na dole obszaru mediów, żeby ucięcie
było płynne, nie nożem.

### P1 — Chrome bar nie reaguje na ciemne zrzuty (tylko na motyw strony)

`bg-surface-container-high` mapuje się na `--theme-border-2`, czyli w light mode **`#8EB69B`**
(nasycona szałwiowa zieleń marki), w dark mode na `--theme-bg-4` (`#163832`, ciemny teal). To
znaczy: kolor paska Chrome zależy **wyłącznie od motywu strony** (jasny/ciemny toggle Programo),
nie od tego, czy renderowany zrzut jest jasny czy ciemny. Efekt widoczny na `/projects/wsafefinanse`
(desktop, motyw jasny — domyślny): jaskrawy szałwiowy pasek bezpośrednio nad niemal czarnym
zrzutem W.Safe Finance — ostry, nienaturalny kontrast, którego żadna prawdziwa przeglądarka by
nie pokazała (Safari/Chrome dopasowują title bar do zawartości strony lub do motywu systemu, nie
zostają jaskrawe na ciemnej stronie). To jeden z głównych powodów, dla których mockupy "wyglądają
dramatycznie" — pasek wygląda jak naklejony, nie jak faktyczne okno przeglądarki.

Dodatkowo: użycie **brandowej** szałwiowej zieleni jako koloru paska (zamiast neutralnego szarego,
jak w referencyjnych portfolio Tonik/Monterail/MetaLab: `#F5F5F7`/`#2C2C2E`) sprawia, że pasek
konkuruje wizualnie z branding zrzutu produktu w środku, zamiast być neutralnym "oknem".

Rekomendacja: przełączyć pasek na neutralny szary (jasny/ciemny wariant niezależny od tokenów
marki) i/lub wykryć jasność zrzutu (prosty heuristic po nazwie/metadanych albo props `dark?:
boolean` przekazywany ręcznie z `projects.ts`) i dobrać wariant paska per-zrzut, nie per-motyw
strony. Patrz SPEC niżej.

### P1 — Traffic-lights i pasek adresu wyglądają płasko, bez głębi

Zoom na pasek (`estalo.pl`, desktop): trzy kropki (`#ff5f57`/`#febc2e`/`#28c840`) to płaskie,
jednolite koła bez wewnętrznego highlightu/gradientu, jakie mają realne przyciski macOS
(subtelny radialny gloss + cień od dołu). Pole adresu to jednolity jasny prostokąt (`bg-surface`)
z ikoną kłódki + hostem, bez wewnętrznego cienia (`inset shadow`), który w prawdziwej przeglądarce
odróżnia pole adresu od paska tytułowego. Cały pasek to płaska plama koloru bez górnego rozjaśnienia
ani dolnej linii separującej innej niż `border-b`. To nie jest błąd, ale różnica jakości vs
referencje — łatwa do podniesienia bez przebudowy struktury (patrz SPEC).

### P2 — Adres URL: typografia OK, ale brak favicon/protokołu i truncate bez wskazania

`host` w `browser-frame.tsx` poprawnie strips protokół i trailing slash — dobre, czytelne
(np. `estalo.pl`, `skupnieruchomoscipl.pl`). Font paska adresu to `text-xs`, `text-on-surface-variant`
— czytelny, spójny. Brakuje: (a) favicon/inicjału serwisu przed hostem (realne przeglądarki to
mają), (b) przy `truncate` na wąskich kartach długi host (`skupnieruchomoscipl.pl`,
`rejestr-pro.vercel.app`) nie ma żadnego side-fade sygnalizującego ucięcie.

### P2 — Rozdzielczość / ostrość zrzutów

Źródłowe pliki (`estalo-desktop.webp` 2880×1800, `jedmar-schemat-tool-desktop.webp` 2880×1800,
`*-mobile.webp` 1170×2532) są **retina-quality** (2× względem wyświetlanych rozmiarów) — brak
realnego rozmycia w żadnym sprawdzonym przypadku. `sizes="(max-width: 768px) 100vw, 720px"` w
`BrowserFrame` daje next/image lekki nadmiar (np. w kartach `max-w-[560px]` żąda 720px) — to
zapas, nie niedobór, więc nie powoduje rozmycia. **Ostrość nie jest problemem** — problemem jest
kadrowanie (P0 wyżej) i sama treść niektórych zrzutów (patrz sekcja 4).

---

## 2. PhoneFrame (`src/components/ui/phone-frame.tsx`)

### P0 — To samo obcięcie co BrowserFrame, w kartach `PortfolioGrid` na desktopie

Karta Jedmar na home (desktop): kontener mediów ma tę samą stałą wysokość `h-[280/320px]`, a
telefon w trybie domyślnym (`h-full object-cover object-top`, aspekt `9/19.5`) przy
`w-[46%] max-w-[180px]` ma wysokość ~390 px > 320 px kontenera → dolna krawędź obudowy telefonu
(zaokrąglony róg, cień) jest ucinana identycznie jak w BrowserFrame. Wizualnie mniej rażące niż
przy BrowserFrame (czarna obudowa telefonu maskuje cięcie lepiej niż biały screenshot), ale
mechanizm i naprawa są te same — patrz rekomendacja P0 wyżej (wspólna dla obu komponentów).

### P1 — `object-cover object-top` na niedopasowanym aspekcie = realne przycinanie treści

Domyślny tryb (`scrollOnHover=false`, użyty w `HeroDevices`/`Gallery` na stronach projektów i w
`PortfolioGrid`) renderuje obraz z `w-full h-full object-cover object-top` wewnątrz kontenera o
aspekcie `9/19.5` (≈0.4615). Źródłowe zrzuty telefonu (`jedmar-app-home.webp` 1284×2638 ≈ 0.4867)
są **bliskie**, więc przycięcie jest minimalne dla tego konkretnego zrzutu — ale to przypadek, nie
gwarancja: każdy przyszły zrzut z innym aspektem (np. capture na innym urządzeniu/rozdzielczości)
będzie przycięty bardziej, bez żadnej kontroli w komponencie. Nie ma dziś realnego przypadku złego
przycięcia treści (dynamic island nie nachodzi na status bar źle), ale mechanizm jest kruchy.

### P0 — `estalo-mobile.webp` w `HeroDevices` pokazuje NIE-mobilny layout (treść ucięta w połowie zdania)

To nie jest błąd komponentu `PhoneFrame`, tylko treści zrzutu który się w niego ładuje — ale
efekt końcowy jest dokładnie to, na co żali się właściciel ("iPhone na Estalo wygląda ładnie" —
**nieprawda dla strony `/projects/estalo`**, tylko dla kafla na home, gdzie w telefonie jest inny,
poprawny zrzut aplikacji). Na `/projects/estalo` `HeroDevices` bierze `estalo-mobile.webp`
(1170×2532) — plik jest technicznie "mobilny" (portret, prawidłowe wymiary), ale renderowana w
nim strona **nie jest w mobilnym layoucie**: widoczny jest dwukolumnowy hero z desktopa
("Po spotkaniu powiedz jedno / zdanie. Estalo zajmie się res…" — tekst ucięty w połowie słowa
po prawej krawędzi, treść notatki w osobnej kolumnie też ucięta). To wygląda jak realny błąd
odpowiedzialności (responsywności) na estalo.pl w momencie przechwytywania zrzutu, nie problem
`PhoneFrame`. W ramce telefonu efekt: **ucięty na wpół tekst nagłówka** — jeden z bardziej
rażących "dramatycznych" widoków w całym audycie.

Rekomendacja (poza zakresem komponentu, ale bezpośrednio odpowiada za "dramatyczny" wygląd):
podmienić `estalo-mobile.webp` na świeży zrzut zrobiony po potwierdzeniu, że mobilny breakpoint
faktycznie się załadował (poczekać na layout, nie tylko na network idle), albo capture'ować przez
realny viewport 390px z dodatkowym opóźnieniem.

### P2 — `scrollOnHover` (Jedmar hero na `/projects/jedmar`, `DeviceDuo`) — tylko desktop, brak odpowiednika mobile

`scrollOnHover` daje ładny efekt na desktopie (`md:group-hover:-translate-y-[38%]`), ale na
dotyku (mobile) telefon w tym trybie renderuje z `h-auto` — czyli **cały, niewycięty** obraz
(dobrze), ale zajmuje więcej pionowej przestrzeni niż inne karty i nie ma żadnej wskazówki, że
przez tap/scroll użytkownik mógłby zobaczyć więcej (na desktopie hover to sugeruje, na mobile —
nic).

---

## 3. DeviceDuo (`src/components/ui/device-duo.tsx`)

### Ocena ogólna: **to najlepiej wykonany komponent w audycie — wzorzec do powielenia**

Użyty w `FeaturedJedmar` (home) i `HeroDevices` (strony projektów web: Estalo, Skup Nieruchomości,
W.Safe Finance). Brak fixed-height kontenera (naturalny layout) → `BrowserFrame` renderuje się w
**całości**, z pełnym zaokrągleniem, cieniem i zamkniętym dołem; `PhoneFrame` zachodzi
`absolute bottom-[-6%] right-0` z lekkim parallax (`framer-motion`, `useScroll`) i **też** w
całości. Wizualnie to jedyne miejsce w audycie, które faktycznie zbliża się do referencji
(Tonik/Monterail): dwuwarstwowa kompozycja, spójne cienie, czytelny pasek adresu, brak obcięć.

Jedyne zastrzeżenia:
- **P1**: dziedziczy problem "płaskiego paska Chrome niezależnego od jasności zrzutu" z
  `BrowserFrame` (patrz sekcja 1) — widoczne najbardziej na `/projects/wsafefinanse` (ciemny
  zrzut pod jasnym paskiem).
  - Dodatkowo na tej samej stronie: telefon w `DeviceDuo` pokazuje ten sam desktop-w-mobile-ramce
    zrzut co `HeroDevices` (bo to ten sam mechanizm `HeroDevices`/`DeviceDuo` — patrz sekcja 2, P0),
    więc ten sam błąd treści occurs tutaj też, mniej dotkliwie bo mniejszy telefon.
- **P2**: `md:pr-[18%]` na kontenerze `BrowserFrame` rezerwuje miejsce na telefon tylko od `md`
  w górę — poniżej `md` telefon nakłada się bezpośrednio na prawą krawędź przeglądarki bez
  rezerwacji przestrzeni (sprawdzone na mobile 390px — działa, bo telefon i tak jest wąski
  względem pełnej szerokości karty, ale to przypadkowe, nie zamierzone przez layout).

---

## 4. Uwagi per strona (occurrence-level)

### Home (`/`)

| Miejsce | Plik zrzutu | Problem | Rekomendacja |
|---|---|---|---|
| Portfolio grid — Jedmar (phone) | `jedmar-app-home.webp` | P0: ramka ucięta u dołu (desktop) | className override jak w `featured-work.tsx` |
| Portfolio grid — Estalo, ePortal Prawny, WKS Poznań, Skup Nieruchomości, Rejestr Pro (browser) | `*-desktop.webp` | P0: ramka ucięta u dołu (desktop), brak zaokrąglonego rogu/cienia | jw. + opcjonalny fade mask |
| Portfolio grid (wszystkie, mobile) | — | OK — proporcje karty 1-kolumnowej mieszczą całą ramkę | — |
| Featured Jedmar — DeviceDuo | `jedmar-schemat-tool-desktop.webp` + `jedmar-app-home.webp` | Dobrze wykonane; jedyna uwaga: pasek Chrome jasny niezależnie od treści (tu nieszkodliwe, treść jasna) | brak pilnej akcji |

### `/projekty`

| Miejsce | Plik zrzutu | Problem | Rekomendacja |
|---|---|---|---|
| Wszystkie 10 kart (`FeaturedWork`/`CardMedia`) | różne `*-desktop.webp` | Dobrze wykonane — `BrowserFrame` z `rounded-none border-0 shadow-none`, ucięcie u dołu czytelne jako "peek", nie błąd | P2: dodać subtelny fade na dole obszaru mediów dla większej płynności |
| Karta Jedmar (phone, `CardMedia`) | `jedmar-app*.webp` | Drobne ucięcie u dołu (128px szer. → ~277px wys. > 230/250/270px kontenera przy mniejszych breakpointach) | mniej pilne — obudowa telefonu maskuje cięcie |

### `/projects/jedmar`

| Miejsce | Plik zrzutu | Problem | Rekomendacja |
|---|---|---|---|
| Hero — 3× PhoneFrame w poziomym scrollu | `jedmar-app-home/category/product.webp` | OK — trzeci telefon celowo "wystaje" poza viewport jako afordancja scrolla (dobry wzorzec UX, nie błąd) | brak akcji |
| Galeria (BrowserFrame + PhoneFrame bez ograniczenia wysokości) | różne | OK — pełne ramki, czyste zamknięcie | brak akcji |

### `/projects/estalo`

| Miejsce | Plik zrzutu | Problem | Rekomendacja |
|---|---|---|---|
| Hero — DeviceDuo | `estalo-desktop.webp` (browser) + `estalo-mobile.webp` (phone) | **P0**: zrzut w telefonie pokazuje nie-mobilny layout, tekst ucięty w połowie słowa | podmienić zrzut mobile na realnie responsywny capture |
| Hero — pasek Chrome | — | P1: jasny pasek nad jasnym zrzutem — tu OK kolorystycznie, ale mechanizm ten sam co wyżej | — |

### `/projects/skup-nieruchomosci`

| Miejsce | Plik zrzutu | Problem | Rekomendacja |
|---|---|---|---|
| Hero — DeviceDuo | `skup-desktop.webp` + telefon | P2: source screenshot zawiera własny baner cookies strony klienta ("Używamy cookies…") wypalony w zrzucie — wygląda jak część mockupu, nieprofesjonalnie | przechwycić zrzut po zaakceptowaniu/ukryciu bannera cookies na stronie źródłowej |
| Ramka jako taka | — | OK, w pełni zamknięta (DeviceDuo) | — |

### `/projects/wsafefinanse`

| Miejsce | Plik zrzutu | Problem | Rekomendacja |
|---|---|---|---|
| Hero — DeviceDuo | `wsafefinanse-desktop.webp` (ciemny motyw) | **P1**: jaskrawy szałwiowy pasek Chrome nad niemal czarnym zrzutem — najbardziej rażący przykład problemu z sekcji 1 | dark-aware chrome bar (SPEC niżej) |
| Hero — telefon | `wsafefinanse-mobile.webp` | Do zweryfikowania czy to realny mobilny capture (nie sprawdzono treści osobno — priorytet niższy niż Estalo) | zweryfikować analogicznie do Estalo |

---

## 5. SPEC — ulepszony `BrowserFrame`

Cel: przeglądarkowe okno klasy "premium portfolio" (referencje: Tonik, Monterail, MetaLab) —
neutralne, ciche, nie konkurujące z zawartością zrzutu; zawsze zamknięte (nigdy nie ucinane w
środku); reaguje na jasność zrzutu, nie tylko na motyw strony.

**Warstwy (od zewnątrz):**
1. **Cień kontaktowy zewnętrzny** — dwuwarstwowy zamiast jednego: krótki, mocny cień blisko
   krawędzi (`0 8px 16px -8px rgba(0,0,0,0.25)`) + długi, rozmyty cień "unoszenia"
   (`0 40px 80px -32px rgba(0,0,0,0.35)`). Dwie warstwy dają wrażenie realnego odbicia światła,
   jedna płaska warstwa (obecny stan) wygląda jak winieta.
2. **Korpus okna** — `rounded-[18px]` (odrobinę większy promień niż obecne `rounded-2xl`/16px,
   bliżej macOS), `border border-black/[0.06]` w light / `border-white/[0.08]` w dark — bardzo
   subtelna, nie `outline-variant` marki.
3. **Pasek tytułowy (chrome bar)** — kolor **neutralny, niezależny od marki**:
   - jasny wariant: gradient pionowy `linear-gradient(#F7F7F8, #EBEBEE)` (subtelny bevel, nie flat)
   - ciemny wariant: `linear-gradient(#3A3A3C, #2C2C2E)`
   - wybór wariantu: nie po motywie strony, tylko po jasności zrzutu — dodać opcjonalny prop
     `dark?: boolean` do `BrowserFrame`/wpis w `projects.ts` per zrzut (prosto: ręcznie ustawione
     raz, tanie w utrzymaniu), z fallbackiem na motyw strony gdy nieustawione.
   - dolna krawędź paska: `border-b` + `box-shadow: inset 0 -1px 0 rgba(255,255,255,0.4)` (light)
     dla efektu światła od góry.
4. **Traffic lights** — zachować 3 kolory, ale dodać `background: radial-gradient(circle at 35% 30%, <kolor jaśniejszy>, <kolor bazowy>)` + `box-shadow: inset 0 -1px 1px rgba(0,0,0,0.15)` żeby nie
   były płaskimi kółkami.
5. **Pole adresu** — pill z `box-shadow: inset 0 1px 2px rgba(0,0,0,0.06)` (wgłębienie), dodać
   16×16 favicon/inicjał przed kłódką (opcjonalnie, `project.accentColor` jako fallback kropka),
   `text-on-surface-variant` OK, dodać `mask-image` linear-gradient fade na overflow hosta zamiast
   suchego `truncate`.
6. **Obszar treści** — zawsze renderować **całą** wysokość obrazu przeskalowaną do szerokości
   (`h-auto`, jak obecnie w trybie domyślnym bez `children`) — **nigdy nie umieszczać `BrowserFrame`
   w kontenerze o twardej `max-height` mniejszej niż naturalna wysokość ramki**. Tam gdzie potrzebny
   jest "peek" (karty siatki), stripować własny border/cień/radius komponentu (`className="rounded-none
   border-0 shadow-none"`, wzorem `featured-work.tsx`) i dodać `mask-image: linear-gradient(to bottom,
   black 80%, transparent 100%)` na kontenerze karty dla płynnego, celowego ucięcia.

## 6. SPEC — ulepszony `PhoneFrame`

- Ujednolicić z powyższym: **nigdy nie umieszczać w kontenerze niższym niż naturalna wysokość
  przy danej szerokości** (aspekt `9/19.5`); jeśli potrzebny peek/crop w karcie, świadomie
  kadrować z `object-position` dobranym per zrzut + fade mask na dole, nie ślepy `object-cover`.
- Metalowa ramka: obecny gradient `from-neutral-600 via-neutral-800 to-neutral-900` jest OK, ale
  dodać wąski (1px) jasny highlight na lewej krawędzi (`inset 1px 0 0 rgba(255,255,255,0.15)`)
  symulujący odbicie światła na aluminiowej ramce — dziś ramka jest jednolicie matowa.
  cień: analogicznie do BrowserFrame, dwuwarstwowy zamiast jednej wartości.
- Dynamic island: obecny `h-[26px] w-[92px] rounded-full bg-black` jest poprawny proporcjonalnie;
  dodać bardzo subtelny `ring-1 ring-white/5` żeby nie wtapiał się płasko w ciemne zrzuty.
- Zweryfikować/ustandaryzować źródłowe zrzuty telefonu do jednego aspektu (idealnie 1290×2796 lub
  1284×2778, natywne iPhone 15/16 Pro) tak, żeby `object-cover` nigdy nie musiał kadrować więcej
  niż kilka procent u góry/dołu — dziś to działa przez przypadek (zrzuty "akurat" zbliżone do
  aspektu ramki), nie przez wymuszenie.
- Rozważyć jawny prop `contentAspect` (np. z realnych wymiarów obrazka) żeby komponent mógł
  ostrzec/dostosować się, gdy zrzut istotnie odbiega od 9:19.5, zamiast cichego, niekontrolowanego
  przycinania.

---

## Podsumowanie priorytetów

- **P0 (napraw najpierw)**: (1) `PortfolioGrid` na home ucina `BrowserFrame`/`PhoneFrame` w połowie
  — zastosować wzorzec z `featured-work.tsx` (strip border/shadow/radius + fade mask). (2)
  `estalo-mobile.webp` pokazuje nie-mobilny, ucięty w pół słowa layout w `PhoneFrame` na
  `/projects/estalo` — podmienić zrzut.
- **P1**: pasek Chrome nie reaguje na jasność zrzutu i używa brandowej zieleni zamiast neutralnego
  szarego — najbardziej widoczne na `/projects/wsafefinanse`; traffic-lights i pole adresu są
  płaskie, bez głębi.
- **P2**: brak favicon w pasku adresu, brak fade przy truncate hosta, cookie-banner wypalony w
  zrzucie `skup-desktop.webp`, brak mobile-odpowiednika dla `scrollOnHover`.

Ostrość/rozdzielczość zrzutów **nie jest problemem** (źródła są retina-quality, `sizes` daje
nadmiar, nie niedobór) — całe "dramatyczne" wrażenie właściciela pochodzi z (a) ucinania ramek w
połowie na home, (b) niedopasowanego kontrastu paska Chrome do ciemnych zrzutów, (c) jednego
realnie złego zrzutu (Estalo mobile).

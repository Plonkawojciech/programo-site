# Audyt zróżnicowania prezentacji projektów — programo.pl

Data: 2026-07-15
Zakres: `/projekty` (10 kart) + `/projects/[slug]` (10 detali), build localhost:3200.
Metoda: zrzuty headless Chrome 1440px desktop dla wszystkich 20 widoków + odczyt surowych
assetów `public/screenshots/v2/*.webp` + przegląd kodu (`ProjectDetailClient.tsx`,
`featured-work.tsx`, `browser-frame.tsx`, `device-duo.tsx`, `projects.ts`).

Kontekst zlecenia (Wojtek): *„niektóre strony wyglądają bardzo podobnie do siebie… teraz
trochę wygląda, jakby każda strona wyglądała tak samo. PoolTimer pokaż ładniej, nie jako
landing."* — potwierdzone, z konkretną przyczyną w kodzie (nie tylko w doborze zrzutów).

---

## 1. Wynik pomiaru: ile z 10 hero to „jasny landing z nagłówkiem"

| # | Projekt | Layout hero | Tło realnego zrzutu | Typ treści |
|---|---|---|---|---|
| 1 | Jedmar | PhoneFrame ×3 (jedyny inny layout) | biało-żółte | ekrany aplikacji |
| 2 | Estalo | BrowserFrame + PhoneFrame (DeviceDuo) | **jasne/białe** | landing CRM |
| 3 | ePortal Prawny | DeviceDuo | **jasne kremowe** | landing wyszukiwarki |
| 4 | WKS Poznań | DeviceDuo | **jasne kremowe** | landing klubu |
| 5 | Skup Nieruchomości | DeviceDuo | **jasne kremowe** | landing lead-gen |
| 6 | Rejestr Pro | DeviceDuo | **jasne kremowe** (czarny neo-brutal tekst) | landing wyszukiwarki |
| 7 | Solvio | DeviceDuo | **jasne kremowe** (czarny neo-brutal tekst) | landing SaaS |
| 8 | W. Safe Finance | DeviceDuo | ciemne granatowe | landing doradcy |
| 9 | Domki Poznaniak | DeviceDuo | jasne, ale zdjęciowe (nie tekstowy landing) | strona klienta (WP) |
| 10 | PoolTimer | DeviceDuo | **jasne kremowe** (obecnie) | landing SaaS |

**Wynik: 7 z 10 hero to jasny landing z dużym nagłówkiem w identycznym kontenerze
BrowserFrame+telefon** (Estalo, ePortal Prawny, WKS Poznań, Skup Nieruchomości, Rejestr Pro,
Solvio, PoolTimer). Do tego 9 z 10 detali (wszystko poza Jedmarem) używa **dokładnie tego
samego komponentu** `DeviceDuo` (`src/components/ui/device-duo.tsx`) — ta sama ramka
przeglądarki z trzema kropkami, ten sam telefon zachodzący z prawej strony, ta sama
kompozycja `md:pr-[18%]` + `absolute bottom-[-6%] right-0`. To jest źródło wrażenia klonów —
nie tylko dobór kolorów, ale **identyczny szkielet komponentu, niezależny od charakteru
produktu**.

To samo na `/projekty`: `CardMedia` w `src/components/featured-work.tsx:44-70` renderuje
dokładnie `BrowserFrame` z `project.screenshots?.[0]` dla każdego projektu poza `kind ===
"mobile-app"` (czyli poza Jedmarem). 9 z 10 kart ma więc identyczny kontener miniatury.

---

## 2. Macierz podobieństwa (pary, które wyglądają jak klony)

| Para | Podobieństwo | Przyczyna |
|---|---|---|
| **Estalo ↔ ePortal Prawny** | Najbardziej identyczna para | Oba: `DeviceDuo`, jasne/kremowe tło, ciemny serif nagłówek w lewym górnym rogu, mała biała karta UI po prawej, ten sam zielono-miętowy pill-badge statusu, ten sam przycisk `ZOBACZ NA ŻYWO/PODGLĄD`. Różni je wyłącznie tekst i miniatura w ramce. |
| **Rejestr Pro ↔ Solvio** | Bardzo podobne | Oba mają ten sam styl produktu: kremowe tło, czarny bold sans-serif nagłówek, czarne przyciski, neo-brutalna estetyka. W `DeviceDuo` różnica praktycznie niewidoczna na pierwszy rzut oka. |
| **WKS Poznań ↔ Skup Nieruchomości** | Podobne w kompozycji | Oba `DeviceDuo`, jasne tło, ale różne akcenty (czerwony vs zielony) i różna treść — mniej dotkliwe niż para 1, ale nadal ten sam szkielet. |
| **PoolTimer (obecny) ↔ powyższa grupa** | Klon strukturalny | Obecny `pooltimer-desktop.webp` to landing (jasne tło, niebieski akcent) — wygląda jak kolejny wariant tej samej rodziny, mimo że produkt ma gotowy, dużo ciekawszy ciemny kokpit (`pooltimer-cockpit-desktop.webp`), którego strona nie używa. |
| **Jedmar** | Jedyny realnie odmienny | Jedyny projekt z `kind: "mobile-app"` → inny komponent (`PhoneFrame` ×3), inna kompozycja. To pokazuje, że wariant B (patrz §4) już istnieje w kodzie, tylko dla jednego projektu. |
| **W. Safe Finance ↔ Domki Poznaniak** | Realnie odmienne | Jedyne dwa, które wizualnie się wybijają: W. Safe Finance przez ciemny granat, Domki Poznaniak przez zdjęciowe tło (prawdziwa strona klienta na WordPressie, nie projekt/tekst). |

**Wniosek:** problem nie leży w danych (`accentColor`/`bgColor` per projekt już istnieją
i są unikalne dla każdego z 10 projektów — patrz `src/lib/projects.ts`), tylko w tym, że
**hero na detalu i media na karcie w ogóle z nich nie korzystają**. `accentColor` dziś steruje
wyłącznie 4px kreską na górze karty (`featured-work.tsx:92-96`) i kropką statusu — nie kolorem
tła sekcji hero. `bgColor` jest używany tylko w dwóch pomniejszych komponentach
(`projects-marquee.tsx:47`, `case-studies.tsx:79`), których nie ma na `/projekty` ani na
`/projects/[slug]`.

---

## 3. Assety w `public/screenshots/v2/` — co jest nieużywane i dałoby różnorodność

Pełny `ls` (46 plików). Aktualnie w `projects.ts` **nieużywane**:

| Asset | Rozmiar | Co pokazuje | Rekomendacja |
|---|---|---|---|
| `pooltimer-cockpit-desktop.webp` | 71 KB | **Ciemny panel trenera na żywo**: split-screen czarny kokpit z torami/czasami na żywo + jasny formularz logowania. Dokładnie to, o co prosi właściciel. | Użyć jako **główny hero + karta** PoolTimer zamiast landing page. |
| `estalo-enterprise-desktop.webp` | 112 KB | Ciemny dashboard „Panel dyrektora" — realne liczby (pipeline 8,4 mln zł, ranking agentów), pomarańczowy akcent na czekoladowym tle. | Użyć jako drugi zrzut w mozaice Estalo (desktop CRM jasny + dashboard Enterprise ciemny) albo jako hero w wariancie ciemnym — dziś `bgColor` Estalo to `#1a1a1a` (ciemny), ale pokazywany zrzut jest jasny — niespójność marki vs. prezentacji. |
| `estalo-portal-desktop.webp` | 109 KB | Portal ogłoszeń Estalo (osobny produkt, jasny, edytorski serif). | Dodać do mozaiki „CRM + własny portal" — dziś podtytuł Estalo brzmi „z własnym portalem ogłoszeń", ale portal nigdzie nie jest pokazany wizualnie. |
| `skup-spadek-desktop.webp` | 164 KB | Podstrona „Spadek i spadkobiercy" — ten sam styl co hero, ale inny motyw. | Dodać do Galerii Skup Nieruchomości (dziś galeria jest pusta, bo screenshots ma tylko 2 wpisy — desktop+mobile), żeby pokazać realne 6 podstron z metryki. |
| `jedmar-schematy-desktop.webp`, `jedmar-shop-desktop/mobile.webp`, `jedmar-desktop/mobile.webp` | — | Starsze/duplikaty zrzutów Jedmara (przed rebrandem nazw plików na `jedmar-schemat-tool-*` i `jedmar-app-*`). | Prawdopodobnie zbędne duplikaty — do wyczyszczenia przy okazji (nie ruszałem, poza zakresem audytu). |
| `eportalprawny-desktop/mobile.webp` (bez myślnika) | — | Identyczne z `eportal-prawny-desktop/mobile.webp` (z myślnikiem) — dwie kopie tego samego zrzutu pod różnymi nazwami. | Duplikat do wyczyszczenia — `projects.ts` używa wersji z myślnikiem, `featured-work`/`portfolio-grid` gdzieniegdzie odwołują się do wersji bez myślnika (`portfolio-grid.tsx:23`). Ryzyko rozjazdu przy przyszłej podmianie pliku. |
| `wks-desktop/mobile.webp`, `skup-desktop/mobile.webp` | — | Stare nazwy, zdублowane z `wks-poznan-*` / `skup-nieruchomosci-*`. Używane w `portfolio-grid.tsx` (sekcja na homepage), podczas gdy `projects.ts`/detal używają nowych nazw. | Ten sam duplikat/rozjazd co wyżej — inny plik na homepage niż na `/projekty` i detalu. Warto ujednolicić na jedną nazwę pliku. |

**Wniosek:** mamy już w repo trzy gotowe, nieużywane, wizualnie odmienne (ciemne/dashboardowe)
zrzuty — `pooltimer-cockpit`, `estalo-enterprise`, `estalo-portal` — które same w sobie
rozwiążą największą część problemu bez potrzeby nowej sesji screenshotowej.

---

## 4. Charakter produktów a wykorzystanie accentColor/bgColor/kind

Z `src/lib/projects.ts`, per projekt (accent / bg / kind):

| Projekt | accentColor | bgColor | Charakter marki | Dziś pokazywane jako |
|---|---|---|---|---|
| Jedmar | `#ffd333` żółty | `#1a1a0a` ciemny | Żółć narzędziowa, natywna apka | ✅ zgodnie — PhoneFrame, żółto-czarne UI |
| Estalo | `#c8a951` złoty | `#1a1a1a` ciemny | Premium/Enterprise CRM | ❌ pokazywany jasny landing, mimo ciemnej marki |
| ePortal Prawny | `#b8a06a` złoto-brąz | `#14120c` ciemny | Kancelaryjna elegancja | ❌ jasny landing |
| WKS Poznań | `#c41e3a` czerwony | `#1a0a0a` ciemny | Sport, realna tożsamość klubu | ⚠️ jasny, ale to prawdziwa strona klienta — OK |
| Skup Nieruchomości | `#3f8f5f` zielony | `#0a1a10` ciemny | Zaufanie, konwersja telefoniczna | ⚠️ jasny landing — uzasadnione (to naprawdę jasna strona) |
| Rejestr Pro | `#0ea5e9` niebieski | `#0a1a24` ciemny navy | Neo-brutalizm, dane rządowe | ❌ jasny landing, choć marka zdefiniowana jako ciemna |
| Solvio | `#5b8def` niebieski | `#0f1730` ciemny navy | Fintech, iOS-first | ❌ jasny landing (i brak realnych zrzutów iOS) |
| W. Safe Finance | `#2563eb` niebieski | `#0a1025` ciemny navy | Ciemny motyw domyślny (świadoma decyzja projektowa) | ✅ zgodnie — realny zrzut jest ciemny |
| Domki Poznaniak | `#d97706` pomarańcz | `#1a1206` ciemny | Zdjęciowa strona klienta (WordPress) | ✅ naturalnie odmienne (zdjęcia, nie UI) |
| PoolTimer | `#0b59db` niebieski | `#07172d` ciemny navy | Hardware + dashboard trenera | ❌ pokazywany jasny landing, mimo że **jest już gotowy ciemny zrzut kokpitu** |

**Kluczowe odkrycie:** 6 z 10 projektów (Estalo, ePortal Prawny, Rejestr Pro, Solvio,
W. Safe Finance, PoolTimer) ma `bgColor` **ciemny** w danych — czyli ktoś już zaprojektował
te projekty jako „ciemne kafle" w systemie (marquee/case-studies), ale hero na detalu i karta
na `/projekty` tego nie odzwierciedlają, bo `HeroDevices`/`CardMedia` ignorują `bgColor`
całkowicie i zawsze renderują na jasnym `bg-surface` strony. To jest dokładnie problem, który
opisał właściciel — dane do różnicowania **już istnieją**, tylko nie są podłączone do
najważniejszych dwóch miejsc (kartа + hero detalu).

---

## 5. Warianty layoutu detalu — propozycja (3 warianty, bez chaosu)

Dziś jest 1,5 wariantu (DeviceDuo dla 9, PhoneFrame dla 1). Propozycja: 3 warianty, przypisane
świadomie per charakter produktu, nie losowo:

### Wariant A — „DeviceDuo jasny" (obecny, zostaje bez zmian)
BrowserFrame + telefon zachodzący z prawej, na jasnym tle strony. **Zostaje dla projektów,
których prawdziwa siła jest w tym, że to uczciwie pokazana, realna, jasna strona klienta** —
nie ma sensu jej „przyciemniać" sztucznie, bo autentyczność (·„każdy projekt możesz kliknąć
i sprawdzić") jest tu wartością.
- **WKS Poznań** — realna strona klubu, zostaje jasna.
- **Skup Nieruchomości** — realny lejek konwersji, zostaje jasny.
- **Domki Poznaniak** — realna strona klienta (WordPress), zostaje jak jest (zdjęciowa, już odmienna od reszty).
- **W. Safe Finance** — zostaje (realny zrzut już jest ciemny, więc wariant A tu wygląda inaczej niż u pozostałych „jasnych" — nic nie trzeba zmieniać).

### Wariant B — „Ciemny kanwas pełnoekranowy" (nowy, do zbudowania)
Sekcja hero wyłamuje się z jasnego tła strony: `background: project.bgColor` na pełną
szerokość (edge-to-edge, poza `max-w-[1200px]`), tekst i badge w jasnym kolorze, `BrowserFrame`
z przyciemnioną belką chrome, `accentColor` jako kolor linku/przycisku zamiast domyślnej
zieleni marki Programo. Dokładnie ten wzorzec, którego dziś używa `pooltimer-cockpit`
i `estalo-enterprise` jako surowe zrzuty — wariant B tylko dodaje im właściwą oprawę.
- **PoolTimer** — hero = `pooltimer-cockpit-desktop.webp`, tło sekcji `#07172d`, akcent `#0b59db`. To jest **najpilniejsza zmiana z briefu właściciela**.
- **Estalo** — hero = `estalo-enterprise-desktop.webp` (lub mozaika, patrz Wariant D), tło `#1a1a1a`, akcent `#c8a951`.
- **ePortal Prawny** — tło `#14120c`, akcent `#b8a06a`; że nie ma osobnego ciemnego zrzutu, zrzut light unosi się na ciemnym tle jak w prezentacjach Apple (karta z cieniem na ciemnym tle) — sam kontrast tła już różnicuje od Estalo/Rejestr Pro.
- **Rejestr Pro** — tło `#0a1a24`, akcent `#0ea5e9`. Neo-brutalny jasny zrzut na granatowym tle wygląda zupełnie inaczej niż ten sam zrzut na jasnym tle (dziś myli się z Solvio).
- **Solvio** — tło `#0f1730`, akcent `#5b8def`. Różni się od Rejestr Pro odcieniem granatu i innym akcentem — dwa projekty przestają być parą-klonem.

### Wariant C — „Rząd telefonów" (obecny dla Jedmara, gotowy do reużycia)
`PhoneFrame` ×3 w rzędzie, bez `BrowserFrame` w ogóle — dla produktów, których prawda
produktowa jest mobile-first.
- **Jedmar** — zostaje.
- **Solvio (docelowo)** — flagowana jako **luka contentowa, nie kodowa**: opis projektu wprost mówi „Główną platformą jest natywna aplikacja iOS", ale w `screenshots` nie ma ani jednego realnego zrzutu ekranu iOS (tylko `solvio-desktop.webp` / `solvio-mobile.webp`, oba to strona web). Gdy PBDevs dostarczy realne zrzuty aplikacji, Solvio powinno przejść na Wariant C — to naprawi zarówno duplikat z Rejestr Pro, jak i niezgodność „mobile-first produkt pokazywany jako strona web".

### Wariant D — „Mozaika 2 zrzutów" (nowy, dla multi-surface produktów)
Zamiast jednego `BrowserFrame` + telefon, dwa `BrowserFrame` obok siebie (desktop główny
produkt + desktop drugiego surface'u), oba na tle `bgColor`. Pokazuje zakres bez powtarzania
kompozycji telefonu.
- **Estalo** — CRM (`estalo-desktop.webp`, jasny) + Portal ogłoszeń (`estalo-portal-desktop.webp`, jasny) **albo** CRM + Enterprise dashboard (ciemny) — do wyboru z właścicielem, obie kombinacje już istnieją jako assety.
- **Jedmar** (opcjonalnie, drugorzędne) — dziś już ma dobrą galerię (`jedmar-schemat-tool-desktop.webp` jako osobny sub-produkt), można rozważyć mozaikę schemat+app zamiast obecnego pojedynczego wpisu w Galerii — niski priorytet, bo Jedmar już jest najbardziej odmienny w zestawie.

---

## 6. Plan różnicowania — tabela decyzyjna per projekt

| Projekt | Karta `/projekty` (dziś) | Karta — zmiana | Hero detalu (dziś) | Hero — zmiana | Wariant | Akcent na ciemnym tle |
|---|---|---|---|---|---|---|
| Jedmar | `jedmar-app-home.webp`, PhoneFrame | brak zmian | PhoneFrame ×3 | brak zmian | C | `#ffd333` |
| Estalo | `estalo-desktop.webp` (jasny) | dodać `estalo-enterprise-desktop.webp` jako 2. zrzut w mozaice | DeviceDuo jasny | Mozaika ciemna (CRM+Enterprise lub CRM+Portal) | D lub B | `#c8a951` na `#1a1a1a` |
| ePortal Prawny | `eportalprawny-desktop.webp` (jasny) | bez zmiany zrzutu, zmiana oprawy | DeviceDuo jasny | Ciemny kanwas, zrzut light „unoszący się" | B | `#b8a06a` na `#14120c` |
| WKS Poznań | `wks-desktop.webp` | bez zmian | DeviceDuo jasny | bez zmian (uczciwa realna strona) | A | `#c41e3a` |
| Skup Nieruchomości | `skup-desktop.webp` | bez zmian | DeviceDuo jasny | bez zmian; dodać `skup-spadek-desktop.webp` do Galerii | A | `#3f8f5f` |
| Rejestr Pro | `rejestr-pro-desktop.webp` | bez zmian | DeviceDuo jasny | Ciemny kanwas | B | `#0ea5e9` na `#0a1a24` |
| Solvio | `solvio-desktop.webp` | bez zmian (do czasu realnych zrzutów iOS) | DeviceDuo jasny | Ciemny kanwas (na razie); docelowo Wariant C po dostarczeniu zrzutów iOS | B → C (docelowo) | `#5b8def` na `#0f1730` |
| W. Safe Finance | `wsafefinanse-desktop.webp` (już ciemny) | bez zmian | DeviceDuo ciemny (naturalnie) | bez zmian | A | `#2563eb` |
| Domki Poznaniak | `domki-poznaniak-desktop.webp` (zdjęciowy) | bez zmian | DeviceDuo zdjęciowy | bez zmian | A | `#d97706` |
| **PoolTimer** | `pooltimer-desktop.webp` (landing jasny) | **→ `pooltimer-cockpit-desktop.webp`** | DeviceDuo jasny landing | **→ Ciemny kanwas z `pooltimer-cockpit-desktop.webp`** | **B** | `#0b59db` na `#07172d` |

Po zmianie: karty na `/projekty` będą wyglądać jak **3 grupy wizualne zamiast 1** —
jasne realne strony klientów (WKS, Skup, Domki, ~połowa jasności), ciemne dashboardy produktowe
(Estalo, ePortal Prawny, Rejestr Pro, Solvio, PoolTimer, W. Safe Finance) i telefony (Jedmar) —
zamiast dzisiejszych 9 niemal identycznych jasnych ramek przeglądarki + 1 telefonu.

---

## 7. Co dokładnie trzeba zmienić w kodzie (do wdrożenia, nie zrobione w tym audycie)

Zgodnie z poleceniem — **nie modyfikowałem żadnych plików**. Do wdrożenia w osobnym zadaniu:

1. `src/lib/projects.ts` — PoolTimer: dodać `pooltimer-cockpit-desktop.webp` na początek `screenshots` (linia ok. 756); rozważyć analogicznie dla Estalo (`estalo-enterprise-desktop.webp`, linia ok. 228).
2. `src/app/projects/[slug]/ProjectDetailClient.tsx` — `HeroDevices` (linie 42-98): dodać rozgałęzienie na wariant „ciemny kanwas" (np. nowe pole `Project.heroVariant?: "light" | "dark-canvas" | "phone-row" | "mosaic"` w `projects.ts`, domyślnie `"light"`), owinięcie sekcji hero (linia ok. 169) w `style={{ background: project.bgColor }}` gdy `heroVariant === "dark-canvas"`, plus jasny wariant tekstu (dziś `text-on-surface` zakłada jasne tło).
3. `src/components/featured-work.tsx` — `CardMedia` (linie 44-70): analogicznie, tło kontenera karty `#surface-container-high` zamienić na `project.bgColor` gdy projekt ma `heroVariant !== "light"`, żeby siatka na `/projekty` też pokazywała 3 grupy kolorystyczne, nie tylko detal.
4. Duplikaty assetów do porządkowania (poza zakresem tego audytu, ale warto osobnym zadaniem): `eportalprawny-*.webp` vs `eportal-prawny-*.webp`, `wks-desktop.webp` vs `wks-poznan-desktop.webp`, `skup-desktop.webp` vs `skup-nieruchomosci-desktop.webp`, `jedmar-desktop/shop-desktop` vs `jedmar-schemat-tool-desktop` — dwa źródła prawdy dla tych samych zrzutów (`portfolio-grid.tsx` na homepage używa starych nazw, `projects.ts`/detal używa nowych). Ryzyko: podmiana pliku w jednym miejscu nie propaguje się na homepage.

---

## Podsumowanie

- **7/10** hero na `/projects/[slug]` to jasny landing z wielkim nagłówkiem w identycznym
  komponencie `DeviceDuo` — potwierdza to obserwację właściciela.
- **9/10** kart na `/projekty` używa tego samego komponentu `BrowserFrame` bez żadnego
  udziału `bgColor`/`accentColor` w tle karty — mimo że te pola już istnieją w danych i są
  unikalne per projekt.
- Rozwiązanie nie wymaga nowej sesji fotograficznej dla PoolTimer i Estalo — assety
  (`pooltimer-cockpit-desktop.webp`, `estalo-enterprise-desktop.webp`, `estalo-portal-desktop.webp`)
  już są w `public/screenshots/v2/` i nieużywane.
- Najbliższe klony do rozbicia w pierwszej kolejności: **Estalo ↔ ePortal Prawny** oraz
  **Rejestr Pro ↔ Solvio** — obie pary rozwiązuje Wariant B (ciemny kanwas z `bgColor`/`accentColor`
  per projekt), bez zmiany treści ani metryk.
- PoolTimer — zmiana zrzutu na `pooltimer-cockpit-desktop.webp` + Wariant B to bezpośrednia
  realizacja prośby „pokaż ładniej, nie jako landing".

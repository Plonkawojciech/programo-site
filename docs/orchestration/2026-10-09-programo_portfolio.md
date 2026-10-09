# Portfolio klientów: źródła i checkpoint 9.10.2026

Zakres: opisy Jedmara, INNOCHEM, Terapii Dens i Underwater.pl na stronie Programo. Zmiana dotyczy treści portfolio i jego widocznych statusów. Zachowuje układ v3, PL/EN i renderowanie tekstu na serwerze. Integrację oraz wdrożenie podglądu prowadzi root; ta gałąź nie zmienia produkcji ani DNS.

## Decyzje redakcyjne

Jedmar ma opublikowane aplikacje, a istniejący sklep PrestaShop pozostaje poza przypisywanym nam autorstwem. INNOCHEM, Terapia Dens i Underwater.pl opisujemy jako realizacje na podglądzie. Podgląd nie dowodzi odbioru klienta, uruchomienia sprzedaży, wysłania wiadomości ani rozliczenia płatności.

Usunięto zdanie strony głównej przypisujące wszystkim realizacjom działanie na produkcji. Opis Jedmara nie zawiera już zmiennych liczb katalogu, schematów i testów, gwarancji sześciu czynnych operatorów ani twierdzenia, że każdą część schematu można kupić. Nie dodano opinii klientów ani wyników sprzedaży.

Underwater ma publiczny opis projektu, ale nie ma przycisku prowadzącego do prywatnego, chronionego podglądu. Opis wskazuje testowy adapter płatności i dane wymagające uzgodnienia przed migracją.

## Mapa twierdzeń i źródeł

Identyfikatory plików poniżej odnoszą się do źródłowych repozytoriów. Mapa podaje wyłącznie fakty potrzebne do portfolio, bez treści korespondencji, danych osób kontaktowych i konfiguracji dostępu.

| Projekt / twierdzenie publiczne | Źródło | Co źródło potwierdza i czego nie dowodzi |
|---|---|---|
| Jedmar: aplikacje iOS i Android, autorstwo Programo | `jedmar/CLAUDE.md`, `native-ios/project.yml`, `native-android/app/build.gradle.kts`; publiczne [App Store](https://apps.apple.com/pl/app/jedmar-sklep-narz%C4%99dziowy/id6766802330) i [Google Play](https://play.google.com/store/apps/details?id=pl.jedmar.shop), odczyt 9.10.2026 | Natywne platformy i publiczna publikacja. Karta sklepu nie potwierdza obecnego działania każdego operatora płatności lub dostarczenia push. |
| Jedmar: istniejący PrestaShop, warstwa API i zakres aplikacji | `jedmar/CLAUDE.md`; `native-ios/Jedmar/Features/{Checkout,Scanner,Schematics}/`; `native-android/app/src/main/java/pl/jedmar/shop/feature/{checkout,scanner,schematics}/` | Kod katalogu, wariantów, koszyka, zamówień, skanera i schematów. Nie oznacza wykonania starego jedmar.pl. Repo źródłowe odczytano na `48171172a4a2b9f53de4b65024535891d58eda28`. |
| Jedmar: części powiązane z katalogiem można dodać do koszyka | `jedmar/apps/web/src/app/api/schematics/tools/route.ts`, modele i widoki schematów; publiczny [moduł schematów](https://jedmar.pl/pl/schematy-narzedzi) i [dane modułu](https://jedmar.pl/modules/jedmarschemat/data/tools.json), odczyt 9.10.2026 | API uzupełnia powiązania według kodu producenta, pomijając niejednoznaczny produkt z wariantami. Nie każda część ma powiązanie. Odczyt strony dał HTTP 200; nie wykonano zakupu. |
| INNOCHEM: następca WordPressa i PrestaShop, katalog, konto, zamówienie bez konta, panel, dokumenty i przekierowania | `innochem-demo/CLAUDE.md`, `docs/start-2026-10-09.md`, `docs/panel-guide.md`, `docs/handoff/instrukcja-panelu-innochem.md` | Zakres wdrożenia i instrukcja obsługi. Plan startu opisuje osobne warunki i odbiór; jego harmonogram nie dowodzi ich wykonania. |
| INNOCHEM: podgląd przed uruchomieniem domeny klienta | `innochem-demo/docs/start-2026-10-09.md`; raport bazowy Programo `docs/raporty/2026-10-09-v3-podglad.md` | Podgląd i kroki wymagane przed cutoverem. Nie przypisujemy mu produkcyjnej sprzedaży lub potwierdzonego działania wszystkich kanałów wiadomości. |
| Terapia Dens: dwie placówki, cennik z wyszukiwaniem i filtrem, dwa kierunki wizualne | `terapiadens-demo/README.md`, `docs/evidence/2026-09-29-wersja-koncowa.md`, `content/cennik.json` | Zakres i funkcje strony. Przypisanie cen do placówek oraz wybór wersji wymagają potwierdzenia klienta. Repo źródłowe odczytano na `ca43d49d74a8cb706e15b48e9ab4161cccdd2914`. |
| Terapia Dens: telefoniczna lub osobista rejestracja, podgląd przed domeną klienta | `terapiadens-demo/README.md`, `docs/evidence/2026-09-29-wersja-koncowa.md` | Brak formularza rejestracji w aktualnym zakresie; podgląd oraz lista warunków publikacji. Nie deklarujemy uruchomienia na terapiadens.pl. |
| Underwater: katalog, warianty, kursy i terminy, kalendarz, CMS z rolami | `underwater-demo/CLAUDE.md`, `docs/implementation/client-cms-guide.md`, `docs/implementation/2026-10-08-checkpoint.md` | Zbudowane przepływy i instrukcja CMS. Operacje zamówienia, zapisu i płatności mają dowody testowe na własnej kopii. |
| Underwater: import źródła do własnej kopii, podgląd prywatny, migracja i operator płatności później | `underwater-demo/docs/implementation/rano-dla-wojtka.md`, aktualizacja 9.10.2026; `CLAUDE.md` | Stan własnego podglądu, brak bieżącego eksportu źródłowej bazy i wybranego operatora. Nie deklarujemy pełnej migracji lub odbioru klienta. |

Odczyt publicznych danych Jedmara 9.10 wykazał 48 narzędzi, 4526 rekordów części, 4922 współrzędne markerów i 137 części z ręcznym `pid`. Te jednostki mają różne znaczenia. Zastane liczby 73 / około 7500 nie odpowiadały temu źródłu; nie zastąpiono ich nową zmienną obietnicą w portfolio.

## Obrazy

INNOCHEM, Terapia Dens i Jedmar zachowują istniejące zrzuty z bazowego podglądu v3. Underwater otrzymał obejrzany zrzut strony głównej z rundy QA 9.10 (`v12-home-desktop.png`), przekazany przez root. Pokazuje podgląd, bez danych osobowych i bez zasłaniającego dialogu. Materiał mobilny z dialogiem zgody oraz zrzut kategorii z fiksturami `TEST QA` odrzucono. Karuzela i detal korzystają z rzeczywistego zrzutu desktop; osobnej klatki mobilnej nie symulowano.

Konwersja do `public/screenshots/v2/underwater-desktop.webp` zachowała 1440 × 900 px, bez retuszu treści; plik ma 62 216 B. Obejrzano również wynik WebP. SHA256 oryginału: `bc802a4aa8209c2b88edbaabf5e66e894a0204076316ed1349f139c3dbf33831`; SHA256 WebP: `f0aaecd467926cc77abfaa464f7d3757e0a61c6a48e8b2935f064d54ea243656`. Zdjęcie hero jest elementem przygotowanego projektu; `underwater-demo/CLAUDE.md` wskazuje generowanie scen przez Codex, nie zdjęcie centrum ani klienta.

## Odczyt korespondencji

Nie uzyskano autoryzowanego odczytu treści skrzynek CRM. Dostępne endpointy wiadomości odnoszą się do kampanii, a nie do Inbox; root nie potwierdził dostępnego API skrzynki. Nie obchodzono tej granicy innym kluczem, bazą ani przeglądarką. Publiczne twierdzenia opierają się na wskazanych źródłach repozytoriów i kartach aplikacji. Potwierdzenie odbioru klienta pozostaje poza dowodem tej zmiany.

## Weryfikacja i stan Git

Na wejściu gałąź `orchestrator/20261009-programo_portfolio` była czysta, z bazą v3 zintegrowaną przez root. Pierwotny symlink zależności wskazywał Next 16.1.6 przy wymaganym 16.4.0. Po uzgodnieniu z root przestawiono wyłącznie symlink tej gałęzi na istniejące zgodne zależności v3; współdzielonych zależności nie zmieniano.

Zmiany obejmują `src/lib/projects.ts`, wyłącznie projektowe klucze `src/lib/i18n/dictionaries/home.ts`, statusy `src/components/case-studies.tsx`, czwartą kartę `src/components/home/client-work.tsx`, listę nazw w `src/app/page.tsx`, zrzut Underwater oraz testy portfolio. Słowniki usług oraz cen pozostają własnością drugiego wykonawcy.

Testy wymagane: build podglądu, osobny typecheck, Vitest i lint przez wrapper `heavy`. Root polecił wykonać pełny build raz po integracji usług i portfolio. Nowe kontrole wymagają widocznego statusu oraz wszystkich akapitów czterech realizacji w wygenerowanym HTML; sprawdzają też oddzielenie prywatnego podglądu od projektów uruchomionych i obecność plików źródłowych zrzutów.

Na polecenie root commit kandydata pomija lokalny hook jednorazowym `git -c core.hooksPath=/dev/null commit`: hook uruchamia pełne tsc i lint poza wspólnym wrapperem. Konfiguracji repozytorium i pliku hooka nie zmieniono. Pełny build, testy, lint i tsc po integracji pozostają obowiązkową bramką root przed push i deploy.

Potwierdzone wyniki:

- `heavy npx tsc --noEmit`: PASS, exit 0, zgodne zależności Next 16.4.0.
- `heavy npx vitest run src/__tests__/i18n.test.ts src/__tests__/components/featured-work.test.tsx`: 24/24 PASS, dwa pliki, exit 0.
- Optymalizacja oraz odczyt wyniku WebP: PASS; parametry i hashe powyżej.
- `git diff --check`: PASS. Publiczne karty Apple i Google dały bezpośrednio HTTP 200 i treść Jedmara; moduł schematów dał HTTP 200 i poprawne JSON.
- Lint zakresu oraz `projects.test.ts` / `ssr-content.test.ts`: **NOT RUN, deferred root**. Wrappery czekały w kolejce bez procesu testów. Root polecił anulować tylko te własne oczekujące procesy i wykonać jedną pełną bramkę po integracji. Nowe kontrole HTML nie mają jeszcze wyniku.

Daty `updatedAt` czterech wpisów zostają wyprowadzone z czasu commita tej zmiany. Nie pochodzą z czasu buildu.

Nie uruchomiono serwera, przeglądarki ani procesu deploy. Własne oczekujące wrappery zakończono; cudzych slotów i procesów nie zmieniono. Własny plik przyrostowego typechecku usunięto, zachowując zrzut i wynik pracy. Następny krok: integracja i niezależny review root, pełny build/TC/Vitest/lint, sprawdzenie widocznej treści i noindex w realnym podglądzie Programo, następnie odbiór Wojtka.

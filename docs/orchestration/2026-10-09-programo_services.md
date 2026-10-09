# Programo v3: usługi i zgodność z cennikiem

Cel: sprawdzić wszystkie publiczne stawki usług, terminy, abonamenty i opisy AI względem firmowego cennika, zachowując układ v3 i obecny sposób renderowania. Wynik przygotowano do integracji i odbioru; nie oznacza akceptacji publicznych cen przez Wojtka.

Baza: `078477b`, podgląd v3 opisany w [raporcie z 9.10](../raporty/2026-10-09-v3-podglad.md). Prace wyłącznie w osobnym worktree `programo_services`. Źródło odczytane 9.10.2026: `/Users/wojciechplonka/Programo/marketing/FIRMA/sprzedaz/cennik.md`, SHA256 `60c3c6c639601d3736d61d2be7b28514d2711d74399e0d6630630c0a636f5821`.

## Mapa źródła

W tabeli publicznej dolna kwota odpowiada kolumnie Standard, górna Rozszerzony. Nie zmieniono żadnej z 13 par kwot; wszystkie zgadzały się już w bazie v3. Nie przeliczano ani nie publikowano Start, ponieważ firmowy dokument zastrzega go do indywidualnej sprzedaży i wskazuje nieprzeliczone pozycje.

| Pozycja źródła | Standard–Rozszerzony, netto | Termin źródła | Publiczne miejsca |
|---|---:|---|---|
| Strona internetowa | 2 000–6 000 zł | 5 dni–2 tyg. | `/cennik`, homepage, `/strony-internetowe-poznan` |
| Sklep Woo / Shopify | 4 000–8 000 zł | 3 tyg. | `/cennik`, homepage, `/strony-internetowe-poznan` |
| Sklep na własnym silniku | 6 000–10 000 zł | 6 tyg. | `/cennik`, FAQ homepage |
| System / aplikacja webowa | 4 000–8 000 zł | od 4 tyg. | `/cennik`, homepage, `/aplikacje-webowe-dla-firm` |
| Aplikacja mobilna iOS+Android | 4 000–8 000 zł | 6 tyg. | `/cennik`, homepage, `/aplikacje-mobilne-dla-firm` |
| Opieka nad stroną | 300–600 zł/mies. | współpraca miesięczna | `/cennik`, `/strony-internetowe-poznan` |
| Opieka nad sklepem / systemem | 800–1 500 zł/mies. | współpraca miesięczna | `/cennik`, landing web, landing mobile |
| SEO, Google Ads, GA4 + GTM | 150–300 zł/mies. | współpraca miesięczna | `/cennik`, `/wdrozenie-ga4-tracking-konwersji` |
| Audyt procesów | 1 500–6 000 zł | 1 tydz. | `/cennik`, landing web |
| Automatyzacja procesu | 1 500–6 000 zł | 2–4 tyg. | `/cennik`, homepage, landing web |
| Asystent na danych firmy | 2 000–4 000 zł | 3–6 tyg. | `/cennik` |
| Szkolenie zespołu | 4 000–8 000 zł | 1 dzień | `/cennik` |
| Opieka po wdrożeniu AI | 500–2 000 zł | brak terminu (`—`) | `/cennik`; baza v3 pokazuje miesięcznie, do akceptacji |

`/ile-kosztuje-aplikacji` i trzy artykuły cenowe pokazują terminy lub odsyłają do `/cennik`. `/oferta`, `/strony-internetowe`, `/sklepy-internetowe`, `/software-house-poznan` oraz `/strony-tracking-reklamy` nie podają dodatkowych kwot Programo. Przejrzano także metadata, widoczne FAQ i powstające z nich JSON-LD. Publiczny cennik nie nadaje każdej kwocie konkretnego limitu ekranów, integracji ani godzin; nie dopisano takich limitów. Odpowiedź w 24 h to odrębna zasada treści z repo `CLAUDE.md`, a nie termin wykonania z firmowego cennika.

## Zmiany

Landingi z cenami otrzymały lokalne warunki opieki, kosztów usług zewnętrznych i zmian zakresu. Limit godzin dotyczy każdego abonamentu, zgodnie z sekcją Zasady źródła. Landing GA4 powtarza także źródłową regułę Google Ads: powyżej 10 000 zł budżetu miesięcznego stawka wynosi 10% wydatku zamiast kwoty z tabeli. Jednorazowy pomiar nadal wymaga wyceny; nie zamieniono 150 zł/mies. w cenę jednorazowego wdrożenia.

Termin aplikacji webowej w opisie i FAQ zmieniono z „około 4 tygodnie” na „od 4 tygodni”. Usunięto nieźródłowe 4–8 tygodni dla MVP i 4–6 tygodni dla rozbudowanej strony. Nie przypisujemy wszystkim panelom CMS ani integracjom sztywnego terminu. W artykułach sklep i aplikacja iOS+Android odpowiadają terminom źródła, a rozbudowane zakresy mają termin ustalany przy wycenie. Źródło nie mówi o dniach roboczych; landing Poznań używa teraz tych samych 5 dni co cennik.

Oferta pokazuje przykładowy zakres, aby lista funkcji nie sugerowała, że wszystko zawiera się w każdym poziomie ceny. Aktualizacje po premierze i opieka AI odnoszą się do uzgodnionego abonamentu. Usunięto obietnicę „bariery przeciw halucynacjom”, gwarancję zachowania pozycji Google i pełnego zliczania każdego telefonu/formularza. Tracking opisuje zdarzenia kliknięcia w numer oraz formularza, z uwzględnieniem zgód i dostępnych danych. Consent Mode pozostaje konkretnym elementem wdrożenia, bez sugerowania, że sam gwarantuje zgodność całego pomiaru z RODO. Nie zmieniono działania tagów, zgód ani formularzy. Czwarty artykuł, porównujący Next.js z WordPressem, nie obiecuje już niższych kosztów utrzymania Next.js ani samego hostingu zamiast opieki. FAQ o migracji tego artykułu także opisuje plan i ograniczenie ryzyka zamiast gwarancji zachowania pozycji. Oba warianty odsyłają do uzgodnionego zakresu aktualizacji i limitu godzin w umowie; pozostałe porównanie technologii i historyczne źródła artykułu pozostają poza tą korektą.

## Koszty operatorów

Sprawdzono 9.10.2026 oficjalne źródła, bez zakupu i logowania:

- [Polski cennik Shopify](https://www.shopify.com/pl/pricing) potwierdza Basic 79 zł/mies. przy rozliczeniu rocznym i 109 przy miesięcznym oraz Grow 239/319 zł. Liczby zachowano, dodając datę i warunki dostawcy.
- [WooCommerce](https://woocommerce.com/pricing/) podaje orientacyjne USD 25–350/mies. za hosting i 29–299/rok za rozszerzenie. Artykuł oznacza je jako szacunki producenta. Usunięto ogólną prowizję WooPayments 2,5–2,9% + 30 centów, ponieważ [oficjalny cennik WooPayments](https://woocommerce.com/document/woopayments/fees/) rozróżnia kraje i metody płatności. Nie zastąpiono jej nową „uniwersalną” stawką.
- [Apple](https://developer.apple.com/programs/enroll/) podaje 99 USD za rok oraz zastrzega cenę lokalną i różnice regionalne. [Google Play](https://support.google.com/googleplay/android-developer/answer/6112435) podaje jednorazowe 25 USD. Artykuł rozdziela te opłaty od pracy Programo i wskazuje datę sprawdzenia.

## Decyzje właściciela

Publiczny cennik nadal wymaga odbioru Wojtka, szczególnie 150–300 zł/mies. za SEO/Ads/GA4/GTM. Nie poprawiono tych kwot według własnej oceny. Źródło wymaga limitu godzin w umowach, ale nie podaje liczby godzin, czasu reakcji serwisowej, SLA ani podziału zadań między poziomy Standard i Rozszerzony; te warunki musi rozstrzygnąć oferta/umowa.

Kwoty netto i reguła Ads pochodzą bezpośrednio ze źródła. Stawka 23% VAT, rozliczanie kosztów zewnętrznych i wycena zmian zakresu są warunkami istniejącego podglądu v3, opisanymi w raporcie z 9.10, a nie dodatkowymi wierszami firmowego cennika. Rozprowadzono je spójnie między landingami; nie deklarujemy potwierdzenia podatkowego każdej sytuacji klienta. Miesięczne rozliczanie opieki AI to także interpretacja obecnej bazy v3, ponieważ źródło w jej terminie podaje tylko `—`; pozostaje do publicznej akceptacji.

Stan i liczby projektów w przykładach, obietnica bezpłatnego demo, własność kodu oraz program poleceń `/wspolpraca` mają odrębne źródła i odbiór; nie zmieniano ich w tej pracy. Homepage zachowuje prawidłowe kwoty i terminy; jego ogólna odpowiedź o utrzymaniu nie podaje limitu, więc umowa i pełny cennik nadal rozstrzygają zakres.

## Weryfikacja i checkpoint

Sprawdzono zgodność lockfile i współdzielonych zależności: początkowy symlink miał Next 16.1.6 przy wymaganym 16.4.0. Build pozostawał w kolejce wrappera; zatrzymano własny PID 75413, kod 143, bez uruchomienia kompilacji. Koordynator udostępnił zgodne `/Volumes/Mad Dog/Archive/Programo/programo-site-v3-ready-20261009/node_modules`; przepięto wyłącznie lokalny symlink. Next 16.4.0, React 19.2.3 i Vitest 4.1.0 odpowiadają lockfile. Nie instalowano ani nie zmieniano współdzielonych zależności.

Dodano dwa sprawdzenia cennika: wszystkie 13 pozycji i warunki w serwerowym HTML oraz kwoty, terminy i warunki po zmianie języka na EN. Nie zmieniano mechanizmu renderowania ani parytetu kluczy. Koordynator zlecił w tym worktree dwa nowe testy i osobny typecheck; pełny build, komplet testów i lint wykona raz po połączeniu zmian usług oraz portfolio. Nie zgłaszamy osobnego pełnego builda tej gałęzi. Wspólny pre-commit uruchamia tsc i lint poza wrapperem, więc koordynator zlecił jednorazowy commit kandydata przez `git -c core.hooksPath=/dev/null commit` po kontroli źródła, diffa i linków, z testami odroczonymi do integracji. Nie zmieniamy konfiguracji ani samego hooka; pełna bramka integracji pozostaje obowiązkowa przed push i deploy.

QA statyczne PASS: `git diff --check`, 19 lokalnych linków bez brakujących plików/trasy (dynamiczne linki blog/projekt zachowują istniejące trasy), cztery pola answer 51/54/50/49 słów w kontrakcie 40–60. Oficjalne koszty operatorów i 13 par kwot/terminów sprawdzono według mapy źródła.

Dwa nowe testy oraz osobny typecheck: **NOT RUN w tym worktree, odroczone do root finalgate**. Wrapper `heavy sh -c 'npx vitest run src/__tests__/components/pricing.test.tsx -t "published pricing source and conditions" && npx tsc --noEmit'` oczekiwał w kolejce i nie rozpoczął testów. Koordynator zmienił warunek commitu kandydata na wspólną weryfikację po integracji. Po sprawdzeniu, że jedynym childem był `sleep 5`, anulowano własny PID 87629 (exit 143); pusty log jest w ignorowanym `.vercel/orchestration-services/scoped-gate.log`. Root musi wykonać build → typecheck → cały Vitest (w tym oba nowe testy) → lint przed main, push i deploy. Ten commit nie daje zgody na produkcję.

Zmiany obejmują siedem stron usług/wyceny, trzy słowniki i18n, cztery artykuły MDX, test komponentu cennika i ten raport. Stan Git: wyłącznie pliki tego zadania; baza `078477b`. Następny krok: przekazanie SHA koordynatorowi i reviewerowi, pełna bramka integracji oraz test na wspólnym podglądzie. Nie uruchomiono własnego serwera, przeglądarki, deployu ani zewnętrznego zapisu. Nie ma dowodu odbioru użytkownika ani działania tych zmian na `v3.programo.pl`.

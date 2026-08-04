# Analityka programo.pl — jak z tego korzystać

Instrukcja robocza, nie dokumentacja techniczną. Co gdzie oglądać, co z tym robić
i czego nie robić. Techniczne „jak to działa" jest w
`docs/plans/tracking-seo-geo-2026-08.md`.

Punkt wyjścia, o którym trzeba pamiętać przy każdej liczbie poniżej: **kilkaset
sesji miesięcznie i ~12 leadów**. Przy tej skali statystyka jest bezużyteczna, a
lektura pojedynczych przypadków — nie. To zmienia wszystko: nie budujemy
dashboardów do patrzenia na trendy, tylko narzędzia do czytania konkretnych wizyt.

---

## 1. Gdzie czego szukać

Cztery miejsca, każde odpowiada na inne pytanie. Mieszanie ich to najczęstszy
sposób na wyciągnięcie fałszywego wniosku.

| Pytanie | Gdzie | Dlaczego tam |
|---|---|---|
| **Kto konkretnie u nas był i co robił** | `/crm/analytics` | jedyne miejsce z pełną ścieżką pojedynczej sesji |
| **Dlaczego ktoś nie wypełnił formularza** | Microsoft Clarity (nagrania) | widać ruch myszy, wahanie, miejsce porzucenia |
| **Które pole formularza nas kosztuje leady** | `/crm/analytics` → lejek | mediany czasu, pominięcia i błędy per pole |
| **Ile kosztuje lead i z jakiej kampanii** | Google Ads | tylko tam jest koszt |
| **Czy AI nas czyta i czy z tego jest ruch** | `/crm/analytics` → crawlery AI | GA4 i Clarity nie widzą botów, bo te nie wykonują JS |
| **Jakie frazy nas znajdują** | Search Console | GA4 tego nie ma |
| **Czy strona jest szybka u realnych ludzi** | `/crm/analytics` → Web Vitals | rozkład good/poor, nie średnia |
| **Trend miesiąc do miesiąca** | GA4 | jedyne z dłuższą historią i porównaniami |

**Czego NIE robić:** nie porównywać liczb między GA4 a `/crm/analytics`, oczekując
zgodności. GA4 gubi ruch przez adblocki i stosuje progi agregacji przy małych
liczbach; nasz magazyn zapisuje tylko osoby, które zgodziły się na analitykę.
Obie liczby są zaniżone, każda inaczej. Do porównań używaj **jednego** źródła
konsekwentnie.

Jedno porównanie jest jednak obowiązkowe — patrz rytuał tygodniowy, punkt 1.

---

## 2. Rytuał tygodniowy — 30 minut, poniedziałek

Kolejność ma znaczenie: od „czy w ogóle działa" do „co poprawić".

### 1. Sanity check (2 min) — czy tracking nie umarł

Porównaj liczbę leadów w `/crm` z liczbą `generate_lead` w GA4 za ten sam
tydzień. **Nie muszą być równe** (adblocki), ale muszą być tego samego rzędu.

- CRM ma leady, GA4 pokazuje zero → tracking padł. Sprawdź konsolę na
  `/kontakt`, potem `form_submit_failed` w `/crm/analytics`.
- GA4 ma konwersje, CRM jest pusty → backend padł. To jest wariant droższy:
  ludzie wysyłają formularz, my nie dostajemy zgłoszeń.

Ten jeden punkt jest ważniejszy niż cała reszta instrukcji. Przy 12 leadach
miesięcznie zepsuty tydzień to jedna czwarta kwartału i **wygląda dokładnie jak
słabszy tydzień**.

### 2. `/crm/analytics` → lista sesji (10 min) — przeczytaj, nie analizuj

Przy tym ruchu to jest kilkadziesiąt wierszy. Przeczytaj je. Serio.

Czego szukać:
- sesje zakończone `generate_lead` — **skąd przyszły** i co czytały przed
  wysłaniem. To jest Twój profil dobrego leada;
- sesje z `form_start` bez `generate_lead` — otwórz je, zobacz na którym polu się
  zatrzymały;
- sesje z `rage_click` / `dead_click` — to konkretne miejsca do naprawy, nie
  metryka;
- sesje z `referrer_class: ai` — ktoś przyszedł z ChatGPT/Perplexity. Zobacz, o
  co pytał (wejście) i czy został.

### 3. Clarity — 10 nagrań (10 min)

Filtr: sesje z rage clicks + sesje, które zaczęły formularz i go nie wysłały.
Nie oglądaj losowych nagrań, to strata czasu.

### 4. Lejek formularza (5 min)

`/crm/analytics` → sekcja lejka. Interesują Cię dwie rzeczy:
- **pole z najwyższą liczbą `form_field_skip` i błędów** — to kandydat do
  usunięcia albo przeformułowania;
- **`form_error` z konkretnym komunikatem** — jeśli walidacja telefonu odrzuca
  numery, które ludzie uważają za poprawne, tracisz leady w sposób całkowicie
  niewidoczny w GA4.

### 5. Alerty (3 min)

Przejrzyj `js_error` i `form_submit_failed`. Zero wpisów to dobry tydzień.
Cokolwiek powtarzalnego — napraw natychmiast, to bezpośrednia strata leadów.

---

## 3. Rytuał miesięczny — 1 godzina

1. **Search Console**: które frazy rosną, na których jesteśmy na pozycjach 5-15
   (tam jeden dobry akapit daje najwięcej), które strony tracą wyświetlenia.
2. **Crawlery AI**: czy liczba wizyt `OAI-SearchBot` / `Claude-SearchBot` /
   `PerplexityBot` rośnie i **które strony czytają**. Strona, do której wracają,
   jest Twoim najlepszym materiałem — zrób więcej takich.
3. **`ai_referral`**: ilu realnych ludzi przyszło z asystentów AI. To jest jedyny
   dowód, że praca pod GEO zamienia się w ruch.
4. **Google Ads**: koszt leada per kampania. Wyłącz to, co nie dowozi — ale
   **decyzję o włączaniu i budżetach podejmujesz Ty ręcznie**.
5. **`language_switch`**: ile osób przełączyło na EN. To rozstrzyga otwartą
   decyzję o `/en/` (patrz plan). Zero przez trzy miesiące = wyciąć przełącznik.

---

## 4. Reguły decyzyjne

Zamiast patrzenia na wykresy — konkretne „jeśli X, to Y".

| Obserwacja | Co to znaczy | Co zrobić |
|---|---|---|
| Dużo `form_view`, mało `form_start` | Formularz odstrasza wyglądem albo długością | Zmniejsz liczbę pól, przenieś formularz wyżej |
| Dużo `form_start`, mało `submit` | Coś w środku blokuje | Otwórz lejek per pole i nagrania Clarity |
| `form_error` na jednym polu | Walidacja odrzuca poprawne dane | Poluzuj walidację, nie zmieniaj copy |
| `form_field_skip` na polu opcjonalnym | Pole nie zarabia na swoje miejsce | Usuń je |
| Wysoki `scroll_depth`, zero `cta_click` | Ludzie czytają i nie wiedzą, co dalej | CTA wyżej i wyraźniej, nie więcej CTA |
| `rage_click` w jednym miejscu | Coś wygląda na klikalne i nie jest | Zrób to klikalnym albo przestań udawać |
| `exit_intent` na konkretnej sekcji | Tam ludzie mentalnie wychodzą | Przepisz tę sekcję. **Nie pokazuj popupu** |
| `faq_open` najczęściej na pytaniu o cenę | To jest główna obiekcja | Przenieś odpowiedź wyżej, poza akordeon |
| `pricing_view` wysoki, leady niskie | Ceny odstraszają albo są niejasne | Widełki zamiast „wyceniamy indywidualnie" |
| Leady z `referrer_class: ai` | GEO działa | Więcej treści tego typu, co czytają boty |
| `contact_click` (telefon) > `generate_lead` | Ludzie wolą dzwonić | Numer wyżej, formularz krótszy |

---

## 5. Do zrobienia raz — bez tego część danych jest niewidoczna

### 5.1 GA4: zarejestruj custom dimensions

**To jest konieczne.** Parametry zdarzeń nie pojawią się w raportach GA4, dopóki
nie zostaną zarejestrowane. Bez tego widzisz, że `form_error` wystąpił, ale nie
którego pola dotyczył.

GA4 → Administracja → Definicje niestandardowe → Utwórz wymiar niestandardowy.
Zakres: **zdarzenie**. Nazwa parametru dokładnie jak w tabeli:

| Parametr | Po co |
|---|---|
| `form_id` | który formularz (hero / compact / pełny) |
| `field` | które pole przy błędzie i pominięciu |
| `section` | która sekcja przy CTA i rage click |
| `cta` / `destination` | który CTA klikają |
| `referrer_class` | direct / search / social / **ai** |
| `ai_source` | który asystent AI przysłał |
| `metric_name` / `metric_rating` | Web Vitals w rozbiciu |
| `method` | telefon czy e-mail |
| `faq_position` | która obiekcja |
| `http_status` | przy `form_submit_failed` |

Limit: 50 wymiarów event-scoped. Powyżej wystarczy.

### 5.2 GA4: wyłącz „Interakcje z formularzami"

Administracja → Strumienie danych → Ulepszone pomiary → **odznacz „Interakcje z
formularzami"**. Inaczej GA4 wysyła własne `form_start`/`form_submit` obok
naszych i lejek liczy się podwójnie.

### 5.3 GA4: oznacz zdarzenia kluczowe

`generate_lead` jako kluczowe, metoda zliczania **raz na sesję**.
Opcjonalnie `contact_click` jako drugorzędne.

### 5.4 Meta: utwórz dataset

Events Manager → Datasets → utwórz. Potem Settings → Conversions API →
Generate access token. Do Vercela:
`NEXT_PUBLIC_META_DATASET_ID` i `META_CAPI_ACCESS_TOKEN`.

Po wdrożeniu sprawdź w Test Events, czy zdarzenie `Lead` przychodzi z **dwóch
źródeł** (Browser + Server) jako jedno zdeduplikowane. Dwa osobne wpisy = `event_id`
się rozjeżdża.

**Nie ustawiaj `Contact` jako celu optymalizacji kampanii** — kliknięcie w telefon
ma tylko IP i user agent, więc match quality będzie niski i Meta będzie
optymalizować na sygnał, którego nie umie przypisać do ludzi.

### 5.5 GA4 Measurement Protocol

Administracja → Strumienie danych → Measurement Protocol API secrets → utwórz.
Do Vercela jako `GA4_API_SECRET`. Odblokowuje serwerowe `generate_lead_verified`
— potwierdzenie, że lead faktycznie doszedł, odporne na zamknięcie karty.

### 5.6 Search Console + Bing

Dodaj programo.pl jako **Domain property** (weryfikacja rekordem DNS TXT — przetrwa
zmianę hostingu). Bing: import z Search Console jednym kliknięciem.
Kody weryfikacyjne opcjonalnie do `NEXT_PUBLIC_GSC_VERIFICATION` /
`NEXT_PUBLIC_BING_VERIFICATION`.

---

## 6. Czego nie robić

- **Nie rób testów A/B.** Przy 400 sesjach miesięcznie wykrycie realistycznego
  wzrostu konwersji o 20% zajęłoby lata. Test przerwany po tygodniu z „wygraną"
  to szum, nie wynik. Zamiast tego: 5 testów użyteczności na żywych ludziach
  wykrywa ~80% problemów w jedno popołudnie.
- **Nie goń 100/100 w Lighthouse.** Strona najprawdopodobniej nie ma danych w
  CrUX przy tym ruchu, więc Core Web Vitals nie są tu czynnikiem rankingowym.
  Rób perf dla ludzi i Quality Score w Ads, nie dla Google Search.
- **Nie pokazuj popupu exit-intent.** Mierzymy `exit_intent` jako diagnostykę.
  Software house sprzedaje kompetencję; wyskakujące okienko komunikuje desperację.
- **Nie optymalizuj pod maksimum leadów.** Wąskim gardłem są dwie pary rąk, nie
  liczba zgłoszeń. Jawne widełki cenowe **obniżą** surowy współczynnik konwersji
  i to jest efekt pożądany — odfiltrują budżety 2 000 zł zanim zjedzą godzinę na
  rozmowie.
- **Nie ufaj pustej sekcji.** Jeśli coś pokazuje zero, najpierw sprawdź, czy w
  ogóle jest podpięte. Ten projekt miał już sześć zdarzeń zadeklarowanych i nigdy
  nieodpalanych — pusty raport wyglądał jak wniosek. Teraz pilnuje tego test
  (`analytics-wiring.test.ts`), ale zasada zostaje.

---

## 7. Największa dźwignia jest poza analityką

Uczciwie, na koniec: przy tym ruchu największy zwrot nie leży w optymalizacji
strony, tylko w tym, **kto na nią trafia**.

Dla marek niszowych asystenci AI cytują źródła zewnętrzne w ~95% przypadków, a
stronę marki w ~5%. Do tego strona nie ma dziś ani jednej ceny i ani jednej tabeli
porównawczej — łącznie ze stronami `/cennik` i `/ile-kosztuje-aplikacji`. Gdy
ktoś pyta asystenta „ile kosztuje sklep internetowy w Poznaniu", nie ma z
programo.pl czego zacytować.

Trzy rzeczy o większym wpływie niż cokolwiek w tym dokumencie:
1. **Realne widełki cenowe na stronie** z datą aktualizacji.
2. **Tabele porównawcze** („kiedy WooCommerce, kiedy Shopify, kiedy headless").
3. **Wzmianki poza własną domeną** — YouTube, rankingi software house'ów, case
   studies publikowane u klientów.

Analityka powie Ci, czy to zadziałało. Sama tego nie zrobi.

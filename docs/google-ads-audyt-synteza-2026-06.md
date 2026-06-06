# Google Ads — Synteza 3 audytów + master plan działania

**Kampania:** „Programo – Search – E-commerce (PL)" · **Konto:** 561-045-3845 · **Budżet:** 1000 zł/mc (33 zł/dz.)
**Status:** Wstrzymana (przed startem) · **Data syntezy:** 2026-06-06
**Źródła:** (1) audyt konfiguracyjny własny, (2) recenzja praktyka — z realnym podglądem landingów + weryfikacją faktów GA 2026, (3) audyt formalny z danymi rynkowymi CPC PL i planem 4-fazowym.

> Ten plik to konsolidacja 3 niezależnych recenzji: **co wszyscy potwierdzili**, **gdzie sobie przeczą (+ moje rozstrzygnięcie poparte kodem)**, oraz **priorytetowany plan**. Dla kolejnego agenta/Wojtka: to jest źródło prawdy dla optymalizacji tej kampanii.

---

## 0. Werdykt łączny (TL;DR)

**Konfiguracja kampanii jest bardzo dobra (A-/B+). Wąskim gardłem nie są ustawienia, tylko LEJEK (landingi + ścieżka konwersji).**
Obaj zewnętrzni recenzenci są zgodni: **NIE startować, dopóki nie naprawimy lejka.** Najpierw lejek → potem „Start".

Trzy rzeczy, które najmocniej ograniczą wynik, jeśli ich nie ruszymy:
1. **Podwójny hop do konwersji** — żaden landing nie ma formularza ani telefonu; wszystko odbija do `/kontakt`. Płacimy za pierwszy klik, a tracimy ludzi na każdym przeskoku.
2. **Grupa 2 (Strony WWW) celuje w generyczną `/oferta`** — to najdroższy ruch, a ląduje na katalogu usług bez dowodów/cen/formularza → niższy Quality Score i konwersja.
3. **Ścieżka konwersji `/audyt` jest dziurawa** (a Wojtek i tak chce ją usunąć — patrz §6).

---

## 1. Konsensus — co potwierdziły WSZYSTKIE recenzje

| Obszar | Werdykt zgodny |
|---|---|
| Ustawienia „anti-przepał" | ✅ Search-only, Display/partnerzy OFF, AI Max OFF, „Obecność" — **wszystkie poprawne** przy małym budżecie |
| Dopasowania | ✅ Phrase + Exact, zero broad — słuszne (z zastrzeżeniem o CPC) |
| Liczenie konwersji | ✅ „jedna" zamiast „każda" — poprawne dla lead-genu |
| Pomiar | ✅ Consent Mode v2 + współdzielony gtag bez dublowania — czysto |
| Struktura 3 grup | ✅ Zgodna z architekturą strony, podnosi trafność |
| **Budżet: koncentrować** | ✅ 1 kampania, 3 grupy. Dzielić = ~11 zł/dz./kampanię = bezużyteczne |
| **Brak grupy „aplikacje mobilne" na start** | ✅ CPC >30 zł, inny lejek/budżet — osobna kampania dopiero przy ~3000 zł/mc |
| **Cap CPC 5 zł = ryzyko** | ✅ Realny CPC w PL dla IT: śr. ~6,29 zł, wysoka intencja >25 zł → cap może wykluczać z aukcji G1/G2 |
| **Bez broad+Smart Bidding na tym budżecie** | ✅ Za mało danych i budżetu — zostać na phrase/exact |
| **Maks. konwersje dopiero po ~15–30 konw.** | ✅ Przy 1000 zł to **miesiące, nie tygodnie**; nie przełączać co tydzień (reset nauki) |
| **Różnicować wartość leada** | ✅ Płaskie 1,0 zł = błąd; sklep ≠ naprawa |
| **Enhanced Conversions + Consent Advanced** | ✅ Odzysk atrybucji po cookie (2026) |
| **CRO landingów** | ✅ Krótki formularz na landingu, dowody społeczne, message match, mniej off-ramps |
| **Prognoza panelu = górna półka** | ✅ Realnie mniej klików / wyższy CPC niż 3,50 zł |

---

## 2. Sprzeczności recenzentów + moje rozstrzygnięcie (poparte kodem)

### Konflikt A — Czy blokować platformy (Shopify/PrestaShop/WordPress)?
- Recenzent #3: **dodać do negatywów** wix, shopify, shoper, prestashop, joomla, wordpress…
- Recenzent #2: **NIE blokować** woo/shopify/presta/wordpress — bo Programo to robi.
- **✅ ROZSTRZYGNIĘCIE (zweryfikowane w kodzie): #2 ma rację.** `/sklepy-internetowe` wprost sprzedaje „wdrożenie woocommerce", „sklep shopify", „sklep prestashop", „headless e-commerce", „migracja". Blokowanie tych fraz = **strzał w stopę** (to wartościowe, często tańsze leady). Blokujemy **tylko tanie kreatory DIY**, których NIE robimy (Wix, Squarespace, Shoper…). Pełna lista w §5a.

### Konflikt B — Dayparting na start?
- Recenzent #3: **ograniczyć pn-pt 8:00–17:00** (oszczędność ~20%).
- Recenzent #2: **NIE ograniczać na start** — brak danych, B2B researchuje wieczorami, formularz działa 24/7; twarde 8-17 utnie realne leady.
- **✅ ROZSTRZYGNIĘCIE: lean #2.** Start **24/7** (max: utnij głuchą noc 23–6, jeśli chcemy drobnej oszczędności). Po 3–4 tyg. → raport „godzina/dzień" i decyzja na DANYCH. Twardego 8-17 nie wprowadzamy ślepo. Jeśli problem = nieodbieranie telefonu po godzinach → harmonogram **tylko dla rozszerzenia połączeń**, nie dla całej kampanii.

### Konflikt C — Korekty stawek (urządzenia/lokalizacja) na start?
- Recenzent #3: **teraz** Mobile −30%, Wielkopolska +15%.
- Recenzent #2: **0%** — brak danych = zgadywanie; jeśli mobile słabo konwertuje → napraw landing, nie tnij bid.
- **✅ ROZSTRZYGNIĘCIE: lean #2, z jednym wyjątkiem.** Mobile −30% **odrzucam na start** — bo równolegle DODAJEMY krótki, mobilny formularz na landingach (czyli naprawiamy dokładnie to, co #3 chce karać). Lokalizacja: opcjonalnie **łagodne +10–15% na Poznań/Wielkopolskę** (lokalne zaufanie, spotkania) — niskie ryzyko, można. Reszta 0% do czasu danych.

### Konflikt D — Wartość leada: względna czy kwotowa?
- Recenzent #2: względne wagi (10 / 6 / 2).
- Recenzent #3: kwoty od wartości umowy (Sklep 1500 / Strona 750 / Naprawa 250 / tel-mail 50).
- **✅ ROZSTRZYGNIĘCIE: zgoda co do zasady; biorę kwoty #3** (lepsze pod przyszłe tROAS) **z zastrzeżeniem #2**: dopóki nie podpinamy realnych zamknięć (offline conversions), to **estymat, nie przychód** — OK do kierunkowego bidowania, nie mylić z ROI.

### Pomniejsze rozbieżności
- **RSA / pinning:** #2 „pinuj oszczędnie", #3 „pinuj markę/USP na poz. 1-2". → Synteza: **1 nagłówek brandowy przypięty, reszta luźno**; cel Ad Strength „Dobra/Doskonała"; rozważyć 12–15 nagłówków. Keyword Insertion = opcjonalne (potrafi wyglądać spamersko — przetestować, nie wdrażać na ślepo).

---

## 3. Skorygowana, uczciwa prognoza (vs. panel)

| Metryka | Panel Google | **Realistycznie (synteza)** |
|---|---|---|
| Średni CPC | 3,50 zł | **5–6,3 zł** (frazy agencyjne PL drogie; cap 5 zł utnie część) |
| Kliknięcia/mc | ~285 | **~150–220** |
| Współczynnik konwersji | 3–5% (benchmark) | **2–4%**, a do czasu formularza na landingu **niżej** (podwójny hop) |
| Leady/mc | 9–14 | **~4–8 na start** (rośnie po naprawie lejka) |
| Koszt/lead (CPL) | — | **~120–300 zł** (branżowo IT: 100–600 zł) |

**Pierwsze 2–4 tyg. = faza nauki i czyszczenia search-terms, NIE ocena ROI.** Grupa 3 (naprawa) będzie najtańsza i najgorętsza — „ukryty zwycięzca".

---

## 4. MASTER PLAN — priorytetowany

### 🔴 BLOKERY — zrobić PRZED „Start"
1. **Formularz-skrót (3–4 pola: imię, e-mail/telefon, krótki opis — BEZ pytania o budżet) + klikalny telefon na KAŻDYM landingu, nad foldem.** Koniec z podwójnym hopem. **#1 lever CRO.**
2. **Dedykowany landing dla Grupy 2** — `/strony-www` (lub `/strony-internetowe`) wzorem działającego `/sklepy-internetowe`. Repoint Grupy 2 z `/oferta` → `/strony-www`.
3. **Decyzja o `/audyt` (Wojtek chce usunąć)** — usunąć funkcję audytu; zbudować prosty landing „Naprawa/optymalizacja stron" (z formularzem) i repoint Grupy 3 tam. Alternatywa: zlikwidować Grupę 3 (ale eksperci mówią, że to najtańszy/najgorętszy ruch — szkoda). **→ decyzja Wojtka, §7.**
4. **Konwersje: tylko formularz = podstawowa** (cel optymalizacji). **tel:/mailto: → drugorzędne** (obserwacja). Inaczej Smart Bidding pogoni za tanim klikiem w mailto.
5. **Rozszerzyć negatywy** wg §5a (z zachowaniem platform, które robimy!).
6. **Różnicowane wartości konwersji** wg §5b (zamiast płaskiego 1,0 zł).
7. **Enhanced Conversions for Leads ON** + potwierdzić, że **Consent Mode v2 = Advanced** (modelowanie), nie Basic.
8. **CRO landingów:** dowody społeczne (loga/realizacje: Jedmar, Estalo, WKS/WSafe + zdjęcie założycieli przy formularzu), message match (H1 = obietnica z reklamy), ograniczyć off-ramps (menu/stopka) na wersjach pod Ads.

### 🟠 PRZY STARCIE / TYDZIEŃ 1
- Start na **Maks. kliknięcia + cap 5 zł** (lub rozważyć Manual CPC dla czystszych danych).
- Ad Strength każdej RSA ≥ „Dobra" (rozbudować nagłówki jeśli trzeba).
- (Pomysł #3) **Powiadomienie o leadzie na Telegram** właściciela (jak przy WSafeFinanse) — reakcja w minuty, nie godziny.

### 🟢 OPERACYJNIE (tygodnie 1–8)
- **Raport wyszukiwanych haseł co kilka dni → negatywy reaktywnie.** Przy phrase/exact (łapią „bliskie warianty/ten sam sens") to ważniejsze niż lista jednorazowa.
- Pilnować **„utracony udz. w wyśw. (pozycja)"** na frazach head — czy cap 5 zł nie dusi G1/G2.
- Dążyć do **Quality Score > 7/10**.
- **Nie ruszać strategii bidowania.** Zbierać konwersje-formularz do ~20–30.

### 🔵 SKALOWANIE (miesiąc 3+)
- Po ~15–20 konw./30 dni → **Maks. konwersje** (cel: tylko formularz).
- Po ~30+ konw. z wartością → rozważyć **tCPA / tROAS** (realnie kwartał+).
- Po fazie nauki: ewentualnie wydzielić **Grupę 3 do osobnej kampanii** (żeby droższe G1/G2 nie podjadały jej budżetu).
- „Mądrzejsze niż broad" przy małym budżecie: włączyć w **AI Max samo URL Expansion** (mniej dzikie, sensowne bo mamy tematyczne landingi) — NIE na start.
- Budżet w górę o **15–20% co ~10 dni**, jeśli CPL satysfakcjonujący.

---

## 5. Gotowe artefakty do wdrożenia

### 5a. Rozszerzona lista negatywów (zweryfikowana)

**🚫 ŚWIADOMIE NIE BLOKOWAĆ (to nasze usługi — wartościowe, często tańsze frazy):**
`shopify`, `prestashop`, `woocommerce`, `wordpress`, `headless`, `allegro`, `baselinker`, `migracja`
> Bo `/sklepy-internetowe` wprost je sprzedaje. Blokada = utrata leadów.

**➕ DODAĆ — tanie kreatory / platformy DIY, których NIE robimy:**
`wix`, `squarespace`, `weebly`, `webflow`, `joomla`, `shoper`, `idosell`, `redcart`, `selly`, `shoplo`, `kreator stron`, `darmowy kreator`, `najtańsza strona`, `tania strona`

**➕ DODAĆ — praca / edukacja / DIY / legal:**
`zatrudnię`, `junior`, `staż`, `praktyki`, `praktykant`, `cv`, `jak założyć`, `krok po kroku`, `regulamin`, `polityka prywatności`, `wzór`, `wzory`, `przykłady`, `inspiracje`, `logo`, `wizytówka`

**👀 OBSERWOWAĆ, nie blokować z góry** (mogą być wartościowe): `cena`, `cennik`, `ile kosztuje`, `opinie`, `ranking`

*(Obecna lista 22 negatywów zostaje; powyższe to uzupełnienie. UWAGA: „szablon/szablony" już mamy — OK, bo to DIY.)*

### 5b. Wartości konwersji (zamiast płaskiego 1,0 zł) — estymat, nie przychód
| Konwersja | Rola | Wartość (zł) |
|---|---|---|
| Formularz — zapytanie o **sklep** | **podstawowa** | **1500** |
| Formularz — zapytanie o **stronę WWW** | **podstawowa** | **750** |
| Formularz — **naprawa/optymalizacja** | **podstawowa** | **250** |
| Klik w **telefon / e-mail** | **drugorzędna (obserwacja)** | **50** |

### 5c. Spec landingów (CRO)
- **Każdy landing pod Ads:** inline formularz 3–4 pola (bez „budżetu") + click-to-call; dowody (loga realizacji + zdjęcie założycieli przy formularzu); H1 = obietnica z reklamy; ograniczone menu/stopka.
- **`/strony-www` (NOWY):** wzorem `/sklepy-internetowe` — konkretny H1, stack (Next.js/React), realizacje, widełki cen, formularz.
- **`/sklepy-internetowe`:** treść jest mocna (platformy, migracje, integracje, widełki 6–15 tys., case Jedmar) — **brakuje inline formularza + telefonu + dowodów społecznych**. To, nie przepisywanie, jest poprawą (Wojtek nazwał ją „średnią" — luką jest lejek/CTA, nie treść).
- **Naprawa stron (zamiast `/audyt`):** prosty landing usługowy z formularzem; bez narzędzia-audytu, którego Wojtek nie chce.

---

## 6. Jak to się łączy z 3 poprawkami Wojtka
| Poprawka Wojtka | Status wg syntezy |
|---|---|
| **Usunąć `/audyt`** | ✅ Robimy (usunąć funkcję). ⚠️ Ale Grupa 3 traci landing → zbudować prosty „naprawa stron" i repoint, żeby NIE stracić najtańszego ruchu (eksperci: to „ukryty zwycięzca"). |
| **Poprawić `/sklepy-internetowe`** | ✅ Zgodnie z CRO: dodać inline formularz + telefon + dowody (treść już dobra). |
| **Jedmar = apka iOS+Android, nie PWA** | ✅ Copy już mówi iOS+Android; poprawić prezentację (link „live" idzie do sklepu web, nie apki) — dorzucić linki App Store/Play lub doprecyzować. |

---

## 7. Otwarte decyzje dla Wojtka (potrzebne przed wdrożeniem)
1. **Grupa 3 / naprawa stron:** budujemy prosty landing „naprawa/optymalizacja" (bez narzędzia-audytu) i zostawiamy grupę, czy **całkiem rezygnujemy z Grupy 3**? (Rekomendacja: zostawić — to najtańszy, najgorętszy ruch.)
2. **Telegram-powiadomienia o leadzie** — wdrażamy (jak przy WSafeFinanse)?
3. **Lokalny boost +10–15% na Poznań/Wielkopolskę** — chcemy faworyzować lokalnych (spotkania), czy traktujemy PL jednolicie (sprzedaż zdalna)?
4. **Kolejność prac:** najpierw cały lejek (formularze + `/strony-www` + naprawa landing), potem dopiero „Start"? (Rekomendacja ekspertów: TAK — nie startować przed naprawą lejka.)

---

## 8. Źródła (fakty czasowo-wrażliwe, 2026)
- Google Ads Help — AI Max for Search / DSA → AI Max upgrade 2026
- Search Engine Land — Maximize conversions / progi Smart Bidding
- Dane rynkowe CPC PL dla usług IT/e-commerce (śr. ~6,29 zł; wysoka intencja >25 zł); minimalny komfortowy budżet Smart Bidding 2026 (~$3000–5000/mc dla 30+ konw.)
- Weryfikacja landingów: realny podgląd `/sklepy-internetowe`, `/oferta`, `/audyt` (recenzent #2) + kod repo `programo-site` (potwierdzenie platform/cen/formularza)

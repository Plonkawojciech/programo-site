# Redesign programo.pl — brief wykonawczy (2026-07-15)

Jedno źródło prawdy dla wszystkich agentów pracujących przy redesignie. Szczegółowe raporty
analityczne: `/private/tmp/claude-501/-Users-wojciechplonka/ed2e1d1e-8cde-48e5-8a54-b7d0ded5847d/scratchpad/analysis/`
(audyt-kod.md, audyt-tracking.md, audyt-audyt-ux-tresci-pro.md, playbook.md, projekt-*.json).
Świeże screenshoty produktów: `/private/tmp/claude-501/-Users-wojciechplonka/ed2e1d1e-8cde-48e5-8a54-b7d0ded5847d/scratchpad/shots/`.

## 1. Cel

Landing pod konwersję (telefon + formularz) dla ruchu z Google Ads i SEO, z sekcją portfolio,
która jest pokazem umiejętności. Strona ma wyglądać jak profesjonalne software studio,
nie jak wygenerowany szablon. Mobile ma być bezbłędny — większość ruchu płatnego jest mobilna.

## 2. Nienaruszalne

- **Logo i paleta kolorów bez zmian**: ciemna zieleń leśna + mięta. Tokeny w `globals.css`:
  dark default `#051F20 / #0A2A28 / #163832 / #DAF1DE / #8EB69B`, light mode odwrócony.
  Fonty zostają: Newsreader (display) + Plus Jakarta Sans (body). Zero kursywy w nagłówkach,
  zero emotek, zero ozdobnych fontów.
- **Tracking — zachować w całości** (szczegóły: audyt-tracking.md):
  - Consent Mode v2 inline w `<head>` PRZED gtag.js (kolejność krytyczna).
  - ID: GA4 `G-KT2R144BYG`, Ads `AW-18196600478`, label konwersji `AW-18196600478/tYIqCM3A_rkcEJ6t6ORD`, Clarity `wxezq44wx0`.
  - `generate_lead` z `value: 500, currency: "PLN"` (bez tego GA4 nie liczy konwersji).
  - Guard sesyjny `programo-lead-fired` (jedna konwersja Ads na sesję).
  - Unikalny, opisowy `formId` per formularz (np. `home-hero`, `strony-hero`).
  - `captureAttribution()` na każdym mouncie (AnalyticsTracker w Providers).
  - Kontrakt `/api/contact` bez zmian (pole `consent: true` wymagane, atrybucja gclid/utm przekazywana).
  - Cookie banner: nieblokujący pasek z prawdziwym „Odrzuć wszystkie" (wymóg RODO); NIGDY
    pełnoekranowy modal. Na mobile ma być kompaktowy — obecnie zasłania pół ekranu (naprawić).
- **Żadnych zmyślonych statystyk.** Każda liczba na stronie musi pochodzić z sekcji 5 tego
  briefu albo z projekt-*.json. Brak danych = nie piszemy liczby.
- Wszystkie teksty przez i18n `t()` — PL jest językiem pierwszym, EN pełne tłumaczenie.

## 3. Diagnoza obecnej strony (do naprawy)

1. Preloader z licznikiem 0→100% blokuje treść ~4–5 s przy każdym wejściu — USUNĄĆ całkowicie
   (dozwolony co najwyżej krótki fade-in <300 ms bez licznika).
2. Marquee portfolio renderuje się jako pusta biel przy szybkim scrollu; hover-only szczegóły
   nie działają na mobile — zastąpić gridem.
3. Cookie banner na mobile zasłania CTA hero.
4. Homepage nie ma telefonu ani formularza w hero (podstrony landingowe mają — homepage jest
   słabsza konwersyjnie niż podstrony!).
5. AI-slopowe frazy: „Tworzymy software, który rozwiązuje realne problemy" (3× w serwisie),
   „Dwóch builderów", „Budujemy cyfrową przyszłość", „międzynarodowa ekspansja oraz wyznaczanie
   nowych standardów" (zabójca wiarygodności — usunąć bezwzględnie), „command center",
   „cyfrowym designie". Nadużycie myślników em-dash w co drugim zdaniu.
6. Cztery różne wersje obietnicy odpowiedzi — ujednolicić wszędzie do: **„Odpowiadamy w 24 h"**.
7. Dwie nakładające się struktury oferty (/oferta vs /strony-internetowe) — jedna spójna.
8. Brak oferty tracking + reklamy + SEO jako osobnej usługi — dodać (mamy na to 3 realne case'y).
9. Mieszanie własnych produktów z realizacjami klienckimi — rozdzielić uczciwie.
10. Estalo oznaczone „Coming Soon" a jest LIVE; Jedmar w kategorii „Strony" a to apki mobilne.
11. Martwy kod: `hero.tsx` (stary bento hero), `horizontal-intro.tsx`, `magnetic.tsx`,
    klucz `about.label` — usunąć.
12. `software-house-poznan` i `ile-kosztuje-aplikacji` mają hardkodowane kolory (bursztynowy
    akcent `#ffb547`, wymuszony dark) niezgodne z systemem — ujednolicić do tokenów.
13. Tracking: podwójny `contact_click` w sticky-cta (własny onClick + globalna delegacja) — usunąć
    ręczny onClick; brak zdarzeń kliknięć w linki portfolio (dodać `select_content`); brak
    scroll-depth (dodać 25/50/75/100); `/ile-kosztuje-aplikacji` bez formularza (dodać CompactLeadForm
    z formId `koszt-artykul`).

## 4. Kierunek designu

**„Editorial forest"** — spokojna, redakcyjna elegancja na głębokiej zieleni, rytm numerowanych
sekcji (01/02/03), duża typografia Newsreader jako główny bohater, mięta jako akcent
interakcji. Premium przez precyzję i rzemiosło, nie przez fajerwerki.

- Hierarchia: wielki serif display → spokojny grotesk body; silny kontrast skali.
- Motion: JEDNA klasa dopracowanych mikrointerakcji zamiast dziesięciu generycznych.
  Staggered reveal przy wejściu w viewport (z `initial={false}` nad foldem i marginesami,
  które nie zostawiają pustych ekranów), count-up liczb w pasku zaufania, hover-reveal na
  kartach portfolio (na mobile: karta zawsze czytelna, tap = przejście), telefon-mockup
  z delikatnie przewijającym się screenshotem. Respektować `prefers-reduced-motion`.
- Smooth scroll (lenis) zostaje, ale sekcje muszą być widoczne nawet gdy IntersectionObserver
  nie zdąży (bez trwałego `opacity: 0`).
- Portfolio: **grid, nie karuzela**. Karty z realnymi zrzutami w ramkach urządzeń
  (BrowserFrame dla web, PhoneFrame dla apek — nasz wyróżnik: natywne apki mobilne,
  czego czysto-webowe agencje nie mają).
- Custom cursor: usunąć (szum). Scroll progress: może zostać, subtelny.

## 5. Architektura homepage (kolejność sekcji)

0. **Sticky header**: logo, nav, klikalny `tel:`, przycisk „Umów rozmowę". Mobile: sticky CTA
   dole (Zadzwoń / Napisz) — istnieje, zachować, naprawić podwójny tracking.
1. **Hero**: nagłówek konkretny (odbiorca + wynik, bez frazesów), pod nim jedno zdanie,
   dual CTA: „Zadzwoń: 509 123 434" + „Bezpłatna konsultacja" (scroll do formularza),
   pod CTA: „Odpowiadamy w 24 h". Obok/pod: kompaktowy formularz „Zostaw numer — oddzwonimy"
   (formId `home-hero`). Bez ilustracji stockowych — typografia + subtelny wizual produktowy.
2. **Pasek zaufania**: loga klientów (Jedmar, WKS Poznań, W. Safe Finance, Skup Nieruchomości,
   Domki Poznaniak) + 3 prawdziwe liczby z count-up (np. „2 natywne aplikacje w App Store
   i Google Play", „10+ produktów i wdrożeń", „Odpowiadamy w 24 h").
3. **Oferta — 4 filary** (capability × korzyść × przykład realizacji, każdy linkuje do
   podstrony): (1) Aplikacje webowe i SaaS, (2) Natywne aplikacje iOS i Android,
   (3) Sklepy internetowe, (4) Strony, tracking i reklamy Google.
4. **Portfolio grid** — 6 najlepszych: Jedmar, Estalo, WKS Poznań, Skup Nieruchomości,
   ePortal Prawny (wkrótce), Rejestr Pro / Solvio. Karta: ramka urządzenia z realnym zrzutem,
   twarda metryka w nagłówku, tagi, link do podstrony projektu. Link „Wszystkie projekty".
5. **Featured case: Jedmar** — mini-historia Wyzwanie → Rozwiązanie → Efekt z licznikami
   (73 narzędzia, ~7500 markerów, 6 bramek płatności, katalog ~1500 produktów) i parą
   mockupów (iPhone + web).
6. **Ludzie**: Wojciech + Bartosz, zdjęcia/inicjały, po jednym zdaniu konkretu, bezpośredni
   telefon i mail. „Rozmawiasz z osobą, która pisze Twój kod."
7. **W produkcji**: pasek „Trwają prace nad kolejnymi czterema aplikacjami" (bez nazw) +
   status ePortal Prawny „premiera wkrótce".
8. **FAQ** (4–5 pytań: koszt, czas, jak wygląda start, czy małe firmy, co z utrzymaniem).
9. **Klamra kontaktowa**: nagłówek zaproszenia + QuickContact (imię, telefon/e-mail, typ
   projektu chipy, wiadomość opcjonalna) + telefon + „Odpowiadamy w 24 h".

## 6. Podstrony

- `/oferta` — 4 filary jak na home, każdy rozwinięty; spójna JEDNA struktura.
- `/sklepy-internetowe` — oferta e-commerce: apki mobilne do istniejących sklepów
  (case Jedmar z modułem schematów), sklepy od zera (WooCommerce/PrestaShop/headless Next.js),
  integracje (płatności, InPost, Allegro/BaseLinker), migracje bez utraty SEO.
- **NOWA** `/strony-tracking-reklamy` — pakiet: strona/landing + GA4/konwersje/Consent Mode v2 +
  kampanie Google Ads + SEO techniczne. Case'y: Skup Nieruchomości (pełny lejek end-to-end),
  Domki Poznaniak (tracking + Ads na CUDZEJ stronie — uczciwie, pokazuje elastyczność),
  W. Safe Finance (strona + leady mail/Telegram). Formularze z formId `marketing-hero`,
  `marketing-compact`. Dodać do nav, sitemap, oferty.
- `/strony-internetowe` — odchudzić o to, co przejmuje nowa strona (bez duplikacji SEO oferty);
  cross-link.
- `/projekty` — grid z filtrami: Wszystkie / Produkty Programo / Dla klientów / Tracking i reklamy.
- `/projects/[slug]` — nowy layout detalu: hero z ramkami urządzeń, sekcje Wyzwanie/Jak
  zbudowane/Efekt, galeria zrzutów, stack, link live, CTA kontakt na dole.
- `/o-nas` — przepisać: konkret zamiast „cyfrowej przyszłości"; usunąć „międzynarodową
  ekspansję"; dane firmy (Programo s.c., Poznań).
- `/cennik` — zostaje model wyceny indywidualnej, ale konkretniej: proces (rozmowa →
  widełki w 24 h → wycena stała), co wpływa na cenę; ZERO wymyślonych kwot.
- `/kontakt` — CompactLeadForm + QuickContact, telefony obu założycieli, „Odpowiadamy w 24 h".
- `/software-house-poznan`, `/ile-kosztuje-aplikacji` — ujednolicić kolory do tokenów,
  dodać formularz na artykule.

## 7. Portfolio — statusy WIĄŻĄCE i metryki (z projekt-*.json; pełne fakty tam)

| Projekt | Status na stronie | Twarde fakty do użycia | Czego NIE pisać |
|---|---|---|---|
| **Jedmar** (klient) | Obie apki opublikowane i działają (App Store + Google Play) | 2 natywne apki (Swift/SwiftUI + Kotlin/Compose), katalog ~1530 produktów / ~190 kategorii, 6 integracji płatności, Paczkomaty InPost, skaner EAN, 96 testów iOS; moduł schematów LIVE na jedmar.pl/pl/schematy-narzedzi: 73 narzędzia, ~7500 markerów części, koszyk end-to-end; moduł działa też natywnie w obu apkach | że zrobiliśmy cały sklep/stronę (tylko apki + moduł schematów); liczb pobrań/ocen |
| **Estalo** (produkt) | LIVE — web działa produkcyjnie z płatnościami; apki iOS/Android w App Store review | CRM multi-tenant, 4 integracje portali (Otodom OAuth/API, NOE 2.0, Domy.pl, Morizon-Gratka), AI: RAG pgvector, matchmaking 0–100, generator opisów AIDA; RBAC 5 ról; ~32 tabele z RLS; osobny portal portal.estalo.pl | liczby klientów/przychodów; że apki „w budowie"; że portal ma dużą bazę ogłoszeń |
| **ePortal Prawny** (produkt) | Premiera wkrótce | 3 platformy równolegle (web + natywny iOS + natywny Android), self-host Supabase na własnym serwerze (EU/RODO), 59 migracji, AI intake (Claude, structured output, bariera compliance), teczka sprawy: dokumenty/czat realtime/zadania | że apki są w sklepach; liczb prawników/klientów; wideokonsultacji |
| **WKS Poznań** (klient) | LIVE — wkspoznan.pl | Rebuild na Next.js 16 + Supabase z własnym CMS (harmonogram, aktualności, galeria, obozy, trenerzy); klientka sama zarządza treścią; RLS; logo Programo w stopce żywej strony | liczby odwiedzin |
| **Skup Nieruchomości** (klient) | LIVE — skupnieruchomoscipl.pl | Pełny lejek end-to-end: strona + 2-krokowy widżet callback + 6 podstron pod message-match Ads + tracking (GA4, enhanced conversions, Meta Pixel, Consent Mode v2) + kampania Google Ads zbudowana i zoptymalizowana; przebudowa lejka na podstawie własnych danych analitycznych | że kampania jest właśnie aktywna; liczb leadów/CPC |
| **Domki Poznaniak** (klient, tylko marketing) | Tracking + kampania Google Ads | GA4 + konwersje z enhanced conversions wpięte na istniejącej stronie klienta (nie naszej); pełne prowadzenie kampanii: budżet z capem, harmonogram, geo, wykluczenia | że zrobiliśmy stronę; jakichkolwiek wyników liczbowych |
| **W. Safe Finance** (klient) | LIVE — wsafefinance.pl | Strona firmy doradztwa finansowego; formularz → e-mail (Resend) + push Telegram (reakcja w minuty); PL/EN; dark theme default; Zod + rate limiting | liczb leadów |
| **Rejestr Pro** (produkt) | Web LIVE; apka iOS w wersji podglądowej (nieoficjalna) | Wyszukiwarka firm: nazwa/KRS/NIP/REGON; oficjalne API Ministerstwa Sprawiedliwości (bez scrapingu); własny indeks trigramowy pg_trgm; powiązania osób; Biała Lista VAT; SSR + JSON-LD | że apka jest w App Store; „pełna baza KRS"; danych finansowych firm |
| **Solvio** (produkt, współpraca) | W rozwoju — **tworzony we współpracy z PBDevs (Filip Piątek)** | Natywna apka iOS SwiftUI (20+ modułów) + web; OCR paragonów (Azure Document Intelligence) + kategoryzacja AI; import bankowy PSD2 (GoCardless); podział wydatków w grupach; raporty CSV/PDF/DOCX; PL/EN | przypisywać 100% autorstwa Programo; że jest w App Store; liczb użytkowników |
| **PoolTimer** (produkt) | W rozwoju — pilotaż z realnym klubem | Hardware ESP32 (touchpady + centralny box, ESP-NOW, precyzja milisekundowa) + panel trenera i zawodnika (Next.js + Supabase) + natywne apki iOS/Android w budowie; realny klub używa panelu na produkcji | nazwy klubu; „±5 ms"; nazwy „SwimTimer"; że hardware jest zintegrowany z chmurą; że płatności działają |

Dodatkowo wszędzie: sekcja/pasek „Trwają prace nad kolejnymi czterema aplikacjami" — bez nazw.

Kategorie w portfolio: **Produkty Programo** (Estalo, ePortal Prawny, Rejestr Pro, Solvio,
PoolTimer) vs **Dla klientów** (Jedmar, WKS, Skup, W. Safe Finance) vs **Tracking i reklamy**
(Skup, Domki Poznaniak). Uczciwe rozdzielenie — koniec z „7 wdrożonych produktów".

## 8. Język (anty-slop)

- Polszczyzna staranna: „oprogramowanie" nie „software" w nagłówkach; „dwóch inżynierów"
  (jedna forma wszędzie); bez „builderów", „command center", „digital craftsmanship".
- Nagłówki = konkret, nie slogan-zdanie. Zakaz: „realne problemy", „cyfrowa przyszłość",
  „nowe standardy", „pasja do kodu", „perfekcja".
- Em-dash oszczędnie (maks. 1 na akapit). Bez wykrzykników w copy sprzedażowym.
- Jedna obietnica czasu: „Odpowiadamy w 24 h".
- Opisy projektów: KAŻDY napisany od zera, inaczej niż obecne (obecne w `src/lib/projects.ts`
  — traktować wyłącznie jako listę czego NIE powtarzać stylistycznie).

## 9. Screenshoty i mockupy

- Zrzuty w `scratchpad/shots/` (desktop 1440×900@2x, mobile 390×844@3x): estalo, estalo-portal,
  eportalprawny, skup, wsafefinanse, rejestr-pro, solvio, wks, jedmar-shop, swimplatform.
- Dograć: jedmar.pl/pl/schematy-narzedzi (+ widok pojedynczego narzędzia z markerami),
  estalo.pl/enterprise, podstrony skup (np. /spadek).
- Istniejące zrzuty apek Jedmar: `public/screenshots/jedmar-app1..3.webp` — użyć w PhoneFrame.
- Konwersja do webp (jakość ~82), nazwy `public/screenshots/v2/<projekt>-<wariant>.webp`.
  Stare zrzuty zostawić do czasu migracji detali, potem usunąć nieużywane.
- Komponenty ramek: `PhoneFrame` (notch, zaokrąglenia, cień), `BrowserFrame` (pasek adresu
  z prawdziwą domeną), `DeviceDuo` (desktop + telefon obok siebie z parallax offsetem).

## 10. Formularze

- `CompactLeadForm` (imię + telefon + zgoda): hero home, hero landingów, artykuł koszt.
  Komunikat: „Zostaw numer — oddzwonimy w 24 h z konkretami."
- `QuickContact` (imię, e-mail LUB telefon, chipy typu projektu [Aplikacja webowa / Aplikacja
  mobilna / Sklep internetowy / Strona + reklamy / Coś innego], wiadomość opcjonalna): klamra
  home, /kontakt, landingi.
- Redesign wizualny obu: większe pola dotykowe (min 48 px), czytelne stany błędów po polsku,
  stan sukcesu z potwierdzeniem „Dziękujemy — odezwiemy się w 24 h", loading state.
- Kontrakt API i tracking bez zmian (sekcja 2).

## 11. Weryfikacja (definicja ukończenia)

1. `npm run build` + `npm run lint` + `npm run test` zielone (testy zaktualizować do nowej
   struktury — testują i18n spójność PL/EN, projects.ts, SEO metadata).
2. Browser: desktop 1440 i mobile 390 — każda strona bez pustych sekcji, bez poziomego
   scrolla, cookie banner kompaktowy, formularze działają (submit na dev → 200).
3. Tracking: zdarzenia w dataLayer/gtag przy submit i tel-click, consent order nienaruszony.
4. Język: osobny przegląd całego PL copy (błędy, kalki, spójność form).
5. Design review adversarialny: „czy to wygląda jak szablon AI?" — poprawki do skutku.
6. EN: pełna parytetowość kluczy i18n.

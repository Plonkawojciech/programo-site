# Odświeżenie programo.pl: portfolio dem, zrzuty, SEO, konwersja (2026-10-01)

Cel: więcej zapytań. Strona zostaje wizualnie taka, jaka jest (logo, paleta, układ, fonty). Zakres to
dopracowanie szczegółów, portfolio dem, zrzuty, SEO techniczne i treściowe, pomiar oraz konwersja.

Praca w worktree `programo-site-refresh`, gałąź `refresh-2026-10` (od `origin/main` z 30.09, bo Bartek
commituje równolegle). Każdy etap: `npm run build && npx tsc --noEmit && npm run test && npm run lint`,
przegląd w przeglądarce na 375 / 820 / 1440 px, rebase na `origin/main`, push.

## Stan wyjściowy (zmierzone 1.10.2026)

Źródła: przegląd 16 tras w trzech szerokościach (`scripts/audit-shots.mjs`), test widoczności treści przy
`prefers-reduced-motion`, audyt kodu Codexa (gpt-5.6-sol, read-only, log
`~/.claude/codex/logs/20261001-094336-audit-programo-site-74215.answer.txt`), statusy klientów z CRM.

Działa poprawnie: brak poziomego przewijania na żadnej trasie, jeden H1 na trasę, tytuły ≤ 60 znaków,
kliknięcia `tel:` i `mailto:` łapie globalny listener (`analytics-tracker.tsx`), wszystkie `Image fill` mają
`sizes`, optymalizator obrazów Vercela odpowiada 200 (402 z sierpnia ustąpiło).

Do naprawy:

| # | Waga | Ustalenie | Gdzie |
|---|---|---|---|
| 1 | P0 | Przy systemowym „Ogranicz ruch" sekcja „Z czym przychodzą do nas firmy" jest niewidoczna (SSR wysyła `opacity:0`, a klient przy reduced motion nie dostaje animacji, która to zdejmuje) | `home/services-overview.tsx` |
| 2 | P1 | Baner cookies na telefonie zasłania przycisk formularza w hero i sticky CTA; przyciski 34 px | `cookie-banner.tsx` |
| 3 | P1 | Hero: brak bezpośredniego `tel:`; imię wymagane mimo że backend przyjmuje sam telefon | `home/hero.tsx` |
| 4 | P1 | Miniatury produktów na stronie głównej (147 px szerokości) proszą o obraz `w=3840` | `home/own-products.tsx` |
| 5 | P1 | `/projekty` na telefonie ma 19 500 px: 21 dem jedno pod drugim, w tym słabe i trzy do usunięcia | `demos.ts`, `demos-section.tsx` |
| 6 | P1 | Kafle usług na stronie głównej prowadzą do ogólnego `/oferta`; `/strony-internetowe` ma jeden link przychodzący | `services-overview.tsx`, `offer.tsx` |
| 7 | P1 | `/cennik`: tytuł „Wycena - proces i czynniki ceny" i H1 „Wycena" nie odpowiadają na „ile kosztuje strona / sklep / aplikacja" | `cennik/page.tsx`, `pricing.ts` |
| 8 | P1 | Opisy meta poza 120–160 znaków: `/` (102), `/stack` (97), `/blog` (119), `/wspolpraca` (182), `/projekty` (179) | odpowiednie `page.tsx` |
| 9 | P1 | Pełny formularz: pole „telefon lub e-mail" ma `inputMode="text"` + `autoComplete="tel"`; `p-8` na 320 px | `quick-contact.tsx` |
| 10 | P2 | Cele dotykowe < 44 px: linki stopki (36), telefony i mail w stopce (20), kropki karuzeli (24), linki „Sprawdź ofertę" (29) | `footer.tsx`, `client-work.tsx`, `services-overview.tsx` |
| 11 | P2 | Stopka przechodzi na 4 kolumny już od 768 px | `footer.tsx` |
| 12 | P2 | `priority` na obrazach, które nie są LCP (dwa warianty logo, pierwsza realizacja, zdjęcia założycieli) | `navbar.tsx`, `client-work.tsx`, `founder-cards.tsx` |
| 13 | P2 | Puste klastry bloga są indeksowalne, a klastry z wpisami nie trafiają do sitemapy | `blog/klaster/[cluster]/page.tsx`, `sitemap.ts` |
| 14 | P2 | Strona główna bez obrazu OG; polityka prywatności bez własnego OG | `layout.tsx`, `page.tsx` |
| 15 | P2 | Zdanie „żaden piksel nie startuje bez zgody" jest nieścisłe (Google działa w Consent Mode przed zgodą) | `marketing.ts` |
| 16 | P2 | Siatka realizacji: 10 kart w 3 kolumnach zostawia samotną kartę w ostatnim rzędzie | `featured-work.tsx` |

Poza kodem (Twoje decyzje i sekrety, bez zmian od planu z 14.09): `META_CAPI_ACCESS_TOKEN`, `GA4_API_SECRET`,
`MS_GRAPH_*` na produkcji; w GA4 tylko `generate_lead` jako kluczowe (nie `generate_lead_verified`).

## Etap 1. Portfolio dem

### Selekcja

Żyje 22 hostów z demami. Odpadają:

- z polecenia: Innochem, Terapia Dens, Underwater;
- klienci po umowie (CRM: AGREED / ACTIVE): Innochem, Terapia Dens, „ojciec Propyszyna", Marcin Budny;
- dema, których firma jeszcze nie dostała (CRM: „demo niewysłane"): DAVI, splywajcie.pl, a razem z nimi
  biebrza24 („Kajaki", w rozmowach) i nadbugiem (host nie odpowiada). Pokazanie ich publicznie przed
  wysyłką do firmy odbiera nam pierwszy kontakt. Wracają do puli po wysyłce;
- słabe jakościowo: pzskatslp (goły układ), gaming-ui (lorem ipsum, demo techniczne), supermozaika
  wariant 2 (puste czarne pole zamiast zdjęcia w hero), incolt (logo nachodzi na nawigację).

Zostaje 14, w kolejności od najmocniejszych: Lumen, WojtPlast, Supermozaika (sklep), Trend Cars,
Sklep Maniek, Intergraf, Pressence, elZakup, Manix, Czysta Przyszłość, Razem dla Sportu (nowe),
Życie Stolicy, Biuro AGA, Europejskie Centrum Bezpieczeństwa, KS Posnania. FiNE ART FiLM zostaje, jeśli
nowy zrzut złapie ostry kadr (hero to wideo).

W rozmowach (IN_TALKS) są: Biuro AGA, Manix, Życie Stolicy. Zostają na liście, bo nie ma umowy, ale
to pierwsze firmy do zapytania o zgodę (niżej).

### Ryzyko: cudze marki w portfolio

To ocena ryzyka, nie porada prawna. Stan na produkcji od 14.09: pełna nazwa firmy, zrzut z jej logo
i link do dema, w sekcji o nazwie „Dema stron dla firm". Żadna z tych firm nie jest klientem, trzy
odmówiły wprost (Intergraf mailem 13.09, WojtPlast „niezainteresowani", Anvapol odpadł na cenie).

Co może pójść źle:

- **wprowadzenie w błąd co do współpracy** (art. 3 i 10 ustawy o zwalczaniu nieuczciwej konkurencji):
  nazwa obok naszych realizacji sugeruje, że firma jest klientem. Opis „demo, zanim podjęli decyzję"
  to łagodzi, ale karta czytana osobno tego nie mówi;
- **prawo do firmy i znak towarowy** (art. 43¹⁰ KC, art. 296 Prawa własności przemysłowej): używamy
  cudzej nazwy i logo we własnej reklamie bez zgody;
- **prawa autorskie**: dema zawierają zdjęcia i teksty pobrane ze stron tych firm. Na etapie oferty
  wysłanej do firmy to mieści się w rozmowie handlowej; publiczna ekspozycja w naszym portfolio już nie;
- **relacja**: firma, która odmówiła, znajduje swoją nazwę w Google przy naszej stronie. Realny skutek to
  raczej mail z żądaniem usunięcia niż pozew, ale kosztuje reputację w branży, w której dzwonimy na zimno.

Warianty:

| | Forma | Ryzyko | Siła sprzedażowa |
|---|---|---|---|
| A | Jak dziś: nazwa, logo na zrzucie, link do dema | najwyższe | najwyższa |
| B | „Koncepcja dla branży": bez nazwy i hosta, zrzut bez nagłówka z logo, bez linku do dema, podpis „projekt koncepcyjny, niezrealizowany wdrożeniowo" | niskie | średnia: widać poziom projektu, nie widać „dla kogo" |
| C | Nazwa tylko za pisemną zgodą (jeden mail: „czy możemy pokazać demo w portfolio?"), reszta w wariancie B | niskie | wysoka tam, gdzie jest zgoda |

Rekomendacja: C. Firmy, które odmówiły współpracy (Intergraf, WojtPlast, Anvapol), od razu w wariancie B.

**Decyzja należy do Ciebie.** W kodzie każde demo dostaje pole `disclosure: "named" | "concept"`,
a zrzuty powstają w obu wersjach (`<slug>-desktop.webp` i `<slug>-concept-desktop.webp`). Do czasu decyzji
wdrażam stan zgodny z tym, co już jest na produkcji (A), więc przełączenie to zmiana jednej wartości
`DEFAULT_DISCLOSURE` w `src/lib/demos.ts` albo pola przy konkretnym demie.

### Wygląd sekcji

- karta: zrzut desktopowy na kanwie w kolorze marki, w rogu telefon z wersją mobilną (ten sam
  `PhoneFrame` co w realizacjach), pod spodem branża, nazwa lub „Koncepcja: <branża>", jedno zdanie
  o decyzji projektowej; bez pastylek z listą podstron (szum);
- pierwsze 6 kart widoczne, reszta pod „Pokaż wszystkie" renderowana w HTML (`hidden`), żeby treść
  została dla crawlerów; na telefonie sekcja skraca się z ok. 12 000 do ok. 4 000 px;
- licznik w nagłówku liczony z danych, bez liczb wpisanych ręcznie.

## Etap 2. Zrzuty ekranu

- `scripts/shoot-demos.mjs`: jeden standard (1440×900 i 390×844, DPR 2, WebP q80, szerokość wyjściowa
  1600 / 780), czekanie na fonty i obrazy, ukrycie banerów cookies i pasków „wersja demonstracyjna",
  wariant `concept` z ukrytym nagłówkiem;
- realizacje (`public/screenshots/v2`): porównanie z żywymi stronami (jedmar.pl, estalo.pl, wkspoznan.pl,
  skupnieruchomosci, wsafefinance.pl, rejestr-pro, solvio, pooltimer, eportalprawny) i ponowne zdjęcie
  tych, które się zmieniły; ten sam skrypt i parametry;
- usunięcie nieużywanych plików z `public/screenshots` (stary zestaw `*-hero.webp`, `*-cap*.webp`
  i duplikaty `skup-*` / `skup-nieruchomosci-*`), po sprawdzeniu grepem, że nic ich nie importuje;
- `sizes` na miniaturach produktów i `priority` tylko na obrazie LCP.

## Etap 3. Dopracowanie i responsywność

Punkty 1, 2, 9–12, 16 z tabeli oraz przegląd każdej trasy na 320 / 375 / 820 / 1440 px po zmianach.
Bez zmian układu i palety.

## Etap 4. Konwersja

- hero: imię opcjonalne, pod przyciskiem „albo zadzwoń: <numer>" jako `tel:`; baner cookies na telefonie
  w dwóch rzędach i nad nim wolny przycisk formularza;
- pasek zaufania: pod logotypami jedno zdanie zakresu z linkiem do case study (dane z `projects.ts`);
- opinie klientów: nie dodaję, dopóki nie ma prawdziwych, podpisanych wypowiedzi. Do zebrania: Jedmar,
  WKS Poznań, W. Safe Finance (krótki mail z prośbą, szkic przygotuję osobno);
- `/cennik`: tytuł, H1 i lead pod intencję cenową.

## Etap 5. SEO

- techniczne: punkty 7, 8, 13, 14; linkowanie wewnętrzne (punkt 6);
- nowe trasy pod frazy z intencją zakupową, hardkodowany PL jak pozostałe strony SEO, każda z własnym
  FAQ, schemą `Service` i linkami z `/oferta`, stopki oraz kafli usług:
  1. `/strony-internetowe-poznan` (lokalna),
  2. `/sklepy-internetowe-poznan` (lokalna),
  3. `/aplikacje-mobilne-dla-firm`,
  4. `/aplikacje-webowe-dla-firm`,
  5. `/wdrozenie-ga4-tracking-konwersji`.
  Wolumenów nie podaję: nie mam dostępu do Search Console ani Keyword Plannera w tej sesji. Kolejność
  wynika z tego, co już sprzedajemy i co ma realizacje do pokazania. Po miesiącu weryfikacja w GSC;
- treści tych stron piszę z faktów z `projects.ts` i `pricing.ts`, bez wymyślonych liczb.

## Etap 6. Tracking

Kod pomiaru zostaje (zasada repo). Zmiany: poprawka zdania o zgodach (punkt 15), nowe zdarzenia tylko
przez `analytics/events.ts`: kliknięcie „Pokaż wszystkie dema" i kliknięcie `tel:` w hero dostaje
`placement`. Bezpiecznik Ads nie zeruje się przy ponownym włączeniu zgody w tej samej sesji.

## Migracja z Vercela na Coolify (propozycja, nie wykonuję)

Dziś: `git push origin main` → Vercel. To potwierdzony wyjątek od zasady Coolify (12.08).

Co przemawia za migracją: jedna platforma i jedna procedura deployu, koniec z limitem transformacji
obrazów (402 z sierpnia), env w jednym miejscu z resztą firmowych aplikacji.
Co przemawia przeciw: strona firmowa to nasz lejek, a VM netcup hostuje też CRM, Estalo i LeadHuntera;
awaria dysku na VM (już się zdarzyła na Contabo) kładzie wtedy stronę razem z resztą.

Plan, jeśli się zgodzisz:

1. Dockerfile (`output: "standalone"`), `sharp` w obrazie, healthcheck `/api/health`;
2. aplikacja w Coolify z gałęzi `main`, env przeniesione ręcznie przez Ciebie (sekretów nie przenoszę),
   wartości jednoliniowe;
3. podgląd na `next.programo.pl`, porównanie z produkcją: formularz end-to-end (Telegram, Redis, webhook
   CRM), GA4 DebugView, `robots.txt`, `sitemap.xml`, `llms.txt`, nagłówki bezpieczeństwa, obrazy AVIF;
4. Redis: dziś Upstash przez REST, zostaje bez zmian;
5. `src/proxy.ts` i IP klienta: na Coolify za Traefikiem trzeba czytać `x-forwarded-for`, na Vercelu
   `x-vercel-forwarded-for`. Do sprawdzenia w limiterze formularzy i w CAPI;
6. przełączenie DNS (A `programo.pl` → 159.195.206.7) poza godzinami pracy, TTL obniżony dzień wcześniej;
   Vercel zostaje 14 dni jako powrót;
7. sprzątanie obrazów po deployach (znany problem Coolify) dopisane do `disk-guard`.

Koszt: ok. pół dnia pracy plus Twoje 15 minut na env. Moja ocena: migrować, ale dopiero po tym odświeżeniu
i z monitoringiem dostępności z zewnątrz (UptimeRobot lub podobny), bo to jedyna strona, której awaria
kosztuje zapytania.

## Otwarte decyzje dla Wojtka

1. Forma pokazania dem: A, B czy C (rekomendacja C).
2. Migracja na Coolify: tak / nie / później.
3. Opinie klientów: czy wysłać prośby do Jedmaru, WKS i W. Safe.

## Dziennik wdrożenia

### 1.10.2026, wdrożenie 1 (etapy 1–3 i część 4–5)

Zrobione i sprawdzone na buildzie produkcyjnym (`next start`, Chrome headless 320–1440 px oraz panel
przeglądarki):

- portfolio dem: 14 z 22, nowa karta (desktop + telefon), 6 widocznych i „Pokaż pozostałe", przełącznik
  `disclosure` z testem, że tryb koncepcyjny nie zdradza nazwy, hosta ani linku. Podglądy obu wariantów:
  `docs/audits/2026-10/dema-wariant-A-nazwy.jpg` i `dema-wariant-B-koncepcje.jpg`. W trybie koncepcyjnym
  znikają Życie Stolicy i KS Posnania (nazwy nie da się wyciąć z kadru);
- zrzuty: 56 plików dem w jednym standardzie (3,8 MB), realizacje zdjęte ponownie z żywych stron
  (Estalo, Estalo Enterprise, Portal Estalo, Solvio i PoolTimer wyglądały już inaczej niż u nas),
  usunięte 39 nieużywanych plików; `public/screenshots` 11 MB → 6 MB. Bez zmian zostały: Skup
  Nieruchomości (strona główna pokazuje teraz wariant „udziały 1/4" i pasek zgód), Domki Poznaniak
  (strona klienta nie kończy ładowania w headless), PoolTimer mobile (na żywej stronie duże „±5 ms"),
  zrzuty aplikacji Jedmar i kokpit PoolTimera (nie są zwykłym załadowaniem strony);
- P0 reduced motion naprawione w `services-overview.tsx` i `faq.tsx`;
- hero: imię opcjonalne i ukryte na telefonie, link `tel:` pod przyciskiem, ciaśniejsze odstępy; przycisk
  mieści się nad banerem cookies na 375×812 i 390×844. Na 375×667 (iPhone SE) i 320 px nadal jest pod
  banerem, do pierwszego przewinięcia;
- cele dotykowe 44 px: baner cookies, stopka, linki usług, link do realizacji w hero;
- stopka 2 kolumny na 768–1023 px; formularz kontaktowy `p-5` na telefonie;
- `/cennik`: tytuł i H1 pod intencję cenową; opisy meta w zakresie 120–160 znaków na `/`, `/stack`,
  `/blog`, `/wspolpraca`, `/projekty`; puste klastry bloga `noindex`;
- kafel „Strona nie przynosi zapytań" prowadzi do `/strony-internetowe`.

Świadomie nie zrobione w tym wdrożeniu: nowe strony SEO (etap 5), zdania zakresu pod logotypami,
klastry bloga w sitemapie, przeniesienie animacji sekcji z Framer Motion na CSS (punkt 9 audytu Codexa:
duża zmiana, osobny etap z pomiarem Lighthouse przed i po).

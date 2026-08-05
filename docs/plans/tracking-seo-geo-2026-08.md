# Tracking, SEO i GEO — przebudowa warstwy pomiarowej (sierpień 2026)

Stan: **wdrożone na produkcję**, poza pozycjami oznaczonymi jako otwarte.
Zakres: wyłącznie „tył" strony — wygląd, layout i copy bez zmian.

Dokument opisuje: co było, co jest, dlaczego akurat tak, i co zostało do decyzji
Wojtka. Podstawa: research pięciu równoległych przebiegów (GA4/server-side, Meta
CAPI, GEO/AI, technical SEO, product analytics/CRO) — ~90 zweryfikowanych źródeł.

---

## 1. Stan wyjściowy

Nie było „zero trackingu", ale było ok. 25% tego, co ta strona może dawać.

**Było:** GA4 (`G-KT2R144BYG`) + Google Ads (`AW-18196600478`) przez hardkodowany
gtag, Consent Mode v2 poprawnie ustawiony przed gtag.js, Microsoft Clarity po
zgodzie, przechwytywanie gclid/UTM, Enhanced Conversions dla leadów, guard
raz-na-sesję na konwersji Ads, cztery eventy, sitemap, canonicale, `llms.txt`,
JSON-LD `ProfessionalService`.

**Nie było:**

- żadnego Meta Pixela — w Business Managerze **nie istniał ani jeden dataset**;
- niczego po stronie serwera: brak GA4 Measurement Protocol, brak Meta CAPI;
- lejka formularza — wiadomo było tylko o `submit`, nie o tym, ile osób zaczęło
  i porzuciło, na którym polu i przy jakim błędzie;
- Web Vitals, rage/dead clicks, exit intentu, czasu zaangażowania, własnej bazy
  zdarzeń;
- atrybucji poza Google (`fbclid`, `msclkid`, `li_fat_id`), first-touch,
  klasyfikacji referrera;
- polityki crawlerów AI i **jakiegokolwiek pomiaru, czy AI w ogóle czyta stronę**.

**Błędy znalezione przy okazji (wszystkie naprawione):**

| Błąd | Skutek |
|---|---|
| `next build` czerwony — `route.ts` eksportował `contactSchema` | nic się nie wdrażało bez obejścia |
| Clarity bez sygnału `consentv2` | od 31.10.2025 Clarity wymaga tego dla ruchu z EOG; bez tego działał w no-consent mode (nowe ID na każdą odsłonę, brak sesji) — dane z ~9 miesięcy są dziurawe |
| `sameAs` w JSON-LD → `github.com/programo` | konto należy do użytkownika „Aswin" (2015, 0 repo). Naruszenie polityki Google („misrepresent your ownership") i psucie rozstrzygania encji |
| `robots.txt` bez `Disallow` | `/crm` — wewnętrzny panel leadów — był indeksowalny przez wszystkich |
| `sitemap.ts`: `lastModified: new Date()` na każdym URL | timestamp builda na wszystkim; Google traktuje zaufanie do `lastmod` binarnie — raz przyłapane, ignoruje daty w całej sitemapie |
| `llms.txt` z 8 URL-i przy 23 w sitemapie | nieaktualny indeks własnej strony |
| `LenisProvider` + zależność `lenis` | martwy kod, nic go nie importowało |

---

## 2. Co zostało zbudowane

### 2.1 Warstwa analityczna (`src/lib/analytics/`)

- **`events.ts`** — jedno źródło prawdy: 30 zdarzeń, każde z nazwą, listą celów
  (GA4 / Meta / first-party) i uzasadnieniem „po co to mierzymy". Nic nigdzie nie
  odpala surowego stringa — literówka jest błędem typu, nie brakującym raportem.
- **`client.ts`** — dispatcher do trzech celów naraz, z kolejkowaniem i wysyłką
  przez `sendBeacon` przy opuszczaniu strony.
- **`identity.ts`** — ID odwiedzającego i sesji. **Zapisywane dopiero po zgodzie
  na analitykę**; bez zgody żyją tylko w pamięci strony.
- **`attribution.ts`** — first-touch ORAZ last-touch, wszystkie click-id
  (`gclid`/`gbraid`/`wbraid`/`fbclid`/`msclkid`/`ttclid`/`li_fat_id`/`twclid`),
  klasyfikacja referrera z osobnym bucketem **`ai`** (26 hostów asystentów).
- **`engagement.ts`** — rage clicks, dead clicks (przez MutationObserver), exit
  intent, czas realnego zaangażowania, wejścia sekcji, kopiowanie kontaktu,
  błędy JS.
- **`use-form-analytics.ts`** — lejek formularza jako hook.
- **`store.ts`** — własny magazyn na Upstash Redis: paczki zdarzeń + dzienne
  rollupy + osobny log crawlerów AI.

### 2.2 Server-side

- **`POST /api/collect`** — first-party sink. Zawsze 204, filtr botów, rate
  limit, walidacja przez whitelistę nazw zdarzeń. Przetestowany 9 przypadkami
  adversarialnymi (malformed JSON, 1 MB payload, zagnieżdżone śmieci) — wszystkie 204.
- **`server/ga4.ts`** — Measurement Protocol, endpoint **EU**
  (`region1.google-analytics.com`). Zdarzenie serwerowe nazywa się
  `generate_lead_verified`, **nie** `generate_lead` — MP nie ma mechanizmu
  deduplikacji, więc ta sama nazwa z obu stron liczyłaby się podwójnie.
- **`server/meta-capi.ts`** — Conversions API, Graph v25.0.
- **`server/lead-conversions.ts`** — spina oba, odpalane przez `after()` już po
  odpowiedzi, więc użytkownik nigdy nie czeka na Meta ani Google.

### 2.3 Meta

Piksel **nie ładuje się w ogóle** przed zgodą marketingową — samo pobranie
`fbevents.js` ujawnia IP i user agent stronie trzeciej, czyli dokładnie to, co
zgoda ma bramkować. `fbq('consent','revoke')` + kasowanie `_fbp`/`_fbc` zostaje
jako zabezpieczenie przy wycofaniu zgody w trakcie sesji.

Dwie pułapki, na które kod jest odporny (i ma na to testy):

- **telefon dla Meta ≠ telefon dla Google.** Meta chce `48601234567` (bez `+`),
  Google Enhanced Conversions chce E.164 `+48601234567`. Pomylenie po cichu
  obniża match rate.
- **polskie znaki zostają.** Meta wymaga UTF-8, nie transliteracji: `łukasz`, nie
  `lukasz`.
- `fbc`/`fbp`/IP/user-agent idą **niehashowane** — zahashowanie ich zabija
  matching całkowicie.

Przeglądarka i serwer dzielą jeden `event_id`, co powoduje, że Meta scala parę w
jedno zdarzenie zamiast liczyć dwa.

### 2.4 Zgoda

Decyzja o zgodzie jest teraz mirrorowana do **first-party cookie**, bo
`localStorage` jest niewidoczny dla serwera. Serwerowe API konwersji sprawdzają
zgodę z cookie — flaga w body requestu to deklaracja klienta, nie dowód.
Brak cookie = brak zgody (fail-closed).

### 2.5 GEO

- **`robots.ts`** — polityka per silnik odpowiadający + `Disallow: /crm`.
  W komentarzu zapisane rozróżnienie, które większość poradników odwraca:
  crawler treningowy i crawler odpowiadający to **różne user-agenty**
  (`GPTBot` vs `OAI-SearchBot`, `ClaudeBot` vs `Claude-SearchBot`), więc
  zablokowanie pierwszego **nie** usuwa nas z odpowiedzi ChatGPT ani Claude.
- **`/llms.txt`** — generowany z `site-urls.ts` + `projects.ts`, więc nie może się
  rozjechać. W nagłówku pliku napisane wprost, że **żaden duży dostawca AI nie
  jest znany z czytania llms.txt** — zostaje, bo kosztuje zero, nie dlatego, że działa.
- **`src/proxy.ts`** — logowanie crawlerów AI po stronie serwera, z klasyfikacją
  celu (answer / user-fetch / training / search). To musi być serwerowo: **boty AI
  nie wykonują JavaScriptu**, więc GA4, Clarity i `/api/collect` są na nie ślepe.
- **IndexNow** — klucz + submitter w `postbuild`, tylko na deployach produkcyjnych.

### 2.6 Wydajność

- scroll-depth liczony raz na klatkę (`requestAnimationFrame`) zamiast na każde
  zdarzenie scrolla; listenery odpinają się po przekroczeniu ostatniego progu;
- usunięty martwy `lenis`.

**Odrzucone świadomie:**

- **`reactCompiler`** — build rósł z 2,4 s do 31 s, a Turbopack w dev nie potrafił
  rozwiązać `babel-plugin-react-compiler` i zasypywał konsolę błędami. Przy tym
  ruchu strona najprawdopodobniej nie ma danych w CrUX, więc zysk jest
  niemierzalny, a koszty natychmiastowe.
- **first-party proxy dla gtag (Google Tag Gateway)** — Vercela nie ma na liście
  wspieranych dostawców, a ręczny setup wymaga nagłówków geo, których Vercel w
  ścieżce rewrite nie podaje. Zepsute nagłówki geo = zepsute region-specific
  consent defaults, przy zerowym zysku na tym wolumenie.
- **`WebSite` + `SearchAction`** — Google usunął Sitelinks Searchbox w XI 2024.
- **rozbudowa FAQPage pod rich results** — Google wyłączył je 7 maja 2026.
- **PostHog** — dokładałby czwartego procesora danych i nową zgodę; własny
  magazyn first-party pokrywa „widzieć każdy ruch" bez tego. Do rozważenia,
  jeśli zabraknie zapytań ad hoc.

---

## 2.7 Co znalazł przegląd adwersaryjny (i co z tego wynikło)

Pierwsza wersja tej warstwy została zmergowana na produkcję jako „zweryfikowana".
Niezależny przegląd z testami odtwarzającymi znalazł w niej 20 defektów, w tym
trzy poważne. Wszystkie naprawione i potwierdzone na żywym prodzie.

| Defekt | Dlaczego był groźny |
|---|---|
| Atrybucja zapisywana do localStorage **przed zgodą** | ryzyko prawne; `identity.ts` miał bramkę i akapit o RODO, `attribution.ts` nie dostał jej wcale |
| `gclid` ginął przy pierwszej nawigacji klienckiej | w App Routerze `document.referrer` się nie zmienia, więc druga odsłona wyglądała jak nowy touch organiczny i nadpisywała kampanię — **leady z Ads trafiały do CRM jako „direct"** |
| 6 z 31 zdarzeń nigdy nie odpalanych | pusty raport czyta się jako wniosek („nikt nie klika CTA"), a nie jako brak pomiaru |
| `section_view` i `form_view` z ułamkowym progiem IntersectionObservera | próg mierzy się względem ELEMENTU — sekcja 1894 px w oknie 760 px nie mogła go spełnić **nigdy**; najwyższe, najważniejsze sekcje były jedynymi, które nie raportowały |
| `session_summary` przy pierwszym przełączeniu karty i nigdy więcej | dominujący przypadek to kikut z pierwszą odsłoną; reszta wizyty i lead nie trafiały do żadnego podsumowania |
| Formularz w hero bez `prepareLeadConversion()` | piksel i CAPI generowały różne `event_id` → Meta liczyła najbardziej eksponowany formularz **dwa razy** |
| Meta CAPI czytało tylko `META_DATASET_ID` | udokumentowana jest wyłącznie `NEXT_PUBLIC_...`, więc CAPI zgłaszałoby „not configured" w nieskończoność |
| Współczynniki lejka bez clampu | przy wypchniętym buforze dashboard pokazywał „300% konwersji" i „−200% porzuceń" |
| GA4 bez `page_view` przy nawigacji klienckiej | GA4 znał tylko stronę wejścia każdej wizyty |
| Proxy wykluczało `*.txt`/`*.xml` | nie liczyło pobrań `/llms.txt` — dokładnie tych, dla których powstało |
| `/api/collect`: `path` i `ts` bez walidacji, limit w pamięci procesu, bufor 800 paczek | anonim mógł wypchnąć wszystkie prawdziwe sesje i rozdąć hasz dzienny |

**Wniosek procesowy, wart zapamiętania:** wszystko powyżej przechodziło build,
typecheck, lint i 153 testy. Zielona bramka mówi „nic się nie wywala", nie „to
mierzy prawdę". Rzeczy, które wyszły dopiero z uruchomienia w prawdziwej
przeglądarce na produkcji: martwe zdarzenia, próg obserwatora, utrata `gclid`,
brak promocji atrybucji po zgodzie.

## 3. Co wymaga Wojtka

Bez tego kod działa, ale część kanałów jest wyłączona (env pusty = graceful no-op).

| # | Rzecz | Gdzie | Bez tego |
|---|---|---|---|
| 1 | **Utworzyć dataset Meta** i wygenerować token CAPI | Events Manager → Datasets, potem Settings → Conversions API | brak remarketingu i custom audiences; piksel i CAPI śpią |
| 2 | `NEXT_PUBLIC_META_DATASET_ID`, `META_CAPI_ACCESS_TOKEN` | env na Vercelu | j.w. |
| 3 | `GA4_API_SECRET` | GA4 → Admin → Data Streams → Measurement Protocol API secrets | brak serwerowego `generate_lead_verified` |
| 4 | Kod weryfikacyjny Search Console + Bing | `NEXT_PUBLIC_GSC_VERIFICATION`, `NEXT_PUBLIC_BING_VERIFICATION` | brak danych o zapytaniach; IndexNow wymaga wcześniejszej weryfikacji w Bing |
| 5 | **Potwierdzić `linkedin.com/company/programo`** | JSON-LD `sameAs` | LinkedIn zwraca 200 także dla nieistniejących profili — nie dało się zweryfikować automatycznie. Fałszywy `sameAs` szkodzi (patrz GitHub) |
| 6 | Sprawdzić w GA4: **Enhanced measurement → Form interactions** | GA4 → Admin → Data streams | jeśli włączone, GA4 sam wysyła własne `form_start`/`form_submit` i podwoi lejek — **wyłączyć** |
| 7 | Realny NIP / data założenia / forma prawna do JSON-LD | — | pominięte w schemacie zamiast zmyślone |

**Decyzja biznesowa (nie techniczna):**

**Wersja EN nie istnieje dla wyszukiwarek.** i18n jest w pełni klientowe — jeden
URL, przełącznik w JS. Googlebot czyści localStorage między odsłonami i nie
klika przycisków, więc w serwowanym HTML nie ma ani jednego angielskiego zdania.
Stan pośredni jest najgorszy z możliwych: koszt 400+ kluczy w bundlu, zysk zero.

- jeśli klienci anglojęzyczni **nie są celem** → wyciąć przełącznik i i18n z
  warstwy publicznej;
- jeśli **są** → `/en/` + `hreflang` (~1,5–2,5 dnia, statyczność zachowana przez
  `generateStaticParams`).

Nie zrobiłem tego samodzielnie, bo zmienia URL-e i jest decyzją o rynku, nie o kodzie.

**Największa dźwignia GEO leży poza kodem.** Dla marek niszowych ChatGPT cytuje
źródła zewnętrzne w 95,1% przypadków, a stronę marki w 4,9%. Do tego strona ma
dziś **zero cen i zero tabel porównawczych** — łącznie ze stronami `/cennik`
i `/ile-kosztuje-aplikacji`. Kiedy ktoś pyta asystenta „ile kosztuje strona w
Poznaniu", nie ma z programo.pl czego zacytować. Wstawienie realnych widełek to
pojedyncza największa zmiana on-page — ale wymaga Twoich liczb, nie moich.

---

## 4. Jak to sprawdzić

```bash
npm run build && npx tsc --noEmit && npm run lint && npm run test
```

Weryfikacja produkcji:

```bash
curl -s https://programo.pl/robots.txt | grep "Disallow: /crm"
curl -s https://programo.pl/llms.txt | grep -c "programo.pl/projects/"
curl -s -A "OAI-SearchBot/1.0" -o /dev/null -w "%{http_code}\n" https://programo.pl/
```

Po uzupełnieniu env-ów Meta: Events Manager → Test Events, sprawdzić że zdarzenie
`Lead` przychodzi z **dwóch źródeł** (Browser + Server) i jest oznaczone jako
zdeduplikowane. Jeśli widać dwa osobne — `event_id` się rozjeżdża.

Rytuał tygodniowy (przy tym ruchu wart więcej niż dowolny dashboard):
przejrzeć 10 nagrań w Clarity, porównać liczbę `generate_lead` w GA4 z liczbą
rekordów w `/crm` (rozjazd = zepsuty tracking albo zepsuty backend), przejrzeć
`form_error` i `form_abandon` per pole.

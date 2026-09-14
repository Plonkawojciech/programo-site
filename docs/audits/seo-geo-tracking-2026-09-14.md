# Audyt SEO / GEO / dostępności / pomiaru programo.pl

**Data:** 14.09.2026  
**Zakres:** repo `~/Programo/programo-site`, publiczne trasy wskazane przez `site-urls.ts` i `sitemap.ts`, pomiar, techniczne SEO i statyczna dostępność.  
**Metoda:** odczyt kodu z numerami linii, obliczenia metadanych i kontrastów w pamięci, próby `curl`. Bez zmian plików, wysyłania formularzy, builda i PageSpeed API.

**Ograniczenie:** wszystkie próby `curl` zakończyły się błędem DNS środowiska. Raport potwierdza stan kodu; **nie potwierdza kompletnego stanu produkcji**. Przykład:

```text
curl -sSL --max-time 12 -w '\nHTTP=%{http_code}' https://programo.pl/
curl: (6) Could not resolve host: programo.pl
HTTP=000
exit=6
```

Pomocniczy odczyt [strony głównej przez narzędzie WWW](https://programo.pl/) zwrócił treść, lecz nie zastępuje surowego HTML i nagłówków z `curl`.

Git: HEAD `911e62e`. Podczas audytu pojawiły się zmiany innych prac w `package.json`, `package-lock.json`, `scripts/` i `public/screenshots/demos/`; nie ingerowałem w nie. Stan odczytano przez `git --no-optional-locks status --short`.

## Wnioski

1. **P1 — główny wariant CTA traci kontrast po najechaniu.** `hover:bg-primary-container` zachowuje `text-on-primary`: wynik **1,96:1 w dark i 2,25:1 w light**. Dowód: `src/components/ui/cta-button.tsx:8–13`, `src/app/globals.css:49`, `:201`, `:292–295`.
2. **P1 — lejek formularzy pomija hero, a błędy sieciowe części formularzy nie trafiają do pomiaru.** Hero wysyła `generate_lead`, lecz nie używa `useFormAnalytics`; jego `catch` i `catch` QuickContact tylko zmieniają UI. Dowód: `src/components/home/hero.tsx:99–162`, `src/components/quick-contact.tsx:161–164`.
3. **P1 — „Ads raz na sesję” ma wyjątki.** Guard korzysta z `sessionStorage`, ale zapis zgody z `analytics:false` usuwa jego klucz; błąd storage również wyłącza deduplikację. Dowód: `src/lib/tracking.ts:55–72`, `src/lib/consent.tsx:207–214`.
4. **P1 — konwersję serwerową zaplanowano przed potwierdzeniem przyjęcia leada.** Po uzupełnieniu sekretów również zgłoszenie zakończone HTTP 500 może uruchomić CAPI/MP. Obecnie wskazane braki env wyłączają te kanały. Dowód: `src/app/api/contact/route.ts:91–119`, `:304–312`.
5. **P1 — nieistniejący projekt nie wywołuje `notFound()`.** Serwer renderuje stronę bez grafu, a komponent klientowy zwraca `null`. To luka obsługi 404; rzeczywisty status HTTP: **nie zweryfikowano**. Dowód: `src/app/projects/[slug]/page.tsx:117–135`, `src/app/projects/[slug]/ProjectDetailClient.tsx:216–221`.
6. **P2 — generator ucina tytuły projektów w połowie frazy.** Przykłady: „Natywne aplikacje sklepowe iOS i”, „Platforma łącząca klientów z”, „Strona doradcy finansowego, w”. Dowód: `src/app/projects/[slug]/page.tsx:60–75`; dane: `src/lib/projects.ts:71`, `:262`, `:746`.
7. **P2 — metadane społecznościowe nie są kompletne per strona.** Kontakt, portfolio, stack i polityka nie nadpisują OG; większość tras, w tym blog, nie nadpisuje Twitter title/description z layoutu. Dowód: `src/app/layout.tsx:56–70`, `src/app/kontakt/page.tsx:31–36`, `src/app/projekty/page.tsx:28–33`, `src/app/stack/page.tsx:28–33`, `src/app/blog/[slug]/page.tsx:50–62`.
8. **P2 — cennik ma już ceny, ale opis dla maszyn nadal tego nie komunikuje.** `site-urls.ts` przedstawia go jako sam proces wyceny, a `lastModified` pozostaje sierpniową datą sprzed dodania cen. Dowód: `src/components/pricing.tsx:53–89`, `src/lib/site-urls.ts:30–38`, `src/lib/schema/route-dates.ts:22`.
9. **P2 — pięć mapowań Meta jest nieaktywnych.** `copy_contact`, `contact_click`, `select_content`, `pricing_view`, `form_start` mają konfigurację `meta`, ale bez `"meta"` w `to`; dispatcher ich tam nie wysyła. Dowód: `src/lib/analytics/events.ts:79–140`, `src/lib/analytics/client.ts:300–305`.
10. **P2 — wszystkie projekty dostają `SoftwareApplication` z `operatingSystem:"Web"`.** Obejmuje to natywne aplikacje Jedmar oraz realizacje marketingowe. Dowód: `src/app/projects/[slug]/page.tsx:14–20`, `src/lib/schema/software-application.ts:14–24`, `src/lib/projects.ts:73–79`, `:605–666`.

## 1. Strona po stronie

### Metadane z kodu

Zidentyfikowano **29 tras: 15 statycznych, 10 projektów, 4 wpisy**. Źródła: `src/lib/site-urls.ts:23–85`, `src/app/sitemap.ts:16–123`, `src/lib/projects.ts:69–804`, frontmatter czterech plików `src/content/blog/*.mdx:2`.

Dla **każdej trasy w tabeli** wykonano:

```bash
curl -sSL --max-time 12 -w '\nHTTP=%{http_code}' "https://programo.pl<ścieżka>"
```

Wszystkie wyniki: `exit=6`, `HTTP=000`, `Could not resolve host: programo.pl`.

**Legenda:** T/D = długość title/description obliczona z kodu, nie z produkcji; OG/X = własne metadane Open Graph/Twitter; „layout” = brak nadpisania na trasie. Wszystkie wymienione trasy mają w kodzie canonical wskazujący na własny adres HTTPS na domenie apex.

| Trasa | T/D | OG / X | Robots w metadanych trasy | Dowód |
|---|---:|---|---|---|
| `/` | 37/102 | własne / własne | brak deklaracji | `src/app/layout.tsx:27–73` |
| `/oferta` | 50/150 | własne / layout | brak deklaracji | `src/app/oferta/page.tsx:29–43` |
| `/cennik` | 42/150 | własne / layout | brak deklaracji | `src/app/cennik/page.tsx:29–43` |
| `/software-house-poznan` | 58/156 | własne / layout | index, follow | `src/app/software-house-poznan/page.tsx:16–37` |
| `/strony-internetowe` | 60/149 | własne / layout | index, follow | `src/app/strony-internetowe/page.tsx:23–38` |
| `/sklepy-internetowe` | 60/155 | własne / layout | index, follow | `src/app/sklepy-internetowe/page.tsx:26–41` |
| `/strony-tracking-reklamy` | 53/152 | własne / layout | index, follow | `src/app/strony-tracking-reklamy/page.tsx:17–32` |
| `/ile-kosztuje-aplikacji` | 52/157 | własne / layout | index, follow | `src/app/ile-kosztuje-aplikacji/page.tsx:17–32` |
| `/projekty` | 52/154 | layout / layout | brak deklaracji | `src/app/projekty/page.tsx:28–33` |
| `/blog` | 50/119 | własne / layout | brak deklaracji | `src/app/blog/page.tsx:16–33` |
| `/o-nas` | 46/156 | własne / layout | brak deklaracji | `src/app/o-nas/page.tsx:29–43` |
| `/stack` | 47/97 | layout / layout | brak deklaracji | `src/app/stack/page.tsx:28–33` |
| `/kontakt` | 39/125 | layout / layout | brak deklaracji | `src/app/kontakt/page.tsx:31–36` |
| `/wspolpraca` | 52/154 | własne / layout | index, follow | `src/app/wspolpraca/page.tsx:25–40` |
| `/polityka-prywatnosci` | 31/89 | layout / layout | index, follow | `src/app/polityka-prywatnosci/page.tsx:4–15` |
| `/projects/jedmar` | 52/154 | własne / własne | brak deklaracji | P; `src/lib/projects.ts:71` |
| `/projects/estalo` | 51/153 | własne / własne | brak deklaracji | P; `src/lib/projects.ts:186` |
| `/projects/eportal-prawny` | 56/94 | własne / własne | brak deklaracji | P; `src/lib/projects.ts:262` |
| `/projects/wks-poznan` | 58/151 | własne / własne | brak deklaracji | P; `src/lib/projects.ts:326` |
| `/projects/skup-nieruchomosci` | 59/111 | własne / własne | brak deklaracji | P; `src/lib/projects.ts:394` |
| `/projects/rejestr-pro` | 48/63 | własne / własne | brak deklaracji | P; `src/lib/projects.ts:471` |
| `/projects/solvio` | 46/159 | własne / własne | brak deklaracji | P; `src/lib/projects.ts:538` |
| `/projects/domki-poznaniak` | 50/60 | własne / własne | brak deklaracji | P; `src/lib/projects.ts:605` |
| `/projects/pooltimer` | 54/147 | własne / własne | brak deklaracji | P; `src/lib/projects.ts:674` |
| `/projects/wsafefinanse` | 58/136 | własne / własne | brak deklaracji | P; `src/lib/projects.ts:746` |
| `/blog/ile-kosztuje-aplikacja-mobilna-2026` | 53/160 | własne / layout | brak deklaracji | B; odpowiedni MDX:3–10 |
| `/blog/ile-kosztuje-sklep-internetowy-2026` | 53/160 | własne / layout | brak deklaracji | B; odpowiedni MDX:3–10 |
| `/blog/ile-kosztuje-strona-internetowa-mala-firma-2026` | 59/160 | własne / layout | brak deklaracji | B; odpowiedni MDX:3–10 |
| `/blog/next-js-czy-wordpress-strona-firmowa` | 52/160 | własne / layout | brak deklaracji | B; odpowiedni MDX:3–10 |

P = `src/app/projects/[slug]/page.tsx:60–113`; generator wykonano w pamięci na danych repo.  
B = `src/app/blog/[slug]/page.tsx:41–62`; długości obliczono z frontmatter.

W lokalnym zestawie 29 wyników title i description są unikalne. **Unikalności wdrożonych tagów nie zweryfikowano.** Krótka description sama w sobie nie jest błędem; problem jakościowy występuje np. przy Domkach Poznaniak, gdzie wynik brzmi „Domki letniskowe nad morzem w Wiciu. Strony nie budowaliśmy.” i nie opisuje wykonanej usługi. Dowód: P:81–89, `src/lib/projects.ts:605–666`.

Generator bloga ucina opis bez granicy słowa: wyniki zawierają „Rozbudowana aplika...” i „integr...”. Dowód: B:42, odpowiednie MDX:5–10.

### HTML, nagłówki, obrazy i linkowanie

| Kontrola | Wynik |
|---|---|
| Rzeczywisty title, description, canonical, robots i OG/X dla każdej trasy | **Nie zweryfikowano**; wszystkie GET zakończyły się błędem DNS |
| Dokładnie jeden H1 w każdym produkcyjnym HTML | **Nie zweryfikowano** |
| Pełna hierarchia H2/H3 w produkcji | **Nie zweryfikowano** |
| Liczba i poprawność `alt` w każdym produkcyjnym HTML | **Nie zweryfikowano** |
| Liczba przychodzących `href="/<path>"` dla każdej strony | **Nie zweryfikowano**; brak pobranych HTML, nie raportuję zer |
| Duplikaty i rozwiązywanie wszystkich `@id` w produkcyjnym JSON-LD | **Nie zweryfikowano** |

Ustalenia statyczne:

- `/stack` przechodzi z H1 do H3 kart technologii, bez H2; technologie są powielane w dwóch przewijanych rzędach. Dowód: `src/components/tech-stack.tsx:61–63`, `:117–138`.
- `/projekty` również ma H1, a następnie H3 kart. Dowód: `src/components/featured-work.tsx:158`, `:214–250`.
- Formularz kontaktowy ma własny H1 przez `ContactHero`; strony usługowe mają H1 oraz sekcje H2/H3 w JSX. Dowód: `src/app/kontakt/contact-hero.tsx:17`, `src/app/strony-internetowe/page.tsx:161`, `:220–228`.
- Dekoracyjne zdjęcie hero ma `alt=""` i rodzica `aria-hidden`; ramki screenshotów przekazują `alt`, a obraz MDX ma fallback do pustego tekstu. Dowód: `src/components/home/hero.tsx:223–226`, `src/components/ui/browser-frame.tsx:101–103`, `src/components/ui/phone-frame.tsx:63–65`, `src/components/blog/mdx-components.tsx:52–54`.

### JSON-LD z kodu

| Zakres | Typy / relacje | Ocena |
|---|---|---|
| Globalny layout | `ProfessionalService`, `WebSite`, dwie `Person` | Jeden punkt tworzenia encji firmy: `src/app/layout.tsx:96` |
| Firma i założyciele | Stabilne `#organization`, `#website`, `#person-*` | Referencje korzystają ze wspólnych stałych: `src/lib/schema/constants.ts:7–10`, `people.ts:16–33`, `website.ts:9–16` |
| Typowe podstrony | `WebPage`, `BreadcrumbList` | Np. `src/app/cennik/page.tsx:14–26`, `src/app/projekty/page.tsx:13–25` |
| Landingi usługowe | Dodatkowo `Service`, `FAQPage` | Np. `src/app/strony-internetowe/page.tsx:70–96` |
| Artykuł kosztowy | `Article`, `WebPage`, FAQ, breadcrumbs | `src/app/ile-kosztuje-aplikacji/page.tsx:110–130` |
| Projekty | `SoftwareApplication`, `WebPage`, breadcrumbs | Typ i system operacyjny są narzucone wszystkim projektom: P:12–35, `software-application.ts:17–22` |
| Blog | `BlogPosting`, `WebPage`, FAQ, breadcrumbs | Autor wskazuje globalną `Person`: B:82–108, `src/lib/schema/article.ts:47–65` |
| FAQ | Pytania i odpowiedzi zagnieżdżone, bez własnych `@id` | Nie tworzy to samo w sobie zerwanych referencji: `src/lib/schema/faq.ts:14–21` |

Nie znaleziono dodatkowego wywołania `buildOrganization()` poza layoutem. To ustalenie dotyczące kodu, nie liczby encji w wdrożonym HTML. Dowód: `src/lib/schema/organization.ts:20`, `src/app/layout.tsx:96`.

## 2. GEO / AIO

### Treść serwerowa i cytowalność

| Obszar | Ustalenie i dowód |
|---|---|
| Treść komponentów klientowych | `use client` nie oznacza tutaj automatycznie braku treści w renderze. Hero, FAQ i pozostałe sekcje są montowane bez warunku oczekiwania na efekt: `src/app/page.tsx:47–58`; porównania z surowym HTML **nie zweryfikowano** |
| FAQ homepage | Wszystkie odpowiedzi znajdują się wewnątrz `details`, niezależnie od otwarcia. Schema i UI korzystają z tych samych sześciu kluczy PL: `src/components/home/faq.tsx:29–35`, `:77–108`; `faq-schema.tsx:17–35` |
| Cennik | Wszystkie trzy kategorie renderują się przez `map`; zakładki zmieniają `hidden`, nie obecność treści: `src/components/pricing.tsx:216–250` |
| Ceny | Strona 2–6 tys. zł, sklep Woo/Shopify 4–8 tys. zł, aplikacja mobilna 4–8 tys. zł; kod oznacza je jako netto. Są to kwoty publikowane w repo, nie niezależna weryfikacja oferty: `pricing.tsx:63–67`, `src/lib/i18n/dictionaries/pricing.ts:76–96` |
| Semantyka cennika | Wizualna „tabela” to `ul/li`, nie HTML `table`: `src/components/pricing.tsx:226–250` |
| Blog | Blok odpowiedzi, MDX i FAQ renderowane na serwerze: `src/app/blog/[slug]/page.tsx:181–195`; porównanie technologii ma tabelę: `src/content/blog/next-js-czy-wordpress-strona-firmowa.mdx:48–57` |
| „Ile kosztuje…” | Artykuł mobilny odpowiada głównie czasem realizacji i opłatami platform, bez ceny wykonawcy w bloku odpowiedzi: `src/content/blog/ile-kosztuje-aplikacja-mobilna-2026.mdx:5–10` |
| Kim jesteśmy / gdzie | Firma, adres, KRS/NIP, telefon i założyciele mają wspólne dane: `src/lib/company.ts:13–32`, `:49–51`, `src/lib/schema/organization.ts:24–62` |
| Dla kogo | Opis firmy wymienia usługi, a program poleceń ma osobną sekcję „Dla kogo to jest”: `organization.ts:27–36`, `src/app/wspolpraca/page.tsx:280` |
| Wersja EN | Serwer domyślnie wybiera PL; EN i `html.lang` zmienia klient na podstawie localStorage. Brak osobnych adresów EN w badanym rejestrze: `src/lib/i18n/index.tsx:21–33`, `src/lib/site-urls.ts:23–85` |
| Animacje | `Reveal` startuje z `opacity:0`, a ujawnienie i fallback zależą od JS. Treść pozostaje dzieckiem komponentu, lecz widoczności przy wyłączonym JS **nie zweryfikowano**: `src/components/ui/reveal.tsx:27–44` |

### `llms.txt`, sitemap i boty

- Kod `llms.txt` obejmuje strony statyczne, wszystkie projekty i wszystkie wpisy. Jedyną celowo pominiętą trasą z badanego zestawu jest polityka prywatności: `src/app/llms.txt/route.ts:29–50`, `src/lib/site-urls.ts:81–84`.
- Sitemap nadal ma osobno wpisaną listę tras statycznych. Stwierdzenie w `llms.txt`, że oba pliki korzystają z tego samego źródła, nie jest w pełni prawdziwe: `src/app/sitemap.ts:16–105`, `src/app/llms.txt/route.ts:83`.
- `allPublicUrls()` nie uwzględnia postów blogowych, mimo nazwy sugerującej wszystkie strony: `src/lib/site-urls.ts:88–93`. Nie jest to dowód braków w samej sitemapie, która dodaje posty osobno.
- Poza wymaganym zestawem istnieją klastry bloga. Generator tworzy również zaplanowane, puste klastry; sitemap i `llms.txt` ich nie wymieniają. Dowód: `src/app/blog/klaster/[cluster]/page.tsx:12–16`, `:62–75`, `src/app/sitemap.ts:118–123`, `src/app/llms.txt/route.ts:47–50`.
- `robots.ts` dopuszcza boty odpowiadające, m.in. OAI-SearchBot, Claude-SearchBot i PerplexityBot; dla nich i `*` blokuje `/crm` i `/api/`. Nie ma osobnej blokady botów treningowych. Dowód: `src/app/robots.ts:23–60`.
- Jest serwerowy log rozpoznanych crawlerów i zapis do magazynu przez `after()`. Nie sprawdzono rzeczywistych wizyt ani autentyczności botów: `src/proxy.ts:19–35`.

### FAQ schema a treść

Homepage i blog korzystają ze wspólnych danych dla UI i schema. Landingi stron/sklepów również renderują lokalne `faqs`. Dowód: `home/faq-schema.tsx:27–35`, B:107 i :195, `src/app/strony-internetowe/page.tsx:96`, `:317–321`, `src/app/sklepy-internetowe/page.tsx:91`, `:299–303`.

Na stronie marketingowej występują **różnice redakcyjne**, nie stwierdzona sprzeczność znaczenia: schema mówi „dokładnie tak pracujemy…” i „realne stawki”, UI „Tak właśnie pracujemy…” i „aktualne stawki”. Dowód: `src/app/strony-tracking-reklamy/page.tsx:45–56`, `src/lib/i18n/dictionaries/marketing.ts:72–84`.

### Pięć największych dźwigni

Kolejność jest rekomendacją wynikającą z audytu, nie prognozą wzrostu ruchu.

1. **Połączyć istniejące ceny z odpowiedziami na pytania kosztowe.** Uzupełnić bloki odpowiedzi i linkowanie do cennika, korzystając z zaakceptowanych kwot i zakresów. Dowód luki: `pricing.tsx:63–67` kontra `ile-kosztuje-aplikacja-mobilna-2026.mdx:5–10`.
2. **Ujednolicić zakresy i terminy między cennikiem a poradnikami.** Cennik opisuje iOS+Android jako 6 tygodni, artykuł jedną platformę jako 6–8 tygodni; należy wyjaśnić różnicę zakresu. Dowód: `src/lib/i18n/dictionaries/pricing.ts:95–96`, wskazany MDX:6–8.
3. **Poprawić opis realizacji dla maszyn.** Dobrać typ schema do aplikacji, strony lub usługi marketingowej i nie narzucać wszystkim `Web`. Dowód: P:14–20, `src/lib/schema/software-application.ts:17–22`.
4. **Odświeżyć opisy indeksów i daty zmian.** `llms.txt` powinien komunikować obecność cen, a `lastModified` odpowiadać zmianom treści. Dowód: `src/lib/site-urls.ts:30–38`, `src/lib/schema/route-dates.ts:22`, `src/components/pricing.tsx:53–67`.
5. **Rozbudować treści o dane z realizacji przed mnożeniem pustych klastrów.** Kod ma klaster „Własne dane”, ale cztery obecne wpisy należą wyłącznie do kosztów i porównań. Dowód: `src/lib/blog/planned-clusters.ts:7–11`, cztery pliki `src/content/blog/*.mdx:11`. Publikować tylko liczby ze sprawdzalnym źródłem.

## 3. Pomiar

### Dispatcher i kanały

Ścieżka klientowa: wywołanie → `track()` → GA4 / Meta / kolejka first-party. GA4 otrzymuje wywołania niezależnie od zgody, a stan zgody przekazuje Consent Mode. Meta wymaga `"meta"` w `to` i zgody marketingowej; first-party wymaga zgody analitycznej. Dowód: `src/lib/analytics/client.ts:266–318`.

Kolejka wysyła `/api/collect` przez `fetch` lub `sendBeacon`; API waliduje nazwy i zapisuje paczkę w Redis. **HTTP 204 nie potwierdza zapisu**: endpoint zwraca go również dla odrzuconych danych, a magazyn bez Redis pomija zapis. Dowód: `client.ts:90–125`, `src/app/api/collect/route.ts:34–85`, `src/lib/analytics/collect-schema.ts:7–9`, `src/lib/analytics/store.ts:69–94`.

### Wszystkie zdarzenia taksonomii

G = GA4, F = first-party, M = Meta Pixel. Są to ścieżki w kodzie, nie potwierdzenie odbioru przez dostawcę.

| Zdarzenie | Kanały | Miejsce wywołania |
|---|---|---|
| `page_view_spa` | F | `src/lib/analytics/client.ts:348` |
| `session_context` | F | `src/lib/analytics/client.ts:360` |
| `scroll_depth` | G, F | `src/components/analytics-tracker.tsx:135` |
| `engaged_time` | G, F | `src/lib/analytics/engagement.ts:172` |
| `section_view` | F | `src/lib/analytics/engagement.ts:246` |
| `rage_click` | G, F | `src/lib/analytics/engagement.ts:68` |
| `dead_click` | F | `src/lib/analytics/engagement.ts:96` |
| `exit_intent` | F | `src/lib/analytics/engagement.ts:115` |
| `copy_contact` | G, F; Meta nieaktywne | `src/lib/analytics/engagement.ts:294–296` |
| `cta_click` | G, F | `src/components/analytics-tracker.tsx:86` |
| `contact_click` | G, F; Meta nieaktywne | `src/components/analytics-tracker.tsx:100–104` |
| `select_content` | G, F; Meta nieaktywne | `src/lib/tracking.ts:236–241`, np. `src/components/home/client-work.tsx:146` |
| `faq_open` | F | `src/components/home/faq.tsx:87` |
| `pricing_view` | G, F; Meta nieaktywne | `src/components/pricing.tsx:129` |
| `outbound_click` | F | `src/components/analytics-tracker.tsx:107` |
| `language_switch` | F | `src/lib/i18n/index.tsx:43` |
| `theme_switch` | F | `src/lib/theme.tsx:38` |
| `form_view` | F | `src/lib/analytics/use-form-analytics.ts:55` |
| `form_start` | G, F; Meta nieaktywne | `src/lib/analytics/use-form-analytics.ts:102` |
| `form_field_complete` | F | `src/lib/analytics/use-form-analytics.ts:144` |
| `form_error` | G, F | `src/lib/analytics/use-form-analytics.ts:164` |
| `form_field_skip` | F | `src/lib/analytics/use-form-analytics.ts:134` |
| `form_abandon` | G, F | `src/lib/analytics/use-form-analytics.ts:79` |
| `form_submit_failed` | G, F | `src/components/compact-lead-form.tsx:140`, `:161`; QuickContact:137; hero:149 |
| `generate_lead` | G, F, M=`Lead` | `src/lib/tracking.ts:183–196` |
| `web_vitals` | G, F | `src/components/web-vitals.tsx:44–57` |
| `js_error` | F | `src/lib/analytics/engagement.ts:307–313` |
| `ai_referral` | G, F | `src/lib/analytics/client.ts:372–373` |
| `page_not_found` | G, F | `src/app/not-found.tsx:19` |
| `consent_update` | F, tylko przy analytics=true | `src/lib/consent.tsx:196–206` |
| `session_summary` | F | `src/lib/analytics/client.ts:226–253` |

Źródło konfiguracji wszystkich kanałów: `src/lib/analytics/events.ts:35–205`.

Dodatkowe granice pomiaru:

- `pricing_view` obserwuje **całą sekcję** z progiem 35%. Jeżeli sekcja jest wyższa niż około 2,86 wysokości viewportu, próg nie może zostać osiągnięty. Rzeczywistych wymiarów nie zweryfikowano. Dowód: `src/components/pricing.tsx:123–145`.
- `consent_update` nie mierzy odrzuceń analityki; nie można na jego podstawie policzyć pełnego współczynnika akceptacji. Dowód: `src/lib/consent.tsx:190–207`.
- `session_context` wywoływany jest przy montowaniu trackera; przy braku zgody first-party go odrzuca. Ścieżka przyznania zgody nie odtwarza tego zdarzenia. Dowód: `analytics-tracker.tsx:66–69`, `client.ts:307–318`, `consent.tsx:196–206`.
- Meta `PageView` działa osobno od taksonomii, po zgodzie i przy zmianie ścieżki. Dowód: `src/components/meta-pixel.tsx:68–72`.

### Formularze

| Strona | Identyfikatory | `trackLead` / lejek |
|---|---|---|
| Homepage | `hero-phone`, `home-bookend` | oba mają `trackLead`; hero bez hooka lejka |
| Kontakt | `kontakt-compact`, `kontakt-full` | oba przez wspólne formularze |
| Strony | `strony-hero`, `strony-compact`, `strony-full` | przez wspólne formularze |
| Sklepy | `sklepy-hero`, `sklepy-compact`, `sklepy-full` | przez wspólne formularze |
| Marketing | `marketing-hero`, `marketing-compact`, `marketing-full` | przez wspólne formularze |
| Artykuł kosztowy | `koszt-artykul` | CompactLeadForm |

Identyfikatory są unikalne w znalezionych montowaniach. Dowody: `src/components/home/hero.tsx:143–158`, `home/contact-bookend.tsx:13`, `src/app/kontakt/page.tsx:45–47`, `src/app/strony-internetowe/page.tsx:195`, `:259`, `:348`, `src/app/sklepy-internetowe/page.tsx:204`, `:287`, `:330`, `src/components/marketing-tracking.tsx:84`, `:150`, `:190`, `src/app/ile-kosztuje-aplikacji/page.tsx:222`.

Wspólne formularze wołają `trackLead` dopiero po `res.ok`, przekazując `formId`, dane kontaktowe i wspólny `event_id`: `src/components/compact-lead-form.tsx:116–155`, `src/components/quick-contact.tsx:112–156`.

Formularz logowania CRM nie jest formularzem leadowym: `src/app/crm/LoginForm.tsx:62`.

### Google Ads i Enhanced Conversions

- Konwersja Ads ma wartość 500 PLN i `transaction_id=eventId`. Dowód: `src/lib/tracking.ts:28–46`.
- Guard oznacza sesję karty przeglądarki, nie 30-minutową sesję analityczną. Pierwszy submit wywołuje konwersję i zapisuje klucz; kolejne nadal wysyłają `generate_lead` z flagą `duplicate`. Dowód: `tracking.ts:55–72`, `:175–203`.
- Brak zgody marketingowej blokuje **Enhanced Conversions**, ale nie samo wywołanie konwersji Ads; jej zachowaniem steruje Consent Mode. Dowód: `tracking.ts:111–119`, `:198–203`, `src/app/layout.tsx:118`.
- EC otrzymują telefon z hero/CompactLeadForm i telefon lub e-mail z QuickContact; normalizacja telefonu dodaje m.in. `+48` dla dziewięciu cyfr. Dowód: `tracking.ts:88–119`, `compact-lead-form.tsx:151–155`, `quick-contact.tsx:151–156`, `home/hero.tsx:158`.
- Dane przekazywane są przez `gtag("set","user_data",...)` przed konwersją. **Odbioru, hashowania na przewodzie i match rate nie zweryfikowano.**

### Skutki znanych braków env

| Brak | Dokładny skutek w kodzie |
|---|---|
| `MS_GRAPH_*`, `LEAD_MAIL_FROM` | `getGraphConfig()` zwraca `null`; brak powiadomienia e-mail. Dowód: `src/lib/mail/graph.ts:60–73` |
| `LEAD_MAIL_TO` | Samodzielnie nie wyłącza kanału: odbiorca ma fallback do `LEAD_MAIL_FROM`. Dowód: `graph.ts:65–67` |
| `META_CAPI_ACCESS_TOKEN` | Martwy **serwerowy `Lead`** w Meta CAPI; browser Pixel nie zależy od tego sekretu. Dowód: `meta-capi.ts:153–168`, `lead-conversions.ts:58–65`, `src/components/meta-pixel.tsx:17–26` |
| `GA4_API_SECRET` | Martwy **`generate_lead_verified`** z Measurement Protocol; klientowe `generate_lead` pozostaje osobną ścieżką. Dowód: `src/lib/analytics/server/ga4.ts:39–61`, `:143`, `src/lib/tracking.ts:183` |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Brak tagu weryfikacji Google z tej konfiguracji. Nie dowodzi braku weryfikacji DNS. Dowód: `src/app/layout.tsx:77–78` |
| `NEXT_PUBLIC_BING_VERIFICATION` | Brak `msvalidate.01`. Nie dowodzi braku innych metod weryfikacji. Dowód: `layout.tsx:86–88` |

MP wymaga także `GA4_MEASUREMENT_ID` lub `NEXT_PUBLIC_GA4_ID`; samo dodanie sekretu nie wystarczy bez jednego z tych identyfikatorów. Ich obecności nie sprawdzano: `src/lib/analytics/server/ga4.ts:39–42`.

### Co dzieje się z leadem bez Graph

Brak Graph **nie jest cichy**: route wykonuje `console.error("[contact] Microsoft Graph mail not configured…")`. Funkcja `sendLeadMail()` przy bezpośrednim wywołaniu bez konfiguracji zwraca `{ok:false,error:"not configured"}`. Dowód: `src/app/api/contact/route.ts:274–281`, `src/lib/mail/graph.ts:190`.

Niezależnie od Graph kod próbuje zapisu w Redis, przekazania do CRM oraz powiadomienia Telegram. Dowód: `contact/route.ts:121–187`, `:199–250`.

| Wynik kanałów | Odpowiedź API |
|---|---|
| Zapisano leada, powiadomienia zawiodły | sukces oraz log „stored but NO notification channel delivered” |
| Nie zapisano, ale przynajmniej jedno powiadomienie się udało | sukces |
| Ani zapis, ani powiadomienie się nie udały | HTTP 500 oraz log `lead … LOST` |

Dowód: `src/app/api/contact/route.ts:284–321`. Rzeczywistego zapisu leada i dostarczenia powiadomień **nie zweryfikowano**.

## 4. Techniczne SEO

| Kontrola | Wynik / dowód |
|---|---|
| Nagłówki w konfiguracji | `nosniff`, `SAMEORIGIN`, Referrer-Policy, Permissions-Policy, HSTS; `poweredByHeader:false`: `next.config.ts:7–22`, `:46–47` |
| CSP | Brak, świadomie opisany w komentarzu. To fakt konfiguracji, nie ustalona luka SEO: `next.config.ts:3–6` |
| Redirecty i trailing slash | Brak własnego `redirects()` i ustawienia `trailingSlash` w `next.config.ts:21–49`; zachowania platformy **nie zweryfikowano** |
| Obrazy | AVIF/WebP, minimalny TTL 30 dni, dwa dopuszczone hosty zewnętrzne: `next.config.ts:32–44` |
| `lastModified` | Stałe daty, bez daty bieżącego builda: `src/app/sitemap.ts:19–120` |
| Aktualność dat | `/cennik` ma `2026-08-03`, choć kod cen opisuje rewizję 12.08; Jedmar ma datę 03.08 mimo zmiany treści w Git 07.08: `route-dates.ts:22`, `pricing.tsx:53–67`, `projects.ts:77–83`, `:139` |
| Blog index | Stałe `2026-08-08`, mimo wpisów datowanych 12.08: `route-dates.ts:40`, `src/content/blog/ile-kosztuje-sklep-internetowy-2026.mdx:13` |
| Ogólne 404 | Jest komponent 404 i zdarzenie pomiarowe; title zmienia dopiero efekt klientowy: `src/app/not-found.tsx:14–29` |
| Nieistniejący projekt | Brak `notFound()`, opisany we wnioskach; status produkcyjny nieznany |
| Cache `llms.txt` | Kod ustawia `public, max-age=0, must-revalidate`: `src/app/llms.txt/route.ts:86–90`; nagłówka produkcyjnego nie potwierdzono |
| Fonty | Archivo, `latin` i `latin-ext`, `display:"swap"`, `preload:true`; body korzysta ze stosu systemowego: `src/app/layout.tsx:19–25`, `src/app/globals.css:304–308` |
| Rozmiar HTML homepage | **Nie zweryfikowano**; GET nie zwrócił dokumentu |
| Największe chunki JS i ich cache | **Nie zweryfikowano**; brak HTML z adresami aktualnych chunków |
| Rzeczywiste preloads fontów | **Nie zweryfikowano**; ustawienie w kodzie nie jest pomiarem wdrożonego HTML |

Historia Git potwierdziła: `pricing.tsx` → `30c2fdf`, `2026-08-12T12:38:19+02:00`; `projects.ts` → `e68cf7c`, `2026-08-07T04:45:01+02:00`. Odczyt: `git log -1 --format='%h %cI %s' -- <plik>`.

Dla poniższych adresów wykonano `curl -sSI --max-time 12 "<URL>"`. Każdy zakończył się `exit=6`, bez nagłówków:

| Adres | Co pozostaje niezweryfikowane |
|---|---|
| `http://programo.pl` | HTTP → HTTPS |
| `https://www.programo.pl` | www → apex |
| `http://www.programo.pl` | łańcuch przekierowań |
| `https://programo.pl/kontakt/` | normalizacja końcowego ukośnika |
| `https://programo.pl/audyt-nieistniejaca-20260914` | status ogólnego 404 |
| `https://programo.pl/projects/audyt-nieistniejacy-20260914` | status nieistniejącego projektu |
| `/robots.txt`, `/llms.txt`, `/sitemap.xml` na domenie HTTPS | status, cache i zgodność wdrożonych plików z kodem |

## 5. Dostępność — kontrola statyczna

### Kontrasty

Obliczenia z sRGB i luminancji względnej; dla przezroczystości najpierw złożono kolor tekstu z tłem. Podstawą oceny zwykłego tekstu jest próg 4,5:1 opisany przez [W3C, SC 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

Źródła kolorów: `src/app/globals.css:5–76`, `:92–95`, `:176–214`, `:230–233`; mapowanie klas: `:290–298`.

| Para | Dark | Light | Ocena zwykłego tekstu |
|---|---:|---:|---|
| Główny tekst / body | 14,40:1 | 17,17:1 | przechodzi |
| Muted / body | 7,61:1 | 8,75:1 | przechodzi |
| Muted / karta | 6,78:1 | 8,75:1 | przechodzi |
| Error / body | 6,21:1 | 6,47:1 | przechodzi |
| Alt-muted / alt-bg | 5,42:1 | 7,61:1 | przechodzi |
| Muted 70% / body | 4,39:1 | 3,96:1 | nie przechodzi |
| Muted 60% / body | 3,58:1 | 3,12:1 | nie przechodzi |
| Muted 50% / body | 2,89:1 | 2,50:1 | nie przechodzi |
| Tekst głównego CTA / tło hover | 1,96:1 | 2,25:1 | nie przechodzi |

Konkretny przypadek muted 70%: tekst `text-sm` na stronie 404, `src/app/not-found.tsx:26–29`. Konkretny przypadek hover: `src/components/ui/cta-button.tsx:8–13`. Nie są to pomiary screenshotów ani wszystkich złożonych teł strony.

### Focus, ARIA i struktura

| Obszar | Wynik i dowód |
|---|---|
| Język | `lang="pl"` w HTML; klient aktualizuje go po zmianie języka: `src/app/layout.tsx:104`, `src/lib/i18n/index.tsx:30–33` |
| Skip-link | Jest link do `#main-content`, ujawniany na focus: `src/components/providers.tsx:44–53` |
| Focus globalny | Outline 2 px w kolorze primary, offset 2 px: `src/app/globals.css:364–367` |
| Nawigacja | Nazwa regionu i `aria-current`; menu mobilne ma `aria-expanded`/`aria-controls`: `src/components/navbar.tsx:195–215`, `:313–315` |
| Menu mobilne | Kod obsługuje Escape, pętlę Tab i powrót focusu. Zachowania realnego nie sprawdzano: `navbar.tsx:98–143` |
| Język etykiet | „Toggle theme” i „Toggle menu” są po angielsku także w PL: `navbar.tsx:265`, `:313`, `:355` |
| Formularze | Label, `aria-invalid`, `aria-describedby`, komunikaty `role="alert"`; sukces ma `role="status"`: `compact-lead-form.tsx:174–175`, `:198–219`; `quick-contact.tsx:250–251`, `:323–344` |
| Focus po sukcesie | Hero i QuickContact przenoszą focus na komunikat: `home/hero.tsx:65–69`, `quick-contact.tsx:64–69` |
| Zakładki cen | Są role tablist/tab/tabpanel i relacje ARIA, ale przyciski nie mają obsługi strzałek ani zarządzania `tabIndex`: `pricing.tsx:189–223` |
| Filtry portfolio | Stan aktywny opisuje klasa CSS; brak `aria-pressed` na przyciskach: `featured-work.tsx:225–239` |
| Hierarchia | Przeskoki H1 → H3 na `/stack` i `/projekty`, opisane w sekcji 1 |
| Ograniczenie ruchu | Globalne skrócenie animacji i wyłączenie smooth scroll przy reduced motion: `src/app/globals.css:355–360`; pełnego działania nie zweryfikowano |

## Co poprawić w kodzie

| Priorytet | Konkretna zmiana |
|---|---|
| P1 | W `src/components/ui/cta-button.tsx:12` dobrać parę tekst/tło dla hover; sprawdzić analogiczne `hover:bg-primary-container`, np. `src/components/featured-work.tsx:264` |
| P1 | Podłączyć `useFormAnalytics("hero-phone")` do hero oraz raportowanie błędów sieciowych w `hero.tsx:159` i `quick-contact.tsx:161` |
| P1 | Uporządkować zakres guardu Ads w `tracking.ts:55–72` i reset w `consent.tsx:207–214`; nie gwarantować deduplikacji ponad możliwości storage |
| P1 | Przenieść zaplanowanie konwersji w `api/contact/route.ts:91` za warunek potwierdzający przyjęcie zgłoszenia |
| P1 | Dodać `notFound()` dla nieznanego projektu w `src/app/projects/[slug]/page.tsx:123`; sprawdzić HTTP 404 i brak indeksowalnej pustej strony |
| P2 | Dodać jawne krótkie tytuły/opisy projektów zamiast mechanicznego cięcia w P:60–89; dla bloga wprowadzić osobną description lub cięcie na granicy słowa w B:42 |
| P2 | Uzupełnić własne OG i Twitter metadata dla tras z dziedziczeniem; źródłem mają być te same title/description co metadata strony |
| P2 | Uzgodnić pięć nieaktywnych mapowań Meta w `events.ts:79–140`: dodać kanał zgodnie z celem albo usunąć mylącą konfigurację; `pricing_view` obserwować na krótszym elemencie |
| P2 | Zaktualizować `route-dates.ts`, `Project.updatedAt`, opis cennika w `site-urls.ts`; wyprowadzić statyczne URL-e sitemap i `llms.txt` ze wspólnego rejestru |
| P2 | Rozdzielić typy schema projektów i systemy operacyjne w `schema/software-application.ts` oraz P:14–20 |
| P2 | Ujednolicić źródło FAQ marketingowego; odpowiedzi kosztowe powiązać z istniejącym cennikiem i jasno opisanym zakresem |
| P2 | Poprawić kontrast muted 70%, nagłówki kart, `aria-pressed` filtrów, obsługę klawiatury zakładek i polskie nazwy przycisków nawigacji |

## Nie zweryfikowano

| Brak dowodu | Jak sprawdzić |
|---|---|
| Produkcyjny HTML wszystkich 29 tras | Powtórzyć GET `curl` poza środowiskiem z błędem DNS; sparsować właściwe elementy HTML, pomijając treść skryptów |
| Linki przychodzące | Zsumować dokładne `href="/<path>"` we wszystkich pobranych dokumentach; osobno podać wariant bez linków strony do siebie |
| Produkcyjne metadata, H1/H2/H3, alt, JSON-LD | Dla każdego dokumentu policzyć tagi, porównać title/description, zebrać definicje i referencje `@id`; porównać FAQ z widocznym tekstem |
| Redirecty, 404, cache, rozmiary HTML i JS | Powtórzyć wskazane HEAD/GET; wyciągnąć rzeczywiste URL-e chunków z HTML i wykonać `curl -sI` oraz GET mierzący liczbę bajtów |
| Treść bez JavaScriptu | Wyłączyć JS i sprawdzić hero, FAQ, cennik, portfolio oraz treści osłonięte przez `Reveal` |
| Odbiór zdarzeń i EC | Tag Assistant, GA4 DebugView i Meta Test Events; porównać ten sam `event_id`, dwa submity, odmowę i zmianę zgody |
| Konfiguracja GA4/Ads | Sprawdzić kluczowe zdarzenia, Enhanced Measurement dla formularzy i SPA oraz ustawienie liczenia konwersji Ads „Jedna” |
| Dostarczenie leada | Po osobnej autoryzacji testowej wysyłki porównać odpowiedź API, rekord Redis/CRM, Telegram i log Graph |
| Weryfikacja GSC/Bing i LinkedIn `sameAs` | Sprawdzić własność w panelach i rzeczywisty profil organizacji; brak meta tagu nie rozstrzyga własności |
| Indeksacja, cytowania AI i aktualność cen zewnętrznych w blogu | GSC/Bing, logi crawlerów, ręczne zapytania oraz ponowny odczyt źródeł podanych w artykułach |
| Dostępność interaktywna | Klawiatura i VoiceOver: menu, formularze, zakładki, filtry, focus po błędzie/sukcesie; oba motywy i powiększenie |
| CWV i wydajność użytkowników | Odczytać rzeczywiste zdarzenia `web_vitals` lub dostępne dane terenowe; PageSpeed API zgodnie z zakazem nie używano |
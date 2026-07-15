# Content deck — redesign programo.pl (2026-07)

Kompletne teksty PL + EN dla wszystkich sekcji i stron. Agenci implementujący biorą treści 1:1
z tego pliku (przez klucze i18n). Zasady językowe: brief sekcja 8. Jedyna obietnica czasu:
**„Odpowiadamy w 24 h"**. Telefony: Bartosz Kolaj 509 123 434 (sprzedaż/hero CTA),
Wojciech Płonka 797 222 363. Zero wykrzykników w copy sprzedażowym, zero emotek.

---

## 1. Homepage

### 1.1 Hero

**H1**
- PL: Budujemy aplikacje, sklepy i strony, które przynoszą klientów — i udowadniamy to w liczbach.
- EN: We build apps, stores, and websites that bring in customers — and we prove it with numbers.

**Zdanie pod H1**
- PL: Programo to dwóch inżynierów z Poznania. Projektujemy, programujemy i wdrażamy sami — od natywnych aplikacji w App Store i Google Play po kampanie Google Ads z pełnym pomiarem konwersji.
- EN: Programo is two engineers from Poznan. We design, build, and ship everything ourselves — from native apps on the App Store and Google Play to Google Ads campaigns with full conversion tracking.

**CTA**
- Primary — PL: `Zadzwoń: 509 123 434` · EN: `Call us: +48 509 123 434`
- Secondary — PL: `Bezpłatna konsultacja` (scroll do formularza) · EN: `Free consultation`
- SLA pod CTA — PL: `Odpowiadamy w 24 h` · EN: `We reply within 24 hours`

**Formularz hero (CompactLeadForm, formId `home-hero`)**
- Nagłówek — PL: `Zostaw numer — oddzwonimy w 24 h z konkretami.` · EN: `Leave your number — we'll call back within 24 hours with specifics.`

### 1.2 Pasek zaufania

**Nagłówek (opcjonalny, mały)**
- PL: Zaufali nam
- EN: Trusted by

**Lista klientów:** Jedmar · WKS Poznań · W. Safe Finance · Skup Nieruchomości · Domki Poznaniak

**3 liczby (count-up, wszystkie prawdziwe):**
1. PL: `2` — natywne aplikacje w App Store i Google Play · EN: `2` — native apps on the App Store and Google Play
2. PL: `10+` — produktów i wdrożeń · EN: `10+` — products and deployments
3. PL: `24 h` — tyle czekasz na naszą odpowiedź · EN: `24 h` — the longest you'll wait for our reply

### 1.3 Oferta — 4 filary

**Nagłówek sekcji**
- PL: Co robimy
- EN: What we do

**Zdanie wprowadzające**
- PL: Cztery obszary, w których pracujemy na co dzień. Każdy poparty wdrożeniem, które możesz obejrzeć.
- EN: Four areas we work in every day. Each backed by a deployment you can see for yourself.

**Filar 1 — Aplikacje webowe i SaaS** (link: /oferta)
- Tytuł PL: Aplikacje webowe i SaaS · EN: Web applications and SaaS
- Opis PL: Systemy, na których firma pracuje codziennie: CRM-y, panele, platformy z płatnościami i kontami użytkowników. Budujemy je tak, żeby dane wielu klientów były od siebie twardo odizolowane, a system rósł razem z biznesem.
- Opis EN: Systems a company works in every day: CRMs, dashboards, platforms with payments and user accounts. We build them so that each customer's data is strictly isolated and the system grows with the business.
- Przykład PL: `Estalo — CRM dla biur nieruchomości, live z płatnościami` · EN: `Estalo — a CRM for real estate agencies, live with billing`

**Filar 2 — Natywne aplikacje iOS i Android** (link: /oferta)
- Tytuł PL: Natywne aplikacje iOS i Android · EN: Native iOS and Android apps
- Opis PL: Piszemy osobno w Swift i Kotlinie, bez półśrodków w rodzaju webview. Aplikacja działa płynnie, korzysta z aparatu, powiadomień i Face ID, a proces publikacji w App Store i Google Play bierzemy na siebie.
- Opis EN: We write separately in Swift and Kotlin, with no webview half-measures. The app runs smoothly, uses the camera, notifications, and Face ID, and we handle the App Store and Google Play publishing process ourselves.
- Przykład PL: `Jedmar — dwie aplikacje sklepowe opublikowane w obu sklepach` · EN: `Jedmar — two store apps published in both app stores`

**Filar 3 — Sklepy internetowe** (link: /sklepy-internetowe)
- Tytuł PL: Sklepy internetowe · EN: Online stores
- Opis PL: Od sklepu zbudowanego od zera po aplikację mobilną dołożoną do sklepu, który już masz. Integrujemy płatności, Paczkomaty i stany magazynowe, zamiast kazać Ci migrować coś, co działa.
- Opis EN: From a store built from scratch to a mobile app added to the store you already have. We integrate payments, parcel lockers, and stock levels instead of making you migrate something that works.
- Przykład PL: `Jedmar — aplikacje i interaktywne schematy części do istniejącego sklepu` · EN: `Jedmar — apps and interactive parts diagrams for an existing store`

**Filar 4 — Strony, tracking i reklamy Google** (link: /strony-tracking-reklamy)
- Tytuł PL: Strony, tracking i reklamy Google · EN: Websites, tracking, and Google Ads
- Opis PL: Strona, która ma dzwonić telefonem, a nie zbierać kurz. Wpinamy pomiar konwersji zgodny z RODO, budujemy kampanię Google Ads i mówimy Ci wprost, co działa, a co wyłączamy.
- Opis EN: A website that makes your phone ring instead of gathering dust. We wire in GDPR-compliant conversion tracking, build the Google Ads campaign, and tell you plainly what works and what we're switching off.
- Przykład PL: `Skup Nieruchomości — kompletny lejek: strona, tracking i kampania` · EN: `Skup Nieruchomości — a complete funnel: website, tracking, and campaign`

### 1.4 Portfolio — nagłówki sekcji

- Nagłówek — PL: `Wybrane realizacje` · EN: `Selected work`
- Podtytuł — PL: `Uczciwie rozdzielone: nasze własne produkty i praca dla klientów. Każdy projekt możesz kliknąć i sprawdzić.` · EN: `Honestly separated: our own products and client work. Every project is one click away from verification.`
- Link — PL: `Wszystkie projekty` · EN: `All projects`
- Filtry (na /projekty) — PL: `Wszystkie · Produkty Programo · Dla klientów · Tracking i reklamy` · EN: `All · Programo products · Client work · Tracking & ads`

### 1.5 Featured case — Jedmar

**Nadtytuł**
- PL: Studium przypadku
- EN: Case study

**Tytuł**
- PL: Jedmar: sklep narzędziowy w kieszeni i części zamienne, które sprzedają się same
- EN: Jedmar: a tool store in your pocket, and spare parts that sell themselves

**Wyzwanie**
- PL: Centrum Narzędziowe Jedmar prowadzi sklep z ponad 1500 produktami na PrestaShop. Zakupy z telefonu były uciążliwe, a dobranie części zamiennej do gwoździarki wymagało telefonu do obsługi i wertowania PDF-ów producenta.
- EN: The Jedmar Tool Center runs a store with over 1,500 products on PrestaShop. Shopping from a phone was clumsy, and matching a spare part to a nail gun meant calling the shop and digging through manufacturer PDFs.

**Rozwiązanie**
- PL: Zbudowaliśmy dwie w pełni natywne aplikacje (Swift i Kotlin) spięte z istniejącym sklepem: katalog, koszyk, sześć metod płatności, Paczkomaty InPost i skaner kodów EAN. Do tego interaktywny moduł schematów: eksplodowane rysunki 73 narzędzi, na których każda część jest klikalna i trafia prosto do koszyka. Sklepu nie ruszaliśmy — dołożyliśmy do niego to, czego brakowało.
- EN: We built two fully native apps (Swift and Kotlin) wired into the existing store: catalog, cart, six payment methods, InPost parcel lockers, and an EAN barcode scanner. Plus an interactive diagram module: exploded drawings of 73 tools where every part is clickable and goes straight to the cart. We didn't touch the store — we added what it was missing.

**Efekt**
- PL: Obie aplikacje są opublikowane i działają w App Store oraz Google Play, a schematy części działają publicznie na jedmar.pl i natywnie w obu aplikacjach. Katalog synchronizuje się automatycznie co kilka minut, bez pracy po stronie sklepu.
- EN: Both apps are published and live on the App Store and Google Play, and the parts diagrams run publicly on jedmar.pl and natively inside both apps. The catalog syncs automatically every few minutes, with no work on the store's side.

**4 metryki (count-up):**
1. `1500+` — PL: produktów w katalogu · EN: products in the catalog
2. `73` — PL: narzędzia w interaktywnych schematach · EN: tools in interactive diagrams
3. `~7500` — PL: klikalnych markerów części · EN: clickable part markers
4. `6` — PL: integracji płatności · EN: payment integrations

**CTA**
- PL: `Zobacz cały projekt` (→ /projects/jedmar) · EN: `See the full project`

### 1.6 Sekcja ludzie

**Nagłówek**
- PL: Rozmawiasz z osobą, która pisze Twój kod
- EN: You talk to the person who writes your code

**Zdanie wprowadzające**
- PL: Bez handlowców i bez „opiekunów projektu". Od pierwszej rozmowy do wdrożenia masz kontakt z dwoma inżynierami, którzy wykonują pracę.
- EN: No salespeople and no account managers. From the first call to launch, you talk to the two engineers doing the work.

**Wojciech Płonka — Design i Produkt**
- PL: Projektuje interfejsy i prowadzi produkty od pomysłu do wdrożenia — jego projektem jest m.in. moduł schematów części, z którego Jedmar korzysta na produkcji.
- EN: Designs interfaces and takes products from idea to launch — his work includes the parts diagram module Jedmar runs in production.
- Telefon: `797 222 363` · E-mail: `biuro@programo.pl`

**Bartosz Kolaj — Inżynieria**
- PL: Odpowiada za architekturę i kod — od natywnych aplikacji Jedmara w App Store i Google Play po backendy z twardą izolacją danych.
- EN: Owns architecture and code — from Jedmar's native apps on the App Store and Google Play to backends with strict data isolation.
- Telefon: `509 123 434` · E-mail: `biuro@programo.pl`

### 1.7 Pasek „W produkcji"

- PL: Trwają prace nad kolejnymi czterema aplikacjami. Najbliższa premiera: ePortal Prawny — platforma łącząca klientów z prawnikami.
- EN: Four more applications are in the works. Next launch: ePortal Prawny — a platform connecting clients with lawyers.

### 1.8 FAQ (homepage)

**Nagłówek**
- PL: Częste pytania
- EN: Frequently asked questions

**P1 — Ile kosztuje aplikacja albo strona?**
- PL pytanie: Ile to kosztuje?
- PL odpowiedź: Każdy projekt wyceniamy indywidualnie, bo strona wizytówkowa i system SaaS to zupełnie inne skale pracy. Po pierwszej rozmowie dostajesz widełki w ciągu 24 godzin, a przed startem stałą wycenę z rozpisanym zakresem. Bez ukrytych kosztów w trakcie.
- EN pytanie: How much does it cost?
- EN odpowiedź: Every project is quoted individually, because a simple website and a SaaS platform are entirely different scales of work. After the first call you get a price range within 24 hours, and before we start, a fixed quote with the scope written out. No hidden costs along the way.

**P2 — Jak długo trwa realizacja?**
- PL odpowiedź: Strona firmowa to zwykle dwa do trzech tygodni, sklep lub aplikacja webowa cztery do ośmiu, natywna aplikacja mobilna z publikacją w sklepach od ośmiu tygodni wzwyż. Konkretny termin ustalamy przy wycenie i pracujemy etapami, więc efekty widzisz w trakcie, nie na końcu.
- EN odpowiedź: A company website usually takes two to three weeks, a store or web application four to eight, and a native mobile app including store publication eight weeks or more. We set the exact timeline at quoting and work in stages, so you see results along the way, not just at the end.

**P3 — Jak wygląda start współpracy?**
- PL odpowiedź: Zaczynamy od rozmowy telefonicznej lub spotkania online: opowiadasz, co chcesz osiągnąć, my dopytujemy o szczegóły. W ciągu 24 godzin wysyłamy widełki cenowe i proponowany zakres. Jeśli się zgadzamy, przygotowujemy stałą wycenę i harmonogram, i zaczynamy.
- EN odpowiedź: We start with a phone call or an online meeting: you tell us what you want to achieve, we ask about the details. Within 24 hours we send a price range and a proposed scope. If we agree, we prepare a fixed quote and a schedule, and we begin.

**P4 — Czy pracujecie z małymi firmami?**
- PL odpowiedź: Tak, to większość naszych klientów: sklep narzędziowy, klub sportowy, doradczyni finansowa, wynajem domków nad morzem. Mały biznes dostaje u nas tę samą jakość inżynierską co duży projekt, w zakresie dopasowanym do budżetu.
- EN odpowiedź: Yes — that's most of our clients: a tool store, a sports club, a financial advisor, a seaside cabin rental. A small business gets the same engineering quality as a large project, scoped to fit its budget.

**P5 — Co z utrzymaniem po wdrożeniu?**
- PL odpowiedź: Nie znikamy po wdrożeniu. Poprawki i drobne zmiany zgłaszasz bezpośrednio nam, a przy większych projektach ustalamy stałą opiekę: monitoring, aktualizacje i rozwój. Strona klubu WKS Poznań czy aplikacje Jedmara są przez nas utrzymywane na bieżąco.
- EN odpowiedź: We don't disappear after launch. You report fixes and small changes directly to us, and for larger projects we agree on ongoing care: monitoring, updates, and further development. The WKS Poznan club website and Jedmar's apps are maintained by us on an ongoing basis.

### 1.9 Klamra kontaktowa

**Nagłówek**
- PL: Opowiedz nam, co chcesz zbudować
- EN: Tell us what you want to build

**Zdanie**
- PL: Piętnaście minut rozmowy wystarczy, żebyśmy powiedzieli Ci, czy to ma sens, ile może kosztować i od czego zacząć. Odpowiadamy w 24 h.
- EN: Fifteen minutes on the phone is enough for us to tell you whether it makes sense, roughly what it may cost, and where to start. We reply within 24 hours.

**Obok formularza (QuickContact, formId wg strony):**
- Telefon: `509 123 434` · E-mail: `biuro@programo.pl`
- PL: `Odpowiadamy w 24 h` · EN: `We reply within 24 hours`

---

## 2. /oferta — rozwinięcie 4 filarów

**Nagłówek strony**
- PL: Oferta
- EN: Services

**Lead strony**
- PL: Cztery obszary, jeden standard: projekt, kod, wdrożenie i pomiar efektu w jednych rękach. Poniżej dokładnie to, co dostajesz w każdym z nich.
- EN: Four areas, one standard: design, code, deployment, and measurement in the same hands. Below is exactly what you get in each.

### 2.1 Aplikacje webowe i SaaS

- PL: Budujemy systemy, w których firma pracuje na co dzień: CRM-y, panele klienta, platformy z płatnościami i wieloma poziomami uprawnień. Nasz własny produkt, Estalo, to działający produkcyjnie CRM dla biur nieruchomości z płatnościami, integracjami czterech portali ogłoszeniowych i sztuczną inteligencją wpiętą w codzienną pracę agenta. Ten sam warsztat stosujemy w projektach klienckich: izolacja danych na poziomie bazy, testy automatyczne i architektura, która nie wymaga przepisania przy pierwszym wzroście. Piszemy w Next.js i TypeScript, na Postgresie, z wdrożeniem na sprawdzonej infrastrukturze.
- EN: We build the systems a company works in daily: CRMs, client panels, platforms with payments and multiple permission levels. Our own product, Estalo, is a production CRM for real estate agencies with live billing, integrations with four listing portals, and AI wired into an agent's daily work. We apply the same craft to client projects: database-level data isolation, automated tests, and an architecture that doesn't need a rewrite at the first sign of growth. We write in Next.js and TypeScript, on Postgres, deployed on proven infrastructure.

**Co dostajesz:**
- PL: Analizę procesu i projekt systemu przed pierwszą linijką kodu · Aplikację z kontami, rolami i płatnościami · Izolację danych każdego klienta na poziomie bazy (RLS) · Testy automatyczne i wdrożenie produkcyjne · Panel administracyjny, którym zarządzasz samodzielnie
- EN: Process analysis and system design before the first line of code · An application with accounts, roles, and payments · Per-customer data isolation at the database level (RLS) · Automated tests and a production deployment · An admin panel you manage yourself

### 2.2 Natywne aplikacje iOS i Android

- PL: Aplikacje mobilne piszemy natywnie: iOS w Swift i SwiftUI, Android w Kotlinie z Jetpack Compose. Nie używamy nakładek typu webview, bo różnicę czuć w pierwszej sekundzie: płynność, aparat, powiadomienia, Face ID i działanie offline. Dla Jedmara zbudowaliśmy w ten sposób dwie aplikacje sklepowe, które są opublikowane i działają w App Store oraz Google Play, ze skanerem kodów EAN i sześcioma metodami płatności. Cały proces wydawniczy, od TestFlight po review Apple i Google, prowadzimy my.
- EN: We write mobile apps natively: iOS in Swift and SwiftUI, Android in Kotlin with Jetpack Compose. No webview wrappers, because you feel the difference in the first second: fluidity, camera, notifications, Face ID, and offline behavior. For Jedmar we built two store apps this way, published and live on the App Store and Google Play, with an EAN barcode scanner and six payment methods. We run the entire release process, from TestFlight through Apple and Google review.

**Co dostajesz:**
- PL: Dwie natywne aplikacje albo jedną platformę — wedle potrzeby i budżetu · Integrację z Twoim istniejącym systemem lub sklepem · Publikację w App Store i Google Play przeprowadzoną przez nas · Powiadomienia push, biometrię, pracę offline · Testy automatyczne i aktualizacje po premierze
- EN: Two native apps or a single platform — depending on need and budget · Integration with your existing system or store · App Store and Google Play publication handled by us · Push notifications, biometrics, offline support · Automated tests and post-launch updates

### 2.3 Sklepy internetowe

- PL: E-commerce robimy w dwóch trybach. Pierwszy: rozbudowa sklepu, który już masz — jak dla Jedmara, gdzie do działającego PrestaShopa dołożyliśmy dwie natywne aplikacje mobilne i interaktywne schematy części zamiennych, nie ruszając samego sklepu. Drugi: sklep od zera, na WooCommerce, PrestaShop albo headless na Next.js, z płatnościami, Paczkomatami InPost i integracjami magazynowymi. Przy migracjach pilnujemy przekierowań i struktury adresów, żeby nie stracić pozycji wypracowanych w Google.
- EN: We do e-commerce in two modes. First: extending the store you already have — as for Jedmar, where we added two native mobile apps and interactive spare-parts diagrams to a running PrestaShop without touching the store itself. Second: a store from scratch, on WooCommerce, PrestaShop, or headless Next.js, with payments, InPost parcel lockers, and warehouse integrations. During migrations we guard redirects and URL structure so you don't lose the rankings you've earned on Google.

**Co dostajesz:**
- PL: Sklep od zera albo rozbudowę istniejącego — bez wymuszania migracji · Integracje płatności (PayU, przelewy, raty) i dostaw (InPost) · Aplikację mobilną do sklepu, jeśli Twoi klienci kupują z telefonu · Integracje z Allegro i BaseLinkerem · Migrację bez utraty pozycji w Google
- EN: A store from scratch or an extension of your existing one — no forced migration · Payment (PayU, transfers, installments) and delivery (InPost) integrations · A mobile app for the store if your customers buy from their phones · Allegro and BaseLinker integrations · Migration without losing Google rankings

### 2.4 Strony, tracking i reklamy Google

- PL: Strona bez pomiaru i ruchu to koszt, nie inwestycja, dlatego te trzy rzeczy robimy razem: stronę lub landing, pomiar konwersji i kampanię Google Ads. Dla Skupu Nieruchomości zbudowaliśmy kompletny lejek: sześć podstron dopasowanych do treści reklam, dwukrokowy widżet oddzwonienia i pełny tracking z enhanced conversions. Dla Domków Poznaniak weszliśmy na istniejącą stronę WordPress, wpięliśmy pomiar i prowadzimy kampanię. Nie musisz mieć strony od nas, żebyśmy zajęli się Twoimi reklamami.
- EN: A website with no measurement and no traffic is a cost, not an investment, so we do these three things together: the site or landing page, conversion tracking, and the Google Ads campaign. For Skup Nieruchomości we built a complete funnel: six pages matched to ad copy, a two-step callback widget, and full tracking with enhanced conversions. For Domki Poznaniak we stepped into an existing WordPress site, wired up measurement, and now run the campaign. You don't need a website built by us for us to take over your ads.

**Co dostajesz:**
- PL: Stronę lub landing zaprojektowane pod jedno działanie: telefon albo formularz · GA4 i śledzenie konwersji Google Ads zgodne z Consent Mode v2 · Kampanię Google Ads zbudowaną i prowadzoną z raportowaniem wprost · SEO techniczne: szybkość, dane strukturalne, indeksacja · Możliwość pracy na Twojej istniejącej stronie
- EN: A site or landing page designed for one action: a call or a form · GA4 and Google Ads conversion tracking compliant with Consent Mode v2 · A Google Ads campaign built and run with straight-talking reports · Technical SEO: speed, structured data, indexing · The option to work on your existing website

---

## 3. NOWA /strony-tracking-reklamy

### 3.1 Hero

**H1**
- PL: Strona, pomiar i reklamy Google — jeden zespół, jeden mierzalny lejek
- EN: Website, measurement, and Google Ads — one team, one measurable funnel

**Zdanie pod H1**
- PL: Budujemy stronę, wpinamy śledzenie konwersji zgodne z RODO i prowadzimy kampanię Google Ads. Wiesz, ile kosztuje pozyskanie klienta, bo wszystko jest policzone.
- EN: We build the website, wire in GDPR-compliant conversion tracking, and run your Google Ads campaign. You know what a customer costs to acquire, because everything is counted.

**CTA:** `Zadzwoń: 509 123 434` + `Bezpłatna konsultacja` + `Odpowiadamy w 24 h`
**Formularz hero:** CompactLeadForm, formId `marketing-hero`

### 3.2 Problem → rozwiązanie

**Problem**
- PL: Znasz ten układ: stronę zrobiła jedna firma, reklamy prowadzi druga, a pomiaru nie ogarnia nikt. Budżet się wydaje, a Ty nie wiesz, czy telefon zadzwonił przez reklamę, czy mimo niej. Gdy kampania nie działa, agencja od reklam pokazuje palcem na stronę, a firma od strony na reklamy.
- EN: You know this setup: one company built the website, another runs the ads, and nobody owns the measurement. The budget gets spent, and you don't know whether the phone rang because of the ads or despite them. When the campaign underperforms, the ad agency points at the website and the web company points at the ads.

**Rozwiązanie**
- PL: U nas wszystkie trzy elementy są w jednych rękach. Strona powstaje pod konkretne działanie użytkownika, pomiar liczy każde z tych działań, a kampania kieruje ruch dokładnie tam, gdzie treść strony odpowiada obietnicy reklamy. Kiedy coś nie działa, nie szukamy winnego — mamy dane i poprawiamy.
- EN: With us, all three pieces are in the same hands. The website is built around a specific user action, the measurement counts every one of those actions, and the campaign sends traffic exactly where the page matches the ad's promise. When something underperforms, we don't look for someone to blame — we have the data and we fix it.

### 3.3 Trzy elementy pakietu

**Element 1 — Strona lub landing**
- PL: Projektujemy stronę pod jedno zadanie: telefon albo wysłany formularz. Treść dopasowana słowo w słowo do reklam, na które klikają użytkownicy, szybkie ładowanie na telefonie i formularz, który da się wypełnić kciukiem w 30 sekund.
- EN: We design the page for a single job: a phone call or a submitted form. Copy matched word for word to the ads people click, fast loading on mobile, and a form you can fill with your thumb in 30 seconds.

**Element 2 — Tracking: GA4, konwersje, Consent Mode**
- PL: Wpinamy Google Analytics 4, śledzenie konwersji Google Ads z enhanced conversions i Consent Mode v2, więc pomiar jest zgodny z RODO i żaden piksel nie startuje bez zgody użytkownika. Każde kliknięcie w telefon i każdy formularz jest policzony i przypisany do źródła.
- EN: We wire in Google Analytics 4, Google Ads conversion tracking with enhanced conversions, and Consent Mode v2, so measurement is GDPR-compliant and no pixel fires without user consent. Every phone tap and every form submission is counted and attributed to its source.

**Element 3 — Kampanie Google Ads + SEO techniczne**
- PL: Budujemy strukturę kampanii, piszemy reklamy i prowadzimy optymalizację: frazy wykluczające, harmonogram, korekty geograficzne i stawki. Do tego SEO techniczne strony: szybkość, dane strukturalne i poprawna indeksacja. Kampanie uruchamiasz Ty — my przygotowujemy wszystko i rekomendujemy budżet.
- EN: We build the campaign structure, write the ads, and run the optimization: negative keywords, scheduling, geographic adjustments, and bids. Plus technical SEO for the site: speed, structured data, and correct indexing. You flip the campaign switch — we prepare everything and recommend the budget.

### 3.4 Trzy case'y

**Case 1 — Skup Nieruchomości (pełny lejek end-to-end)**
- PL: Strona, sześć podstron dopasowanych do grup reklam, dwukrokowy widżet oddzwonienia, pełny tracking (GA4, enhanced conversions, Meta Pixel, Consent Mode v2) i kampania Google Ads zbudowana oraz zoptymalizowana przez nas. Lejek przebudowaliśmy na podstawie danych z własnej analityki, nie domysłów.
- EN: The website, six pages matched to ad groups, a two-step callback widget, full tracking (GA4, enhanced conversions, Meta Pixel, Consent Mode v2), and a Google Ads campaign we built and optimized. We rebuilt the funnel based on our own analytics data, not guesswork.

**Case 2 — Domki Poznaniak (tracking i kampania na cudzej stronie)**
- PL: Strony nie budowaliśmy i nie musieliśmy. Na istniejącym WordPressie klienta wpięliśmy GA4 i konwersje z enhanced conversions, a potem zbudowaliśmy i prowadzimy kampanię: twardy limit budżetu, harmonogram emisji, korekty geograficzne i około stu fraz wykluczających.
- EN: We didn't build the website and didn't need to. On the client's existing WordPress we wired up GA4 and conversions with enhanced conversions, then built and now run the campaign: a hard budget cap, an ad schedule, geographic adjustments, and about a hundred negative keywords.

**Case 3 — W. Safe Finance (strona + leady w minutach)**
- PL: Strona doradztwa finansowego, w której zapytanie z formularza trafia jednocześnie na e-mail i jako push na Telegram. Właścicielka widzi leada na telefonie w chwili wysłania i oddzwania, zanim klient wyśle zapytanie do konkurencji.
- EN: A financial advisory website where a form inquiry lands in the inbox and as a Telegram push at the same time. The owner sees the lead on her phone the moment it's sent and calls back before the client contacts a competitor.

### 3.5 FAQ (3 pytania)

**P1 — Mam już stronę. Czy musicie budować nową?**
- PL odpowiedź: Nie. Jeśli Twoja strona działa, wpinamy pomiar i prowadzimy kampanię na tym, co masz — dokładnie tak pracujemy z Domkami Poznaniak. Nową stronę proponujemy tylko wtedy, gdy obecna realnie blokuje konwersję, i wtedy pokazujemy dlaczego.
- EN odpowiedź: No. If your website works, we add measurement and run the campaign on what you have — exactly how we work with Domki Poznaniak. We only propose a new site when the current one genuinely blocks conversion, and then we show you why.

**P2 — Czy tracking jest zgodny z RODO?**
- PL odpowiedź: Tak. Wdrażamy Consent Mode v2 z banerem zgód, w którym „Odrzuć" działa naprawdę: bez zgody użytkownika żaden piksel reklamowy się nie uruchamia. Pomiar konwersji opieramy na rozwiązaniach Google zaprojektowanych do pracy w tym modelu.
- EN odpowiedź: Yes. We implement Consent Mode v2 with a consent banner where "Decline" actually works: without the user's consent, no advertising pixel fires. Conversion measurement relies on Google's mechanisms designed for exactly this model.

**P3 — Jaki budżet reklamowy ma sens na start?**
- PL odpowiedź: To zależy od branży i stawek za kliknięcie, dlatego nie podamy jednej liczby w ciemno. Na pierwszej rozmowie sprawdzamy realne stawki dla Twoich fraz i rekomendujemy budżet z twardym limitem miesięcznym. Decyzja o uruchomieniu i wysokości budżetu zawsze należy do Ciebie.
- EN odpowiedź: It depends on your industry and cost per click, so we won't quote a blind number. On the first call we check real bid levels for your keywords and recommend a budget with a hard monthly cap. The decision to launch, and how much to spend, is always yours.

### 3.6 CTA końcowe

- PL: Sprawdźmy, ile kosztuje u Ciebie pozyskanie klienta. Zadzwoń: 509 123 434 albo zostaw numer — odpowiadamy w 24 h.
- EN: Let's find out what a customer costs you to acquire. Call +48 509 123 434 or leave your number — we reply within 24 hours.
- Formularz: CompactLeadForm, formId `marketing-compact`

---

## 4. /sklepy-internetowe — odświeżone copy

### 4.1 Hero

**H1**
- PL: Sklepy internetowe: od nowego sklepu po aplikację mobilną do tego, który już masz
- EN: Online stores: from a brand-new store to a mobile app for the one you already have

**Zdanie pod H1**
- PL: Budujemy sklepy od zera i rozbudowujemy istniejące — bez wymuszania migracji. Nasza flagowa realizacja to dwie natywne aplikacje i interaktywne schematy części dla sklepu narzędziowego Jedmar.
- EN: We build stores from scratch and extend existing ones — with no forced migration. Our flagship work: two native apps and interactive parts diagrams for the Jedmar tool store.

**CTA:** `Zadzwoń: 509 123 434` + `Bezpłatna konsultacja` + `Odpowiadamy w 24 h`

### 4.2 Case flagowy — Jedmar

- PL: Jedmar miał działający sklep na PrestaShop i nie potrzebował nowego. Potrzebował wygodnych zakupów z telefonu i sensownej sprzedaży części zamiennych. Zbudowaliśmy dwie natywne aplikacje (iOS i Android), które są opublikowane w App Store i Google Play: katalog ponad 1500 produktów, koszyk, sześć metod płatności, Paczkomaty InPost i skaner kodów EAN. Do tego moduł interaktywnych schematów: 73 narzędzia rozrysowane część po części, około 7500 klikalnych markerów, a każda część z przyciskiem dodania do koszyka — na stronie sklepu i w obu aplikacjach, z jednego źródła danych. Katalog synchronizuje się z PrestaShopem automatycznie co kilka minut.
- EN: Jedmar had a working PrestaShop store and didn't need a new one. It needed comfortable mobile shopping and a sane way to sell spare parts. We built two native apps (iOS and Android), published on the App Store and Google Play: a catalog of over 1,500 products, cart, six payment methods, InPost parcel lockers, and an EAN barcode scanner. Plus an interactive diagram module: 73 tools drawn part by part, around 7,500 clickable markers, each part with an add-to-cart button — on the store website and in both apps, from a single data source. The catalog syncs with PrestaShop automatically every few minutes.

### 4.3 Zakres usług e-commerce

**Aplikacje mobilne do istniejących sklepów**
- PL: Twój sklep zostaje tam, gdzie jest. My dokładamy natywne aplikacje iOS i Android, które działają na jego danych: katalogu, cenach, stanach magazynowych i zamówieniach. Klient dostaje zakupy na dwa dotknięcia, powiadomienia push i skaner kodów, a Ty jeden system zamiast dwóch.
- EN: Your store stays where it is. We add native iOS and Android apps that run on its data: catalog, prices, stock, and orders. Your customer gets two-tap shopping, push notifications, and a barcode scanner; you keep one system instead of two.

**Sklepy od zera**
- PL: WooCommerce lub PrestaShop, gdy liczy się sprawdzony ekosystem, albo headless na Next.js, gdy sklep ma być szybki jak aplikacja i w pełni pod Twoją kontrolą. Doradzimy uczciwie, która droga pasuje do skali biznesu — czasem ta tańsza.
- EN: WooCommerce or PrestaShop when a proven ecosystem matters, or headless on Next.js when the store needs to feel as fast as an app and stay fully under your control. We'll honestly advise which path fits your scale — sometimes it's the cheaper one.

**Integracje**
- PL: Płatności (PayU, PayPo, iMoje, InPost Pay i inne), dostawy z wyborem Paczkomatu na mapie, Allegro i BaseLinker, synchronizacja stanów magazynowych. Integracja ma działać latami, więc budujemy ją z obsługą błędów i automatycznym ponawianiem, nie „na sznurki".
- EN: Payments (PayU, PayPo, iMoje, InPost Pay, and more), delivery with parcel-locker selection on a map, Allegro and BaseLinker, stock synchronization. An integration has to work for years, so we build it with error handling and automatic retries, not with duct tape.

**Migracje bez utraty SEO**
- PL: Przy przenoszeniu sklepu pilnujemy mapy przekierowań, struktury adresów i danych strukturalnych, żeby pozycje wypracowane w Google przetrwały przeprowadzkę. Plan migracji dostajesz na piśmie, zanim cokolwiek ruszymy.
- EN: When moving a store we guard the redirect map, URL structure, and structured data so the rankings you've earned on Google survive the move. You get the migration plan in writing before we touch anything.

### 4.4 FAQ e-commerce (przeniesione/odświeżone)

**P — Ile kosztuje sklep internetowy?**
- PL odpowiedź: Koszt zależy od zakresu: liczby produktów, integracji i tego, czy budujemy od zera, czy rozbudowujemy istniejący sklep. Po pierwszej rozmowie dostajesz widełki w 24 h, a przed startem stałą wycenę.
- EN odpowiedź: The cost depends on scope: product count, integrations, and whether we build from scratch or extend an existing store. After the first call you get a range within 24 hours, and a fixed quote before we start.

**P — Czy muszę przenosić sklep, żeby mieć aplikację mobilną?**
- PL odpowiedź: Nie. Aplikację budujemy na API Twojego obecnego sklepu — dokładnie tak powstały aplikacje Jedmara, gdzie PrestaShop pozostał nietknięty.
- EN odpowiedź: No. We build the app on your current store's API — exactly how Jedmar's apps were made, with PrestaShop left untouched.

**CTA końcowe**
- PL: Porozmawiajmy o Twoim sklepie. Zadzwoń: 509 123 434 — odpowiadamy w 24 h.
- EN: Let's talk about your store. Call +48 509 123 434 — we reply within 24 hours.

---

## 5. /o-nas — przepisane od zera

**H1**
- PL: Dwóch inżynierów, jeden standard pracy
- EN: Two engineers, one standard of work

**Wstęp**
- PL: Programo to spółka cywilna Wojciecha Płonki i Bartosza Kolaja z Poznania. Projektujemy i budujemy oprogramowanie sami, od pierwszej rozmowy po wdrożenie i utrzymanie. Nie ma u nas handlowca, który obiecuje, ani podwykonawcy, który potem to odkręca — rozmawiasz z osobami, które wykonują pracę.
- EN: Programo is the partnership of Wojciech Płonka and Bartosz Kolaj, based in Poznan. We design and build software ourselves, from the first call through deployment and maintenance. There's no salesperson making promises and no subcontractor untangling them later — you talk to the people doing the work.

**Jak pracujemy**
- PL: Zanim zaczniemy kodować, ustalamy, co ma się zmienić w Twoim biznesie: więcej telefonów, szybsza obsługa, sprzedaż z telefonu. Potem budujemy etapami, pokazujemy postęp w trakcie i mierzymy efekt po wdrożeniu. Piszemy testy, pilnujemy bezpieczeństwa danych i zostawiamy po sobie systemy, którymi klienci zarządzają samodzielnie — jak panel klubu WKS Poznań, aktualizowany przez trenerkę bez naszego udziału.
- EN: Before we write code, we establish what should change in your business: more calls, faster service, sales from the phone. Then we build in stages, show progress along the way, and measure the effect after launch. We write tests, guard data security, and leave behind systems our clients manage on their own — like the WKS Poznan club panel, updated by the coach without our involvement.

**Własne produkty jako dowód**
- PL: Obok pracy dla klientów rozwijamy własne produkty: CRM Estalo działający produkcyjnie z płatnościami, wyszukiwarkę firm Rejestr Pro i system pomiaru czasu PoolTimer testowany w realnym klubie pływackim. To nasz poligon: rozwiązania, które sprawdzamy najpierw na sobie, trafiają potem do projektów klienckich.
- EN: Alongside client work we build our own products: the Estalo CRM running in production with billing, the Rejestr Pro company search engine, and the PoolTimer timing system piloted at a real swimming club. They're our proving ground: what we test on ourselves first later goes into client projects.

**Sylwetki** — użyć treści z sekcji 1.6 (Wojciech: Design i Produkt, 797 222 363; Bartosz: Inżynieria, 509 123 434).

**Dane firmy**
- PL: Programo s.c., Poznań · biuro@programo.pl · 509 123 434
- EN: Programo s.c., Poznan, Poland · biuro@programo.pl · +48 509 123 434

---

## 6. /cennik — proces wyceny (ZERO kwot)

**H1**
- PL: Wycena
- EN: Pricing

**Wstęp**
- PL: Nie mamy cennika z półki, bo strona wizytówkowa i platforma SaaS różnią się skalą pracy o rząd wielkości. Mamy za to prosty, przewidywalny proces: zanim zapłacisz cokolwiek, wiesz dokładnie, co dostaniesz i za ile.
- EN: We don't have an off-the-shelf price list, because a simple website and a SaaS platform differ in scale by an order of magnitude. What we have is a simple, predictable process: before you pay anything, you know exactly what you'll get and for how much.

**Proces (3 kroki):**

**Krok 1 — Rozmowa**
- PL: Piętnaście do trzydziestu minut przez telefon lub online. Opowiadasz o biznesie i celu, my dopytujemy o zakres, integracje i terminy. Bez zobowiązań.
- EN: Fifteen to thirty minutes by phone or online. You tell us about the business and the goal; we ask about scope, integrations, and timelines. No obligation.

**Krok 2 — Widełki w 24 h**
- PL: Następnego dnia roboczego masz w skrzynce widełki cenowe i proponowany zakres. Jeśli budżet się nie spina, mówimy to wprost i proponujemy mniejszy pierwszy etap zamiast naciągania oferty.
- EN: By the next business day you have a price range and a proposed scope in your inbox. If the budget doesn't add up, we say so plainly and propose a smaller first stage instead of stretching the offer.

**Krok 3 — Stała wycena**
- PL: Przed startem dostajesz stałą wycenę z rozpisanym zakresem, etapami i terminami. Cena nie rośnie w trakcie, chyba że wspólnie zmienimy zakres — wtedy najpierw aktualizujemy wycenę, potem pracujemy.
- EN: Before we start, you get a fixed quote with the scope, stages, and deadlines written out. The price doesn't grow mid-project unless we change the scope together — in which case we update the quote first, then do the work.

**Co wpływa na cenę:**
- PL: Zakres i złożoność — liczba ekranów, ról użytkowników i procesów · Integracje — płatności, portale, systemy magazynowe, API zewnętrzne · Platformy — sama strona, web i aplikacje mobilne, czy całość · Termin — praca w standardowym tempie kosztuje mniej niż ekspres · Utrzymanie — jednorazowe wdrożenie albo stała opieka i rozwój
- EN: Scope and complexity — number of screens, user roles, and processes · Integrations — payments, portals, warehouse systems, external APIs · Platforms — website only, web plus mobile apps, or everything · Timeline — standard pace costs less than a rush job · Maintenance — one-off deployment or ongoing care and development

**CTA**
- PL: Poznaj koszt swojego projektu — widełki dostaniesz w 24 h. Zadzwoń: 509 123 434.
- EN: Find out what your project costs — you'll get a range within 24 hours. Call +48 509 123 434.

---

## 7. Formularze — microcopy

### 7.1 CompactLeadForm (imię + telefon + zgoda)

| Element | PL | EN |
|---|---|---|
| Nagłówek | Zostaw numer — oddzwonimy w 24 h z konkretami. | Leave your number — we'll call back within 24 hours with specifics. |
| Etykieta: imię | Imię | First name |
| Placeholder: imię | Jak masz na imię? | What's your first name? |
| Etykieta: telefon | Numer telefonu | Phone number |
| Placeholder: telefon | 600 000 000 | +48 600 000 000 |
| Zgoda RODO | Wyrażam zgodę na kontakt telefoniczny w sprawie mojego zapytania. Administratorem danych jest Programo s.c. Szczegóły w polityce prywatności. | I consent to being contacted by phone about my inquiry. Programo s.c. is the data controller. Details in the privacy policy. |
| Przycisk | Oddzwońcie do mnie | Call me back |
| Przycisk (loading) | Wysyłanie... | Sending... |
| Sukces | Dziękujemy — odezwiemy się w 24 h. | Thank you — we'll be in touch within 24 hours. |
| Błąd: brak telefonu | Podaj numer telefonu, żebyśmy mogli oddzwonić. | Enter a phone number so we can call you back. |
| Błąd: zły telefon | Ten numer wygląda na niepełny. Sprawdź, czy ma 9 cyfr. | This number looks incomplete. Check that it's a valid phone number. |
| Błąd: brak zgody | Zaznacz zgodę na kontakt — bez niej nie możemy oddzwonić. | Tick the contact consent — without it we can't call you back. |
| Błąd: serwer | Nie udało się wysłać. Spróbuj ponownie albo zadzwoń: 509 123 434. | Sending failed. Try again or call us: +48 509 123 434. |

### 7.2 QuickContact (imię, e-mail LUB telefon, chipy, wiadomość opcjonalna)

| Element | PL | EN |
|---|---|---|
| Nagłówek | Opowiedz nam, co chcesz zbudować | Tell us what you want to build |
| Etykieta: imię | Imię | First name |
| Placeholder: imię | Jak masz na imię? | What's your first name? |
| Etykieta: kontakt | Telefon lub e-mail | Phone or email |
| Placeholder: kontakt | 600 000 000 albo adres e-mail | +48 600 000 000 or an email address |
| Etykieta: typ projektu | Czego dotyczy projekt? | What's the project about? |
| Chipy | Aplikacja webowa · Aplikacja mobilna · Sklep internetowy · Strona + reklamy · Coś innego | Web application · Mobile app · Online store · Website + ads · Something else |
| Etykieta: wiadomość | Wiadomość (opcjonalnie) | Message (optional) |
| Placeholder: wiadomość | Napisz w dwóch zdaniach, co chcesz osiągnąć. | Two sentences on what you want to achieve. |
| Zgoda RODO | Wyrażam zgodę na kontakt w sprawie mojego zapytania. Administratorem danych jest Programo s.c. Szczegóły w polityce prywatności. | I consent to being contacted about my inquiry. Programo s.c. is the data controller. Details in the privacy policy. |
| Przycisk | Wyślij zapytanie | Send inquiry |
| Przycisk (loading) | Wysyłanie... | Sending... |
| Sukces (nagłówek) | Dziękujemy — odezwiemy się w 24 h. | Thank you — we'll be in touch within 24 hours. |
| Sukces (zdanie) | Twoje zapytanie dotarło. Jeśli sprawa jest pilna, zadzwoń: 509 123 434. | Your inquiry has arrived. If it's urgent, call us: +48 509 123 434. |
| Błąd: brak imienia | Podaj imię — chcemy wiedzieć, do kogo dzwonimy. | Enter your first name — we'd like to know who we're calling. |
| Błąd: brak kontaktu | Podaj telefon albo e-mail, żebyśmy mogli odpowiedzieć. | Enter a phone number or email so we can reply. |
| Błąd: zły e-mail | Ten adres e-mail wygląda na niepełny. | This email address looks incomplete. |
| Błąd: zły telefon | Ten numer wygląda na niepełny. Sprawdź, czy ma 9 cyfr. | This number looks incomplete. Check that it's a valid phone number. |
| Błąd: brak zgody | Zaznacz zgodę na kontakt — bez niej nie możemy odpowiedzieć. | Tick the contact consent — without it we can't reply. |
| Błąd: serwer | Nie udało się wysłać. Spróbuj ponownie albo napisz: biuro@programo.pl. | Sending failed. Try again or email us: biuro@programo.pl. |

### 7.3 Cookie banner (kompaktowy pasek, nieblokujący)

| Element | PL | EN |
|---|---|---|
| Treść | Używamy plików cookie do pomiaru ruchu i skuteczności reklam. Możesz je odrzucić — strona będzie działać normalnie. | We use cookies to measure traffic and ad performance. You can decline them — the site will work just fine. |
| Akceptuj | Akceptuję wszystkie | Accept all |
| Odrzuć | Odrzuć wszystkie | Decline all |
| Ustawienia | Ustawienia | Settings |

---

## 8. Metadata SEO (title + description)

### Homepage `/`
- Title PL: `Programo — aplikacje mobilne, systemy webowe i strony | Poznań`
- Description PL: `Dwóch inżynierów z Poznania. Natywne aplikacje iOS i Android, systemy SaaS, sklepy internetowe i strony z kampaniami Google Ads. Odpowiadamy w 24 h.`
- Title EN: `Programo — mobile apps, web systems, and websites | Poznan`
- Description EN: `Two engineers from Poznan. Native iOS and Android apps, SaaS systems, online stores, and websites with Google Ads campaigns. We reply within 24 hours.`

### `/oferta`
- Title PL: `Oferta — aplikacje, sklepy, strony i reklamy Google | Programo`
- Description PL: `Aplikacje webowe i SaaS, natywne aplikacje iOS i Android, sklepy internetowe oraz strony z trackingiem i kampaniami Google Ads. Widełki wyceny w 24 h.`
- Title EN: `Services — apps, stores, websites, and Google Ads | Programo`
- Description EN: `Web and SaaS applications, native iOS and Android apps, online stores, and websites with tracking and Google Ads campaigns. Price range within 24 hours.`

### `/strony-tracking-reklamy` (NOWA)
- Title PL: `Strony internetowe z trackingiem i kampanią Google Ads | Programo`
- Description PL: `Strona, pomiar konwersji (GA4, Consent Mode v2) i kampania Google Ads w jednych rękach. Pracujemy też na Twojej istniejącej stronie. Odpowiadamy w 24 h.`
- Title EN: `Websites with tracking and Google Ads campaigns | Programo`
- Description EN: `Website, conversion tracking (GA4, Consent Mode v2), and a Google Ads campaign in one team's hands. We also work on your existing site. Reply within 24 h.`

### `/strony-internetowe`
- Title PL: `Strony internetowe dla firm — projekt i wdrożenie | Programo`
- Description PL: `Szybkie, nowoczesne strony firmowe i landingi zaprojektowane pod kontakt od klienta. Formularz, telefon i pomiar skuteczności od pierwszego dnia.`
- Title EN: `Business websites — design and deployment | Programo`
- Description EN: `Fast, modern company websites and landing pages designed to win customer contact. Form, phone, and performance measurement from day one.`

### `/sklepy-internetowe`
- Title PL: `Sklepy internetowe i aplikacje mobilne do sklepów | Programo`
- Description PL: `Sklepy od zera (WooCommerce, PrestaShop, headless) i natywne aplikacje mobilne do istniejących sklepów. Płatności, Paczkomaty InPost, migracje bez utraty SEO.`
- Title EN: `Online stores and mobile apps for e-commerce | Programo`
- Description EN: `Stores from scratch (WooCommerce, PrestaShop, headless) and native mobile apps for existing stores. Payments, InPost lockers, SEO-safe migrations.`

### `/projekty`
- Title PL: `Projekty i realizacje — produkty i praca dla klientów | Programo`
- Description PL: `Portfolio Programo: natywne aplikacje Jedmar w App Store i Google Play, CRM Estalo, strony i kampanie Google Ads. Każdy projekt można kliknąć i sprawdzić.`
- Title EN: `Projects — our products and client work | Programo`
- Description EN: `Programo portfolio: Jedmar's native apps on the App Store and Google Play, the Estalo CRM, websites and Google Ads campaigns. Every project is verifiable.`

### `/projects/[slug]` (szablon)
- Title PL: `{Nazwa projektu} — {podtytuł skrócony} | Programo`
- Description PL: pierwsze zdanie `description` projektu z projects.ts.
- Title EN: `{Project name} — {short subtitle} | Programo`
- Description EN: first sentence of the project's `description` from projects.ts.

### `/o-nas`
- Title PL: `O nas — dwóch inżynierów z Poznania | Programo`
- Description PL: `Programo s.c. to Wojciech Płonka i Bartosz Kolaj. Projektujemy i budujemy oprogramowanie sami — bez handlowców i podwykonawców. Poznań, cała Polska zdalnie.`
- Title EN: `About us — two engineers from Poznan | Programo`
- Description EN: `Programo is Wojciech Płonka and Bartosz Kolaj. We design and build software ourselves — no salespeople, no subcontractors. Poznan, all of Poland remotely.`

### `/cennik`
- Title PL: `Wycena — proces i czynniki ceny | Programo`
- Description PL: `Rozmowa, widełki w 24 h, stała wycena przed startem. Sprawdź, co wpływa na cenę aplikacji, sklepu lub strony. Bez ukrytych kosztów w trakcie projektu.`
- Title EN: `Pricing — our process and cost factors | Programo`
- Description EN: `A call, a price range within 24 hours, a fixed quote before we start. See what drives the cost of an app, store, or website. No hidden costs mid-project.`

### `/kontakt`
- Title PL: `Kontakt — odpowiadamy w 24 h | Programo`
- Description PL: `Zadzwoń: 509 123 434 albo zostaw numer w formularzu. Porozmawiajmy o Twojej aplikacji, sklepie lub stronie. Programo, Poznań.`
- Title EN: `Contact — we reply within 24 hours | Programo`
- Description EN: `Call +48 509 123 434 or leave your number in the form. Let's talk about your app, store, or website. Programo, Poznan.`

### `/software-house-poznan`
- Title PL: `Software house Poznań — aplikacje i systemy na zamówienie | Programo`
- Description PL: `Szukasz software house'u w Poznaniu? Programo buduje aplikacje mobilne, systemy webowe i sklepy. Rozmawiasz bezpośrednio z inżynierami. Odpowiadamy w 24 h.`
- Title EN: `Software house Poznan — custom apps and systems | Programo`
- Description EN: `Looking for a software house in Poznan? Programo builds mobile apps, web systems, and stores. You talk directly to the engineers. We reply within 24 hours.`

### `/ile-kosztuje-aplikacji`
- Title PL: `Ile kosztuje aplikacja? Zakresy, czasy realizacji, proces wyceny | Programo`
- Description PL: `Od czego zależy koszt aplikacji webowej i mobilnej: zakres, integracje, platformy i termin. Realne czasy realizacji i proces wyceny z widełkami w 24 h.`
- Title EN: `How much does an app cost? Scope, timelines, quoting | Programo`
- Description EN: `What drives the cost of a web or mobile app: scope, integrations, platforms, and timeline. Realistic delivery times and a quoting process with a range in 24 h.`

---

## 9. Nawigacja i stopka (etykiety)

| Klucz | PL | EN |
|---|---|---|
| nav.offer | Oferta | Services |
| nav.marketing | Strony i reklamy | Websites & ads |
| nav.ecommerce | Sklepy | Stores |
| nav.work | Projekty | Projects |
| nav.about | O nas | About |
| nav.pricing | Wycena | Pricing |
| nav.contact | Kontakt | Contact |
| nav.cta | Umów rozmowę | Book a call |
| sticky.call | Zadzwoń | Call |
| sticky.write | Napisz | Write |
| footer.tagline | Oprogramowanie projektowane i budowane w Poznaniu. | Software designed and built in Poznan. |
| footer.reply | Odpowiadamy w 24 h | We reply within 24 hours |

---

## 10. Statusy projektów (etykiety wspólne)

| Status | PL | EN |
|---|---|---|
| live | Live | Live |
| development | W rozwoju | In development |
| coming-soon | Premiera wkrótce | Launching soon |
| kategoria: produkty | Produkty Programo | Programo products |
| kategoria: dla-klientow | Dla klientów | Client work |
| kategoria: marketing | Tracking i reklamy | Tracking & ads |

Uwaga: każdy projekt ma w `projects.ts` pole `statusLabel` z doprecyzowaniem
(np. „Web live; aplikacja iOS w wersji podglądowej") — na detalu używać `statusLabel`,
na kartach wystarczy badge ze statusem ogólnym.

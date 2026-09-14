# Dema w portfolio + audyt SEO/GEO/tracking (2026-09-14)

## Cel

1. Ocenić stan programo.pl pod SEO, GEO (widoczność w odpowiedziach AI), dostępność i pomiar
   (GA4, Google Ads, Meta, Clarity, Consent Mode) oraz stan wszystkich dem, które kiedykolwiek
   zbudowaliśmy dla klientów.
2. Dodać do strony nową część portfolio: **wszystkie dema stron** jako pokaz tego, co robimy
   za darmo przed podpisaniem umowy („demo nowej strony w 48 h, bez zobowiązań”).

## Inwentaryzacja dem (stan 14.09.2026, wszystko HTTP 200)

| Hostname | Firma / branża | Miasto | Źródło | Data |
|---|---|---|---|---|
| anvapol.programo.pl | Supermozaika / Anvapol, mozaiki szklane (sklep) | — | Plonkawojciech/anvapol-demo, static | 09.2026 |
| supermozaika.programo.pl | PRIMAVERA / Anvapol, mozaika od importera (wariant 2) | — | /opt/demos (generator CRM) | 09.2026 |
| biuroaga.programo.pl | Biuro Rachunkowo-Usługowe AGA, księgowość | Siedlce / Kotuń | bkolaj/biuroaga | 09.2026 |
| intergraf.programo.pl | Intergraf, agencja reklamowa i drukarnia | Bydgoszcz | demos-2026-09-13 | 09.2026 |
| czystaprzyszlosc.programo.pl | Czysta Przyszłość, chemia i sprzęt do sprzątania | Gdańsk | demos-2026-09-13 | 09.2026 |
| bezpieczneplace.programo.pl | Europejskie Centrum Bezpieczeństwa Sportu i Rekreacji, kontrole placów zabaw | — | demos-2026-09-13 | 09.2026 |
| trendcars.programo.pl | Trend Cars, import aut używanych | Wałbrzych | demos-2026-09-13 | 09.2026 |
| sklepmaniek.programo.pl | Sklep Maniek, części do ciągników | Tuchola | demos-2026-09-13 | 09.2026 |
| pzskatslp.programo.pl | Okręgowy Związek Skata Śląsk-Południe | — | generator CRM (_releases) | 09.2026 |
| elzakup.programo.pl | elZakup / ELMAT, hurtownia elektryczna B2B | Stalowa Wola | bkolaj/elzakup, static | 09.2026 |
| fineartfilm.programo.pl | FiNE ART FiLM, realizacja TV i streaming | — | bkolaj/fineartfilm-demo | 09.2026 |
| innochem.programo.pl | INNOCHEM, oleje Royal Purple (sklep) | — | Plonkawojciech/innochem-demo, Next | 08.2026 |
| lumen.programo.pl | Lumen, pomiary i projekty elektryczne | Kraków | bkolaj/lumen-demo | 09.2026 |
| manix.programo.pl | Manix Automatyka i Budowa Maszyn | — | bkolaj/manixautomatyka | 09.2026 |
| pressence.programo.pl | Pressence Public Relations | Opole | bkolaj/pressence-demo, static | 09.2026 |
| underwater.programo.pl | Underwater.pl, centrum nurkowe | Warszawa | Plonkawojciech/underwater-demo, Next+Payload | 09.2026 |
| wojtplast.programo.pl | WojtPlast, detale z tworzyw sztucznych | — | Plonkawojciech/wojtplast-demo, static | 09.2026 |
| demo.programo.pl | Życie Stolicy, portal informacyjny | Warszawa | bkolaj/zyciestolicy-demo | 08.2026 |
| terapiadens.vercel.app (+ /v2/) | NZOZ Terapia Dens, stomatologia | Poznań | ~/Programo/terapiadens-demo, Vercel | 06.2026 |
| gaming-ui-template.vercel.app | Szablon UI strony serwera gry (9-slice) | — | ~/Programo/gaming-ui-template, Vercel | 06.2026 |
| ks-posnania.vercel.app | KS Posnania, klub sportowy | Poznań | ~/Programo/ks-posnania, Vercel | 05.2026 |
| hooplytics-redesign.vercel.app | Hooplytics, tracker rzutów (EN) | — | ~/Programo/hooplytics-redesign, Vercel | 05.2026 |

Poza listą (świadomie): `jedmar-schematy-demo` (część projektu Jedmar, już w portfolio),
`bizea-paletyzer` (narzędzie, nie demo strony, bez domeny), `pooltimer-demo` (lokalny plik).

Wszystkie dema mają `noindex, nofollow` (poza: anvapol, biuroaga, elzakup, fineartfilm, lumen,
wojtplast — do ujednolicenia, ale to marki klientów, nie nasze treści; nie chcemy, żeby atrapa
konkurowała w Google z prawdziwą stroną klienta).

## Stan programo.pl (zweryfikowane 14.09 na prodzie)

Działa poprawnie:
- GA4 `G-KT2R144BYG` + Ads `AW-18196600478` ładowane programowo po Consent Mode v2 (default denied).
- Clarity po zgodzie analitycznej, Meta Pixel (dataset 1123682429983000) w bundlu, montowany
  dopiero po zgodzie marketingowej; tag weryfikacji domeny Meta w `<head>`.
- Brak GTM — świadome (własna warstwa `src/lib/analytics`), nie brak.
- Canonicale, tytuły i opisy na każdej stronie, 4 bloki JSON-LD (ProfessionalService z KRS/NIP/
  adresem, WebPage, Breadcrumb, FAQ), robots.txt z politykami dla crawlerów AI, sitemap z 29 URL-i,
  `llms.txt` generowany z danych.

Do naprawy / brakuje (fakty z `vercel env ls production`):
- **`MS_GRAPH_TENANT_ID/CLIENT_ID/CLIENT_SECRET`, `LEAD_MAIL_FROM/TO` nie są ustawione** →
  powiadomienia mailowe o leadach z commitu 85efe03 na prodzie są no-op. Działa tylko Telegram
  + webhook CRM.
- `META_CAPI_ACCESS_TOKEN` brak → Conversions API martwe, tylko piksel przeglądarkowy.
- `GA4_API_SECRET` brak → Measurement Protocol (`generate_lead_verified`) nie wysyła.
- `NEXT_PUBLIC_GSC_VERIFICATION` / `NEXT_PUBLIC_BING_VERIFICATION` brak, ale to nie problem:
  własność jest potwierdzona rekordami TXT w DNS (`google-site-verification=…`, `MS=…`, `dig TXT programo.pl`).
- Brak `hreflang` i wersji EN dla wyszukiwarek (i18n klienckie) — znana decyzja, otwarta.
- Lighthouse 13 (lokalnie, mobile, jeden przebieg na obciążonej maszynie — orientacyjnie):
  Performance 86, Accessibility 97, Best Practices 100, SEO 100; LCP 2,1 s, TBT 430 ms, CLS 0.
- Zweryfikowane P1 z audytu Codexa: `/projects/<nieistniejący>` zwracał HTTP 200 (soft 404) — naprawione
  `notFound()`; konwersja serwerowa (CAPI/MP) była planowana przed potwierdzeniem przyjęcia leada — przeniesiona;
  hover CTA `bg-primary-container` z `text-on-primary` miał kontrast 1,96:1 / 2,25:1 — nowy token
  `--color-primary-hover`; hero nie było w lejku formularzy — podłączone `useFormAnalytics`; wycofanie zgody
  analitycznej kasowało guard Ads „raz na sesję" — guard zależy teraz od zgody marketingowej.
- Dema bez stopki „przygotowane przez Programo": anvapol, elzakup, pressence, wojtplast (do dodania przy okazji).

Szczegółowy audyt strona po stronie: Codex (Astra, read-only) → `docs/audits/seo-geo-tracking-2026-09-14.md`.

## Nowa część portfolio: `/dema`

Decyzje:
- Osobna trasa `/dema` (indeksowana), a nie czwarty filtr na `/projekty` — inna obietnica
  („zrobimy Ci takie demo za darmo”), inny typ leadu, własne SEO („darmowe demo strony”,
  „strona dla hurtowni / biura rachunkowego / komisu…”).
- Dane w `src/lib/demos.ts` (hostname, firma, branża, miasto, rok, co pokazuje, decyzje
  projektowe, liczba stron, `noindexTarget`). Zero zmyślonych liczb; opisy z briefów i z samych dem.
- Zrzuty: `public/screenshots/demos/<slug>-{desktop,mobile}.webp` generowane skryptem
  `scripts/shoot-demos.mjs` (headless Chrome + sharp), 1440×900 i 390×844.
- Układ: hero z obietnicą i CTA; pasek „jak to działa” (rozmowa → demo w 48 h → decyzja);
  siatka dem z filtrem po branży (sklep, produkcja, usługi, medycyna, sport, media);
  karta = zrzut desktop na kanwie w kolorze marki klienta + pastylka domeny + branża + miasto +
  jedno zdanie „co pokazuje”; klik → demo w nowej karcie (`rel="nofollow noopener"`);
  na dole CompactLeadForm `formId="dema"`.
- Linki wewnętrzne: navbar (pod „Realizacje”), stopka, `/projekty` (pasek „Zobacz też 22 dema”),
  `/strony-internetowe` (sekcja „Najpierw demo”), `site-urls.ts`, sitemap, `llms.txt`.
- Schema: `CollectionPage` + `ItemList` z `CreativeWork` per demo (bez `url` do atrapy jako
  mainEntity — `sameAs` na hostname, żeby nie ciągnąć noindexowanych stron do grafu).
- Treść przez `t()` (PL + EN w słowniku `demos.ts`), zgodnie z zasadą repo.

Wykonanie i koszt:
- Zrzuty + szkielet danych: skrypt + Sonnet (builder) — praca mechaniczna.
- Implementacja trasy i komponentów: Codex `rw` (gpt-5.6-sol, low/medium) z tego planu.
- Fable: review diffu, bramka `npm run build && npx tsc --noEmit && npm run test`, ship.
- Deploy: push na `origin/main` → Vercel (wyjątek potwierdzony dla tego repo).

## Poza zakresem tej sesji
Ustawienie sekretów na Vercelu (MS_GRAPH_*, META_CAPI_ACCESS_TOKEN, GA4_API_SECRET) robi Wojtek —
asystent nie przenosi sekretów. Wersja EN pod wyszukiwarki — osobna decyzja.

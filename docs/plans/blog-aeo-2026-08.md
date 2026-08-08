# Blog + AEO/GEO na programo.pl (sierpień 2026)

Stan: **plan, nic nie wdrożone.**
Kontynuacja `docs/plans/tracking-seo-geo-2026-08.md` — tamten dokument zbudował
warstwę pomiarową i techniczne SEO. Ten dodaje jedyną rzecz, której tamtemu
brakowało: **treść, którą jest po co cytować.**

---

## 1. Dlaczego blog, a nie kolejna strona usługowa

Strona ma dziś 14 stron publicznych i wszystkie odpowiadają na pytanie „kim
jesteśmy i co robimy". Silniki odpowiadające (ChatGPT, Perplexity, AI Overviews)
cytują nie strony o firmie, tylko fragmenty odpowiadające na pytanie
użytkownika. Kupujący nie pyta „kto to Programo" — pyta „ile kosztuje aplikacja
mobilna", „Next.js czy WordPress dla firmowej strony", „software house czy
freelancer".

Kluczowa różnica względem klasycznego SEO: **klasyczne SEO daje pozycję,
AEO daje cytowanie.** Dobrze zbudowana strona bywa cytowana z pozycji 2–3,
bo silnik wybiera źródło po strukturze i wiarygodności, nie po miejscu w rankingu.

Twarde odniesienia, na których opieram decyzje w tym dokumencie:

- Google, [AI features and your website](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide):
  do AI Overviews i AI Mode **nie jest potrzebny żaden dodatkowy markup ani plik**,
  bo działają na rdzeniu Search. Google wprost odradza cięcie treści na kawałki
  „dla AI" i pisanie osobnych wersji treści dla modeli — to podpada pod politykę
  *scaled content abuse*.
- Badanie GEO (KDD 2024, mierzone na Perplexity): cytowanie źródeł +40%
  widoczności, dodanie statystyk +37%, cytaty ekspertów +30%, **keyword stuffing −10%**
  (jedyna metoda z ujemnym wynikiem).
- Zestawienie udziałów typów treści w cytowaniach (artykuły porównawcze ~33%,
  poradniki definitywne ~15%, własne dane ~12%) pochodzi z materiałów skilla
  `ai-seo`; źródła pierwotnego nie weryfikowałem — traktować jako kierunek, nie liczbę.

Wniosek operacyjny: dla Google piszemy po prostu dobrze dla ludzi. Struktura
ekstrakcyjna (blok odpowiedzi, tabela porównawcza, FAQ) jest dźwignią dla
ChatGPT/Claude/Perplexity i **nie szkodzi** Google, bo to zwykła dobra organizacja
tekstu, a nie sztuczne chunkowanie.

---

## 2. Ostrzeżenie, które musi być na górze

Zamówione tempo to 2 posty tygodniowo. To 104 teksty rocznie z dwuosobowej firmy.
Przy generowaniu przez agenta bez bramki jakościowej dostaniemy dokładnie to,
co Google nazywa *scaled content abuse* — a to działa wstecz: obniża ocenę całej
domeny, łącznie ze stronami usługowymi, które dopiero co odsierociliśmy.

Plan realizuje 2/tydzień, ale z trzema zabezpieczeniami, które są **niezbywalne**:

1. **Bramka techniczna** — kontrakt posta egzekwowany testem; brak bloku
   odpowiedzi, źródeł albo FAQ = czerwony build, post nie wchodzi.
2. **Bramka ludzka** — agent otwiera PR, nie pushuje na `main`. Merge = decyzja Wojtka.
3. **Miks 1 + 1** — tygodniowo jeden tekst nowy i jeden *refresh* istniejącego
   (aktualizacja danych, `dateModified`, dopisany rozdział). Refresh liczy się
   jako publikacja, bo świeżość jest realnym sygnałem rankingowym, a koszt
   jakościowy jest wielokrotnie niższy niż nowego tekstu.

Jeśli po 6 tygodniach jakość spada — schodzimy na 1 nowy tekst tygodniowo.
Kryterium decyzji w sekcji 8.

---

## 3. Architektura

### 3.1 Treść

`src/content/blog/<slug>.mdx` — pliki w repo, nie baza. Uzasadnienie: strona nie
ma bazy danych (tylko Upstash Redis na zdarzenia), a treść w gicie daje darmowo
historię zmian, review w PR i realne `lastmod` z historii gita — czyli dokładnie
to, czego wymaga landmina z poprzedniego planu (`lastModified: new Date()` psuje
zaufanie Google do całej sitemapy).

Frontmatter walidowany `zod` **w czasie builda**, nie w runtime:

```yaml
slug: ile-kosztuje-aplikacja-mobilna-2026
title: Ile kosztuje aplikacja mobilna w 2026 roku
question: Ile kosztuje zbudowanie aplikacji mobilnej?   # nagłówek H1 = fraza pytania
answer: >                                                # 40-60 słów, blok ekstrakcyjny
  ...
cluster: koszty-projektu                                 # klaster tematyczny, nie keyword
author: wojciech-plonka                                  # encja Person z src/lib/schema/people.ts
datePublished: 2026-08-12
dateModified: 2026-08-12
sources:                                                 # min. 1, z linkiem i datą
  - { label: "...", url: "https://...", date: 2026-06 }
faq:                                                     # min. 3 pytania
  - { q: "...", a: "..." }
```

### 3.2 Renderowanie i schema

Nowe trasy: `/blog` (indeks, paginacja po 20), `/blog/[slug]`,
`/blog/klaster/[cluster]`, `/blog/rss.xml`.

Schema — **biblioteka już istnieje** (`src/lib/schema/`), więc to jest głównie
spinanie, nie budowa: `buildArticle` → rozszerzyć o `BlogPosting`
(`datePublished`, `author` jako `Person`, `wordCount`), `buildFaq` bez zmian,
`buildBreadcrumbs` bez zmian, wszystko wpięte w istniejący graf z `@id`.

`src/lib/site-urls.ts` — posty **nie** trafiają do `SITE_PAGES` ręcznie.
Dokładnie jak projekty: derywowane z katalogu treści, żeby sitemap, `/llms.txt`
i IndexNow nie mogły się rozjechać. To ta sama zasada, która naprawiła
rozjazd 8 vs 23 URL-e.

`/llms.txt` — dopisać sekcję `## Blog` generowaną z tego samego źródła.
Świadomie bez złudzeń: w komentarzu w `src/app/llms.txt/route.ts` jest już
udokumentowane, że **nie ma dowodów**, by którykolwiek duży dostawca AI czytał
ten plik (stanowisko Google, obserwacje Muellera, logi Ahrefs ze 137 tys. domen
i Evil Martians z 268 tys. żądań). Zostaje, bo kosztuje zero.

### 3.3 Kontrakt posta jako test

`src/__tests__/blog-contract.test.ts` — dla każdego pliku MDX sprawdza:

- `answer` ma 40–60 słów i jest samodzielny (nie zaczyna się od „To zależy",
  nie zawiera „jak wspomniano wyżej", „powyżej", „poniżej");
- `sources` niepuste, każdy URL ma schemat https i datę;
- `faq` ma min. 3 wpisy, pytania kończą się znakiem zapytania;
- `dateModified >= datePublished`;
- `author` istnieje w `src/lib/schema/people.ts`;
- treść ma min. jedną tabelę **albo** listę numerowaną (tabele wygrywają dla
  zapytań porównawczych, listy numerowane dla proceduralnych);
- w treści nie ma frazy `slug` powtórzonej > 8 razy (prosty bezpiecznik na
  keyword stuffing — jedyną metodę z ujemnym wynikiem w badaniu GEO);
- `src/__tests__/ssr-content.test.ts` rozszerzone o posty: **treść musi być
  w HTML serwerowym**, bo crawlery AI nie wykonują JS.

Ten test jest sednem całego planu. Bez niego automatyzacja produkuje szum.

---

## 4. Automatyzacja publikacji

Wzorzec sprawdzony i już działający na VM Contabo: `jedmar-sync` (cron + flock).

```
cron na VM (pon. i czw., 06:00)
  └─ flock, git fetch, git worktree add (izolacja — nie dwa checkouty na jednym drzewie)
     └─ claude -p  z briefem z docs/content/queue.yaml (pierwsza pozycja ze statusem `ready`)
        ├─ pisze src/content/blog/<slug>.mdx
        ├─ npm run build && npm test   ← agent sam odpala, raport = output, nie deklaracja
        ├─ gh pr create --label content
        └─ ping na Telegram (ten sam kanał, co leady)
  └─ git worktree remove
```

Po merge do `main`: Vercel deployuje sam (`git push` = deploy, **nie** `vercel --prod`),
a post-deploy hook wysyła IndexNow (submitter już istnieje) i odświeża `/llms.txt`
(generowany, więc bez ruchu ręcznego).

**Kolejka tematów, nie kolejka tytułów.** `docs/content/queue.yaml` uzupełniana
raz na kwartał, ręcznie, przez jedną sesję planującą — nie przez cron. Powód:
Google rozsyła zapytanie na wiele powiązanych (*query fan-out*), więc wygrywa
pokrycie całego klastra, nie pojedyncza fraza. Kolejka trzyma klastry
z rozpisanymi 5–10 pytaniami pobocznymi każdy.

---

## 5. Klastry treści (pierwszy kwartał)

Kolejność wg tego, co realnie kupują klienci, a nie wg wolumenu wyszukiwań.

| Klaster | Typ | Dlaczego ten |
|---|---|---|
| **Koszty projektu** | poradnik + kalkulator | `/ile-kosztuje-aplikacji` istnieje i ma 0 kliknięć przy realnych wyświetleniach — jest fundament do rozbudowy |
| **Porównania technologii** | porównawczy | Next.js vs WordPress, WooCommerce vs Shopify, natywnie vs cross-platform. Artykuły porównawcze to najczęściej cytowany format |
| **Software house vs alternatywy** | porównawczy | freelancer, no-code, własny zespół. Zapytania o wysokiej intencji zakupowej |
| **Własne dane** | badanie | **największa dźwignia i jedyna nie do skopiowania.** Mamy realne liczby: koszty i terminy własnych projektów, dane GSC/GA4, wyniki kampanii Ads, log crawlerów AI z `store.ts`. Np. „Które boty AI faktycznie odwiedzają polską stronę firmową — 90 dni logów" |
| **Studia przypadku z liczbami** | analiza | Estalo, Jedmar (2 apki w sklepach), Domki Poznaniak (naprawiona podwójna konwersja). Konkrety zamiast „zrobiliśmy stronę" |

Pierwsza publikacja z klastra „Własne dane" ma priorytet — cytowalność bierze
się ze statystyk ze źródłem, a nasze źródło to my.

**Największa niewykorzystana dźwignia GEO na tej stronie jest poza blogiem:**
`/cennik` (52 linijki) nie zawiera **ani jednej liczby**, a `/llms.txt` uczciwie
to przyznaje. Asystent porównujący wykonawców odpada taką stronę, bo nie ma czego
zacytować.

**Decyzja Wojtka z 2026-08-08: widełek na razie nie podajemy.** Temat wraca po
analizie z Bartoszem. To jest świadome oddanie tej dźwigni, nie przeoczenie —
zapisane tu, żeby przy kolejnym audycie SEO nikt nie zgłosił tego jako nowego
odkrycia i nie zaczął dyskusji od zera.

Konsekwencja dla bloga: skoro strona nie poda liczb, **teksty w klastrze
„koszty projektu" muszą podać widełki jako treść merytoryczną** — co podbija
i co obniża koszt, przedziały dla typów projektów, od czego zależy termin.
Inaczej ten klaster powtórzy problem `/cennik` na stu stronach.

---

## 6. Zakres prac

| # | Zadanie | Weryfikacja (agent odpala sam) |
|---|---|---|
| 1 | Pipeline MDX + zod + trasy `/blog`, `/blog/[slug]`, `/blog/klaster/[c]`, RSS | `npm run build` zielony, `/blog` renderuje 2 posty seedowe |
| 2 | `BlogPosting` + `FAQPage` + `BreadcrumbList` w istniejącym grafie | walidator schema bez błędów; `curl` zwraca JSON-LD w HTML serwerowym |
| 3 | Posty derywowane do sitemap / `llms.txt` / IndexNow z jednego źródła | test: liczba URL-i w sitemapie == w `llms.txt` == w katalogu treści |
| 4 | `blog-contract.test.ts` + rozszerzenie `ssr-content.test.ts` | celowo wadliwy post seedowy wywala test; poprawny przechodzi |
| 5 | `lastmod` z historii gita, nie z daty builda | `git log --format=%cI -1 <plik>` == `lastmod` w sitemapie |
| 6 | Link do bloga w stopce i nawigacji | `grep -rlo 'href="/blog"' .next/server/app/*.html \| wc -l` == liczba stron |
| 7 | Cron + worktree + `gh pr create` + Telegram | jeden przebieg na sucho tworzy PR z draftem i zielonym buildem |
| 8 | Rozdzielenie ruchu AI w `/crm/analytics` | bucket `ai` z `attribution.ts` widoczny jako osobny wiersz |

Zadania 1–6 są niezależne od 7 — blog musi najpierw stać ręcznie, dopiero
potem podpinamy automat. Odwrotna kolejność to automatyzacja niedziałającego procesu.

Punkt 6 nie jest kosmetyką: główną przyczyną pozycji 26 w Google były strony
sieroty (`/stack` i `/strony-internetowe` po zero linków wewnętrznych). Blog bez
linkowania powtórzy ten błąd w skali 100 stron.

---

## 7. Poza zakresem

- Wersja EN bloga (i18n jest dziś czysto klientowe — decyzja otwarta z poprzedniego planu).
- Newsletter i przechwytywanie e-maili z bloga.
- Zewnętrzne narzędzia monitoringu AI (Otterly, Peec) — płatne, na razie ręczny przegląd.
- Zmiana `/cennik` (sekcja 5) — osobna decyzja.
- Obecność w źródłach trzecich (Reddit, Wikipedia, katalogi) — realnie ważniejsza
  niż własny blog, ale to inna robota i inny plan.

---

## 8. Kryteria oceny po 90 dniach

Mierzalne, bez miejsca na „wydaje się, że działa":

1. **GSC**: liczba zapytań, na które strona wyświetla się w top 10, rośnie
   względem bazy 38 kliknięć / 1300 wyświetleń z 90 dni przed 2026-08-04.
2. **Bucket `ai`** w `attribution.ts`: liczba sesji z asystentów AI > 0
   i rosnąca. Dziś nie ma z czego rosnąć.
3. **Log crawlerów AI** (`store.ts`): OAI-SearchBot / Claude-SearchBot /
   PerplexityBot pobierają strony bloga w ciągu 14 dni od publikacji.
4. **Ręczny przegląd cytowań**, raz w miesiącu: 20 stałych zapytań w ChatGPT,
   Perplexity i Google. Rejestr: czy cytowani, kto zamiast nas, która strona.
5. **Bramka jakości**: jeśli więcej niż 1 na 4 PR-y od agenta wymaga
   przepisania od zera — schodzimy na 1 nowy tekst tygodniowo. To nie jest
   porażka planu, tylko właściwa reakcja.

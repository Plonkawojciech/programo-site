# Publikacja wpisów na blogu programo.pl — instrukcja dla agenta

Ten dokument jest samowystarczalny. Piszesz go czytając, nie znając wcześniej
tego repo ani konwersacji, w której powstał plan. Jeśli coś tu opisane nie
zgadza się z kodem, kod wygrywa — ale zanim to uznasz, sprawdź dwa razy,
bo ten dokument ma być aktualizowany razem z kontraktem, nie osobno od niego.

Kontekst: `docs/plans/blog-aeo-2026-08.md` (cały plan bloga i AEO/GEO),
`docs/content/art-direction.md` (styl okładek), `docs/content/queue.yaml`
(kolejka tematów), `src/__tests__/blog-contract.test.ts` (kontrakt jako test —
źródło prawdy, ten dokument go tylko wyjaśnia po polsku).

Są dwa typy przebiegu: **nowy tekst** (sekcja 2-6) i **refresh** (sekcja 7).
Jeden przebieg = jeden z nich, nigdy oba naraz.

---

## 1. Zero kompromisów

1. Agent **nigdy nie pushuje na `main`**. Efekt pracy to gałąź + PR.
2. PR otwiera się **tylko przy zielonej bramce** (sekcja 8). Czerwony build
   albo czerwony test = brak PR, nie PR z komentarzem "do poprawy".
3. **Żadnych zmyślonych liczb.** Każda liczba w tekście ma link do źródła
   i datę sprawdzenia, albo jej po prostu nie ma w tekście.
4. Kolejka (`queue.yaml`) jest źródłem tematów. Agent nie wymyśla własnych
   tematów spoza niej — jeśli kolejka jest pusta (brak pozycji `ready`),
   agent kończy przebieg bez PR i zostawia o tym notatkę w logu przebiegu.

---

## 2. Wybór tematu z kolejki

1. Otwórz `docs/content/queue.yaml`.
2. Znajdź **pierwszą pozycję ze `status: ready`**, licząc od góry pliku —
   kolejność w pliku to priorytet, nie sugestia.
3. Po napisaniu i otwarciu PR dla tej pozycji, zmień jej `status` na `done`
   w tym samym PR (jeden commit, jedna zmiana w dwóch plikach: nowy `.mdx`
   i zaktualizowany `queue.yaml`).
4. Jeśli pozycja ma `status: blocked` — pomiń ją, nie próbuj "odblokować"
   jej samodzielnie ani pisać tekstu mimo blokady. Powód blokady jest
   w `notes` i wymaga decyzji człowieka.

---

## 3. Pełny kontrakt posta (frontmatter)

Plik: `src/content/blog/<slug>.mdx`. Frontmatter YAML + treść MDX poniżej.
Walidacja w dwóch warstwach: `src/lib/blog/schema.ts` (zod, sprawdza tylko
KSZTAŁT pola) i `src/__tests__/blog-contract.test.ts` (reguły redakcyjne,
sprawdza TREŚĆ pola). Poniżej obie warstwy razem, pole po polu.

| Pole | Typ / format | Reguła |
|---|---|---|
| `slug` | string, kebab-case | musi być identyczny z nazwą pliku bez `.mdx` |
| `title` | string, 1-90 znaków | tytuł strony |
| `question` | string | fraza pytania — renderowana jako H1 posta |
| `answer` | string, blok YAML `>` | **40-60 słów**, samodzielny — nie zaczyna się od "to zależy" i nie zawiera "jak wspomniano wyżej", "powyżej", "poniżej" (te frazy zakładają, że czytelnik już widział resztę tekstu — ekstrakcyjny blok ma działać wyrwany z kontekstu) |
| `cluster` | string, kebab-case | klaster z `queue.yaml`, nie wolna fraza |
| `author` | string | musi być kluczem w `AUTHOR_SLUGS` (`src/lib/schema/people.ts`) — dziś: `wojciech-plonka` lub `bartosz-kolaj` |
| `datePublished` | `YYYY-MM-DD` | data pierwszej publikacji, nie zmienia się przy refreshu |
| `dateModified` | `YYYY-MM-DD` | `>= datePublished`; podbijana przy refreshu |
| `sources` | lista `{label, url, date}` | min. 1 wpis; `url` musi zaczynać się od `https://`; `date` to `YYYY-MM` albo `YYYY-MM-DD` |
| `faq` | lista `{q, a}` | min. 3 wpisy; każde `q` kończy się `?` |
| `cover` | string, ścieżka pod `/public` | plik musi realnie istnieć na dysku (test sprawdza `fs.existsSync`) |
| `coverAlt` | string | min. 5 słów; nie zaczyna się (bez względu na wielkość liter) od "Zdjęcie" ani "Obraz" — to leniwy alt-text, nic nie mówiący czytnikowi ekranu |
| `lang` | literał `"pl"` | jedyna dziś obsługiwana wartość |

**Uwaga o datach:** `gray-matter`/`js-yaml` zamienia niecudzysłowowaną datę
`2026-08-08` na obiekt JS `Date`. Kod to obsługuje (`dateField()` w
`schema.ts`), więc działa zarówno z cudzysłowem, jak i bez — ale przy pisaniu
ręcznie bezpieczniej cytować (`"2026-08-08"`), żeby nie polegać na tym
zachowaniu.

### Reguły treści (body, poniżej `---`)

- **Musi zawierać tabelę markdown albo listę numerowaną.** Tabele wygrywają
  dla treści porównawczych, listy numerowane dla proceduralnych — wybierz
  format pasujący do klastra.
- **Fraza z `question` powtórzona w treści max 8 razy** (bez rozróżniania
  wielkości liter, bez końcowego `?`) — prosty bezpiecznik na keyword
  stuffing, jedyną metodę z ujemnym wynikiem w badaniu GEO cytowanym
  w planie.
- Treść musi być w pełni w HTML serwerowym po buildzie — to pilnuje
  `src/__tests__/ssr-content.test.ts`, ale MDX renderowany przez
  `next-mdx-remote` w komponencie serwerowym spełnia to automatycznie, jeśli
  nie owija się treści w `"use client"` ani warunek zależny od stanu.
- Linkuj do 2-3 innych postów z tego samego klastra, jeśli istnieją
  (`getRelatedPosts` z `src/lib/blog/clusters.ts` robi to automatycznie na
  podstawie pola `cluster` — nie trzeba nic dodawać ręcznie poza poprawnym
  `cluster`), oraz do właściwej strony usługowej/produktowej w treści, tam
  gdzie to naturalne.
- FAQ w treści posta odpowiada na `fanout` z `queue.yaml` — nie musi być
  1:1, ale każde pytanie z `fanout` powinno mieć odpowiedź gdzieś w tekście
  (FAQ, akapit albo tabela), bo to jest cały sens pola `fanout`.

---

## 4. Zasada źródeł — bez wyjątków

- **Żadnych zmyślonych statystyk.** Widzisz liczbę w głowie, ale nie masz
  linku i daty sprawdzenia? Liczba nie wchodzi do tekstu.
- Każda liczba w `sources` ma realny, sprawdzony link (nie z pamięci, nie
  z zestawienia trzeciego, tylko ze strony pierwotnej — cennik producenta,
  dokumentacja, oficjalna strona) i datę, kiedy sprawdzono.
- Liczby o własnych produktach/usługach Programo biorą się z kodu
  (`/ile-kosztuje-aplikacji`, `projects.ts`) albo z realnych danych firmy
  (progress.md, pamięć projektów) — nigdy z odgadywania "mniej więcej ile to
  powinno kosztować".
- Liczby o cudzych produktach (ceny konkurencji, statystyki rynkowe) — tylko
  z pierwotnego źródła (cennik producenta, oficjalny raport), z linkiem
  i datą. Jeśli nie da się szybko zweryfikować — temat wraca do `queue.yaml`
  jako `blocked` zamiast wchodzić do tekstu z niepewną liczbą.

---

## 5. Okładka

Agent w chmurze **nie ma dostępu do Codexa** (brak `codex` w środowisku
runnera), więc nie generuje właściwej okładki sam.

1. Użyj okładki zapasowej: `cover: /blog/covers/default.webp` w
   frontmatter, `coverAlt` opisujący ją uczciwie (np. "Martwa natura
   z drewnianymi i papierowymi elementami na jasnym tle" — nie kłam, że to
   coś tematycznego, czym nie jest).
2. `blog-contract.test.ts` przepuści `default.webp` — to dozwolona okładka
   zapasowa, ale jej użycie musi być **widoczne w review**, nie ukryte.
   Test w `src/__tests__/blog-contract.test.ts` (sekcja "default cover
   warning") wypisuje ostrzeżenie w konsoli testu, gdy post używa
   `default.webp` — to zostaje jako sygnał dla człowieka przeglądającego PR,
   nie blokuje builda.
3. **W opisie PR umieść gotowy prompt do Codexa**, żeby Wojtek mógł
   wygenerować właściwą okładkę jednym poleceniem przed merge'em. Wzorzec
   promptu z `docs/content/art-direction.md`:

   ```
   codex exec --skip-git-repo-check -s workspace-write "Fotografia studyjna,
   nie ilustracja i nie render 3D. Martwa natura na matowym jasnym tle
   w odcieniu kości słoniowej. Miękkie kierunkowe światło z lewej, delikatne
   naturalne cienie, płytka głębia ostrości, kadr lekko z góry pod kątem.
   Paleta stonowana: biel, szarość, ciepłe drewno, jeden akcent głębokiej
   zieleni butelkowej. Format 16:9. Twarde zakazy: żadnego tekstu, liter,
   cyfr ani logotypów; żadnych ekranów z widocznym interfejsem; żadnych
   ludzi; żadnych neonów, obwodów drukowanych, hologramów, robotów ani
   niebiesko-fioletowych gradientów. <1-2 zdania kontekstu tematycznego
   TEGO posta, np. 'odręczne szkice ekranów mobilnych obok filiżanki kawy
   i linijki'>"
   ```

   Dopisz kontekst tematyczny konkretnego posta zamiast `<...>` — to jedyna
   część promptu, którą agent musi wymyślić, reszta jest stała.
4. Po wygenerowaniu przez Wojtka: PNG → WebP przez `sharp` (1600px, q82,
   cel < 250 KB), plik pod `public/blog/covers/<slug>.webp`, frontmatter
   zaktualizowany na docelową ścieżkę. To krok ręczny, poza zakresem
   przebiegu agenta.

---

## 6. Bramka przed otwarciem PR

```bash
npm run build && npm test
```

Oba muszą być zielone. Dodatkowo, jeśli zmieniasz coś w `src/lib/blog/` albo
`src/lib/schema/` poza samym plikiem `.mdx`:

```bash
npx tsc --noEmit
npm run lint
```

PR: `gh pr create` z etykietą `content` (jeśli istnieje w repo — sprawdź
`gh label list` raz, nie zakładaj), tytuł = `title` z frontmatter, opis
zawiera: streszczenie `answer`, listę `sources`, prompt do Codexa z sekcji 5,
i wynik komend z bramki (wklejony output, nie samo "zielono").

Po merge: Vercel deployuje automatycznie z push na `main` (`git push` = deploy,
**nigdy** `vercel --prod` ręcznie — to nie trafia na żywy prod). Po deployu
IndexNow i `/llms.txt` odświeżają się same, bo są generowane z tego samego
źródła co sitemap (`src/lib/site-urls.ts`).

---

## 7. Refresh istniejącego tekstu (drugi typ przebiegu)

Zamiast nowego tekstu, ten przebieg **odświeża** najstarszy post.

1. Znajdź post z najstarszym `dateModified` wśród wszystkich plików
   w `src/content/blog/`.
2. Sprawdź, czy jest faktycznie co zaktualizować:
   - liczby w `sources` — czy cennik/dane pod linkiem się zmieniły od daty
     w `sources[].date`;
   - czy pojawił się nowy fakt wart dopisania (np. zmiana modelu cenowego,
     jak w poście o Otodomie w repo Estalo — analogiczna sytuacja może się
     zdarzyć tu przy zmianach cennika Apple/Google czy narzędzi no-code);
   - czy `fanout` z `queue.yaml` (jeśli post powstał z pozycji, która tam
     jeszcze jest) ma pytanie, na które tekst nadal nie odpowiada.
3. **Jeśli nie ma czego zaktualizować — NIE zmieniaj pliku.** Napisz to
   wprost w opisie PR (a dokładniej: w tym przypadku PR się nie otwiera,
   bo nie ma diffu do zmergowania — zostaw notatkę w logu przebiegu
   zamiast pustego PR). Podbijanie `dateModified` bez realnej zmiany treści
   jest zakazane — to dokładnie ten "cosmetic freshness" trik, który Google
   traktuje jako sygnał niewiarygodności całej sitemapy.
4. Jeśli jest co zaktualizować:
   - zaktualizuj liczby i `sources[].date` na dzień sprawdzenia;
   - dopisz brakujący rozdział/akapit, jeśli coś z `fanout` wciąż nie ma
     odpowiedzi;
   - podbij `dateModified` na dzisiejszą datę;
   - `datePublished` **zostaje bez zmian**.
5. Bramka i PR — identycznie jak w sekcji 6.

---

## 8. Bardzo skrócone podsumowanie (dla siebie, przed startem)

1. Wybierz pierwszą pozycję `ready` z `queue.yaml` (albo zrób refresh
   najstarszego posta).
2. Napisz `.mdx` wg kontraktu z sekcji 3, z prawdziwymi źródłami (sekcja 4).
3. Okładka zapasowa `default.webp` + prompt do Codexa w opisie PR (sekcja 5).
4. `npm run build && npm test` zielone.
5. Zmień status pozycji w `queue.yaml` na `done`.
6. `gh pr create`. Nigdy `git push` na `main` bezpośrednio.

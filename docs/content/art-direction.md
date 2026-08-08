# Styl domowy okładek bloga

Ten dokument jest źródłem prawdy dla promptu generującego okładki postów.
Automatyzacja publikacji (`docs/plans/blog-aeo-2026-08.md`, sekcja 4) ma go
czytać przy każdym kolejnym poście zamiast wymyślać styl od nowa.

## Prompt (art direction)

> Fotografia studyjna, nie ilustracja i nie render 3D. Martwa natura na
> matowym jasnym tle w odcieniu kości słoniowej. Miękkie kierunkowe światło
> z lewej, delikatne naturalne cienie, płytka głębia ostrości, kadr lekko
> z góry pod kątem. Paleta stonowana: biel, szarość, ciepłe drewno, jeden
> akcent głębokiej zieleni butelkowej. Format 16:9.
>
> Twarde zakazy: żadnego tekstu, liter, cyfr ani logotypów; żadnych ekranów
> z widocznym interfejsem; żadnych ludzi; żadnych neonów, obwodów
> drukowanych, hologramów, robotów ani niebiesko-fioletowych gradientów.

Do promptu dopisać 1-2 zdania kontekstu tematycznego posta (np. "przedmioty
kojarzące się z planowaniem UI mobilnego" albo "frezowany element
aluminiowy obok odlewanych plastikowych obudów - metafora precyzji vs
masowej produkcji"), żeby okładka nie była generycznym zestawem
przedmiotów, tylko czymś, co da się skojarzyć z tematem po jednym
spojrzeniu.

## Komenda, którą powstały obrazy

```bash
codex exec --skip-git-repo-check -s workspace-write "<prompt jak wyżej + kontekst tematyczny posta>"
```

## Kompozycja i kadrowanie

- Format źródłowy: 16:9, pełna szerokość kadru wykorzystana pod hero posta
  i kartę na `/blog`.
- Jeśli kompozycja ma pustą przestrzeń po jednej stronie (jak
  `covers/default.webp`), ta strona nadaje się pod nakładany tekst/gradient -
  sprawdzić to na oko przed użyciem jako tło z nałożonym tytułem (OG image).
  Kompozycje wypełnione po obu stronach (jak porównanie technologii) nie
  nadają się pod tekst na wierzchu i powinny być używane bez nakładki albo
  z ciemnym gradientem od dołu, tak jak istniejące karty portfolio na
  homepage (`client-work.tsx`).

## Pipeline plików

1. Wygenerowany PNG (zwykle ~2 MB) trafia do scratchpada.
2. Konwersja do WebP, szerokość 1600 px, jakość 82, przez `sharp`:
   ```bash
   npx --yes -e "
   const sharp = require('sharp');
   sharp('<src.png>').resize({ width: 1600 }).webp({ quality: 82 }).toFile('<dest.webp>');
   "
   ```
   Cel: plik poniżej 250 KB. `next/image` dorabia resztę (dalsza
   kompresja, responsywne rozmiary, lazy loading poza hero).
3. Docelowa ścieżka: `public/blog/covers/<slug>.webp`, gdzie `<slug>` to
   `frontmatter.slug` posta. Fallback bez dedykowanej okładki:
   `public/blog/covers/default.webp`.
4. Frontmatter posta:
   ```yaml
   cover: /blog/covers/<slug>.webp
   coverAlt: >
     Opis sceny dla czytnika ekranu, min. 5 słów, bez zaczynania od
     "Zdjęcie" albo "Obraz" (patrz blog-contract.test.ts).
   ```

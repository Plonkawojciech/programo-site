# Archivo PL/EN

Samodzielnie hostowany podzbiór dotychczasowego Archivo Version 2.001. Jeden plik
WOFF2 ma 58 688 B zamiast dwóch preloadowanych plików Google Fonts o łącznej
wielkości 175 952 B (o 66,7% mniej). To pomiar assetów, nie dowód poprawy LCP.

Źródło: [google/fonts — Archivo](https://github.com/google/fonts/tree/main/ofl/archivo).
Oryginalny font pochodzi z `Archivo[wdth,wght].ttf`; adres i sprawdzany SHA-256 są
w `prepare-archivo.py` oraz `proof.json`. Licencja SIL OFL 1.1 jest w `OFL.txt`.
Zachowane osie: `wght` 100–900 (domyślnie 600) i `wdth` 62–125 (domyślnie 100).

Podzbiór obejmuje ASCII, cały polski alfabet, `£€$`, oraz znaki obsługiwane przez
dotychczasowy font i występujące w całym `src/**/*.ts`, `src/**/*.tsx` oraz
`src/**/*.mdx`, w tym słownikach i treściach bloga. Symbole, których poprzednia
wersja webfontu nie obsługiwała, nadal korzystają ze stosu fallback; dotyczy to
między innymi `←→≈≠↗✓`. Nie zmieniamy ich wyglądu dodaniem nowych glifów.

Zachowane domyślne ligatury, kerning, lokalizacja, znaki diakrytyczne i `tnum`
(używane przez `tabular-nums`). Usunięte nieużywane opcjonalne alternatywy, między
innymi ozdobne cyfry i ułamki. Oryginał nie ma instrukcji hintingu glifów;
usunięcie tabel hintingu nie zmienia sprawdzanych obrysów ani metryk.

`proof.json` zapisuje dokładne wyniki porównania HarfBuzz: nazwy glifów, klastry,
advances i offsets dla wszystkich linii źródeł oraz każdej pary liter łacińskich
i polskich, po polsku i angielsku, przy domyślnych funkcjach oraz `tnum`.
Porównania obejmują 600/100, nagłówek 700/108 oraz skrajne 100/62 i 900/125.
Przy każdej pozycji osi obrysy wszystkich zachowanych znaków i metryki `hmtx`
są identyczne z oryginałem i poprzednimi fontami Google z cache Next.

`archivo-fallback.css` zachowuje dokładnie poprzedni fallback Arial:
ascent 88,96%, descent 21,28%, line gap 0%, size-adjust 98,7%.
Źródłem jest poprzedni wygenerowany plik
`.next/dev/static/chunks/[next]_internal_font_google_archivo_8eac69ea_module_css_bad6b30c._.single.css`,
SHA-256 `4c9b91978a9b8b5a729df90cd3039c2813bccf8fe6f39fc80b39fb3854181b95`.
`baseline.json` zapisuje także hashe i zakres znaków poprzednich fontów.
`adjustFontFallback: false` zapobiega przeliczeniu tych metryk przez localFont.

Odtworzenie assetu i dowodu w odizolowanym środowisku, z głównego katalogu repo:

```sh
python3 -m venv /tmp/programo-archivo-tools
/tmp/programo-archivo-tools/bin/pip install fonttools==4.66.1 brotli==1.2.0 uharfbuzz==0.56.3
curl -fL 'https://raw.githubusercontent.com/google/fonts/main/ofl/archivo/Archivo%5Bwdth,wght%5D.ttf' -o /tmp/programo-archivo.ttf
/tmp/programo-archivo-tools/bin/python src/app/fonts/prepare-archivo.py /tmp/programo-archivo.ttf
```

Opcjonalne `--extra-src /path/to/other/worktree/src` włącza równoległe zmiany do
sprawdzenia pokrycia. `--baseline-dir .next/dev/static/media` sprawdza także
zachowane stare fonty, dopóki są dostępne w cache (hash każdego jest weryfikowany).
Skrypt odrzuca inną wersję oryginału; aktualizacja upstream wymaga ponownej oceny.
Modyfikacja źródłowych treści może zmienić wymagany podzbiór i wielkość pliku.

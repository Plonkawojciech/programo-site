# Animacje CSS — pomiar przed i po

Data: 2026-10-01  
Gałąź: `css-motion-2026-10`

## Metoda

Next.js 16.1.6 nie drukuje tabeli First Load JS. Dla każdej wskazanej trasy
zebrano unikalne adresy `<script src>` z odpowiadającego jej statycznego HTML w
`.next/server/app/`, a następnie zsumowano rozmiary tych plików po `gzip -9`.

Środowisko wykonawcze nie pozwalało wykonać dokładnej komendy `npx next build`:

- odziedziczone `NODE_USE_SYSTEM_CA` kończyło proces błędem
  `SecItemCopyMatching failed -50` i kodem 139;
- po usunięciu tej zmiennej build próbował pobrać Archivo z Google Fonts, ale
  sandbox nie ma dostępu sieciowego;
- po podaniu lokalnej odpowiedzi testowej dla fontu Turbopack nie mógł otworzyć
  wewnętrznego portu procesu roboczego (`Operation not permitted`).

Dlatego porównywalne buildy przed i po wykonano przez produkcyjny webpack:

```bash
env -u NODE_USE_SYSTEM_CA \
  NEXT_FONT_GOOGLE_MOCKED_RESPONSES=/tmp/programo-next-font-mock.cjs \
  NEXT_TELEMETRY_DISABLED=1 \
  ./node_modules/.bin/next build --webpack
```

Lokalna odpowiedź fontu wskazywała systemowy font tylko na potrzeby odciętego od
sieci builda. Nie zmienia ona grafu JavaScript i była identyczna przed i po.

## First Load JS po gzip

| Trasa | Przed | Po | Różnica |
|---|---:|---:|---:|
| `/` | 294 830 B | 295 061 B | +231 B (+0,08%) |
| `/oferta` | 284 615 B | 284 707 B | +92 B (+0,03%) |
| `/projekty` | 293 058 B | 293 251 B | +193 B (+0,07%) |
| `/cennik` | 281 869 B | 281 896 B | +27 B (+0,01%) |

Wynik nie jest lepszy. Framer Motion nadal znajduje się we wspólnych chunkach,
bo korzystają z niego komponenty wyłączone z zakresu tej zmiany, między innymi
nawigacja i przejścia stron. Usunięcie importów Framera ze wskazanych sekcji
zmniejsza wykonywaną pracę i hydratację tych sekcji, ale mały globalny fallback
oraz CSS zwiększyły łączny transfer o 27–231 B zależnie od trasy.

## `/` — long tasks, LCP i CLS

Skrypt `scripts/measure-perf.mjs` zawiera wymagane trzy przebiegi, viewport
390×844, Chrome przez `channel: "chrome"`, 4× CPU throttling przez CDP i okno
pomiaru 8 s.

| Metryka (mediana z 3) | Przed | Po |
|---|---:|---:|
| Suma long tasks | niewykonane | niewykonane |
| LCP | niewykonane | niewykonane |
| CLS | niewykonane | niewykonane |

Powód: `next start --port 3111` nie może nasłuchiwać w tym sandboxie
(`listen EPERM`), a uruchomiony przez Playwright Chrome kończy się `SIGABRT`.
Kontrolowany Chrome odrzuca lokalne adresy `file://`, więc nie dało się uczciwie
zastąpić serwera statycznym plikiem. Nie wpisano liczb zastępczych.

## Widoczność treści

`scripts/check-reveal-visibility.mjs` obejmuje 30 wymaganych kombinacji:
5 tras × 2 viewporty × 3 tryby (`default`, `reduced-motion`, `no-js`), przewija
stronę do końca i zgłasza elementy w `main` wyższe niż 40 px z opacity poniżej
0,05, z pominięciem wariantów zdjęć wskazanych w zadaniu.

Pełny test przeglądarkowy: **niewykonany z powodu tych samych blokad portu i
procesu Chrome**.

Dowód statyczny z końcowego builda:

| Trasa | Elementy `.reveal` w HTML | `.reveal` z inline `opacity: 0` |
|---|---:|---:|
| `/` | 10 | 0 |
| `/oferta` | 7 | 0 |
| `/projekty` | 0 | 0 |
| `/o-nas` | 7 | 0 |
| `/strony-internetowe` | 25 | 0 |

Stan ukryty istnieje wyłącznie w CSS pod jednoczesnym warunkiem `html.js` i
`prefers-reduced-motion: no-preference`. Bez JavaScript klasa `js` nie powstaje;
przy reduced motion cały blok reguł ukrywających jest pomijany.

Końcowy HTML dla `/`, `/strony-internetowe` i `/sklepy-internetowe` zawiera po
pięć linków trust bara do właściwych case studies, pięć etykiet `aria-label` i
jedną linię opisu zakresu.

## Bramki

| Sprawdzenie | Wynik |
|---|---|
| `npx tsc --noEmit` | OK |
| `npx vitest run` | OK — 24 pliki, 288 testów |
| `npx eslint` | OK — kod 0; 1 wcześniejsze ostrzeżenie w `home/hero.tsx` |
| `next build --webpack` w opisanym środowisku offline | OK — 51/51 stron |
| dokładne `npx next build` | niewykonane — ograniczenia sandboxa opisane wyżej |

## Granice zakresu

- Nie zmieniono komponentów i modułów wyłączonych w zadaniu.
- Karuzela w `client-work.tsx` została zachowana; usunięto z niej tylko hook
  Framera używany do sprawdzania reduced motion, zastępując go `matchMedia` w
  momencie kliknięcia.
- Parallax stopki usunięto; stopka pozostaje statyczna.
- `Reveal` zmieniono z komponentu klienckiego na renderowany bez hooków. Jeden
  globalny `RevealObserver` obsługuje wyłącznie fallback dla przeglądarek bez
  `animation-timeline: view()`.

# Migracja programo.pl z Vercela na Coolify: instrukcja

Stan na 1.10.2026: kod przygotowany na gałęzi `coolify-migration`, obraz zbudowany i sprawdzony lokalnie
w Dockerze. **Na VM i w DNS nic nie zostało zmienione.** Uruchomienie na VM wymaga zgody Wojtka
(w zadaniu: „nie przenoś bez mojej zgody").

## Co jest na gałęzi

- `Dockerfile` (Node 22, trzy etapy, serwer standalone, użytkownik bez uprawnień roota, healthcheck);
- `.dockerignore` (bez `.env*`, `.git`, `docs`, `assets`);
- `next.config.ts`: `output: "standalone"` tylko przy `BUILD_STANDALONE=1`, więc build na Vercelu się nie zmienia;
- `GET /api/health`: odpowiada `{ ok: true }`, nie dotyka Redisa ani Telegrama;
- `sharp` jako bezpośrednia zależność (optymalizator obrazów Next poza Vercelem);
- `scripts/submit-indexnow.mjs`: poza Vercelem pinguje tylko przy `INDEXNOW_SUBMIT=1`.

Bez zmian w kodzie działają: adres IP klienta (czytany z `x-forwarded-for`, który ustawia Traefik), limit
prób w Redisie (Upstash przez REST), `after()` dla konwersji serwerowych, `proxy.ts`.
Jedna różnica: nagłówek `x-vercel-ip-country` zniknie, więc kraj w analityce first-party będzie pusty,
dopóki nie dodamy go inaczej (np. z Cloudflare albo z GeoIP). Nie wpływa na leady ani konwersje.

## Etap 1. Aplikacja w Coolify na hoście tymczasowym

Przed startem: `df -h` na VM. Dysk ma ok. 85%. Build obrazu potrzebuje ok. 2 GB na warstwy; jeśli wolnego
jest mniej niż 8 GB, najpierw sprzątanie starych obrazów (`docker image prune` z listą do akceptacji),
bo Coolify zostawia obraz po każdym deployu.

1. Coolify → New Resource → Public/Private Repository → `Plonkawojciech/programo-site`, gałąź
   `coolify-migration` (po cutoverze zmienić na `main`). Uwaga z CRM: sprawdzić, z którego remote czyta
   Coolify, żeby nie budował starego commita.
2. Build Pack: **Dockerfile**. Port: `3000`. Healthcheck: `/api/health`.
3. Domena: `https://programo-next.programo.pl` (wildcard `*.programo.pl` już wskazuje na VM; certyfikat
   wystawi Traefik).
4. Zmienne środowiskowe (wartości wkleja Wojtek, każda w jednej linii; nazwy 1:1 z Vercela):

   | Zmienna | Typ | Uwagi |
   |---|---|---|
   | `KV_REST_API_URL`, `KV_REST_API_TOKEN` | runtime | Upstash Redis: leady, limit prób, lista odrzuconych |
   | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | runtime | powiadomienia o leadach |
   | `CRM_WEBHOOK_SECRET`, `CRM_WEBHOOK_URL` | runtime | przekazanie leada do crm.programo.pl |
   | `CRM_EMAIL`, `CRM_PASSWORD` | runtime | logowanie do `/crm` |
   | `NEXT_PUBLIC_META_DATASET_ID` | **build arg** | wpisany w bundle przy buildzie |
   | `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | **build arg** | po założeniu kluczy Turnstile |
   | `TURNSTILE_SECRET_KEY` | runtime | jw. |
   | `KV_URL`, `REDIS_URL`, `KV_REST_API_READ_ONLY_TOKEN` | pominąć | kod ich nie czyta |

   Nieustawione także na Vercelu (bez zmian): `META_CAPI_ACCESS_TOKEN`, `GA4_API_SECRET`, `MS_GRAPH_*`.
   Na hoście tymczasowym **nie ustawiać** `TELEGRAM_*` ani `CRM_WEBHOOK_SECRET`, dopóki trwają testy,
   albo testować formularz jednym prawdziwym zgłoszeniem i oznaczyć je w CRM.
5. Dodać nagłówek `X-Robots-Tag: noindex` na hoście tymczasowym (Coolify → Labels Traefika), żeby kopia
   strony nie trafiła do indeksu obok oryginału.
6. Deploy przez Coolify. Zero ręcznych buildów na VM.

## Etap 2. Weryfikacja na hoście tymczasowym

Lista do odhaczenia (skrypt `scripts/audit-shots.mjs <baseUrl> <outDir> <trasy>` robi zrzuty w trzech
szerokościach i raport poziomego przewijania):

- [ ] 200 na każdej trasie z `sitemap.xml` (33 adresy + klastry bloga), 404 na nieistniejącym projekcie;
- [ ] `/dema` → 308 → `/projekty#dema`;
- [ ] obrazy: `/_next/image?url=…&w=828&q=75` z nagłówkiem `Accept: image/avif` zwraca `image/avif`
      (optymalizator Next z `sharp`, bez Vercela);
- [ ] nagłówki bezpieczeństwa z `next.config.ts` (HSTS, nosniff, X-Frame-Options, Referrer-Policy);
- [ ] `robots.txt`, `sitemap.xml`, `llms.txt`, `/opengraph-image`;
- [ ] formularz: jedno prawdziwe zgłoszenie z telefonu → Telegram + CRM + wpis w `/crm`; numer
      600 000 000 → wpis w `/crm/odrzucone`; w logach kontenera prawdziwy adres IP, nie adres Traefika;
- [ ] tracking: GA4 DebugView po akceptacji zgód (zdarzenia `page_view`, `generate_lead`), brak żądań do
      Meta i Clarity przed zgodą;
- [ ] `/crm` i `/crm/analytics`: logowanie działa;
- [ ] czas odpowiedzi strony głównej (TTFB) z zewnątrz, trzy pomiary na zimno i na ciepło, obok Vercela.

## Etap 3. Przełączenie DNS (krok dla Wojtka)

Strefa `programo.pl` stoi na serwerach `dns1.tld.pl` / `dns2.tld.pl` / `dns3.tld.pl`, więc rekordy zmienia
się w panelu rejestratora.

Dzień wcześniej:
1. Panel rejestratora → strefa DNS `programo.pl` → rekordy `A` dla `@` i `www` (dziś oba `76.76.21.21`).
   Zmień im TTL na 300 s. Nic więcej.

W dniu przełączenia, poza godzinami pracy:
2. W Coolify dodaj do aplikacji domeny `https://programo.pl` i `https://www.programo.pl` (z przekierowaniem
   `www` → bez `www`, tak jak dziś) i usuń nagłówek `noindex` z etapu 1.
3. W panelu rejestratora zmień rekord `A` dla `@` na adres VM (`159.195.206.7`, potwierdzić w Coolify
   przed zmianą). Rekord `www`: `A` na ten sam adres albo `CNAME` na `programo.pl`.
4. Rekordów `MX`, `TXT` (weryfikacje Google, Microsoft, Meta, SPF, DKIM) **nie ruszać**.
5. Po 5–10 minutach: `dig +short programo.pl` zwraca nowy adres, `curl -I https://programo.pl` pokazuje
   certyfikat Let's Encrypt i brak nagłówka `server: Vercel`.
6. Powtórzyć listę z etapu 2 na `programo.pl`. Jednorazowy build z `INDEXNOW_SUBMIT=1` nie jest potrzebny,
   adresy się nie zmieniają.

## Rollback

Vercel zostaje nietknięty przez co najmniej 48 godzin i dalej buduje się z `main`. Powrót to zmiana rekordu
`A` z powrotem na `76.76.21.21` (TTL 300 s, więc do 5 minut). W tym czasie obie platformy czytają ten sam
Redis, więc leady nie giną przy żadnym kierunku przełączenia.

## Po 48 godzinach

- gałąź `coolify-migration` scalić do `main`, Coolify przełączyć na `main`;
- TTL rekordów z powrotem na 3600 s;
- projekt na Vercelu wstrzymać (nie kasować od razu);
- zewnętrzny monitoring dostępności na `https://programo.pl/api/health` (co minutę, alert na Telegram);
- sprzątanie obrazów Dockera po deployach dopisać do crona `disk-guard`;
- poprawić w `CLAUDE.md` repo i w notatkach wpis „programo.pl stoi na Vercelu".

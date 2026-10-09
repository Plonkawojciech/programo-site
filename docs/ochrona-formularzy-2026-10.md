# Ochrona formularzy v3 (9.10.2026)

Każdy formularz prowadzi do `POST /api/contact`: hero, `CompactLeadForm`, pełny
`QuickContact` i formularz demo na `/projekty`. Identyfikatory formularzy i zgoda
na analitykę pozostają w istniejącym kontrakcie.

## Przyjęcie zgłoszenia

Serwer wymaga tokenu Cloudflare Turnstile i sprawdza go w Siteverify. Brak obu
kluczy, niepełna konfiguracja, błąd sieci lub odpowiedź HTTP Cloudflare z błędem
kończy się 503; odrzucony lub brakujący token daje 403. Dla prawdziwych kluczy
weryfikujemy również hostname oraz `action=contact`. Nie ma przepuszczania po awarii.
Widget resetuje token po każdej próbie, ponieważ tokeny wygasają po 300 sekundach
i działają jednokrotnie. [Weryfikacja serwerowa Cloudflare](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).

Usunęliśmy własne proof-of-work i obowiązkowe trzy sekundy czekania z flow v3.
Pola starego wyzwania pozostają zgodne ze schematem dla starszych kart. Telemetria
klawiatury, wskaźnika i `webdriver` może oznaczyć zgłoszenie do sprawdzenia, ale
nie odrzuca go; czytnik ekranu, dyktowanie lub autouzupełnienie mogą nie wygenerować
tych sygnałów. Po poprawnym Turnstile filtr treści oznacza nietypowe dane do
ręcznego sprawdzenia zamiast odrzucać brief z kilkoma linkami lub HTML. Honeypot
zapisuje odrzucenie do audytu i zwraca uczciwy błąd 422.

**200 oznacza trwały zapis do Redisa lub przyjęcie przez CRM.** Sam Telegram lub
mail nie wystarcza; bez zapisu serwer odpowiada 500. Dostępne powiadomienia nadal
wysyłają zgłoszenie. Awaria powiadomienia po zapisie nie zmienia sukcesu w błąd.
Odrzucone zgłoszenia po poprawnej weryfikacji Turnstile trafiają do audytu;
nieuwierzytelnione tokenem próby nie trafiają do CRM. Powtórki i zgłoszenia
podejrzane pozostają do ręcznego sprawdzenia, bez konwersji reklamowej.

## Klucze docelowe: instrukcja dla Wojtka

1. W [panelu Cloudflare](https://dash.cloudflare.com/) wybierz **Turnstile → Add widget**.
   Konto wystarczy; domena nie musi korzystać z DNS Cloudflare.
2. Nazwij widget `Programo formularze`. W Hostname Management dodaj `programo.pl`,
   `www.programo.pl` i `v3.programo.pl` (tylko jeśli ten podgląd ma przyjmować realne zgłoszenia).
   Klucze produkcyjne nie potrzebują localhost; do testów są osobne dummy keys.
3. Wybierz **Managed**, bez pre-clearance, i utwórz widget.
4. W aplikacji **Coolify na VM** ustaw publiczny `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   jako zmienną build i runtime, a `TURNSTILE_SECRET_KEY` jako sekret runtime.
   Ustaw `NEXT_PUBLIC_TURNSTILE_TEST_MODE=false` oraz właściwy `PROGRAMO_DEPLOYMENT_ENV`.
5. Wykonaj build/deploy podglądu, bo `NEXT_PUBLIC_*` Next.js wstawia podczas builda.
   Sprawdź prawdziwe zgłoszenie oraz trwały zapis na dedykowanym kanale podglądu.
   Dopiero Wojtek decyduje o przełączeniu produkcji i DNS.

Nigdy nie kopiujemy kluczy ani treści `.env*` do raportów, Git lub logów.

## Tryb testowy podglądu

Oficjalne klucze Cloudflare:

```text
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
NEXT_PUBLIC_TURNSTILE_TEST_MODE=true
PROGRAMO_DEPLOYMENT_ENV=preview
```

To publiczne wartości testowe, nie sekrety konta. Cloudflare przeznacza je do
przewidywalnych testów automatycznych; **nie zapewniają ochrony antyspamowej**.
[Opis dummy keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/).

Serwer pozwala na te wartości wyłącznie dla jawnego `preview`, `development` albo
`test`; hosty `programo.pl` i `www.programo.pl` zawsze je odrzucają. Samo ustawienie
dummy keys bez flagi testu kończy się 503. Widoczny tekst pod każdym widgetem
informuje, że zgłoszenie testowe nie trafia do zespołu Programo.

Test nie może korzystać z realnego Redisa, Telegrama ani maila Graph. Dozwolony
odbiorca to wyłącznie HTTP pod `localhost`, `127.0.0.1`, `[::1]` lub prywatny
serwis Compose `preview-intake`, z osobnym `CRM_WEBHOOK_SECRET` i `CRM_INTAKE_URL`.
Nie ustawiaj w tym trybie `KV_REST_API_URL`, `UPSTASH_REDIS_REST_URL`,
`TELEGRAM_BOT_TOKEN` ani `MS_GRAPH_CLIENT_SECRET`. Rekord ma źródło
`programo.pl-preview-test`, a `counted=false` wyłącza konwersje po obu stronach.

Sidecar odpowiada 201 `{ "ok": true }` dopiero po trwałym zapisie i fsync w wolumenie.
Weryfikuje nagłówek `X-Webhook-Secret`; nie przekazuje testów do prawdziwego CRM.
Taki zapis dowodzi działania kanału podglądu, a nie odbioru w produkcyjnym CRM lub skrzynce.

## Powtarzalny E2E lokalny

Uruchom `node scripts/e2e-forms.mjs`. Test tworzy własny serwer Next na porcie 3219,
izolowany odbiornik CRM na 4219 i tymczasowy plik JSONL. Otwiera świeży headless Chrome,
wypełnia prawdziwe formularze i czeka na token prawdziwego widgetu Cloudflare z dummy key.
Nie przechwytuje requestów formularza, nie wstrzykuje tokenu i nie odczytuje sekretów.

Sprawdza hero, formularz kompaktowy, pełny i demo: przeglądarka → HTTP Next →
Siteverify → CRM fixture → zapis z fsync. Odczytuje plik i potwierdza `formId`,
źródło testowe i nazwę rekordu. Sprawdza także brak zapisu po złym tokenie oraz
błąd 500 po awarii trwałego odbiornika. Kończy własne procesy i zamyka przeglądarkę;
plik dowodowy pozostaje pod ścieżką z raportu testu. `FORM_E2E_PORT`,
`FORM_E2E_FIXTURE_PORT` i `FORM_E2E_CHROME` pozwalają zmienić porty lub plik wykonywalny.

Test wymaga dostępu do Cloudflare. Przejście z dummy keys potwierdza integrację
widgetu i Siteverify, nie zdolność odróżniania realnego człowieka od bota.

## Wynik lokalny z 9.10.2026

E2E zakończył się sukcesem dla `hero-phone`, `kontakt-compact`, `kontakt-full`
i `dema`: cztery odpowiedzi 200 oraz cztery trwałe rekordy w fixture. Pełny
formularz zawierał dwa linki referencyjne; rekord pozostał w ręcznym przeglądzie,
bez konwersji. Niepoprawny token testowy dał 403 bez zapisu, a wyłączony trwały
odbiornik dał 500. Testy używały oznaczenia `TEST preview` i publicznego numeru
Programo; nic nie wysłały do rzeczywistego CRM, Telegrama ani skrzynki.

Osobno przeszły 83 testy API/i18n oraz pięć testów obowiązkowej bramki
(z dodatkową regresją briefu zawierającego dwa linki). Typecheck przeszedł
po zatrzymaniu serwera dev; równoległy odczyt generowanych plików `.next/dev`
podczas kompilacji nie był miarodajny. Pełny build i zestaw testów po scaleniu
wykonuje prowadzący agent na końcowym branchu.

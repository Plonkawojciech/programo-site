# Ochrona formularzy przed botami (stan na 1.10.2026)

## Skąd przychodzą fałszywe zgłoszenia: co wiadomo, a czego nie

Jedyny publiczny punkt wejścia to `POST /api/contact` na programo.pl. Piszą do niego cztery formularze:
hero na stronie głównej, `CompactLeadForm` na stronach ofertowych, pełny `QuickContact` i formularz
„Chcę demo" na `/projekty`. Każdy wysyła własny `form_id`. CRM (`crm.programo.pl/api/forms/programo`)
przyjmuje zgłoszenia tylko od programo.pl, z nagłówkiem z sekretem. Dema na `*.programo.pl` mają formularze
wyłączone i nic do nas nie wysyłają.

Czego nie udało się ustalić 1.10: jak wyglądały dotychczasowe fałszywe zgłoszenia. Logi Vercela sięgają
około godziny wstecz, a odczyt panelu `/crm` z leadami został w sesji zablokowany jako dane osobowe.
Zgłoszenia sprzed 1.10 nie mają zapisanego formularza, werdyktu ani sygnałów, więc wzorców nie da się z nich
odtworzyć. Od wdrożenia z 1.10 każde zgłoszenie to zapisuje.

Dwie hipotezy do sprawdzenia na danych (w tej kolejności):

1. **Przeglądarki sterowane automatycznie**, w tym nasi własni agenci AI testujący formularz na produkcji.
   Komentarz w `lib/bot-signals.ts` z września mówi, że śmieciowe zgłoszenia szły z prawdziwej,
   zautomatyzowanej przeglądarki, która wykonuje JavaScript. Agent, który „sprawdza formularz w realnym
   flow", wpisuje zmyślony numer w rodzaju 600 100 200. Taki numer należy do kogoś i to on odbiera
   telefon. To tłumaczyłoby, dlaczego ludzie się denerwują. Zasada do rozważenia w `CLAUDE.md` repo:
   formularzy na produkcji nie wysyłamy, test idzie lokalnie z podstawioną odpowiedzią API.
2. **Ruch z reklam**: boty klikające w Google Ads i wypełniające formularz. Rozpoznamy po `gclid`
   w odrzuconych zgłoszeniach i po strefie czasowej spoza Europy.

## Warstwy ochrony

| # | Warstwa | Gdzie | Od kiedy |
|---|---|---|---|
| 1 | Blokada narzędzi po User-Agent i obcego Origin | `lib/request-guard.ts` | 28.09 |
| 2 | Limit 10 prób / 10 min z jednego IP (Redis), 3 przyjęte / 15 min | `request-guard.ts`, `contact-schema.ts` | 28.09 |
| 3 | Walidacja serwerowa pól (zod), zgoda wymagana | `lib/contact-schema.ts` | wcześniej |
| 4 | Honeypot: dwa ukryte pola | `lib/form-challenge.ts` | 21.09 |
| 5 | Podpisane wyzwanie + proof of work + minimum 3 s od załadowania | `lib/form-challenge.ts` | 21.09 |
| 6 | Ocena zachowania: klawisze, ruch, dotyk, czas, `navigator.webdriver` | `lib/bot-score.ts` | 30.09 |
| 7 | **Filtr treści**: numery-wypełniacze i wzorce, numery spoza polskiej numeracji, linki, HTML, inny alfabet, domeny tymczasowe | `lib/spam-rules.ts` | 1.10 |
| 8 | **Powtórka**: ten sam telefon lub e-mail w ciągu 24 h dochodzi oznaczony, nie liczy się jako konwersja | `lib/leads.ts` | 1.10 |
| 9 | Cloudflare Turnstile | `lib/turnstile.ts`, `ui/turnstile.tsx` | kod gotowy od 21.09, **czeka na klucze** |

Co się dzieje ze zgłoszeniem:

- **odrzucone** (4, 6 lub 7 w wersji „na pewno"): nadawca dostaje zwykłe potwierdzenie, nie ma Telegrama, CRM
  ani konwersji. Od 1.10 trafia na listę odrzuconych z powodem;
- **podejrzane**: dochodzi na Telegram z etykietą PODEJRZANE i powodami, nie idzie do CRM, nie liczy się
  jako konwersja. **Nie dzwonić bez sprawdzenia powodów**;
- **czyste**: Telegram, CRM, konwersja.

Podgląd odrzuconych: `programo.pl/crm/odrzucone` (to samo logowanie co `/crm`). Jeśli pojawi się tam
prawdziwa osoba, reguła jest za ostra i trzeba ją poluzować.

## Co ma zrobić Wojtek: klucze Turnstile (ok. 5 minut)

1. Wejdź na `dash.cloudflare.com`, zaloguj się (konto darmowe wystarczy; domena nie musi być w Cloudflare).
2. Menu po lewej: **Turnstile** → **Add widget**.
3. Widget name: `programo.pl formularze`.
4. Hostname Management → **Add Hostnames**: wpisz `programo.pl`. Dodaj też `localhost` do testów lokalnych.
5. Widget Mode: **Managed** (zalecane: zagadka pokazuje się tylko podejrzanym).
6. Pre-clearance: **No**. Kliknij **Create**.
7. Skopiuj **Site Key** i **Secret Key**.
8. Vercel → projekt `programo-site` → Settings → Environment Variables → Production (i Preview):
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` = Site Key
   - `TURNSTILE_SECRET_KEY` = Secret Key (zaznacz Sensitive)
9. Deployments → ostatni → **Redeploy** (zmienna `NEXT_PUBLIC_*` wchodzi dopiero przy buildzie).

Muszą być ustawione **obie** zmienne. Sama jedna nic nie włącza (celowo, żeby pomyłka nie zablokowała
wszystkich formularzy). Po wdrożeniu pod polami formularza pojawi się mały widget Cloudflare; wyślij jedno
prawdziwe zgłoszenie z telefonu i sprawdź, że doszło na Telegram.

Gdy Cloudflare ma awarię, formularz przepuszcza zgłoszenia (pozostałe warstwy działają dalej). To świadomy
wybór opisany w `lib/turnstile.ts`.

## Zakładka „Leady z formularzy" w CRM Programo: zakres

Repo `crm_programo`, osobny worktree od `origin/main`, osobna sesja (w repo pracuje równolegle sesja CRM
i LeadHunter). Wdrożenie przez CI → Coolify.

Dziś webhook `/api/forms/programo` od razu tworzy rekord `Lead` z właścicielem z rotacji. Zgłoszenie
z formularza i lead sprzedażowy to ten sam byt, więc spam ląduje w kolejce dzwonienia.

Proponowany zakres:

1. **Model `FormSubmission`** (nowa tabela, migracja addytywna): `source` (domena), `formId`, `pageUrl`,
   dane kontaktowe, treść, `utm` (JSON), `verdict` (clean / suspicious / rejected), `verdictStage`,
   `verdictReasons` (tekst), `signals`, `status` (NEW / SPAM / REAL / CONVERTED), `leadId?`, `clientId?`,
   `createdAt`. Indeksy po `status`, `createdAt`, `source`.
2. **Webhook `/api/forms/intake`** (ten sam sekret): przyjmuje każde zgłoszenie razem z werdyktem i zapisuje
   `FormSubmission`. `Lead` powstaje automatycznie tylko dla `clean`; `suspicious` i `rejected` czekają na
   ręczną decyzję. Stary `/api/forms/programo` zostaje do czasu przełączenia strony.
3. **Strona `/formularze`** w nawigacji: lista z filtrami źródło / formularz / status, domyślnie bez
   spamu, przełącznik „pokaż spam". W wierszu: kiedy, skąd, dane, werdykt z powodami. Akcje: „prawdziwy"
   (tworzy lub podpina lead), „spam", „przekształć w klienta".
4. **Strona programo.pl**: po wdrożeniu CRM `route.ts` wysyła do `/api/forms/intake` wszystkie zgłoszenia,
   także odrzucone, z polami `formId`, `pageUrl`, `verdict`, `reasons`, `signals`. Lista w Redisie zostaje
   jako zapas.
5. **Inne strony**: klientom, którym prowadzimy stronę z formularzem, ten sam webhook z własnym `source`.
   Wymaga decyzji, czy leady klientów mają trafiać do naszego CRM (RODO: jesteśmy wtedy procesorem).
6. Poza zakresem pierwszej wersji: automatyczne uczenie filtra, powiadomienia, widok na iOS.

Kolejność: migracja i webhook → strona listy → przełączenie programo.pl → sprawdzenie na jednym prawdziwym
zgłoszeniu. Migracja tylko addytywna, uruchamiana przez deploy (nie ręcznie na produkcji).

# Zgłoszenia z programo.pl: 6.09–3.10.2026

Stan sprawdzenia: 9.10.2026. Badany okres obejmuje całe dni według `Europe/Warsaw`: od `2026-09-05T22:00:00Z` do `2026-10-03T22:00:00Z`, z wyłączeniem końca przedziału.

## Wynik

Znalazłem trzy ślady zgłoszeń z 3 października, które już mają rekordy w CRM w skrzynce `/formularze`, oraz jeden jawnie opisany test agenta. Nie znalazłem potwierdzonego brakującego leada z kompletem danych kontaktowych, który można bezpiecznie dopisać. Nie oznacza to, że wcześniejsze zgłoszenia nie zginęły: ich pełnego archiwum nie udało się odczytać przez dostępne uprawnienia i retencję.

Nie dodałem ani nie zmieniłem leadów. Nie wysyłałem wiadomości ani formularzy na produkcji.

## Lista odnalezionych śladów

W wersji Git imiona zastępują oznaczenia przypadków. Lokalny załącznik dla Wojtka zawiera oryginalne tytuły powiadomień, identyfikatory i odpowiedź API: `.vercel/recovery/2026-10-09-utracone-zgloszenia.private.json` w głównym repo. Katalog `.vercel` jest ignorowany przez Git. API nie udostępniło telefonów, adresów e-mail ani właściwej treści tych zgłoszeń.

| Przypadek | Kiedy CRM zapisał powiadomienie (CEST) | Czego dotyczyło według powiadomienia | Zapis i dalsza decyzja |
|---|---|---|---|
| CASE-01 | 3.10.2026, 23:23:36 | Wycena projektu; zapytanie z `/kontakt` | [Rekord w skrzynce formularzy](https://crm.programo.pl/formularze?id=cmuswfrtz006ams3lucjkcdab); wymaga oceny treści i kontaktu |
| CASE-02 | 3.10.2026, 21:57:27 | Wycena projektu; zapytanie z `/kontakt` | [Rekord w skrzynce formularzy](https://crm.programo.pl/formularze?id=cmustcz9e002yms3luaayb9pf); wymaga oceny treści i kontaktu |
| CASE-03 | 3.10.2026, 21:27:26 | Wycena projektu; zapytanie z `/kontakt` | [Rekord w skrzynce formularzy](https://crm.programo.pl/formularze?id=cmussadgx001tms3lsgx6ea6b); wymaga oceny treści i kontaktu |
| TEST-01 | 3.10.2026, 19:35:16 | Test Claude po wdrożeniu skrzynki formularzy; opis prosi o zignorowanie | [Istniejący test](https://crm.programo.pl/formularze?id=cmusoa4sd0001oa3lqrgv9eeh); wyłączony z kandydatów sprzedażowych |

Źródło: aktualny odczyt MCP `GET /api/v1/notifications?limit=500`. Serwer ogranicza limit do 200; zwrócił 82 powiadomienia, najstarsze z 23.07.2026, więc wynik nie osiągnął tego limitu. Cztery powyższe mają `type: FORM_SUBMISSION`, `payload.formSubmissionId` oraz `leadId: null`. To dowód istnienia zgłoszenia w skrzynce formularzy, nie dowód tożsamości człowieka, poprawnego numeru ani braku wcześniejszego leada z tym samym kontaktem. Pozostałych powiadomień po 3.10 nie włączyłem do raportu; wpis z `2026-10-03T22:30:34Z` przypada już 4.10 w Polsce.

## Gdzie szukałem i co ogranicza odzysk

| Źródło | Ustalenie | Granica |
|---|---|---|
| Vercel, projekt `programo-site` | CLI działa na istniejącym koncie. `vercel inspect https://programo.pl` wskazuje produkcję `dpl_5Y4AdPReVGdTrs3drFqZEt8Kyx8c`, utworzoną 3.10 o 20:39 CEST | Zapytanie logów za cały badany okres i osobno za wieczór 3.10 zwraca HTTP 400. Odpowiedź API logów: `ExceedsBillingLimitError`; dostępne ostatnie logi nie zastępują historii |
| Redis witryny | Kod zapisuje `programo:leads` oraz od 1.10 `programo:leads:rejected`; obie listy mają maksymalnie 500 wpisów | Zmienne Redis istnieją w produkcji, lecz są `sensitive`. Uprawniony odczyt metadanych Vercel z `decrypt=true` nie zwrócił wartości. Nie odczytałem list ani bazy i nie zakładam, że starsze wpisy przetrwały limit |
| CRM, powiadomienia | Cztery ślady w okresie, w tym jeden test; trzy przypadki już zapisane w `/formularze` | Powiadomienia zawierają tylko temat i identyfikator zgłoszenia, bez kontaktu i właściwej wiadomości |
| CRM, skrzynki | MCP odczytał trzy aktywne skrzynki, w tym `biuro@programo.pl` i skrzynkę Wojtka | `GET /api/v1/inbox/threads` dostał jawną odmowę uprawnień. Odczyt zatrzymałem; nie używałem innego klucza, cookies ani bazy do obejścia odmowy |
| CRM, leady | Odczyt list działa dla części zapytań; wyszukiwanie `programo.pl` nie znalazło kontaktów | Wyszukiwanie sprawdza nazwę, firmę, telefon i e-mail, a nie `sourceFile` lub treść. Nie jest dowodem braku leadów z formularzy. Zapytanie o kontakt z formularza dostało odmowę; bez danych kontaktowych nie ukończyłem deduplikacji |
| CRM, moduł `/mail/messages` | Zwrócił jeden szkic kampanii wychodzącej; `/mail/accounts` zwrócił pustą listę | To moduł wysyłkowy, nie archiwum skrzynek przychodzących |
| Podłączone konta Gmail | Odczyt przez istniejący konektor na obu kontach, z zakresem dat i frazami `Nowy lead`, `Nowe zgłoszenie z programo.pl`, `Wycena projektu`, `formularz programo`, zwrócił zero wiadomości | To osobne konta, na których mogłyby być przekazane powiadomienia; wynik nie zastępuje niedostępnego archiwum skrzynek CRM/Spacemail |
| Resend | Git `1e85567` z 4.08 usunął Resend z `/api/contact`; kod z 5.09 i późniejszy nie używa go do zgłoszeń | Brak dowodu, że Resend otrzymał jakiekolwiek zgłoszenie w badanym okresie. Brak klucza witryny w środowisku; nie używałem klucza monitoringu ani innego produktu |
| Microsoft Graph | Kanał dodano 5.09 (`85efe03`). Aktualna lista zmiennych produkcyjnych nie zawiera `MS_GRAPH_*` ani `LEAD_MAIL_FROM`; log z 9.10 dla `/api/contact` potwierdza `Microsoft Graph mail not configured` | To potwierdza brak kanału dziś. Dokument audytu z 14.09 również wskazuje brak konfiguracji; ciągłości konfiguracji dzień po dniu nie zweryfikowałem |

## Co tłumaczy brak w CRM

Historia kodu potwierdza, że przed `c44a857` z 3.10 warunek `crmSecret && !suspicious` pomijał przekazanie podejrzanych zgłoszeń do CRM. Kod nadal próbował zapisu w Redis i Telegrama. Odrzucane zgłoszenia także nie trafiały wtedy do skrzynki CRM; od 1.10 część odrzuceń zapisuje osobna lista Redis. Niezaliczone wyzwanie i Turnstile miały własne odpowiedzi 403.

To wyjaśnia możliwe różnice między formularzem, Telegramem i CRM od wdrożenia ocen zachowania 30.09. Nie dowodzi utraty konkretnego prawdziwego kontaktu ani nie wyjaśnia automatycznie całego okresu 6.09–3.10. Daty commitów wskazują zmianę kodu, nie moment przełączenia każdego wdrożenia.

## Dalszy odzysk bez dublowania

1. Wojtek powinien sprawdzić treść trzech podlinkowanych zgłoszeń, ich werdykt oraz poprawność danych; sam tytuł powiadomienia nie wystarcza do telefonu.
2. Wyeksportować tylko-do-odczytu listy Redis `programo:leads` i `programo:leads:rejected`, używając istniejącego dostępu właściciela. Zachować datę eksportu i oryginalne identyfikatory. Nie resetować, nie przycinać list.
3. W zalogowanej skrzynce wyszukać okres 6.09–3.10, temat `Nowy lead:` i treść `Nowe zgłoszenie z programo.pl`. Brak maila nie wyklucza kontaktu, bo Graph mógł być nieaktywny. Historia Telegrama jest kolejnym źródłem: bot API nie zapewnia odczytu pełnego archiwum już dostarczonych wiadomości.
4. Każdy odnaleziony kontakt porównać z całym CRM po znormalizowanym e-mailu i numerze telefonu, także w zamkniętych, nieważnych i słabych leadach. Wątpliwe/testowe wpisy zostawić do oceny. Nowy rekord oznaczyć `programo.pl-recovery-2026-10-09` i dodać oryginalną datę zgłoszenia oraz źródło dowodu; nie nadpisywać istniejących.

Dostępna specyfikacja MCP nie zawiera `POST /api/v1/leads` ani odczytu skrzynki formularzy. Stary webhook `/api/forms/programo` przy duplikacie dopisuje komentarz i może uzupełnić właściciela, dlatego nie spełnia warunku importu wyłącznie nowych leadów bez modyfikacji istniejących. Nie użyłem go do odzysku. Wynik na dziś: **0 dodanych leadów, 3 istniejące zgłoszenia do oceny, 1 rozpoznany test; liczba rzeczywiście utraconych zgłoszeń pozostaje nieustalona**.

Dokument opisuje odzysk, nie akceptację nowego formularza ani migrację hostingu. Sekrety, pełne telefony i e-maile nie trafiają do Git.

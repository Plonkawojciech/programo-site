# programo.pl: plan migracji z Vercela na Coolify

Plan dla Wojtka. **Przełączenie produkcji i DNS wymaga jego decyzji; ta sesja wdraża wyłącznie podgląd.**

## Stan ustalony 9.10.2026

| Nazwa | Aktualne DNS / usługa | Docelowo po zatwierdzeniu |
|---|---|---|
| `programo.pl` | A `76.76.21.21`, Vercel | A `159.195.206.7`, dedykowana aplikacja Coolify |
| `www.programo.pl` | A `76.76.21.21`, bez CNAME w odczycie | A `159.195.206.7`; HTTPS 308 do `https://programo.pl` |
| `v3.programo.pl` | A `159.195.206.7`, podgląd Coolify | Pozostaje podglądem, z `noindex` |
| MX domeny | `mx1.spacemail.com`, `mx2.spacemail.com` | Zachować |
| NS domeny | `dns1.tld.pl`, `dns2.tld.pl`, `dns3.tld.pl` | Zachować |

W odczycie nie było AAAA ani CAA. Przed zmianą sprawdzić je ponownie w panelu DNS, również wildcardy. Wszystkie wartości są odczytem z tego dnia; nie należy zmieniać strefy na podstawie nieaktualnej kopii raportu.

## Przygotowanie, zanim Wojtek zmieni DNS

1. Odebrać podgląd, ceny i statusy realizacji. Publiczne kwoty odpowiadają kolumnom Standard–Rozszerzony w firmowym `cennik.md`; stara kolumna Start pozostaje poza witryną. Potwierdzić zwłaszcza 150–300 zł/mies. za SEO/Ads/GA4/GTM, bo to kwoty zapisane w źródle, oraz limity godzin w abonamencie. Innochem i Terapia Dens opisujemy jako podglądy przed przełączeniem domen klienta.
2. Utworzyć **osobną** aplikację produkcyjną Coolify na zatwierdzonym commicie. Użyć `Dockerfile`, nie `docker-compose.preview.yaml`: compose zawiera publiczne klucze testowe oraz testową skrzynkę. Ustawić domeny `https://programo.pl` i `https://www.programo.pl`, port 3000, health `/api/health`. Pozostawić wyłączony automatyczny deploy z `main`, dopóki Vercel nadal go obsługuje.
3. Przy buildzie ustawić `PROGRAMO_DEPLOYMENT_ENV=production`, prawdziwy `NEXT_PUBLIC_TURNSTILE_SITE_KEY` oraz `NEXT_PUBLIC_TURNSTILE_TEST_MODE=false`. W runtime te same ustawienia i prawdziwy `TURNSTILE_SECRET_KEY`. Utworzenie kluczy i pary hostname/action opisuje [instrukcja ochrony formularzy](../ochrona-formularzy-2026-10.md). Publiczny klucz wymaga ponownego buildu; sekret tylko runtime.
4. Przenieść istniejące ustawienia kanałów z dostępu właściciela do zaszyfrowanych zmiennych Coolify: Redis, `CRM_WEBHOOK_SECRET`, ewentualnie Telegram i Graph, booking, Meta/GA4 oraz weryfikację wyszukiwarek. `NEXT_PUBLIC_BOOKINGS_URL`, `NEXT_PUBLIC_META_DATASET_ID`, `NEXT_PUBLIC_GSC_VERIFICATION` i `NEXT_PUBLIC_BING_VERIFICATION` oznaczyć jako **buildtime**; `Dockerfile` deklaruje ich argumenty. Sekrety kanałów i `TURNSTILE_SECRET_KEY` tylko runtime. Nie kopiować plików `.env`, nie zmieniać magazynu Redis bez eksportu jego obu list. `CRM_INTAKE_URL=https://crm.programo.pl/api/forms/intake`; stary `CRM_WEBHOOK_URL` nie steruje nowym przepływem. W tej sesji nie uzyskano sekretów produkcyjnego Redisa ani CRM, więc ich przeniesienie pozostaje zadaniem właściciela.
5. Przed zmianą DNS sprawdzić origin przez `curl --resolve programo.pl:443:159.195.206.7 https://programo.pl/api/health`, wszystkie istotne trasy, obrazy, sitemapę, przekierowania i odpowiedź 404. Certyfikat dla obu nazw musi być gotowy przed przełączeniem; jeśli obecna metoda HTTP-01 wymaga ruchu z domeny do VM, właściciel przygotowuje certyfikat DNS-01 albo uzgadnia kontrolowane okno zmiany. Nie wyłączać weryfikacji TLS jako testu gotowości.
6. Wykonać oznaczony test na prawdziwych kluczach Turnstile: formularz → potwierdzony trwały zapis → odczyt w CRM albo potwierdzenie maila. Sam HTTP 200 nie wystarcza. Sprawdzić odrzucenie braku tokenu, czas połączenia z CRM i zachowanie przy niedostępności jednego kanału. Test bez zgody marketingowej nie może utworzyć konwersji Ads. Obecny podgląd potwierdza oddzielny magazyn testowy, nie produkcyjną pocztę ani CRM.

## Kroki DNS wykonywane przez Wojtka

W panelu dostawcy DNS zapisać eksport strefy i obecne wartości TTL. Obniżyć TTL rekordów A `@` i `www` do 300 sekund z wyprzedzeniem co najmniej długości ich poprzedniego TTL. Potem zmienić **oba** rekordy A z `76.76.21.21` na `159.195.206.7`. Usunąć lub poprawić tylko kolidujące rekordy dla tych samych nazw, jeśli panel ujawni CNAME/AAAA; przy aktualnym odczycie ich nie było. Nie zmieniać NS, MX, SPF, DKIM, DMARC ani podglądu v3.

Po propagacji sprawdzić DNS z kilku resolverów i TLS dla apex/www, canonicale, przekierowanie www, `/api/health`, sitemapę, formularz oraz odczyt zgłoszenia. Produkcja musi zwracać indeksowalne HTML bez `X-Robots-Tag: noindex`; v3 ma pozostać zablokowane dla indeksowania. Dopiero po pozytywnym sprawdzeniu uruchomić IndexNow z produkcyjnego buildu i zaktualizować sitemapę w narzędziach wyszukiwarek, jeśli jest taka potrzeba.

## Wycofanie i zamknięcie migracji

Przy awarii wrócić z **obu A** do `76.76.21.21`. Zachować działający Vercel i jego domeny do zakończenia obserwacji oraz porównania zgłoszeń. Zapisane dane nie cofają się razem z DNS; porównać je po oryginalnych identyfikatorach, telefonie i e-mailu, bez ponownego importowania duplikatów. Wyłączenie projektu/subskrypcji Vercela to osobna decyzja po odbiorze, nie element tego wdrożenia podglądu.

Gałąź `v3-ready-20261009` ma `git.deploymentEnabled=false` w `vercel.json`, więc jej push służy Coolify i nie uruchamia nowego preview Vercela. Przy późniejszym merge do `main` właściciel musi najpierw wyłączyć jego automatyczny deploy na Vercelu albo rozszerzyć tę regułę; nie wolno przypadkiem opublikować nowej strony przed decyzją o migracji. [Dokumentacja Vercela](https://vercel.com/docs/project-configuration/git-configuration).

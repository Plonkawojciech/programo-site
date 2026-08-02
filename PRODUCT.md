# Product

## Register

brand

## Users

Głównie **właściciele i decydenci małych oraz średnich firm z Poznania i Wielkopolski, którzy nie są technikami**. Wiedzą, że potrzebują aplikacji, sklepu albo strony, ale nie potrafią ocenić oferty technicznej i boją się dwóch rzeczy: że przepalą budżet i że zostaną z niedokończonym projektem.

Poboczne, ale realne grupy: founderzy startupów oraz osoby odpowiedzialne za marketing/e-commerce — ci czytają stack i liczby, więc strona musi wytrzymać ich spojrzenie, nie będąc do nich adresowana w pierwszej kolejności.

Kontekst użycia: najczęściej wejście z Google Ads lub wyszukiwania lokalnego („software house Poznań", „ile kosztuje aplikacja"), na telefonie, w trakcie dnia pracy, przy porównywaniu 3–5 wykonawców. Uwaga jest krótka i podzielona.

**Zadanie do wykonania:** zorientować się w kilkadziesiąt sekund, czy to są ludzie, którym można powierzyć projekt i pieniądze — a jeśli tak, przekazać kontakt bez wypełniania długiego formularza.

## Product Purpose

Strona-wizytówka i główny kanał pozyskiwania klientów dla **Programo** — dwuosobowego studia software'owego (Wojciech Płonka — design & produkt, Bartosz Kolaj — inżynieria) z Poznania. Studio buduje aplikacje webowe i mobilne, SaaS, sklepy internetowe oraz strony z pełnym trackingiem i kampaniami.

Strona ma jedno zadanie: **doprowadzić odwiedzającego do zostawienia numeru telefonu.** Wszystko inne — portfolio, proces, FAQ, własne produkty — istnieje wyłącznie po to, żeby usunąć kolejne powody, dla których ktoś tego nie robi.

Sukces = liczba wartościowych leadów telefonicznych, nie czas na stronie ani liczba odsłon.

Sytuacja szczególna: **studio sprzedaje wykonanie oprogramowania, więc sama strona jest najmocniejszym elementem portfolio.** Każdy niedopracowany detal jest kontrargumentem sprzedażowym.

## Brand Personality

**Precyzyjni · nowocześni · pewni siebie.**

Ton: spokojny i konkretny. Mówimy wprost, co robimy i ile to kosztuje, bez przekonywania i bez superlatyw. Pewność siebie wyrażamy przez to, ile rzeczy *nie* mówimy — nie przez przymiotniki o sobie.

Emocja docelowa u odbiorcy: **ulga i zaufanie.** „Ci ludzie wiedzą, co robią, i nie będą mnie robić w konia."

Krytyczne napięcie do pilnowania: pewność siebie nie może zamienić się w dystans. Odbiorca jest nie-technikiem — jeśli po przeczytaniu sekcji poczuje się głupio, straciliśmy go. Pewność objawia się jasnością, nie żargonem.

## Anti-references

**Główny anty-wzorzec — polski software house z szablonu:**
- Stockowe zdjęcia ludzi przy laptopach i „zespołu" przy stole konferencyjnym
- Sekcja „Nasze wartości" / „Dlaczego my" z ikonkami w kółkach
- Niebieski gradient, dark-mode z fioletową poświatą
- Ściana 30 logotypów technologii jako dowód kompetencji
- Ogólniki: „kompleksowe rozwiązania", „indywidualne podejście", „dedykowany zespół"

**Anty-wzorzec drugiego rzędu — kalka Apple.** Ucieczka od polskiego szablonu w stronę białego tła, 96-punktowego kroju i ogromu pustki to ten sam odruch, tylko z innego katalogu. „Apple" w tym projekcie oznacza **restrykcję i precyzję detalu**, nie białe minimalistyczne hero. Jeśli efekt da się opisać jako „wygląda jak strona produktowa Apple", to jest do przerobienia.

**Odruchy do wycięcia (obecne w kodzie na 2026-08):**
- Mała wersalikowa etykieta (`font-mono text-sm text-primary`) nad co drugą sekcją
- Numeracja 01 / 02 / 03 jako dekoracja, w miejscach które nie są sekwencją
- Identyczne siatki kart `rounded-3xl` powtórzone w pięciu sekcjach
- Ten sam `opacity: 0 → y: 24` na wejściu każdej sekcji

**Czego jeszcze unikamy:** agencji kreatywnej (custom cursor, poziomy scroll, awangarda kosztem czytelności), korporacyjnego konsultingu (formalny dystans, granat i szarość), generycznego SaaS landingu (hero z wielką metryką, „Trusted by", gradient text).

## Design Principles

**1. Strona jest próbką pracy.**
Sprzedajemy jakość wykonania oprogramowania. Każdy detal strony — timing przejścia, brak skoku layoutu, zachowanie formularza przy błędzie — jest argumentem albo kontrargumentem. Nie ma tu „to tylko strona wizytówka".

**2. Jedna myśl na ekran.**
Restrykcja jest sygnałem pewności siebie. Sekcja mówi jedną rzecz i milknie. Kiedy wahamy się między dodaniem a wycięciem — wycinamy. Dziewięć sekcji o równej wadze to brak hierarchii, nie kompletność.

**3. Dowód zamiast deklaracji.**
Nie piszemy, że jesteśmy dobrzy — pokazujemy prawdziwe wdrożenia klientów, prawdziwe zrzuty, prawdziwe liczby i nazwiska dwóch osób, które to zrobiły. Zero przymiotników o sobie.

**4. Pewność bez dystansu.**
Piszemy po polsku, nie po korpo-polsku. Nie-technik musi rozumieć każde zdanie na stronie głównej. Żargon inżynierski ma prawo bytu w podstronach (`/stack`), nigdy w hero.

**5. Telefon zawsze w zasięgu ręki.**
Ścieżka do konwersji jest krótka i obecna na każdej wysokości scrolla — ale nigdy nachalna. Bez pop-upów, bez wymuszania, bez odliczania. Prosimy o numer, nie o życiorys.

## Accessibility & Inclusion

**Poziom docelowy: WCAG 2.2 AA — pełne trzymanie.** Traktowane jako wymóg twardy, nie best-effort. Dla studia sprzedającego usługi inżynierskie dostępność jest jednocześnie zgodnością i argumentem sprzedażowym.

Konkretnie:
- Kontrast ≥4.5:1 dla tekstu, ≥3:1 dla tekstu dużego (≥18px lub bold ≥14px) i elementów interfejsu — dotyczy również placeholderów i tekstu pomocniczego
- Pełna obsługa klawiatury, widoczny `:focus-visible` na każdym elemencie interaktywnym, logiczna kolejność tabulacji
- `prefers-reduced-motion` obsłużone dla każdej animacji — alternatywa to przenikanie lub natychmiastowy stan końcowy, nigdy zablokowana treść
- Treść nigdy nie jest uzależniona od uruchomienia animacji wejścia (bez `opacity: 0` jako stanu domyślnego bez fallbacku)
- Semantyczny HTML, poprawna hierarchia nagłówków, etykiety formularzy powiązane przez `htmlFor`
- Dwujęzyczność PL/EN — każdy nowy tekst przechodzi przez `t()` z `useI18n()`, nigdy nie jest wpisywany na sztywno w JSX
- Cele dotykowe ≥24×24 CSS px (WCAG 2.2, kryterium 2.5.8)

import type { Metadata } from "next";
import ServiceLanding, { type ServiceLandingData } from "@/components/service-landing";
import { OG_IMAGE } from "@/lib/og-image";

const PATH = "/aplikacje-webowe-dla-firm";
const TITLE = "Aplikacje webowe i systemy dla firm | Programo";
const DESCRIPTION =
  "Systemy i aplikacje webowe szyte pod proces firmy: panele, CRM, rezerwacje, automatyzacje zamiast Excela. Od 4 000 zł netto, termin od 4 tygodni, zależnie od zakresu.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `https://programo.pl${PATH}` },
  openGraph: {
    images: [OG_IMAGE],
    title: TITLE,
    description: DESCRIPTION,
    url: `https://programo.pl${PATH}`,
    siteName: "Programo",
    locale: "pl_PL",
    type: "website",
  },
};

const data: ServiceLandingData = {
  path: PATH,
  breadcrumb: "Aplikacje webowe dla firm",
  h1: "Aplikacje webowe i systemy dla firm",
  lead: "Budujemy systemy, które przejmują powtarzalną pracę: panel zamiast arkusza, jedno miejsce na klientów i zamówienia, automatyczne powiadomienia. Sami utrzymujemy pięć własnych produktów tego typu, więc wiemy, co dzieje się z systemem rok po wdrożeniu.",
  serviceType: "Tworzenie aplikacji webowych",
  schemaDescription:
    "Projektowanie i budowa aplikacji webowych oraz systemów dla firm: panele administracyjne, CRM, systemy rezerwacji, automatyzacje procesów i integracje.",
  fit: {
    heading: "Kiedy warto zamówić własny system",
    items: [
      { title: "Excel przestał wystarczać", desc: "Arkusz ma kilkanaście zakładek, każdy ma swoją wersję, a dane przepisuje się ręcznie między plikami, mailami i programem do faktur." },
      { title: "Gotowy program nie pasuje do procesu", desc: "Płacisz abonament za narzędzie, z którego używasz jednej piątej, a to, czego potrzebujesz, robi się obok na kartce." },
      { title: "Klienci chcą załatwiać sprawy sami", desc: "Rezerwacja, status zamówienia, dokumenty do pobrania. Panel klienta odciąża telefon i skrzynkę." },
      { title: "Masz pomysł na produkt", desc: "Zaczynamy od pierwszej działającej wersji z jedną najważniejszą funkcją i prawdziwymi użytkownikami, zamiast budować wszystko naraz." },
    ],
  },
  scope: {
    heading: "Co budujemy",
    items: [
      { title: "Panele i systemy wewnętrzne", desc: "Klienci, zamówienia, zadania, dokumenty i raporty w jednym miejscu, z kontami i uprawnieniami dla zespołu." },
      { title: "Aplikacje dla wielu firm (SaaS)", desc: "Jedna instalacja obsługuje wielu klientów z rozdzielonymi danymi, rolami i płatnościami. Tak działa nasze Estalo." },
      { title: "Integracje", desc: "Sklep, płatności, faktury, portale ogłoszeniowe, rejestry publiczne. Estalo publikuje oferty na czterech portalach nieruchomości, Rejestr Pro korzysta z oficjalnych danych KRS." },
      { title: "Automatyzacje i AI", desc: "Odczyt dokumentów, klasyfikacja zgłoszeń, podpowiedzi na danych firmy. W ePortalu Prawnym AI porządkuje opis sprawy, zanim trafi do prawnika." },
      { title: "Bezpieczeństwo danych", desc: "Dane w bazie PostgreSQL, rozdzielone uprawnienia dla ról i kopie zapasowe. Lokalizację serwera ustalamy przed startem; ePortal Prawny trzymamy na własnym serwerze w UE." },
    ],
  },
  process: {
    heading: "Etapy",
    steps: [
      { title: "Rozpisanie procesu", desc: "Przechodzimy z Tobą przez to, jak praca wygląda dziś: kto co wpisuje, gdzie giną informacje, co da się oddać systemowi." },
      { title: "Zakres pierwszej wersji i wycena", desc: "Ustalamy, co musi być na start, a co w kolejnych etapach. Dostajesz stałą cenę za pierwszą wersję." },
      { title: "Budowa w krótkich etapach", desc: "Co tydzień albo dwa widzisz działający fragment na adresie testowym i możesz zmienić priorytety." },
      { title: "Wdrożenie i rozwój", desc: "Zakres przeniesienia danych i szkolenia ustalamy przed startem. Poprawki, aktualizacje i kolejne funkcje po wdrożeniu obejmujemy osobno uzgodnioną opieką." },
    ],
  },
  price: {
    heading: "Ile kosztuje aplikacja webowa",
    rows: [
      { name: "System lub aplikacja webowa", range: "4 000 – 8 000 zł", term: "od 4 tygodni" },
      { name: "Automatyzacja procesu", range: "1 500 – 6 000 zł", term: "2 – 4 tygodnie" },
      { name: "Audyt procesów", range: "1 500 – 6 000 zł", term: "1 tydzień" },
      { name: "Opieka nad sklepem lub systemem", range: "800 – 1 500 zł / mies." },
    ],
    note: "Ceny netto, do każdej doliczamy 23% VAT. Dolna kwota to standardowy zakres, górna wersja rozszerzona. Zakres i limit godzin opieki ustalamy w umowie. Opłaty za hosting, domenę i inne usługi zewnętrzne rozliczasz osobno. Zmianę zakresu wyceniamy przed rozpoczęciem dodatkowych prac. Większe systemy wyceniamy etapami.",
  },
  work: {
    heading: "Systemy, które zbudowaliśmy",
    items: [
      { slug: "estalo", relevance: "CRM dla biur nieruchomości obsługujący wiele firm naraz, z płatnościami i integracjami z portalami ogłoszeniowymi." },
      { slug: "rejestr-pro", relevance: "Wyszukiwarka firm na oficjalnych danych z KRS, z własnym indeksem wyszukiwania i sprawdzaniem Białej Listy VAT." },
      { slug: "wks-poznan", relevance: "Strona klubu z dedykowanym panelem administracyjnym: harmonogram, aktualności, galeria i obozy." },
      { slug: "eportal-prawny", relevance: "Platforma łącząca klientów z prawnikami: opis sprawy porządkowany przez AI, teczka sprawy, czat i zadania." },
    ],
  },
  faqs: [
    { q: "Ile kosztuje aplikacja webowa dla firmy?", a: "System w standardowym zakresie kosztuje od 4 000 do 8 000 zł netto. O cenie decyduje liczba ról użytkowników, integracji i ekranów. Większe projekty dzielimy na etapy z osobną wyceną." },
    { q: "Jak długo trwa budowa?", a: "Termin zaczyna się od 4 tygodni i zależy od uzgodnionego zakresu. Rozbudowane systemy rozwijamy etapami, a każdy etap kończy się czymś, czego da się używać." },
    { q: "Czy system da się połączyć z programem, którego już używamy?", a: "Zwykle tak, jeśli program udostępnia API albo eksport danych. Sprawdzamy to przed wyceną, żeby nie obiecywać integracji, której nie da się zrobić." },
    { q: "Kto jest właścicielem kodu i danych?", a: "Ty. Po wdrożeniu przekazujemy kod źródłowy i wszystkie dostępy. Dane od początku należą do Twojej firmy." },
    { q: "Co, jeśli po wdrożeniu coś trzeba zmienić?", a: "Po starcie zostajemy przy systemie: robimy poprawki, wsparcie techniczne i dalszy rozwój. Nowe funkcje wyceniamy osobno albo realizujemy w ramach miesięcznej opieki." },
  ],
  related: [
    { href: "/projects/estalo", label: "Realizacja: Estalo" },
    { href: "/aplikacje-mobilne-dla-firm", label: "Aplikacje mobilne" },
    { href: "/ile-kosztuje-aplikacji", label: "Ile kosztuje aplikacja" },
    { href: "/stack", label: "Stack technologiczny" },
    { href: "/cennik", label: "Cennik" },
  ],
  form: { formId: "aplikacje-webowe", projectType: "Aplikacja webowa / system", heading: "Opisz proces, oddzwonimy w 24 h" },
};

export default function Page() {
  return <ServiceLanding data={data} />;
}

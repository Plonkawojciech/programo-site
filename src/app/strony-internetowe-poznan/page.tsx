import type { Metadata } from "next";
import ServiceLanding, { type ServiceLandingData } from "@/components/service-landing";
import { OG_IMAGE } from "@/lib/og-image";

const PATH = "/strony-internetowe-poznan";
const TITLE = "Tworzenie stron internetowych Poznań | Programo";
const DESCRIPTION =
  "Strony internetowe i sklepy dla firm z Poznania i okolic. Spotkanie na miejscu, stała cena przed startem, strona firmowa od 2 000 zł netto w 5 dni do 2 tygodni.";

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
  breadcrumb: "Strony internetowe Poznań",
  h1: "Tworzenie stron internetowych w Poznaniu",
  lead: "Programo to dwie osoby z Poznania: Wojciech Płonka i Bartosz Kolaj. Projektujemy i budujemy strony firmowe oraz sklepy. Możemy spotkać się u Ciebie w firmie albo porozmawiać przez telefon, a cenę znasz przed rozpoczęciem prac.",
  serviceType: "Tworzenie stron internetowych",
  schemaDescription:
    "Projektowanie i budowa stron firmowych oraz sklepów internetowych dla firm z Poznania i Wielkopolski. Siedziba: ul. Podkomorska 14/1, Poznań.",
  fit: {
    heading: "Z czym przychodzą do nas firmy z Poznania",
    items: [
      {
        title: "Strona jest, zapytań nie ma",
        desc: "Strona działa od lat, ale telefon dzwoni z polecenia, a nie z internetu. Sprawdzamy, co widzi osoba, która wchodzi z telefonu, i budujemy stronę, na której numer i formularz są pod kciukiem.",
      },
      {
        title: "Każda zmiana wymaga informatyka",
        desc: "Nowy cennik albo zdjęcie to mail do kogoś, kto kiedyś robił stronę. Dajemy panel, w którym zmieniasz treści samodzielnie. Tak działa strona WKS Poznań: harmonogram i aktualności aktualizuje trenerka.",
      },
      {
        title: "Firma rusza i potrzebuje strony na start",
        desc: "Wizytówkę z ofertą, kontaktem i mapą dojazdu oddajemy w 5 dni roboczych, większą stronę firmową w ciągu 2 tygodni.",
      },
      {
        title: "Reklamy kosztują, a nie wiadomo, co dają",
        desc: "Stronę oddajemy z policzonymi telefonami i formularzami w Google Analytics 4, więc widać, która reklama przyniosła zapytanie.",
      },
    ],
  },
  scope: {
    heading: "Co dostajesz",
    items: [
      { title: "Projekt pod Twoją firmę", desc: "Układ, kolory i teksty powstają z Twoich materiałów: logo, zdjęć, oferty. Nie kupujemy gotowego szablonu i nie wklejamy zdjęć ze stocka." },
      { title: "Wersja na telefon", desc: "Każdą podstronę sprawdzamy na ekranie 375 px. Przyciski mają wygodny rozmiar, formularz da się wypełnić jedną ręką." },
      { title: "Panel do treści", desc: "Aktualności, cennik, galeria i realizacje edytujesz samodzielnie. Zakres panelu ustalamy przed wyceną." },
      { title: "Pomiar i zgody", desc: "Google Analytics 4, liczenie telefonów i formularzy, baner zgód zgodny z Consent Mode v2." },
      { title: "Podstawy SEO", desc: "Tytuły i opisy podstron, dane strukturalne firmy, mapa strony, szybkie ładowanie. Lokalnie dochodzi spójność danych z wizytówką Google." },
      { title: "Domena, hosting, poczta", desc: "Przenosimy stronę na szybki hosting i pilnujemy certyfikatu oraz kopii zapasowych. Opieka po wdrożeniu jest opcjonalna." },
    ],
  },
  process: {
    heading: "Jak wygląda współpraca",
    steps: [
      { title: "Rozmowa", desc: "Kwadrans przez telefon albo spotkanie w Poznaniu. Pytamy, kto jest klientem, skąd dziś przychodzą zapytania i co strona ma zmienić." },
      { title: "Wycena w 24 godziny", desc: "Dostajesz zakres, termin i stałą cenę. Przy większych projektach najpierw przedział, potem wycena po doprecyzowaniu." },
      { title: "Projekt i budowa", desc: "Pokazujemy stronę na adresie testowym i poprawiamy ją razem z Tobą. Strona firmowa trwa od 5 dni do 2 tygodni." },
      { title: "Start i opieka", desc: "Podpinamy domenę, pomiar i przekierowania ze starej strony. Po starcie poprawiamy błędy i możemy zostać na stałej opiece." },
    ],
  },
  price: {
    heading: "Ile kosztuje strona internetowa",
    rows: [
      { name: "Strona internetowa (wizytówka lub firmowa)", range: "2 000 – 6 000 zł", term: "5 dni – 2 tygodnie" },
      { name: "Sklep na WooCommerce lub Shopify", range: "4 000 – 8 000 zł", term: "3 tygodnie" },
      { name: "Opieka nad stroną", range: "300 – 600 zł / mies." },
    ],
    note: "Ceny netto, do każdej doliczamy 23% VAT. Dolna kwota to standardowy zakres, górna wersja rozszerzona.",
  },
  work: {
    heading: "Strony i serwisy, które zrobiliśmy",
    items: [
      { slug: "wks-poznan", relevance: "Strona klubu sportowego z Poznania przebudowana ze statycznych plików na system z panelem. Klub sam prowadzi harmonogram, aktualności i galerię." },
      { slug: "wsafefinanse", relevance: "Strona doradztwa finansowego spod Poznania. Zapytanie z formularza trafia jednocześnie na e-mail i na telefon właścicielki." },
      { slug: "skup-nieruchomosci", relevance: "Serwis nastawiony na telefon od klienta: sześć podstron dopasowanych do reklam i pełny pomiar konwersji." },
      { slug: "jedmar", relevance: "Poznańskie centrum narzędziowe: dwie aplikacje zakupowe i moduł schematów części, spięte z istniejącym sklepem." },
    ],
  },
  faqs: [
    { q: "Czy muszę być z Poznania?", a: "Nie. Siedzibę mamy w Poznaniu przy ul. Podkomorskiej 14/1 i tutaj najłatwiej się spotkać, ale większość projektów prowadzimy zdalnie, dla firm z całej Polski." },
    { q: "Ile kosztuje strona internetowa dla firmy?", a: "Wizytówka lub strona firmowa kosztuje od 2 000 do 6 000 zł netto, zależnie od liczby podstron, panelu do treści i integracji. Stałą cenę dostajesz przed rozpoczęciem prac." },
    { q: "Jak długo trwa zrobienie strony?", a: "Od 5 dni roboczych do 2 tygodni dla strony firmowej. Najczęściej czekamy na teksty i zdjęcia, dlatego pomagamy je przygotować." },
    { q: "Czy zobaczę projekt, zanim zapłacę?", a: "Firmom, z którymi rozmawiamy, przygotowujemy bezpłatne demo strony głównej z ich treściami. Decyzję podejmujesz po obejrzeniu." },
    { q: "Kto będzie właścicielem strony?", a: "Ty. Po wdrożeniu przekazujemy kod i wszystkie dostępy: domenę, hosting oraz konta analityczne założone na Twoją firmę." },
  ],
  related: [
    { href: "/strony-internetowe", label: "Strony internetowe: pełna oferta" },
    { href: "/sklepy-internetowe", label: "Sklepy internetowe" },
    { href: "/projekty#dema", label: "Dema stron dla firm" },
    { href: "/software-house-poznan", label: "Software house Poznań" },
    { href: "/cennik", label: "Cennik" },
  ],
  form: { formId: "strony-poznan", projectType: "Strona internetowa (Poznań)", heading: "Zostaw numer, oddzwonimy w 24 h" },
};

export default function Page() {
  return <ServiceLanding data={data} />;
}

import type { Metadata } from "next";
import ServiceLanding, { type ServiceLandingData } from "@/components/service-landing";
import { OG_IMAGE } from "@/lib/og-image";

const PATH = "/wdrozenie-ga4-tracking-konwersji";
const TITLE = "Wdrożenie GA4 i śledzenia konwersji | Programo";
const DESCRIPTION =
  "Konfiguracja Google Analytics 4, konwersji Google Ads i Consent Mode v2 na Twojej stronie. Liczymy telefony i formularze, żeby było widać, która reklama działa.";

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
  breadcrumb: "Wdrożenie GA4 i konwersji",
  h1: "Wdrożenie GA4 i śledzenia konwersji",
  lead: "Wpinamy pomiar na stronie, którą już masz: Google Analytics 4, konwersje Google Ads, Meta Pixel i zgody cookies. Po wdrożeniu każdy telefon i każdy wysłany formularz ma przypisane źródło.",
  serviceType: "Wdrożenie analityki internetowej",
  schemaDescription:
    "Konfiguracja Google Analytics 4, śledzenia konwersji Google Ads z enhanced conversions, Meta Pixel i Consent Mode v2 na istniejących stronach i w sklepach internetowych.",
  fit: {
    heading: "Kiedy warto uporządkować pomiar",
    items: [
      { title: "Reklamy działają „na oko”", desc: "Budżet schodzi co miesiąc, a nie wiadomo, która kampania przyniosła telefon. Bez konwersji Google Ads optymalizuje pod kliknięcia, nie pod zapytania." },
      { title: "GA4 pokazuje ruch, ale nie zapytania", desc: "Są sesje i odsłony, brakuje zdarzeń: kliknięcia w numer, wysłania formularza, zakupu." },
      { title: "Baner cookies jest, zgody nie działają", desc: "Baner się wyświetla, ale tagi startują niezależnie od wyboru albo nie startują wcale. Jedno i drugie psuje dane, a pierwsze naraża firmę." },
      { title: "Przed startem kampanii", desc: "Pomiar ustawiony przed pierwszą złotówką na reklamę oszczędza tygodnie zgadywania." },
    ],
  },
  scope: {
    heading: "Co konfigurujemy",
    items: [
      { title: "Google Analytics 4", desc: "Usługa, strumień danych, zdarzenia dla formularzy, telefonów, maili i kluczowych kliknięć, oznaczone jako kluczowe zdarzenia." },
      { title: "Konwersje Google Ads", desc: "Tag konwersji z enhanced conversions, czyli dopasowaniem po zahaszowanym numerze lub adresie e-mail, oraz import do kampanii." },
      { title: "Meta Pixel i Conversions API", desc: "Zdarzenia po stronie przeglądarki i serwera z deduplikacją, żeby jedno zapytanie nie liczyło się dwa razy." },
      { title: "Consent Mode v2", desc: "Domyślnie brak zgody, tagi reagują na wybór użytkownika. Baner z realnym przyciskiem odmowy." },
      { title: "Sprawdzenie na żywo", desc: "Każde zdarzenie testujemy w podglądzie GA4 i Tag Assistant, a wynik spisujemy w krótkim dokumencie: co mierzymy, gdzie i po co." },
    ],
  },
  process: {
    heading: "Etapy",
    steps: [
      { title: "Przegląd stanu", desc: "Sprawdzamy, co już jest wpięte, co się dubluje i co nie działa. Dostajesz listę ustaleń." },
      { title: "Plan zdarzeń", desc: "Ustalamy, co jest zapytaniem w Twojej firmie: telefon, formularz, rezerwacja, zakup. Tylko to trafia do kampanii jako konwersja." },
      { title: "Wdrożenie", desc: "Wpinamy tagi w kodzie strony albo przez Google Tag Manager, zależnie od tego, jak zbudowana jest strona." },
      { title: "Weryfikacja i przekazanie", desc: "Po kilku dniach porównujemy dane z rzeczywistą liczbą zapytań i poprawiamy rozjazdy. Konta zostają na Twoich danych." },
    ],
  },
  price: {
    heading: "Ile kosztuje wdrożenie pomiaru",
    rows: [{ name: "SEO, Google Ads, GA4 + GTM", range: "150 – 300 zł / mies." }],
    note: "Cena netto, doliczamy 23% VAT. To stawka miesięcznej współpracy obejmującej SEO, Google Ads oraz GA4 z GTM. Jednorazową konfigurację na istniejącej stronie wyceniamy po przeglądzie.",
  },
  work: {
    heading: "Gdzie to działa",
    items: [
      { slug: "skup-nieruchomosci", relevance: "Pełny pomiar konwersji: GA4, enhanced conversions, Meta Pixel i Consent Mode v2, do tego kampania Google Ads zbudowana i prowadzona przez nas." },
      { slug: "domki-poznaniak", relevance: "Strony nie budowaliśmy. Na istniejącym WordPressie wpięliśmy GA4 i konwersje Google Ads, a potem ustawiliśmy kampanię." },
    ],
  },
  faqs: [
    { q: "Czy trzeba przebudować stronę, żeby wpiąć pomiar?", a: "Nie. Pracujemy na istniejącej stronie, także na WordPressie i w gotowych sklepach. W Domkach Poznaniak wpięliśmy pomiar na stronie, której nie budowaliśmy." },
    { q: "Czy kliknięcie w numer telefonu da się policzyć?", a: "Tak. Kliknięcie w numer na telefonie komórkowym rejestrujemy jako zdarzenie i przypisujemy do źródła wizyty. Rozmowy wybranej ręcznie z ekranu komputera w ten sposób nie widać." },
    { q: "Co z osobami, które nie zgodzą się na cookies?", a: "Przy braku zgody Google działa w trybie bez plików cookies i modeluje część konwersji. Meta Pixel i narzędzia nagrywające sesje nie uruchamiają się wcale." },
    { q: "Czy prowadzicie też kampanie?", a: "Tak, budujemy i prowadzimy kampanie Google Ads. Budżet reklamowy zawsze zatwierdza klient." },
    { q: "Na kogo są zakładane konta?", a: "Na Twoją firmę. Jesteś właścicielem usługi GA4, konta Google Ads i danych, a nam nadajesz dostęp." },
  ],
  related: [
    { href: "/strony-tracking-reklamy", label: "Strona, tracking i reklamy w pakiecie" },
    { href: "/projects/skup-nieruchomosci", label: "Realizacja: Skup Nieruchomości" },
    { href: "/strony-internetowe", label: "Strony internetowe" },
    { href: "/cennik", label: "Cennik" },
  ],
  form: { formId: "ga4-tracking", projectType: "Tracking / GA4", heading: "Zostaw numer, sprawdzimy Twój pomiar" },
};

export default function Page() {
  return <ServiceLanding data={data} />;
}

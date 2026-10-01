import type { Metadata } from "next";
import ServiceLanding, { type ServiceLandingData } from "@/components/service-landing";
import { OG_IMAGE } from "@/lib/og-image";

const PATH = "/aplikacje-mobilne-dla-firm";
const TITLE = "Aplikacje mobilne dla firm: iOS i Android | Programo";
const DESCRIPTION =
  "Natywne aplikacje mobilne dla firm na iOS i Androida, spięte ze sklepem lub systemem, który już masz. Publikacja w App Store i Google Play po naszej stronie.";

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
  breadcrumb: "Aplikacje mobilne dla firm",
  h1: "Aplikacje mobilne dla firm: iOS i Android",
  lead: "Budujemy natywne aplikacje w Swift i Kotlinie i podłączamy je do sklepu albo systemu, który już działa w firmie. Publikację w App Store i Google Play bierzemy na siebie.",
  serviceType: "Tworzenie aplikacji mobilnych",
  schemaDescription:
    "Projektowanie i budowa natywnych aplikacji mobilnych na iOS (Swift, SwiftUI) i Androida (Kotlin, Jetpack Compose) dla firm, z integracją z istniejącym sklepem lub systemem.",
  fit: {
    heading: "Kiedy aplikacja mobilna ma sens",
    items: [
      { title: "Klienci wracają i kupują z telefonu", desc: "Stały klient hurtowni albo sklepu zamawia częściej, gdy koszyk i historia zamówień są pod jedną ikoną. Tak było w Jedmarze: sklep działał, ale zakupy z telefonu były uciążliwe." },
      { title: "Potrzebny jest aparat, skaner albo powiadomienia", desc: "Skanowanie kodów EAN, zdjęcia dokumentów, powiadomienia o statusie zamówienia. To rzeczy, które strona w przeglądarce robi gorzej niż aplikacja." },
      { title: "Pracownicy działają w terenie", desc: "Handlowiec, serwisant albo magazynier potrzebuje narzędzia, które działa szybko i przy słabym zasięgu." },
      { title: "Kiedy lepiej zacząć od strony", desc: "Jeśli klient kupuje raz albo trafia z reklamy, aplikacji nie zainstaluje. Wtedy dobra strona mobilna da więcej za mniejsze pieniądze i mówimy to wprost na pierwszej rozmowie." },
    ],
  },
  scope: {
    heading: "Co obejmuje projekt",
    items: [
      { title: "Dwie aplikacje natywne", desc: "iOS w Swift i SwiftUI, Android w Kotlinie z Jetpack Compose. Natywny kod daje płynne działanie i pełny dostęp do aparatu, powiadomień i płatności systemowych." },
      { title: "Integracja z tym, co masz", desc: "Aplikacja korzysta z danych istniejącego sklepu lub systemu. W Jedmarze spięliśmy ją z działającym sklepem PrestaShop, bez przebudowy samego sklepu." },
      { title: "Płatności i dostawa", desc: "Płatności online, wybór punktu odbioru i statusy zamówień w zakresie, który obsługuje Twój sklep." },
      { title: "Publikacja w sklepach", desc: "Konta deweloperskie, opisy, zrzuty ekranu i przejście przez weryfikację Apple oraz Google." },
      { title: "Aktualizacje", desc: "Nowe wersje systemów wychodzą co roku. Po wdrożeniu pilnujemy zgodności i wydajemy poprawki w ramach opieki." },
    ],
  },
  process: {
    heading: "Etapy",
    steps: [
      { title: "Rozmowa i zakres", desc: "Ustalamy, co aplikacja ma robić w pierwszej wersji, a co może poczekać. Sprawdzamy, jakie dane udostępnia Twój sklep lub system." },
      { title: "Projekt ekranów", desc: "Zanim powstanie kod, widzisz wszystkie ekrany i przechodzisz przez główne ścieżki: logowanie, zakup, zamówienia." },
      { title: "Budowa i testy na urządzeniach", desc: "Wersje testowe dostajesz na własny telefon przez TestFlight i testy wewnętrzne Google Play." },
      { title: "Publikacja i opieka", desc: "Wysyłamy aplikacje do weryfikacji, odpowiadamy na uwagi recenzentów i zostajemy przy projekcie po starcie." },
    ],
  },
  price: {
    heading: "Ile kosztuje aplikacja mobilna",
    rows: [
      { name: "Aplikacja mobilna iOS + Android", range: "4 000 – 8 000 zł", term: "6 tygodni" },
      { name: "Opieka nad sklepem lub systemem", range: "800 – 1 500 zł / mies." },
    ],
    note: "Ceny netto, do każdej doliczamy 23% VAT. Dolna kwota to standardowy zakres, górna wersja rozszerzona. Rozbudowane projekty wyceniamy osobno po rozmowie.",
  },
  work: {
    heading: "Aplikacje, które zbudowaliśmy",
    items: [
      { slug: "jedmar", relevance: "Dwie natywne aplikacje zakupowe dla centrum narzędziowego z Poznania, opublikowane w App Store i Google Play: katalog ponad 1400 produktów, płatności, skaner kodów EAN." },
      { slug: "estalo", relevance: "Nasz własny CRM dla biur nieruchomości. Do wersji webowej powstały natywne aplikacje iOS i Android." },
      { slug: "eportal-prawny", relevance: "Platforma prawnicza budowana równolegle jako web, natywny iOS i natywny Android." },
    ],
  },
  faqs: [
    { q: "Ile kosztuje aplikacja mobilna dla firmy?", a: "Aplikacja na iOS i Androida w standardowym zakresie kosztuje od 4 000 do 8 000 zł netto. Cena rośnie wraz z liczbą ekranów, integracji i ról użytkowników. Stałą wycenę dostajesz przed startem." },
    { q: "Jak długo trwa budowa aplikacji?", a: "Standardowy zakres zajmuje około 6 tygodni. Do tego dochodzi weryfikacja w App Store i Google Play, na którą nie mamy wpływu." },
    { q: "Dlaczego natywnie, a nie jedna aplikacja na obie platformy?", a: "Natywny kod działa płynniej i nie blokuje nas przy aparacie, powiadomieniach czy płatnościach. Jeśli w Twoim przypadku wspólny kod wystarczy, powiemy to przy wycenie." },
    { q: "Czy mam już mieć sklep albo system?", a: "Nie. Jeśli go nie ma, budujemy też część serwerową. Jeśli jest, podłączamy aplikację do niego." },
    { q: "Kto będzie właścicielem aplikacji?", a: "Ty. Aplikacje publikujemy na kontach deweloperskich Twojej firmy, a po wdrożeniu przekazujemy kod i wszystkie dostępy." },
  ],
  related: [
    { href: "/projects/jedmar", label: "Realizacja: aplikacje Jedmar" },
    { href: "/ile-kosztuje-aplikacji", label: "Ile kosztuje aplikacja" },
    { href: "/aplikacje-webowe-dla-firm", label: "Aplikacje webowe i systemy" },
    { href: "/oferta", label: "Oferta" },
    { href: "/cennik", label: "Cennik" },
  ],
  form: { formId: "aplikacje-mobilne", projectType: "Aplikacja mobilna", heading: "Opowiedz o aplikacji, oddzwonimy w 24 h" },
};

export default function Page() {
  return <ServiceLanding data={data} />;
}

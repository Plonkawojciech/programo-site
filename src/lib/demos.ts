// Website demos we built for prospects and chose to show. Feeds the demo
// section of /projekty, llms.txt and the CollectionPage schema.
//
// Rules (same spirit as projects.ts):
// - Only facts. Company names, cities and scope come from the demo itself or
//   from the brief written when the demo was built. No invented numbers.
// - A demo is a static mock-up of a new site for a real company: forms, carts
//   and search do not work on purpose. Every demo is noindex on its own host,
//   so we link with rel="nofollow".
// - This is a selection, not the archive. A demo stays out when the company
//   became a client (it belongs in projects.ts then), when the company has not
//   received the demo yet, or when the demo is not good enough to represent us.
//   The reasoning for the current list is in
//   docs/plans/odswiezenie-portfolio-seo-konwersja-2026-10.md.
// - None of these companies is a client. `disclosure` decides how a demo is
//   shown: "named" (company name, its logo in the screenshot, link to the demo)
//   or "concept" (industry only, header cropped out of the screenshot, no link).
//   Nothing outside this file may read `name`, `url` or `host` directly — use
//   `demoViews()`, which already applies the disclosure.
// - Screenshots come from `node scripts/shoot-demos.mjs` (slug list in
//   scripts/demos.json). Concept captures are served from
//   public/screenshots/demos/<slug>-concept-{desktop,mobile}.webp. Named ones
//   carry the company's logo, so they live in assets/demos-named/ and are not
//   served; `node scripts/publish-named-demo.mjs <slug>` copies them into
//   public/ for a demo that is allowed to be named.

export type DemoIndustry = "sklepy" | "produkcja" | "uslugi" | "sport" | "media";

export const DEMO_INDUSTRIES: { key: DemoIndustry; label: { pl: string; en: string } }[] = [
  { key: "sklepy", label: { pl: "Sklepy i hurtownie", en: "Shops & wholesale" } },
  { key: "produkcja", label: { pl: "Produkcja i technika", en: "Manufacturing & engineering" } },
  { key: "uslugi", label: { pl: "Usługi dla firm", en: "Business services" } },
  { key: "sport", label: { pl: "Sport i kluby", en: "Sports & clubs" } },
  { key: "media", label: { pl: "Media i kultura", en: "Media & culture" } },
];

export interface Demo {
  slug: string;
  // Company or brand exactly as it appears on the demo.
  name: string;
  // What the company does, one short phrase (card eyebrow).
  sector: { pl: string; en: string };
  city?: string;
  industry: DemoIndustry;
  url: string;
  // Hostname shown on the card pill.
  host: string;
  // One sentence: what the demo shows and the one design decision behind it.
  summary: { pl: string; en: string };
  // Pages included in the mock-up, as labelled in its navigation.
  pages?: { pl: string[]; en: string[] };
  // Brand colour sampled from the client's material, used to tint the card canvas.
  accentColor: string;
  // Month the demo went online, YYYY-MM.
  date: string;
  // Overrides DEFAULT_DISCLOSURE for this one demo.
  disclosure?: DemoDisclosure;
  // Summary used in concept mode when the regular one names the company.
  conceptSummary?: { pl: string; en: string };
  // false when the company's logo or name cannot be cropped out of the frame;
  // such a demo is left out entirely while it is in concept mode.
  conceptReady?: false;
}

export type DemoDisclosure = "named" | "concept";

// The owner's decision, in one place (2026-10-01): we have no consent to show
// these companies by name, so every demo is an unnamed concept. Set
// `disclosure: "named"` on a single demo once its company agrees in writing
// or becomes a client.
export const DEFAULT_DISCLOSURE: DemoDisclosure = "concept";

// What the page, the schema and llms.txt are allowed to know about a demo.
export interface DemoView {
  slug: string;
  concept: boolean;
  title: { pl: string; en: string };
  eyebrow: { pl: string; en: string };
  summary: { pl: string; en: string };
  industry: DemoIndustry;
  accentColor: string;
  // Present only for named demos.
  url?: string;
  host?: string;
  desktop: string;
  mobile: string;
}

export function toDemoView(demo: Demo, fallback: DemoDisclosure = DEFAULT_DISCLOSURE): DemoView | null {
  const concept = (demo.disclosure ?? fallback) === "concept";
  if (concept && demo.conceptReady === false) return null;
  const file = (size: "desktop" | "mobile") =>
    `/screenshots/demos/${demo.slug}${concept ? "-concept" : ""}-${size}.webp`;
  const base = {
    slug: demo.slug,
    concept,
    industry: demo.industry,
    accentColor: demo.accentColor,
    desktop: file("desktop"),
    mobile: file("mobile"),
  };
  if (concept) {
    return {
      ...base,
      title: demo.sector,
      eyebrow: { pl: "Projekt koncepcyjny", en: "Concept design" },
      summary: demo.conceptSummary ?? demo.summary,
    };
  }
  const meta = (lang: "pl" | "en") => [demo.sector[lang], demo.city].filter(Boolean).join(" · ");
  return {
    ...base,
    title: { pl: demo.name, en: demo.name },
    eyebrow: { pl: meta("pl"), en: meta("en") },
    summary: demo.summary,
    url: demo.url,
    host: demo.host,
  };
}

export function demoViews(fallback: DemoDisclosure = DEFAULT_DISCLOSURE): DemoView[] {
  return demos.map((demo) => toDemoView(demo, fallback)).filter((view): view is DemoView => view !== null);
}

export const demos: Demo[] = [
  {
    slug: "lumen",
    name: "Lumen",
    sector: { pl: "Pomiary, projekty i instalacje elektryczne", en: "Power quality measurement and electrical design" },
    city: "Kraków",
    industry: "produkcja",
    url: "https://lumen.programo.pl/",
    host: "lumen.programo.pl",
    summary: {
      pl: "Pomiary jakości energii, projekty do 110 kV, fotowoltaika i nadzory. Jasne tło i żółć ostrzegawcza jako jedyny akcent.",
      en: "Power quality measurements, designs up to 110 kV, solar and site supervision. A light background with warning yellow as the only accent.",
    },
    accentColor: "#8A6800",
    date: "2026-09",
  },
  {
    slug: "wojtplast",
    name: "WojtPlast",
    sector: { pl: "Detale z tworzyw sztucznych i formy wtryskowe", en: "Plastic parts and injection moulds" },
    industry: "produkcja",
    url: "https://wojtplast.programo.pl/",
    host: "wojtplast.programo.pl",
    summary: {
      pl: "Produkcja detali, form i narzędzi dla przemysłu, z prawdziwymi zdjęciami produktów i logo klienta. Czerwień z logo na jasnym tle.",
      en: "Parts, moulds and tooling for industry, with the client's real product photos and logo. Logo red on a light background.",
    },
    pages: { pl: ["Strona główna", "Oferta", "Produkt", "Kontakt"], en: ["Home", "Offer", "Product", "Contact"] },
    accentColor: "#C9252C",
    date: "2026-09",
  },
  {
    slug: "anvapol",
    name: "Supermozaika",
    sector: { pl: "Sklep z mozaiką szklaną, kamienną i basenową", en: "Glass, stone and pool mosaic shop" },
    industry: "sklepy",
    url: "https://anvapol.programo.pl/",
    host: "anvapol.programo.pl",
    summary: {
      pl: "Sklep z wyborem koloru, kalkulatorem liczby arkuszy i kartą produktu. Ciemna, złota paleta pod materiał premium.",
      en: "A shop with colour picker, sheet calculator and product page. A dark, gold palette for a premium material.",
    },
    pages: { pl: ["Strona główna", "Produkty", "Produkt", "Koszyk", "Kontakt"], en: ["Home", "Products", "Product", "Cart", "Contact"] },
    accentColor: "#C5A364",
    date: "2026-09",
  },
  {
    slug: "trendcars",
    name: "Trend Cars",
    sector: { pl: "Import aut używanych z Niemiec", en: "Used car importer" },
    city: "Wałbrzych",
    industry: "sklepy",
    url: "https://trendcars.programo.pl/",
    host: "trendcars.programo.pl",
    summary: {
      pl: "Pasek danych pojazdu (rocznik, przebieg, moc, paliwo) przy każdym aucie i telefon w trzech miejscach. W komisie sprzedaje rozmowa, nie formularz.",
      en: "A spec strip (year, mileage, power, fuel) on every car and the phone number in three places. At a dealer the conversation sells, not the form.",
    },
    pages: { pl: ["Strona główna", "Karta auta", "Kontakt"], en: ["Home", "Car page", "Contact"] },
    accentColor: "#E4322D",
    date: "2026-09",
  },
  {
    slug: "sklepmaniek",
    name: "Sklep Maniek",
    sector: { pl: "Części do ciągników i maszyn rolniczych", en: "Tractor and farm machinery parts" },
    city: "Tuchola",
    industry: "sklepy",
    url: "https://sklepmaniek.programo.pl/",
    host: "sklepmaniek.programo.pl",
    summary: {
      pl: "Numer katalogowy jak tabliczka znamionowa przy każdej części, dobór do modelu maszyny zamiast listy kategorii, cena brutto duża i netto obok.",
      en: "The catalogue number as a nameplate on every part, parts picked by machine model instead of a category list, gross price large with net beside it.",
    },
    pages: { pl: ["Strona główna", "Produkt", "Kontakt"], en: ["Home", "Product", "Contact"] },
    accentColor: "#8FA818",
    date: "2026-09",
  },
  {
    slug: "intergraf",
    name: "Intergraf",
    sector: { pl: "Agencja reklamowa i drukarnia", en: "Advertising agency and print shop" },
    city: "Bydgoszcz",
    industry: "uslugi",
    url: "https://intergraf.programo.pl/",
    host: "intergraf.programo.pl",
    summary: {
      pl: "Zieleń z logo przyciemniona i użyta punktowo na papierowym tle, kondensowany krój jak z liternictwa szyldów, znaczniki pasowania druku jako powracający detal.",
      en: "The logo green darkened and used sparingly on a paper background, a condensed typeface borrowed from signage lettering, print register marks as a recurring detail.",
    },
    pages: { pl: ["Strona główna", "Oferta", "Kontakt"], en: ["Home", "Services", "Contact"] },
    accentColor: "#1F7A43",
    date: "2026-09",
  },
  {
    slug: "pressence",
    name: "Pressence Public Relations",
    sector: { pl: "Agencja PR", en: "PR agency" },
    city: "Opole",
    industry: "uslugi",
    url: "https://pressence.programo.pl/",
    host: "pressence.programo.pl",
    summary: {
      pl: "Strategia PR, media relations i komunikacja kryzysowa prowadzone przez dziennikarza z radia i telewizji. Karmin i typografia prasowa.",
      en: "PR strategy, media relations and crisis communication run by a former radio and TV journalist. Crimson and newspaper typography.",
    },
    accentColor: "#5A0619",
    date: "2026-09",
  },
  {
    slug: "elzakup",
    name: "elZakup / ELMAT",
    sector: { pl: "Hurtownia elektryczna B2B", en: "B2B electrical wholesaler" },
    city: "Stalowa Wola",
    industry: "sklepy",
    url: "https://elzakup.programo.pl/",
    host: "elzakup.programo.pl",
    summary: {
      pl: "Sklep hurtowni oparty na magazynie i dostawie liczonej od wagi. Kable, rozdzielnie, oświetlenie i fotowoltaika, dane i cennik dostaw 1:1 z elzakup.pl.",
      en: "A wholesaler's shop built around the warehouse and weight-based delivery. Cables, switchboards, lighting and solar, with data and delivery prices copied 1:1 from the current site.",
    },
    pages: { pl: ["Strona główna", "Kategorie", "Produkty", "Dostawa", "Kontakt"], en: ["Home", "Categories", "Products", "Delivery", "Contact"] },
    conceptSummary: {
      pl: "Sklep hurtowni oparty na magazynie i dostawie liczonej od wagi. Kable, rozdzielnie, oświetlenie i fotowoltaika, z cennikiem dostaw przeniesionym z obecnego sklepu.",
      en: "A wholesaler's shop built around stock and weight-based delivery. Cables, switchgear, lighting and solar, with delivery pricing carried over from the current shop.",
    },
    accentColor: "#5F8F22",
    date: "2026-09",
  },
  {
    slug: "manix",
    name: "Manix Automatyka i Budowa Maszyn",
    sector: { pl: "Maszyny i stanowiska pod konkretny detal", en: "Custom machines and assembly stations" },
    industry: "produkcja",
    url: "https://manix.programo.pl/",
    host: "manix.programo.pl",
    summary: {
      pl: "Stanowiska montażowe, testery szczelności, linie pod detal klienta. Ciemny, warsztatowy układ z bursztynowym akcentem.",
      en: "Assembly stations, leak testers and lines built for a client's part. A dark, workshop layout with an amber accent.",
    },
    accentColor: "#B8860B",
    date: "2026-09",
  },
  {
    slug: "czystaprzyszlosc",
    name: "Czysta Przyszłość",
    sector: { pl: "Chemia i sprzęt do sprzątania dla firm", en: "Professional cleaning chemicals and equipment" },
    city: "Gdańsk",
    industry: "sklepy",
    url: "https://czystaprzyszlosc.programo.pl/",
    host: "czystaprzyszlosc.programo.pl",
    summary: {
      pl: "Kolory z etykiety kanistra (petrol i ostrzegawczy pomarańcz), karty ze ściętym rogiem jak etykieta magazynowa, sześć produktów z cenami i pełna karta jednego z nich.",
      en: "Colours taken from the canister label (petrol and warning orange), cards with a clipped corner like a warehouse label, six priced products and one full product page.",
    },
    pages: { pl: ["Strona główna", "Produkt", "Kontakt"], en: ["Home", "Product", "Contact"] },
    accentColor: "#0E4F52",
    date: "2026-09",
  },
  {
    slug: "zyciestolicy",
    name: "Życie Stolicy",
    sector: { pl: "Portal informacyjny", en: "News portal" },
    city: "Warszawa",
    industry: "media",
    url: "https://demo.programo.pl/",
    host: "demo.programo.pl",
    summary: {
      pl: "Portal o Warszawie i Polsce: miasto, kraj, polityka, społeczeństwo. Siatka artykułów, działy i strona artykułu w układzie gotowym pod reklamy.",
      en: "A news site for Warsaw and Poland: city, country, politics, society. Article grid, sections and an article page laid out with ad slots in mind.",
    },
    // The masthead is the page; it cannot be cropped out.
    conceptReady: false,
    accentColor: "#FB2C36",
    date: "2026-08",
  },
  {
    slug: "biuroaga",
    name: "Biuro Rachunkowo-Usługowe AGA",
    sector: { pl: "Biuro rachunkowe", en: "Accounting office" },
    city: "Kotuń k. Siedlec",
    industry: "uslugi",
    url: "https://biuroaga.programo.pl/",
    host: "biuroaga.programo.pl",
    summary: {
      pl: "KPiR, ryczałt, księgi handlowe, ZUS i urząd skarbowy opisane językiem właściciela małej firmy. Granat i czerwień z materiałów biura.",
      en: "Bookkeeping, flat-rate tax, full accounts, social insurance and tax office matters written in the language of a small business owner. Navy and red from the office's own material.",
    },
    accentColor: "#0C3A8C",
    date: "2026-09",
  },
  {
    slug: "bezpieczneplace",
    name: "Europejskie Centrum Bezpieczeństwa Sportu i Rekreacji",
    sector: { pl: "Kontrole i orzeczenia dla placów zabaw", en: "Playground inspections and certificates" },
    industry: "uslugi",
    url: "https://bezpieczneplace.programo.pl/",
    host: "bezpieczneplace.programo.pl",
    summary: {
      pl: "Układ dokumentu kontrolnego: linie, numeracja, kody norm w kroju maszynowym. Granat i złoto z logo zamiast zieleni z szablonu CMS.",
      en: "Laid out like an inspection report: rules, numbering, standard codes in a monospaced face. Navy and gold from the logo instead of the CMS template green.",
    },
    pages: { pl: ["Strona główna", "Oferta", "Kontakt"], en: ["Home", "Services", "Contact"] },
    accentColor: "#16283A",
    date: "2026-09",
  },
  {
    slug: "ks-posnania",
    name: "KS Posnania",
    sector: { pl: "Klub sportowy od 1907 roku", en: "Sports club founded in 1907" },
    city: "Poznań",
    industry: "sport",
    url: "https://ks-posnania.vercel.app/",
    host: "ks-posnania.vercel.app",
    summary: {
      pl: "Klub wielosekcyjny: wioślarstwo, rugby, pływanie i sponsorzy na osobnych stronach, z historią klubu jako osią strony głównej.",
      en: "A multi-section club: rowing, rugby, swimming and sponsors on their own pages, with the club's history as the spine of the home page.",
    },
    pages: { pl: ["Strona główna", "Wioślarstwo", "Rugby", "Pływanie", "Sponsorzy"], en: ["Home", "Rowing", "Rugby", "Swimming", "Sponsors"] },
    // Club crest and name sit inside the hero.
    conceptReady: false,
    accentColor: "#1D4ED8",
    date: "2026-05",
  },
];

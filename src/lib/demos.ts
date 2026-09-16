// Every website demo we have built for a prospect, in one place. Feeds /dema,
// the sitemap, llms.txt and the CollectionPage schema.
//
// Rules (same spirit as projects.ts):
// - Only facts. Company names, cities and scope come from the demo itself or
//   from the brief written when the demo was built. No invented numbers.
// - A demo is a static mock-up of a new site for a real company: forms, carts
//   and search do not work on purpose. `url` points at the live mock-up; every
//   demo is noindex on its own host, so we link with rel="nofollow".
// - Screenshots: public/screenshots/demos/<slug>-{desktop,mobile}.webp,
//   generated with `node scripts/shoot-demos.mjs` (slug list in scripts/demos.json).

export type DemoIndustry = "sklepy" | "produkcja" | "uslugi" | "medycyna" | "sport" | "media";

export const DEMO_INDUSTRIES: { key: DemoIndustry; label: { pl: string; en: string } }[] = [
  { key: "sklepy", label: { pl: "Sklepy i hurtownie", en: "Shops & wholesale" } },
  { key: "produkcja", label: { pl: "Produkcja i technika", en: "Manufacturing & engineering" } },
  { key: "uslugi", label: { pl: "Usługi dla firm", en: "Business services" } },
  { key: "medycyna", label: { pl: "Medycyna", en: "Healthcare" } },
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
  // Second variant of the same demo, if one exists.
  variant?: { label: { pl: string; en: string }; url: string };
}

export const demos: Demo[] = [
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
    slug: "pzskatslp",
    name: "Okręgowy Związek Skata Śląsk-Południe",
    sector: { pl: "Związek sportowy", en: "Regional sports association" },
    industry: "sport",
    url: "https://pzskatslp.programo.pl/",
    host: "pzskatslp.programo.pl",
    summary: {
      pl: "Turnieje Grand Prix Okręgu, rozgrywki drużynowe i sekcje w jednym czytelnym kalendarzu. Granat i czerwień karciana.",
      en: "Regional Grand Prix tournaments, team league and sections in one readable calendar. Navy and card-table red.",
    },
    pages: { pl: ["Strona główna", "Turnieje", "Kontakt"], en: ["Home", "Tournaments", "Contact"] },
    accentColor: "#073F60",
    date: "2026-09",
  },
  {
    slug: "supermozaika",
    name: "PRIMAVERA / Anvapol",
    sector: { pl: "Mozaika szklana od importera", en: "Glass mosaic from the importer" },
    industry: "sklepy",
    url: "https://supermozaika.programo.pl/",
    host: "supermozaika.programo.pl",
    summary: {
      pl: "Drugi wariant demo dla Anvapolu: strona firmowa importera z ofertą, współpracą i historią firmy, w ciepłej terakocie zamiast sklepu.",
      en: "Second variant of the Anvapol demo: the importer's company site with offer, partnerships and history, in warm terracotta instead of a shop layout.",
    },
    pages: { pl: ["Strona główna", "Oferta", "O nas", "Współpraca", "Kontakt"], en: ["Home", "Offer", "About", "Partners", "Contact"] },
    accentColor: "#7F3020",
    date: "2026-09",
    variant: { label: { pl: "Wariant sklepowy", en: "Shop variant" }, url: "https://anvapol.programo.pl/" },
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
    accentColor: "#5F8F22",
    date: "2026-09",
  },
  {
    slug: "fineartfilm",
    name: "FiNE ART FiLM",
    sector: { pl: "Realizacja TV i streaming wydarzeń", en: "TV production and event streaming" },
    industry: "media",
    url: "https://fineartfilm.programo.pl/",
    host: "fineartfilm.programo.pl",
    summary: {
      pl: "Wielokamerowe transmisje konferencji i koncertów, nagłośnienie, ekrany LED. Ciemna scena i czerwień sygnalizacyjna jak na wozie transmisyjnym.",
      en: "Multi-camera broadcasts of conferences and concerts, sound and LED walls. A dark stage and signal red like an OB truck.",
    },
    accentColor: "#C8180A",
    date: "2026-09",
  },
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
    slug: "innochem",
    name: "INNOCHEM",
    sector: { pl: "Dystrybutor olejów Royal Purple", en: "Royal Purple oils distributor" },
    industry: "sklepy",
    url: "https://innochem.programo.pl/",
    host: "innochem.programo.pl",
    summary: {
      pl: "Sklep z syntetycznymi olejami silnikowymi i przemysłowymi. Czerń i złoto marki, dobór produktu do zastosowania zamiast długiej listy.",
      en: "A shop for synthetic engine and industrial oils. The brand's black and gold, products picked by application instead of a long list.",
    },
    accentColor: "#A8811C",
    date: "2026-08",
  },
  {
    slug: "underwater",
    name: "Underwater.pl",
    sector: { pl: "Centrum nurkowe", en: "Dive centre" },
    city: "Warszawa",
    industry: "sport",
    url: "https://underwater.programo.pl/",
    host: "underwater.programo.pl",
    summary: {
      pl: "Kursy PADI, TDI/SDI i IANTD, sklep i wyprawy w jednym układzie. Mało stron, każda dopracowana: to demo stało się wzorcem zakresu dla wszystkich kolejnych.",
      en: "PADI, TDI/SDI and IANTD courses, shop and trips in one layout. Few pages, each finished: this demo became the scope template for every later one.",
    },
    accentColor: "#0A1A22",
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
    accentColor: "#FB2C36",
    date: "2026-08",
  },
  {
    slug: "terapiadens",
    name: "NZOZ Terapia Dens",
    sector: { pl: "Stomatologia, NFZ i prywatnie", en: "Dental clinic, public and private" },
    city: "Poznań",
    industry: "medycyna",
    url: "https://terapiadens.vercel.app/",
    host: "terapiadens.vercel.app",
    summary: {
      pl: "Dwa warianty tej samej treści: jasny editorial i butikowy z szampańskim papierem. Ośmiu lekarzy, cztery gabinety, godziny i telefony wyłącznie ze starej strony kliniki.",
      en: "Two variants of the same content: a light editorial and a boutique one on champagne paper. Eight dentists, four surgeries, hours and phones taken only from the clinic's old site.",
    },
    pages: { pl: ["Strona główna", "Usługi", "Lekarze", "Rejestracja", "Kontakt"], en: ["Home", "Services", "Dentists", "Booking", "Contact"] },
    accentColor: "#10302C",
    date: "2026-06",
    variant: { label: { pl: "Wariant butikowy", en: "Boutique variant" }, url: "https://terapiadens.vercel.app/v2/" },
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
    accentColor: "#1D4ED8",
    date: "2026-05",
  },
  {
    slug: "gaming-ui",
    name: "Szablon strony serwera gry",
    sector: { pl: "Zestaw UI w stylu gry: ramki 9-slice, przyciski, suwaki", en: "Game-styled UI kit: 9-slice frames, buttons, sliders" },
    industry: "media",
    url: "https://gaming-ui-template.vercel.app/",
    host: "gaming-ui-template.vercel.app",
    summary: {
      pl: "Demo techniczne dla klienta z Warszawy: skalowalna ramka 9-slice, przyciski w dziesięciu kolorach i pięciu stanach, inputy i suwaki działające od 320 do 2560 px.",
      en: "A technical demo for a client in Warsaw: a scalable 9-slice frame, buttons in ten colours and five states, inputs and sliders that work from 320 to 2560 px.",
    },
    accentColor: "#6B4F2A",
    date: "2026-06",
  },
];

export function getDemoBySlug(slug: string): Demo | undefined {
  return demos.find((d) => d.slug === slug);
}

export function demosByIndustry(industry: DemoIndustry): Demo[] {
  return demos.filter((d) => d.industry === industry);
}

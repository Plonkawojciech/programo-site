// About section (founders, studio) and the tech-stack section.
export const about = {
  // About — rewritten from content-deck-2026-07.md section 5. No stock
  // "digital future" / "international expansion" language, no stock photos.
  "about.label": { pl: "O nas", en: "About" },
  "about.title": { pl: "Dwóch inżynierów, jeden standard pracy", en: "Two engineers, one standard of work" },
  "about.intro": {
    pl: "Programo to spółka cywilna Wojciecha Płonki i Bartosza Kolaja z Poznania. Projektujemy i budujemy oprogramowanie sami, od pierwszej rozmowy po wdrożenie i utrzymanie. Nie ma u nas handlowca, który obiecuje, ani podwykonawcy, który potem to odkręca — rozmawiasz z osobami, które wykonują pracę.",
    en: "Programo is the partnership of Wojciech Płonka and Bartosz Kolaj, based in Poznan. We design and build software ourselves, from the first call through deployment and maintenance. There's no salesperson making promises and no subcontractor untangling them later — you talk to the people doing the work.",
  },
  "about.how.title": { pl: "Jak pracujemy", en: "How we work" },
  "about.how.body": {
    pl: "Zanim zaczniemy kodować, ustalamy, co ma się zmienić w Twoim biznesie: więcej telefonów, szybsza obsługa, sprzedaż z telefonu. Potem budujemy etapami, pokazujemy postęp w trakcie i mierzymy efekt po wdrożeniu. Piszemy testy, pilnujemy bezpieczeństwa danych i zostawiamy po sobie systemy, którymi klienci zarządzają samodzielnie — jak panel klubu WKS Poznań, aktualizowany przez trenerkę bez naszego udziału.",
    en: "Before we write code, we establish what should change in your business: more calls, faster service, sales from the phone. Then we build in stages, show progress along the way, and measure the effect after launch. We write tests, guard data security, and leave behind systems our clients manage on their own — like the WKS Poznan club panel, updated by the coach without our involvement.",
  },
  "about.proof.title": { pl: "Własne produkty jako dowód", en: "Our own products as proof" },
  "about.proof.body": {
    pl: "Obok pracy dla klientów rozwijamy własne produkty: CRM Estalo działający produkcyjnie z płatnościami, wyszukiwarkę firm Rejestr Pro i system pomiaru czasu PoolTimer testowany w realnym klubie pływackim. To nasz poligon: rozwiązania, które sprawdzamy najpierw na sobie, trafiają potem do projektów klienckich.",
    en: "Alongside client work we build our own products: the Estalo CRM running in production with billing, the Rejestr Pro company search engine, and the PoolTimer timing system piloted at a real swimming club. They're our proving ground: what we test on ourselves first later goes into client projects.",
  },
  "about.people.title": {
    pl: "Rozmawiasz z osobą, która pisze Twój kod",
    en: "You talk to the person who writes your code",
  },
  "about.wojciech.role": { pl: "Design i Produkt", en: "Design and Product" },
  "about.wojciech.desc": {
    pl: "Projektuje interfejsy i prowadzi produkty od pomysłu do wdrożenia — jego projektem jest m.in. moduł schematów części, z którego Jedmar korzysta na produkcji.",
    en: "Designs interfaces and takes products from idea to launch — his work includes the parts diagram module Jedmar runs in production.",
  },
  "about.bartosz.role": { pl: "Inżynieria", en: "Engineering" },
  "about.bartosz.desc": {
    pl: "Odpowiada za architekturę i kod — od natywnych aplikacji Jedmara w App Store i Google Play po backendy z twardą izolacją danych.",
    en: "Owns architecture and code — from Jedmar's native apps on the App Store and Google Play to backends with strict data isolation.",
  },
  "about.company.title": { pl: "Dane firmy", en: "Company details" },
  "about.company.line": {
    pl: "Programo s.c., Poznań · biuro@programo.pl · 509 123 434",
    en: "Programo s.c., Poznan, Poland · biuro@programo.pl · +48 509 123 434",
  },

  // Tech Stack
  "stack.label": { pl: "Nasze narzędzia", en: "Our Tools" },
  "stack.title": { pl: "Technologie", en: "Tech Stack" },
  "stack.desc": {
    pl: "Wybieramy narzędzia, które pozwalają nam działać szybko bez kompromisów na jakości. Sprawdzone, dobrze udokumentowane, gotowe na produkcję.",
    en: "We pick tools that let us move fast without sacrificing quality. Battle-tested, well-documented, production-ready.",
  },
  "stack.nextjs": { pl: "Full-stack framework React", en: "Full-stack React framework" },
  "stack.react": { pl: "Biblioteka UI", en: "UI library" },
  "stack.typescript": { pl: "Typowany JavaScript", en: "Typed JavaScript" },
  "stack.tailwind": { pl: "Utility-first CSS", en: "Utility-first CSS" },
  "stack.supabase": { pl: "Backend i baza danych", en: "Backend & database" },
  "stack.neon": { pl: "Serverless PostgreSQL", en: "Serverless PostgreSQL" },
  "stack.drizzle": { pl: "TypeScript ORM", en: "TypeScript ORM" },
  "stack.vercel": { pl: "Deployment i hosting", en: "Deployment & hosting" },
  "stack.capacitor": { pl: "Aplikacje mobilne natywne", en: "Native mobile apps" },
  "stack.azure": { pl: "AI i usługi kognitywne", en: "AI & cognitive services" },
  "stack.anthropic": { pl: "LLM i agenty AI", en: "LLMs & AI agents" },
  "stack.stripe": { pl: "Infrastruktura płatności", en: "Payments infrastructure" },
  "stack.resend": { pl: "Transakcyjne emaile", en: "Transactional emails" },
  "stack.threejs": { pl: "Grafika 3D w przeglądarce", en: "3D graphics in browser" },
  "stack.konvajs": { pl: "Canvas 2D framework", en: "2D canvas framework" },
} as const satisfies Record<string, { pl: string; en: string }>;

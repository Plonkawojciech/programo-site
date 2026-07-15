// Offer / services page copy.
export const offer = {
  "offer.label": { pl: "Co robimy", en: "What we do" },
  "offer.title": { pl: "Oferta", en: "Services" },
  "offer.desc": {
    pl: "Projektujemy i budujemy kompletne produkty cyfrowe — strony, aplikacje webowe i mobilne, systemy SaaS oraz integracje AI. Od MVP po platformy gotowe na skalę.",
    en: "We design and build complete digital products — websites, web and mobile apps, SaaS systems and AI integrations. From MVP to platforms ready to scale.",
  },
  "offer.web.title": { pl: "Strony internetowe", en: "Websites" },
  "offer.web.desc": {
    pl: "Nowoczesne strony firmowe, landing page'e i portale. Szybkie, SEO-friendly, gotowe do skalowania.",
    en: "Modern company sites, landing pages and portals. Fast, SEO-friendly, ready to scale.",
  },
  "offer.ecommerce.title": { pl: "Sklepy internetowe", en: "Online stores" },
  "offer.ecommerce.desc": {
    pl: "Sklepy WooCommerce, Shopify, PrestaShop i headless. Migracje, integracje (Allegro, BaseLinker, płatności) i aplikacje mobilne do sklepu.",
    en: "WooCommerce, Shopify, PrestaShop and headless stores. Migrations, integrations (Allegro, BaseLinker, payments) and mobile store apps.",
  },
  "offer.saas.title": { pl: "Aplikacje SaaS", en: "SaaS applications" },
  "offer.saas.desc": {
    pl: "Pełne platformy z autoryzacją, płatnościami, panelami administracyjnymi i integracjami.",
    en: "Full platforms with auth, payments, admin panels and integrations.",
  },
  "offer.mobile.title": { pl: "Aplikacje mobilne", en: "Mobile apps" },
  "offer.mobile.desc": {
    pl: "Natywne aplikacje na iOS i Android. Jeden codebase, dwie platformy.",
    en: "Native iOS and Android apps. One codebase, both platforms.",
  },
  "offer.ai.title": { pl: "Integracje AI", en: "AI integrations" },
  "offer.ai.desc": {
    pl: "Wdrażamy LLM-y, asystenty AI i automatyzacje oparte o sztuczną inteligencję w Twoim biznesie.",
    en: "We deploy LLMs, AI assistants and AI-powered automation in your business.",
  },
  "offer.consulting.title": { pl: "Doradztwo techniczne", en: "Tech consulting" },
  "offer.consulting.desc": {
    pl: "Pomożemy wybrać stack, zaplanować architekturę i uniknąć kosztownych błędów.",
    en: "We help you pick the stack, plan architecture and avoid costly mistakes.",
  },
} as const satisfies Record<string, { pl: string; en: string }>;

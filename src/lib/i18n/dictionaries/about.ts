// About section (founders, studio) and the tech-stack section.
export const about = {
  // About
  "about.title1": { pl: "Dwóch builderów,", en: "Two builders," },
  "about.title2": { pl: "jedno studio.", en: "one studio." },
  "about.intro": {
    pl: "Programo to studio software założone przez {w} i {b} w Poznaniu.",
    en: "Programo is a software studio founded by {w} and {b} in Poznań, Poland.",
  },
  "about.p1": {
    pl: "Budujemy kompletne produkty software’owe — od wczesnych prototypów po gotowe platformy SaaS. Skupiamy się na dostarczaniu narzędzi, których firmy naprawdę potrzebują.",
    en: "We build complete software products — from early-stage prototypes to production-ready SaaS platforms. Our focus is on shipping thoughtfully crafted tools that businesses actually need, not just technically impressive demos.",
  },
  "about.p2": {
    pl: "Każdy projekt dostaje naszą pełną uwagę. Zajmujemy się architekturą, designem, developmentem i wdrożeniem. Bez warstw zarządzania — tylko dwóch inżynierów, którym zależy na jakości.",
    en: "Every project we take on gets our full attention. We handle architecture, design, development, and deployment. No layers of management, no handoffs — just two engineers who care deeply about the work.",
  },
  "about.stat.products": { pl: "Produktów", en: "Products Shipped" },
  "about.stat.founders": { pl: "Założycieli", en: "Founders" },
  "about.stat.founded": { pl: "Założone", en: "Founded" },
  "about.stat.location": { pl: "Siedziba", en: "Based In" },

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

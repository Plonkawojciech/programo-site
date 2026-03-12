"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Lang = "pl" | "en";

const translations = {
  // Navbar
  "nav.work": { pl: "Projekty", en: "Work" },
  "nav.about": { pl: "O nas", en: "About" },
  "nav.stack": { pl: "Technologie", en: "Stack" },
  "nav.contact": { pl: "Kontakt", en: "Contact" },
  "nav.cta": { pl: "Napisz do nas", en: "Get in touch" },

  // Hero
  "hero.label": { pl: "Studio Software", en: "Software Studio" },
  "hero.desc": {
    pl: "Projektujemy i budujemy oprogramowanie, kt\u00f3re rozwi\u0105zuje realne problemy. Od koncepcji po wdro\u017cenie, z dba\u0142o\u015bci\u0105 o ka\u017cdy detal.",
    en: "We design and build software products that solve real problems. From concept to launch, with craft and precision.",
  },
  "hero.browse": { pl: "Zobacz projekty", en: "Browse our work" },
  "hero.about": { pl: "O nas", en: "About us" },
  "hero.contact": { pl: "Kontakt", en: "Get in touch" },

  // Featured Work
  "work.label": { pl: "Wybrane projekty", en: "Selected Projects" },
  "work.title": { pl: "Nasze realizacje", en: "Featured Work" },
  "work.estalo.subtitle": { pl: "CRM dla nieruchomo\u015bci", en: "CRM for Real Estate" },
  "work.estalo.desc": {
    pl: "Platforma SaaS CRM dla polskich biur nieruchomo\u015bci. Zarz\u0105dzanie ofertami, leadami, SMS-ami oraz integracje z portalami Otodom, NOE 2.0 i Domy.pl. Wspierana przez Azure AI.",
    en: "SaaS CRM platform for Polish real estate agencies. Manages property listings, leads, SMS communications, and integrations with Otodom, NOE 2.0, and Domy.pl portals. Powered by Azure AI.",
  },
  "work.baulx.subtitle": { pl: "In\u017cynieria CNC drewna", en: "CNC Timber Engineering" },
  "work.baulx.desc": {
    pl: "Wielofunkcyjna platforma CNC z konwersj\u0105 plik\u00f3w (WUP, BTLx, TCN, G-code), parametrycznymi projektantami \u015bcian, dach\u00f3w i strop\u00f3w, kalkulatorami konstrukcyjnymi i wizualizacj\u0105 3D.",
    en: "Multi-featured CNC platform with file conversion (WUP, BTLx, TCN, G-code), parametric designers for walls, roofs and floors, structural calculators, and 3D visualization tools.",
  },
  "work.wup2tcn.subtitle": { pl: "Konwerter plik\u00f3w CNC", en: "CNC File Converter" },
  "work.wup2tcn.desc": {
    pl: "Specjalistyczny konwerter plik\u00f3w dla maszyn CNC Dietrich\u2019s. Konwertuje pliki panelowe WUP/WOP do formatu TCN dla sterownik\u00f3w TPA Compact, z przetwarzaniem wsadowym i generowaniem BOM.",
    en: "Specialized file converter for Dietrich\u2019s CNC machines. Converts WUP/WOP panel files to TCN format for TPA Compact controllers, with batch processing and BOM generation.",
  },

  // About
  "about.label": { pl: "Kim jeste\u015bmy", en: "Who We Are" },
  "about.title1": { pl: "Dw\u00f3ch builder\u00f3w,", en: "Two builders," },
  "about.title2": { pl: "jedno studio.", en: "one studio." },
  "about.intro": {
    pl: "Programo to studio software za\u0142o\u017cone przez {w} i {b} w Poznaniu.",
    en: "Programo is a software studio founded by {w} and {b} in Pozna\u0144, Poland.",
  },
  "about.p1": {
    pl: "Budujemy kompletne produkty software\u2019owe \u2014 od wczesnych prototyp\u00f3w po gotowe platformy SaaS. Skupiamy si\u0119 na dostarczaniu narz\u0119dzi, kt\u00f3rych firmy naprawd\u0119 potrzebuj\u0105.",
    en: "We build complete software products \u2014 from early-stage prototypes to production-ready SaaS platforms. Our focus is on shipping thoughtfully crafted tools that businesses actually need, not just technically impressive demos.",
  },
  "about.p2": {
    pl: "Ka\u017cdy projekt dostaje nasz\u0105 pe\u0142n\u0105 uwag\u0119. Zajmujemy si\u0119 architektur\u0105, designem, developmentem i wdro\u017ceniem. Bez warstw zarz\u0105dzania \u2014 tylko dw\u00f3ch in\u017cynier\u00f3w, kt\u00f3rym zale\u017cy na jako\u015bci.",
    en: "Every project we take on gets our full attention. We handle architecture, design, development, and deployment. No layers of management, no handoffs \u2014 just two engineers who care deeply about the work.",
  },
  "about.stat.products": { pl: "Produkt\u00f3w", en: "Products Shipped" },
  "about.stat.founders": { pl: "Za\u0142o\u017cycieli", en: "Founders" },
  "about.stat.founded": { pl: "Za\u0142o\u017cone", en: "Founded" },
  "about.stat.location": { pl: "Siedziba", en: "Based In" },

  // Tech Stack
  "stack.label": { pl: "Nasze narz\u0119dzia", en: "Our Tools" },
  "stack.title": { pl: "Technologie", en: "Tech Stack" },
  "stack.desc": {
    pl: "Wybieramy narz\u0119dzia, kt\u00f3re pozwalaj\u0105 nam dzia\u0142a\u0107 szybko bez kompromis\u00f3w na jako\u015bci. Sprawdzone, dobrze udokumentowane, gotowe na produkcj\u0119.",
    en: "We pick tools that let us move fast without sacrificing quality. Battle-tested, well-documented, production-ready.",
  },
  "stack.nextjs": { pl: "Full-stack framework React", en: "Full-stack React framework" },
  "stack.rn": { pl: "Aplikacje mobilne cross-platform", en: "Cross-platform mobile apps" },
  "stack.supabase": { pl: "Backend i baza danych", en: "Backend & database" },
  "stack.stripe": { pl: "Infrastruktura p\u0142atno\u015bci", en: "Payments infrastructure" },
  "stack.azure": { pl: "AI i us\u0142ugi kognitywne", en: "AI & cognitive services" },
  "stack.vercel": { pl: "Deployment i hosting", en: "Deployment & hosting" },

  // Contact
  "contact.label": { pl: "Kontakt", en: "Get In Touch" },
  "contact.title1": { pl: "Zbudujmy co\u015b", en: "Let\u2019s build something" },
  "contact.title2": { pl: "razem.", en: "together." },
  "contact.desc": {
    pl: "Masz pomys\u0142 na projekt? Ch\u0119tnie o nim porozmawiamy. Napisz do nas, a odezwiemy si\u0119 w ci\u0105gu 24 godzin.",
    en: "Have a project in mind? We\u2019d love to hear about it. Drop us a line and we\u2019ll get back to you within 24 hours.",
  },

  // Footer
  "footer.location": { pl: "Pozna\u0144, Polska", en: "Pozna\u0144, Poland" },
} as const;

type TranslationKey = keyof typeof translations;

interface I18nContextType {
  lang: Lang;
  toggle: () => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("pl");

  const toggle = useCallback(() => {
    setLang((prev) => (prev === "pl" ? "en" : "pl"));
  }, []);

  const t = useCallback(
    (key: TranslationKey) => translations[key]?.[lang] ?? key,
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, toggle, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

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
  "work.viewProject": { pl: "Zobacz projekt", en: "View project" },
  "work.comingSoon": { pl: "Wkr\u00f3tce", en: "Coming Soon" },
  "work.inDevelopment": { pl: "W realizacji", en: "In Development" },
  "work.live": { pl: "Na żywo", en: "Live" },

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
  "stack.react": { pl: "Biblioteka UI", en: "UI library" },
  "stack.typescript": { pl: "Typowany JavaScript", en: "Typed JavaScript" },
  "stack.tailwind": { pl: "Utility-first CSS", en: "Utility-first CSS" },
  "stack.supabase": { pl: "Backend i baza danych", en: "Backend & database" },
  "stack.neon": { pl: "Serverless PostgreSQL", en: "Serverless PostgreSQL" },
  "stack.drizzle": { pl: "TypeScript ORM", en: "TypeScript ORM" },
  "stack.vercel": { pl: "Deployment i hosting", en: "Deployment & hosting" },
  "stack.capacitor": { pl: "Aplikacje mobilne natywne", en: "Native mobile apps" },
  "stack.azure": { pl: "AI i us\u0142ugi kognitywne", en: "AI & cognitive services" },
  "stack.anthropic": { pl: "LLM i agenty AI", en: "LLMs & AI agents" },
  "stack.stripe": { pl: "Infrastruktura p\u0142atno\u015bci", en: "Payments infrastructure" },
  "stack.resend": { pl: "Transakcyjne emaile", en: "Transactional emails" },
  "stack.threejs": { pl: "Grafika 3D w przegl\u0105darce", en: "3D graphics in browser" },
  "stack.konvajs": { pl: "Canvas 2D framework", en: "2D canvas framework" },

  // Contact
  "contact.label": { pl: "Kontakt", en: "Get In Touch" },
  "contact.title1": { pl: "Zbudujmy co\u015b", en: "Let\u2019s build something" },
  "contact.title2": { pl: "razem.", en: "together." },
  "contact.desc": {
    pl: "Masz pomys\u0142 na projekt? Ch\u0119tnie o nim porozmawiamy. Napisz do nas, a odezwiemy si\u0119 w ci\u0105gu 24 godzin.",
    en: "Have a project in mind? We\u2019d love to hear about it. Drop us a line and we\u2019ll get back to you within 24 hours.",
  },

  // Contact Form
  "contact.form.name": { pl: "Imi\u0119", en: "Name" },
  "contact.form.namePlaceholder": { pl: "Twoje imi\u0119", en: "Your name" },
  "contact.form.email": { pl: "Email", en: "Email" },
  "contact.form.emailPlaceholder": { pl: "twoj@email.pl", en: "your@email.com" },
  "contact.form.subject": { pl: "Temat", en: "Subject" },
  "contact.form.subjectPlaceholder": { pl: "Wybierz temat", en: "Choose a subject" },
  "contact.form.subjectCollab": { pl: "Wsp\u00f3\u0142praca", en: "Collaboration" },
  "contact.form.subjectQuote": { pl: "Wycena projektu", en: "Project quote" },
  "contact.form.subjectTech": { pl: "Pytanie techniczne", en: "Technical question" },
  "contact.form.subjectOther": { pl: "Inne", en: "Other" },
  "contact.form.message": { pl: "Wiadomo\u015b\u0107", en: "Message" },
  "contact.form.messagePlaceholder": { pl: "Opisz sw\u00f3j projekt lub pytanie (min. 20 znak\u00f3w)", en: "Describe your project or question (min. 20 characters)" },
  "contact.form.submit": { pl: "Wy\u015blij", en: "Send" },
  "contact.form.submitting": { pl: "Wysy\u0142anie...", en: "Sending..." },
  "contact.form.submitted": { pl: "Wys\u0142ano!", en: "Sent!" },
  "contact.form.errorRequired": { pl: "To pole jest wymagane", en: "This field is required" },
  "contact.form.errorEmail": { pl: "Nieprawid\u0142owy adres email", en: "Invalid email address" },
  "contact.form.errorMinLength": { pl: "Minimum 20 znak\u00f3w", en: "Minimum 20 characters" },
  "contact.form.errorMaxLength": { pl: "Maksimum 2000 znak\u00f3w", en: "Maximum 2000 characters" },
  "contact.form.successToast": { pl: "Wiadomo\u015b\u0107 wys\u0142ana!", en: "Message sent!" },
  "contact.form.errorToast": { pl: "Co\u015b posz\u0142o nie tak", en: "Something went wrong" },
  "contact.form.rateLimitToast": { pl: "Zbyt wiele wiadomo\u015bci. Spr\u00f3buj p\u00f3\u017aniej.", en: "Too many messages. Try again later." },

  // Footer
  "footer.location": { pl: "Pozna\u0144, Polska", en: "Pozna\u0144, Poland" },
  "footer.copyright": { pl: "Programo", en: "Programo" },

  // 404
  "notFound.title": { pl: "Nie znaleziono strony", en: "Page not found" },
  "notFound.desc": { pl: "Strona, kt\u00f3rej szukasz, nie istnieje.", en: "The page you are looking for does not exist." },
  "notFound.back": { pl: "Wr\u00f3\u0107 na stron\u0119 g\u0142\u00f3wn\u0105", en: "Back to homepage" },

  // Accessibility
  "a11y.skipToContent": { pl: "Przejd\u017a do tre\u015bci", en: "Skip to content" },
  "a11y.langToggle": { pl: "Zmie\u0144 j\u0119zyk", en: "Change language" },
  "a11y.mainNav": { pl: "Nawigacja g\u0142\u00f3wna", en: "Main navigation" },

  // Project Detail Page
  "project.backToProjects": { pl: "\u2190 Wszystkie projekty", en: "\u2190 All projects" },
  "project.about": { pl: "O projekcie", en: "About" },
  "project.whatWeBuilt": { pl: "Co zbudowali\u015bmy", en: "What we built" },
  "project.role": { pl: "Rola", en: "Role" },
  "project.status": { pl: "Status", en: "Status" },
  "project.techStack": { pl: "Technologie", en: "Tech Stack" },
  "project.year": { pl: "Rok", en: "Year" },
  "project.visitSite": { pl: "Odwied\u017a stron\u0119", en: "Visit site" },
  "project.nextProject": { pl: "Nast\u0119pny projekt", en: "Next project" },
  "project.prevProject": { pl: "Poprzedni projekt", en: "Previous project" },
  "project.statusLive": { pl: "Na \u017cywo", en: "Live" },
  "project.statusDev": { pl: "W realizacji", en: "In Development" },
  "project.statusPlanned": { pl: "Planowany", en: "Planned" },
  "project.interestedCta": {
    pl: "Zainteresowany czym\u015b podobnym?",
    en: "Interested in something similar?",
  },
  "project.letsTalk": { pl: "Porozmawiajmy", en: "Let\u2019s talk" },
} as const;

export type TranslationKey = keyof typeof translations;
export { translations };

interface I18nContextType {
  lang: Lang;
  toggle: () => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("programo-lang");
      if (saved === "en" || saved === "pl") return saved;
    }
    return "pl";
  });

  useEffect(() => {
    localStorage.setItem("programo-lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

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

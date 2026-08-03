// Site chrome shared across every page: navigation, footer, 404, accessibility
// labels and the privacy-policy page.
export const common = {
  // Navbar
  "nav.offer": { pl: "Oferta", en: "Services" },
  "nav.work": { pl: "Projekty", en: "Projects" },
  "nav.stores": { pl: "Sklepy", en: "Stores" },
  "nav.marketing": { pl: "Strony i reklamy", en: "Websites & ads" },
  "nav.pricing": { pl: "Wycena", en: "Pricing" },
  "nav.about": { pl: "O nas", en: "About" },
  "nav.contact": { pl: "Kontakt", en: "Contact" },
  "nav.cta": { pl: "Umów rozmowę", en: "Book a call" },
  "nav.phone": { pl: "Zadzwoń", en: "Call" },

  // Footer
  // Non-breaking space before the last word — prevents a single-word orphan
  // line on this tagline, which repeats on every page (shared footer).
  "footer.tagline": {
    pl: "",
    en: "",
  },
  "footer.reply": { pl: "", en: "" },
  "footer.colOffer": { pl: "Oferta", en: "Services" },
  "footer.colProjects": { pl: "Projekty", en: "Projects" },
  "footer.colCompany": { pl: "Firma", en: "Company" },
  "footer.allProjects": { pl: "Wszystkie projekty", en: "All projects" },
  "footer.location": { pl: "Poznań, Polska", en: "Poznan, Poland" },
  "footer.companyName": { pl: "Programo s.j.", en: "Programo s.j." },
  "footer.copyright": { pl: "Programo", en: "Programo" },
  "footer.privacy": { pl: "Polityka prywatności", en: "Privacy policy" },
  "footer.cookies": { pl: "Ustawienia cookies", en: "Cookie settings" },

  // 404
  "notFound.title": { pl: "Nie znaleziono strony", en: "Page not found" },
  "notFound.desc": { pl: "Strona, której szukasz, nie istnieje.", en: "The page you are looking for does not exist." },
  "notFound.back": { pl: "Wróć na stronę główną", en: "Back to homepage" },

  // Accessibility
  "a11y.skipToContent": { pl: "Przejdź do treści", en: "Skip to content" },
  "a11y.langToggle": { pl: "Zmień język", en: "Change language" },
  "a11y.mainNav": { pl: "Nawigacja główna", en: "Main navigation" },

  // Privacy policy page
  "privacy.title": { pl: "Polityka prywatności", en: "Privacy policy" },
  "privacy.updated": { pl: "Ostatnia aktualizacja", en: "Last updated" },
  "privacy.backHome": { pl: "← Wróć na stronę główną", en: "← Back to homepage" },
} as const satisfies Record<string, { pl: string; en: string }>;

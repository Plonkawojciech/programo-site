// Site chrome shared across every page: navigation, footer, 404, accessibility
// labels and the privacy-policy page.
export const common = {
  // Navbar
  "nav.work": { pl: "Projekty", en: "Work" },
  "nav.about": { pl: "O nas", en: "About" },
  "nav.stack": { pl: "Technologie", en: "Stack" },
  "nav.contact": { pl: "Kontakt", en: "Contact" },
  "nav.offer": { pl: "Oferta", en: "Services" },
  "nav.websites": { pl: "Strony WWW", en: "Websites" },
  "nav.stores": { pl: "Sklepy", en: "Stores" },
  "nav.pricing": { pl: "Wycena", en: "Pricing" },
  "nav.cta": { pl: "Napisz do nas", en: "Get in touch" },

  // Footer
  "footer.location": { pl: "Poznań, Polska", en: "Poznań, Poland" },
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

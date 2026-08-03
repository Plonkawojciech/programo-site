// Contact section headings and description (the section frame, not the form).
export const contact = {
  "contact.label": { pl: "Kontakt", en: "Get In Touch" },
  "contact.title1": { pl: "Zbudujmy coś", en: "Let’s build something" },
  "contact.title2": { pl: "razem.", en: "together." },
  "contact.desc": {
    pl: "Masz pomysł na projekt? Chętnie o nim porozmawiamy. Napisz do nas, a odezwiemy się w ciągu 24 godzin.",
    en: "Have a project in mind? We’d love to hear about it. Drop us a line and we’ll get back to you within 24 hours.",
  },

  // /kontakt — short page hero (above the forms)
  "contactPage.eyebrow": { pl: "Kontakt", en: "Contact" },
  "contactPage.title": {
    pl: "Zadzwoń albo zostaw numer. Odpowiadamy w 24h",
    en: "Call us or leave your number. We reply within 24 hours",
  },
  "contactPage.subtitle": {
    pl: "Rozmawiasz bezpośrednio z osobami, które będą budować Twój projekt, bez handlowców po drodze.",
    en: "You talk directly to the people who will build your project, with no salespeople in between.",
  },
} as const satisfies Record<string, { pl: string; en: string }>;

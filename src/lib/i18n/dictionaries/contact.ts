// Contact section headings and description (the section frame, not the form).
export const contact = {
  "contact.label": { pl: "Kontakt", en: "Get In Touch" },
  "contact.title1": { pl: "Zbudujmy coś", en: "Let’s build something" },
  "contact.title2": { pl: "razem.", en: "together." },
  "contact.desc": {
    pl: "Masz pomysł na projekt? Chętnie o nim porozmawiamy. Napisz do nas, a odezwiemy się w ciągu 24 godzin.",
    en: "Have a project in mind? We’d love to hear about it. Drop us a line and we’ll get back to you within 24 hours.",
  },
} as const satisfies Record<string, { pl: string; en: string }>;

// Lead-capture forms: the QuickContact form, its chips and consent copy, plus
// the classic contact form fields.
export const forms = {
  // Quick contact form (main page)
  "quick.title": { pl: "Napisz do nas", en: "Get in touch" },
  "quick.subtitle": {
    pl: "Opisz w kilku zdaniach, co chcesz zbudować. Odezwiemy się w ciągu 24 godzin z konkretnymi pytaniami i propozycją kolejnego kroku.",
    en: "Tell us in a few sentences what you want to build. We'll reply within 24 hours with concrete questions and a suggested next step.",
  },
  "quick.name": { pl: "Imię i nazwisko", en: "Your name" },
  "quick.email": { pl: "Email", en: "Email" },
  "quick.phone": { pl: "Telefon", en: "Phone" },
  "quick.message": { pl: "Opisz krótko swoją sytuację i czego potrzebujesz", en: "Briefly describe your situation and what you need" },
  "quick.optional": { pl: "(opcjonalnie)", en: "(optional)" },
  "quick.contactHint": { pl: "Wystarczy e-mail LUB telefon — jedno z dwóch.", en: "Email OR phone is enough — just one." },
  "quick.contactRequired": { pl: "Podaj e-mail lub numer telefonu.", en: "Please provide an email or phone number." },
  "quick.send": { pl: "Wyślij wiadomość", en: "Send message" },
  "quick.sending": { pl: "Wysyłanie...", en: "Sending..." },
  "quick.sent": { pl: "Wysłano! Odezwiemy się wkrótce.", en: "Sent! We'll be in touch soon." },
  "quick.error": { pl: "Coś poszło nie tak. Spróbuj ponownie.", en: "Something went wrong. Try again." },

  // Quick contact — project type chips
  "quick.typeLabel": { pl: "Czego potrzebujesz?", en: "What do you need?" },
  "quick.type.web": { pl: "Strona / landing", en: "Website / landing" },
  "quick.type.saas": { pl: "Aplikacja SaaS", en: "SaaS app" },
  "quick.type.mobile": { pl: "Aplikacja mobilna", en: "Mobile app" },
  "quick.type.ai": { pl: "Integracja AI", en: "AI integration" },
  "quick.type.other": { pl: "Coś innego", en: "Something else" },

  // Quick contact — budget chips
  "quick.budgetLabel": { pl: "Orientacyjny budżet (opcjonalnie)", en: "Approx. budget (optional)" },
  "quick.budget.s": { pl: "do 10 tys. zł", en: "up to €2.5k" },
  "quick.budget.m": { pl: "10–30 tys. zł", en: "€2.5k–7k" },
  "quick.budget.l": { pl: "30–80 tys. zł", en: "€7k–18k" },
  "quick.budget.xl": { pl: "powyżej 80 tys. zł", en: "€18k+" },
  "quick.budget.unsure": { pl: "Jeszcze nie wiem", en: "Not sure yet" },

  // Quick contact — trust microcopy + success next-step
  "quick.trust": {
    pl: "Odpowiadamy w ciągu 24 h · Konsultacja bez zobowiązań · Twoje dane są bezpieczne (RODO)",
    en: "We reply within 24 h · No-obligation consultation · Your data is safe (GDPR)",
  },
  "quick.successTitle": { pl: "Dziękujemy — wiadomość dotarła.", en: "Thank you — your message arrived." },
  "quick.successBody": {
    pl: "Przeczytamy ją osobiście i odezwiemy się w ciągu 24 godzin (zwykle szybciej). Jeśli sprawa jest pilna, zadzwoń — numery masz obok.",
    en: "We'll read it personally and get back to you within 24 hours (usually sooner). If it's urgent, just call — numbers are next to this form.",
  },
  "quick.successAgain": { pl: "Wyślij kolejną wiadomość", en: "Send another message" },

  // Contact form consent
  "quick.consentLabel": {
    pl: "Wyrażam zgodę na przetwarzanie moich danych osobowych przez Programo Studio w celu odpowiedzi na zapytanie.",
    en: "I consent to processing of my personal data by Programo Studio for the purpose of responding to my inquiry.",
  },
  "quick.consentRequired": {
    pl: "Akceptacja zgody jest wymagana, żeby wysłać wiadomość.",
    en: "Consent is required to send the message.",
  },
  "quick.privacyLink": {
    pl: "Zobacz politykę prywatności",
    en: "See privacy policy",
  },

  // Contact Form (classic)
  "contact.form.name": { pl: "Imię", en: "Name" },
  "contact.form.namePlaceholder": { pl: "Twoje imię", en: "Your name" },
  "contact.form.email": { pl: "Email", en: "Email" },
  "contact.form.emailPlaceholder": { pl: "twoj@email.pl", en: "your@email.com" },
  "contact.form.subject": { pl: "Temat", en: "Subject" },
  "contact.form.subjectPlaceholder": { pl: "Wybierz temat", en: "Choose a subject" },
  "contact.form.subjectCollab": { pl: "Współpraca", en: "Collaboration" },
  "contact.form.subjectQuote": { pl: "Wycena projektu", en: "Project quote" },
  "contact.form.subjectTech": { pl: "Pytanie techniczne", en: "Technical question" },
  "contact.form.subjectOther": { pl: "Inne", en: "Other" },
  "contact.form.message": { pl: "Wiadomość", en: "Message" },
  "contact.form.messagePlaceholder": { pl: "Opisz swój projekt lub pytanie (min. 20 znaków)", en: "Describe your project or question (min. 20 characters)" },
  "contact.form.submit": { pl: "Wyślij", en: "Send" },
  "contact.form.submitting": { pl: "Wysyłanie...", en: "Sending..." },
  "contact.form.submitted": { pl: "Wysłano!", en: "Sent!" },
  "contact.form.errorRequired": { pl: "To pole jest wymagane", en: "This field is required" },
  "contact.form.errorEmail": { pl: "Nieprawidłowy adres email", en: "Invalid email address" },
  "contact.form.errorMinLength": { pl: "Minimum 20 znaków", en: "Minimum 20 characters" },
  "contact.form.errorMaxLength": { pl: "Maksimum 2000 znaków", en: "Maximum 2000 characters" },
  "contact.form.successToast": { pl: "Wiadomość wysłana!", en: "Message sent!" },
  "contact.form.errorToast": { pl: "Coś poszło nie tak", en: "Something went wrong" },
  "contact.form.rateLimitToast": { pl: "Zbyt wiele wiadomości. Spróbuj później.", en: "Too many messages. Try again later." },
} as const satisfies Record<string, { pl: string; en: string }>;

// Lead-capture forms: CompactLeadForm (name + phone + consent), the QuickContact
// form (name + phone-or-email + project type chips + optional message), and the
// legacy classic contact-form field labels. Copy is 1:1 from
// docs/content-deck-2026-07.md section 7 (Formularze — microcopy).
export const forms = {
  // --- CompactLeadForm (imię + telefon + zgoda) --------------------------------
  "compact.eyebrow": { pl: "Szybki kontakt", en: "Quick contact" },
  "compact.heading": {
    pl: "Zostaw numer — oddzwonimy w 24 h z konkretami.",
    en: "Leave your number — we'll call back within 24 hours with specifics.",
  },
  "compact.sub": {
    pl: "Bez zobowiązań i bez spamu — numeru użyjemy tylko po to, żeby oddzwonić.",
    en: "No obligation, no spam — we'll only use your number to call you back.",
  },
  "compact.bareSub": {
    pl: "Odpowiadamy w 24 h — bez zobowiązań.",
    en: "We reply within 24 hours — no obligation.",
  },
  "compact.directContact": {
    pl: "Bezpośredni kontakt z założycielami · Odpowiadamy w 24 h",
    en: "Direct contact with the founders · We reply within 24 hours",
  },
  "compact.nameLabel": { pl: "Imię", en: "First name" },
  "compact.namePlaceholder": { pl: "Jak masz na imię?", en: "What's your first name?" },
  "compact.phoneLabel": { pl: "Numer telefonu", en: "Phone number" },
  "compact.phonePlaceholder": { pl: "600 000 000", en: "+48 600 000 000" },
  "compact.consentLabel": {
    pl: "Wyrażam zgodę na kontakt telefoniczny w sprawie mojego zapytania. Administratorem danych jest Programo s.c. Szczegóły w",
    en: "I consent to being contacted by phone about my inquiry. Programo s.c. is the data controller. Details in the",
  },
  "compact.submit": { pl: "Oddzwońcie do mnie", en: "Call me back" },
  "compact.submitting": { pl: "Wysyłanie...", en: "Sending..." },
  "compact.callNow": { pl: "Zadzwoń teraz", en: "Call now" },
  "compact.success": {
    pl: "Dziękujemy — odezwiemy się w 24 h.",
    en: "Thank you — we'll be in touch within 24 hours.",
  },
  "compact.successBody": {
    pl: "Jeśli sprawa jest pilna, zadzwoń: 509 123 434.",
    en: "If it's urgent, call us: +48 509 123 434.",
  },
  "compact.errorName": { pl: "Podaj imię.", en: "Enter your first name." },
  "compact.errorPhoneMissing": {
    pl: "Podaj numer telefonu, żebyśmy mogli oddzwonić.",
    en: "Enter a phone number so we can call you back.",
  },
  "compact.errorPhoneInvalid": {
    pl: "Ten numer wygląda na niepełny. Sprawdź, czy ma 9 cyfr.",
    en: "This number looks incomplete. Check that it's a valid phone number.",
  },
  "compact.errorConsent": {
    pl: "Zaznacz zgodę na kontakt — bez niej nie możemy oddzwonić.",
    en: "Tick the contact consent — without it we can't call you back.",
  },
  "compact.errorServer": {
    pl: "Nie udało się wysłać. Spróbuj ponownie albo zadzwoń: 509 123 434.",
    en: "Sending failed. Try again or call us: +48 509 123 434.",
  },

  // --- QuickContact (imię, e-mail LUB telefon, chipy, wiadomość opcjonalna) ----
  "quick.title": { pl: "Opowiedz nam, co chcesz zbudować", en: "Tell us what you want to build" },
  "quick.subtitle": {
    pl: "Piętnaście minut rozmowy wystarczy, żebyśmy powiedzieli Ci, czy to ma sens, ile może kosztować i od czego zacząć.",
    en: "Fifteen minutes on the phone is enough for us to tell you whether it makes sense, roughly what it may cost, and where to start.",
  },
  "quick.name": { pl: "Imię", en: "First name" },
  "quick.namePlaceholder": { pl: "Jak masz na imię?", en: "What's your first name?" },
  "quick.contactLabel": { pl: "Telefon lub e-mail", en: "Phone or email" },
  "quick.contactPlaceholder": {
    pl: "600 000 000 albo adres e-mail",
    en: "+48 600 000 000 or an email address",
  },
  "quick.contactRequired": {
    pl: "Podaj telefon albo e-mail, żebyśmy mogli odpowiedzieć.",
    en: "Enter a phone number or email so we can reply.",
  },
  "quick.nameRequired": {
    pl: "Podaj imię — chcemy wiedzieć, do kogo dzwonimy.",
    en: "Enter your first name — we'd like to know who we're calling.",
  },
  "quick.emailInvalid": {
    pl: "Ten adres e-mail wygląda na niepełny.",
    en: "This email address looks incomplete.",
  },
  "quick.phoneInvalid": {
    pl: "Ten numer wygląda na niepełny. Sprawdź, czy ma 9 cyfr.",
    en: "This number looks incomplete. Check that it's a valid phone number.",
  },
  "quick.send": { pl: "Wyślij zapytanie", en: "Send inquiry" },
  "quick.sending": { pl: "Wysyłanie...", en: "Sending..." },
  "quick.sent": { pl: "Wysłano! Odezwiemy się wkrótce.", en: "Sent! We'll be in touch soon." },
  "quick.error": {
    pl: "Nie udało się wysłać. Spróbuj ponownie albo napisz: biuro@programo.pl.",
    en: "Sending failed. Try again or email us: biuro@programo.pl.",
  },

  // Quick contact — project type chips
  "quick.typeLabel": { pl: "Czego dotyczy projekt?", en: "What's the project about?" },
  "quick.type.web": { pl: "Aplikacja webowa", en: "Web application" },
  "quick.type.mobile": { pl: "Aplikacja mobilna", en: "Mobile app" },
  "quick.type.store": { pl: "Sklep internetowy", en: "Online store" },
  "quick.type.marketing": { pl: "Strona + reklamy", en: "Website + ads" },
  "quick.type.other": { pl: "Coś innego", en: "Something else" },

  "quick.message": { pl: "Wiadomość", en: "Message" },
  "quick.messagePlaceholder": {
    pl: "Napisz w dwóch zdaniach, co chcesz osiągnąć.",
    en: "Two sentences on what you want to achieve.",
  },
  "quick.optional": { pl: "(opcjonalnie)", en: "(optional)" },

  // Quick contact — trust microcopy + success next-step
  "quick.trust": {
    pl: "Odpowiadamy w 24 h · Konsultacja bez zobowiązań · Twoje dane są bezpieczne (RODO)",
    en: "We reply within 24 h · No-obligation consultation · Your data is safe (GDPR)",
  },
  "quick.successTitle": {
    pl: "Dziękujemy — odezwiemy się w 24 h.",
    en: "Thank you — we'll be in touch within 24 hours.",
  },
  "quick.successBody": {
    pl: "Twoje zapytanie dotarło. Jeśli sprawa jest pilna, zadzwoń: 509 123 434.",
    en: "Your inquiry has arrived. If it's urgent, call us: +48 509 123 434.",
  },
  "quick.successAgain": { pl: "Wyślij kolejną wiadomość", en: "Send another message" },

  // Quick contact — direct contact aside (email, founders, SLA)
  "quick.aside.emailLabel": { pl: "E-mail", en: "Email" },
  "quick.aside.wojciechName": { pl: "Wojciech Płonka", en: "Wojciech Płonka" },
  "quick.aside.bartoszName": { pl: "Bartosz Kolaj", en: "Bartosz Kolaj" },
  "quick.aside.location": { pl: "Poznań, Polska", en: "Poznan, Poland" },
  "quick.aside.sla": { pl: "Odpowiadamy w 24 h", en: "We reply within 24 hours" },

  // Contact form consent
  "quick.consentLabel": {
    pl: "Wyrażam zgodę na kontakt w sprawie mojego zapytania. Administratorem danych jest Programo s.c. Szczegóły w",
    en: "I consent to being contacted about my inquiry. Programo s.c. is the data controller. Details in the",
  },
  "quick.consentRequired": {
    pl: "Zaznacz zgodę na kontakt — bez niej nie możemy odpowiedzieć.",
    en: "Tick the contact consent — without it we can't reply.",
  },
  "quick.privacyLink": {
    pl: "polityce prywatności",
    en: "privacy policy",
  },

  // --- Contact Form (classic, currently unused — kept for the legacy field set) --
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

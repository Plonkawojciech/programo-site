"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export type Lang = "pl" | "en";

const translations = {
  // Navbar
  "nav.work": { pl: "Projekty", en: "Work" },
  "nav.about": { pl: "O nas", en: "About" },
  "nav.stack": { pl: "Technologie", en: "Stack" },
  "nav.contact": { pl: "Kontakt", en: "Contact" },
  "nav.offer": { pl: "Oferta", en: "Services" },
  "nav.websites": { pl: "Strony WWW", en: "Websites" },
  "nav.stores": { pl: "Sklepy", en: "Stores" },
  "nav.pricing": { pl: "Cennik", en: "Pricing" },
  "nav.cta": { pl: "Napisz do nas", en: "Get in touch" },

  // Main page intro section
  "main.intro.label": { pl: "Programo Studio", en: "Programo Studio" },
  "main.intro.headline": {
    pl: "Tworzymy software, który rozwiązuje realne problemy.",
    en: "We build software that solves real problems.",
  },
  "main.intro.subheadline": {
    pl: "Dwóch inżynierów z Poznania. Od pierwszej rozmowy po wdrożenie na produkcję bierzemy odpowiedzialność za całość — projekt, kod i uruchomienie. Bez pośredników.",
    en: "Two engineers from Poznań. From the first call to production launch, we own the whole thing — design, code and deployment. No middlemen.",
  },
  "main.values.title": { pl: "Co nas wyróżnia", en: "What sets us apart" },
  "main.values.problem.title": { pl: "Realny problem", en: "Real problem" },
  "main.values.problem.desc": {
    pl: "Nie budujemy demo. Budujemy narzędzia, które naprawdę pomagają firmom zarabiać i oszczędzać czas.",
    en: "We don't build demos. We build tools that actually help businesses earn and save time.",
  },
  "main.values.craft.title": { pl: "Pełne zaangażowanie", en: "Full ownership" },
  "main.values.craft.desc": {
    pl: "Bez warstw managementu. Architektura, design, kod i wdrożenie — wszystko z naszych rąk.",
    en: "No management layers. Architecture, design, code and deployment — all hands-on from us.",
  },
  "main.values.speed.title": { pl: "Szybkie wdrożenie", en: "Fast delivery" },
  "main.values.speed.desc": {
    pl: "Pracujemy szybko, ale bez kompromisów. Nowoczesny stack i sprawdzone wzorce.",
    en: "We move fast without cutting corners. Modern stack, battle-tested patterns.",
  },
  "main.cta.primary": { pl: "Porozmawiajmy o projekcie", en: "Let's talk about your project" },
  "main.cta.secondary": { pl: "Zobacz nasze projekty", en: "See our work" },
  "main.cta.offer": { pl: "Sprawdź ofertę", en: "Check our offer" },
  "main.cta.pricing": { pl: "Zobacz cennik", en: "See pricing" },

  // Trust / proof bar (homepage, under hero)
  "trust.eyebrow": { pl: "Co już zbudowaliśmy", en: "What we've already built" },
  "trust.stat1.value": { pl: "7", en: "7" },
  "trust.stat1.label": { pl: "Wdrożonych produktów", en: "Products shipped" },
  "trust.stat2.value": { pl: "100%", en: "100%" },
  "trust.stat2.label": { pl: "Własny kod, bez podwykonawców", en: "Own code, no subcontractors" },
  "trust.stat3.value": { pl: "do 24 h", en: "under 24 h" },
  "trust.stat3.label": { pl: "Czas pierwszej odpowiedzi", en: "First response time" },
  "trust.stat4.value": { pl: "PL · EN", en: "PL · EN" },
  "trust.stat4.label": { pl: "Dwujęzyczne wdrożenia", en: "Bilingual delivery" },

  // Sticky mobile CTA
  "sticky.cta": { pl: "Bezpłatna konsultacja", en: "Free consultation" },

  // Projects marquee (main page preview strip)
  "realizations.label": { pl: "Portfolio", en: "Portfolio" },
  "realizations.title": { pl: "Nasze realizacje", en: "Our work" },
  "realizations.subtitle": {
    pl: "Realne systemy, aplikacje i sklepy, które działają na produkcji. Kliknij, żeby zobaczyć szczegóły.",
    en: "Real systems, apps and stores running in production. Click to see the details.",
  },
  "realizations.viewAll": { pl: "Zobacz wszystkie projekty", en: "See all projects" },

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

  // Offer page
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

  // Pricing page
  "pricing.label": { pl: "Cennik", en: "Pricing" },
  "pricing.title": { pl: "Przejrzysty model rozliczeń", en: "Transparent pricing" },
  "pricing.desc": {
    pl: "Każdy projekt jest inny — wycenę przygotujemy po krótkiej rozmowie. Poniżej orientacyjne zakresy.",
    en: "Every project is different — we'll prepare a quote after a short call. Below are ballpark ranges.",
  },
  "pricing.starter.name": { pl: "Starter", en: "Starter" },
  "pricing.starter.price": { pl: "od 6 000 zł", en: "from €1,400" },
  "pricing.starter.desc": {
    pl: "Landing page lub prosta strona firmowa. Idealne na start.",
    en: "Landing page or simple company site. Perfect to start.",
  },
  "pricing.starter.f1": { pl: "Projekt graficzny", en: "Custom design" },
  "pricing.starter.f2": { pl: "Do 5 podstron", en: "Up to 5 pages" },
  "pricing.starter.f3": { pl: "Formularz kontaktowy", en: "Contact form" },
  "pricing.starter.f4": { pl: "SEO i analytics", en: "SEO & analytics" },
  "pricing.business.name": { pl: "Business", en: "Business" },
  "pricing.business.price": { pl: "od 15 000 zł", en: "from €3,500" },
  "pricing.business.desc": {
    pl: "Rozbudowana strona firmowa, e-commerce lub portal z panelem klienta.",
    en: "Advanced company site, e-commerce or portal with client area.",
  },
  "pricing.business.f1": { pl: "Wszystko ze Startera", en: "Everything in Starter" },
  "pricing.business.f2": { pl: "Panel administracyjny / CMS", en: "Admin panel / CMS" },
  "pricing.business.f3": { pl: "Integracje (płatności, CRM)", en: "Integrations (payments, CRM)" },
  "pricing.business.f4": { pl: "Wielojęzyczność", en: "Multilingual" },
  "pricing.saas.name": { pl: "SaaS / Aplikacja", en: "SaaS / Application" },
  "pricing.saas.price": { pl: "wycena indywidualna", en: "custom quote" },
  "pricing.saas.desc": {
    pl: "Pełna aplikacja webowa lub mobilna. Skala dopasowana do Twojego biznesu.",
    en: "Full web or mobile application. Scale matched to your business.",
  },
  "pricing.saas.f1": { pl: "Architektura systemu", en: "System architecture" },
  "pricing.saas.f2": { pl: "Backend + frontend", en: "Backend + frontend" },
  "pricing.saas.f3": { pl: "Autoryzacja, role, płatności", en: "Auth, roles, payments" },
  "pricing.saas.f4": { pl: "Wsparcie po wdrożeniu", en: "Post-launch support" },
  "pricing.cta": { pl: "Porozmawiajmy o wycenie", en: "Let's discuss pricing" },

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
  "footer.privacy": { pl: "Polityka prywatno\u015bci", en: "Privacy policy" },
  "footer.cookies": { pl: "Ustawienia cookies", en: "Cookie settings" },

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

  // Cookie banner / consent
  "cookie.title": { pl: "Cookies & prywatność", en: "Cookies & privacy" },
  "cookie.desc": {
    pl: "Używamy plików cookies, aby ulepszać stronę i analizować ruch. Możesz zaakceptować wszystkie, odrzucić nieobowiązkowe lub dostosować preferencje.",
    en: "We use cookies to improve the site and analyze traffic. You can accept all, reject non-essential ones, or customize your preferences.",
  },
  "cookie.privacyLink": { pl: "Polityka prywatności", en: "Privacy policy" },
  "cookie.acceptAll": { pl: "Akceptuj wszystkie", en: "Accept all" },
  "cookie.rejectAll": { pl: "Tylko niezbędne", en: "Reject all" },
  "cookie.customize": { pl: "Dostosuj", en: "Customize" },
  "cookie.savePrefs": { pl: "Zapisz wybór", en: "Save preferences" },
  "cookie.settingsTitle": { pl: "Preferencje cookies", en: "Cookie preferences" },
  "cookie.settingsDesc": {
    pl: "Wybierz, które kategorie chcesz włączyć. Niezbędne pliki cookies są zawsze aktywne, ponieważ strona bez nich nie działa.",
    en: "Choose which categories to enable. Necessary cookies are always on because the site cannot function without them.",
  },
  "cookie.necessaryTitle": { pl: "Niezbędne", en: "Necessary" },
  "cookie.necessaryDesc": {
    pl: "Wymagane do działania strony — preferencje motywu, języka, sesja. Bez nich strona nie działa.",
    en: "Required for the site to work — theme, language, session. Cannot be disabled.",
  },
  "cookie.analyticsTitle": { pl: "Analityka", en: "Analytics" },
  "cookie.analyticsDesc": {
    pl: "Google Analytics 4 — pomaga nam rozumieć, jak korzystasz ze strony. Dane zanonimizowane.",
    en: "Google Analytics 4 — helps us understand how the site is used. Data is anonymized.",
  },
  "cookie.marketingTitle": { pl: "Marketing", en: "Marketing" },
  "cookie.marketingDesc": {
    pl: "Pliki cookies używane przez Meta Ads / Google Ads do personalizacji reklam i pomiaru konwersji.",
    en: "Cookies used by Meta Ads / Google Ads for personalized advertising and conversion measurement.",
  },

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

  // Privacy policy page
  "privacy.title": { pl: "Polityka prywatności", en: "Privacy policy" },
  "privacy.updated": { pl: "Ostatnia aktualizacja", en: "Last updated" },
  "privacy.backHome": { pl: "\u2190 Wr\u00f3\u0107 na stron\u0119 g\u0142\u00f3wn\u0105", en: "\u2190 Back to homepage" },
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

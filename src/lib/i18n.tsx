"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export type Lang = "pl" | "en";

const translations = {
  // Navbar
  "nav.work": { pl: "Projekty", en: "Work" },
  "nav.about": { pl: "O nas", en: "About" },
  "nav.cta": { pl: "Napisz do nas", en: "Get in touch" },

  // Main page intro section
  "main.cta.primary": { pl: "Porozmawiajmy o projekcie", en: "Let's talk about your project" },

  // Sticky mobile CTA
  "sticky.cta": { pl: "Bezpłatna konsultacja", en: "Free consultation" },

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
  "hero.desc": {
    pl: "Projektujemy i budujemy oprogramowanie, kt\u00f3re rozwi\u0105zuje realne problemy. Od koncepcji po wdro\u017cenie, z dba\u0142o\u015bci\u0105 o ka\u017cdy detal.",
    en: "We design and build software products that solve real problems. From concept to launch, with craft and precision.",
  },

  // Featured Work
  "work.comingSoon": { pl: "Wkr\u00f3tce", en: "Coming Soon" },
  "work.inDevelopment": { pl: "W realizacji", en: "In Development" },
  "work.live": { pl: "Na żywo", en: "Live" },

  // About
  "about.title1": { pl: "Dw\u00f3ch builder\u00f3w,", en: "Two builders," },
  "about.title2": { pl: "jedno studio.", en: "one studio." },
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

  // Footer
  "footer.location": { pl: "Pozna\u0144, Polska", en: "Pozna\u0144, Poland" },
  "footer.privacy": { pl: "Polityka prywatno\u015bci", en: "Privacy policy" },
  "footer.cookies": { pl: "Ustawienia cookies", en: "Cookie settings" },

  // 404
  "notFound.title": { pl: "Nie znaleziono strony", en: "Page not found" },
  "notFound.desc": { pl: "Strona, kt\u00f3rej szukasz, nie istnieje.", en: "The page you are looking for does not exist." },
  "notFound.back": { pl: "Wr\u00f3\u0107 na stron\u0119 g\u0142\u00f3wn\u0105", en: "Back to homepage" },

  // Accessibility
  "a11y.langToggle": { pl: "Zmie\u0144 j\u0119zyk", en: "Change language" },
  "a11y.mainNav": { pl: "Nawigacja g\u0142\u00f3wna", en: "Main navigation" },

  // Project Detail Page
  "project.statusLive": { pl: "Na \u017cywo", en: "Live" },
  "project.statusDev": { pl: "W realizacji", en: "In Development" },
  "project.statusPlanned": { pl: "Planowany", en: "Planned" },

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

  // Privacy policy page
  "privacy.title": { pl: "Polityka prywatności", en: "Privacy policy" },
  "privacy.updated": { pl: "Ostatnia aktualizacja", en: "Last updated" },
  "privacy.backHome": { pl: "\u2190 Wr\u00f3\u0107 na stron\u0119 g\u0142\u00f3wn\u0105", en: "\u2190 Back to homepage" },

  // Navbar: services menu
  "nav.services": { pl: "Usługi", en: "Services" },
  "nav.realizations": { pl: "Realizacje", en: "Work" },
  "nav.process": { pl: "Jak pracujemy", en: "How we work" },
  "nav.quote": { pl: "Wycena", en: "Pricing" },
  "nav.svc.offer": { pl: "Cała oferta", en: "All services" },
  "nav.svc.offer.desc": { pl: "Strony, aplikacje, systemy i AI", en: "Sites, apps, systems and AI" },
  "nav.svc.shops": { pl: "Sklepy internetowe", en: "Online stores" },
  "nav.svc.shops.desc": { pl: "E-commerce gotowy na sprzedaż", en: "E-commerce built to sell" },
  "nav.svc.cost": { pl: "Ile kosztuje aplikacja", en: "What an app costs" },
  "nav.svc.cost.desc": { pl: "Orientacyjne koszty i zakres", en: "Ballpark cost and scope" },
  "nav.svc.audit": { pl: "Audyt strony", en: "Website audit" },
  "nav.svc.audit.desc": { pl: "Sprawdzimy, co blokuje konwersję", en: "We'll find what blocks conversion" },
  "nav.svc.house": { pl: "Software house Poznań", en: "Software house Poznań" },
  "nav.svc.house.desc": { pl: "Kim jesteśmy i jak działamy", en: "Who we are and how we work" },
  "nav.cta.project": { pl: "Opowiedz o projekcie", en: "Tell us about your project" },

  // Home: hero
  "home.hero.ctaSecondary": { pl: "Zobacz realizacje", en: "See our work" },
  "home.hero.shotAlt": { pl: "WSafeFinanse — strona firmowa zbudowana przez Programo", en: "WSafeFinanse — a corporate site built by Programo" },
  "home.hero.shotCaption": {
    pl: "WSafeFinanse — strona z lejkiem leadów (e-mail + Telegram)",
    en: "WSafeFinanse — a site with a lead funnel (email + Telegram)",
  },
  "home.hero.headline.v2": {
    pl: "Budujemy narzędzia, które pracują na Twoją firmę",
    en: "We build tools that work for your business",
  },
  "home.hero.desc.v2": {
    pl: "Strony, sklepy, systemy i automatyzacje AI — od rozmowy po wdrożenie. Dwóch inżynierów z Poznania, bez pośredników.",
    en: "Websites, stores, systems and AI automation — from conversation to deployment. Two engineers from Poznan, no middlemen.",
  },
  "home.hero.phoneLabel": {
    pl: "Twój numer telefonu",
    en: "Your phone number",
  },
  "home.hero.phonePlaceholder": {
    pl: "+48 600 000 000",
    en: "+48 600 000 000",
  },
  "home.hero.phoneCta": {
    pl: "Oddzwonimy",
    en: "We'll call back",
  },
  "home.hero.phoneReassurance": {
    pl: "Oddzwaniamy w ciągu 24 h. Bez zobowiązań.",
    en: "We call back within 24 h. No obligation.",
  },
  "home.hero.phoneSending": {
    pl: "Wysyłanie...",
    en: "Sending...",
  },
  "home.hero.phoneSuccess": {
    pl: "Gotowe — oddzwonimy najszybciej jak się da.",
    en: "Done — we'll call back as soon as we can.",
  },
  "home.hero.phoneErrorEmpty": {
    pl: "Wpisz numer telefonu.",
    en: "Enter your phone number.",
  },
  "home.hero.phoneErrorInvalid": {
    pl: "Wpisz poprawny numer telefonu (minimum 9 cyfr).",
    en: "Enter a valid phone number (at least 9 digits).",
  },
  "home.hero.phoneErrorNetwork": {
    pl: "Nie udało się wysłać. Spróbuj ponownie za chwilę.",
    en: "Couldn't send. Please try again in a moment.",
  },
  "home.hero.phoneConsentNote": {
    pl: "Wysyłając numer, wyrażasz zgodę na kontakt telefoniczny.",
    en: "By sending your number, you consent to being contacted by phone.",
  },

  // Home: work
  "home.work.problem": { pl: "Problem", en: "Problem" },
  "home.work.solution": { pl: "Co zbudowaliśmy", en: "What we built" },
  "home.work.effect": { pl: "Efekt", en: "Outcome" },
  "home.work.cta": { pl: "Zobacz case study", en: "See case study" },
  "home.work.viewAll": { pl: "Zobacz wszystkie realizacje", en: "See all work" },
  "home.work.wsafefinanse.category": { pl: "Strona firmowa · Finanse", en: "Corporate site · Finance" },
  "home.work.wsafefinanse.problem": {
    pl: "Doradca finansowy potrzebował strony, która buduje zaufanie i zamienia ruch w realne zapytania, a nie tylko wygląda.",
    en: "A financial advisor needed a site that builds trust and turns traffic into real inquiries — not just one that looks good.",
  },
  "home.work.wsafefinanse.solution": {
    pl: "Dwujęzyczna strona (PL/EN) z formularzem, który wysyła zapytanie na e-mail i powiadomienie na Telegram. Walidacja i ochrona przed spamem po stronie serwera.",
    en: "A bilingual site (PL/EN) with a form that sends inquiries to email plus a Telegram push. Server-side validation and spam protection.",
  },
  "home.work.wsafefinanse.effect": {
    pl: "Każdy lead trafia dwoma kanałami naraz — właściciel reaguje w kilka minut, bez sprawdzania skrzynki.",
    en: "Every lead arrives through two channels at once — the owner reacts within minutes, without checking an inbox.",
  },
  "home.work.jedmar.category": { pl: "Sklep internetowy · Narzędzia B2B", en: "Online store · B2B tools" },
  "home.work.jedmar.problem": {
    pl: "Centrum narzędziowe z ogromnym katalogiem potrzebowało szybkiego, nowoczesnego sklepu — bez przebudowy całego backendu.",
    en: "A tool center with a huge catalog needed a fast, modern store — without rebuilding the whole backend.",
  },
  "home.work.jedmar.solution": {
    pl: "Nowy frontend Next.js na istniejącym PrestaShopie: katalog z filtrami, koszyk, checkout i konto klienta. Zamówienia wracają do starego panelu.",
    en: "A new Next.js frontend on the existing PrestaShop: filtered catalog, cart, checkout and customer accounts. Orders flow back into the old panel.",
  },
  "home.work.jedmar.effect": {
    pl: "1460 produktów i 190 kategorii renderowanych statycznie pod SEO — bez migracji danych i bez ryzyka dla działającego sklepu.",
    en: "1,460 products and 190 categories rendered statically for SEO — with no data migration and no risk to the live store.",
  },
  "home.products.viewAll": { pl: "Zobacz wszystkie projekty", en: "See all projects" },
  "home.work.title.v2": { pl: "Wybrane wdrożenia", en: "Selected work" },
  "home.work.subtitle.v2": {
    pl: "Realne projekty, które działają na produkcji. Nie demo, nie koncepty — poniżej trzy z nich.",
    en: "Real projects running in production. Not demos, not concepts — three of them below.",
  },
  "home.work.wks.category": { pl: "Strona sportowa · Klub", en: "Sports site · Club" },
  "home.work.wks.problem": {
    pl: "Klub sportowy z trzema sekcjami potrzebował strony, na której rodzice szybko znajdą harmonogram treningów, trenerów i kontakt.",
    en: "A sports club with three sections needed a site where parents quickly find the training schedule, coaches and contact info.",
  },
  "home.work.wks.solution": {
    pl: "7 responsywnych podstron: profile trenerów, galeria, harmonogram, informacje o dotacjach i formularz kontaktowy. Statyczne HTML/CSS/JS, hosting Vercel.",
    en: "7 responsive pages: trainer profiles, gallery, schedule, grant info and a contact form. Static HTML/CSS/JS, Vercel hosting.",
  },
  "home.work.wks.effect": {
    pl: "Rodzic sprawdza wszystko z telefonu pod halą — zero CMS-a do utrzymania, zero kosztów hostingu.",
    en: "Parents check everything on their phone outside the gym — zero CMS to maintain, zero hosting costs.",
  },
  "home.work.wsafefinanse.imgAlt": {
    pl: "Strona WSafeFinanse — widok strony głównej",
    en: "WSafeFinanse website — homepage view",
  },
  "home.work.jedmar.imgAlt": {
    pl: "Sklep Jedmar — widok strony głównej",
    en: "Jedmar store — homepage view",
  },
  "home.work.wks.imgAlt": {
    pl: "Strona WKS Poznań — widok strony głównej",
    en: "WKS Poznań website — homepage view",
  },
  "home.products.title.v2": { pl: "Budujemy też dla siebie", en: "We build for ourselves too" },
  "home.products.subtitle.v2": {
    pl: "Własne systemy, które projektujemy, utrzymujemy i rozwijamy. Najlepszy dowód, że potrafimy zaprojektować i dowieźć produkt od zera.",
    en: "Our own systems that we design, maintain and grow. The best proof we can design and ship a product from scratch.",
  },
  "home.products.estalo.desc": {
    pl: "CRM dla polskich biur nieruchomości z AI matchmakingiem, integracją portali i aplikacją mobilną.",
    en: "CRM for Polish real estate agencies with AI matchmaking, portal integrations and a mobile app.",
  },
  "home.products.athlix.desc": {
    pl: "Ekosystem 3 aplikacji sportowych: trening, społeczność i analityka regeneracji z Bluetooth HRV.",
    en: "An ecosystem of 3 sport apps: training, community and recovery analytics with Bluetooth HRV.",
  },
  "home.products.solvio.desc": {
    pl: "Śledzenie wydatków przez AI: skan paragonu, grupy kosztów, porównanie cen. Web + iOS.",
    en: "AI expense tracking: receipt scan, cost groups, price comparison. Web + iOS.",
  },
  "home.products.rejestr.desc": {
    pl: "Wyszukiwarka firm z KRS — profile spółek, powiązania osób, sprawozdania finansowe. Web + iOS.",
    en: "Company registry search — company profiles, people connections, financial filings. Web + iOS.",
  },

  // Home: process
  "home.process.1.title": { pl: "Rozmowa i diagnoza", en: "Call & diagnosis" },
  "home.process.2.title": { pl: "Plan i wycena", en: "Plan & estimate" },
  "home.process.3.title": { pl: "Projekt i development", en: "Design & development" },
  "home.process.4.title": { pl: "Wdrożenie i wsparcie", en: "Launch & support" },
  "home.process.title.v2": { pl: "Co się stanie, jak zadzwonisz", en: "What happens when you call" },
  "home.process.1.desc.v2": {
    pl: "Rozmawiasz wprost z ludźmi, którzy zaprojektują i napiszą kod — bez handlowca, bez przekazywania. Słuchamy, co dziś nie działa i co ma się zmienić.",
    en: "You talk directly to the people who will design and write the code — no salesperson, no handoffs. We listen to what isn't working and what should change.",
  },
  "home.process.2.desc.v2": {
    pl: "Zanim cokolwiek ruszymy, dostajesz zakres, kolejne kroki i widełki kosztów. Bez niespodzianek na fakturze.",
    en: "Before we move on anything, you get the scope, next steps and a cost range. No surprises on the invoice.",
  },
  "home.process.3.desc.v2": {
    pl: "Projekt, kod i wdrożenie — wszystko w jednym miejscu. Pokazujemy postępy na bieżąco, bez znikania na tygodnie.",
    en: "Design, code and deployment — all in one place. We show progress as we go, no disappearing for weeks.",
  },
  "home.process.4.desc.v2": {
    pl: "Uruchamiamy na produkcji i zostajemy. Poprawki, rozwój i wsparcie techniczne — nie przekazujemy projektu dalej.",
    en: "We launch to production and stay. Fixes, further development and technical support — we don't hand your project off.",
  },
  "home.process.terms.label": { pl: "Na co możesz liczyć", en: "What you can count on" },
  "home.process.terms.1": { pl: "Bez pośredników — pracujesz z budującymi", en: "No middlemen — you work with the builders" },
  "home.process.terms.2": { pl: "Widełki kosztów przed startem", en: "Cost estimate before we start" },
  "home.process.terms.3": { pl: "Odpowiedź do 24 godzin", en: "Reply within 24 hours" },
  "home.process.terms.4": { pl: "Projekt, kod i wdrożenie w jednym miejscu", en: "Design, code and deployment in one place" },

  // Home: founders & contact
  "home.team.wojtek.name": { pl: "Wojciech Płonka", en: "Wojciech Płonka" },
  "home.team.wojtek.desc": {
    pl: "Projektuje architekturę i pisze kod. Odpowiada za to, żeby produkt działał szybko, stabilnie i dawał się rozwijać.",
    en: "Designs the architecture and writes the code. Makes sure the product is fast, stable and easy to grow.",
  },
  "home.team.bartek.name": { pl: "Bartosz Kołaj", en: "Bartosz Kołaj" },
  "home.team.bartek.desc": {
    pl: "Tłumaczy cele biznesowe na zakres projektu i prowadzi kontakt. Pilnuje, żeby wdrożenie realnie pomagało firmie.",
    en: "Translates business goals into project scope and owns the contact. Makes sure the build genuinely helps the business.",
  },
  "founders.title": { pl: "Dwie osoby, cała odpowiedzialność", en: "Two people, full accountability" },
  "founders.subtitle": {
    pl: "Programo to Wojciech i Bartosz. Projekt nie przechodzi między działami — od pierwszej rozmowy po utrzymanie pracujesz z tymi samymi ludźmi.",
    en: "Programo is Wojciech and Bartosz. Your project doesn't pass between departments — from the first call to maintenance you work with the same people.",
  },
  "founders.wojtek.focus": { pl: "Architektura, kod, wdrożenie", en: "Architecture, code, deployment" },
  "founders.bartek.focus": { pl: "Strategia, komunikacja, biznes", en: "Strategy, communication, business" },
  "founders.location": { pl: "Poznań, Polska", en: "Poznań, Poland" },
  "qc.title": { pl: "Zostaw numer, oddzwonimy.", en: "Leave your number, we'll call back." },
  "qc.subtitle": {
    pl: "Bez formularzy na pół strony. Numer telefonu wystarczy — resztę ustalimy w rozmowie.",
    en: "No half-page forms. A phone number is enough — we'll sort out the rest on a call.",
  },
  "qc.phoneLabel": { pl: "Twój numer telefonu", en: "Your phone number" },
  "qc.phonePlaceholder": { pl: "+48 600 000 000", en: "+48 600 000 000" },
  "qc.nameLabel": { pl: "Imię (opcjonalnie)", en: "Name (optional)" },
  "qc.namePlaceholder": { pl: "Jan", en: "Jan" },
  "qc.contextLabel": { pl: "O czym chcesz porozmawiać? (opcjonalnie)", en: "What do you want to talk about? (optional)" },
  "qc.contextPlaceholder": { pl: "np. sklep internetowy, aplikacja, strona...", en: "e.g. online store, app, website..." },
  "qc.send": { pl: "Poproś o kontakt", en: "Request a call" },
  "qc.sending": { pl: "Wysyłanie...", en: "Sending..." },
  "qc.consentLabel": {
    pl: "Wyrażam zgodę na przetwarzanie danych osobowych w celu kontaktu zwrotnego. Szczegóły w",
    en: "I consent to processing my personal data for the purpose of getting back to me. Details in the",
  },
  "qc.consentRequired": { pl: "Zgoda jest wymagana, żebyśmy mogli oddzwonić.", en: "Consent is required so we can call you back." },
  "qc.privacyLink": { pl: "polityce prywatności", en: "privacy policy" },
  "qc.trust": {
    pl: "Oddzwaniamy w ciągu 24 h. Bez zobowiązań.",
    en: "We call back within 24 h. No strings attached.",
  },
  "qc.successTitle": { pl: "Dziękujemy — mamy Twój numer.", en: "Thanks — we have your number." },
  "qc.successBody": {
    pl: "Odezwiemy się w ciągu 24 godzin (zwykle szybciej). Jeśli sprawa jest pilna, zadzwoń do nas bezpośrednio.",
    en: "We'll reach out within 24 hours (usually sooner). If it's urgent, call us directly.",
  },
  "qc.successAgain": { pl: "Wyślij kolejne zapytanie", en: "Send another inquiry" },
  "qc.error": { pl: "Coś poszło nie tak. Spróbuj ponownie lub zadzwoń.", en: "Something went wrong. Try again or give us a call." },
  "qc.orCall": { pl: "Wolisz zadzwonić?", en: "Prefer to call?" },
  "qc.orEmail": { pl: "lub napisz", en: "or write" },

  // Home: services & FAQ
  "home.svc.title": { pl: "Z czym przychodzą do nas firmy", en: "What companies come to us with" },
  "home.svc.block1.situation": { pl: "Strona nie przynosi zapytań", en: "Your website brings no inquiries" },
  "home.svc.block1.body": {
    pl: "Masz stronę, ale telefon milczy. Wygląda przeciętnie, ładuje się wolno i nie prowadzi klienta do kontaktu. Budujemy strony i sklepy, które zarabiają — szybkie, czytelne i zaprojektowane tak, żeby odwiedzający zostawił numer.",
    en: "You have a site, but the phone stays silent. It looks average, loads slowly and never guides visitors to get in touch. We build websites and stores that earn — fast, clear and designed so visitors leave their number.",
  },
  "home.svc.block1.label": { pl: "Strony, landing page, sklepy internetowe", en: "Websites, landing pages, online stores" },
  "home.svc.block1.link": { pl: "Sprawdź ofertę stron i sklepów", en: "See our website & store offer" },
  "home.svc.block2.situation": { pl: "Excele i ręczna robota zżerają czas", en: "Spreadsheets and manual work eat your time" },
  "home.svc.block2.body": {
    pl: "Zespół przepisuje dane między arkuszami, mailami i systemami. Powtarzalne zadania da się zautomatyzować — zamiast walki z Excelem budujemy panel, system albo automatyzację, które robią to za Ciebie.",
    en: "Your team retypes data between spreadsheets, emails and systems. Repetitive work can be automated — instead of fighting Excel we build a panel, system or automation that does it for you.",
  },
  "home.svc.block2.label": { pl: "Systemy, aplikacje SaaS, automatyzacje i AI", en: "Systems, SaaS apps, automation & AI" },
  "home.svc.block2.link": { pl: "Więcej o systemach i automatyzacji", en: "More on systems & automation" },
  "home.svc.block3.situation": { pl: "Masz pomysł na produkt do sprawdzenia", en: "You have a product idea to validate" },
  "home.svc.block3.body": {
    pl: "Chcesz uruchomić aplikację, ale potrzebujesz partnera, który zaprojektuje i zbuduje pierwszą działającą wersję — bez przepalania budżetu na pełny system. Zaczynamy od MVP: prawdziwych użytkowników, nie slajdów.",
    en: "You want to launch an app but need a partner to design and build the first working version — without burning the budget on a full system. We start with an MVP: real users, not slides.",
  },
  "home.svc.block3.label": { pl: "Aplikacje webowe, mobilne, MVP", en: "Web apps, mobile apps, MVP" },
  "home.svc.block3.link": { pl: "Dowiedz się więcej o MVP", en: "Learn more about MVP" },
  "home.svc.pricing": { pl: "Widełki cenowe i model rozliczeń", en: "Price ranges & billing model" },
  "home.faq.r.title": { pl: "Zanim zadzwonisz", en: "Before you call" },
  "home.faq.r.q1": { pl: "Ile kosztuje projekt?", en: "How much does a project cost?" },
  "home.faq.r.a1": {
    pl: "Każdy projekt wyceniamy indywidualnie po krótkiej rozmowie. Orientacyjne widełki dostajesz, zanim cokolwiek zaczniemy — bez ukrytych kosztów.",
    en: "We price every project individually after a short call. You get a ballpark range before we start anything — with no hidden costs.",
  },
  "home.faq.r.q2": { pl: "Ile trwa realizacja?", en: "How long does it take?" },
  "home.faq.r.a2": {
    pl: "Zależy od zakresu. Prosta strona to kwestia tygodni, rozbudowany system — dłużej. Realny harmonogram ustalamy na etapie planu.",
    en: "It depends on scope. A simple site takes weeks, a larger system longer. We set a realistic timeline at the planning stage.",
  },
  "home.faq.r.q3": { pl: "Co, jeśli mam tylko pomysł, bez specyfikacji?", en: "What if I only have an idea, no spec?" },
  "home.faq.r.a3": {
    pl: "To częsty punkt startu. Pomagamy doprecyzować zakres i zaprojektować pierwszą działającą wersję, zamiast czekać na gotowy dokument.",
    en: "That's a common starting point. We help refine the scope and design the first working version, instead of waiting for a finished document.",
  },
  "home.faq.r.q4": { pl: "Czyją własnością jest kod?", en: "Who owns the code?" },
  "home.faq.r.a4": {
    pl: "Twoją. Po wdrożeniu przekazujemy kod i dostępy — nie zamykamy Cię w naszej technologii.",
    en: "You do. After launch we hand over the code and access — we don't lock you into our technology.",
  },
  "home.faq.r.q5": { pl: "Czy zajmujecie się utrzymaniem po wdrożeniu?", en: "Do you maintain the product after launch?" },
  "home.faq.r.a5": {
    pl: "Tak. Po starcie zostajemy do dyspozycji — poprawki, rozwój i wsparcie techniczne.",
    en: "Yes. After launch we stay available — fixes, further development and technical support.",
  },
  "home.faq.r.q6": { pl: "Od czego zacząć?", en: "How do we start?" },
  "home.faq.r.a6": {
    pl: "Od krótkiej wiadomości przez formularz albo telefonu. Opisz, co dziś nie działa — odezwiemy się do 24 godzin z kolejnym krokiem.",
    en: "With a short message via the form or a call. Describe what isn't working today — we'll reply within 24 hours with the next step.",
  },
  "home.faq.r.cta": { pl: "Napisz do nas", en: "Get in touch" },
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

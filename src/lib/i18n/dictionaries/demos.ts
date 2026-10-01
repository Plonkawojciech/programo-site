// Demo portfolio route: page copy, filters and cross-links.
export const demos = {
  "demos.hero.eyebrow": { pl: "Dema stron dla firm", en: "Website demos for companies" },
  "demos.hero.title": {
    pl: "Zanim cokolwiek podpiszesz, zobacz swoją nową stronę.",
    en: "See your new website before you sign anything.",
  },
  "demos.hero.lead": {
    pl: "Firmom, z którymi rozmawiamy, budujemy demo nowej strony za darmo: prawdziwe treści i zdjęcia z obecnej strony, kolory marki, wersja na telefon. Poniżej wszystkie dema, które zrobiliśmy do tej pory.",
    en: "For companies we speak with, we build a free demo of a new website using real copy and photos from the current site, brand colours and a mobile version. Below are all the demos we have made so far.",
  },
  "demos.hero.primaryCta": { pl: "Chcę demo swojej strony", en: "I want a demo of my website" },
  "demos.hero.secondaryCta": { pl: "Jak to działa", en: "How it works" },
  "demos.stats.online": { pl: "dema online", en: "demos online" },
  "demos.stats.free": { pl: "za demo", en: "per demo" },
  "demos.stats.pages": { pl: "podstrony w demie", en: "pages in a demo" },
  "demos.process.eyebrow": { pl: "Jak to działa", en: "How it works" },
  "demos.process.talk.label": { pl: "Rozmowa", en: "Conversation" },
  "demos.process.talk.title": { pl: "Kwadrans o Twojej firmie", en: "Fifteen minutes about your company" },
  "demos.process.talk.body": {
    pl: "Co sprzedajesz, do kogo, co ma robić strona. Resztę bierzemy z Twojej obecnej strony.",
    en: "What you sell, who it is for and what the website should do. We take the rest from your current website.",
  },
  "demos.process.demo.label": { pl: "Demo", en: "Demo" },
  "demos.process.demo.title": { pl: "Strona główna i 2–3 podstrony", en: "Homepage and 2–3 subpages" },
  "demos.process.demo.body": {
    pl: "Pod własnym adresem, do przeklikania na telefonie. Bez lorem ipsum i bez stockowych zdjęć.",
    en: "At its own address, ready to explore on a phone. No lorem ipsum and no stock photos.",
  },
  "demos.process.decision.label": { pl: "Decyzja", en: "Decision" },
  "demos.process.decision.title": {
    pl: "Podoba się: wdrażamy. Nie: nic nie płacisz",
    en: "Like it: we build it. If not: you pay nothing",
  },
  "demos.process.decision.body": {
    pl: "Demo zostaje online, dopóki podejmujesz decyzję. Wycena osobno, po rozmowie.",
    en: "The demo stays online while you decide. We price the project separately after a conversation.",
  },
  "demos.grid.title": { pl: "Wszystkie dema", en: "All demos" },
  "demos.grid.lead": {
    pl: "Każde demo to atrapa: formularze i koszyki nie działają. Treści, adresy i ceny pochodzą ze stron klientów.",
    en: "Each demo is a mock-up: forms and carts do not work. Copy, addresses and prices come from the clients' websites.",
  },
  "demos.section.title": { pl: "Dema stron dla firm", en: "Website demos" },
  "demos.section.lead": {
    pl: "Strony, które zbudowaliśmy dla konkretnych firm, zanim cokolwiek podpisały. Ich treści, ich zdjęcia, wersja na telefon. Każde demo działa i możesz je otworzyć.",
    en: "Sites we built for specific companies before they signed anything. Their copy, their photos, a mobile version. Every demo is live and one click away.",
  },
  "demos.section.leadConcept": {
    pl: "Projekty stron, które przygotowaliśmy dla firm z różnych branż, zanim cokolwiek podpisały. Prawdziwe treści i wersja na telefon, bez szablonów.",
    en: "Website designs we prepared for companies in different industries before they signed anything. Real copy and a mobile version, no templates.",
  },
  "demos.section.showAll": { pl: "Pokaż pozostałe ({count})", en: "Show the rest ({count})" },
  "demos.section.note": {
    pl: "Dema to projekty przygotowane w ramach oferty. Firmy na tej liście nie są naszymi klientami, a nazwy i znaki należą do ich właścicieli. Formularze i koszyki w demach są wyłączone.",
    en: "Demos are designs prepared as part of an offer. The companies listed are not our clients, and all names and marks belong to their owners. Forms and carts in the demos are switched off.",
  },
  "demos.section.noteConcept": {
    pl: "To projekty koncepcyjne przygotowane w ramach oferty, niewdrożone u tych firm. Dlatego pokazujemy branżę, a nie nazwę.",
    en: "These are concept designs prepared as part of an offer and not deployed for those companies, which is why we show the industry rather than the name.",
  },
  "demos.card.conceptAlt": { pl: "Projekt koncepcyjny strony: {name}", en: "Concept website design: {name}" },
  "demos.filter.all": { pl: "Wszystkie", en: "All" },
  "demos.filter.label": { pl: "Filtruj dema według branży", en: "Filter demos by industry" },
  "demos.card.open": { pl: "Otwórz demo", en: "Open demo" },
  "demos.card.screenshotAlt": { pl: "{name} - zrzut strony demonstracyjnej", en: "{name} - demo website screenshot" },
  "demos.form.projectType": { pl: "Demo nowej strony", en: "New website demo" },
  "demos.cta.eyebrow": { pl: "Twoja firma następna?", en: "Is your company next?" },
  "demos.cta.title": {
    pl: "Zostaw numer. Oddzwonimy w 24 h i umówimy demo.",
    en: "Leave your number. We will call back within 24 hours and arrange a demo.",
  },
  "demos.cta.lead": {
    pl: "Bez umowy, bez zaliczki. Demo jest nasze, decyzja Twoja.",
    en: "No contract and no deposit. We make the demo; the decision is yours.",
  },
} as const satisfies Record<string, { pl: string; en: string }>;

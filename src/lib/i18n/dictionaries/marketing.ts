// Consent / cookie banner copy (tracking & marketing domain).
export const marketing = {
  "cookie.title": { pl: "Cookies & prywatność", en: "Cookies & privacy" },
  "cookie.desc": {
    pl: "Używamy plików cookies, aby ulepszać stronę i analizować ruch. Możesz zaakceptować wszystkie, odrzucić nieobowiązkowe lub dostosować preferencje.",
    en: "We use cookies to improve the site and analyze traffic. You can accept all, reject non-essential ones, or customize your preferences.",
  },
  "cookie.descShort": {
    pl: "Używamy cookies do analizy ruchu i reklam.",
    en: "We use cookies for analytics and ads.",
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
} as const satisfies Record<string, { pl: string; en: string }>;

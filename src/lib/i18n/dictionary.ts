import { common } from "./dictionaries/common";
import { home } from "./dictionaries/home";
import { offer } from "./dictionaries/offer";
import { projects } from "./dictionaries/projects";
import { about } from "./dictionaries/about";
import { pricing } from "./dictionaries/pricing";
import { contact } from "./dictionaries/contact";
import { forms } from "./dictionaries/forms";
import { marketing } from "./dictionaries/marketing";

export type Lang = "pl" | "en";

// Single translation dictionary, merged from per-domain modules. Split out of
// index.tsx (which is "use client", for the I18nProvider/useI18n hook) so
// Server Components can read PL/EN copy directly — e.g. to build JSON-LD at
// render time — without pulling the client-only provider into the server
// bundle. index.tsx re-exports these two names for every existing call site.
//
// `as const` keeps the merged object's keys literal, so TranslationKey stays
// a strict union and a typo in `t("...")` fails at compile time. Keys must be
// unique across modules — a duplicate would silently shadow.
const translations = {
  ...common,
  ...home,
  ...offer,
  ...projects,
  ...about,
  ...pricing,
  ...contact,
  ...forms,
  ...marketing,
} as const;

export type TranslationKey = keyof typeof translations;
export { translations };

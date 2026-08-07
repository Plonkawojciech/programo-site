/**
 * Dane rejestrowe spółki - jedno źródło prawdy dla stopki, polityki
 * prywatności, grafu schema.org i strony programu poleceń.
 *
 * Źródło: odpis aktualny z rejestru przedsiębiorców KRS (API Ministerstwa
 * Sprawiedliwości, api-krs.ms.gov.pl, stan na 03.04.2026). Nic tu nie jest
 * przepisane z pamięci ani wywnioskowane.
 *
 * Te liczby trafiają na fakturę, do umowy i do klauzuli administratora danych.
 * Jeżeli rozjadą się między stopką a RODO, to jest to błąd formalny, a nie
 * literówka - dlatego siedzą w jednym miejscu, a nie w czterech plikach.
 */
export const COMPANY = {
  /** Pełna firma spółki, dokładnie jak w KRS. */
  legalName: "Bartosz Kolaj Wojciech Roch Płonka Programo spółka jawna",
  /** Skrót używany w interfejsie tam, gdzie pełna firma nie ma szans się zmieścić. */
  shortName: "Programo s.j.",
  krs: "0001233841",
  nip: "7792604466",
  regon: "544443058",
  street: "ul. Podkomorska 14/1",
  postalCode: "60-326",
  city: "Poznań",
  /**
   * Kraj po polsku, bo `COMPANY_ADDRESS_LINE` jest linią polskiego adresu
   * pocztowego. Angielskie zdania składają adres z pojedynczych pól i dopisują
   * „Poland" same - inaczej w akapicie po angielsku wylądowałoby „Polska".
   * Kod ISO dla schema.org siedzi osobno w `organization.ts`.
   */
  country: "Polska",
  /** Data wpisu do rejestru przedsiębiorców, format ISO dla schema.org. */
  foundingDate: "2026-04-02",
} as const;

/** „ul. Podkomorska 14/1, 60-326 Poznań, Polska" - do zdań w prozie i do stopki. */
export const COMPANY_ADDRESS_LINE = `${COMPANY.street}, ${COMPANY.postalCode} ${COMPANY.city}, ${COMPANY.country}`;

/** „KRS 0001233841 · NIP 7792604466 · REGON 544443058" */
export const COMPANY_IDS_LINE = `KRS ${COMPANY.krs} · NIP ${COMPANY.nip} · REGON ${COMPANY.regon}`;

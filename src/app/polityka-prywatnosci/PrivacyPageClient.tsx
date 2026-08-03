"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useConsent } from "@/lib/consent";

export default function PrivacyPageClient() {
  const { lang, t } = useI18n();
  const { openSettings } = useConsent();

  return (
    <article className="relative bg-surface text-on-surface py-32 md:py-44">
      <div className="mx-auto max-w-3xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/"
            className="inline-flex items-center text-xs uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors"
          >
            {t("privacy.backHome")}
          </Link>

          <h1 className="mt-10 font-headline text-4xl md:text-6xl font-bold tracking-tighter text-on-surface">
            {t("privacy.title")}
          </h1>
          <p className="mt-3 text-xs uppercase tracking-widest text-on-surface-variant">
            {t("privacy.updated")}: 2026-08
          </p>

          {lang === "pl" ? <PolishContent openSettings={openSettings} /> : <EnglishContent openSettings={openSettings} />}
        </motion.div>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-headline text-2xl md:text-3xl font-semibold tracking-tight text-on-surface">{title}</h2>
      <div className="mt-4 flex flex-col gap-4 text-sm md:text-base font-light leading-relaxed text-on-surface-variant">
        {children}
      </div>
    </section>
  );
}

function PolishContent({ openSettings }: { openSettings: () => void }) {
  return (
    <div className="mt-10">
      <p className="text-sm md:text-base font-light leading-relaxed text-on-surface-variant">
        Niniejszy dokument opisuje, w jaki sposób Programo Studio (dalej „Programo”, „my”) przetwarza dane osobowe użytkowników odwiedzających stronę programo.pl oraz kontaktujących się przez formularz lub adres e-mail.
      </p>

      <Section title="1. Administrator danych">
        <p>
          Administratorem danych osobowych jest Programo s.j. z siedzibą w Poznaniu, prowadzona przez Wojciecha Płonkę oraz Bartosza Kolaja. Kontakt: <a className="text-primary hover:underline" href="mailto:biuro@programo.pl">biuro@programo.pl</a>.
        </p>
      </Section>

      <Section title="2. Jakie dane zbieramy">
        <p>
          <strong>Formularz kontaktowy:</strong> imię, e-mail, opcjonalnie telefon, treść wiadomości oraz znacznik czasu zaakceptowanej zgody.
        </p>
        <p>
          <strong>Cookies i analityka:</strong> identyfikatory urządzenia, język, motyw, anonimowe dane o ruchu na stronie (po wyrażeniu zgody).
        </p>
        <p>
          Podanie danych jest dobrowolne, ale bez adresu e-mail lub numeru telefonu nie mamy jak odpowiedzieć na zapytanie.
        </p>
      </Section>

      <Section title="3. Cele i podstawa prawna">
        <ul className="list-disc pl-5 flex flex-col gap-2">
          <li>Odpowiedź na zapytanie z formularza - art. 6 ust. 1 lit. a RODO (zgoda) oraz lit. b (działania przed zawarciem umowy).</li>
          <li>Analiza ruchu i poprawa strony - art. 6 ust. 1 lit. a RODO (zgoda na cookies analityczne).</li>
          <li>Marketing własny i remarketing - art. 6 ust. 1 lit. a RODO (zgoda na cookies marketingowe).</li>
        </ul>
        <p>
          Nie podejmujemy wobec Ciebie decyzji opartych wyłącznie na zautomatyzowanym przetwarzaniu, które miałyby skutki prawne. Po zgodzie na cookies marketingowe Google Ads może pokazywać Ci nasze reklamy na podstawie wcześniejszej wizyty na stronie (remarketing) - to profilowanie w celach marketingowych i wyłączysz je, wycofując zgodę.
        </p>
      </Section>

      <Section title="4. Czas przechowywania">
        <p>
          Wiadomości z formularza kontaktowego przechowujemy maksymalnie 24 miesiące od ostatniej korespondencji, chyba że ich dłuższe zachowanie wynika z konieczności realizacji umowy lub obowiązków księgowych.
        </p>
      </Section>

      <Section title="5. Odbiorcy danych">
        <p>Korzystamy z zaufanych dostawców:</p>
        <ul className="list-disc pl-5 flex flex-col gap-2">
          <li><strong>Vercel</strong> - hosting strony i logi serwera.</li>
          <li><strong>Resend</strong> - dostarczenie wiadomości z formularza na naszą skrzynkę.</li>
          <li><strong>Telegram</strong> - powiadomienie o nowym zapytaniu na nasz wewnętrzny kanał.</li>
          <li><strong>Google Analytics 4</strong> - statystyki ruchu (tylko po zgodzie na cookies analityczne).</li>
          <li><strong>Microsoft Clarity</strong> - analiza zachowania na stronie: ruchy kursora, kliknięcia, przewijanie oraz nagrania sesji, czyli odtworzenie Twojej interakcji ze stroną (tylko po zgodzie na cookies analityczne).</li>
          <li><strong>Google Ads</strong> - pomiar skuteczności reklam. Po zgodzie na cookies marketingowe do Google trafia zahaszowany (SHA-256) adres e-mail i numer telefonu z formularza, żeby powiązać zapytanie z kliknięciem w reklamę. Bez tej zgody nie wysyłamy tych danych.</li>
        </ul>
        <p>Nie sprzedajemy danych podmiotom trzecim.</p>
      </Section>

      <Section title="6. Przekazywanie danych poza EOG">
        <p>
          Część dostawców wymienionych wyżej (Google, Microsoft, Vercel, Resend, Telegram) przetwarza dane poza Europejskim Obszarem Gospodarczym, głównie w Stanach Zjednoczonych. Podstawą przekazania są standardowe klauzule umowne zatwierdzone przez Komisję Europejską albo decyzja o odpowiednim stopniu ochrony (EU-US Data Privacy Framework) - zależnie od dostawcy. Kopię zabezpieczeń otrzymasz, pisząc na <a className="text-primary hover:underline" href="mailto:biuro@programo.pl">biuro@programo.pl</a>.
        </p>
      </Section>

      <Section title="7. Twoje prawa">
        <ul className="list-disc pl-5 flex flex-col gap-2">
          <li>Dostęp do danych i otrzymania ich kopii.</li>
          <li>Sprostowanie, usunięcie lub ograniczenie przetwarzania.</li>
          <li>Przeniesienie danych do innego administratora w powszechnie używanym formacie - art. 20 RODO.</li>
          <li>Wniesienie sprzeciwu wobec przetwarzania w celach marketingowych.</li>
          <li>Wycofanie zgody w dowolnym momencie - nie wpływa to na legalność przetwarzania wcześniej.</li>
          <li>Skarga do Prezesa UODO (ul. Stawki 2, Warszawa).</li>
        </ul>
        <p>
          Aby skorzystać z tych praw, napisz na <a className="text-primary hover:underline" href="mailto:biuro@programo.pl">biuro@programo.pl</a>.
        </p>
      </Section>

      <Section title="8. Cookies - zarządzanie zgodą">
        <p>
          Stosujemy Google Consent Mode v2. Domyślnie wszystkie nieobowiązkowe pliki cookies są wyłączone. Możesz w dowolnym momencie zmienić swoje preferencje:
        </p>
        <button
          type="button"
          onClick={openSettings}
          className="self-start mt-2 inline-flex items-center bg-primary text-on-primary px-6 py-3 rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-primary-container transition-all"
        >
          Zmień ustawienia cookies
        </button>
      </Section>
    </div>
  );
}

function EnglishContent({ openSettings }: { openSettings: () => void }) {
  return (
    <div className="mt-10">
      <p className="text-sm md:text-base font-light leading-relaxed text-on-surface-variant">
        This document describes how Programo Studio (&quot;Programo&quot;, &quot;we&quot;) processes personal data of users visiting programo.pl and contacting us via the form or e-mail.
      </p>

      <Section title="1. Data controller">
        <p>
          The data controller is Programo s.j. based in Poznań, Poland, run by Wojciech Płonka and Bartosz Kolaj. Contact: <a className="text-primary hover:underline" href="mailto:biuro@programo.pl">biuro@programo.pl</a>.
        </p>
      </Section>

      <Section title="2. What data we collect">
        <p>
          <strong>Contact form:</strong> name, e-mail, optional phone, message content, and consent timestamp.
        </p>
        <p>
          <strong>Cookies and analytics:</strong> device identifiers, language, theme, anonymous traffic data (only after consent).
        </p>
        <p>
          Providing your data is voluntary, but without an e-mail address or phone number we have no way to answer your inquiry.
        </p>
      </Section>

      <Section title="3. Purpose and legal basis">
        <ul className="list-disc pl-5 flex flex-col gap-2">
          <li>Responding to form inquiries - Art. 6(1)(a) GDPR (consent) and (b) (pre-contractual measures).</li>
          <li>Traffic analytics and site improvement - Art. 6(1)(a) GDPR (consent to analytical cookies).</li>
          <li>Own marketing and remarketing - Art. 6(1)(a) GDPR (consent to marketing cookies).</li>
        </ul>
        <p>
          We do not make decisions about you based solely on automated processing that would produce legal effects. After you consent to marketing cookies, Google Ads may show you our ads based on your earlier visit (remarketing) - that is profiling for marketing purposes, and withdrawing consent turns it off.
        </p>
      </Section>

      <Section title="4. Retention period">
        <p>
          Form messages are retained for a maximum of 24 months from the last correspondence, unless a longer period is required to fulfill a contract or meet accounting obligations.
        </p>
      </Section>

      <Section title="5. Data recipients">
        <p>We use trusted providers:</p>
        <ul className="list-disc pl-5 flex flex-col gap-2">
          <li><strong>Vercel</strong> - site hosting and server logs.</li>
          <li><strong>Resend</strong> - delivering form messages to our inbox.</li>
          <li><strong>Telegram</strong> - notifying our internal channel about a new inquiry.</li>
          <li><strong>Google Analytics 4</strong> - traffic statistics (only after consent to analytical cookies).</li>
          <li><strong>Microsoft Clarity</strong> - on-site behaviour analysis: cursor movement, clicks, scrolling, and session recordings that replay your interaction with the page (only after consent to analytical cookies).</li>
          <li><strong>Google Ads</strong> - measuring ad performance. After you consent to marketing cookies, your form e-mail and phone number are sent to Google in hashed form (SHA-256) to match the inquiry with an ad click. Without that consent we send nothing.</li>
        </ul>
        <p>We do not sell data to third parties.</p>
      </Section>

      <Section title="6. Transfers outside the EEA">
        <p>
          Some of the providers listed above (Google, Microsoft, Vercel, Resend, Telegram) process data outside the European Economic Area, mainly in the United States. Transfers rely on Standard Contractual Clauses approved by the European Commission or on an adequacy decision (EU-US Data Privacy Framework), depending on the provider. Write to <a className="text-primary hover:underline" href="mailto:biuro@programo.pl">biuro@programo.pl</a> for a copy of the safeguards.
        </p>
      </Section>

      <Section title="7. Your rights">
        <ul className="list-disc pl-5 flex flex-col gap-2">
          <li>Access to your data and obtaining a copy.</li>
          <li>Rectification, deletion, or restriction of processing.</li>
          <li>Portability of your data to another controller in a commonly used format - Art. 20 GDPR.</li>
          <li>Objection to processing for marketing purposes.</li>
          <li>Withdrawal of consent at any time - without affecting prior lawful processing.</li>
          <li>Complaint to the Polish DPA (UODO, Stawki 2, Warsaw).</li>
        </ul>
        <p>
          To exercise these rights, write to <a className="text-primary hover:underline" href="mailto:biuro@programo.pl">biuro@programo.pl</a>.
        </p>
      </Section>

      <Section title="8. Cookies - consent management">
        <p>
          We use Google Consent Mode v2. By default, all non-essential cookies are disabled. You can change your preferences at any time:
        </p>
        <button
          type="button"
          onClick={openSettings}
          className="self-start mt-2 inline-flex items-center bg-primary text-on-primary px-6 py-3 rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-primary-container transition-all"
        >
          Open cookie settings
        </button>
      </Section>
    </div>
  );
}

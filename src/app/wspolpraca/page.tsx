import type { Metadata } from "next";
import Link from "next/link";
import CtaButton from "@/components/ui/cta-button";
import Reveal from "@/components/ui/reveal";
import { COMPANY, COMPANY_ADDRESS_LINE } from "@/lib/company";
import {
  buildBreadcrumbs,
  buildFaqPage,
  buildWebPage,
  renderGraph,
  STATIC_ROUTE_UPDATED_AT,
} from "@/lib/schema";

const PATH = "/wspolpraca";

// Hardkodowany PL, jak cztery strony SEO (patrz CLAUDE.md). Program poleceń
// opiera się na polskich zasadach fakturowania, umowie o dzieło i podatkach -
// tłumaczenie tego na angielski byłoby tłumaczeniem czegoś, co nie ma
// odpowiednika po drugiej stronie.
//
// Świadomie NIE nazywamy tego umową agencyjną ani przedstawicielstwem: art. 758
// KC ciągnie za sobą świadczenie wyrównawcze po zakończeniu współpracy. To jest
// program poleceń i tak ma się nazywać w każdym miejscu na stronie.
export const metadata: Metadata = {
  title: "Program poleceń - zarabiaj 25% na polecaniu Programo",
  description:
    "Polecasz nam firmę, która potrzebuje strony, sklepu albo aplikacji, i dostajesz 25% wartości netto opłaconej faktury. Bez etatu, bez limitów, bez minimum.",
  alternates: { canonical: "https://programo.pl/wspolpraca" },
  openGraph: {
    title: "Program poleceń - zarabiaj 25% na polecaniu Programo",
    description:
      "Polecasz nam firmę, która potrzebuje strony, sklepu albo aplikacji, i dostajesz 25% wartości netto opłaconej faktury.",
    url: "https://programo.pl/wspolpraca",
    siteName: "Programo",
    locale: "pl_PL",
    type: "website",
  },
  robots: { index: true, follow: true },
  keywords: [
    "program poleceń",
    "prowizja za polecenie klienta",
    "współpraca partnerska software house",
    "zarabianie na poleceniach",
    "programo poznań współpraca",
  ],
};

const faqs = [
  {
    q: "Muszę mieć firmę?",
    a: "Nie. Jeśli masz działalność, wystawiasz nam fakturę. Jeśli nie masz, podpisujemy umowę o dzieło albo zlecenia - wtedy podana kwota jest brutto, a należne podatki i składki rozliczamy po naszej stronie.",
  },
  {
    q: "Kiedy dostanę pieniądze?",
    a: "W ciągu 14 dni od momentu, w którym faktura od poleconego klienta zostanie opłacona. Liczy się przelew, a nie podpisanie umowy - projekty potrafią stać tygodniami między jednym a drugim.",
  },
  {
    q: "A co, jeśli klient sam się do nas zgłosi?",
    a: "Po to jest kod polecający. Wystarczy, że klient poda go przy pierwszym kontakcie, albo że wcześniej podeślesz nam jego dane. Wtedy nie ma o co się spierać.",
  },
  {
    q: "Muszę się znać na technologii albo umieć sprzedawać?",
    a: "Nie. Twoja rola kończy się na przekazaniu kontaktu. Rozmowę, wycenę i całą resztę bierzemy na siebie.",
  },
  {
    q: "Ile firm mogę polecić?",
    a: "Tyle, ile chcesz. Nie ma limitu ani minimum, którego trzeba dowieźć.",
  },
];

const pageGraph = renderGraph([
  buildWebPage({
    path: PATH,
    name: "Program poleceń - zarabiaj 25% na polecaniu Programo",
    description:
      "Polecasz nam firmę, która potrzebuje strony, sklepu albo aplikacji, i dostajesz 25% wartości netto opłaconej faktury.",
    dateModified: STATIC_ROUTE_UPDATED_AT[PATH],
  }),
  buildBreadcrumbs([
    { name: "Programo", path: "/" },
    { name: "Współpraca", path: PATH },
  ]),
  buildFaqPage(faqs),
]);

const steps = [
  {
    title: "Dzwonisz i ustalamy zasady",
    desc: "Krótka rozmowa, w której mówimy wprost, ile płacimy i kiedy. Na koniec zakładamy Ci indywidualny kod polecający.",
  },
  {
    title: "Podsyłasz nam kontakt",
    desc: "Wystarczy imię, nazwa firmy i numer telefonu. Możesz też po prostu dać znajomemu swój kod, żeby podał go przy pierwszej rozmowie z nami.",
  },
  {
    title: "Klient dostaje coś od siebie",
    desc: "Każda firma z Twojego polecenia ma pierwszy miesiąc opieki nad stroną albo sklepem gratis. Masz więc co powiedzieć znajomemu poza tym, że znasz kogoś, kto to zrobi.",
  },
  {
    title: "Wypłacamy 25%",
    desc: "Prowizja liczy się od wartości netto opłaconej faktury. Pieniądze idą do Ciebie w ciągu 14 dni od tego, jak klient zapłaci.",
  },
];

const audience = [
  "Freelancerzy i graficy, którzy projektują, ale nie kodują.",
  "Marketerzy i agencje, do których klienci przychodzą po reklamy, a przy okazji pytają o stronę.",
  "Księgowi, doradcy i handlowcy, którzy rozmawiają z właścicielami firm codziennie.",
  "Właściciele firm, którzy wymieniają się kontaktami w swojej branży.",
];

const scope = [
  "strony firmowe",
  "landing page",
  "sklepy internetowe",
  "migracje sklepów",
  "aplikacje webowe",
  "aplikacje mobilne",
  "integracje płatności",
  "kurierzy i Paczkomaty",
  "Allegro i BaseLinker",
  "systemy magazynowe",
  "automatyzacje i AI",
  "stała opieka nad stroną",
];

const rules = [
  // Regulaminu jeszcze nie ma i nie ma do niego linku - świadomie, bo publikacja
  // dokumentu przed sprawdzeniem go przez prawnika jest gorsza niż jego brak.
  // Ta zasada mówi wprost, w którym momencie uczestnik go dostaje.
  "Regulamin programu dostajesz do wglądu przy zakładaniu Twojego indywidualnego kodu polecającego. Zaczynasz, mając zasady na piśmie, a nie po rozmowie telefonicznej.",
  "Prowizja to 25% wartości netto faktury opłaconej przez poleconego klienta.",
  "Przy stałej obsłudze płacimy co miesiąc przez pierwsze 6 miesięcy współpracy z tym klientem.",
  "Liczy się pierwsze zgłoszenie. Jeśli akurat rozmawiamy już z tą firmą, mówimy Ci o tym od razu.",
  "Wypłatę robimy w ciągu 14 dni od zaksięgowania wpłaty od klienta.",
  "Masz działalność? Wystawiasz fakturę. Nie masz? Rozliczamy się umową o dzieło albo zlecenia.",
  "Wszystkie kwoty w tym programie podajemy netto.",
  "Nie ma limitu poleceń ani minimum, którego trzeba dowieźć.",
];

const H2 = "font-headline text-3xl font-bold tracking-tight text-on-surface md:text-5xl";
const CONTAINER = "mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-24";
// Asymetryczne celowo - każda sekcja używa tej samej stałej, więc symetryczne
// py- liczyłoby się dwa razy na każdym styku. Patrz sklepy-internetowe.
const SECTION = "relative bg-surface pt-section pb-section-tight";

export default function WspolpracaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageGraph }} />

      <div className="bg-surface text-on-surface">
        {/* HERO */}
        <section className="relative pt-28 pb-section-tight md:pt-32">
          <div className={CONTAINER}>
            <nav aria-label="breadcrumb" className="mb-8 text-xs uppercase tracking-widest text-on-surface-variant">
              <Link href="/" className="transition-colors hover:text-on-surface">Programo</Link>
              <span className="mx-2">/</span>
              <span>Współpraca</span>
            </nav>

            <div className="max-w-3xl">
              <h1 className="font-headline text-4xl font-bold leading-[1.05] tracking-tighter text-on-surface md:text-6xl 2xl:text-7xl">
                Zarabiaj na kontaktach, które już masz
              </h1>
              <p className="mt-6 text-lg font-light leading-relaxed text-on-surface/70 md:text-xl">
                Znasz firmę, która potrzebuje strony, sklepu albo kogoś, kto
                w końcu ogarnie jej zaplecze? Podeślij nam kontakt. Jeśli
                wyjdzie z tego płatny projekt, dostajesz 25% z każdej opłaconej
                faktury.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <CtaButton href="tel:+48509123434">Zadzwoń: 509 123 434</CtaButton>
                <CtaButton href="mailto:biuro@programo.pl?subject=Program%20polece%C5%84" variant="secondary">
                  Napisz maila
                </CtaButton>
              </div>
              <p className="mt-5 text-sm text-on-surface-variant">
                Jeden telefon wystarczy. Ustalamy zasady, dostajesz regulamin
                i swój kod polecający.
              </p>
            </div>
          </div>
        </section>

        {/* JAK TO DZIAŁA - realna sekwencja, więc numeracja niesie informację. */}
        <section className={SECTION}>
          <div className={CONTAINER}>
            <Reveal className="mb-10 max-w-3xl md:mb-14">
              <h2 className={H2}>Cztery kroki i tyle</h2>
            </Reveal>
            <ol role="list" className="grid gap-x-10 gap-y-10 md:grid-cols-2">
              {steps.map((s, i) => (
                <li key={s.title}>
                  <Reveal delay={(i % 2) * 0.1} className="flex flex-col gap-3 border-t border-outline-variant/30 pt-6">
                    <h3 className="font-headline text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
                      <span className="mr-2 text-on-surface-variant" aria-hidden="true">{i + 1}.</span>
                      {s.title}
                    </h3>
                    <p className="text-base font-light leading-relaxed text-on-surface/70">{s.desc}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ILE TO REALNIE JEST - policzone przykłady, nie kafelki ze statystyką.
            Liczba ma sens dopiero z działaniem, które ją wyprodukowało. */}
        <section className={SECTION}>
          <div className={CONTAINER}>
            <Reveal className="mb-10 max-w-3xl md:mb-14">
              <h2 className={H2}>Ile to daje na koniec miesiąca</h2>
            </Reveal>

            <div className="grid gap-10 md:grid-cols-2 md:gap-16">
              <Reveal className="border-t border-outline-variant/30 pt-6">
                <h3 className="font-headline text-xl font-bold tracking-tight text-on-surface md:text-2xl">
                  Jednorazowy projekt
                </h3>
                <dl className="mt-5 space-y-3 text-base font-light leading-relaxed text-on-surface/70">
                  <div className="flex justify-between gap-6">
                    <dt>Klient zamawia stronę za</dt>
                    <dd className="shrink-0 tabular-nums">10 000 zł netto</dd>
                  </div>
                  <div className="flex justify-between gap-6 border-t border-outline-variant/30 pt-3 font-normal text-on-surface">
                    <dt>Twoja prowizja</dt>
                    <dd className="shrink-0 tabular-nums font-bold">2 500 zł</dd>
                  </div>
                </dl>
              </Reveal>

              <Reveal delay={0.1} className="border-t border-outline-variant/30 pt-6">
                <h3 className="font-headline text-xl font-bold tracking-tight text-on-surface md:text-2xl">
                  Stała obsługa
                </h3>
                <dl className="mt-5 space-y-3 text-base font-light leading-relaxed text-on-surface/70">
                  <div className="flex justify-between gap-6">
                    <dt>Klient zostaje na opiece za</dt>
                    <dd className="shrink-0 tabular-nums">1 000 zł netto / mies.</dd>
                  </div>
                  <div className="flex justify-between gap-6">
                    <dt>Dostajesz co miesiąc</dt>
                    <dd className="shrink-0 tabular-nums">250 zł przez 6 mies.</dd>
                  </div>
                  <div className="flex justify-between gap-6 border-t border-outline-variant/30 pt-3 font-normal text-on-surface">
                    <dt>Razem z jednego polecenia</dt>
                    <dd className="shrink-0 tabular-nums font-bold">1 500 zł</dd>
                  </div>
                </dl>
              </Reveal>
            </div>

            <Reveal delay={0.15} className="mt-12 max-w-2xl">
              <p className="text-lg font-light leading-relaxed text-on-surface/70">
                Prowizje się sumują. Czterech poleconych klientów na stałej
                obsłudze to tysiąc złotych miesięcznie.
              </p>
              <p className="mt-4 text-sm text-on-surface-variant">
                Kwoty są przykładowe. Prowizja zawsze liczy się od wartości netto
                konkretnej faktury.
              </p>
            </Reveal>
          </div>
        </section>

        {/* DLA KOGO + CO MOŻNA POLECAĆ - asymetryczne dwie kolumny, żeby rytm
            strony nie był ciągiem identycznych siatek. */}
        <section className={SECTION}>
          <div className={CONTAINER}>
            <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
              <div>
                <Reveal className="mb-8">
                  <h2 className={H2}>Dla kogo to jest</h2>
                </Reveal>
                <ul className="flex flex-col gap-5">
                  {audience.map((a, i) => (
                    <Reveal key={a} delay={i * 0.06} className="border-t border-outline-variant/30 pt-4">
                      <li className="text-base font-light leading-relaxed text-on-surface/70 md:text-lg">{a}</li>
                    </Reveal>
                  ))}
                </ul>
                {/* Art. 100 KP: nie zachęcamy nikogo do dorabiania kosztem
                    pracodawcy. Ten akapit nie jest ozdobą - jest tu po to. */}
                <Reveal delay={0.2}>
                  <p className="mt-8 max-w-xl text-sm leading-relaxed text-on-surface-variant">
                    Program jest dla osób działających we własnym imieniu. Jeśli
                    jesteś gdzieś zatrudniony, sprawdź najpierw, czy taka
                    współpraca nie koliduje z Twoją umową i obowiązkami wobec
                    pracodawcy.
                  </p>
                </Reveal>
              </div>

              <Reveal delay={0.1}>
                <h2 className="font-headline text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
                  Co możesz polecać
                </h2>
                <ul className="mt-6 flex flex-wrap gap-2.5">
                  {scope.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-outline-variant/60 px-4 py-1.5 text-sm text-on-surface-variant"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm leading-relaxed text-on-surface-variant">
                  Nie musisz wiedzieć, czego dokładnie klient potrzebuje.
                  Wystarczy, że ma problem, którego nie umie sam rozwiązać.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ZASADY - jedna kolumna prozy, celowo inaczej niż siatki wyżej. */}
        <section className={SECTION}>
          <div className={CONTAINER}>
            <Reveal className="mb-10 max-w-3xl md:mb-14">
              <h2 className={H2}>Zasady, żeby nie było niespodzianek</h2>
            </Reveal>
            <ul className="max-w-3xl">
              {rules.map((r, i) => (
                <Reveal key={r} delay={Math.min(i, 4) * 0.05}>
                  <li className="border-t border-outline-variant/30 py-5 text-base font-light leading-relaxed text-on-surface/70 md:text-lg">
                    {r}
                  </li>
                </Reveal>
              ))}
            </ul>
            <Reveal delay={0.2} className="mt-8 max-w-3xl">
              <p className="text-sm leading-relaxed text-on-surface-variant">
                Stroną umowy jest {COMPANY.legalName}, {COMPANY_ADDRESS_LINE},
                NIP {COMPANY.nip}. Dane, które nam zostawisz, przetwarzamy na
                zasadach opisanych w{" "}
                <Link href="/polityka-prywatnosci" className="underline underline-offset-4 hover:text-on-surface">
                  polityce prywatności
                </Link>
                .
              </p>
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section className={SECTION}>
          <div className={CONTAINER}>
            <Reveal className="mb-10 max-w-3xl md:mb-14">
              <h2 className={H2}>Pytania, które padają najczęściej</h2>
            </Reveal>
            <div className="grid gap-x-16 gap-y-10 md:grid-cols-2">
              {faqs.map((f, i) => (
                <Reveal key={f.q} delay={(i % 2) * 0.1} className="border-t border-outline-variant/30 pt-6">
                  <h3 className="font-headline text-xl font-bold tracking-tight text-on-surface md:text-2xl">{f.q}</h3>
                  <p className="mt-3 font-light leading-relaxed text-on-surface/70">{f.a}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINALNE */}
        <section className={SECTION}>
          <div className={CONTAINER}>
            <Reveal className="overflow-hidden rounded-3xl border border-primary/30 bg-primary/5 p-8 text-center md:p-16">
              <h2 className={H2}>Zacznij od jednego telefonu</h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg font-light leading-relaxed text-on-surface/70">
                Kwadrans i wiesz, czy to dla Ciebie. Nic nie podpisujesz na
                starcie i do niczego się nie zobowiązujesz. A jeśli okaże się,
                że dobrze nam się razem pracuje, jesteśmy otwarci na szerszą
                współpracę - ale najpierw zobaczmy, jak pójdzie pierwsze
                polecenie.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <CtaButton href="tel:+48509123434">Zadzwoń: 509 123 434</CtaButton>
                <CtaButton href="mailto:biuro@programo.pl?subject=Program%20polece%C5%84" variant="secondary">
                  biuro@programo.pl
                </CtaButton>
              </div>
              <p className="mt-8 text-sm text-on-surface-variant">
                Bartosz Kolaj · Programo s.j. · Poznań
              </p>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
}

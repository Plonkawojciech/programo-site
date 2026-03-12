"use client";

export default function Footer() {
  return (
    <footer className="bg-sage border-t border-beige-light/10 px-6 py-8 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <p className="font-serif text-sm text-beige-light/40">
          &copy; {new Date().getFullYear()} Programo
        </p>
        <p className="text-xs text-beige-light/30">
          Pozna&#324;, Poland
        </p>
      </div>
    </footer>
  );
}

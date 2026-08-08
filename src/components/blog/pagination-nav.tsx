import Link from "next/link";

// /blog is page 1; page 2+ live at /blog/strona/[page]. Kept as two route
// shapes rather than /blog?page=N so every page is a real static path
// (generateStaticParams), not a searchParams-driven dynamic render.
export default function PaginationNav({
  currentPage,
  pageCount,
}: {
  currentPage: number;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;

  const hrefFor = (page: number) => (page === 1 ? "/blog" : `/blog/strona/${page}`);

  return (
    <nav aria-label="Paginacja" className="mt-14 flex items-center justify-between gap-4">
      {currentPage > 1 ? (
        <Link href={hrefFor(currentPage - 1)} className="underline hover:opacity-100">
          Poprzednia strona
        </Link>
      ) : (
        <span />
      )}
      <span className="text-sm opacity-60">
        Strona {currentPage} z {pageCount}
      </span>
      {currentPage < pageCount ? (
        <Link href={hrefFor(currentPage + 1)} className="underline hover:opacity-100">
          Następna strona
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

import type { MDXComponents } from "mdx/types";
import Link from "next/link";

// Element overrides for MDXRemote — mirrors the typography already used by
// hand-written SEO pages like /ile-kosztuje-aplikacji (font-headline for
// headings, opacity-85 body text, bg-card boxes) so a post reads as part of
// the same site rather than a "blog theme" bolted on top.
export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      className="mb-6 mt-14 font-headline text-2xl font-semibold tracking-tight md:text-3xl"
      {...props}
    />
  ),
  h3: (props) => (
    <h3 className="mb-2 mt-8 font-headline text-lg font-bold tracking-tight" {...props} />
  ),
  p: (props) => <p className="mb-4 text-base leading-relaxed opacity-85 md:text-lg" {...props} />,
  ul: (props) => <ul className="mb-6 list-disc space-y-2 pl-5 text-base leading-relaxed opacity-85 md:text-lg" {...props} />,
  ol: (props) => <ol className="mb-6 list-decimal space-y-2 pl-5 text-base leading-relaxed opacity-85 md:text-lg" {...props} />,
  li: (props) => <li {...props} />,
  strong: (props) => <strong className="font-semibold text-on-surface" {...props} />,
  a: ({ href, ...props }) => {
    // Internal links go through next/link so navigation between the site and
    // blog content stays client-side; external ones stay as plain anchors.
    if (href?.startsWith("/")) {
      return <Link href={href} className="underline hover:opacity-100" {...props} />;
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:opacity-100"
        {...props}
      />
    );
  },
  table: (props) => (
    <div className="mb-6 overflow-x-auto rounded-2xl border border-current/15">
      <table className="w-full text-left text-sm md:text-base" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-card" {...props} />,
  th: (props) => <th className="p-4 font-headline font-semibold" {...props} />,
  td: (props) => <td className="border-t border-current/15 p-4 align-top opacity-85" {...props} />,
  blockquote: (props) => (
    <blockquote className="mb-6 border-l-2 border-primary/60 pl-4 opacity-80" {...props} />
  ),
};

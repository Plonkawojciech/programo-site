import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { extractToc, getAllPosts, getPostBySlug, getRelatedPosts, postWordCount } from "@/lib/blog";
import { readingTimeMinutes } from "@/lib/blog/word-count";
import { AUTHOR_SLUGS } from "@/lib/schema/people";
import AnswerBlock from "@/components/blog/answer-block";
import SourcesList from "@/components/blog/sources-list";
import FaqSection from "@/components/blog/faq-section";
import AuthorBio from "@/components/blog/author-bio";
import RelatedPosts from "@/components/blog/related-posts";
import { TocDesktop, TocMobile } from "@/components/blog/toc";
import { clusterLabel } from "@/components/blog/post-card";
import { mdxComponents } from "@/components/blog/mdx-components";
import {
  buildBlogPosting,
  buildBreadcrumbs,
  buildFaqPage,
  buildWebPage,
  ref,
  renderGraph,
} from "@/lib/schema";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.frontmatter.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const { title, answer } = post.frontmatter;
  const description = answer.length > 160 ? `${answer.slice(0, 157).trimEnd()}...` : answer;
  const url = `https://programo.pl/blog/${slug}`;
  return {
    title: `${title} - Programo`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} - Programo`,
      description,
      url,
      siteName: "Programo",
      locale: "pl_PL",
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { frontmatter, body } = post;
  const author = AUTHOR_SLUGS[frontmatter.author];
  // Validated as a build-time contract in blog-contract.test.ts, not here —
  // an unknown author is a red build, not a page that silently omits a byline.
  if (!author) notFound();

  const related = getRelatedPosts(post);
  const wordCount = postWordCount({ answer: frontmatter.answer, body, faq: frontmatter.faq });
  const minutes = readingTimeMinutes(wordCount);
  const toc = extractToc(body);
  const path = `/blog/${slug}`;

  const blogPosting = buildBlogPosting({
    path,
    headline: frontmatter.title,
    description: frontmatter.answer,
    datePublished: frontmatter.datePublished,
    dateModified: frontmatter.dateModified,
    authorId: author.id,
    wordCount,
    cover: frontmatter.cover,
    coverAlt: frontmatter.coverAlt,
  });

  const pageGraph = renderGraph([
    buildWebPage({
      path,
      name: `${frontmatter.title} - Programo`,
      description: frontmatter.answer,
      dateModified: frontmatter.dateModified,
      mainEntity: ref(blogPosting),
    }),
    buildBreadcrumbs([
      { name: "Programo", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: frontmatter.title, path },
    ]),
    buildFaqPage(frontmatter.faq.map((f) => ({ q: f.q, a: f.a }))),
    blogPosting,
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageGraph }} />
      <div className="min-h-screen bg-surface text-on-surface">
        {/* Hero: breadcrumb, cover, title and meta — kept at reading width
            (not the wider TOC grid below) since there's nothing to sit
            beside it here. */}
        <div className="mx-auto max-w-3xl px-6 pt-16 md:px-10 md:pt-24">
          <nav aria-label="breadcrumb" className="mb-8 text-xs uppercase tracking-widest opacity-60">
            <Link href="/" className="hover:underline">
              Programo
            </Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:underline">
              Blog
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/blog/klaster/${frontmatter.cluster}`} className="hover:underline">
              {clusterLabel(frontmatter.cluster)}
            </Link>
          </nav>

          <header className="mb-10">
            <span className="mb-4 inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              {clusterLabel(frontmatter.cluster)}
            </span>
            <h1 className="mb-6 font-headline text-4xl font-bold leading-[1.05] tracking-tighter md:text-6xl">
              {frontmatter.question}
            </h1>
            <div className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm opacity-60">
              <span>{author.name}</span>
              <span aria-hidden="true">·</span>
              <span>{frontmatter.datePublished}</span>
              {frontmatter.dateModified !== frontmatter.datePublished && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>zaktualizowano {frontmatter.dateModified}</span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span>{minutes} min czytania</span>
            </div>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl">
              <Image
                src={frontmatter.cover}
                alt={frontmatter.coverAlt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          </header>
        </div>

        {/* Body + sticky TOC. Wider container than the hero above — the
            extra width is the TOC's grid column, not a wider reading
            column: the article itself stays lg:max-w-none inside a 1fr
            track that works out close to the same ~768px as the hero. */}
        <div className="mx-auto max-w-6xl px-6 pb-16 md:px-10 md:pb-24 lg:grid lg:grid-cols-[1fr_260px] lg:items-start lg:gap-12">
          <article className="mx-auto max-w-3xl lg:mx-0 lg:max-w-none">
            <TocMobile entries={toc} />

            <AnswerBlock answer={frontmatter.answer} />

            <div>
              {/* remarkGfm: without it, GFM tables and other extended
                  markdown just render as literal pipe-delimited text — no
                  error, just wrong output, which is exactly why this was
                  caught in a visual screenshot pass and not npm test. */}
              <MDXRemote
                source={body}
                components={mdxComponents}
                options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
              />
            </div>

            <FaqSection faq={frontmatter.faq} />
            <SourcesList sources={frontmatter.sources} />
            <AuthorBio name={author.name} jobTitle={author.jobTitle} />
            <RelatedPosts posts={related} />

            <section className="rounded-3xl bg-card p-8 shadow-card md:p-12">
              <h2 className="mb-4 font-headline text-2xl font-semibold tracking-tight md:text-3xl">
                Masz podobny projekt?
              </h2>
              <p className="mb-6 max-w-2xl opacity-80">
                Opisz w kilku zdaniach, co chcesz zbudować. Wrócimy z widełkami i
                propozycją pierwszych kroków, bezpłatnie i bez zobowiązań.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/kontakt"
                  className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition hover:bg-primary-container"
                >
                  Bezpłatna wycena
                </Link>
                <Link
                  href="/oferta"
                  className="rounded-full border border-current/30 px-6 py-3 text-sm font-medium opacity-85 transition hover:opacity-100"
                >
                  Zobacz ofertę
                </Link>
              </div>
            </section>
          </article>

          <TocDesktop entries={toc} />
        </div>
      </div>
    </>
  );
}

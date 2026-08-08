import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug, getRelatedPosts, postWordCount } from "@/lib/blog";
import { AUTHOR_SLUGS } from "@/lib/schema/people";
import AnswerBlock from "@/components/blog/answer-block";
import SourcesList from "@/components/blog/sources-list";
import FaqSection from "@/components/blog/faq-section";
import RelatedPosts from "@/components/blog/related-posts";
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
  const path = `/blog/${slug}`;

  const blogPosting = buildBlogPosting({
    path,
    headline: frontmatter.title,
    description: frontmatter.answer,
    datePublished: frontmatter.datePublished,
    dateModified: frontmatter.dateModified,
    authorId: author.id,
    wordCount,
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
        <article className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-24">
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

          <header className="mb-8">
            <h1 className="mb-6 font-headline text-4xl font-bold leading-[1.05] tracking-tighter md:text-6xl">
              {frontmatter.question}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm opacity-60">
              <span>{author.name}</span>
              <span aria-hidden="true">·</span>
              <span>{frontmatter.datePublished}</span>
              {frontmatter.dateModified !== frontmatter.datePublished && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>zaktualizowano {frontmatter.dateModified}</span>
                </>
              )}
            </div>
          </header>

          <AnswerBlock answer={frontmatter.answer} />

          <div>
            <MDXRemote source={body} components={mdxComponents} />
          </div>

          <FaqSection faq={frontmatter.faq} />
          <SourcesList sources={frontmatter.sources} />
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
      </div>
    </>
  );
}

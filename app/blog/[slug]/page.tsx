import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock } from "lucide-react";
import { BrandButton } from "@/components/ui/brand-button";
import { OpenModalButton } from "@/components/lead-capture/open-modal-button";
import { SiteContainer } from "@/components/ui/site-container";
import {
  blogEntries,
  findBlogEntryBySlug,
} from "@/content/blog-entries";
import { ArticleSchema } from "@/components/seo/article-schema";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

const SITE_URL = "https://scanprint58.ru";

interface BlogPageParams {
  params: Promise<{ slug: string }>;
}

const russianDateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function generateStaticParams() {
  return blogEntries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: BlogPageParams): Promise<Metadata> {
  const { slug } = await params;
  const entry = findBlogEntryBySlug(slug);
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.excerpt,
    alternates: {
      canonical: `${SITE_URL}/blog/${slug}`,
    },
    openGraph: {
      type: "article",
      title: entry.title,
      description: entry.excerpt,
      publishedTime: entry.publishedAt,
    },
  };
}

export default async function BlogEntryPage({ params }: BlogPageParams) {
  const { slug } = await params;
  const entry = findBlogEntryBySlug(slug);
  if (!entry) notFound();

  const relatedEntries = blogEntries
    .filter((item) => item.slug !== entry.slug)
    .slice(0, 3);

  return (
    <>
      <ArticleSchema
        title={entry.title}
        description={entry.excerpt}
        publishedAt={entry.publishedAt}
        path={`/blog/${entry.slug}`}
      />
      <BreadcrumbSchema
        items={[
          { name: "Блог", path: "/blog" },
          { name: entry.title, path: `/blog/${entry.slug}` },
        ]}
      />
      <article className="relative border-b border-border/60 bg-surface/40 py-20 sm:py-24">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <SiteContainer className="relative max-w-3xl">
          <div className="flex flex-col gap-6">
            <Link
              href="/blog"
              className="text-xs uppercase tracking-[0.18em] text-subtle hover:text-brand"
            >
              ← Блог
            </Link>
            <span className="text-xs uppercase tracking-[0.18em] text-brand">
              {entry.categoryLabel}
            </span>
            <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              {entry.title}
            </h1>
            <div className="flex items-center gap-3 text-sm text-subtle">
              <Clock size={14} /> {entry.readMinutes} мин
              <span>·</span>
              <time dateTime={entry.publishedAt}>
                {russianDateFormatter.format(new Date(entry.publishedAt))}
              </time>
            </div>
          </div>
        </SiteContainer>
      </article>

      <section className="py-20 sm:py-24">
        <SiteContainer className="max-w-3xl">
          <div className="flex flex-col gap-6 text-base leading-relaxed text-muted">
            {entry.body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap gap-3">
            <OpenModalButton>
              Обсудить задачу <ArrowRight size={16} />
            </OpenModalButton>
            <BrandButton href="/blog" variant="outline">
              Ещё статьи
            </BrandButton>
          </div>
        </SiteContainer>
      </section>

      {relatedEntries.length > 0 ? (
        <section className="border-t border-border/60 bg-surface/40 py-20 sm:py-24">
          <SiteContainer>
            <h2 className="text-2xl font-semibold text-foreground">
              Читать дальше
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedEntries.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="group flex flex-col gap-3 rounded-2xl border border-border bg-surface-raised/50 p-6 transition-colors hover:border-brand/60"
                >
                  <span className="text-xs uppercase tracking-[0.18em] text-brand">
                    {item.categoryLabel}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-brand">
                    {item.title}
                  </h3>
                  <p className="line-clamp-2 text-sm text-muted">
                    {item.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </SiteContainer>
        </section>
      ) : null}
    </>
  );
}

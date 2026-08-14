import type { Metadata } from "next";
import Link from "next/link";
import { Clock } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { SiteContainer } from "@/components/ui/site-container";
import { blogEntries } from "@/content/blog-entries";

export const metadata: Metadata = {
  title: "Блог",
  description:
    "Статьи и кейсы по 3D-печати, сканированию и реверс-инжинирингу от мастерской Scan & Print.",
  alternates: {
    canonical: "https://scanprint58.ru/blog",
  },
};

const russianDateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function BlogListPage() {
  return (
    <>
      <section className="relative border-b border-border/60 bg-surface/40 py-20 sm:py-24">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <SiteContainer className="relative">
          <SectionHeading
            eyebrow="Блог"
            title={
              <>
                Статьи и <span className="text-brand">кейсы</span>
              </>
            }
            description="Делимся опытом работы с 3D-печатью, сканерами и подготовкой моделей. Если хотите узнать что-то конкретное — напишите, добавим в план."
          />
        </SiteContainer>
      </section>

      <section className="py-20 sm:py-24">
        <SiteContainer>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {blogEntries.map((entry) => (
              <Link
                key={entry.slug}
                href={`/blog/${entry.slug}`}
                className="group flex flex-col gap-4 rounded-2xl border border-border bg-surface-raised/50 p-6 transition-colors hover:border-brand/60"
              >
                <span className="text-xs uppercase tracking-[0.18em] text-brand">
                  {entry.categoryLabel}
                </span>
                <h2 className="text-lg font-semibold text-foreground group-hover:text-brand">
                  {entry.title}
                </h2>
                <p className="line-clamp-3 text-sm text-muted">
                  {entry.excerpt}
                </p>
                <div className="mt-auto flex items-center gap-3 text-xs text-subtle">
                  <Clock size={14} /> {entry.readMinutes} мин чтения
                  <span>·</span>
                  <time dateTime={entry.publishedAt}>
                    {russianDateFormatter.format(new Date(entry.publishedAt))}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        </SiteContainer>
      </section>
    </>
  );
}

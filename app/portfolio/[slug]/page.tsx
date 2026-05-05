import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { BrandButton } from "@/components/ui/brand-button";
import { OpenModalButton } from "@/components/lead-capture/open-modal-button";
import { SiteContainer } from "@/components/ui/site-container";
import {
  findProjectBySlug,
  portfolioProjects,
  type PortfolioProject,
} from "@/content/portfolio-projects";

interface ProjectPageParams {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return portfolioProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageParams): Promise<Metadata> {
  const { slug } = await params;
  const project = findProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageParams) {
  const { slug } = await params;
  const project = findProjectBySlug(slug);
  if (!project) notFound();

  const relatedProjects = portfolioProjects
    .filter((item) => item.slug !== project.slug && item.category === project.category)
    .slice(0, 3);

  return (
    <>
      <section className="relative border-b border-border/60 bg-surface/40 py-20 sm:py-24">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <SiteContainer className="relative">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <div className="flex flex-col gap-6">
              <Link
                href="/portfolio"
                className="text-xs uppercase tracking-[0.18em] text-subtle hover:text-brand"
              >
                ← Портфолио
              </Link>
              <span className="text-xs uppercase tracking-[0.18em] text-brand">
                {project.categoryLabel} · {project.year}
              </span>
              <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
                {project.title}
              </h1>
              <p className="text-lg text-muted">{project.summary}</p>
            </div>
            <div className={`overflow-hidden rounded-2xl border border-border ${project.imageFit === "contain" ? "bg-zinc-950" : ""}`}>
              <Image
                src={project.coverImage}
                alt={project.title}
                width={800}
                height={600}
                className={`w-full ${project.imageFit === "contain" ? "h-auto max-h-[480px] object-contain" : "h-72 object-cover sm:h-96"}`}
                style={{ objectPosition: project.imageObjectPosition ?? "center" }}
              />
            </div>
          </div>
        </SiteContainer>
      </section>

      <section className="py-20 sm:py-24">
        <SiteContainer>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-semibold text-foreground">
                Что сделали
              </h2>
              <ul className="flex flex-col gap-3">
                {project.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-3 rounded-2xl border border-border bg-surface-raised/50 p-5 text-sm text-muted"
                  >
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-brand"
                    />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
            <ProjectSpecs project={project} />
          </div>
        </SiteContainer>
      </section>

      {relatedProjects.length > 0 ? (
        <RelatedProjectsSection projects={relatedProjects} />
      ) : null}

      <section className="border-t border-border/60 bg-surface/40 py-20 sm:py-24">
        <SiteContainer>
          <div className="flex flex-col items-center gap-6 rounded-3xl border border-brand/40 bg-brand-soft p-10 text-center">
            <h2 className="max-w-2xl text-3xl font-semibold text-foreground sm:text-4xl">
              Похожая задача? Обсудим
            </h2>
            <OpenModalButton>
              Оставить заявку <ArrowRight size={16} />
            </OpenModalButton>
          </div>
        </SiteContainer>
      </section>
    </>
  );
}

function ProjectSpecs({ project }: { project: PortfolioProject }) {
  const specs: Array<[string, string | undefined]> = [
    ["Категория", project.categoryLabel],
    ["Год", String(project.year)],
    ["Клиент", project.client],
    ["Тираж", project.quantity],
    ["Материал", project.material],
    ["Срок", project.leadTime],
  ];
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-raised/60 p-6">
      <h3 className="text-xs uppercase tracking-[0.18em] text-subtle">
        Параметры проекта
      </h3>
      <dl className="flex flex-col gap-3 text-sm">
        {specs
          .filter(([, value]) => Boolean(value))
          .map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between border-b border-border/60 pb-2 last:border-none last:pb-0"
            >
              <dt className="text-muted">{label}</dt>
              <dd className="text-right font-medium text-foreground">{value}</dd>
            </div>
          ))}
      </dl>
    </div>
  );
}

function RelatedProjectsSection({
  projects,
}: {
  projects: typeof portfolioProjects;
}) {
  return (
    <section className="border-t border-border/60 bg-surface/40 py-20 sm:py-24">
      <SiteContainer>
        <h2 className="text-2xl font-semibold text-foreground">
          Похожие работы
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/portfolio/${project.slug}`}
              className="group flex flex-col gap-3 rounded-2xl border border-border bg-surface-raised/60 p-6 transition-colors hover:border-brand/60"
            >
              <span className="text-xs uppercase tracking-[0.18em] text-brand">
                {project.categoryLabel} · {project.year}
              </span>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-brand">
                {project.title}
              </h3>
              <p className="line-clamp-2 text-sm text-muted">{project.summary}</p>
            </Link>
          ))}
        </div>
      </SiteContainer>
    </section>
  );
}

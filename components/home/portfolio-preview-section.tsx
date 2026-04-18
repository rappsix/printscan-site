import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { portfolioProjects } from "@/content/portfolio-projects";
import { SectionHeading } from "@/components/ui/section-heading";
import { SiteContainer } from "@/components/ui/site-container";

export function PortfolioPreviewSection() {
  const featuredProjects = portfolioProjects.slice(0, 6);

  return (
    <section className="relative py-20 sm:py-28">
      <SiteContainer>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Портфолио"
            title={
              <>
                Некоторые из <span className="text-brand">наших работ</span>
              </>
            }
            description="Кейсы по 3D-печати, сканированию, реверс-инжинирингу и макетированию."
          />
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm text-brand transition-colors hover:text-brand-hover"
          >
            Все работы <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <Link
              key={project.slug}
              href={`/portfolio/${project.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised/60 transition-all duration-300 hover:-translate-y-1 hover:border-brand/60"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-surface-raised to-border-bright">
                <div className="grid h-full w-full place-items-center text-sm text-subtle">
                  {project.categoryLabel}
                </div>
              </div>
              <div className="flex flex-col gap-3 p-6">
                <span className="text-xs uppercase tracking-[0.18em] text-brand">
                  {project.categoryLabel} · {project.year}
                </span>
                <h3 className="text-lg font-semibold leading-tight text-foreground transition-colors group-hover:text-brand">
                  {project.title}
                </h3>
                <p className="line-clamp-2 text-sm text-muted">
                  {project.summary}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </SiteContainer>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { portfolioProjects } from "@/content/portfolio-projects";
import { SectionHeading } from "@/components/ui/section-heading";
import { SiteContainer } from "@/components/ui/site-container";
import { TiltCard } from "@/components/ui/tilt-card";
import { RippleCard } from "@/components/ui/ripple-card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function PortfolioPreviewSection() {
  const featuredProjects = portfolioProjects.slice(0, 6);

  return (
    <section className="relative py-20 sm:py-28">
      <SiteContainer>
        <ScrollReveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Портфолио"
              title={
                <>
                  Наши <span className="text-brand">работы</span>
                </>
              }
              description="3D-печать, сканирование, реверс-инжиниринг, моделирование и макеты."
            />
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-sm text-brand transition-colors hover:text-brand-hover"
            >
              Все работы <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project, i) => (
            <ScrollReveal key={project.slug} delay={i * 0.08}>
              <TiltCard maxAngle={8}>
                <RippleCard className="rounded-2xl">
                  <Link
                    href={`/portfolio/${project.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised/60 transition-all duration-300 hover:border-brand/60"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-surface-raised to-border-bright">
                      {project.coverImage && (
                        <Image
                          src={project.coverImage}
                          alt={project.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className={`${project.imageFit === "contain" ? "object-contain" : "object-cover"} transition-transform duration-500 group-hover:scale-105`}
                          style={{ objectPosition: project.imageObjectPosition ?? "center" }}
                        />
                      )}
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
                </RippleCard>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </SiteContainer>
    </section>
  );
}

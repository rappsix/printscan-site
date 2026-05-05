"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/class-merger";
import { SectionHeading } from "@/components/ui/section-heading";
import { SiteContainer } from "@/components/ui/site-container";
import {
  portfolioProjects,
  type PortfolioCategory,
} from "@/content/portfolio-projects";

type Filter = "all" | PortfolioCategory;

const categoryFilters: Array<{ value: Filter; label: string }> = [
  { value: "all", label: "Все работы" },
  { value: "3d-print", label: "3D-печать" },
  { value: "3d-scan", label: "Сканирование" },
  { value: "reverse-engineering", label: "Реверс-инжиниринг" },
  { value: "3d-modeling", label: "Моделирование" },
  { value: "mockups", label: "Макеты" },
  { value: "post-processing", label: "Постобработка" },
];

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return portfolioProjects;
    return portfolioProjects.filter((project) => project.category === activeFilter);
  }, [activeFilter]);

  return (
    <>
      <section className="relative border-b border-border/60 bg-surface/40 py-20 sm:py-24">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <SiteContainer className="relative">
          <SectionHeading
            eyebrow="Портфолио"
            title={
              <>
                Наши <span className="text-brand">работы</span>
              </>
            }
            description="3D-печать, сканирование, реверс-инжиниринг, моделирование и макеты. Выберите категорию или листайте подряд."
          />
        </SiteContainer>
      </section>

      <section className="py-12">
        <SiteContainer>
          <div className="flex flex-wrap gap-2">
            {categoryFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-colors",
                  activeFilter === filter.value
                    ? "border-brand bg-brand-soft text-brand"
                    : "border-border text-muted hover:border-brand/60 hover:text-brand",
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/portfolio/${project.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised/60 transition-all hover:-translate-y-1 hover:border-brand/60"
              >
                <div className={`relative w-full overflow-hidden ${project.imageFit === "contain" ? "aspect-[3/4] bg-zinc-950" : "aspect-[4/3] bg-gradient-to-br from-surface-raised to-border-bright"}`}>
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
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-brand">
                    {project.title}
                  </h3>
                  <p className="line-clamp-2 text-sm text-muted">
                    {project.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {filteredProjects.length === 0 ? (
            <p className="mt-16 text-center text-sm text-muted">
              В этой категории пока нет опубликованных работ.
            </p>
          ) : null}
        </SiteContainer>
      </section>
    </>
  );
}

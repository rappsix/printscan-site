"use client";

import dynamic from "next/dynamic";
import { ArrowRight, Sparkles } from "lucide-react";
import { BrandButton } from "@/components/ui/brand-button";
import { SiteContainer } from "@/components/ui/site-container";
import { companyInfo } from "@/content/company-info";
import { HeroSceneBoundary } from "./hero-scene-boundary";

const HeroScene = dynamic(
  () => import("./hero-scene").then((m) => m.HeroScene),
  {
    ssr: false,
    loading: () => <div className="h-full w-full animate-pulse rounded-[32px] bg-surface-raised" />,
  },
);

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-50" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-brand-soft blur-3xl" />

      <SiteContainer className="relative grid gap-10 py-16 sm:py-24 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="flex flex-col justify-center gap-7">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border-bright bg-surface-raised/60 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-brand">
            <Sparkles size={14} />
            B2B · с {companyInfo.founded} года
          </span>
          <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            3D-печать, сканирование{" "}
            <span className="text-brand">и макетирование</span>
            <br className="hidden sm:block" />
            для бизнеса в Пензе
          </h1>
          <p className="max-w-xl text-lg text-muted sm:text-xl">
            Работаем с юрлицами и ИП: пластики под задачу, точные сканы
            промышленным оборудованием, макеты и реверс-инжиниринг. Выезд по
            Пензе и области.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <BrandButton href="/#contact" variant="primary" className="gap-2">
              Рассчитать проект <ArrowRight size={16} />
            </BrandButton>
            <BrandButton href="/portfolio" variant="outline">
              Смотреть работы
            </BrandButton>
          </div>
          <dl className="mt-4 grid grid-cols-3 gap-5 border-t border-border/60 pt-6 text-sm">
            <div>
              <dt className="text-muted">Материалов</dt>
              <dd className="text-xl font-semibold text-foreground">15+</dd>
            </div>
            <div>
              <dt className="text-muted">Проектов</dt>
              <dd className="text-xl font-semibold text-foreground">500+</dd>
            </div>
            <div>
              <dt className="text-muted">Выезд</dt>
              <dd className="text-xl font-semibold text-foreground">58 рег.</dd>
            </div>
          </dl>
        </div>

        <div className="relative aspect-square w-full max-w-[560px] justify-self-center overflow-hidden rounded-[32px]">
          <HeroSceneBoundary fallback={<div className="h-full w-full bg-surface-raised" />}>
            <HeroScene />
          </HeroSceneBoundary>
        </div>
      </SiteContainer>
    </section>
  );
}

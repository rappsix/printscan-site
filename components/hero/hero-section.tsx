"use client";

import dynamic from "next/dynamic";
import { ArrowRight, Sparkles } from "lucide-react";
import { BrandButton } from "@/components/ui/brand-button";
import { useContactModal } from "@/components/lead-capture/modal-provider";
import { MagneticWrapper } from "@/components/ui/magnetic-wrapper";
import { SiteContainer } from "@/components/ui/site-container";
import { TextScramble } from "@/components/ui/text-scramble";
import { companyInfo } from "@/content/company-info";
import { HeroSceneBoundary } from "./hero-scene-boundary";

const HeroScene = dynamic(
  () => import("./hero-scene").then((m) => m.HeroScene),
  {
    ssr: false,
    loading: () => <div className="h-full w-full animate-pulse bg-surface-raised" />,
  },
);

export function HeroSection() {
  const { openModal } = useContactModal();
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-50" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-brand-soft blur-3xl" />

      {/* 3D model — mobile: full-bleed backdrop; desktop: right-column panel */}
      <div className="absolute inset-0 lg:inset-y-8 lg:left-[51%] lg:right-8 lg:overflow-hidden lg:rounded-[32px]">
        <HeroSceneBoundary fallback={<div className="h-full w-full bg-surface-raised" />}>
          <HeroScene />
        </HeroSceneBoundary>
        {/* fades model into background so text stays readable on mobile */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/10 lg:hidden" />
      </div>

      <SiteContainer className="relative z-10 grid gap-10 py-16 sm:py-24 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        {/* text anchored to bottom on mobile so model is visible above */}
        <div className="flex min-h-[88svh] flex-col justify-end gap-7 pb-10 lg:min-h-0 lg:justify-center lg:pb-0">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border-bright bg-surface-raised/60 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-brand">
            <Sparkles size={14} />
            Пенза · с {companyInfo.founded} года
          </span>
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
            <span className="block whitespace-nowrap">
              <TextScramble text="3Д сканирование" delay={200} duration={1200} />
            </span>
            <span className="block whitespace-nowrap text-brand">
              <TextScramble text="3Д печать" delay={900} duration={1000} />
            </span>
            <span className="block whitespace-nowrap">
              <TextScramble text="3Д моделирование" delay={1500} duration={1000} />
            </span>
          </h1>
          <p className="max-w-xl text-lg text-muted sm:text-xl">
            Собственный парк FDM и SLA принтеров. Работаем с широким выбором
            пластиков: PLA, PETG, ABS, ASA, TPU, нейлон, поликарбонат и другие.
            Сканирование, реверс-инжиниринг, моделирование по фото и архитектурные макеты.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <MagneticWrapper>
              <BrandButton as="button" onClick={openModal} variant="primary" className="gap-2">
                Получить консультацию <ArrowRight size={16} />
              </BrandButton>
            </MagneticWrapper>
            <MagneticWrapper>
              <BrandButton href="/portfolio" variant="outline">
                Смотреть работы
              </BrandButton>
            </MagneticWrapper>
          </div>
          <dl className="mt-4 grid grid-cols-3 gap-5 border-t border-border/60 pt-6 text-sm">
            <div>
              <dt className="text-muted">Проектов</dt>
              <dd className="text-xl font-semibold text-foreground">500+</dd>
            </div>
            <div>
              <dt className="text-muted">С 2018 года</dt>
              <dd className="text-xl font-semibold text-foreground">8 лет</dd>
            </div>
            <div>
              <dt className="text-muted">Срок от</dt>
              <dd className="text-xl font-semibold text-foreground">1 дня</dd>
            </div>
          </dl>
        </div>

        {/* spacer keeps the desktop grid two-column */}
        <div className="hidden lg:block" />
      </SiteContainer>
    </section>
  );
}

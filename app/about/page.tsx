import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Cpu, Printer, ScanLine } from "lucide-react";
import { BrandButton } from "@/components/ui/brand-button";
import { SectionHeading } from "@/components/ui/section-heading";
import { SiteContainer } from "@/components/ui/site-container";
import { companyInfo } from "@/content/company-info";
import { companyStats } from "@/content/company-stats";
import {
  companyPrinciples,
  equipmentInventory,
} from "@/content/company-principles";

export const metadata: Metadata = {
  title: "О компании",
  description:
    "Scan & Print работает с 2018 года в Пензе: 3D-печать, промышленное сканирование, реверс-инжиниринг и макетирование для бизнеса.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStats />
      <AboutPrinciples />
      <AboutEquipment />
      <AboutCta />
    </>
  );
}

function AboutHero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-surface/40 py-20 sm:py-28">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <SiteContainer className="relative">
        <div className="flex flex-col gap-6">
          <span className="text-xs uppercase tracking-[0.18em] text-brand">
            О компании
          </span>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            Scan &amp; Print —{" "}
            <span className="text-brand">производственная мастерская</span>{" "}
            в Пензе
          </h1>
          <p className="max-w-3xl text-lg text-muted">
            Работаем с {companyInfo.founded} года. Помогаем бизнесу, инженерам и
            архитекторам превращать идеи и существующие объекты в готовые
            изделия: от прототипа до серии, от фото до чертежа.
          </p>
          <p className="max-w-3xl text-base leading-relaxed text-muted">
            За годы мы собрали парк FDM и фотополимерных принтеров,
            профессиональные 3D-сканеры и команду инженеров, которая понимает
            производство. Выезжаем на объекты по Пензе и области, работаем с
            юрлицами по безналу, оформляем полный пакет документов.
          </p>
        </div>
      </SiteContainer>
    </section>
  );
}

function AboutStats() {
  return (
    <section className="py-20 sm:py-24">
      <SiteContainer>
        <SectionHeading
          eyebrow="Цифры"
          title={
            <>
              Коротко о <span className="text-brand">нас</span>
            </>
          }
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {companyStats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-2 rounded-2xl border border-border bg-surface-raised/50 p-6"
            >
              <span className="text-3xl font-semibold text-brand">
                {stat.value}
              </span>
              <span className="text-sm font-medium text-foreground">
                {stat.label}
              </span>
              <span className="text-xs text-muted">{stat.hint}</span>
            </div>
          ))}
        </div>
      </SiteContainer>
    </section>
  );
}

function AboutPrinciples() {
  return (
    <section className="border-t border-border/60 bg-surface/40 py-20 sm:py-24">
      <SiteContainer>
        <SectionHeading
          eyebrow="Подход"
          title={
            <>
              Как мы <span className="text-brand">работаем</span>
            </>
          }
          description="Принципы, которых держимся на каждом проекте — от первого звонка до сдачи."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {companyPrinciples.map((principle) => (
            <div
              key={principle.title}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-raised/50 p-6"
            >
              <h3 className="text-lg font-semibold text-foreground">
                {principle.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </SiteContainer>
    </section>
  );
}

function AboutEquipment() {
  return (
    <section className="py-20 sm:py-24">
      <SiteContainer>
        <SectionHeading
          eyebrow="Оборудование"
          title={
            <>
              Чем <span className="text-brand">печатаем и сканируем</span>
            </>
          }
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {equipmentInventory.map((item) => (
            <div
              key={item.name}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-raised/50 p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <EquipmentIcon category={item.category} />
              </span>
              <h3 className="text-lg font-semibold text-foreground">
                {item.name}
              </h3>
              <p className="text-sm text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </SiteContainer>
    </section>
  );
}

function EquipmentIcon({ category }: { category: "printer" | "scanner" | "software" }) {
  if (category === "printer") return <Printer size={18} />;
  if (category === "scanner") return <ScanLine size={18} />;
  return <Cpu size={18} />;
}

function AboutCta() {
  return (
    <section className="border-t border-border/60 bg-surface/40 py-20 sm:py-24">
      <SiteContainer>
        <div className="flex flex-col items-center gap-6 rounded-3xl border border-brand/40 bg-brand-soft p-10 text-center">
          <h2 className="max-w-2xl text-3xl font-semibold text-foreground sm:text-4xl">
            Хотите обсудить сотрудничество?
          </h2>
          <p className="max-w-xl text-sm text-muted sm:text-base">
            Позвоните или оставьте заявку — расскажем о возможностях, покажем
            цех и примеры работ.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <BrandButton href="/#inquiry">Оставить заявку</BrandButton>
            <BrandButton href="/portfolio" variant="outline">
              Смотреть портфолио <ArrowRight size={16} />
            </BrandButton>
          </div>
          <Link
            href={`tel:${companyInfo.phoneClean}`}
            className="text-sm text-brand hover:text-brand-hover"
          >
            {companyInfo.phone}
          </Link>
        </div>
      </SiteContainer>
    </section>
  );
}

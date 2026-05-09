import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Cpu, Printer, ScanLine } from "lucide-react";
import { BrandButton } from "@/components/ui/brand-button";
import { OpenModalButton } from "@/components/lead-capture/open-modal-button";
import { SectionHeading } from "@/components/ui/section-heading";
import { SiteContainer } from "@/components/ui/site-container";
import { companyInfo } from "@/content/company-info";
import { companyStats } from "@/content/company-stats";
import {
  companyPrinciples,
  equipmentInventory,
} from "@/content/company-principles";
import { printerGallery } from "@/content/printer-gallery";

export const metadata: Metadata = {
  title: "О компании",
  description:
    "Scan & Print работает с 2018 года в Пензе: 3D-печать, промышленное сканирование, реверс-инжиниринг и моделирование.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStats />
      <AboutPrinciples />
      <AboutEquipment />
      <AboutPrinterGallery />
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
            Работаем с {companyInfo.founded} года. Помогаем инженерам, архитекторам и
            производствам превращать идеи и существующие объекты в готовые
            изделия: от прототипа до серии, от фото до чертежа.
          </p>
          <p className="max-w-3xl text-base leading-relaxed text-muted">
            За годы мы собрали парк FDM и фотополимерных принтеров,
            профессиональные 3D-сканеры и команду инженеров, которая понимает
            производство. Выезжаем на объекты по Пензе и области, работаем с
            частными лицами, ИП и организациями, оформляем полный пакет документов.
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

function AboutPrinterGallery() {
  return (
    <section className="border-t border-border/60 bg-surface/40 py-20 sm:py-24">
      <SiteContainer>
        <SectionHeading
          eyebrow="Наш парк"
          title={
            <>
              Принтеры, на которых{" "}
              <span className="text-brand">мы работаем</span>
            </>
          }
          description="Собственное оборудование — от настольных FDM-станков до фотополимерных принтеров и профессиональных сканеров."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {printerGallery.map((printer) => (
            <div
              key={printer.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface-raised/50"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
                <Image
                  src={printer.imagePath}
                  alt={printer.name}
                  fill
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {printer.tag && (
                  <span className="absolute left-3 top-3 rounded-full bg-brand/90 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                    {printer.tag}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1.5 p-4">
                <h3 className="text-sm font-semibold text-foreground">
                  {printer.name}
                </h3>
                <p className="text-xs leading-relaxed text-muted">
                  {printer.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SiteContainer>
    </section>
  );
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
            <OpenModalButton>Оставить заявку</OpenModalButton>
            <BrandButton href="/portfolio" variant="outline">
              Смотреть портфолио <ArrowRight size={16} />
            </BrandButton>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`tel:${companyInfo.phoneClean}`}
              className="text-sm text-brand hover:text-brand-hover"
            >
              {companyInfo.phone}
            </Link>
            <Link
              href={`tel:${companyInfo.phone2Clean}`}
              className="text-sm text-brand hover:text-brand-hover"
            >
              {companyInfo.phone2}
            </Link>
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}

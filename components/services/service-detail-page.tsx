import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { ServiceIcon } from "@/components/icons/service-icon";
import { OpenModalButton } from "@/components/lead-capture/open-modal-button";
import { SectionHeading } from "@/components/ui/section-heading";
import { SiteContainer } from "@/components/ui/site-container";
import { portfolioProjects } from "@/content/portfolio-projects";
import { type ServiceEntry } from "@/content/services-catalog";

interface ServiceDetailPageProps {
  service: ServiceEntry;
}

export function ServiceDetailPage({ service }: ServiceDetailPageProps) {
  if (service.slug === "3d-print") {
    return (
      <>
        <ServiceHero service={service} />
        <PrintPlastics />
        <ServiceCta />
      </>
    );
  }

  if (service.slug === "3d-scan") {
    return (
      <>
        <ServiceHero service={service} />
        <ScannerDescription />
        <ServiceCta />
      </>
    );
  }

  if (service.slug === "reverse-engineering") {
    return (
      <>
        <ServiceHero service={service} />
        <ReverseEngineeringUseCases />
        <ServiceCta />
      </>
    );
  }

  const relatedProjects = portfolioProjects
    .filter((project) => project.category === service.slug)
    .slice(0, 3);
  return (
    <>
      <ServiceHero service={service} />
      <ServiceBullets service={service} />
      {service.materials ? <ServiceMaterials service={service} /> : null}
      {relatedProjects.length > 0 ? (
        <ServiceRelatedProjects projects={relatedProjects} />
      ) : null}
      <ServiceCta />
    </>
  );
}

function ServiceHero({ service }: { service: ServiceEntry }) {
  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-surface/40 py-20 sm:py-24">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <SiteContainer className="relative">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center">
          <div className="flex flex-col gap-6">
            <Link
              href="/"
              className="text-xs uppercase tracking-[0.18em] text-subtle hover:text-brand"
            >
              ← На главную
            </Link>
            <div className="inline-flex items-center gap-3 self-start rounded-full border border-brand/40 bg-brand-soft px-4 py-2 text-xs uppercase tracking-[0.18em] text-brand">
              <ServiceIcon name={service.icon} size={14} /> Услуга
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              {service.title}
            </h1>
            <p className="max-w-2xl text-lg text-muted">{service.tagline}</p>
            <p className="max-w-2xl text-base leading-relaxed text-muted">
              {service.description}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <OpenModalButton>
                Оставить заявку <ArrowRight size={16} />
              </OpenModalButton>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            {service.image ? (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface/60 via-transparent to-transparent" />
              </div>
            ) : null}
            <ServiceMetaCard service={service} />
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}

function ServiceMetaCard({ service }: { service: ServiceEntry }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-raised/60 p-6">
      <div className="flex items-center gap-3 text-sm text-subtle">
        <Clock size={16} className="text-brand" />
        <span className="uppercase tracking-[0.18em]">Сроки</span>
        <span className="ml-auto text-foreground">{service.deliveryHint}</span>
      </div>
      {service.technologies ? (
        <div className="border-t border-border pt-4 text-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-subtle">
            Технологии
          </p>
          <p className="mt-2 text-foreground">
            {service.technologies.join(" · ")}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function ServiceBullets({ service }: { service: ServiceEntry }) {
  return (
    <section className="py-20 sm:py-24">
      <SiteContainer>
        <SectionHeading
          eyebrow="Что делаем"
          title={
            <>
              Ключевые <span className="text-brand">задачи</span>
            </>
          }
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2">
          {service.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-start gap-3 rounded-2xl border border-border bg-surface-raised/40 p-5 text-sm text-muted"
            >
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0 text-brand"
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </SiteContainer>
    </section>
  );
}

function ServiceMaterials({ service }: { service: ServiceEntry }) {
  if (!service.materials) return null;
  return (
    <section className="border-t border-border/60 bg-surface/40 py-20 sm:py-24">
      <SiteContainer>
        <SectionHeading
          eyebrow="Материалы"
          title={
            <>
              С чем <span className="text-brand">работаем</span>
            </>
          }
          description="Подбираем материал под задачу: прочность, термостойкость, гибкость или внешний вид."
        />
        <div className="mt-12 flex flex-wrap gap-3">
          {service.materials.map((material) => (
            <span
              key={material}
              className="rounded-full border border-border bg-surface-raised/60 px-4 py-2 text-sm text-foreground"
            >
              {material}
            </span>
          ))}
        </div>
      </SiteContainer>
    </section>
  );
}

function ServiceRelatedProjects({
  projects,
}: {
  projects: typeof portfolioProjects;
}) {
  return (
    <section className="py-20 sm:py-24">
      <SiteContainer>
        <SectionHeading
          eyebrow="Примеры работ"
          title={
            <>
              Работы по этой <span className="text-brand">услуге</span>
            </>
          }
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
              <p className="text-sm text-muted">{project.summary}</p>
            </Link>
          ))}
        </div>
      </SiteContainer>
    </section>
  );
}


const SCANNER_HOW_IT_WORKS = [
  {
    label: "Структурированный свет",
    body: "Сканер проецирует на объект паттерн полос и фиксирует его деформацию камерами. Алгоритм восстанавливает трёхмерную форму поверхности без контакта с изделием.",
  },
  {
    label: "Точность до сотых долей мм",
    body: "Профессиональные сканеры обеспечивают точность 0,02–0,05 мм. Это позволяет контролировать посадки, проверять геометрию деталей и работать с требовательной документацией.",
  },
  {
    label: "Объекты любого размера",
    body: "Сканируем от миниатюрных деталей размером 5 мм до крупногабаритных конструкций в несколько метров. При необходимости — выезд с оборудованием на объект.",
  },
  {
    label: "Полная геометрия за один проход",
    body: "Ручной сканер обходит объект со всех сторон, накапливая облако точек в реальном времени. Программа автоматически сшивает сканы и строит замкнутую полигональную сетку.",
  },
];

const SCANNER_USE_CASES = [
  { label: "Реверс-инжиниринг", body: "Оцифровка деталей для восстановления чертежей и производства аналогов." },
  { label: "Контроль геометрии", body: "Сравнение отсканированной детали с эталонной CAD-моделью." },
  { label: "Подготовка к 3D-печати", body: "Конвертация физического объекта в STL-файл для репликации или доработки." },
  { label: "Скульптура и декор", body: "Оцифровка авторских изделий, статуэток, барельефов для тиражирования." },
  { label: "Медицина и протезирование", body: "Снятие формы конечности или анатомического объекта для изготовления ортеза." },
  { label: "Промышленное оборудование", body: "Сканирование труднодоступных узлов без разборки агрегата." },
];

function ScannerDescription() {
  return (
    <>
      <section className="py-20 sm:py-24">
        <SiteContainer>
          <SectionHeading
            eyebrow="Как это работает"
            title={
              <>
                Принцип работы <span className="text-brand">сканера</span>
              </>
            }
            description="Профессиональный ручной 3D-сканер — это оптический прибор, который превращает реальный объект в точную цифровую модель без прикосновений и шаблонов."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {SCANNER_HOW_IT_WORKS.map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-raised/40 p-6"
              >
                <span className="text-base font-semibold text-foreground">
                  {item.label}
                </span>
                <p className="text-sm leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </SiteContainer>
      </section>
      <section className="border-t border-border/60 bg-surface/40 py-20 sm:py-24">
        <SiteContainer>
          <SectionHeading
            eyebrow="Применение"
            title={
              <>
                Для каких задач <span className="text-brand">подходит</span>
              </>
            }
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SCANNER_USE_CASES.map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-2 rounded-2xl border border-border bg-surface-raised/40 p-5"
              >
                <span className="text-base font-semibold text-brand">{item.label}</span>
                <p className="text-sm leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </SiteContainer>
      </section>
    </>
  );
}

const REVERSE_USE_CASES = [
  {
    label: "Деталь снята с производства",
    body: "Восстанавливаем по образцу — даже если документации не сохранилось. Достаточно принести изношенную или сломанную деталь.",
  },
  {
    label: "Готовим к серийному выпуску",
    body: "Строим параметрическую модель и чертежи по ГОСТ для передачи на завод или в мелкосерийное производство.",
  },
  {
    label: "Адаптируем под свои требования",
    body: "Модифицируем геометрию, добавляем крепёж, меняем размеры под новую задачу — на основе уже существующего изделия.",
  },
];

function ReverseEngineeringUseCases() {
  return (
    <section className="py-20 sm:py-24">
      <SiteContainer>
        <SectionHeading
          eyebrow="Применение"
          title={
            <>
              Для кого это <span className="text-brand">подходит</span>
            </>
          }
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {REVERSE_USE_CASES.map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-raised/40 p-6"
            >
              <span className="text-base font-semibold text-foreground">
                {item.label}
              </span>
              <p className="text-sm leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </SiteContainer>
    </section>
  );
}

const PLASTICS = [
  { name: "PLA", use: "Прототипы, макеты, декор. Лёгок в печати, хорошая детализация, не требует нагревательной камеры." },
  { name: "PETG", use: "Функциональные детали, ёмкости, корпуса. Прочный, влагостойкий, слабо воняет при печати." },
  { name: "ABS", use: "Нагруженные детали, корпуса под обработку. Термостойкий, легко шлифуется и склеивается." },
  { name: "ASA", use: "Уличные изделия и кронштейны. Как ABS, но устойчив к UV-излучению и перепадам температур." },
  { name: "TPU", use: "Гибкие детали: прокладки, чехлы, демпферы, уплотнители. Хорошо гнётся, не ломается." },
  { name: "Нейлон", use: "Шестерни, втулки, направляющие. Износостоек, скользкий, выдерживает ударные нагрузки." },
  { name: "Поликарбонат", use: "Высоконагруженные и термостойкие детали. Очень прочный, выдерживает до 110–120 °C." },
];

function PrintPlastics() {
  return (
    <section className="py-20 sm:py-24">
      <SiteContainer>
        <SectionHeading
          eyebrow="Материалы"
          title={
            <>
              Пластики, с которыми{" "}
              <span className="text-brand">работаем</span>
            </>
          }
          description="Подбираем материал под задачу — по прочности, термостойкости, гибкости или требованиям к внешнему виду."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLASTICS.map((p) => (
            <div
              key={p.name}
              className="flex flex-col gap-2 rounded-2xl border border-border bg-surface-raised/40 p-5"
            >
              <span className="text-base font-semibold text-brand">{p.name}</span>
              <p className="text-sm leading-relaxed text-muted">{p.use}</p>
            </div>
          ))}
        </div>
      </SiteContainer>
    </section>
  );
}

function ServiceCta() {
  return (
    <section className="py-20 sm:py-24">
      <SiteContainer>
        <div className="flex flex-col items-center gap-6 rounded-3xl border border-brand/40 bg-brand-soft p-10 text-center">
          <h2 className="max-w-2xl text-3xl font-semibold text-foreground sm:text-4xl">
            Обсудим задачу и пришлём смету
          </h2>
          <p className="max-w-xl text-sm text-muted sm:text-base">
            Опишите, что нужно сделать, и прикрепите файл — STL, чертёж или
            фото. Ответим в течение рабочего дня.
          </p>
          <OpenModalButton>Оставить заявку</OpenModalButton>
        </div>
      </SiteContainer>
    </section>
  );
}

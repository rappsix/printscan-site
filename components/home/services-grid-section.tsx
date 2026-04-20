import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { servicesCatalog } from "@/content/services-catalog";
import { SectionHeading } from "@/components/ui/section-heading";
import { SiteContainer } from "@/components/ui/site-container";
import { ServiceIcon } from "@/components/icons/service-icon";
import { TiltCard } from "@/components/ui/tilt-card";
import { RippleCard } from "@/components/ui/ripple-card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SectionOrb } from "@/components/ui/section-orb-lazy";

export function ServicesGridSection() {
  return (
    <section id="services" className="relative overflow-hidden py-20 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-80 w-80 opacity-[0.38]">
        <SectionOrb variant="icosahedron" />
      </div>

      <SiteContainer>
        <ScrollReveal>
          <SectionHeading
            eyebrow="Что мы делаем"
            title={
              <>
                Полный цикл{" "}
                <span className="text-brand">3D-услуг</span>
              </>
            }
            description="От быстрой печати прототипов до архитектурных макетов и
            реверс-инжиниринга — закрываем полный цикл работы с геометрией."
          />
        </ScrollReveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {servicesCatalog.map((service, i) => (
            <ScrollReveal key={service.slug} delay={i * 0.08}>
              <TiltCard>
                <RippleCard className="h-full rounded-2xl">
                  <Link
                    href={`/services/${service.slug}`}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised/60 transition-all duration-300 hover:border-brand/60 hover:bg-surface-raised"
                  >
                    <ServiceCardImage service={service} />
                    <div className="flex flex-1 flex-col gap-4 p-6">
                      <div className="flex-1 space-y-2">
                        <h3 className="text-lg font-semibold leading-tight text-foreground">
                          {service.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-muted">
                          {service.tagline}
                        </p>
                      </div>
                      <div className="flex items-center justify-between border-t border-border/60 pt-4 text-xs uppercase tracking-[0.14em]">
                        <span className="inline-flex items-center gap-1 text-brand transition-transform group-hover:translate-x-1">
                          Подробнее
                          <ArrowUpRight size={14} />
                        </span>
                        <span className="text-subtle">{service.deliveryHint}</span>
                      </div>
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

function ServiceCardImage({ service }: { service: (typeof servicesCatalog)[number] }) {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-surface-raised to-border-bright">
      {service.image ? (
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="grid h-full w-full place-items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-brand opacity-60">
            <ServiceIcon name={service.icon} size={28} />
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-surface-raised/80 via-transparent to-transparent" />
      <div className="absolute bottom-3 left-3">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white shadow-lg shadow-brand/30">
          <ServiceIcon name={service.icon} size={16} />
        </div>
      </div>
    </div>
  );
}

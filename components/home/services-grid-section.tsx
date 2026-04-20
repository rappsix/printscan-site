import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { servicesCatalog } from "@/content/services-catalog";
import { SectionHeading } from "@/components/ui/section-heading";
import { SiteContainer } from "@/components/ui/site-container";
import { ServiceIcon } from "@/components/icons/service-icon";
import { TiltCard } from "@/components/ui/tilt-card";
import { RippleCard } from "@/components/ui/ripple-card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function ServicesGridSection() {
  return (
    <section id="services" className="relative py-20 sm:py-28">
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
                    className="group relative flex h-full flex-col gap-5 overflow-hidden rounded-2xl border border-border bg-surface-raised/60 p-7 transition-all duration-300 hover:border-brand/60 hover:bg-surface-raised"
                  >
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand">
                      <ServiceIcon name={service.icon} size={22} />
                    </div>
                    <div className="flex-1 space-y-3">
                      <h3 className="text-xl font-semibold leading-tight text-foreground">
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

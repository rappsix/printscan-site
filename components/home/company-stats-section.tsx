import { companyStats } from "@/content/company-stats";
import { SiteContainer } from "@/components/ui/site-container";

export function CompanyStatsSection() {
  return (
    <section className="border-y border-border/60 bg-surface/60 py-16">
      <SiteContainer>
        <div className="mx-auto grid max-w-2xl gap-8 sm:grid-cols-3">
          {companyStats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-2">
              <p className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
                {stat.value}
              </p>
              <p className="text-sm uppercase tracking-[0.18em] text-muted">
                {stat.label}
              </p>
              {stat.hint ? (
                <p className="text-sm text-subtle">{stat.hint}</p>
              ) : null}
            </div>
          ))}
        </div>
      </SiteContainer>
    </section>
  );
}

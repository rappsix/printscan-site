import { processStages } from "@/content/process-stages";
import { SectionHeading } from "@/components/ui/section-heading";
import { SiteContainer } from "@/components/ui/site-container";

export function ProcessStepsSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <SiteContainer>
        <SectionHeading
          eyebrow="Как мы работаем"
          title={
            <>
              Прозрачный процесс —{" "}
              <span className="text-brand">от заявки до сдачи</span>
            </>
          }
          description="Согласуем ТЗ, отправляем смету и фиксируем сроки до старта. Вы
          всегда знаете, на каком этапе находится ваш заказ."
        />

        <ol className="mt-14 grid gap-5 lg:grid-cols-5">
          {processStages.map((stage, index) => (
            <li
              key={stage.number}
              className="relative flex h-full flex-col gap-4 rounded-2xl border border-border bg-surface-raised/60 p-6"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-brand">{stage.number}</span>
                <span className="h-px flex-1 bg-border" />
                {index < processStages.length - 1 ? (
                  <span className="hidden text-brand lg:inline">→</span>
                ) : null}
              </div>
              <h3 className="text-lg font-semibold leading-tight text-foreground">
                {stage.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted">
                {stage.description}
              </p>
            </li>
          ))}
        </ol>
      </SiteContainer>
    </section>
  );
}

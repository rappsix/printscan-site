"use client";

import { motion } from "motion/react";
import { processStages } from "@/content/process-stages";
import { SectionHeading } from "@/components/ui/section-heading";
import { SiteContainer } from "@/components/ui/site-container";
import { SectionOrb } from "@/components/ui/section-orb-lazy";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

export function ProcessStepsSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-14 -left-14 h-72 w-72 opacity-[0.15]">
        <SectionOrb variant="octahedron" />
      </div>

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

        <motion.ol
          className="mt-14 grid gap-5 lg:grid-cols-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {processStages.map((stage, index) => (
            <motion.li
              key={stage.number}
              variants={cardVariants}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{
                y: -6,
                boxShadow: "0 0 0 1px rgb(232 100 27 / 0.5), 0 8px 32px rgb(232 100 27 / 0.12)",
                transition: { duration: 0.2 },
              }}
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
            </motion.li>
          ))}
        </motion.ol>
      </SiteContainer>
    </section>
  );
}

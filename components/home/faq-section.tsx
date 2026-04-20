"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqEntries } from "@/content/faq-entries";
import { SectionHeading } from "@/components/ui/section-heading";
import { SiteContainer } from "@/components/ui/site-container";
import { cn } from "@/lib/class-merger";
import { SectionOrb } from "@/components/ui/section-orb-lazy";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative overflow-hidden border-t border-border/60 bg-surface/40 py-20 sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute -right-12 top-1/4 h-64 w-64 opacity-[0.32]">
        <SectionOrb variant="torus" />
      </div>
      <SiteContainer className="max-w-4xl">
        <SectionHeading
          align="center"
          eyebrow="Вопросы"
          title={
            <>
              Часто <span className="text-brand">спрашивают</span>
            </>
          }
          description="Собрали ответы на типовые вопросы клиентов. Не нашли нужного — напишите нам."
          className="mx-auto"
        />

        <div className="mt-12 flex flex-col gap-3">
          {faqEntries.map((entry, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={entry.question}
                className={cn(
                  "overflow-hidden rounded-2xl border bg-surface-raised/50 transition-colors",
                  isOpen ? "border-brand/50" : "border-border",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-base font-medium text-foreground sm:text-lg">
                    {entry.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={cn(
                      "shrink-0 text-muted transition-transform",
                      isOpen && "rotate-180 text-brand",
                    )}
                  />
                </button>
                {isOpen ? (
                  <div className="px-6 pb-6 text-sm leading-relaxed text-muted sm:text-base">
                    {entry.answer}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </SiteContainer>
    </section>
  );
}

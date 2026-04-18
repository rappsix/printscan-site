import type { ReactNode } from "react";
import { cn } from "@/lib/class-merger";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center items-center" : "text-left";
  return (
    <header className={cn("flex flex-col gap-4 max-w-3xl", alignment, className)}>
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-brand">
          <span className="h-px w-8 bg-brand" />
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="text-base text-muted sm:text-lg">{description}</p>
      ) : null}
    </header>
  );
}

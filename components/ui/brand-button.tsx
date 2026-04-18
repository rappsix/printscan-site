import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/class-merger";

type Variant = "primary" | "ghost" | "outline";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-brand text-white hover:bg-brand-hover shadow-[0_0_0_1px_rgba(255,90,31,0.4)]",
  ghost:
    "bg-surface-raised text-foreground hover:bg-border-bright border border-border",
  outline:
    "border border-border-bright text-foreground hover:border-brand hover:text-brand",
};

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60 disabled:cursor-not-allowed";

interface BaseProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

type LinkProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    as?: "link";
  };

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as: "button";
    href?: never;
  };

export function BrandButton(props: LinkProps | ButtonProps) {
  const { variant = "primary", className, children } = props;
  const merged = cn(baseStyles, variantStyles[variant], className);

  if (props.as === "button") {
    const { as: _as, variant: _variant, className: _cn, children: _children, ...rest } = props;
    return (
      <button className={merged} {...rest}>
        {children}
      </button>
    );
  }

  const { as: _as, variant: _variant, className: _cn, children: _children, href, ...rest } = props;
  const isExternal = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");

  if (isExternal) {
    return (
      <a href={href} className={merged} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={merged}>
      {children}
    </Link>
  );
}

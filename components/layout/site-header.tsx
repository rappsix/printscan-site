"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { companyInfo } from "@/content/company-info";
import { cn } from "@/lib/class-merger";
import { BrandButton } from "@/components/ui/brand-button";
import { useContactModal } from "@/components/lead-capture/modal-provider";
import { primaryNavLinks } from "./main-navigation";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { openModal } = useContactModal();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <Image
            src="/logo.png"
            alt={companyInfo.name}
            width={44}
            height={44}
            className="drop-shadow-[0_0_8px_rgba(255,90,31,0.5)]"
          />
          <span className="hidden sm:inline">{companyInfo.name}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {primaryNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div className="flex flex-col items-end gap-0.5">
            <a
              href={`tel:${companyInfo.phoneClean}`}
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              <Phone size={16} />
              {companyInfo.phone}
            </a>
            <a
              href={`tel:${companyInfo.phone2Clean}`}
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              <Phone size={16} />
              {companyInfo.phone2}
            </a>
          </div>
          <BrandButton as="button" onClick={openModal} variant="primary" className="py-2 text-sm">
            Оставить заявку
          </BrandButton>
        </div>

        <button
          type="button"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setOpen((value) => !value)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-surface-raised text-foreground md:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-border/60 bg-background md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <div className="flex flex-col gap-1 px-5 py-4">
          {primaryNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm text-muted transition-colors hover:bg-surface-raised hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-border/60 pt-4">
            <a
              href={`tel:${companyInfo.phoneClean}`}
              className="inline-flex items-center gap-2 text-sm text-muted"
            >
              <Phone size={16} />
              {companyInfo.phone}
            </a>
            <a
              href={`tel:${companyInfo.phone2Clean}`}
              className="inline-flex items-center gap-2 text-sm text-muted"
            >
              <Phone size={16} />
              {companyInfo.phone2}
            </a>
            <BrandButton as="button" onClick={openModal} className="w-full py-2 text-sm">
              Оставить заявку
            </BrandButton>
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import type { ReactNode } from "react";
import { BrandButton } from "@/components/ui/brand-button";
import { useContactModal } from "./modal-provider";

interface OpenModalButtonProps {
  children: ReactNode;
  variant?: "primary" | "ghost" | "outline";
  className?: string;
}

export function OpenModalButton({ children, variant, className }: OpenModalButtonProps) {
  const { openModal } = useContactModal();
  return (
    <BrandButton as="button" onClick={openModal} variant={variant} className={className}>
      {children}
    </BrandButton>
  );
}

"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { ContactModal } from "./contact-modal";

interface ModalContextValue {
  openModal: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function useContactModal(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useContactModal must be used inside ContactModalProvider");
  return ctx;
}

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  return (
    <ModalContext.Provider value={{ openModal }}>
      {children}
      <ContactModal isOpen={isOpen} onClose={closeModal} />
    </ModalContext.Provider>
  );
}

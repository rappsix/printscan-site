"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Loader2, MessageCircle, Phone, Send, X } from "lucide-react";
import { contactLeadSchema, type ContactLead } from "@/lib/lead-capture/schema";
import { cn } from "@/lib/class-merger";
import { companyInfo } from "@/content/company-info";
import { trackGoal } from "@/lib/analytics";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactLead>({ resolver: zodResolver(contactLeadSchema) });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.close();
      reset();
      setStatus("idle");
      setErrorMessage("");
    }
  }, [isOpen, reset]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [onClose]);

  useEffect(() => {
    if (status !== "success") return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [status, onClose]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) onClose();
  }

  async function onSubmit(data: ContactLead) {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      trackGoal("form_submit");
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Не удалось отправить заявку. Попробуйте ещё раз.");
    }
  }

  const inputClass = (hasError: boolean) =>
    cn(
      "w-full rounded-xl border bg-surface-raised px-4 py-3 text-sm outline-none transition-colors placeholder:text-subtle focus:border-brand disabled:opacity-60",
      hasError ? "border-red-500/70" : "border-border"
    );

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      aria-labelledby="modal-title"
      className="m-auto w-full max-w-md overflow-hidden rounded-2xl border border-border bg-[#0d1017] p-0 text-foreground shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 id="modal-title" className="text-base font-semibold">
          Оставить заявку
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="grid h-8 w-8 place-items-center rounded-lg text-subtle transition-colors hover:bg-surface-raised hover:text-foreground"
        >
          <X size={16} />
        </button>
      </div>

      {status === "success" ? (
        <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
          <CheckCircle className="text-brand" size={44} />
          <p className="text-base font-semibold">Заявка отправлена!</p>
          <p className="text-sm text-subtle">Свяжемся с вами в течение рабочего дня.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5 px-6 py-6">
          <input
            {...register("honeypot")}
            type="text"
            tabIndex={-1}
            aria-hidden="true"
            className="absolute -left-[9999px] opacity-0"
            autoComplete="off"
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="modal-name" className="text-sm font-medium">
              Имя <span className="text-brand">*</span>
            </label>
            <input
              {...register("name")}
              id="modal-name"
              type="text"
              autoComplete="name"
              placeholder="Иван Петров"
              disabled={status === "loading"}
              className={inputClass(!!errors.name)}
            />
            {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="modal-phone" className="text-sm font-medium">
              Телефон <span className="text-brand">*</span>
            </label>
            <input
              {...register("phone")}
              id="modal-phone"
              type="tel"
              autoComplete="tel"
              placeholder="+7 (999) 123-45-67"
              disabled={status === "loading"}
              className={inputClass(!!errors.phone)}
            />
            {errors.phone && <p className="text-xs text-red-400">{errors.phone.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="modal-message" className="text-sm font-medium">
              Сообщение{" "}
              <span className="text-xs font-normal text-subtle">(опционально)</span>
            </label>
            <textarea
              {...register("message")}
              id="modal-message"
              rows={3}
              placeholder="Опишите вашу задачу..."
              disabled={status === "loading"}
              className="w-full resize-none rounded-xl border border-border bg-surface-raised px-4 py-3 text-sm outline-none transition-colors placeholder:text-subtle focus:border-brand disabled:opacity-60"
            />
          </div>

          {status === "error" && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(255,90,31,0.4)] transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading" ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Отправляем...
              </>
            ) : (
              "Отправить заявку"
            )}
          </button>

          <div className="relative flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-subtle">или свяжитесь сами</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <a
                href={`tel:${companyInfo.phoneClean}`}
                onClick={() => trackGoal("click_phone")}
                className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-surface-raised/60 px-4 py-2.5 text-sm transition-colors hover:border-brand/50 hover:bg-surface-raised"
              >
                <Phone size={15} className="shrink-0 text-brand" />
                <span className="font-medium">{companyInfo.phone}</span>
              </a>
              <a
                href={`tel:${companyInfo.phone2Clean}`}
                onClick={() => trackGoal("click_phone")}
                className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-surface-raised/60 px-4 py-2.5 text-sm transition-colors hover:border-brand/50 hover:bg-surface-raised"
              >
                <Phone size={15} className="shrink-0 text-brand" />
                <span className="font-medium">{companyInfo.phone2}</span>
              </a>
            </div>
            <div className="flex gap-2">
              <a
                href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(companyInfo.whatsappGreeting)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackGoal("click_whatsapp")}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-surface-raised/60 px-4 py-2.5 text-sm transition-colors hover:border-brand/50 hover:bg-surface-raised"
              >
                <MessageCircle size={15} className="shrink-0 text-brand" />
                <span className="font-medium">WhatsApp</span>
              </a>
              <a
                href={`https://t.me/${companyInfo.telegram}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackGoal("click_telegram")}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-surface-raised/60 px-4 py-2.5 text-sm transition-colors hover:border-brand/50 hover:bg-surface-raised"
              >
                <Send size={15} className="shrink-0 text-brand" />
                <span className="font-medium">Telegram</span>
              </a>
            </div>
          </div>
        </form>
      )}
    </dialog>
  );
}

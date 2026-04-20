import type { Metadata } from "next";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Users,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { SiteContainer } from "@/components/ui/site-container";
import { companyInfo } from "@/content/company-info";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Телефон, email, Telegram, WhatsApp и VK мастерской Scan & Print в Пензе. Режим работы.",
};

export default function ContactsPage() {
  return (
    <>
      <section className="relative border-b border-border/60 bg-surface/40 py-20 sm:py-24">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <SiteContainer className="relative max-w-3xl">
          <SectionHeading
            eyebrow="Контакты"
            title={
              <>
                Связаться со{" "}
                <span className="text-brand">Scan &amp; Print</span>
              </>
            }
            description="Звоните или пишите — ответим в течение рабочего дня. Если срочно — WhatsApp или Telegram."
          />
        </SiteContainer>
      </section>

      <section className="py-20 sm:py-24">
        <SiteContainer className="max-w-3xl">
          <div className="flex flex-col gap-10">
            <div className="grid gap-4 sm:grid-cols-2">
              <ContactLink
                icon={<Phone size={20} />}
                label="Телефон"
                value={companyInfo.phone}
                href={`tel:${companyInfo.phoneClean}`}
              />
              <ContactLink
                icon={<Phone size={20} />}
                label="Телефон (городской)"
                value={companyInfo.phone2}
                href={`tel:${companyInfo.phone2Clean}`}
              />
              <ContactLink
                icon={<Mail size={20} />}
                label="Email"
                value={companyInfo.email}
                href={`mailto:${companyInfo.email}`}
              />
              <ContactLink
                icon={<MessageCircle size={20} />}
                label="WhatsApp"
                value="Написать в WhatsApp"
                href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(companyInfo.whatsappGreeting)}`}
                external
              />
              <ContactLink
                icon={<Send size={20} />}
                label="Telegram"
                value={`@${companyInfo.telegram}`}
                href={`https://t.me/${companyInfo.telegram}`}
                external
              />
              <ContactLink
                icon={<Users size={20} />}
                label="VK"
                value={`vk.com/${companyInfo.vk}`}
                href={`https://vk.com/${companyInfo.vk}`}
                external
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoCard
                icon={<MapPin size={16} />}
                label="Адрес"
                value={companyInfo.address}
                hint="Выезд по Пензе и области"
              />
              <InfoCard
                icon={<Clock size={16} />}
                label="Режим работы"
                value={companyInfo.workingHours}
                hint="Заявки принимаем круглосуточно"
              />
            </div>

            <div className="rounded-2xl border border-border bg-surface-raised/40 p-6 text-sm text-muted">
              <p className="font-medium text-foreground">Работа с юрлицами</p>
              <p className="mt-2">
                Оформляем договор, счёт и закрывающие документы. Работаем по
                безналу, принимаем оплату по СБП.
              </p>
            </div>
          </div>
        </SiteContainer>
      </section>
    </>
  );
}

interface ContactLinkProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}

function ContactLink({ icon, label, value, href, external }: ContactLinkProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex items-center gap-4 rounded-2xl border border-border bg-surface-raised/60 px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-brand/60"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-background">
        {icon}
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-xs uppercase tracking-[0.14em] text-subtle">
          {label}
        </span>
        <span className="font-medium text-foreground">{value}</span>
      </span>
    </a>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
}

function InfoCard({ icon, label, value, hint }: InfoCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface-raised/50 p-5">
      <span className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-subtle">
        <span className="text-brand">{icon}</span> {label}
      </span>
      <span className="font-medium text-foreground">{value}</span>
      <span className="text-xs text-muted">{hint}</span>
    </div>
  );
}

import { Mail, MapPin, MessageCircle, Phone, Send, Users } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { SiteContainer } from "@/components/ui/site-container";
import { companyInfo } from "@/content/company-info";

interface ContactChannel {
  label: string;
  value: string;
  href: string;
  icon: React.ReactNode;
  external: boolean;
  cta: string;
}

function buildChannels(): ContactChannel[] {
  return [
    {
      label: "Телефон",
      value: companyInfo.phone,
      href: `tel:${companyInfo.phoneClean}`,
      icon: <Phone size={20} />,
      external: false,
      cta: "Позвонить",
    },
    {
      label: "Телефон (городской)",
      value: companyInfo.phone2,
      href: `tel:${companyInfo.phone2Clean}`,
      icon: <Phone size={20} />,
      external: false,
      cta: "Позвонить",
    },
    {
      label: "WhatsApp",
      value: "Написать в WhatsApp",
      href: `https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(companyInfo.whatsappGreeting)}`,
      icon: <MessageCircle size={20} />,
      external: true,
      cta: "Написать",
    },
    {
      label: "Telegram",
      value: `@${companyInfo.telegram}`,
      href: `https://t.me/${companyInfo.telegram}`,
      icon: <Send size={20} />,
      external: true,
      cta: "Открыть",
    },
    {
      label: "Email",
      value: companyInfo.email,
      href: `mailto:${companyInfo.email}`,
      icon: <Mail size={20} />,
      external: false,
      cta: "Написать",
    },
    {
      label: "VK",
      value: `vk.com/${companyInfo.vk}`,
      href: `https://vk.com/${companyInfo.vk}`,
      icon: <Users size={20} />,
      external: true,
      cta: "Открыть",
    },
    {
      label: "Адрес",
      value: companyInfo.address,
      href: `https://yandex.ru/maps/?text=${encodeURIComponent(companyInfo.address)}`,
      icon: <MapPin size={20} />,
      external: true,
      cta: "Маршрут",
    },
  ];
}

export function ContactFormSection() {
  const channels = buildChannels();

  return (
    <section
      id="contacts"
      className="relative border-t border-border/60 bg-surface/60 py-20 sm:py-28"
    >
      <SiteContainer className="max-w-3xl">
        <SectionHeading
          align="center"
          eyebrow="Связаться"
          title={
            <>
              Обсудим <span className="text-brand">вашу задачу</span>
            </>
          }
          description="Выберите удобный способ — ответим в рабочее время. Если срочно — звоните или пишите в мессенджер."
          className="mx-auto"
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {channels.map((channel) => (
            <a
              key={channel.label}
              href={channel.href}
              target={channel.external ? "_blank" : undefined}
              rel={channel.external ? "noopener noreferrer" : undefined}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-surface-raised/60 px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-brand/60 hover:bg-surface-raised"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-background">
                {channel.icon}
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-xs uppercase tracking-[0.14em] text-subtle">
                  {channel.label}
                </span>
                <span className="font-medium text-foreground">
                  {channel.value}
                </span>
              </span>
              <span className="ml-auto text-xs text-brand opacity-0 transition-opacity group-hover:opacity-100">
                {channel.cta} →
              </span>
            </a>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-subtle">
          Работаем {companyInfo.workingHours}. Выезд по Пензе и области.
        </p>
      </SiteContainer>
    </section>
  );
}

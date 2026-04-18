import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { companyInfo } from "@/content/company-info";
import { servicesCatalog } from "@/content/services-catalog";
import { SiteContainer } from "@/components/ui/site-container";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-surface text-muted">
      <SiteContainer className="py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-foreground">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-white">
                S&amp;P
              </span>
              <span className="text-lg font-semibold">{companyInfo.name}</span>
            </Link>
            <p className="text-sm leading-relaxed">{companyInfo.tagline}</p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Услуги</h3>
            <ul className="space-y-2 text-sm">
              {servicesCatalog.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="hover:text-foreground"
                  >
                    {service.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Разделы</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/portfolio" className="hover:text-foreground">Портфолио</Link></li>
              <li><Link href="/blog" className="hover:text-foreground">Блог и кейсы</Link></li>
              <li><Link href="/about" className="hover:text-foreground">О компании</Link></li>
              <li><Link href="/contacts" className="hover:text-foreground">Контакты</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Связь</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`tel:${companyInfo.phoneClean}`}
                  className="inline-flex items-center gap-2 hover:text-foreground"
                >
                  <Phone size={15} />
                  {companyInfo.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="inline-flex items-center gap-2 hover:text-foreground"
                >
                  <Mail size={15} />
                  {companyInfo.email}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(companyInfo.whatsappGreeting)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-foreground"
                >
                  <MessageCircle size={15} />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`https://t.me/${companyInfo.telegram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-foreground"
                >
                  <Send size={15} />
                  Telegram
                </a>
              </li>
              <li>
                <a
                  href={`https://vk.com/${companyInfo.vk}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  VK
                </a>
              </li>
              <li className="inline-flex items-center gap-2">
                <MapPin size={15} />
                {companyInfo.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border/60 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {companyInfo.name}. Все права защищены.</p>
          <p>{companyInfo.workingHours}</p>
        </div>
      </SiteContainer>
    </footer>
  );
}

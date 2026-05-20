import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { companyInfo } from "@/content/company-info";
import { servicesCatalog } from "@/content/services-catalog";
import { SiteContainer } from "@/components/ui/site-container";
import { TrackedLink } from "@/components/analytics/tracked-link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-surface text-muted">
      <SiteContainer className="py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-foreground">
              <Image
                src="/logo.png"
                alt={companyInfo.name}
                width={44}
                height={44}
                className="drop-shadow-[0_0_8px_rgba(255,90,31,0.5)]"
              />
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
                <TrackedLink
                  href={`tel:${companyInfo.phoneClean}`}
                  goal="click_phone"
                  className="inline-flex items-center gap-2 hover:text-foreground"
                >
                  <Phone size={15} />
                  {companyInfo.phone}
                </TrackedLink>
              </li>
              <li>
                <TrackedLink
                  href={`tel:${companyInfo.phone2Clean}`}
                  goal="click_phone"
                  className="inline-flex items-center gap-2 hover:text-foreground"
                >
                  <Phone size={15} />
                  {companyInfo.phone2}
                </TrackedLink>
              </li>
              <li>
                <TrackedLink
                  href={`mailto:${companyInfo.email}`}
                  goal="click_email"
                  className="inline-flex items-center gap-2 hover:text-foreground"
                >
                  <Mail size={15} />
                  {companyInfo.email}
                </TrackedLink>
              </li>
              <li>
                <TrackedLink
                  href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(companyInfo.whatsappGreeting)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  goal="click_whatsapp"
                  className="inline-flex items-center gap-2 hover:text-foreground"
                >
                  <MessageCircle size={15} />
                  WhatsApp
                </TrackedLink>
              </li>
              <li>
                <TrackedLink
                  href={`https://t.me/${companyInfo.telegram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  goal="click_telegram"
                  className="inline-flex items-center gap-2 hover:text-foreground"
                >
                  <Send size={15} />
                  Telegram
                </TrackedLink>
              </li>
              <li>
                <TrackedLink
                  href={`https://vk.com/${companyInfo.vk}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  goal="click_vk"
                  className="inline-flex items-center gap-2 hover:text-foreground"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1.01-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4 8.408 4 8.07c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.779.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.253-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.762-.491h1.744c.525 0 .644.271.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.745-.576.745z"/>
                  </svg>
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

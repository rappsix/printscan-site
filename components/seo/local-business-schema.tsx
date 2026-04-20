import { companyInfo } from "@/content/company-info";

const SITE_URL = "https://scanandprint.ru";

export function LocalBusinessSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: companyInfo.name,
    description: companyInfo.description,
    url: SITE_URL,
    telephone: companyInfo.phoneClean,
    email: companyInfo.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "ул. Нагорный проезд, д. Аа, к. А",
      addressLocality: companyInfo.city,
      addressRegion: companyInfo.region,
      addressCountry: "RU",
    },
    areaServed: companyInfo.region,
    openingHours: "Mo-Fr 09:00-19:00",
    foundingDate: String(companyInfo.founded),
    sameAs: [
      `https://t.me/${companyInfo.telegram}`,
      `https://vk.com/${companyInfo.vk}`,
      `https://wa.me/${companyInfo.whatsapp}`,
    ],
  };

  const serialized = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: serialized }}
    />
  );
}

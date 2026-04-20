import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { YandexMetrika } from "@/components/analytics/yandex-metrika";
import { LocalBusinessSchema } from "@/components/seo/local-business-schema";
import { CursorSpotlight } from "@/components/ui/cursor-spotlight";
import { ScrollProgressBar } from "@/components/ui/scroll-progress-bar";
import { companyInfo } from "@/content/company-info";
import { ContactModalProvider } from "@/components/lead-capture/modal-provider";
import { ScrollSideScene } from "@/components/ui/scroll-side-scene-lazy";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://scanandprint.ru"),
  title: {
    default: `${companyInfo.name} — ${companyInfo.tagline}`,
    template: `%s — ${companyInfo.name}`,
  },
  description: companyInfo.description,
  keywords: [
    "3D печать Пенза",
    "3D сканирование Пенза",
    "реверс-инжиниринг",
    "макеты",
    "3D моделирование",
    "печать пластиком",
    "Scan and Print",
  ],
  authors: [{ name: companyInfo.name }],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: companyInfo.name,
    title: `${companyInfo.name} — ${companyInfo.tagline}`,
    description: companyInfo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: companyInfo.name,
    description: companyInfo.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#06070a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        <LocalBusinessSchema />
        <ScrollProgressBar />
<CursorSpotlight />
        <ScrollSideScene />
        <ContactModalProvider>
          <SiteHeader />
          <main className="relative z-10 flex-1">{children}</main>
          <SiteFooter />
        </ContactModalProvider>
        <YandexMetrika />
      </body>
    </html>
  );
}

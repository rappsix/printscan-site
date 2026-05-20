import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Портфолио",
  description:
    "Примеры работ мастерской Scan & Print: 3D-печать деталей, промышленное сканирование, реверс-инжиниринг, архитектурные макеты.",
  alternates: {
    canonical: "https://scanandprint.ru/portfolio",
  },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import { CompanyStatsSection } from "@/components/home/company-stats-section";
import { ContactFormSection } from "@/components/home/contact-form-section";
import { FaqSection } from "@/components/home/faq-section";
import { PortfolioPreviewSection } from "@/components/home/portfolio-preview-section";
import { ProcessStepsSection } from "@/components/home/process-steps-section";
import { ServicesGridSection } from "@/components/home/services-grid-section";
import { HeroSection } from "@/components/hero/hero-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesGridSection />
      <CompanyStatsSection />
      <ProcessStepsSection />
      <PortfolioPreviewSection />
      <FaqSection />
      <ContactFormSection />
    </>
  );
}

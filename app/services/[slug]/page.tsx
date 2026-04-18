import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailPage } from "@/components/services/service-detail-page";
import { findServiceBySlug, servicesCatalog } from "@/content/services-catalog";

interface ServicePageParams {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return servicesCatalog.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: ServicePageParams): Promise<Metadata> {
  const { slug } = await params;
  const service = findServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.tagline,
    openGraph: {
      title: service.title,
      description: service.tagline,
    },
  };
}

export default async function ServicePage({ params }: ServicePageParams) {
  const { slug } = await params;
  const service = findServiceBySlug(slug);
  if (!service) notFound();
  return <ServiceDetailPage service={service} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailPage } from "@/components/services/service-detail-page";
import { findServiceBySlug, servicesCatalog } from "@/content/services-catalog";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

const SITE_URL = "https://scanprint58.ru";

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
    description: service.description,
    alternates: {
      canonical: `${SITE_URL}/services/${slug}`,
    },
    openGraph: {
      title: service.title,
      description: service.description,
      images: service.image ? [{ url: service.image, alt: service.title }] : undefined,
    },
  };
}

export default async function ServicePage({ params }: ServicePageParams) {
  const { slug } = await params;
  const service = findServiceBySlug(slug);
  if (!service) notFound();
  return (
    <>
      <BreadcrumbSchema
        items={[{ name: service.shortTitle, path: `/services/${slug}` }]}
      />
      <ServiceDetailPage service={service} />
    </>
  );
}

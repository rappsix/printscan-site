import type { MetadataRoute } from "next";
import { blogEntries } from "@/content/blog-entries";
import { portfolioProjects } from "@/content/portfolio-projects";
import { servicesCatalog } from "@/content/services-catalog";

const SITE_URL = "https://scanandprint.ru";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/about`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/portfolio`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/contacts`, lastModified, changeFrequency: "monthly", priority: 0.6 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = servicesCatalog.map((service) => ({
    url: `${SITE_URL}/services/${service.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const portfolioRoutes: MetadataRoute.Sitemap = portfolioProjects.map((project) => ({
    url: `${SITE_URL}/portfolio/${project.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogEntries.map((entry) => ({
    url: `${SITE_URL}/blog/${entry.slug}`,
    lastModified: new Date(entry.publishedAt),
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...serviceRoutes, ...portfolioRoutes, ...blogRoutes];
}

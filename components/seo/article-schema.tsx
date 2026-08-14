const SITE_URL = "https://scanprint58.ru";

interface ArticleSchemaProps {
  title: string;
  description: string;
  publishedAt: string;
  path: string;
}

export function ArticleSchema({ title, description, publishedAt, path }: ArticleSchemaProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished: publishedAt,
    dateModified: publishedAt,
    url: `${SITE_URL}${path}`,
    author: {
      "@type": "Organization",
      name: "Scan & Print",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Scan & Print",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}${path}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

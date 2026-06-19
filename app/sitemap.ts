import type { MetadataRoute } from "next";
import { blogArticles } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://aiinvention.tech";
  const now = new Date();

  return [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    ...blogArticles.map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: new Date(article.date),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/terms-and-conditions`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];
}

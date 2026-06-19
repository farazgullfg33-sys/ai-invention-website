import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://aiinvention.tech";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/client/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

import type { MetadataRoute } from "next";

const siteUrl = process.env.APP_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (siteUrl ?? "").replace(/\/$/, "");

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}

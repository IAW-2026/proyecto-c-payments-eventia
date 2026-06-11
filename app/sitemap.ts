import type { MetadataRoute } from "next";

const siteUrl =
  process.env.APP_URL ?? "https://proyecto-c-payments-eventia.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteUrl.replace(/\/$/, "");

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}

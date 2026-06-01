import type { MetadataRoute } from "next";

const siteUrl =
  process.env.APP_URL ?? "https://proyecto-c-payments-eventia.vercel.app";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteUrl.replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/",
        "/vendedor",
        "/vendedor/",
        "/comprador",
        "/comprador/",
        "/sign-in",
        "/sign-in/",
        "/post-login",
        "/api/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

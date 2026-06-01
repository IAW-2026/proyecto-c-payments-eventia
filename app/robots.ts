import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.APP_URL ?? "https://proyecto-c-payments-eventia.vercel.app";
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

import type { MetadataRoute } from "next";

const SITE_URL = "https://ogoouehabita.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/favoris", "/mes-annonces", "/mes-demandes"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

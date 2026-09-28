import type { MetadataRoute } from "next";
import { properties } from "@/data/properties";
import { lands } from "@/data/land";
import { agencies } from "@/data/agencies";

const SITE_URL = "https://ogoouehabita.vercel.app";

const STATIC_ROUTES = [
  "",
  "/acheter",
  "/louer",
  "/terrains",
  "/recherche",
  "/diaspora",
  "/professionnels",
  "/neuf",
  "/publier",
  "/agences",
  "/aide",
  "/connexion",
  "/inscription",
  "/legal/mentions-legales",
  "/legal/confidentialite",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));

  const propertyEntries: MetadataRoute.Sitemap = properties.map((property) => ({
    url: `${SITE_URL}/bien/${property.slug}`,
    lastModified: new Date(),
  }));

  const passportEntries: MetadataRoute.Sitemap = properties
    .filter((property) => property.passportScore !== undefined && property.reference !== undefined)
    .map((property) => ({
      url: `${SITE_URL}/bien/${property.slug}/passeport`,
      lastModified: new Date(),
    }));

  const landEntries: MetadataRoute.Sitemap = lands.map((land) => ({
    url: `${SITE_URL}/terrains/${land.slug}`,
    lastModified: new Date(),
  }));

  const agencyEntries: MetadataRoute.Sitemap = agencies.map((agency) => ({
    url: `${SITE_URL}/agences/${agency.slug}`,
    lastModified: new Date(),
  }));

  return [
    ...staticEntries,
    ...propertyEntries,
    ...passportEntries,
    ...landEntries,
    ...agencyEntries,
  ];
}

import type { Agency } from "@/lib/types";

export const agencies: Agency[] = [
  {
    slug: "ogooue-prestige-immobilier",
    name: "Agence Ogooué Prestige",
    initials: "OG",
    city: "Libreville",
    badgeClass: "bg-secondary-fixed text-on-secondary-fixed",
  },
  {
    slug: "gabon-habitat-direct",
    name: "Gabon Habitat Direct",
    initials: "OH",
    city: "Libreville",
    badgeClass: "bg-ogooue-blue text-on-primary",
  },
  {
    slug: "ogooue-foncier-national",
    name: "Ogooué Foncier National",
    initials: "OF",
    city: "Libreville",
    badgeClass: "bg-primary text-on-primary",
  },
];

export function agencyByInitials(initials: string): Agency | undefined {
  return agencies.find((agency) => agency.initials === initials);
}

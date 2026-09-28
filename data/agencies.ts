import type { Agency } from "@/lib/types";

export const agencies: Agency[] = [
  {
    slug: "ogooue-prestige-immobilier",
    name: "Agence Ogooué Prestige",
    initials: "OG",
    city: "Libreville",
    badgeClass: "bg-secondary-fixed text-on-secondary-fixed",
    phone: "+241 74 01 02 03",
    rccmNumber: "RCCM LBV 2018 B 14872",
  },
  {
    slug: "gabon-habitat-direct",
    name: "Gabon Habitat Direct",
    initials: "OH",
    city: "Libreville",
    badgeClass: "bg-ogooue-blue text-on-primary",
    phone: "+241 65 11 22 33",
    rccmNumber: "RCCM LBV 2020 B 19045",
  },
  {
    slug: "ogooue-foncier-national",
    name: "Ogooué Foncier National",
    initials: "OF",
    city: "Libreville",
    badgeClass: "bg-primary text-on-primary",
    phone: "+241 77 44 55 66",
    rccmNumber: "RCCM LBV 2016 B 09931",
  },
];

export function agencyByInitials(initials: string): Agency | undefined {
  return agencies.find((agency) => agency.initials === initials);
}

export type ListingField = { code: string; label: string; type: "number" | "boolean" | "text"; required?: boolean };

const housing: ListingField[] = [
  { code: "bathrooms", label: "Salles de bain", type: "number" },
  { code: "rooms", label: "Nombre de pièces", type: "number" },
  { code: "parking", label: "Places de stationnement", type: "number" },
  { code: "furnished", label: "Meublé", type: "boolean" },
  { code: "air_conditioning", label: "Climatisation", type: "boolean" },
  { code: "generator", label: "Groupe électrogène", type: "boolean" },
  { code: "water_tank", label: "Réserve d’eau", type: "boolean" },
  { code: "security", label: "Gardiennage / sécurité", type: "boolean" },
];

export const listingFieldsByCategory: Record<string, ListingField[]> = {
  villa: [{ code: "bedrooms", label: "Chambres", type: "number" }, ...housing, { code: "pool", label: "Piscine", type: "boolean" }],
  appartement: [{ code: "bedrooms", label: "Chambres", type: "number" }, ...housing, { code: "floor", label: "Étage", type: "number" }, { code: "elevator", label: "Ascenseur", type: "boolean" }],
  terrain: [{ code: "land_surface_m2", label: "Surface du terrain (m²)", type: "number", required: true }, { code: "land_title", label: "Titre foncier", type: "boolean" }, { code: "surveyed", label: "Borné", type: "boolean" }, { code: "serviced", label: "Viabilisé", type: "boolean" }, { code: "access", label: "Type d’accès", type: "text" }],
  local_commercial: [{ code: "rooms", label: "Nombre de pièces", type: "number" }, { code: "parking", label: "Places de stationnement", type: "number" }, { code: "shop_window", label: "Vitrine", type: "boolean" }, { code: "air_conditioning", label: "Climatisation", type: "boolean" }, { code: "generator", label: "Groupe électrogène", type: "boolean" }],
};

export function fieldsForCategory(code: string) {
  return listingFieldsByCategory[code] ?? housing;
}

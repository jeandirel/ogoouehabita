// Real vocabularies used by each vertical's own search form (acheter/louer),
// centralized so the homepage hero search can reuse the exact same option
// lists and category matching instead of drifting out of sync with them.

export const ACHETER_TYPE_OPTIONS = [
  "Villa & Résidence",
  "Appartement de standing",
  "Terrain constructible",
  "Immeuble commercial",
];

// Maps the long, Stitch-sourced option labels above to the short category
// tokens actually stored on `Property.category` (see data/properties.ts).
export const ACHETER_CATEGORY_MAP: Record<string, string> = {
  "Villa & Résidence": "Villa",
  "Appartement de standing": "Appartement",
  "Terrain constructible": "Terrain",
  "Immeuble commercial": "Immeuble",
};

export const LOUER_TYPE_OPTIONS = ["Tous types", "Appartement", "Maison", "Studio", "Villa", "Meublé"];

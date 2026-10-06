// Filter predicates shared between each results page's server-rendered
// curated pool and its client-rendered merge of locally-published listings —
// keeping the exact same rule in one place instead of drifting apart.
import { ACHETER_CATEGORY_MAP, LOUER_TYPE_OPTIONS } from "@/data/property-types";
import type { Property } from "./types";

// ---------------------------------------------------------------------------
// Helpers: extraction of numeric specs from the label-based Property model.
// ---------------------------------------------------------------------------

function bedroomCount(property: Property): number {
  const spec = property.specs.find((s) => /chambres?/i.test(s.label));
  if (!spec) return 0;
  const match = spec.label.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function bathroomCount(property: Property): number {
  const spec = property.specs.find((s) => /sdb|salles de bain|toilettes/i.test(s.label));
  if (!spec) return 0;
  const match = spec.label.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

export function surfaceArea(property: Property): number {
  const spec = property.specs.find((s) => /m²/.test(s.label));
  if (!spec) return 0;
  const digits = spec.label.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

/** Prix au m² du bien, calculable uniquement lorsqu'une surface est disponible.
 *  Retourne `null` pour les terrains (surface = 0) et autres cas non calculables. */
export function pricePerSqm(property: Property): number | null {
  const surface = surfaceArea(property);
  if (!surface || surface <= 0) return null;
  return Math.round(property.priceValue / surface);
}

function normalizeType(token: string): string {
  return token.trim();
}

function categoryMatches(property: Property, token: string): boolean {
  const norm = normalizeType(token);
  if (property.category === norm) return true;
  const longLabel = Object.entries(ACHETER_CATEGORY_MAP).find(([, v]) => v === norm)?.[0];
  if (longLabel) return true;
  const text = `${property.title} ${property.location} ${property.category ?? ""}`.toLowerCase();
  const lower = norm.toLowerCase();
  if (lower.includes("villa") && (text.includes("villa") || text.includes("residence"))) return true;
  if (lower.includes("appartement") && text.includes("appartement")) return true;
  if (lower.includes("terrain") && text.includes("terrain")) return true;
  if (lower.includes("maison") && text.includes("maison")) return true;
  if (lower.includes("immeuble") && (text.includes("immeuble") || text.includes("commercial"))) return true;
  if (lower.includes("studio") && (text.includes("studio") || text.includes("piece"))) return true;
  if (lower.includes("bureau") && text.includes("bureau")) return true;
  if (lower.includes("commerce") && text.includes("commerce")) return true;
  return false;
}

// ---------------------------------------------------------------------------
// Acheter filters (extendable — all new fields optional, backward compatible).
// ---------------------------------------------------------------------------

export interface AcheterFilters {
  ville?: string;
  province?: string;
  quartier?: string;
  type?: string;
  budgetMin?: number;
  budgetMax?: number;
  budget?: number; // legacy alias kept for existing callers
  surfaceMin?: number;
  surfaceMax?: number;
  chambresMin?: number;
  sallesDeBainMin?: number;
  piecesMin?: number;
  amenities?: string[];
  tags?: string[];
  shield?: boolean;
  sellerType?: "particulier" | "agence";
  q?: string;
}

export function matchesAcheterFilters(property: Property, f: AcheterFilters): boolean {
  if (f.ville && !property.location.includes(f.ville)) return false;
  if (f.province && property.province !== f.province) return false;
  if (f.quartier && !property.location.includes(f.quartier)) return false;
  if (f.type && !categoryMatches(property, f.type)) return false;
  if (f.budgetMax && property.priceValue > f.budgetMax) return false;
  if (f.budgetMin && property.priceValue < f.budgetMin) return false;
  if (f.budget && property.priceValue > f.budget) return false; // legacy
  const surface = surfaceArea(property);
  if (f.surfaceMin && surface < f.surfaceMin) return false;
  if (f.surfaceMax && surface > f.surfaceMax) return false;
  if (f.chambresMin && bedroomCount(property) < f.chambresMin) return false;
  if (f.sallesDeBainMin && bathroomCount(property) < f.sallesDeBainMin) return false;
  if (f.piecesMin && bedroomCount(property) < f.piecesMin) return false; // pièces ≈ chambres (données actuelles)
  if (f.amenities && f.amenities.length > 0) {
    const terms = f.amenities.map((a) => a.toLowerCase());
    const allText = [...(property.amenities ?? []), ...property.specs.map((s) => s.label)].join(" ").toLowerCase();
    if (!terms.some((t) => allText.includes(t))) return false;
  }
  if (f.tags && f.tags.length > 0) {
    if (!f.tags.some((t) => (property.badges ?? []).some((b) => b.toLowerCase().includes(t.toLowerCase())))) return false;
  }
  if (f.shield && property.passportScore !== 100) return false;
  if (f.sellerType === "particulier" && property.agencyInitials) return false;
  if (f.sellerType === "agence" && !property.agencyInitials) return false;
  if (f.q && !`${property.title} ${property.location}`.toLowerCase().includes(f.q)) return false;
  return true;
}

// ---------------------------------------------------------------------------
// Louer filters (extendable — all new fields optional, backward compatible).
// ---------------------------------------------------------------------------

export interface LouerFilters {
  type?: string;
  locationIncludes?: string;
  province?: string;
  quartier?: string;
  budgetMax?: number;
  budget?: number; // legacy alias kept for existing callers
  budgetMin?: number;
  surfaceMin?: number;
  surfaceMax?: number;
  chambresMin?: number;
  sallesDeBainMin?: number;
  amenities?: string[];
  meuble?: boolean;
  q?: string;
}

export function matchesLouerFilters(property: Property, f: LouerFilters): boolean {
  if (f.type && !louerTypeMatches(property, f.type)) return false;
  if (f.locationIncludes && !property.location.includes(f.locationIncludes)) return false;
  if (f.province && property.province !== f.province) return false;
  if (f.quartier && !property.location.includes(f.quartier)) return false;
  if (f.budgetMax && property.priceValue > f.budgetMax) return false;
  if (f.budgetMin && property.priceValue < f.budgetMin) return false;
  if (f.budget && property.priceValue > f.budget) return false; // legacy
  const surface = surfaceArea(property);
  if (f.surfaceMin && surface < f.surfaceMin) return false;
  if (f.surfaceMax && surface > f.surfaceMax) return false;
  if (f.chambresMin && bedroomCount(property) < f.chambresMin) return false;
  if (f.sallesDeBainMin && bathroomCount(property) < f.sallesDeBainMin) return false;
  if (f.amenities && f.amenities.length > 0) {
    const terms = f.amenities.map((a) => a.toLowerCase());
    const allText = [...(property.amenities ?? []), ...property.specs.map((s) => s.label)].join(" ").toLowerCase();
    if (!terms.some((t) => allText.includes(t))) return false;
  }
  if (f.meuble && property.tag !== "Meublé" && property.category !== "Meublé") return false;
  if (f.q && !`${property.title} ${property.location}`.toLowerCase().includes(f.q)) return false;
  return true;
}

function louerTypeMatches(property: Property, token: string): boolean {
  if (!token || token === "Tous types") return true;
  const norm = token.trim().toLowerCase();
  if (property.category?.toLowerCase() === norm) return true;
  if (property.tag?.toLowerCase() === norm) return true;
  if (norm === "appartement" && property.category === "Appartement") return true;
  if (norm === "maison" && property.category === "Maison") return true;
  if (norm === "studio" && property.category === "Studio") return true;
  if (norm === "villa" && property.category === "Villa") return true;
  if (norm === "meublé") return property.tag === "Meublé";
  const text = `${property.title} ${property.category ?? ""} ${property.tag ?? ""}`.toLowerCase();
  if (norm.includes("appart") && text.includes("appartement")) return true;
  if (norm.includes("villa") && text.includes("villa")) return true;
  if (norm.includes("studio")) return text.includes("studio");
  return false;
}

// ---------------------------------------------------------------------------
// Recherche page chips (unchanged logic — preserved for backward compatibility).
// ---------------------------------------------------------------------------

export interface RechercheChips {
  villa: boolean;
  budget: boolean;
  chambres: boolean;
  surface: boolean;
  shield: boolean;
  piscine: boolean;
  vue: boolean;
}

export interface RechercheFilters {
  transactionType: Property["transactionType"];
  province?: string;
  q?: string;
  chips: RechercheChips;
}

export function matchesRechercheFilters(property: Property, f: RechercheFilters): boolean {
  if (property.transactionType !== f.transactionType) return false;
  if (f.province && property.province !== f.province) return false;
  if (f.q && !`${property.title} ${property.location}`.toLowerCase().includes(f.q)) return false;
  const { chips } = f;
  if (chips.villa && !["Villa", "Maison"].includes(property.category ?? "")) return false;
  if (chips.budget && (property.priceValue < 50_000_000 || property.priceValue > 250_000_000)) return false;
  if (chips.chambres && bedroomCount(property) < 4) return false;
  if (chips.surface && surfaceArea(property) < 300) return false;
  if (chips.shield && property.passportScore !== 100) return false;
  if (chips.piscine && !property.amenities?.some((a) => /piscine/i.test(a))) return false;
  if (chips.vue && !property.amenities?.some((a) => /vue/i.test(a))) return false;
  return true;
}

// ---------------------------------------------------------------------------
// Sorting: pertinence / plus récent (stable, no publication dates in seeded data)
// / prix asc-déc / surface asc-déc.
// ---------------------------------------------------------------------------

export type PropertySort = "pertinence" | "recent" | "prix-asc" | "prix-desc" | "surface-asc" | "surface-desc";

export function sortProperties<T extends Property>(items: T[], sort: PropertySort): T[] {
  if (!items.length) return items;
  const clone = [...items];
  switch (sort) {
    case "pertinence":
    case "recent":
      return clone;
    case "prix-asc":
      return clone.sort((a, b) => a.priceValue - b.priceValue);
    case "prix-desc":
      return clone.sort((a, b) => b.priceValue - a.priceValue);
    case "surface-asc":
      return clone.sort((a, b) => surfaceArea(a) - surfaceArea(b));
    case "surface-desc":
      return clone.sort((a, b) => surfaceArea(b) - surfaceArea(a));
    default:
      return clone;
  }
}

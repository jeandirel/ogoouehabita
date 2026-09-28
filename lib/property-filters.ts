// Filter predicates shared between each results page's server-rendered
// curated pool and its client-rendered merge of locally-published listings —
// keeping the exact same rule in one place instead of drifting apart.
import { ACHETER_CATEGORY_MAP } from "@/data/property-types";
import type { Property } from "./types";

export interface AcheterFilters {
  ville?: string;
  province?: string;
  type?: string;
  budget?: number;
  q?: string;
}

export function matchesAcheterFilters(property: Property, f: AcheterFilters): boolean {
  if (f.ville && !property.location.includes(f.ville)) return false;
  if (f.province && property.province !== f.province) return false;
  if (f.type && property.category !== ACHETER_CATEGORY_MAP[f.type]) return false;
  if (f.budget && property.priceValue > f.budget) return false;
  if (f.q && !`${property.title} ${property.location}`.toLowerCase().includes(f.q)) return false;
  return true;
}

export interface LouerFilters {
  type?: string;
  locationIncludes?: string;
  province?: string;
  budget?: number;
}

export function matchesLouerFilters(property: Property, f: LouerFilters): boolean {
  if (f.type && f.type !== "Tous types") {
    if (property.category !== f.type && property.tag !== f.type) return false;
  }
  if (f.locationIncludes && !property.location.includes(f.locationIncludes)) return false;
  if (f.province && property.province !== f.province) return false;
  if (f.budget && property.priceValue > f.budget) return false;
  return true;
}

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

function bedroomCount(property: Property): number {
  const spec = property.specs.find((s) => /chambres?/i.test(s.label));
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

export function sortByPrice<T extends Property>(items: T[], sort: string): T[] {
  if (sort === "prix-asc") return [...items].sort((a, b) => a.priceValue - b.priceValue);
  if (sort === "prix-desc") return [...items].sort((a, b) => b.priceValue - a.priceValue);
  return items;
}

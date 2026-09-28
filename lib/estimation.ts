import { surfaceArea } from "@/lib/property-filters";
import type { Property, TransactionType } from "@/lib/types";

export interface EstimationInput {
  transactionType: TransactionType;
  category: string;
  province: string;
  surfaceM2: number;
}

export interface EstimationResult {
  sampleSize: number;
  matchedProvince: boolean;
  pricePerSqm: number;
  estimateLow: number;
  estimateHigh: number;
}

const BAND = 0.15;

// A purely indicative estimator computed from the comparable listings
// already present on the platform (same transaction type + category,
// preferring the same province when enough data exists there) — never
// from fabricated external market data.
export function estimatePrice(properties: Property[], input: EstimationInput): EstimationResult | null {
  const candidates = properties
    .filter((p) => p.transactionType === input.transactionType && p.category === input.category)
    .map((p) => ({ property: p, surface: surfaceArea(p) }))
    .filter((entry) => entry.surface > 0);

  if (candidates.length === 0) return null;

  const inProvince = candidates.filter((entry) => entry.property.province === input.province);
  const pool = inProvince.length > 0 ? inProvince : candidates;

  const pricePerSqm =
    pool.reduce((sum, entry) => sum + entry.property.priceValue / entry.surface, 0) / pool.length;

  const base = pricePerSqm * input.surfaceM2;

  return {
    sampleSize: pool.length,
    matchedProvince: inProvince.length > 0,
    pricePerSqm: Math.round(pricePerSqm),
    estimateLow: Math.round(base * (1 - BAND)),
    estimateHigh: Math.round(base * (1 + BAND)),
  };
}

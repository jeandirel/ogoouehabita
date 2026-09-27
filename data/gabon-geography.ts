import rawGeography from "./gabon_provinces_villes_quartiers.source.json";

// Source: gabon_provinces_villes_quartiers.json, compiled 2026-09-24 from the
// Journal Officiel (loi n°020/2025), municipal sources, and public/press
// sources for complementary (non-official) entries. Kept as a verbatim JSON
// import (not retyped) so the 821 quartier entries can never drift from the
// sourced original. Per the dataset's own methodology: no quartier is ever
// invented — an empty `quartiers` array means "not found in a verifiable
// source", not "this ville has no neighborhoods".
export const GABON_DATA_SOURCE = {
  dateCompilation: rawGeography.date_compilation,
  avertissement: rawGeography.avertissement,
  reglePrincipale: rawGeography.methodologie.regle,
  usageRecommande: rawGeography.methodologie.usage_recommande,
};

export interface GabonVille {
  name: string;
  province: string;
  quartiers: string[];
  couvertureQuartiers?: string;
  source?: string;
  aCompleter: boolean;
  note?: string;
}

export interface GabonProvince {
  name: string;
  villes: GabonVille[];
}

export const GABON_GEOGRAPHY: GabonProvince[] = rawGeography.provinces.map((province) => ({
  name: province.province,
  villes: province.villes.map((ville) => ({
    name: ville.ville,
    province: province.province,
    quartiers: ville.quartiers,
    couvertureQuartiers: ville.couverture_quartiers,
    source: ville.source,
    aCompleter: Boolean(ville.a_completer),
    note: ville.note,
  })),
}));

export const GABON_PROVINCE_NAMES: string[] = GABON_GEOGRAPHY.map((p) => p.name);

export const GABON_VILLES: GabonVille[] = GABON_GEOGRAPHY.flatMap((p) => p.villes);

export function formatVilleLabel(ville: Pick<GabonVille, "name" | "province">): string {
  return `${ville.name} (${ville.province})`;
}

export function getVillesByProvince(provinceName: string): GabonVille[] {
  return GABON_GEOGRAPHY.find((p) => p.name === provinceName)?.villes ?? [];
}

export function getVilleByName(villeName: string): GabonVille | undefined {
  return GABON_VILLES.find((v) => v.name === villeName);
}

export function getQuartiersForVille(villeName: string): string[] {
  return getVilleByName(villeName)?.quartiers ?? [];
}

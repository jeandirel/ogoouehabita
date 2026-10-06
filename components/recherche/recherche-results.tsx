"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import { SearchResultCard } from "@/components/search/search-result-card";
import { usePublishedListings } from "@/data/local/published-listings-store";
import { matchesRechercheFilters, sortProperties, type RechercheFilters } from "@/lib/property-filters";
import { formatCompactFcfa } from "@/lib/format";
import type { Property } from "@/lib/types";

export interface RechercheResultsProps {
  curated: Property[];
  filters: RechercheFilters;
  sort: string;
  activeFilters: Record<string, string | string[]>;
  hasActiveFilters: boolean;
  showMap: boolean;
  sortSelect: ReactNode;
  transactionType: "vente" | "location";
}

function chipLabel(key: string, value: string | string[], t: "vente" | "location"): string {
  const v = Array.isArray(value) ? value : [value];
  switch (key) {
    case "province":
    case "ville":
    case "quartier":
      return v[0];
    case "type":
      return v.join(", ");
    case "budgetMin":
      return `≥ ${formatCompactFcfa(Number(v[0]))} FCFA`;
    case "budgetMax":
      return `≤ ${formatCompactFcfa(Number(v[0]))} FCFA`;
    case "surfaceMin":
      return `≥ ${v[0]} m²`;
    case "surfaceMax":
      return `≤ ${v[0]} m²`;
    case "chambresMin":
      return `${v[0]}+ chambres`;
    case "sallesDeBainMin":
      return `${v[0]}+ SDB`;
    case "shield":
      return "Ogooué Shield";
    case "titreFoncier":
      return "Titre foncier";
    case "particulier":
      return "Particulier";
    case "amenity":
      return v[0];
    default:
      return `${key}: ${v.join(", ")}`;
  }
}

const MAP_TYPES: Record<string, string> = {
  province: "province",
  ville: "ville",
  quartier: "quartier",
  type: "type",
  budgetMin: "budget",
  budgetMax: "budget",
  surfaceMin: "surface",
  surfaceMax: "surface",
  chambresMin: "chambres",
  sallesDeBainMin: "sallesDeBain",
  shield: "shield",
  titreFoncier: "titreFoncier",
  particulier: "seller",
  amenity: "amenity",
};

function SkeletonResults() {
  return (
    <div className="flex flex-col gap-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex h-[190px] w-full animate-pulse items-stretch rounded-2xl border border-outline-variant/70 bg-surface">
          <div className="h-[190px] w-[42%] shrink-0 bg-surface-container/60 sm:w-[39%]" />
          <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
            <div className="h-6 w-1/3 rounded bg-surface-container/60" />
            <div className="h-5 w-1/2 rounded bg-surface-container/60" />
            <div className="h-4 w-3/4 rounded bg-surface-container/60" />
            <div className="mt-2 h-10 w-full rounded-t border-t border-outline-variant/60 pt-3" />
            <div className="mt-auto h-4 w-1/4 rounded bg-surface-container/60" />
          </div>
        </div>
      ))}
    </div>
  );
}
export function RechercheResults({
  curated,
  filters,
  sort,
  activeFilters,
  hasActiveFilters,
  showMap,
  sortSelect,
  transactionType,
}: RechercheResultsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const local = usePublishedListings().filter((listing) => matchesRechercheFilters(listing, filters));
  const merged = sortProperties([...local, ...curated], sort as any);

  const chipsToRender = Object.entries(activeFilters)
    .filter(([k, v]) => {
      if (k === "type" && !Array.isArray(v)) return false;
      return MAP_TYPES[k] !== undefined;
    })
    .map(([k, v]) => ({ key: k, label: chipLabel(k, v, transactionType) }));

  const location = activeFilters.quartier || activeFilters.ville || activeFilters.province;
  const biensLabel = transactionType === "vente" ? "biens à vendre" : "biens à louer";

  return (
    <>
      {/* En-tête de résultats */}
      <div className="flex flex-col gap-3 pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="font-headline-sm font-bold text-on-surface">{merged.length} bien{merged.length > 1 ? "s" : ""}</span>
            {location && (
              <span className="text-body-sm text-on-surface-variant ml-2">
                {biensLabel} {typeof location === "string" ? location : ""}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-xl">
            <span className="text-label-sm text-on-surface-variant">Trier par :</span>
            {sortSelect}
          </div>
        </div>

        {/* Filtres actifs */}
        {chipsToRender.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-mt-8">
            {chipsToRender.map((chip, i) => (
              <div
                key={i}
                className="group flex items-center gap-1.5 rounded-full bg-primary-fixed px-3 py-1.5 text-label-sm font-medium text-primary transition-colors hover:bg-primary-fixed/70"
              >
                <span>{chip.label}</span>
                <button
                  type="button"
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    const val = activeFilters[chip.key as keyof typeof activeFilters];
                    if (Array.isArray(val)) {
                      val.forEach(() => params.delete(chip.key));
                    } else {
                      params.delete(chip.key);
                    }
                    router.push(`/recherche?${params.toString()}`);
                  }}
                  className="rounded-full p-0.5 hover:bg-primary-fixed/50"
                  aria-label={`Effacer le filtre ${chip.label}`}
                >
                  <Icon name="close" className="text-[14px]" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const next = new URLSearchParams(searchParams.toString());
                for (const key of next.keys()) {
                  if (key !== "vue" && key !== "sort") next.delete(key);
                }
                router.push(next.toString() ? `/recherche?${next.toString()}` : "/recherche");
              }}
              className="flex items-center gap-1.5 rounded-full border border-outline-variant bg-surface px-3 py-1.5 text-label-sm font-medium text-on-surface hover:bg-surface-container"
            >
              <Icon name="filter_alt_off" className="text-[16px]" />
              <span>Effacer tout</span>
            </button>
          </div>
        )}

        {/* Switch Liste / Carte */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const next = new URLSearchParams(searchParams.toString());
                next.set("vue", "liste");
                router.push(`/recherche?${next.toString()}`);
              }}
              className={`rounded-lg px-3.5 py-1.5 text-label-md font-bold transition-all ${
                !showMap
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface text-on-surface hover:bg-surface-container"
              }`}
              aria-pressed={!showMap}
            >
              Liste
            </button>
            <button
              type="button"
              onClick={() => {
                const next = new URLSearchParams(searchParams.toString());
                next.set("vue", "carte");
                router.push(`/recherche?${next.toString()}`);
              }}
              className={`rounded-lg px-3.5 py-1.5 text-label-md font-bold transition-all ${
                showMap
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface text-on-surface hover:bg-surface-container"
              }`}
              aria-pressed={!!showMap}
            >
              Carte
            </button>
          </div>
        </div>
      </div>

      {/* Skeleton au chargement */}
      {merged.length === 0 && curated.length === 0 ? (
        <SkeletonResults />
      ) : merged.length > 0 ? (
        <div className="flex flex-col gap-4">
          {merged.map((property) => (
            <SearchResultCard key={property.slug} property={property} />
          ))}
        </div>
      ) : (
        <div className="bg-surface-container-low rounded-xl p-8 text-center text-body-md text-on-surface-variant">
          Aucun bien ne correspond à ces critères.{" "}
          <Link href="/recherche" className="text-primary font-bold hover:underline">
            Réinitialiser la recherche
          </Link>
        </div>
      )}
    </>
  );
}

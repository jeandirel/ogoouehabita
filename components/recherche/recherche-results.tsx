"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { SearchResultCard } from "@/components/search/search-result-card";
import { usePublishedListings } from "@/data/local/published-listings-store";
import { matchesRechercheFilters, sortByPrice, type RechercheFilters } from "@/lib/property-filters";
import type { Property } from "@/lib/types";

export function RechercheResults({
  curated,
  filters,
  sort,
  sortSelect,
}: {
  curated: Property[];
  filters: RechercheFilters;
  sort: string;
  sortSelect: ReactNode;
}) {
  const local = usePublishedListings().filter((listing) => matchesRechercheFilters(listing, filters));
  const merged = sortByPrice([...local, ...curated], sort);

  return (
    <>
      <div className="flex items-center justify-between pb-2">
        <div>
          <span className="font-headline-sm font-bold text-on-surface">{merged.length} biens</span>
          <span className="text-body-sm text-on-surface-variant ml-2">trouvés à Libreville</span>
        </div>
        <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-xl">
          <span className="text-label-sm text-on-surface-variant">Trier par :</span>
          {sortSelect}
        </div>
      </div>
      {merged.length > 0 ? (
        merged.map((property) => <SearchResultCard key={property.slug} property={property} />)
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

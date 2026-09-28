"use client";

import Link from "next/link";
import { BuyListingCard } from "@/components/property/buy-listing-card";
import { usePublishedListings } from "@/data/local/published-listings-store";
import { matchesAcheterFilters, type AcheterFilters } from "@/lib/property-filters";
import type { Property } from "@/lib/types";

export function AcheterResults({
  curated,
  filters,
  isFiltered,
}: {
  curated: Property[];
  filters: AcheterFilters;
  isFiltered: boolean;
}) {
  const local = usePublishedListings().filter(
    (listing) => listing.transactionType === "vente" && matchesAcheterFilters(listing, filters),
  );
  const results = [...local, ...curated];

  if (results.length === 0) {
    return (
      <div className="bg-surface-container-low rounded-xl p-8 text-center text-body-md text-on-surface-variant">
        Aucun bien ne correspond à ces critères pour le moment.{" "}
        <Link href="/acheter" className="text-primary font-bold hover:underline">
          Réinitialiser la recherche
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
        {results.map((property) => (
          <BuyListingCard key={property.slug} property={property} />
        ))}
      </div>
      {isFiltered && (
        <p className="text-body-sm text-on-surface-variant mt-4">
          Filtre actif — {results.length} bien(s) affiché(s).{" "}
          <Link href="/acheter" className="text-primary font-bold hover:underline">
            Voir tous les biens
          </Link>
        </p>
      )}
    </>
  );
}

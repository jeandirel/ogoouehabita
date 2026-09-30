"use client";

import Link from "next/link";
import { RentListingCard } from "@/components/property/rent-listing-card";
import { usePublishedListings } from "@/data/local/published-listings-store";
import { matchesLouerFilters, type LouerFilters } from "@/lib/property-filters";
import type { Property } from "@/lib/types";

export function LouerResults({ curated, filters }: { curated: Property[]; filters: LouerFilters }) {
  const local = usePublishedListings().filter(
    (listing) => listing.transactionType === "location" && matchesLouerFilters(listing, filters),
  );
  const results = [...local, ...curated];

  if (results.length === 0) {
    return (
      <div className="bg-surface-container-low rounded-xl p-8 text-center text-body-md text-on-surface-variant">
        Aucune location ne correspond à ces critères pour le moment.{" "}
        <Link href="/louer" className="text-primary font-bold hover:underline">
          Réinitialiser
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {results.map((property) => (
        <RentListingCard key={property.slug} property={property} />
      ))}
    </div>
  );
}

"use client";

import { PropertyCard } from "@/components/property/property-card";
import { usePublishedListings } from "@/data/local/published-listings-store";
import { properties } from "@/data/properties";

// The three properties the validated Stitch "Accueil" screen actually shows —
// kept as an explicit allowlist (matching the pattern already used by
// /acheter, /louer and /recherche) so the homepage grid stays pixel-faithful
// even though `data/properties.ts` also holds every other page's listings.
const HOME_SLUGS = [
  "villa-exception-vue-mer-batterie-iv",
  "appartement-standing-securise-angondje",
  "terrain-borne-titre-ntoum",
];

const MAX_LOCAL_ON_HOME = 3;

export function PropertyGrid() {
  const local = usePublishedListings();
  const curated = properties.filter((property) => HOME_SLUGS.includes(property.slug));
  const newest = [...local]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, MAX_LOCAL_ON_HOME);

  return (
    <>
      {newest.length > 0 && (
        <p className="text-label-md text-laterite font-bold uppercase tracking-wider mb-4">
          {newest.length} nouvelle{newest.length > 1 ? "s" : ""} annonce{newest.length > 1 ? "s" : ""}{" "}
          publiée{newest.length > 1 ? "s" : ""} sur cet appareil
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[...newest, ...curated].map((property) => (
          <PropertyCard key={property.slug} property={property} />
        ))}
      </div>
    </>
  );
}

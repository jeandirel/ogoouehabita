"use client";

import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { Icon } from "@/components/ui/icon";
import { SearchResultCard } from "@/components/search/search-result-card";
import { useFavorites } from "@/components/providers/favorites-provider";
import { properties } from "@/data/properties";

export default function FavorisPage() {
  const { favoriteIds } = useFavorites();
  const favoriteProperties = properties.filter((property) => favoriteIds.includes(property.slug));

  return (
    <SiteShell>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-space-xl w-full">
        <div className="mb-space-lg">
          <div className="text-label-md text-secondary font-bold uppercase tracking-wider mb-2">
            Mon espace
          </div>
          <h1 className="font-headline-xl text-on-surface tracking-tight">Mes favoris</h1>
          <p className="text-body-md text-on-surface-variant mt-2 max-w-2xl">
            Retrouvez ici les biens que vous avez enregistrés pendant vos recherches. Vos favoris
            sont conservés localement sur cet appareil, dans ce navigateur.
          </p>
        </div>

        {favoriteProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteProperties.map((property) => (
              <SearchResultCard key={property.slug} property={property} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-space-md bg-surface-container-low rounded-2xl py-24 px-6">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center">
              <Icon name="favorite" className="text-[32px] text-outline" />
            </div>
            <div className="max-w-md flex flex-col gap-2">
              <h2 className="font-headline-sm text-on-surface">
                Vous n&apos;avez pas encore de favoris
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Cliquez sur l&apos;icône cœur d&apos;une annonce pendant votre recherche pour
                l&apos;enregistrer ici et la retrouver facilement plus tard.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-space-sm mt-2">
              <Link
                href="/recherche"
                className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-md hover:bg-forest-deep transition-all shadow-sm"
              >
                Lancer une recherche
              </Link>
              <Link
                href="/acheter"
                className="bg-surface border border-outline-variant/40 text-on-surface px-6 py-3 rounded-xl font-label-md hover:bg-surface-container transition-all"
              >
                Explorer les biens à vendre
              </Link>
            </div>
          </div>
        )}
      </div>
    </SiteShell>
  );
}

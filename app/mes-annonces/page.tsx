"use client";

import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { Icon } from "@/components/ui/icon";
import { SearchResultCard } from "@/components/search/search-result-card";
import { usePublishedListings } from "@/data/local/published-listings-store";

export default function MesAnnoncesPage() {
  const listings = usePublishedListings();

  return (
    <SiteShell>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-space-xl w-full">
        <div className="mb-space-lg">
          <div className="text-label-md text-secondary font-bold uppercase tracking-wider mb-2">
            Mon espace
          </div>
          <h1 className="font-headline-xl text-on-surface tracking-tight">Mes annonces</h1>
          <p className="text-body-md text-on-surface-variant mt-2 max-w-2xl">
            Les annonces que vous avez publiées depuis cet appareil. Elles ne sont conservées que
            dans ce navigateur, sur cet appareil — elles disparaîtraient si vous videz vos données
            de navigation.
          </p>
          <Link
            href="/mes-demandes"
            className="inline-flex items-center gap-1 text-label-md font-bold text-primary hover:underline mt-3"
          >
            Voir mes demandes envoyées
            <Icon name="arrow_forward" className="text-[16px]" />
          </Link>
        </div>

        {listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
              <SearchResultCard key={listing.slug} property={listing} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-space-md bg-surface-container-low rounded-2xl py-24 px-6">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center">
              <Icon name="home_work" className="text-[32px] text-outline" />
            </div>
            <div className="max-w-md flex flex-col gap-2">
              <h2 className="font-headline-sm text-on-surface">
                Vous n&apos;avez encore publié aucune annonce
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Publiez un bien à vendre ou à louer pour le retrouver ici, avec son statut de
                vérification.
              </p>
            </div>
            <Link
              href="/publier"
              className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-md hover:bg-forest-deep transition-all shadow-sm mt-2"
            >
              Publier un bien
            </Link>
          </div>
        )}
      </div>
    </SiteShell>
  );
}

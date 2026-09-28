import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { Icon } from "@/components/ui/icon";
import { agencies } from "@/data/agencies";
import { properties } from "@/data/properties";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Annuaire des agences partenaires",
  description:
    "Retrouvez les agences immobilières partenaires certifiées d'Ogooué Habitat et leurs annonces en cours.",
};

export default function AgencesPage() {
  return (
    <SiteShell>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-space-xl w-full">
        <div className="mb-space-lg">
          <div className="text-label-md text-secondary font-bold uppercase tracking-wider mb-2">
            Réseau partenaire
          </div>
          <h1 className="font-headline-xl text-on-surface tracking-tight">
            Annuaire des agences partenaires
          </h1>
          <p className="text-body-md text-on-surface-variant mt-2 max-w-2xl">
            Agences certifiées, immatriculées au Registre du Commerce et du Crédit Mobilier
            (RCCM), avec lesquelles Ogooué Habitat travaille directement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agencies.map((agency) => {
            const listingCount = properties.filter(
              (property) => property.agencyInitials === agency.initials,
            ).length;
            return (
              <Link
                key={agency.slug}
                href={`/agences/${agency.slug}`}
                className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-md hover:shadow-xl transition-all flex flex-col gap-space-md"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center font-headline-sm font-bold",
                      agency.badgeClass,
                    )}
                  >
                    {agency.initials}
                  </div>
                  <div>
                    <div className="font-label-md font-bold text-on-surface">{agency.name}</div>
                    <div className="text-body-sm text-on-surface-variant flex items-center gap-1">
                      <Icon name="location_on" className="text-[14px]" />
                      {agency.city}
                    </div>
                  </div>
                </div>
                {agency.rccmNumber && (
                  <div className="text-label-sm text-on-surface-variant flex items-center gap-1">
                    <Icon name="verified" className="text-[14px] text-secondary" />
                    Partenaire certifié — {agency.rccmNumber}
                  </div>
                )}
                <div className="mt-auto pt-4 border-t border-outline-variant/30 flex items-center justify-between">
                  <span className="text-label-sm text-on-surface-variant">
                    {listingCount} annonce{listingCount > 1 ? "s" : ""} active
                    {listingCount > 1 ? "s" : ""}
                  </span>
                  <span className="text-label-md font-bold text-primary">Voir le profil →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </SiteShell>
  );
}

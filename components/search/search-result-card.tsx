"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { PhotoPendingBadge } from "@/components/ui/photo-pending-badge";
import { useFavorites } from "@/components/providers/favorites-provider";
import { toFavoriteId } from "@/data/local/favorite-id";
import { agencyByInitials } from "@/data/agencies";
import type { Property } from "@/lib/types";

export function SearchResultCard({ property }: { property: Property }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favoriteId = toFavoriteId("property", property.slug);
  const favorite = isFavorite(favoriteId);
  const agency = property.agencyInitials ? agencyByInitials(property.agencyInitials) : undefined;

  return (
    <div className="group bg-surface-container-low rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="relative w-full h-64 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${property.image.path}')` }}
          role="img"
          aria-label={property.image.alt}
        />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {property.status === "en_attente_verification" && (
            <span className="bg-surface/90 backdrop-blur-md text-on-surface-variant px-3 py-1 rounded-full text-label-sm font-bold shadow-md flex items-center gap-1">
              <Icon name="hourglass_top" className="text-[14px]" />
              <span>En cours de vérification</span>
            </span>
          )}
          {property.hasRealPhoto === false && <PhotoPendingBadge />}
          {property.passportScore !== undefined && (
            <span className="bg-primary text-on-primary px-3 py-1 rounded-full text-label-sm font-bold shadow-md flex items-center gap-1">
              <Icon name="verified" filled className="text-[14px]" />
              <span>Ogooué Shield {property.passportScore}%</span>
            </span>
          )}
          {property.badges?.map((badge) => (
            <span
              key={badge}
              className="bg-ogooue-blue text-on-secondary px-3 py-1 rounded-full text-label-sm font-medium shadow-md"
            >
              {badge}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={() => toggleFavorite(favoriteId)}
          aria-pressed={favorite}
          aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-surface/80 backdrop-blur-md flex items-center justify-center text-on-surface hover:bg-surface transition-all shadow-md"
        >
          <Icon name="favorite" filled={favorite} className={favorite ? "text-laterite" : "text-on-surface"} />
        </button>
        <div className="absolute bottom-4 left-4 bg-surface/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg">
          <div className="font-headline-sm text-primary font-bold">{property.priceLabel}</div>
          {property.priceSecondaryLabel && (
            <div className="text-[11px] text-on-surface-variant">{property.priceSecondaryLabel}</div>
          )}
        </div>
      </div>
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-headline-sm text-on-surface group-hover:text-primary transition-colors">
              {property.title}
            </h3>
            <p className="text-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
              <Icon name="location_on" className="text-[16px] text-secondary" /> {property.location}
            </p>
          </div>
          {property.tag && (
            <span className="bg-primary-fixed text-on-primary-fixed px-2.5 py-1 rounded-lg text-label-sm font-bold">
              {property.tag}
            </span>
          )}
        </div>
        <div
          className={`grid gap-2 py-2 border-t border-b border-outline-variant/20 ${
            property.specs.length >= 3 ? "grid-cols-3" : "grid-cols-2"
          }`}
        >
          {property.specs.map((spec) => (
            <div key={spec.label} className="flex items-center gap-2 text-on-surface-variant text-body-sm">
              <Icon name={spec.icon} className="text-secondary text-[18px]" />
              <span>{spec.label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-1">
          {agency && (
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-label-sm font-bold ${agency.badgeClass}`}
              >
                {agency.initials}
              </div>
              <span className="text-label-sm text-on-surface-variant">{agency.name}</span>
            </div>
          )}
          <Link
            href={`/bien/${property.slug}`}
            className="bg-primary text-on-primary px-4 py-2 rounded-xl text-label-md font-bold hover:bg-forest-deep transition-all shadow-sm"
          >
            Découvrir
          </Link>
        </div>
      </div>
    </div>
  );
}

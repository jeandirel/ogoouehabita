import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { CompareButton } from "@/components/ui/compare-button";
import { PhotoPendingBadge } from "@/components/ui/photo-pending-badge";
import { toFavoriteId } from "@/data/local/favorite-id";
import type { Property } from "@/lib/types";

const TAG_STYLES: Record<string, string> = {
  "Meublé": "text-secondary font-bold bg-secondary-fixed/50",
  "Exclusivité": "text-laterite font-medium bg-tertiary-fixed/40",
};

export function RentListingCard({ property }: { property: Property }) {
  return (
    <div className="bg-surface-container-low rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col">
      <div className="relative h-64 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url('${property.image.path}')` }}
          role="img"
          aria-label={property.image.alt}
        />
        {property.status === "en_attente_verification" ? (
          <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-md text-on-surface-variant px-3 py-1 rounded-full text-label-sm font-bold flex items-center gap-1 shadow-sm">
            <Icon name="hourglass_top" className="text-[14px]" /> En cours de vérification
          </div>
        ) : (
          <div className="absolute top-4 left-4 bg-primary text-on-primary px-3 py-1 rounded-full text-label-sm font-bold flex items-center gap-1 shadow-sm">
            <Icon name="verified" className="text-[14px]" /> Certifié Ogooué
          </div>
        )}
        <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-md text-on-surface px-3 py-1 rounded-full text-label-sm font-bold">
          {property.category}
        </div>
        {property.hasRealPhoto === false && (
          <PhotoPendingBadge className="absolute bottom-4 left-4" />
        )}
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <CompareButton compareId={toFavoriteId("property", property.slug)} />
          <FavoriteButton favoriteId={toFavoriteId("property", property.slug)} />
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-label-sm text-on-surface-variant flex items-center gap-1">
              <Icon name="location_on" className="text-[16px] text-secondary" /> {property.location}
            </span>
            {property.tag && (
              <span
                className={`text-label-sm px-2.5 py-0.5 rounded-full ${TAG_STYLES[property.tag] ?? "text-secondary font-bold bg-secondary-fixed/50"}`}
              >
                {property.tag}
              </span>
            )}
          </div>
          <h3 className="font-headline-sm text-on-surface mb-3">{property.title}</h3>
          <div className="flex items-center gap-4 text-body-sm text-on-surface-variant mb-4">
            {property.specs.map((spec) => (
              <span key={spec.label} className="flex items-center gap-1">
                <Icon name={spec.icon} className="text-[18px]" /> {spec.label}
              </span>
            ))}
          </div>
        </div>
        <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-between">
          <div>
            <span className="text-headline-md text-primary font-bold">{property.priceLabel}</span>
            <span className="text-body-sm text-on-surface-variant"> / mois</span>
          </div>
          <Link
            href={`/bien/${property.slug}`}
            aria-label={`Voir ${property.title}`}
            className="bg-primary/10 hover:bg-primary text-primary hover:text-on-primary p-3 rounded-xl transition-all"
          >
            <Icon name="visibility" />
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { PhotoPendingBadge } from "@/components/ui/photo-pending-badge";
import { toFavoriteId } from "@/data/local/favorite-id";
import type { Property } from "@/lib/types";

export function BuyListingCard({ property }: { property: Property }) {
  const isPending = property.status === "en_attente_verification";
  const badgeLabel = isPending
    ? "En cours de vérification"
    : (property.badges?.[0] ?? (property.passportGrade ? `Passeport Ogooué ${property.passportGrade}` : undefined));

  return (
    <div className="relative bg-surface-container-low rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group">
      <FavoriteButton
        favoriteId={toFavoriteId("property", property.slug)}
        className="absolute top-3 right-3 z-10"
      />
      <Link href={`/bien/${property.slug}`} className="flex flex-col flex-1">
        <div
          className="relative h-64 bg-cover bg-center"
          style={{ backgroundImage: `url('${property.image.path}')` }}
          role="img"
          aria-label={property.image.alt}
        >
          {badgeLabel && (
            <div
              className={`absolute top-3 left-3 px-3 py-1 rounded-full text-label-sm flex items-center gap-1 shadow-sm ${
                isPending ? "bg-surface/90 backdrop-blur-md text-on-surface-variant" : "bg-primary text-on-primary"
              }`}
            >
              <Icon name={isPending ? "hourglass_top" : "verified"} className="text-[14px]" />
              <span>{badgeLabel}</span>
            </div>
          )}
          {property.hasRealPhoto === false && (
            <PhotoPendingBadge className="absolute bottom-3 left-3" />
          )}
          <div className="absolute bottom-3 right-3 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-full text-label-md font-bold text-primary">
            {property.priceLabel}
          </div>
        </div>
        <div className="p-space-md flex flex-col gap-2 flex-1 justify-between">
          <div>
            <div className="text-label-sm text-on-surface-variant">{property.location}</div>
            <h3 className="font-headline-sm text-primary group-hover:text-secondary transition-colors">
              {property.title}
            </h3>
            <p className="text-body-sm text-on-surface-variant mt-1 line-clamp-2">
              {property.description}
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20 text-body-sm text-on-surface-variant">
            {property.specs.map((spec) => (
              <span key={spec.label} className="flex items-center gap-1">
                <Icon name={spec.icon} className="text-[18px]" /> {spec.label}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}

import Link from "next/link";
import { CardImageCarousel } from "@/components/property/card-image-carousel";
import { CompareButton } from "@/components/ui/compare-button";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { Icon } from "@/components/ui/icon";
import { PhotoPendingBadge } from "@/components/ui/photo-pending-badge";
import { toFavoriteId } from "@/data/local/favorite-id";
import type { Property } from "@/lib/types";

const TAG_STYLES: Record<string, string> = {
  Meublé: "bg-primary-fixed text-primary",
  Exclusivité: "bg-tertiary-fixed text-laterite",
};

export function RentListingCard({ property }: { property: Property }) {
  const pending = property.status === "en_attente_verification";
  const images = property.gallery?.length ? property.gallery.map((entry) => entry.image) : [property.image];
  const favoriteId = toFavoriteId("property", property.slug);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-outline-variant/70 bg-surface shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-52 overflow-hidden">
        <CardImageCarousel images={images} imageClassName="group-hover:scale-105" />
        <span className={pending ? "absolute left-3 top-3 z-20 inline-flex items-center gap-1 rounded-full bg-surface/90 px-2.5 py-1 text-label-sm font-bold text-on-surface-variant shadow-sm backdrop-blur" : "absolute left-3 top-3 z-20 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-label-sm font-bold text-on-primary shadow-sm"}>
          <Icon name={pending ? "hourglass_top" : "verified"} className="text-[14px]" />
          {pending ? "En vérification" : "Certifié Ogooué"}
        </span>
        <div className="absolute right-3 top-3 z-20 flex flex-col gap-2">
          <FavoriteButton favoriteId={favoriteId} />
          <CompareButton compareId={favoriteId} />
        </div>
        {property.hasRealPhoto === false && <PhotoPendingBadge className="absolute bottom-3 left-3 z-20" />}
      </div>
      <Link href={`/bien/${property.slug}`} className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div><p className="text-headline-sm font-extrabold tracking-[-0.03em] text-primary">{property.priceLabel}</p><p className="mt-0.5 text-label-sm text-on-surface-variant">{property.priceSecondaryLabel ?? "Location"}</p></div>
          {property.tag && <span className={`rounded-md px-2 py-1 text-label-sm font-bold ${TAG_STYLES[property.tag] ?? "bg-primary-fixed text-primary"}`}>{property.tag}</span>}
        </div>
        <p className="mt-3 flex items-center gap-1 text-body-sm text-on-surface-variant"><Icon name="location_on" className="text-[17px] text-secondary" />{property.location}</p>
        <h3 className="mt-1 font-headline-sm font-bold text-on-surface group-hover:text-primary">{property.title}</h3>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2 border-y border-outline-variant/60 py-2.5">
          {property.specs.map((spec) => <span key={spec.label} className="flex items-center gap-1 text-label-sm text-on-surface-variant"><Icon name={spec.icon} className="text-[17px] text-secondary" />{spec.label}</span>)}
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4"><span className="truncate text-label-sm text-on-surface-variant">{property.agencyName ?? "Annonce immobilière"}</span><span className="inline-flex shrink-0 items-center gap-1 text-label-md font-bold text-primary">Voir le bien <Icon name="arrow_forward" className="text-[17px]" /></span></div>
      </Link>
    </article>
  );
}
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { CompareButton } from "@/components/ui/compare-button";
import { toFavoriteId } from "@/data/local/favorite-id";
import type { Land } from "@/lib/types";

export function LandCard({ land }: { land: Land }) {
  return (
    <div className="bg-surface-container-low rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
      <div
        className="relative h-48 bg-cover bg-center"
        style={{ backgroundImage: `url('${land.image.path}')` }}
        role="img"
        aria-label={land.image.alt}
      >
        <div
          className={`absolute top-3 left-3 text-label-sm px-2.5 py-1 rounded-full font-bold shadow-sm ${land.levelBadgeClass}`}
        >
          {land.levelLabel}
        </div>
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <FavoriteButton favoriteId={toFavoriteId("land", land.slug)} className="w-9 h-9" />
          <CompareButton compareId={toFavoriteId("land", land.slug)} className="w-9 h-9" />
        </div>
        <div className="absolute bottom-3 right-3 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-lg text-body-sm font-bold text-primary">
          {land.priceLabel}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow justify-between gap-4">
        <div>
          <div className="text-label-sm text-secondary font-medium uppercase tracking-wider mb-1">
            {land.location}
          </div>
          <h3 className="text-headline-sm text-on-surface font-bold">{land.title}</h3>
          <div className="flex items-center gap-4 mt-3 text-body-sm text-on-surface-variant">
            <span className="flex items-center gap-1">
              <Icon name="straighten" className="text-[16px]" /> {land.areaLabel}
            </span>
            <span className="flex items-center gap-1">
              <Icon name="payments" className="text-[16px]" /> {land.pricePerSqmLabel}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 py-2 border-y border-outline-variant/20 text-label-sm">
          <span className="text-on-surface-variant flex items-center gap-1">
            <Icon name="alt_route" className="text-[14px] text-secondary" /> {land.accessLabel}
          </span>
          <span className="text-on-surface-variant flex items-center gap-1">
            <Icon name="pin_drop" className="text-[14px] text-secondary" /> {land.bornageLabel}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-label-sm font-bold text-primary bg-primary-fixed/30 px-2.5 py-1 rounded-full">
            {land.reference}
          </span>
          <Link
            href={`/terrains/${land.slug}`}
            className="text-body-sm font-bold text-secondary hover:underline"
          >
            Détails →
          </Link>
        </div>
      </div>
    </div>
  );
}

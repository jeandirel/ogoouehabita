import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { CompareButton } from "@/components/ui/compare-button";
import { toFavoriteId } from "@/data/local/favorite-id";
import type { Land } from "@/lib/types";
export function LandCard({ land }: { land: Land }) {
  const favoriteId = toFavoriteId("land", land.slug);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-outline-variant/70 bg-surface shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div
        className="relative h-52 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.03]"
        style={{ backgroundImage: `url('${land.image.path}')` }}
        role="img"
        aria-label={land.image.alt}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-anthracite/30 via-transparent to-transparent" />
        <span className={`absolute left-3 top-3 rounded-full px-2 py-1 text-label-sm font-bold shadow-sm ${land.levelBadgeClass}`}>
          {land.levelLabel}
        </span>
        <div className="absolute right-3 top-3 z-20 flex flex-col gap-2">
          <FavoriteButton favoriteId={favoriteId} className="h-9 w-9" />
          <CompareButton compareId={favoriteId} className="h-9 w-9" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-headline-sm font-extrabold tracking-[-0.03em] text-primary">{land.priceLabel}</p>
        <p className="mt-2 flex items-center gap-1 text-body-sm text-on-surface-variant">
          <Icon name="location_on" className="text-[17px] text-secondary" />
          {land.location}
        </p>
        <h3 className="mt-1 font-headline-sm font-bold text-on-surface group-hover:text-primary">{land.title}</h3>
        <div className="mt-3 grid grid-cols-2 gap-2 border-y border-outline-variant/60 py-2.5 text-label-sm text-on-surface-variant">
          <span className="flex items-center gap-1"><Icon name="straighten" className="text-[17px] text-secondary" />{land.areaLabel}</span>
          <span className="flex items-center gap-1"><Icon name="payments" className="text-[17px] text-secondary" />{land.pricePerSqmLabel}</span>
          <span className="flex items-center gap-1"><Icon name="alt_route" className="text-[17px] text-secondary" />{land.accessLabel}</span>
          <span className="flex items-center gap-1"><Icon name="pin_drop" className="text-[17px] text-secondary" />{land.bornageLabel}</span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="rounded-full bg-primary-fixed px-2 py-1 text-label-sm font-bold text-primary">{land.reference}</span>
          <Link href={`/terrains/${land.slug}`} className="inline-flex items-center gap-1 text-label-md font-bold text-primary hover:underline">
            Détails <Icon name="arrow_forward" className="text-[17px]" />
          </Link>
        </div>
      </div>
    </article>
  );
}
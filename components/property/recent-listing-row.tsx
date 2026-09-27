import type { RecentListing } from "@/lib/types";

export function RecentListingRow({ listing }: { listing: RecentListing }) {
  return (
    <div className="bg-surface rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all p-4 flex gap-4">
      <div
        className="w-32 h-32 rounded-lg bg-cover bg-center shrink-0"
        style={{ backgroundImage: `url('${listing.image.path}')` }}
        role="img"
        aria-label={listing.image.alt}
      />
      <div className="flex flex-col justify-between py-1 flex-1">
        <div>
          <span className="text-label-sm text-laterite font-bold bg-tertiary-fixed/30 px-2 py-0.5 rounded">
            {listing.postedLabel}
          </span>
          <h4 className="font-headline-sm text-on-surface mt-1 text-base">{listing.title}</h4>
          <p className="text-body-sm text-on-surface-variant">{listing.location}</p>
        </div>
        <div className="text-headline-sm text-primary font-bold">
          {listing.priceLabel} <span className="text-body-sm font-normal text-on-surface-variant">/mois</span>
        </div>
      </div>
    </div>
  );
}

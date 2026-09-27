import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { Neighborhood } from "@/lib/types";

export function NeighborhoodCard({ neighborhood }: { neighborhood: Neighborhood }) {
  return (
    <Link
      href={`/louer?quartier=${neighborhood.slug}`}
      className="relative h-80 rounded-xl overflow-hidden shadow-md group cursor-pointer flex flex-col justify-end p-6"
    >
      <div
        className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
        style={{ backgroundImage: `url('${neighborhood.image.path}')` }}
        role="img"
        aria-label={neighborhood.image.alt}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-anthracite/90 via-anthracite/30 to-transparent" />
      <div className="relative z-10 text-surface">
        <span className="text-label-sm text-primary-fixed-dim font-bold uppercase tracking-wider">
          {neighborhood.city}
        </span>
        <h3 className="font-headline-md text-surface mb-1">{neighborhood.name}</h3>
        <p className="text-body-sm text-surface-variant mb-3">
          Loyer moyen : {neighborhood.averagePriceLabel}
        </p>
        <span className="text-label-md text-surface underline flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          Explorer {neighborhood.propertyCount} biens <Icon name="arrow_forward" className="text-[16px]" />
        </span>
      </div>
    </Link>
  );
}

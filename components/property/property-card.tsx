import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { Property } from "@/lib/types";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all flex flex-col group">
      <div
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: `url('${property.image.path}')` }}
        role="img"
        aria-label={property.image.alt}
      >
        {property.passportScore !== undefined && (
          <div className="absolute top-4 left-4 bg-primary text-on-primary px-3 py-1.5 rounded-full text-label-sm font-bold flex items-center gap-1 shadow-md">
            <Icon name="verified" className="text-[16px]" />
            <span>Passeport Ogooué™ {property.passportScore}%</span>
          </div>
        )}
        <div className="absolute bottom-4 right-4 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-xl text-label-sm font-bold text-primary">
          {property.priceLabel}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="text-label-sm text-on-surface-variant mb-1">{property.location}</div>
        <h3 className="text-headline-sm font-bold text-on-surface mb-3 group-hover:text-ogooue-blue transition-colors">
          {property.title}
        </h3>
        <div className="flex items-center gap-4 text-body-sm text-on-surface-variant mb-6 flex-wrap">
          {property.specs.map((spec) => (
            <span key={spec.label} className="flex items-center gap-1">
              <Icon name={spec.icon} className="text-[18px]" /> {spec.label}
            </span>
          ))}
        </div>
        <div className="mt-auto pt-4 border-t border-outline-variant/30 flex items-center justify-between gap-2">
          {property.trustLabel && (
            <span className="text-label-sm text-secondary font-bold flex items-center gap-1">
              <Icon name="shield" className="text-[16px]" /> {property.trustLabel}
            </span>
          )}
          <Link
            className="text-label-md font-bold text-primary hover:underline whitespace-nowrap"
            href={`/bien/${property.slug}`}
          >
            Voir le dossier →
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import type { ProvinceCard as ProvinceCardData } from "@/data/provinces";

export function ProvinceCard({ province }: { province: ProvinceCardData }) {
  return (
    <Link
      href={`/recherche?province=${encodeURIComponent(province.name)}`}
      className="relative h-64 rounded-2xl overflow-hidden shadow-md group cursor-pointer bg-cover bg-center"
      style={{ backgroundImage: `url('${province.image.path}')` }}
      aria-label={province.image.alt}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/20 to-transparent group-hover:from-forest-deep transition-all" />
      <div className="absolute bottom-6 left-6 right-6 text-on-primary">
        <h3 className="text-headline-sm font-bold mb-1">{province.name}</h3>
        <p className="text-body-sm text-primary-fixed-dim">
          {province.citiesLabel} • {new Intl.NumberFormat("fr-FR").format(province.propertyCount)} biens
        </p>
      </div>
    </Link>
  );
}

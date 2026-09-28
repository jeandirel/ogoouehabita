import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { Icon } from "@/components/ui/icon";
import { PropertyCard } from "@/components/property/property-card";
import { agencies } from "@/data/agencies";
import { properties } from "@/data/properties";
import { toWhatsAppDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return agencies.map((agency) => ({ slug: agency.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const agency = agencies.find((entry) => entry.slug === slug);

  if (!agency) {
    return { title: "Agence" };
  }

  return {
    title: agency.name,
    description: `${agency.name} — agence partenaire certifiée à ${agency.city}. Retrouvez toutes ses annonces sur Ogooué Habitat.`,
  };
}

export default async function AgenceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const agency = agencies.find((entry) => entry.slug === slug);
  if (!agency) notFound();

  const listings = properties.filter((property) => property.agencyInitials === agency.initials);

  return (
    <SiteShell>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-space-xl w-full">
        <Link
          href="/agences"
          className="inline-flex items-center gap-1 text-label-md font-bold text-primary hover:underline mb-space-md"
        >
          <Icon name="arrow_back" className="text-[16px]" />
          Toutes les agences
        </Link>

        <div className="bg-surface-container-low rounded-2xl p-space-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-xl">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center font-headline-md font-bold",
                agency.badgeClass,
              )}
            >
              {agency.initials}
            </div>
            <div>
              <h1 className="font-headline-lg text-on-surface tracking-tight">{agency.name}</h1>
              <div className="text-body-sm text-on-surface-variant flex items-center gap-1 mt-1">
                <Icon name="location_on" className="text-[16px]" />
                {agency.city}
              </div>
              {agency.rccmNumber && (
                <div className="text-body-sm text-on-surface-variant flex items-center gap-1 mt-1">
                  <Icon name="verified" className="text-[16px] text-secondary" />
                  Partenaire certifié — {agency.rccmNumber}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <a
              href={`https://wa.me/${toWhatsAppDigits(agency.phone)}?text=${encodeURIComponent(
                `Bonjour, je vous contacte via Ogooué Habitat.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-ogooue-blue text-on-secondary px-5 py-3 rounded-xl font-label-md hover:bg-secondary transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Icon name="chat" className="text-[18px]" />
              WhatsApp
            </a>
            <a
              href={`tel:${agency.phone.replace(/\s+/g, "")}`}
              className="bg-surface border border-outline-variant/40 px-5 py-3 rounded-xl text-on-surface font-label-md hover:bg-surface-container transition-all flex items-center justify-center gap-2"
            >
              <Icon name="call" className="text-[18px]" />
              Appeler
            </a>
          </div>
        </div>

        <h2 className="font-headline-md text-primary mb-space-md">
          Annonces de {agency.name} ({listings.length})
        </h2>
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((property) => (
              <PropertyCard key={property.slug} property={property} />
            ))}
          </div>
        ) : (
          <div className="bg-surface-container-low rounded-xl p-8 text-center text-body-md text-on-surface-variant">
            Cette agence n&apos;a aucune annonce active pour le moment.
          </div>
        )}
      </div>
    </SiteShell>
  );
}

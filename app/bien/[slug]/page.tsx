import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { PropertyDetailView } from "@/components/property/property-detail-view";
import { LocalPropertyDetailGate } from "@/components/property/local-property-detail-gate";
import { properties } from "@/data/properties";

export function generateStaticParams() {
  return properties.map((property) => ({ slug: property.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = properties.find((p) => p.slug === slug);

  if (!property) {
    return { title: "Annonce" };
  }

  return {
    title: property.title,
    description:
      property.description ??
      `${property.title} — ${property.location}. ${property.priceLabel}, à voir sur Ogooué Habitat.`,
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = properties.find((p) => p.slug === slug);

  if (!property) {
    return <LocalPropertyDetailGate slug={slug} />;
  }

  return (
    <SiteShell>
      <PropertyDetailView property={property} />
    </SiteShell>
  );
}

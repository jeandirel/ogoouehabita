import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { PropertyDetailView } from "@/components/property/property-detail-view";
import { properties } from "@/data/properties";
import { prisma } from "@/lib/db";
import { publicListingInclude, toPublicProperty } from "@/lib/public-listing";

export function generateStaticParams() {
  return properties.map((property) => ({ slug: property.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const seeded = properties.find((property) => property.slug === slug);
  const stored = seeded ? null : await prisma.listing.findFirst({ where: { slug, status: "PUBLISHED" }, select: { title: true, description: true } });
  const property = seeded ?? stored;
  if (!property) return { title: "Annonce introuvable" };
  return { title: property.title, description: property.description ?? `${property.title}, à voir sur Ogooué Habitat.` };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const seeded = properties.find((property) => property.slug === slug);
  const stored = seeded ? null : await prisma.listing.findFirst({ where: { slug, status: "PUBLISHED" }, include: publicListingInclude });
  const property = seeded ?? (stored ? toPublicProperty(stored) : null);
  if (!property) notFound();
  return <SiteShell><PropertyDetailView property={property} /></SiteShell>;
}

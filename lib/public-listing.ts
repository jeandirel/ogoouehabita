import type { Prisma } from "@prisma/client";
import type { Property } from "@/lib/types";

export const publicListingInclude = {
  category: true,
  city: { include: { province: true } },
  district: true,
  agency: true,
  owner: { select: { fullName: true } },
  features: true,
  media: { where: { deletedAt: null, visibility: "PUBLIC" }, orderBy: [{ isCover: "desc" }, { sortOrder: "asc" }] },
} satisfies Prisma.ListingInclude;

type PublicListing = Prisma.ListingGetPayload<{ include: typeof publicListingInclude }>;

const labels: Record<string, string> = {
  parking: "Stationnement", furnished: "Meublé", air_conditioning: "Climatisation", generator: "Groupe électrogène", water_tank: "Réserve d’eau", security: "Sécurité", pool: "Piscine", floor: "Étage", elevator: "Ascenseur", land_title: "Titre foncier", surveyed: "Borné", serviced: "Viabilisé", access: "Accès", shop_window: "Vitrine",
};

function featureValue(value: string) {
  if (value === "true") return "Oui";
  if (value === "false") return "Non";
  return value;
}

export function toPublicProperty(listing: PublicListing): Property {
  const photos = listing.media.filter((item) => item.kind === "PHOTO" && item.publicUrl);
  const cover = photos[0]?.publicUrl ?? "/images/placeholder-property.svg";
  const location = [listing.district?.name, listing.city?.name].filter(Boolean).join(", ");
  const specs = [
    listing.bedrooms ? { icon: "bed", label: `${listing.bedrooms} chambre${listing.bedrooms > 1 ? "s" : ""}` } : undefined,
    listing.rooms ? { icon: "meeting_room", label: `${listing.rooms} pièce${listing.rooms > 1 ? "s" : ""}` } : undefined,
    listing.surfaceM2 ? { icon: "square_foot", label: `${listing.surfaceM2} m²` } : undefined,
    listing.landSurfaceM2 ? { icon: "landscape", label: `${listing.landSurfaceM2} m² de terrain` } : undefined,
  ].filter((item): item is { icon: string; label: string } => Boolean(item));
  const features = [
    listing.bathrooms !== null ? { label: "Salles de bain", value: String(listing.bathrooms) } : undefined,
    ...listing.features.map((item) => ({ label: labels[item.code] ?? item.code.replaceAll("_", " "), value: featureValue(item.value) })),
  ].filter((item): item is { label: string; value: string } => Boolean(item));
  return {
    slug: listing.slug,
    title: listing.title,
    location,
    addressLine: listing.addressLine ?? undefined,
    province: listing.city?.province.name ?? "Gabon",
    transactionType: listing.transaction === "RENT" ? "location" : "vente",
    category: listing.category.label,
    priceLabel: `${new Intl.NumberFormat("fr-FR").format(Number(listing.priceCfa))} FCFA`,
    priceValue: Number(listing.priceCfa),
    reference: listing.id.slice(0, 8).toUpperCase(),
    image: { path: cover, alt: listing.title },
    gallery: photos.map((item, index) => ({ image: { path: item.publicUrl!, alt: `${listing.title} — photo ${index + 1}` }, caption: index === 0 ? "Vue principale" : `Photo ${index + 1}` })),
    specs: specs.length ? specs : [{ icon: "home", label: listing.category.label }],
    detailSpecs: specs.map((item) => ({ icon: item.icon, label: item.label, value: "" })),
    description: listing.description,
    features: features.length ? features : undefined,
    agencyName: listing.agency?.name ?? listing.owner.fullName,
    videoUrl: listing.media.find((item) => item.kind === "VIDEO")?.publicUrl ?? undefined,
    virtualTourUrl: listing.media.find((item) => item.kind === "VIRTUAL_TOUR")?.publicUrl ?? undefined,
    hasRealPhoto: photos.length > 0,
  };
}

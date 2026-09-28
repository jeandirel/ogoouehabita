import { useMemo } from "react";
import { createRecordStore } from "@/lib/local-store/record-store";
import { getDeviceOwnerId } from "@/lib/local-store/session";
import { properties } from "@/data/properties";
import { stitchImage } from "@/data/image-manifest";
import type { PublishedListing, Property, TransactionType } from "@/lib/types";

const publishedListingsStore = createRecordStore<PublishedListing>("published-listings");

// One neutral, real Stitch-sourced photo reused for every locally-published
// listing (paired with a "Photos à venir" badge on every card/detail view
// that renders it) — never a fabricated per-listing photo.
const PLACEHOLDER_IMAGE = stitchImage.misc_hero_foret_vers_terrain_defriche;

export interface PublishListingInput {
  title: string;
  transactionType: TransactionType;
  category: string;
  location: string;
  province: string;
  priceValue: number;
  priceLabel: string;
  priceSecondaryLabel?: string;
  surfaceM2?: number;
  bedrooms?: number;
  description: string;
  contactName: string;
  contactPhone: string;
}

export function usePublishedListings(): PublishedListing[] {
  return publishedListingsStore.useAll();
}

export function getPublishedListings(): PublishedListing[] {
  return publishedListingsStore.getAll();
}

export function insertPublishedListing(input: PublishListingInput): PublishedListing {
  const specs = [
    input.bedrooms ? { icon: "bed", label: `${input.bedrooms} Chambres` } : undefined,
    input.surfaceM2 ? { icon: "square_foot", label: `${input.surfaceM2} m²` } : undefined,
  ].filter((spec): spec is { icon: string; label: string } => Boolean(spec));

  return publishedListingsStore.insert({
    slug: `annonce-${crypto.randomUUID()}`,
    title: input.title,
    location: input.location,
    province: input.province,
    transactionType: input.transactionType,
    category: input.category,
    priceLabel: input.priceLabel,
    priceValue: input.priceValue,
    priceSecondaryLabel: input.priceSecondaryLabel,
    image: PLACEHOLDER_IMAGE,
    specs: specs.length > 0 ? specs : [{ icon: "home", label: input.category }],
    description: input.description,
    agencyName: input.contactName,
    source: "local",
    status: "en_attente_verification",
    hasRealPhoto: false,
    ownerId: getDeviceOwnerId(),
  });
}

export function useMergedProperties(): Property[] {
  const local = usePublishedListings();
  return useMemo(() => [...properties, ...local], [local]);
}

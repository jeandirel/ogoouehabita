export interface StitchImage {
  path: string;
  alt: string;
}

export type TransactionType = "vente" | "location";

export interface PropertySpec {
  icon: string;
  label: string;
}

export interface GalleryImage {
  image: StitchImage;
  caption: string;
}

export interface FeatureItem {
  label: string;
  value: string;
}

export interface DetailSpec {
  icon: string;
  label: string;
  value: string;
}

export interface Property {
  slug: string;
  title: string;
  location: string;
  addressLine?: string;
  province: string;
  transactionType: TransactionType;
  category?: string;
  priceLabel: string;
  priceValue: number;
  priceSecondaryLabel?: string;
  passportScore?: number;
  passportGrade?: string;
  badges?: string[];
  tag?: string;
  reference?: string;
  image: StitchImage;
  gallery?: GalleryImage[];
  specs: PropertySpec[];
  detailSpecs?: DetailSpec[];
  trustLabel?: string;
  agencyInitials?: string;
  agencyName?: string;
  description?: string;
  amenities?: string[];
  features?: FeatureItem[];
  passportChecklist?: FeatureItem[];
  neighborhoodBlurb?: string;
}

export interface Land {
  slug: string;
  title: string;
  location: string;
  province: string;
  priceLabel: string;
  priceValue: number;
  areaLabel: string;
  pricePerSqmLabel: string;
  trustLevel: 1 | 2 | 3 | 4 | 5;
  levelLabel: string;
  levelBadgeClass: string;
  accessLabel: string;
  bornageLabel: string;
  reference: string;
  image: StitchImage;
}

export interface Neighborhood {
  slug: string;
  name: string;
  city: string;
  image: StitchImage;
  averagePriceLabel: string;
  propertyCount: number;
}

export interface Province {
  slug: string;
  name: string;
  image: StitchImage;
  description: string;
}

export interface RecentListing {
  slug: string;
  title: string;
  location: string;
  priceLabel: string;
  postedLabel: string;
  image: StitchImage;
}

export interface Agency {
  slug: string;
  name: string;
  initials: string;
  city: string;
  badgeClass: string;
}

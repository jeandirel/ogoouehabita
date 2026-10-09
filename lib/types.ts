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
  cautionLabel?: string;
  contactPhone?: string;
  videoUrl?: string;
  virtualTourUrl?: string;
  source?: "local";
  status?: "en_attente_verification";
  hasRealPhoto?: boolean;
}

export interface LandChecklistItem {
  label: string;
  value: string;
  status: "ok" | "attention";
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
  disputeRisk?: {
    level: "faible" | "modere" | "eleve";
    note: string;
  };
  landChecklist?: LandChecklistItem[];
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
  phone: string;
  rccmNumber?: string;
}

/**
 * Shape shared by every record created locally (on-device) rather than
 * seeded from data/*.ts — mirrors the columns a real DB row would have
 * (id, created_at, owner_id) so these stores are a drop-in target for a
 * future Supabase connection.
 */
export interface LocalRecordBase {
  id: string;
  createdAt: string;
  ownerId: string;
}

export interface PublishedListing extends Property, LocalRecordBase {
  source: "local";
  status: "en_attente_verification";
  hasRealPhoto: boolean;
}

export type LeadKind = "diaspora" | "professionnels" | "neuf-notify" | "louer-alerte" | "contact-bien";

export interface LeadSubmission extends LocalRecordBase {
  kind: LeadKind;
  contact: string;
  payload: Record<string, string>;
}

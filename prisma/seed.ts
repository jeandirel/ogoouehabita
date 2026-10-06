import { PrismaClient, ListingStatus, ListingTransaction, UserRole, UserStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const gabon = await prisma.country.upsert({
    where: { code: "GA" },
    update: {},
    create: { code: "GA", name: "Gabon", locales: ["fr-GA"] },
  });

  const estuaire = await prisma.province.upsert({
    where: { countryId_slug: { countryId: gabon.id, slug: "estuaire" } },
    update: {},
    create: { countryId: gabon.id, name: "Estuaire", slug: "estuaire" },
  });

  const libreville = await prisma.city.upsert({
    where: { provinceId_slug: { provinceId: estuaire.id, slug: "libreville" } },
    update: {},
    create: { provinceId: estuaire.id, name: "Libreville", slug: "libreville" },
  });

  const angondje = await prisma.district.upsert({
    where: { cityId_slug: { cityId: libreville.id, slug: "angondje" } },
    update: {},
    create: { cityId: libreville.id, name: "Angondjé", slug: "angondje" },
  });

  const villa = await prisma.propertyCategory.upsert({
    where: { code: "villa" },
    update: {},
    create: { code: "villa", label: "Villa" },
  });

  await prisma.propertyCategory.upsert({ where: { code: "terrain" }, update: {}, create: { code: "terrain", label: "Terrain" } });
  await prisma.propertyCategory.upsert({ where: { code: "appartement" }, update: {}, create: { code: "appartement", label: "Appartement" } });
  await prisma.featureDefinition.upsert({ where: { code: "piscine" }, update: {}, create: { code: "piscine", label: "Piscine" } });
  await prisma.featureDefinition.upsert({ where: { code: "titre_foncier" }, update: {}, create: { code: "titre_foncier", label: "Titre foncier vérifié" } });

  const owner = await prisma.user.upsert({
    where: { email: "demo-proprietaire@ogooue-habitat.local" },
    update: {},
    create: {
      email: "demo-proprietaire@ogooue-habitat.local",
      fullName: "Propriétaire Démo",
      status: UserStatus.ACTIVE,
      emailVerifiedAt: new Date(),
      roles: [UserRole.PROPRIETAIRE],
    },
  });

  const agency = await prisma.agency.upsert({
    where: { slug: "agence-demo-ogooue" },
    update: {},
    create: {
      name: "Agence Démo Ogooué",
      slug: "agence-demo-ogooue",
      phone: "+241 00 00 00 00",
      email: "demo-agence@ogooue-habitat.local",
      status: "VERIFIED",
      verifiedAt: new Date(),
    },
  });

  await prisma.listing.upsert({
    where: { slug: "demo-villa-angondje-persistante" },
    update: {},
    create: {
      ownerId: owner.id,
      agencyId: agency.id,
      categoryId: villa.id,
      cityId: libreville.id,
      districtId: angondje.id,
      slug: "demo-villa-angondje-persistante",
      title: "Villa démonstration persistante à Angondjé",
      description: "Annonce de démonstration clairement séparée des données réelles.",
      transaction: ListingTransaction.SALE,
      status: ListingStatus.PUBLISHED,
      priceCfa: BigInt(185_000_000),
      surfaceM2: 320,
      bedrooms: 4,
      bathrooms: 3,
      publishedAt: new Date(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      features: { create: [{ code: "piscine", value: "true" }, { code: "titre_foncier", value: "true" }] },
      media: { create: [{ kind: "PHOTO", visibility: "PUBLIC", storageKey: "demo/villa-angondje.jpg", publicUrl: "/images/properties/villa-contemporaine-angondje.jpg", sortOrder: 0, isCover: true }] },
    },
  });

  await prisma.commercialOffer.upsert({
    where: { code: "AGENCE_STARTER_DEMO" },
    update: {},
    create: { code: "AGENCE_STARTER_DEMO", name: "Agence Starter Démo", priceCfa: BigInt(50_000), durationDays: 30, listingQuota: 10, featuredQuota: 1 },
  });
}

main().finally(async () => prisma.$disconnect());

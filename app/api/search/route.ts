import { ListingStatus, ListingTransaction, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
export async function GET(request: Request) {
  const query = new URL(request.url).searchParams; const page = Math.max(1, Number(query.get("page") ?? 1)); const limit = Math.min(48, Math.max(1, Number(query.get("limit") ?? 12))); const where: Prisma.ListingWhereInput = { status: ListingStatus.PUBLISHED };
  const transaction = query.get("transaction"); if (transaction === "vente") where.transaction = ListingTransaction.SALE; if (transaction === "location") where.transaction = ListingTransaction.RENT;
  const city = query.get("city"); if (city) where.city = { slug: city }; const category = query.get("category"); if (category) where.category = { code: category };
  const min = Number(query.get("minPrice")); const max = Number(query.get("maxPrice")); if (Number.isSafeInteger(min) || Number.isSafeInteger(max)) where.priceCfa = { ...(Number.isSafeInteger(min) ? { gte: BigInt(min) } : {}), ...(Number.isSafeInteger(max) ? { lte: BigInt(max) } : {}) };
  const text = query.get("q")?.trim(); if (text) where.OR = [{ title: { contains: text, mode: "insensitive" } }, { description: { contains: text, mode: "insensitive" } }, { city: { name: { contains: text, mode: "insensitive" } } }, { district: { name: { contains: text, mode: "insensitive" } } }];
  const total = await prisma.listing.count({ where }); const listings = await prisma.listing.findMany({ where, include: { category: true, city: true, district: true, media: { where: { deletedAt: null, visibility: "PUBLIC" }, orderBy: [{ isCover: "desc" }, { sortOrder: "asc" }], take: 1 } }, orderBy: { publishedAt: "desc" }, skip: (page - 1) * limit, take: limit });
  return NextResponse.json({ total, page, limit, listings: listings.map((item) => ({ id: item.id, slug: item.slug, title: item.title, transaction: item.transaction, priceCfa: item.priceCfa.toString(), category: item.category.label, city: item.city?.name, district: item.district?.name, surfaceM2: item.surfaceM2, bedrooms: item.bedrooms, coverUrl: item.media[0]?.publicUrl })) });
}

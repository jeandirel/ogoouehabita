import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { jsonError } from "@/lib/auth/http";
import { prisma } from "@/lib/db";
export async function GET() { try { const user = await requireUser(); const favorites = await prisma.favorite.findMany({ where: { userId: user.id }, include: { listing: { include: { category: true, city: true, media: { where: { visibility: "PUBLIC", deletedAt: null }, orderBy: [{ isCover: "desc" }, { sortOrder: "asc" }], take: 1 } } } }, orderBy: { createdAt: "desc" } }); return NextResponse.json({ favorites: favorites.map(({ listing }) => ({ id: listing.id, slug: listing.slug, title: listing.title, priceCfa: listing.priceCfa.toString(), category: listing.category.label, city: listing.city?.name, coverUrl: listing.media[0]?.publicUrl, transaction: listing.transaction })) }); } catch (error) { return jsonError(error); } }

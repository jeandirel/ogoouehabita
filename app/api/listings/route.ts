import { ListingStatus, ListingTransaction, UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { AuthError, requireUser } from "@/lib/auth";
import { jsonError, readJson, text } from "@/lib/auth/http";
import { prisma } from "@/lib/db";

function slugify(value: string) { return `${value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${crypto.randomUUID().slice(0, 8)}`; }

export async function GET() {
  try {
    const user = await requireUser();
    const listings = await prisma.listing.findMany({ where: { OR: [{ ownerId: user.id }, { agency: { members: { some: { userId: user.id, active: true } } } }] }, include: { category: true, city: true, district: true, media: { where: { deletedAt: null, visibility: "PUBLIC" }, orderBy: { sortOrder: "asc" }, take: 1 }, leads: { select: { id: true } } }, orderBy: { updatedAt: "desc" } });
    return NextResponse.json({ listings: listings.map((l) => ({ id: l.id, slug: l.slug, title: l.title, status: l.status, transaction: l.transaction, priceCfa: l.priceCfa.toString(), category: l.category.label, city: l.city?.name, district: l.district?.name, leadCount: l.leads.length, coverUrl: l.media[0]?.publicUrl })) });
  } catch (error) { return jsonError(error); }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    if (!user.roles.some((role) => ([UserRole.PROPRIETAIRE, UserRole.AGENT, UserRole.RESPONSABLE_AGENCE, UserRole.ADMIN] as UserRole[]).includes(role))) throw new AuthError(403, "Un rôle propriétaire ou professionnel est requis.");
    const body = await readJson(request); const title = text(body.title, "Titre", 8, 150); const description = text(body.description, "Description", 30, 5000); const categoryCode = text(body.categoryCode, "Catégorie", 2, 50); const cityId = text(body.cityId, "Ville", 1, 50); const districtId = typeof body.districtId === "string" && body.districtId ? body.districtId : undefined; const priceCfa = Number(body.priceCfa);
    if (!Number.isSafeInteger(priceCfa) || priceCfa <= 0) throw new AuthError(400, "Prix invalide.");
    const category = await prisma.propertyCategory.findUnique({ where: { code: categoryCode } }); if (!category) throw new AuthError(400, "Catégorie invalide.");
    const city = await prisma.city.findUnique({ where: { id: cityId } }); if (!city) throw new AuthError(400, "Ville invalide."); if (districtId && !(await prisma.district.findFirst({ where: { id: districtId, cityId } }))) throw new AuthError(400, "Quartier invalide.");
    const transaction = body.transaction === "location" ? ListingTransaction.RENT : ListingTransaction.SALE;
    const listing = await prisma.listing.create({ data: { ownerId: user.id, categoryId: category.id, cityId: city.id, districtId, slug: slugify(title), title, description, transaction, status: ListingStatus.DRAFT, priceCfa: BigInt(priceCfa), surfaceM2: typeof body.surfaceM2 === "number" ? body.surfaceM2 : null, bedrooms: typeof body.bedrooms === "number" ? body.bedrooms : null } });
    await prisma.auditLog.create({ data: { actorId: user.id, action: "LISTING_CREATE", entity: "Listing", entityId: listing.id } });
    return NextResponse.json({ listing: { id: listing.id, slug: listing.slug, status: listing.status } }, { status: 201 });
  } catch (error) { return jsonError(error); }
}

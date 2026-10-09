import { ListingStatus, UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { AuthError, requireUser } from "@/lib/auth";
import { jsonError, readJson, text } from "@/lib/auth/http";
import { prisma } from "@/lib/db";

async function controlledListing(id: string, userId: string, roles: UserRole[]) {
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) throw new AuthError(404, "Annonce introuvable.");
  const canModerate = roles.some((role) => ([UserRole.MODERATEUR, UserRole.ADMIN] as UserRole[]).includes(role));
  const agencyAccess = listing.agencyId ? await prisma.agencyMember.findFirst({ where: { agencyId: listing.agencyId, userId, active: true } }) : null;
  if (!canModerate && listing.ownerId !== userId && !agencyAccess) throw new AuthError(403, "Vous ne pouvez pas gérer cette annonce.");
  return { listing, canModerate };
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser(); const { id } = await params; const { listing, canModerate } = await controlledListing(id, user.id, user.roles); const body = await readJson(request);
    const data: { title?: string; description?: string; status?: ListingStatus; rejectionReason?: string; publishedAt?: Date; expiresAt?: Date } = {};
    if (body.title !== undefined) data.title = text(body.title, "Titre", 8, 150);
    if (body.description !== undefined) data.description = text(body.description, "Description", 30, 5000);
    if (body.action === "submit") { if (listing.status !== ListingStatus.DRAFT && listing.status !== ListingStatus.REJECTED) throw new AuthError(409, "Cette annonce ne peut pas être soumise."); const photoCount = await prisma.listingMedia.count({ where: { listingId: id, kind: "PHOTO", visibility: "PUBLIC", deletedAt: null } }); if (photoCount === 0) throw new AuthError(409, "Ajoutez au moins une photo publique avant la soumission."); data.status = ListingStatus.PENDING_REVIEW; data.rejectionReason = undefined; }
    if (canModerate && body.action === "publish") { if (listing.status !== ListingStatus.PENDING_REVIEW) throw new AuthError(409, "Seule une annonce soumise peut être publiée."); data.status = ListingStatus.PUBLISHED; data.publishedAt = new Date(); data.expiresAt = new Date(Date.now() + 90 * 86400_000); }
    if (canModerate && body.action === "reject") { data.status = ListingStatus.REJECTED; data.rejectionReason = text(body.rejectionReason, "Motif de refus", 5, 1000); }
    if (body.action === "archive") data.status = ListingStatus.ARCHIVED;
    if (body.action === "sold" && listing.transaction === "SALE") data.status = ListingStatus.SOLD;
    if (body.action === "rented" && listing.transaction === "RENT") data.status = ListingStatus.RENTED;
    const updated = await prisma.listing.update({ where: { id }, data }); await prisma.auditLog.create({ data: { actorId: user.id, action: `LISTING_${body.action ?? "UPDATE"}`.toUpperCase(), entity: "Listing", entityId: id } });
    return NextResponse.json({ listing: { id: updated.id, status: updated.status } });
  } catch (error) { return jsonError(error); }
}
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const user = await requireUser(); const { id } = await params; await controlledListing(id, user.id, user.roles); await prisma.listing.delete({ where: { id } }); await prisma.auditLog.create({ data: { actorId: user.id, action: "LISTING_DELETE", entity: "Listing", entityId: id } }); return new NextResponse(null, { status: 204 }); } catch (error) { return jsonError(error); }
}

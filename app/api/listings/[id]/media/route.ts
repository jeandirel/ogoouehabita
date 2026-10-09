import { MediaKind, MediaVisibility, UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { AuthError, requireUser } from "@/lib/auth";
import { jsonError } from "@/lib/auth/http";
import { prisma } from "@/lib/db";
import { writeLocalMedia } from "@/lib/media/local";
const MAX_PUBLIC_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_PRIVATE_DOCUMENT_BYTES = 15 * 1024 * 1024;
const MAX_PHOTOS = 20;

async function controlledListing(id: string, userId: string, roles: UserRole[]) {
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) throw new AuthError(404, "Annonce introuvable.");
  const agencyMember = listing.agencyId ? await prisma.agencyMember.findFirst({ where: { agencyId: listing.agencyId, userId, active: true } }) : null;
  const moderator = roles.some((role) => ([UserRole.MODERATEUR, UserRole.ADMIN] as UserRole[]).includes(role));
  if (!moderator && listing.ownerId !== userId && !agencyMember) throw new AuthError(403, "Vous ne pouvez pas gérer les médias de cette annonce.");
  return listing;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser(); const { id } = await params; await controlledListing(id, user.id, user.roles);
    const media = await prisma.listingMedia.findMany({ where: { listingId: id, deletedAt: null }, orderBy: [{ isCover: "desc" }, { sortOrder: "asc" }] });
    return NextResponse.json({ media: media.map((item) => ({ id: item.id, kind: item.kind, url: item.publicUrl, sortOrder: item.sortOrder, isCover: item.isCover, visibility: item.visibility })) });
  } catch (error) { return jsonError(error); }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser(); const { id } = await params; await controlledListing(id, user.id, user.roles);
    if (request.headers.get("content-type")?.includes("application/json")) {
      const body = await request.json() as { kind?: string; url?: string };
      const kind = body.kind === "VIDEO" ? MediaKind.VIDEO : body.kind === "VIRTUAL_TOUR" ? MediaKind.VIRTUAL_TOUR : null;
      if (!kind || typeof body.url !== "string") throw new AuthError(400, "Lien média invalide.");
      let url: URL; try { url = new URL(body.url); } catch { throw new AuthError(400, "URL invalide."); }
      if (url.protocol !== "https:") throw new AuthError(400, "Une URL HTTPS est requise.");
      const existing = await prisma.listingMedia.findFirst({ where: { listingId: id, kind, deletedAt: null } });
      if (existing) throw new AuthError(409, kind === MediaKind.VIDEO ? "Une vidéo existe déjà." : "Une visite virtuelle existe déjà.");
      const sortOrder = await prisma.listingMedia.count({ where: { listingId: id, deletedAt: null } });
      const media = await prisma.listingMedia.create({ data: { listingId: id, kind, visibility: MediaVisibility.PUBLIC, storageKey: url.toString(), publicUrl: url.toString(), sortOrder } });
      await prisma.auditLog.create({ data: { actorId: user.id, action: "LISTING_MEDIA_LINK", entity: "ListingMedia", entityId: media.id } });
      return NextResponse.json({ media: { id: media.id, kind: media.kind, url: media.publicUrl, sortOrder, isCover: false } }, { status: 201 });
    }
    const form = await request.formData(); const file = form.get("file"); const privateDocument = form.get("visibility") === "PRIVATE";
    if (!(file instanceof File) || file.size === 0) throw new AuthError(400, "Fichier requis.");
    if (file.size > (privateDocument ? MAX_PRIVATE_DOCUMENT_BYTES : MAX_PUBLIC_IMAGE_BYTES)) throw new AuthError(413, "Fichier trop volumineux.");
    if (!privateDocument && !["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new AuthError(400, "Utilisez une image JPEG, PNG ou WebP.");
    const photoCount = await prisma.listingMedia.count({ where: { listingId: id, kind: MediaKind.PHOTO, deletedAt: null } });
    if (!privateDocument && photoCount >= MAX_PHOTOS) throw new AuthError(409, `Une annonce accepte au maximum ${MAX_PHOTOS} photos.`);
    const visibility = privateDocument ? MediaVisibility.PRIVATE : MediaVisibility.PUBLIC; const storageKey = await writeLocalMedia(file, visibility);
    const media = await prisma.listingMedia.create({ data: { listingId: id, kind: privateDocument ? MediaKind.DOCUMENT : MediaKind.PHOTO, visibility, storageKey, mimeType: file.type, sizeBytes: file.size, sortOrder: photoCount, isCover: photoCount === 0 && visibility === MediaVisibility.PUBLIC } });
    const result = visibility === MediaVisibility.PUBLIC ? await prisma.listingMedia.update({ where: { id: media.id }, data: { publicUrl: `/api/media/${media.id}` } }) : media;
    await prisma.auditLog.create({ data: { actorId: user.id, action: "LISTING_MEDIA_UPLOAD", entity: "ListingMedia", entityId: media.id } });
    return NextResponse.json({ media: { id: result.id, kind: result.kind, url: result.publicUrl, sortOrder: result.sortOrder, isCover: result.isCover, visibility: result.visibility } }, { status: 201 });
  } catch (error) { return jsonError(error); }
}

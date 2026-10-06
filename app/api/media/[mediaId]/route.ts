import { MediaVisibility, UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { readLocalMedia } from "@/lib/media/local";
export async function GET(_request: Request, { params }: { params: Promise<{ mediaId: string }> }) {
  const { mediaId } = await params; const media = await prisma.listingMedia.findFirst({ where: { id: mediaId, deletedAt: null }, include: { listing: true } });
  if (!media) return new NextResponse("Introuvable", { status: 404 });
  if (media.visibility === MediaVisibility.PRIVATE) { const user = await currentUser(); const moderator = user?.roles.some((role) => ([UserRole.MODERATEUR, UserRole.ADMIN] as UserRole[]).includes(role)); const agencyMember = user && media.listing.agencyId ? await prisma.agencyMember.findFirst({ where: { agencyId: media.listing.agencyId, userId: user.id, active: true } }) : null; if (!user || (!moderator && user.id !== media.listing.ownerId && !agencyMember)) return new NextResponse("Non autorisé", { status: 403 }); }
  try { return new NextResponse(await readLocalMedia(media.storageKey), { headers: { "Content-Type": media.mimeType ?? "application/octet-stream", "Cache-Control": media.visibility === MediaVisibility.PUBLIC ? "public, max-age=86400" : "private, no-store" } }); } catch { return new NextResponse("Fichier indisponible", { status: 404 }); }
}

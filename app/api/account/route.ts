import { NextResponse } from "next/server";
import { UserStatus } from "@prisma/client";
import { clearSessionCookie, requireUser } from "@/lib/auth";
import { jsonError, readJson, text } from "@/lib/auth/http";
import { prisma } from "@/lib/db";
export async function DELETE(request: Request) { try { const user = await requireUser(); const confirmation = text((await readJson(request)).confirmation, "Confirmation", 1, 32); if (confirmation !== "SUPPRIMER") return NextResponse.json({ error: "Confirmez la suppression en saisissant SUPPRIMER." }, { status: 400 }); await prisma.$transaction([prisma.session.updateMany({ where: { userId: user.id, revokedAt: null }, data: { revokedAt: new Date() } }), prisma.user.update({ where: { id: user.id }, data: { status: UserStatus.DELETED, deletedAt: new Date(), email: null, phone: null, passwordHash: null, fullName: "Compte supprimé" } }), prisma.auditLog.create({ data: { actorId: user.id, action: "ACCOUNT_DELETE", entity: "User", entityId: user.id } })]); const response = NextResponse.json({ ok: true }); clearSessionCookie(response); return response; } catch (error) { return jsonError(error); } }

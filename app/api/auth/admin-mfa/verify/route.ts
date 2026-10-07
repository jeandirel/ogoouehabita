import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { AuthError, currentSession } from "@/lib/auth";
import { decryptMfaSecret, verifyTotp } from "@/lib/admin-mfa";
import { jsonError, readJson, text } from "@/lib/auth/http";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await currentSession();
    if (!session || !session.user.roles.includes(UserRole.ADMIN)) throw new AuthError(403, "Permission insuffisante.");
    if (!session.user.adminMfaEnabled || !session.user.adminMfaSecretEncrypted) throw new AuthError(409, "Configurez d’abord le second facteur administrateur.");
    const body = await readJson(request);
    const code = text(body.code, "Code", 6, 6);
    if (!verifyTotp(decryptMfaSecret(session.user.adminMfaSecretEncrypted), code)) throw new AuthError(400, "Code de vérification invalide ou expiré.");
    await prisma.session.update({ where: { id: session.id }, data: { adminMfaVerifiedAt: new Date() } });
    await prisma.auditLog.create({ data: { actorId: session.user.id, action: "ADMIN_MFA_VERIFY", entity: "Session", entityId: session.id } });
    return NextResponse.json({ verified: true });
  } catch (error) {
    return jsonError(error);
  }
}

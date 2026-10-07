import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { AuthError, currentSession, requireRole } from "@/lib/auth";
import { createTotpSecret, decryptMfaSecret, encryptMfaSecret, totpUri, verifyTotp } from "@/lib/admin-mfa";
import { jsonError, readJson, text } from "@/lib/auth/http";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const user = await requireRole(UserRole.ADMIN);
    const session = await currentSession();
    if (user.adminMfaEnabled) return NextResponse.json({ enabled: true, verified: Boolean(session?.adminMfaVerifiedAt) });
    const secret = user.adminMfaPendingEncrypted ? decryptMfaSecret(user.adminMfaPendingEncrypted) : createTotpSecret();
    if (!user.adminMfaPendingEncrypted) await prisma.user.update({ where: { id: user.id }, data: { adminMfaPendingEncrypted: encryptMfaSecret(secret) } });
    return NextResponse.json({ enabled: false, secret, uri: totpUri(secret, user.email ?? user.id) });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireRole(UserRole.ADMIN);
    if (user.adminMfaEnabled) throw new AuthError(409, "Le second facteur est déjà activé.");
    if (!user.adminMfaPendingEncrypted) throw new AuthError(409, "Commencez d’abord la configuration du second facteur.");
    const body = await readJson(request);
    const code = text(body.code, "Code", 6, 6);
    const secret = decryptMfaSecret(user.adminMfaPendingEncrypted);
    if (!verifyTotp(secret, code)) throw new AuthError(400, "Code de vérification invalide ou expiré.");
    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { adminMfaEnabled: true, adminMfaSecretEncrypted: encryptMfaSecret(secret), adminMfaPendingEncrypted: null } }),
      prisma.auditLog.create({ data: { actorId: user.id, action: "ADMIN_MFA_ENABLE", entity: "User", entityId: user.id } }),
    ]);
    return NextResponse.json({ enabled: true });
  } catch (error) {
    return jsonError(error);
  }
}

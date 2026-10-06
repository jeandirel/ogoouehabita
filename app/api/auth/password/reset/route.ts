import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { jsonError, readJson, text } from "@/lib/auth/http";
import { consumeEmailToken } from "@/lib/auth/tokens";
import { prisma } from "@/lib/db";
export async function POST(request: Request) {
  try {
    const body = await readJson(request); const token = text(body.token, "Jeton", 20, 200); const password = text(body.password, "Mot de passe", 12, 200); const record = await consumeEmailToken(token, "reset-password");
    if (!record?.userId) return NextResponse.json({ error: "Lien invalide ou expiré." }, { status: 400 });
    await prisma.$transaction([prisma.user.update({ where: { id: record.userId }, data: { passwordHash: hashPassword(password) } }), prisma.session.updateMany({ where: { userId: record.userId, revokedAt: null }, data: { revokedAt: new Date() } })]);
    return NextResponse.json({ ok: true, message: "Mot de passe modifié. Reconnectez-vous." });
  } catch (error) { return jsonError(error); }
}

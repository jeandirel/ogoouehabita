import { NextResponse } from "next/server";
import { UserStatus } from "@prisma/client";
import { applySessionCookie, createSession } from "@/lib/auth";
import { jsonError, readJson, text } from "@/lib/auth/http";
import { consumeEmailToken } from "@/lib/auth/tokens";
import { prisma } from "@/lib/db";
export async function POST(request: Request) {
  try {
    const body = await readJson(request); const token = text(body.token, "Jeton", 20, 200); const record = await consumeEmailToken(token, "verify-email");
    if (!record?.userId) return NextResponse.json({ error: "Lien invalide ou expiré." }, { status: 400 });
    const user = await prisma.user.update({ where: { id: record.userId }, data: { status: UserStatus.ACTIVE, emailVerifiedAt: new Date() } });
    const response = NextResponse.json({ ok: true }); applySessionCookie(response, await createSession(user.id)); return response;
  } catch (error) { return jsonError(error); }
}

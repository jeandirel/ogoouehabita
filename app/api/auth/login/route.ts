import { NextResponse } from "next/server";
import { UserStatus } from "@prisma/client";
import { applySessionCookie, createSession, verifyPassword } from "@/lib/auth";
import { email, jsonError, readJson, text } from "@/lib/auth/http";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await readJson(request);
    const address = email(body.email);
    const password = text(body.password, "Mot de passe", 1, 200);
    const user = await prisma.user.findUnique({ where: { email: address } });
    if (!user || !verifyPassword(password, user.passwordHash)) return NextResponse.json({ error: "Email ou mot de passe incorrect." }, { status: 401 });
    if (user.status === UserStatus.PENDING_EMAIL) return NextResponse.json({ error: "Vérifiez d'abord votre adresse email." }, { status: 403 });
    if (user.status !== UserStatus.ACTIVE) return NextResponse.json({ error: "Ce compte ne peut pas se connecter." }, { status: 403 });
    const response = NextResponse.json({ ok: true, user: { id: user.id, fullName: user.fullName, roles: user.roles } });
    applySessionCookie(response, await createSession(user.id));
    return response;
  } catch (error) { return jsonError(error); }
}

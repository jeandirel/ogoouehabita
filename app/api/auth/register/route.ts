import { NextResponse } from "next/server";
import { UserRole, UserStatus } from "@prisma/client";
import { email, jsonError, readJson, text } from "@/lib/auth/http";
import { hashPassword } from "@/lib/auth";
import { issueEmailToken } from "@/lib/auth/tokens";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    if (process.env.NODE_ENV === "production" && process.env.EMAIL_PROVIDER === "disabled") return NextResponse.json({ error: "Le service email n'est pas configuré; inscription indisponible." }, { status: 503 });
    const body = await readJson(request);
    const fullName = text(body.fullName, "Nom", 2, 120);
    const address = email(body.email);
    const password = text(body.password, "Mot de passe", 12, 200);
    const phone = typeof body.phone === "string" && body.phone.trim() ? text(body.phone, "Téléphone", 6, 32) : undefined;
    const role = body.role === "proprietaire" ? UserRole.PROPRIETAIRE : UserRole.PARTICULIER;
    const duplicate = await prisma.user.findFirst({ where: { OR: [{ email: address }, ...(phone ? [{ phone }] : [])] } });
    if (duplicate) return NextResponse.json({ error: "Un compte existe déjà avec cet email ou ce téléphone." }, { status: 409 });
    const user = await prisma.user.create({ data: { fullName, email: address, phone, passwordHash: hashPassword(password), roles: [role], status: UserStatus.PENDING_EMAIL } });
    const token = await issueEmailToken(user.id, address, "verify-email");
    return NextResponse.json({ ok: true, message: "Compte créé. Vérifiez votre adresse email.", ...(process.env.NODE_ENV !== "production" ? { developmentVerificationToken: token } : {}) }, { status: 201 });
  } catch (error) { return jsonError(error); }
}

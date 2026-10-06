import { NextResponse } from "next/server";
import { email, jsonError, readJson } from "@/lib/auth/http";
import { issueEmailToken } from "@/lib/auth/tokens";
import { prisma } from "@/lib/db";
export async function POST(request: Request) {
  try {
    const address = email((await readJson(request)).email); const user = await prisma.user.findUnique({ where: { email: address } });
    const token = user ? await issueEmailToken(user.id, address, "reset-password") : undefined;
    return NextResponse.json({ ok: true, message: "Si un compte existe, un email de réinitialisation a été envoyé.", ...(process.env.NODE_ENV !== "production" && token ? { developmentResetToken: token } : {}) });
  } catch (error) { return jsonError(error); }
}

import { NextResponse } from "next/server";
import { clearSessionCookie, requireUser } from "@/lib/auth";
import { jsonError } from "@/lib/auth/http";
import { prisma } from "@/lib/db";
export async function POST() { try { const user = await requireUser(); await prisma.session.updateMany({ where: { userId: user.id, revokedAt: null }, data: { revokedAt: new Date() } }); const response = NextResponse.json({ ok: true }); clearSessionCookie(response); return response; } catch (error) { return jsonError(error); } }

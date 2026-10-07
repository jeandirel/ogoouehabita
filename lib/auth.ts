import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { UserRole, UserStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

const SESSION_COOKIE = "ogooue_session";
const SESSION_DAYS = 30;
const SESSION_SECRET = process.env.SESSION_SECRET;

function requiredSecret() {
  if (!SESSION_SECRET || SESSION_SECRET.length < 32) throw new Error("SESSION_SECRET doit contenir au moins 32 caractères.");
  return SESSION_SECRET;
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `scrypt:${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export function verifyPassword(password: string, encoded: string | null) {
  if (!encoded?.startsWith("scrypt:")) return false;
  const [, salt, expected] = encoded.split(":");
  const actual = scryptSync(password, salt, 64).toString("hex");
  return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(actual, "hex"));
}

export function newOpaqueToken() { return randomBytes(32).toString("base64url"); }
export function tokenHash(token: string) { return createHash("sha256").update(`${requiredSecret()}:${token}`).digest("hex"); }

export async function createSession(userId: string) {
  const token = newOpaqueToken();
  const requestHeaders = await headers();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400_000);
  await prisma.session.create({ data: { userId, tokenHash: tokenHash(token), expiresAt, userAgent: requestHeaders.get("user-agent")?.slice(0, 512), ipAddress: requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() } });
  return { token, expiresAt };
}

export function applySessionCookie(response: NextResponse, session: { token: string; expiresAt: Date }) {
  response.cookies.set(SESSION_COOKIE, session.token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", expires: session.expiresAt });
}

export async function currentSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({ where: { tokenHash: tokenHash(token) }, include: { user: true } });
  if (!session || session.revokedAt || session.expiresAt <= new Date() || session.user.status !== UserStatus.ACTIVE) return null;
  void prisma.session.update({ where: { id: session.id }, data: { lastSeenAt: new Date() } });
  return session;
}

export async function currentUser() {
  return (await currentSession())?.user ?? null;
}

export async function requireUser() {
  const user = await currentUser();
  if (!user) throw new AuthError(401, "Authentification requise.");
  return user;
}

export async function requireRole(...roles: UserRole[]) {
  const user = await requireUser();
  if (!roles.some((role) => user.roles.includes(role))) throw new AuthError(403, "Permission insuffisante.");
  return user;
}

export async function requireAdminMfa() {
  const session = await currentSession();
  if (!session || !session.user.roles.includes(UserRole.ADMIN)) throw new AuthError(403, "Permission insuffisante.");
  if (!session.user.adminMfaEnabled) throw new AuthError(403, "Configurez le second facteur administrateur.");
  if (!session.adminMfaVerifiedAt) throw new AuthError(403, "Validez le second facteur pour cette session.");
  return { user: session.user, session };
}

export class AuthError extends Error { constructor(public status: number, message: string) { super(message); } }

export async function revokeCurrentSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (token) await prisma.session.updateMany({ where: { tokenHash: tokenHash(token), revokedAt: null }, data: { revokedAt: new Date() } });
}

export function clearSessionCookie(response: NextResponse) { response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 }); }

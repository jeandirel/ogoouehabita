import { NotificationChannel } from "@prisma/client";
import { newOpaqueToken, tokenHash } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function issueEmailToken(userId: string, target: string, purpose: "verify-email" | "reset-password") {
  const token = newOpaqueToken();
  await prisma.verificationToken.deleteMany({ where: { userId, purpose, consumedAt: null } });
  await prisma.verificationToken.create({ data: { userId, channel: NotificationChannel.EMAIL, target, purpose, tokenHash: tokenHash(token), expiresAt: new Date(Date.now() + 60 * 60 * 1000) } });
  return token;
}
export async function consumeEmailToken(token: string, purpose: "verify-email" | "reset-password") {
  const record = await prisma.verificationToken.findUnique({ where: { tokenHash: tokenHash(token) } });
  if (!record || record.purpose !== purpose || record.consumedAt || record.expiresAt <= new Date() || record.attempts >= record.maxAttempts) return null;
  await prisma.verificationToken.update({ where: { id: record.id }, data: { attempts: { increment: 1 }, consumedAt: new Date() } });
  return record;
}

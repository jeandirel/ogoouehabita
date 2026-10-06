import { createHash, randomBytes, scryptSync } from "node:crypto";
import { PrismaClient, UserRole, UserStatus } from "@prisma/client";

const prisma = new PrismaClient();

function arg(name: string) {
  const prefix = `--${name}=`;
  return process.argv.find((v) => v.startsWith(prefix))?.slice(prefix.length);
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

async function main() {
  const email = arg("email")?.toLowerCase().trim();
  const name = arg("name")?.trim() || "Administrateur Ogooué";
  const password = arg("password") || process.env.ADMIN_INITIAL_PASSWORD;
  if (!email || !password || password.length < 14) {
    throw new Error("Usage: npm run admin:create -- --email=admin@example.com --password='mot-de-passe-14-caracteres-minimum'");
  }
  const existingAdmin = await prisma.user.findFirst({ where: { roles: { has: UserRole.ADMIN }, status: { not: UserStatus.DELETED } } });
  if (existingAdmin && process.env.ALLOW_ADDITIONAL_ADMIN !== "true") {
    throw new Error("Un administrateur existe déjà. Définissez ALLOW_ADDITIONAL_ADMIN=true pour en ajouter un autre.");
  }
  const user = await prisma.user.upsert({
    where: { email },
    update: { roles: { set: [UserRole.ADMIN] }, status: UserStatus.ACTIVE, emailVerifiedAt: new Date(), passwordHash: hashPassword(password) },
    create: { email, fullName: name, roles: [UserRole.ADMIN], status: UserStatus.ACTIVE, emailVerifiedAt: new Date(), passwordHash: hashPassword(password) },
  });
  await prisma.auditLog.create({ data: { actorId: user.id, action: "ADMIN_BOOTSTRAP", entity: "User", entityId: user.id, metadata: { emailHash: createHash("sha256").update(email).digest("hex") } } });
  console.log(`Administrateur créé ou mis à jour: ${email}`);
}

main().finally(async () => prisma.$disconnect());

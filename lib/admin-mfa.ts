import { createCipheriv, createDecipheriv, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function encryptionKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("SESSION_SECRET doit contenir au moins 32 caractères.");
  return createHmac("sha256", secret).update("ogooue-admin-mfa-v1").digest();
}

export function createTotpSecret() {
  const bytes = randomBytes(20);
  let bits = "";
  for (const byte of bytes) bits += byte.toString(2).padStart(8, "0");
  let result = "";
  for (let index = 0; index < bits.length; index += 5) result += alphabet[Number.parseInt(bits.slice(index, index + 5).padEnd(5, "0"), 2)];
  return result;
}

function decodeBase32(value: string) {
  let bits = "";
  for (const char of value.replace(/=+$/g, "").toUpperCase()) {
    const index = alphabet.indexOf(char);
    if (index < 0) throw new Error("Secret TOTP invalide.");
    bits += index.toString(2).padStart(5, "0");
  }
  const bytes = [];
  for (let index = 0; index + 8 <= bits.length; index += 8) bytes.push(Number.parseInt(bits.slice(index, index + 8), 2));
  return Buffer.from(bytes);
}

function codeAt(secret: string, counter: number) {
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64BE(BigInt(counter));
  const digest = createHmac("sha1", decodeBase32(secret)).update(buffer).digest();
  const offset = digest[digest.length - 1] & 15;
  return String((digest.readUInt32BE(offset) & 0x7fffffff) % 1_000_000).padStart(6, "0");
}

export function verifyTotp(secret: string, code: string) {
  const candidate = code.replace(/\s/g, "");
  if (!/^\d{6}$/.test(candidate)) return false;
  const counter = Math.floor(Date.now() / 30_000);
  return [-1, 0, 1].some((window) => timingSafeEqual(Buffer.from(codeAt(secret, counter + window)), Buffer.from(candidate)));
}

export function encryptMfaSecret(secret: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), encrypted].map((part) => part.toString("base64url")).join(".");
}

export function decryptMfaSecret(value: string) {
  const [iv, tag, encrypted] = value.split(".").map((part) => Buffer.from(part, "base64url"));
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}

export function totpUri(secret: string, email: string) {
  return `otpauth://totp/Ogoou%C3%A9%20Habitat:${encodeURIComponent(email)}?secret=${secret}&issuer=Ogoou%C3%A9%20Habitat&algorithm=SHA1&digits=6&period=30`;
}

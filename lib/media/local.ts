import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
const root = path.resolve(process.env.MEDIA_LOCAL_ROOT ?? "storage/media");
const allowed = new Map([["image/jpeg", "jpg"], ["image/png", "png"], ["image/webp", "webp"], ["application/pdf", "pdf"]]);
export function acceptedMediaType(type: string) { return allowed.get(type); }
export async function writeLocalMedia(file: File, visibility: "PUBLIC" | "PRIVATE") { const extension = acceptedMediaType(file.type); if (!extension) throw new Error("Type de fichier non autorisé."); const name = `${visibility.toLowerCase()}/${randomUUID()}.${extension}`; const absolute = path.join(root, name); await mkdir(path.dirname(absolute), { recursive: true }); await writeFile(absolute, Buffer.from(await file.arrayBuffer()), { flag: "wx" }); return name; }
export async function readLocalMedia(key: string) { return readFile(path.join(root, key)); }
export async function removeLocalMedia(key: string) { await unlink(path.join(root, key)).catch(() => undefined); }

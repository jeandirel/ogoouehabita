import { NextResponse } from "next/server";
import { AuthError } from "@/lib/auth";

export function jsonError(error: unknown) {
  if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
  console.error(error);
  return NextResponse.json({ error: "Une erreur serveur est survenue." }, { status: 500 });
}
export async function readJson(request: Request) { try { return await request.json() as Record<string, unknown>; } catch { throw new AuthError(400, "Corps de requête invalide."); } }
export function email(value: unknown) {
  if (typeof value !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) throw new AuthError(400, "Adresse email invalide.");
  return value.trim().toLowerCase();
}
export function text(value: unknown, label: string, min = 1, max = 500) {
  if (typeof value !== "string" || value.trim().length < min || value.trim().length > max) throw new AuthError(400, `${label} invalide.`);
  return value.trim();
}

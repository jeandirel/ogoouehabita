import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { jsonError } from "@/lib/auth/http";
import { prisma } from "@/lib/db";
export async function GET() { try { await requireRole("ADMIN", "MODERATEUR"); const listings = await prisma.listing.findMany({ where: { status: "PENDING_REVIEW" }, include: { owner: { select: { fullName: true, email: true } }, category: true, city: true }, orderBy: { updatedAt: "asc" }, take: 100 }); return NextResponse.json({ listings: listings.map((l) => ({ id: l.id, title: l.title, category: l.category.label, city: l.city?.name, owner: l.owner.fullName, email: l.owner.email, updatedAt: l.updatedAt })) }); } catch (error) { return jsonError(error); } }

import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { jsonError } from "@/lib/auth/http";
import { prisma } from "@/lib/db";
export async function POST(_request: Request, { params }: { params: Promise<{ listingId: string }> }) { try { const user = await requireUser(); const { listingId } = await params; await prisma.favorite.upsert({ where: { userId_listingId: { userId: user.id, listingId } }, update: {}, create: { userId: user.id, listingId } }); return NextResponse.json({ ok: true }, { status: 201 }); } catch (error) { return jsonError(error); } }
export async function DELETE(_request: Request, { params }: { params: Promise<{ listingId: string }> }) { try { const user = await requireUser(); const { listingId } = await params; await prisma.favorite.deleteMany({ where: { userId: user.id, listingId } }); return new NextResponse(null, { status: 204 }); } catch (error) { return jsonError(error); } }

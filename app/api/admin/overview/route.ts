import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { jsonError } from "@/lib/auth/http";
import { prisma } from "@/lib/db";
export async function GET() { try { await requireRole("ADMIN", "MODERATEUR"); const [users, agencies, pendingListings, reports, payments] = await Promise.all([prisma.user.count(), prisma.agency.count(), prisma.listing.count({ where: { status: "PENDING_REVIEW" } }), prisma.report.count({ where: { status: "OPEN" } }), prisma.payment.aggregate({ _sum: { amountCfa: true }, where: { status: "SUCCEEDED" } })]); return NextResponse.json({ users, agencies, pendingListings, reports, paidCfa: payments._sum.amountCfa?.toString() ?? "0" }); } catch (error) { return jsonError(error); } }

import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
export async function GET() { const user = await currentUser(); return NextResponse.json({ user: user ? { id: user.id, fullName: user.fullName, email: user.email, roles: user.roles } : null }); }

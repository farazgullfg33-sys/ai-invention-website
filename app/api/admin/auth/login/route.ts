import { NextResponse } from "next/server";
import { adminSessionCookie, getAdminPassword, getAdminSessionToken, getAdminUsername } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { username?: unknown; password?: unknown } | null;
  const username = typeof body?.username === "string" ? body.username : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (username.trim().toLowerCase() !== getAdminUsername().toLowerCase() || password !== getAdminPassword()) {
    return NextResponse.json({ ok: false, message: "Invalid admin username or password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminSessionCookie, getAdminSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return response;
}

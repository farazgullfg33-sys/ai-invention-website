import { NextResponse } from "next/server";
import { createClientSessionToken, clientSessionCookie } from "@/lib/client-auth";
import { verifyCustomerLogin } from "@/lib/admin-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: unknown; password?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const customerId = await verifyCustomerLogin(email, password);

  if (!customerId) {
    return NextResponse.json({ ok: false, message: "Invalid customer email or password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(clientSessionCookie, createClientSessionToken(customerId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return response;
}

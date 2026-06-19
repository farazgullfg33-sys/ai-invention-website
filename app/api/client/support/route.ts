import { NextResponse } from "next/server";
import { createCustomerSupportTicket } from "@/lib/admin-store";
import { getClientSessionCustomerId, unauthorizedClientResponse } from "@/lib/client-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const customerId = getClientSessionCustomerId(request);

  if (!customerId) {
    return unauthorizedClientResponse();
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  try {
    const portal = await createCustomerSupportTicket(customerId, body ?? {});
    return NextResponse.json({ ok: true, portal });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Support request failed." },
      { status: 400 },
    );
  }
}

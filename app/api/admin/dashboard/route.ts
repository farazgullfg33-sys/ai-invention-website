import { NextResponse } from "next/server";
import { hasAdminSession, unauthorizedAdminResponse } from "@/lib/admin-auth";
import { getAdminDashboardState, getAdminStats } from "@/lib/admin-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!hasAdminSession(request)) {
    return unauthorizedAdminResponse();
  }

  const state = await getAdminDashboardState();

  return NextResponse.json({
    ok: true,
    state,
    stats: getAdminStats(state),
  });
}

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "ai-invention-complete-platform",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
}

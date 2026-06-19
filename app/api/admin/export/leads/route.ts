import { NextResponse } from "next/server";
import { hasAdminSession, unauthorizedAdminResponse } from "@/lib/admin-auth";
import { getAdminDashboardState } from "@/lib/admin-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function csvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

export async function GET(request: Request) {
  if (!hasAdminSession(request)) {
    return unauthorizedAdminResponse();
  }

  const state = await getAdminDashboardState();
  const rows = [
    ["Name", "Email", "Phone", "Service", "Business Type", "Status", "Source", "Created At", "Message"],
    ...state.leads.map((lead) => [
      lead.name,
      lead.email,
      lead.phone,
      lead.service,
      lead.businessType,
      lead.status,
      lead.source,
      lead.createdAt,
      lead.message,
    ]),
  ];

  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="ai-invention-leads.csv"',
    },
  });
}

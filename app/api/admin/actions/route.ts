import { NextResponse } from "next/server";
import { hasAdminSession, unauthorizedAdminResponse } from "@/lib/admin-auth";
import {
  convertLeadToCustomer,
  createCustomer,
  createInvoice,
  createInvoiceFromQuotation,
  createLead,
  createPackage,
  createProject,
  createQuotationFromLead,
  getAdminStats,
  markInvoicePaid,
  queueMaintenanceReminders,
  recordPayment,
  resetCustomerPortalAccess,
  togglePackage,
  toggleCustomerPortalAccess,
  updateAdminProfile,
  updateCustomerStatus,
  updateInvoiceStatus,
  updateLeadStatus,
  updateProjectStatus,
  updateQuotationStatus,
  updateSupportTicketStatus,
} from "@/lib/admin-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const actions = {
  createLead,
  updateLeadStatus,
  createPackage,
  togglePackage,
  createQuotationFromLead,
  updateQuotationStatus,
  createInvoiceFromQuotation,
  convertLeadToCustomer,
  createCustomer,
  resetCustomerPortalAccess,
  toggleCustomerPortalAccess,
  updateCustomerStatus,
  createInvoice,
  updateInvoiceStatus,
  markInvoicePaid,
  recordPayment,
  createProject,
  updateProjectStatus,
  updateSupportTicketStatus,
  updateAdminProfile,
} as const;

export async function POST(request: Request) {
  if (!hasAdminSession(request)) {
    return unauthorizedAdminResponse();
  }

  const body = (await request.json().catch(() => null)) as {
    action?: keyof typeof actions | "queueMaintenanceReminders";
    payload?: Record<string, unknown>;
  } | null;

  if (!body?.action) {
    return NextResponse.json({ ok: false, message: "Action is required." }, { status: 400 });
  }

  try {
    if (body.action === "queueMaintenanceReminders") {
      const result = await queueMaintenanceReminders();
      return NextResponse.json({
        ok: true,
        created: result.created,
        state: result.state,
        stats: getAdminStats(result.state),
      });
    }

    const handler = actions[body.action];

    if (!handler) {
      return NextResponse.json({ ok: false, message: "Unknown admin action." }, { status: 400 });
    }

    const result = await handler(body.payload ?? {});
    const state = "state" in result ? result.state : result;

    return NextResponse.json({
      ok: true,
      state,
      stats: getAdminStats(state),
      temporaryPassword: "temporaryPassword" in result ? result.temporaryPassword : undefined,
      inviteLink: "inviteLink" in result ? result.inviteLink : undefined,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Admin action failed.",
      },
      { status: 400 },
    );
  }
}

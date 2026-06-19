import { NextResponse } from "next/server";
import {
  convertLeadToCustomer,
  createCustomer,
  createInvoice,
  createInvoiceFromQuotation,
  createLead,
  createPackage,
  createProject,
  createQuotationFromLead,
  getAdminDashboardState,
  getAdminStats,
  markInvoicePaid,
  queueMaintenanceReminders,
  recordPayment,
  togglePackage,
  updateAdminProfile,
  updateCustomerStatus,
  updateInvoiceStatus,
  updateLeadStatus,
  updateProjectStatus,
  updateQuotationStatus,
} from "@/lib/admin-store";

type JsonRpcRequest = {
  id?: string | number | null;
  jsonrpc?: "2.0";
  method?: string;
  params?: {
    name?: string;
    arguments?: Record<string, unknown>;
    uri?: string;
  };
};

type ToolDefinition = {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
};

const json = (value: unknown) => JSON.stringify(value, null, 2);

const emptySchema = {
  type: "object" as const,
  properties: {},
};

const idSchema = (label: string) => ({
  type: "object" as const,
  properties: {
    id: { type: "string", description: label },
  },
  required: ["id"],
});

const tools: ToolDefinition[] = [
  {
    name: "admin.dashboard.get",
    description: "Read the complete AI Invention admin dashboard state, stats, records, and operational queues.",
    inputSchema: emptySchema,
  },
  {
    name: "admin.audit.run",
    description: "Return a non-mutating backend coverage audit for Hermes control readiness.",
    inputSchema: emptySchema,
  },
  {
    name: "admin.profile.update",
    description: "Update admin display name, admin image URL, company name, and invoice note.",
    inputSchema: {
      type: "object",
      properties: {
        adminName: { type: "string" },
        adminImageUrl: { type: "string" },
        companyName: { type: "string" },
        invoiceNote: { type: "string" },
      },
    },
  },
  {
    name: "admin.lead.create",
    description: "Create a new lead record in the admin panel.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        service: { type: "string" },
        businessType: { type: "string" },
        message: { type: "string" },
      },
      required: ["name", "email"],
    },
  },
  {
    name: "admin.lead.updateStatus",
    description: "Update lead status. Allowed: New, Contacted, Quoted, Converted, Lost.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        status: { type: "string", enum: ["New", "Contacted", "Quoted", "Converted", "Lost"] },
      },
      required: ["id", "status"],
    },
  },
  {
    name: "admin.lead.createQuotation",
    description: "Create a quotation from a lead and move the lead to Quoted.",
    inputSchema: {
      type: "object",
      properties: { leadId: { type: "string" } },
      required: ["leadId"],
    },
  },
  {
    name: "admin.lead.convertToCustomer",
    description: "Convert a lead into customer, maintenance plan, and project records.",
    inputSchema: {
      type: "object",
      properties: { leadId: { type: "string" } },
      required: ["leadId"],
    },
  },
  {
    name: "admin.customer.create",
    description: "Create a customer and matching maintenance plan.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        company: { type: "string" },
        packageName: { type: "string" },
        project: { type: "string" },
        maintenanceDue: { type: "string" },
      },
      required: ["name", "email"],
    },
  },
  {
    name: "admin.customer.updateStatus",
    description: "Update customer status. Allowed: Active, Onboarding, Paused.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        status: { type: "string", enum: ["Active", "Onboarding", "Paused"] },
      },
      required: ["id", "status"],
    },
  },
  {
    name: "admin.package.create",
    description: "Create a new service package.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        setupFee: { type: "number" },
        monthlyFee: { type: "number" },
        currency: { type: "string" },
        includes: { type: "string" },
      },
      required: ["name", "setupFee", "monthlyFee"],
    },
  },
  {
    name: "admin.package.toggle",
    description: "Toggle a service package active/paused state.",
    inputSchema: idSchema("Package id"),
  },
  {
    name: "admin.quotation.updateStatus",
    description: "Update quotation status. Allowed: Draft, Sent, Approved, Rejected.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        status: { type: "string", enum: ["Draft", "Sent", "Approved", "Rejected"] },
      },
      required: ["id", "status"],
    },
  },
  {
    name: "admin.quotation.createInvoice",
    description: "Approve a quotation and generate an invoice from it.",
    inputSchema: idSchema("Quotation id"),
  },
  {
    name: "admin.invoice.create",
    description: "Create a manual invoice.",
    inputSchema: {
      type: "object",
      properties: {
        customerName: { type: "string" },
        packageName: { type: "string" },
        amount: { type: "number" },
        dueDate: { type: "string" },
      },
      required: ["customerName", "amount"],
    },
  },
  {
    name: "admin.invoice.updateStatus",
    description: "Update invoice status. Allowed: Draft, Pending, Due soon, Paid, Overdue.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        status: { type: "string", enum: ["Draft", "Pending", "Due soon", "Paid", "Overdue"] },
      },
      required: ["id", "status"],
    },
  },
  {
    name: "admin.invoice.markPaid",
    description: "Mark an invoice paid and create a confirmed payment ledger record.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        reference: { type: "string" },
      },
      required: ["id"],
    },
  },
  {
    name: "admin.payment.record",
    description: "Record a manual payment against an invoice. The invoice is marked paid when confirmed payment total reaches invoice amount.",
    inputSchema: {
      type: "object",
      properties: {
        invoiceId: { type: "string" },
        amount: { type: "number" },
        reference: { type: "string" },
        receivedAt: { type: "string" },
      },
      required: ["invoiceId", "amount"],
    },
  },
  {
    name: "admin.project.create",
    description: "Create a delivery project with comma-separated tasks.",
    inputSchema: {
      type: "object",
      properties: {
        customerName: { type: "string" },
        title: { type: "string" },
        packageName: { type: "string" },
        dueDate: { type: "string" },
        tasks: { type: "string" },
      },
      required: ["customerName", "title"],
    },
  },
  {
    name: "admin.project.updateStatus",
    description: "Update project status. Allowed: Planned, In progress, Waiting client, Completed.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string" },
        status: { type: "string", enum: ["Planned", "In progress", "Waiting client", "Completed"] },
      },
      required: ["id", "status"],
    },
  },
  {
    name: "admin.maintenance.queueReminders",
    description: "Queue maintenance reminder logs for active plans inside their reminder window.",
    inputSchema: emptySchema,
  },
];

const toolHandlers: Record<string, (args: Record<string, unknown>) => Promise<unknown>> = {
  "admin.dashboard.get": async () => {
    const state = await getAdminDashboardState();
    return { state, stats: getAdminStats(state) };
  },
  "admin.audit.run": async () => {
    const state = await getAdminDashboardState();
    return {
      ok: true,
      endpoint: "/api/mcp",
      toolCount: tools.length,
      modules: {
        leads: state.leads.length,
        customers: state.customers.length,
        packages: state.packages.length,
        quotations: state.quotations.length,
        invoices: state.invoices.length,
        payments: state.payments.length,
        maintenancePlans: state.maintenancePlans.length,
        reminderLogs: state.reminderLogs.length,
        projects: state.projects.length,
      },
      coverage: [
        "dashboard read",
        "lead create/status/quote/convert",
        "customer create/status",
        "package create/toggle",
        "quotation status/invoice",
        "invoice create/status/paid",
        "payment ledger",
        "project create/status",
        "maintenance reminder queue",
      ],
    };
  },
  "admin.profile.update": updateAdminProfile,
  "admin.lead.create": createLead,
  "admin.lead.updateStatus": updateLeadStatus,
  "admin.lead.createQuotation": createQuotationFromLead,
  "admin.lead.convertToCustomer": convertLeadToCustomer,
  "admin.customer.create": createCustomer,
  "admin.customer.updateStatus": updateCustomerStatus,
  "admin.package.create": createPackage,
  "admin.package.toggle": togglePackage,
  "admin.quotation.updateStatus": updateQuotationStatus,
  "admin.quotation.createInvoice": createInvoiceFromQuotation,
  "admin.invoice.create": createInvoice,
  "admin.invoice.updateStatus": updateInvoiceStatus,
  "admin.invoice.markPaid": markInvoicePaid,
  "admin.payment.record": recordPayment,
  "admin.project.create": createProject,
  "admin.project.updateStatus": updateProjectStatus,
  "admin.maintenance.queueReminders": async () => queueMaintenanceReminders(),
};

function rpcResult(id: JsonRpcRequest["id"], result: unknown) {
  return NextResponse.json({ jsonrpc: "2.0", id: id ?? null, result });
}

function rpcError(id: JsonRpcRequest["id"], code: number, message: string) {
  return NextResponse.json({ jsonrpc: "2.0", id: id ?? null, error: { code, message } }, { status: code === -32600 ? 400 : 200 });
}

function authError(message: string) {
  return NextResponse.json({ jsonrpc: "2.0", id: null, error: { code: -32001, message } }, { status: 401 });
}

function getBearerToken(request: Request) {
  const header = request.headers.get("authorization") ?? "";
  const [scheme, token] = header.split(" ");
  return scheme?.toLowerCase() === "bearer" ? token : "";
}

function checkAuth(request: Request) {
  const expected = process.env.HERMES_MCP_API_KEY || process.env.HERMES_AGENT_API_KEY || "";

  if (!expected) {
    return { ok: true, mode: "local-dev-open" };
  }

  return { ok: getBearerToken(request) === expected, mode: "bearer-token" };
}

export async function handleHermesMcpGet(request: Request) {
  const auth = checkAuth(request);
  if (!auth.ok) {
    return authError("Invalid or missing Hermes MCP bearer token.");
  }

  return NextResponse.json({
    ok: true,
    name: "ai-invention-admin-mcp",
    endpoint: "/api/mcp",
    auth: auth.mode,
    protocol: "json-rpc-2.0",
    supportedMethods: ["initialize", "ping", "tools/list", "tools/call", "resources/list", "resources/read"],
    toolCount: tools.length,
  });
}

export async function handleHermesMcpPost(request: Request) {
  const auth = checkAuth(request);
  if (!auth.ok) {
    return authError("Invalid or missing Hermes MCP bearer token.");
  }

  const rpc = (await request.json().catch(() => null)) as JsonRpcRequest | null;

  if (!rpc?.method) {
    return rpcError(null, -32600, "Invalid JSON-RPC request.");
  }

  if (rpc.method === "initialize") {
    return rpcResult(rpc.id, {
      protocolVersion: "2024-11-05",
      capabilities: {
        tools: {},
        resources: {},
      },
      serverInfo: {
        name: "ai-invention-admin-mcp",
        version: "1.0.0",
      },
    });
  }

  if (rpc.method === "notifications/initialized") {
    return new NextResponse(null, { status: 202 });
  }

  if (rpc.method === "ping") {
    return rpcResult(rpc.id, { ok: true });
  }

  if (rpc.method === "tools/list") {
    return rpcResult(rpc.id, { tools });
  }

  if (rpc.method === "tools/call") {
    const name = rpc.params?.name ?? "";
    const handler = toolHandlers[name];

    if (!handler) {
      return rpcError(rpc.id, -32601, `Unknown tool: ${name}`);
    }

    try {
      const result = await handler(rpc.params?.arguments ?? {});
      return rpcResult(rpc.id, {
        content: [
          {
            type: "text",
            text: json(result),
          },
        ],
      });
    } catch (error) {
      return rpcResult(rpc.id, {
        isError: true,
        content: [
          {
            type: "text",
            text: error instanceof Error ? error.message : "Tool call failed.",
          },
        ],
      });
    }
  }

  if (rpc.method === "resources/list") {
    return rpcResult(rpc.id, {
      resources: [
        {
          uri: "admin://dashboard",
          name: "AI Invention Admin Dashboard",
          description: "Complete current admin state and stats.",
          mimeType: "application/json",
        },
        {
          uri: "admin://audit",
          name: "Hermes Admin MCP Audit",
          description: "Non-mutating readiness audit for Hermes control.",
          mimeType: "application/json",
        },
      ],
    });
  }

  if (rpc.method === "resources/read") {
    const uri = rpc.params?.uri;
    const state = await getAdminDashboardState();
    const payload =
      uri === "admin://audit"
        ? await toolHandlers["admin.audit.run"]({})
        : {
            state,
            stats: getAdminStats(state),
          };

    return rpcResult(rpc.id, {
      contents: [
        {
          uri: uri ?? "admin://dashboard",
          mimeType: "application/json",
          text: json(payload),
        },
      ],
    });
  }

  return rpcError(rpc.id, -32601, `Unsupported method: ${rpc.method}`);
}

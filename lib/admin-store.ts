import { mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import bcrypt from "bcryptjs";

export type LeadStatus = "New" | "Contacted" | "Quoted" | "Converted" | "Lost";
export type CustomerStatus = "Active" | "Onboarding" | "Paused";
export type QuotationStatus = "Draft" | "Sent" | "Approved" | "Rejected";
export type InvoiceStatus = "Draft" | "Pending" | "Due soon" | "Paid" | "Overdue";
export type PaymentStatus = "Pending" | "Confirmed" | "Failed";
export type MaintenanceStatus = "Active" | "Paused";
export type ProjectStatus = "Planned" | "In progress" | "Waiting client" | "Completed";
export type ReminderStatus = "Queued" | "Sent";
export type CustomerPortalStatus = "Enabled" | "Disabled";
export type SupportTicketStatus = "Open" | "In review" | "Resolved";

export type AdminLead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  businessType: string;
  status: LeadStatus;
  source: string;
  createdAt: string;
  message: string;
};

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  packageName: string;
  status: CustomerStatus;
  project: string;
  maintenanceDue: string;
  createdAt: string;
  portalAccess?: {
    status: CustomerPortalStatus;
    passwordHash: string;
    inviteToken: string;
    inviteCreatedAt: string;
    lastLoginAt: string;
  };
};

export type AdminPackage = {
  id: string;
  name: string;
  setupFee: number;
  monthlyFee: number;
  currency: string;
  includes: string;
  active: boolean;
};

export type AdminQuotation = {
  id: string;
  quoteNumber: string;
  leadId: string;
  customerName: string;
  packageName: string;
  amount: number;
  currency: string;
  status: QuotationStatus;
  createdAt: string;
  validUntil: string;
};

export type AdminInvoice = {
  id: string;
  invoiceNumber: string;
  customerName: string;
  packageName: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  dueDate: string;
  issuedAt: string;
  paidAt: string;
};

export type AdminPayment = {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  currency: string;
  method: "Manual bank transfer" | "Cash" | "Other";
  reference: string;
  status: PaymentStatus;
  receivedAt: string;
  createdAt: string;
};

export type AdminMaintenancePlan = {
  id: string;
  customerName: string;
  packageName: string;
  monthlyFee: number;
  currency: string;
  status: MaintenanceStatus;
  nextDueDate: string;
  reminderDaysBefore: number;
};

export type AdminReminderLog = {
  id: string;
  maintenancePlanId: string;
  customerName: string;
  channel: "email";
  recipient: string;
  subject: string;
  status: ReminderStatus;
  createdAt: string;
};

export type AdminProject = {
  id: string;
  customerName: string;
  title: string;
  packageName: string;
  status: ProjectStatus;
  dueDate: string;
  tasks: string[];
  createdAt: string;
};

export type AdminSupportTicket = {
  id: string;
  customerId: string;
  customerName: string;
  subject: string;
  message: string;
  status: SupportTicketStatus;
  createdAt: string;
};

export type AdminSettings = {
  adminName: string;
  adminImageUrl: string;
  companyName: string;
  invoiceNote: string;
};

export type AdminDashboardState = {
  leads: AdminLead[];
  customers: AdminCustomer[];
  packages: AdminPackage[];
  quotations: AdminQuotation[];
  invoices: AdminInvoice[];
  payments: AdminPayment[];
  maintenancePlans: AdminMaintenancePlan[];
  reminderLogs: AdminReminderLog[];
  projects: AdminProject[];
  supportTickets: AdminSupportTicket[];
  settings: AdminSettings;
};

const dataDir = join(process.cwd(), "data");
const storePath = join(dataDir, "admin-store.json");
const websiteLeadsPath = join(dataDir, "leads.jsonl");

const leadStatuses: LeadStatus[] = ["New", "Contacted", "Quoted", "Converted", "Lost"];
const customerStatuses: CustomerStatus[] = ["Active", "Onboarding", "Paused"];
const quotationStatuses: QuotationStatus[] = ["Draft", "Sent", "Approved", "Rejected"];
const invoiceStatuses: InvoiceStatus[] = ["Draft", "Pending", "Due soon", "Paid", "Overdue"];
const projectStatuses: ProjectStatus[] = ["Planned", "In progress", "Waiting client", "Completed"];
const supportTicketStatuses: SupportTicketStatus[] = ["Open", "In review", "Resolved"];

const now = () => new Date().toISOString();

function makeId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy.toISOString().slice(0, 10);
}

function clean(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim().slice(0, 1000) : fallback;
}

function money(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed) : fallback;
}

function requireText(value: unknown, label: string) {
  const text = clean(value);
  if (!text) {
    throw new Error(`${label} is required.`);
  }
  return text;
}

function nextNumber(prefix: string, count: number) {
  return `${prefix}-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;
}

function normalizeCustomer(customer: AdminCustomer): AdminCustomer {
  if (!customer.portalAccess) {
    return customer;
  }

  return {
    ...customer,
    portalAccess: {
      status: customer.portalAccess.status === "Disabled" ? "Disabled" : "Enabled",
      passwordHash: customer.portalAccess.passwordHash ?? "",
      inviteToken: customer.portalAccess.inviteToken ?? "",
      inviteCreatedAt: customer.portalAccess.inviteCreatedAt ?? "",
      lastLoginAt: customer.portalAccess.lastLoginAt ?? "",
    },
  };
}

function matchesCustomer(customer: AdminCustomer, value: string) {
  const normalized = value.trim().toLowerCase();
  return [customer.name, customer.company, customer.email].some((field) => field.toLowerCase() === normalized);
}

function makeTemporaryPassword(customer: AdminCustomer) {
  const namePart = (customer.company || customer.name || "client")
    .replace(/[^a-z0-9]/gi, "")
    .slice(0, 5)
    .toUpperCase()
    .padEnd(5, "AI");
  return `AI-${namePart}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function defaultState(): AdminDashboardState {
  const today = new Date();

  return {
    leads: [
      {
        id: "lead_sample_1",
        name: "Sample Lead",
        email: "client@example.com",
        phone: "",
        service: "Website + AI Agent Bundle",
        businessType: "Local service business",
        status: "New",
        source: "sample",
        createdAt: now(),
        message: "Wants a site, WhatsApp CTA, and automated lead follow-up.",
      },
    ],
    customers: [
      {
        id: "customer_novastack",
        name: "NovaStack AI",
        email: "ops@novastack.ai",
        phone: "",
        company: "NovaStack AI",
        packageName: "Website + AI Agent Bundle",
        status: "Active",
        project: "Deployment QA",
        maintenanceDue: addDays(today, 6),
        createdAt: now(),
      },
      {
        id: "customer_brightpath",
        name: "BrightPath Studio",
        email: "hello@brightpath.studio",
        phone: "",
        company: "BrightPath Studio",
        packageName: "Website Only",
        status: "Onboarding",
        project: "Content collection",
        maintenanceDue: addDays(today, 12),
        createdAt: now(),
      },
    ],
    packages: [
      {
        id: "package_website",
        name: "Website Only",
        setupFee: 200,
        monthlyFee: 100,
        currency: "USD",
        includes: "Landing page, SEO basics, hosting handoff",
        active: true,
      },
      {
        id: "package_agent",
        name: "AI Agent Deployment",
        setupFee: 200,
        monthlyFee: 100,
        currency: "USD",
        includes: "VPS setup, agent deployment, monthly monitoring",
        active: true,
      },
      {
        id: "package_bundle",
        name: "Website + AI Agent Bundle",
        setupFee: 350,
        monthlyFee: 150,
        currency: "USD",
        includes: "Website, chat/Telegram agent, maintenance cycle",
        active: true,
      },
    ],
    quotations: [
      {
        id: "quote_sample_1",
        quoteNumber: "Q-2026-0001",
        leadId: "lead_sample_1",
        customerName: "Sample Lead",
        packageName: "Website + AI Agent Bundle",
        amount: 350,
        currency: "USD",
        status: "Sent",
        createdAt: now(),
        validUntil: addDays(today, 14),
      },
    ],
    invoices: [
      {
        id: "invoice_sample_paid",
        invoiceNumber: "INV-2026-0018",
        customerName: "NovaStack AI",
        packageName: "Website + AI Agent Bundle",
        amount: 350,
        currency: "USD",
        status: "Paid",
        dueDate: addDays(today, -4),
        issuedAt: addDays(today, -12),
        paidAt: addDays(today, -3),
      },
      {
        id: "invoice_sample_pending",
        invoiceNumber: "INV-2026-0019",
        customerName: "BrightPath Studio",
        packageName: "Website Only",
        amount: 200,
        currency: "USD",
        status: "Pending",
        dueDate: addDays(today, 5),
        issuedAt: addDays(today, -1),
        paidAt: "",
      },
    ],
    payments: [
      {
        id: "payment_sample_1",
        invoiceId: "invoice_sample_paid",
        invoiceNumber: "INV-2026-0018",
        customerName: "NovaStack AI",
        amount: 350,
        currency: "USD",
        method: "Manual bank transfer",
        reference: "BANK-0018",
        status: "Confirmed",
        receivedAt: addDays(today, -3),
        createdAt: now(),
      },
    ],
    maintenancePlans: [
      {
        id: "maintenance_novastack",
        customerName: "NovaStack AI",
        packageName: "Website + AI Agent Bundle",
        monthlyFee: 150,
        currency: "USD",
        status: "Active",
        nextDueDate: addDays(today, 6),
        reminderDaysBefore: 5,
      },
      {
        id: "maintenance_brightpath",
        customerName: "BrightPath Studio",
        packageName: "Website Only",
        monthlyFee: 100,
        currency: "USD",
        status: "Active",
        nextDueDate: addDays(today, 12),
        reminderDaysBefore: 5,
      },
    ],
    reminderLogs: [],
    projects: [
      {
        id: "project_novastack",
        customerName: "NovaStack AI",
        title: "AI agent deployment",
        packageName: "Website + AI Agent Bundle",
        status: "In progress",
        dueDate: addDays(today, 10),
        tasks: ["Confirm domain", "Deploy VPS agent", "QA lead capture", "Client handoff"],
        createdAt: now(),
      },
      {
        id: "project_brightpath",
        customerName: "BrightPath Studio",
        title: "Website launch",
        packageName: "Website Only",
        status: "Waiting client",
        dueDate: addDays(today, 16),
        tasks: ["Collect copy", "Prepare homepage", "Connect contact form"],
        createdAt: now(),
      },
    ],
    supportTickets: [],
    settings: {
      adminName: "Admin",
      adminImageUrl: "",
      companyName: "AI Invention",
      invoiceNote: "Manual bank transfer payment. Admin marks invoice paid after confirmation.",
    },
  };
}

function normalizeState(value: Partial<AdminDashboardState> | null): AdminDashboardState {
  const fallback = defaultState();

  return {
    leads: Array.isArray(value?.leads) ? value.leads : fallback.leads,
    packages: Array.isArray(value?.packages) ? value.packages : fallback.packages,
    quotations: Array.isArray(value?.quotations) ? value.quotations : fallback.quotations,
    invoices: Array.isArray(value?.invoices) ? value.invoices : fallback.invoices,
    payments: Array.isArray(value?.payments) ? value.payments : fallback.payments,
    maintenancePlans: Array.isArray(value?.maintenancePlans) ? value.maintenancePlans : fallback.maintenancePlans,
    reminderLogs: Array.isArray(value?.reminderLogs) ? value.reminderLogs : fallback.reminderLogs,
    customers: Array.isArray(value?.customers) ? value.customers.map(normalizeCustomer) : fallback.customers,
    projects: Array.isArray(value?.projects) ? value.projects : fallback.projects,
    supportTickets: Array.isArray(value?.supportTickets) ? value.supportTickets : fallback.supportTickets,
    settings: typeof value?.settings === "object" && value.settings ? { ...fallback.settings, ...value.settings } : fallback.settings,
  };
}

function parseWebsiteLead(line: string): AdminLead | null {
  try {
    const item = JSON.parse(line) as Record<string, unknown>;
    const email = clean(item.email).toLowerCase();
    const createdAt = clean(item.createdAt, now());

    if (!email || !clean(item.name)) {
      return null;
    }

    return {
      id: `website_${Buffer.from(`${email}-${createdAt}`).toString("base64url").slice(0, 18)}`,
      name: clean(item.name),
      email,
      phone: clean(item.telegram),
      service: clean(item.service, "Not selected"),
      businessType: clean(item.businessType, "Unknown"),
      status: "New",
      source: clean(item.source, "website-contact-form"),
      createdAt,
      message: clean(item.message),
    };
  } catch {
    return null;
  }
}

async function readWebsiteLeads() {
  try {
    const content = await readFile(websiteLeadsPath, "utf8");
    return content
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map(parseWebsiteLead)
      .filter((lead): lead is AdminLead => Boolean(lead));
  } catch {
    return [];
  }
}

async function readStoredState() {
  try {
    const file = await readFile(storePath, "utf8");
    return normalizeState(JSON.parse(file) as Partial<AdminDashboardState>);
  } catch {
    return defaultState();
  }
}

async function writeStoredState(state: AdminDashboardState) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(storePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

function mergeWebsiteLeads(state: AdminDashboardState, websiteLeads: AdminLead[]) {
  const storedIds = new Set(state.leads.map((lead) => lead.id));
  const newLeads = websiteLeads.filter((lead) => !storedIds.has(lead.id));

  if (!newLeads.length) {
    return state;
  }

  return {
    ...state,
    leads: [...newLeads, ...state.leads].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
  };
}

export async function getAdminDashboardState() {
  const state = mergeWebsiteLeads(await readStoredState(), await readWebsiteLeads());
  await writeStoredState(state);
  return state;
}

export function getAdminStats(state: AdminDashboardState) {
  const openLeads = state.leads.filter((lead) => !["Converted", "Lost"].includes(lead.status)).length;
  const activeCustomers = state.customers.filter((customer) => customer.status === "Active").length;
  const pendingQuotes = state.quotations.filter((quote) => quote.status !== "Approved" && quote.status !== "Rejected").length;
  const unpaidInvoices = state.invoices
    .filter((invoice) => invoice.status !== "Paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  const monthlyRevenue = state.payments
    .filter((payment) => payment.status === "Confirmed")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const today = Date.now();
  const maintenanceDue = state.maintenancePlans.filter((plan) => {
    const diff = Math.ceil((Date.parse(plan.nextDueDate) - today) / 86400000);
    return plan.status === "Active" && diff <= plan.reminderDaysBefore;
  }).length;

  return [
    { label: "Open leads", value: String(openLeads), detail: "Ready for follow-up" },
    { label: "Monthly revenue", value: `$${monthlyRevenue}`, detail: "Confirmed manual payments" },
    { label: "Maintenance due", value: String(maintenanceDue), detail: "Within reminder window" },
    { label: "Active customers", value: String(activeCustomers), detail: `${state.customers.length} total records` },
    { label: "Pending quotes", value: String(pendingQuotes), detail: "Need approval or invoice" },
    { label: "Unpaid invoices", value: `$${unpaidInvoices}`, detail: "Manual payment tracking" },
  ];
}

export async function createLead(payload: Record<string, unknown>) {
  const state = await getAdminDashboardState();
  const lead: AdminLead = {
    id: makeId("lead"),
    name: requireText(payload.name, "Lead name"),
    email: requireText(payload.email, "Lead email").toLowerCase(),
    phone: clean(payload.phone),
    service: clean(payload.service, "Website + AI Agent Bundle"),
    businessType: clean(payload.businessType, "Business"),
    status: "New",
    source: clean(payload.source, "admin"),
    createdAt: now(),
    message: clean(payload.message),
  };

  state.leads.unshift(lead);
  await writeStoredState(state);
  return state;
}

export async function updateLeadStatus(payload: Record<string, unknown>) {
  const state = await getAdminDashboardState();
  const id = requireText(payload.id, "Lead id");
  const status = clean(payload.status) as LeadStatus;

  if (!leadStatuses.includes(status)) {
    throw new Error("Invalid lead status.");
  }

  state.leads = state.leads.map((lead) => (lead.id === id ? { ...lead, status } : lead));
  await writeStoredState(state);
  return state;
}

export async function createPackage(payload: Record<string, unknown>) {
  const state = await getAdminDashboardState();
  const packageName = requireText(payload.name, "Package name");

  if (state.packages.some((item) => item.name.toLowerCase() === packageName.toLowerCase())) {
    throw new Error("Package already exists.");
  }

  state.packages.unshift({
    id: makeId("package"),
    name: packageName,
    setupFee: money(payload.setupFee),
    monthlyFee: money(payload.monthlyFee),
    currency: clean(payload.currency, "USD").toUpperCase(),
    includes: clean(payload.includes, "Custom AI Invention service package"),
    active: true,
  });

  await writeStoredState(state);
  return state;
}

export async function togglePackage(payload: Record<string, unknown>) {
  const state = await getAdminDashboardState();
  const id = requireText(payload.id, "Package id");
  state.packages = state.packages.map((item) => (item.id === id ? { ...item, active: !item.active } : item));
  await writeStoredState(state);
  return state;
}

export async function createQuotationFromLead(payload: Record<string, unknown>) {
  const state = await getAdminDashboardState();
  const lead = state.leads.find((item) => item.id === clean(payload.leadId));

  if (!lead) {
    throw new Error("Lead not found.");
  }

  const selectedPackage = state.packages.find((item) => item.name === lead.service) ?? state.packages[0];
  const quotation: AdminQuotation = {
    id: makeId("quote"),
    quoteNumber: nextNumber("Q", state.quotations.length),
    leadId: lead.id,
    customerName: lead.name,
    packageName: selectedPackage.name,
    amount: selectedPackage.setupFee,
    currency: selectedPackage.currency,
    status: "Sent",
    createdAt: now(),
    validUntil: addDays(new Date(), 14),
  };

  state.quotations.unshift(quotation);
  state.leads = state.leads.map((item) => (item.id === lead.id ? { ...item, status: "Quoted" } : item));
  await writeStoredState(state);
  return state;
}

export async function updateQuotationStatus(payload: Record<string, unknown>) {
  const state = await getAdminDashboardState();
  const id = requireText(payload.id, "Quotation id");
  const status = clean(payload.status) as QuotationStatus;

  if (!quotationStatuses.includes(status)) {
    throw new Error("Invalid quotation status.");
  }

  state.quotations = state.quotations.map((quote) => (quote.id === id ? { ...quote, status } : quote));
  await writeStoredState(state);
  return state;
}

export async function createInvoiceFromQuotation(payload: Record<string, unknown>) {
  const state = await getAdminDashboardState();
  const quote = state.quotations.find((item) => item.id === clean(payload.id));

  if (!quote) {
    throw new Error("Quotation not found.");
  }

  state.quotations = state.quotations.map((item) => (item.id === quote.id ? { ...item, status: "Approved" } : item));
  state.invoices.unshift({
    id: makeId("invoice"),
    invoiceNumber: nextNumber("INV", state.invoices.length),
    customerName: quote.customerName,
    packageName: quote.packageName,
    amount: quote.amount,
    currency: quote.currency,
    status: "Pending",
    dueDate: addDays(new Date(), 7),
    issuedAt: now().slice(0, 10),
    paidAt: "",
  });

  await writeStoredState(state);
  return state;
}

export async function convertLeadToCustomer(payload: Record<string, unknown>) {
  const state = await getAdminDashboardState();
  const lead = state.leads.find((item) => item.id === clean(payload.leadId));

  if (!lead) {
    throw new Error("Lead not found.");
  }

  const exists = state.customers.some((customer) => customer.email.toLowerCase() === lead.email.toLowerCase());
  const selectedPackage = state.packages.find((item) => item.name === lead.service) ?? state.packages[0];

  if (!exists) {
    state.customers.unshift({
      id: makeId("customer"),
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.businessType,
      packageName: selectedPackage.name,
      status: "Onboarding",
      project: "Kickoff pending",
      maintenanceDue: addDays(new Date(), 30),
      createdAt: now(),
    });

    state.maintenancePlans.unshift({
      id: makeId("maintenance"),
      customerName: lead.name,
      packageName: selectedPackage.name,
      monthlyFee: selectedPackage.monthlyFee,
      currency: selectedPackage.currency,
      status: "Active",
      nextDueDate: addDays(new Date(), 30),
      reminderDaysBefore: 5,
    });

    state.projects.unshift({
      id: makeId("project"),
      customerName: lead.name,
      title: `${selectedPackage.name} delivery`,
      packageName: selectedPackage.name,
      status: "Planned",
      dueDate: addDays(new Date(), 14),
      tasks: ["Kickoff call", "Collect assets", "Build service", "QA and handoff"],
      createdAt: now(),
    });
  }

  state.leads = state.leads.map((item) => (item.id === lead.id ? { ...item, status: "Converted" } : item));
  await writeStoredState(state);
  return state;
}

export async function createCustomer(payload: Record<string, unknown>) {
  const state = await getAdminDashboardState();
  const selectedPackage = state.packages.find((item) => item.name === clean(payload.packageName)) ?? state.packages[0];
  const customer: AdminCustomer = {
    id: makeId("customer"),
    name: requireText(payload.name, "Customer name"),
    email: requireText(payload.email, "Customer email").toLowerCase(),
    phone: clean(payload.phone),
    company: clean(payload.company),
    packageName: selectedPackage.name,
    status: "Onboarding",
    project: clean(payload.project, "Kickoff pending"),
    maintenanceDue: clean(payload.maintenanceDue, addDays(new Date(), 30)),
    createdAt: now(),
  };

  if (state.customers.some((item) => item.email.toLowerCase() === customer.email)) {
    throw new Error("Customer email already exists.");
  }

  state.customers.unshift(customer);
  state.maintenancePlans.unshift({
    id: makeId("maintenance"),
    customerName: customer.name,
    packageName: selectedPackage.name,
    monthlyFee: selectedPackage.monthlyFee,
    currency: selectedPackage.currency,
    status: "Active",
    nextDueDate: customer.maintenanceDue,
    reminderDaysBefore: 5,
  });

  await writeStoredState(state);
  return state;
}

export async function updateCustomerStatus(payload: Record<string, unknown>) {
  const state = await getAdminDashboardState();
  const id = requireText(payload.id, "Customer id");
  const status = clean(payload.status) as CustomerStatus;

  if (!customerStatuses.includes(status)) {
    throw new Error("Invalid customer status.");
  }

  state.customers = state.customers.map((item) => (item.id === id ? { ...item, status } : item));
  await writeStoredState(state);
  return state;
}

export async function resetCustomerPortalAccess(payload: Record<string, unknown>) {
  const state = await getAdminDashboardState();
  const id = requireText(payload.id, "Customer id");
  const customer = state.customers.find((item) => item.id === id);

  if (!customer) {
    throw new Error("Customer not found.");
  }

  const temporaryPassword = clean(payload.password) || makeTemporaryPassword(customer);
  const passwordHash = await bcrypt.hash(temporaryPassword, 10);
  const inviteToken = makeId("invite");
  const inviteLink = `/client/login?email=${encodeURIComponent(customer.email)}&invite=${encodeURIComponent(inviteToken)}`;

  state.customers = state.customers.map((item) =>
    item.id === id
      ? {
          ...item,
          portalAccess: {
            status: "Enabled",
            passwordHash,
            inviteToken,
            inviteCreatedAt: now(),
            lastLoginAt: item.portalAccess?.lastLoginAt ?? "",
          },
        }
      : item,
  );

  await writeStoredState(state);
  return { state, temporaryPassword, inviteLink };
}

export async function toggleCustomerPortalAccess(payload: Record<string, unknown>) {
  const state = await getAdminDashboardState();
  const id = requireText(payload.id, "Customer id");
  let changed = false;

  state.customers = state.customers.map((item) => {
    if (item.id !== id) {
      return item;
    }

    changed = true;
    return {
      ...item,
      portalAccess: {
        status: item.portalAccess?.status === "Enabled" ? "Disabled" : "Enabled",
        passwordHash: item.portalAccess?.passwordHash ?? "",
        inviteToken: item.portalAccess?.inviteToken ?? makeId("invite"),
        inviteCreatedAt: item.portalAccess?.inviteCreatedAt ?? now(),
        lastLoginAt: item.portalAccess?.lastLoginAt ?? "",
      },
    };
  });

  if (!changed) {
    throw new Error("Customer not found.");
  }

  await writeStoredState(state);
  return state;
}

export async function createInvoice(payload: Record<string, unknown>) {
  const state = await getAdminDashboardState();
  const packageName = clean(payload.packageName, state.packages[0]?.name ?? "Custom service");
  const selectedPackage = state.packages.find((item) => item.name === packageName);
  const amount = money(payload.amount, selectedPackage?.setupFee ?? 0);
  const invoice: AdminInvoice = {
    id: makeId("invoice"),
    invoiceNumber: nextNumber("INV", state.invoices.length),
    customerName: requireText(payload.customerName, "Invoice customer"),
    packageName,
    amount,
    currency: selectedPackage?.currency ?? "USD",
    status: "Pending",
    dueDate: clean(payload.dueDate, addDays(new Date(), 7)),
    issuedAt: now().slice(0, 10),
    paidAt: "",
  };

  if (!invoice.amount) {
    throw new Error("Invoice amount is required.");
  }

  state.invoices.unshift(invoice);
  await writeStoredState(state);
  return state;
}

export async function updateInvoiceStatus(payload: Record<string, unknown>) {
  const state = await getAdminDashboardState();
  const id = requireText(payload.id, "Invoice id");
  const status = clean(payload.status) as InvoiceStatus;

  if (!invoiceStatuses.includes(status)) {
    throw new Error("Invalid invoice status.");
  }

  state.invoices = state.invoices.map((invoice) =>
    invoice.id === id ? { ...invoice, status, paidAt: status === "Paid" ? now().slice(0, 10) : invoice.paidAt } : invoice,
  );
  await writeStoredState(state);
  return state;
}

export async function markInvoicePaid(payload: Record<string, unknown>) {
  const state = await getAdminDashboardState();
  const id = requireText(payload.id, "Invoice id");
  const invoice = state.invoices.find((item) => item.id === id);

  if (!invoice) {
    throw new Error("Invoice not found.");
  }

  state.invoices = state.invoices.map((item) => (item.id === id ? { ...item, status: "Paid", paidAt: now().slice(0, 10) } : item));
  state.payments.unshift({
    id: makeId("payment"),
    invoiceId: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    customerName: invoice.customerName,
    amount: invoice.amount,
    currency: invoice.currency,
    method: "Manual bank transfer",
    reference: clean(payload.reference, `MANUAL-${invoice.invoiceNumber}`),
    status: "Confirmed",
    receivedAt: now().slice(0, 10),
    createdAt: now(),
  });

  await writeStoredState(state);
  return state;
}

export async function recordPayment(payload: Record<string, unknown>) {
  const state = await getAdminDashboardState();
  const invoiceKey = clean(payload.invoiceId) || clean(payload.invoiceNumber);
  const invoice = state.invoices.find((item) => item.id === invoiceKey || item.invoiceNumber.toLowerCase() === invoiceKey.toLowerCase());

  if (!invoice) {
    throw new Error("Invoice not found.");
  }

  const amount = money(payload.amount, invoice.amount);
  state.payments.unshift({
    id: makeId("payment"),
    invoiceId: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    customerName: invoice.customerName,
    amount,
    currency: invoice.currency,
    method: "Manual bank transfer",
    reference: clean(payload.reference, `MANUAL-${invoice.invoiceNumber}`),
    status: "Confirmed",
    receivedAt: clean(payload.receivedAt, now().slice(0, 10)),
    createdAt: now(),
  });

  const paidTotal = state.payments
    .filter((payment) => payment.invoiceId === invoice.id && payment.status === "Confirmed")
    .reduce((sum, payment) => sum + payment.amount, 0);

  if (paidTotal >= invoice.amount) {
    state.invoices = state.invoices.map((item) =>
      item.id === invoice.id ? { ...item, status: "Paid", paidAt: now().slice(0, 10) } : item,
    );
  }

  await writeStoredState(state);
  return state;
}

export async function createProject(payload: Record<string, unknown>) {
  const state = await getAdminDashboardState();
  const customerName = requireText(payload.customerName, "Project customer");
  const customer = state.customers.find((item) => item.name === customerName);
  const packageName = clean(payload.packageName, customer?.packageName ?? state.packages[0]?.name ?? "Custom project");
  const tasks = clean(payload.tasks, "Kickoff, Build, QA, Handoff")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  state.projects.unshift({
    id: makeId("project"),
    customerName,
    title: requireText(payload.title, "Project title"),
    packageName,
    status: "Planned",
    dueDate: clean(payload.dueDate, addDays(new Date(), 14)),
    tasks,
    createdAt: now(),
  });

  await writeStoredState(state);
  return state;
}

export async function updateProjectStatus(payload: Record<string, unknown>) {
  const state = await getAdminDashboardState();
  const id = requireText(payload.id, "Project id");
  const status = clean(payload.status) as ProjectStatus;

  if (!projectStatuses.includes(status)) {
    throw new Error("Invalid project status.");
  }

  state.projects = state.projects.map((project) => (project.id === id ? { ...project, status } : project));
  await writeStoredState(state);
  return state;
}

export async function updateSupportTicketStatus(payload: Record<string, unknown>) {
  const state = await getAdminDashboardState();
  const id = requireText(payload.id, "Support ticket id");
  const status = clean(payload.status) as SupportTicketStatus;

  if (!supportTicketStatuses.includes(status)) {
    throw new Error("Invalid support ticket status.");
  }

  state.supportTickets = state.supportTickets.map((ticket) => (ticket.id === id ? { ...ticket, status } : ticket));
  await writeStoredState(state);
  return state;
}

export async function updateAdminProfile(payload: Record<string, unknown>) {
  const state = await getAdminDashboardState();
  state.settings = {
    ...state.settings,
    adminName: clean(payload.adminName, state.settings.adminName),
    adminImageUrl: clean(payload.adminImageUrl, state.settings.adminImageUrl),
    companyName: clean(payload.companyName, state.settings.companyName),
    invoiceNote: clean(payload.invoiceNote, state.settings.invoiceNote),
  };

  await writeStoredState(state);
  return state;
}

export async function queueMaintenanceReminders() {
  const state = await getAdminDashboardState();
  const today = Date.now();
  let created = 0;

  for (const plan of state.maintenancePlans) {
    const diff = Math.ceil((Date.parse(plan.nextDueDate) - today) / 86400000);
    const alreadyQueued = state.reminderLogs.some(
      (log) => log.maintenancePlanId === plan.id && log.subject.includes(plan.nextDueDate),
    );

    if (plan.status === "Active" && diff <= plan.reminderDaysBefore && !alreadyQueued) {
      const customer = state.customers.find((item) => item.name === plan.customerName);
      state.reminderLogs.unshift({
        id: makeId("reminder"),
        maintenancePlanId: plan.id,
        customerName: plan.customerName,
        channel: "email",
        recipient: customer?.email ?? "",
        subject: `Maintenance payment reminder for ${plan.nextDueDate}`,
        status: "Queued",
        createdAt: now(),
      });
      created += 1;
    }
  }

  await writeStoredState(state);
  return { state, created };
}

export async function verifyCustomerLogin(email: string, password: string) {
  const state = await getAdminDashboardState();
  const normalizedEmail = email.trim().toLowerCase();
  const customer = state.customers.find((item) => item.email.toLowerCase() === normalizedEmail);

  if (!customer || customer.status === "Paused" || customer.portalAccess?.status !== "Enabled" || !customer.portalAccess.passwordHash) {
    return null;
  }

  const isValid = await bcrypt.compare(password, customer.portalAccess.passwordHash);

  if (!isValid) {
    return null;
  }

  state.customers = state.customers.map((item) =>
    item.id === customer.id && item.portalAccess
      ? { ...item, portalAccess: { ...item.portalAccess, lastLoginAt: now() } }
      : item,
  );
  await writeStoredState(state);

  return customer.id;
}

export async function getCustomerPortalState(customerId: string) {
  const state = await getAdminDashboardState();
  const customer = state.customers.find((item) => item.id === customerId);

  if (!customer || customer.status === "Paused" || customer.portalAccess?.status !== "Enabled") {
    return null;
  }

  const invoices = state.invoices.filter((invoice) => matchesCustomer(customer, invoice.customerName));
  const payments = state.payments.filter((payment) => matchesCustomer(customer, payment.customerName));
  const projects = state.projects.filter((project) => matchesCustomer(customer, project.customerName));
  const maintenancePlans = state.maintenancePlans.filter((plan) => matchesCustomer(customer, plan.customerName));
  const supportTickets = state.supportTickets.filter((ticket) => ticket.customerId === customer.id);

  return {
    customer: {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      packageName: customer.packageName,
      status: customer.status,
      project: customer.project,
      maintenanceDue: customer.maintenanceDue,
      lastLoginAt: customer.portalAccess.lastLoginAt,
    },
    invoices,
    payments,
    projects,
    maintenancePlans,
    supportTickets,
    settings: {
      companyName: state.settings.companyName,
      invoiceNote: state.settings.invoiceNote,
    },
  };
}

export async function createCustomerSupportTicket(customerId: string, payload: Record<string, unknown>) {
  const state = await getAdminDashboardState();
  const customer = state.customers.find((item) => item.id === customerId);

  if (!customer || customer.status === "Paused" || customer.portalAccess?.status !== "Enabled") {
    throw new Error("Customer portal access is inactive.");
  }

  state.supportTickets.unshift({
    id: makeId("support"),
    customerId: customer.id,
    customerName: customer.name,
    subject: requireText(payload.subject, "Subject"),
    message: requireText(payload.message, "Message"),
    status: "Open",
    createdAt: now(),
  });

  await writeStoredState(state);
  return getCustomerPortalState(customer.id);
}

export type ClientPortalState = NonNullable<Awaited<ReturnType<typeof getCustomerPortalState>>>;

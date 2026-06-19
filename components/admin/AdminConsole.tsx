"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeDollarSign,
  Bell,
  BellRing,
  Boxes,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  CreditCard,
  FileText,
  FolderKanban,
  Gauge,
  LayoutDashboard,
  KeyRound,
  LifeBuoy,
  LogOut,
  PackageCheck,
  Plus,
  ReceiptText,
  Search,
  Settings,
  ShieldCheck,
  UserCircle2,
  UsersRound,
  Wrench,
} from "lucide-react";
import { FormEvent, useMemo, useState, useTransition } from "react";
import type { AdminDashboardState } from "@/lib/admin-store";

type AdminStat = {
  label: string;
  value: string;
  detail: string;
};

type AdminConsoleProps = {
  initialState: AdminDashboardState;
  initialStats: AdminStat[];
};

const navItems = [
  { href: "#dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "#leads", label: "Leads", icon: ClipboardList },
  { href: "#customers", label: "Customers", icon: UsersRound },
  { href: "#packages", label: "Packages", icon: Boxes },
  { href: "#quotations", label: "Quotations", icon: FileText },
  { href: "#invoices", label: "Invoices", icon: ReceiptText },
  { href: "#payments", label: "Payments", icon: CreditCard },
  { href: "#maintenance", label: "Maintenance", icon: Wrench },
  { href: "#projects", label: "Projects", icon: FolderKanban },
  { href: "#settings", label: "Settings", icon: Settings },
] as const;

const timelineSteps = ["Lead", "Generation", "Quotation", "Payments", "Maintenance"] as const;

function statusClass(status: string) {
  const normalized = status.toLowerCase();

  if (normalized.includes("paid") || normalized.includes("active") || normalized.includes("converted") || normalized.includes("confirmed") || normalized.includes("completed") || normalized.includes("approved")) {
    return "admin-status admin-status-success";
  }

  if (normalized.includes("pending") || normalized.includes("soon") || normalized.includes("onboarding") || normalized.includes("quoted") || normalized.includes("progress") || normalized.includes("waiting") || normalized.includes("queued")) {
    return "admin-status admin-status-warning";
  }

  return "admin-status";
}

function formatDate(value: string) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatMoney(value: number, currency = "USD") {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formDataObject(form: HTMLFormElement) {
  return Object.fromEntries(new FormData(form).entries());
}

export function AdminConsole({ initialState, initialStats }: AdminConsoleProps) {
  const [state, setState] = useState(initialState);
  const [stats, setStats] = useState(initialStats);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("Backend connected. All admin modules are ready.");
  const [profileOpen, setProfileOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const filteredLeads = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) {
      return state.leads;
    }

    return state.leads.filter((lead) =>
      [lead.name, lead.email, lead.service, lead.businessType, lead.status, lead.message].some((field) =>
        field.toLowerCase().includes(value),
      ),
    );
  }, [query, state.leads]);

  const dashboardStats = stats.slice(0, 3);
  const secondaryStats = stats.slice(3);

  async function runAction(action: string, payload: Record<string, unknown> = {}, successMessage = "Saved") {
    setNotice("Working...");
    const response = await fetch("/api/admin/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, payload }),
    });
    const result = (await response.json()) as {
      ok: boolean;
      message?: string;
      created?: number;
      temporaryPassword?: string;
      inviteLink?: string;
      state?: AdminDashboardState;
      stats?: AdminStat[];
    };

    if (!response.ok || !result.ok || !result.state || !result.stats) {
      throw new Error(result.message ?? "Action failed.");
    }

    setState(result.state);
    setStats(result.stats);
    if (action === "queueMaintenanceReminders") {
      setNotice(`${result.created ?? 0} reminder(s) queued.`);
    } else if (result.temporaryPassword && result.inviteLink) {
      setNotice(`Portal access ready. Password: ${result.temporaryPassword} | Invite: ${result.inviteLink}`);
    } else {
      setNotice(successMessage);
    }
  }

  function submitForm(
    event: FormEvent<HTMLFormElement>,
    action: string,
    successMessage: string,
    transform: (payload: Record<string, FormDataEntryValue>) => Record<string, unknown> = (payload) => payload,
  ) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = formDataObject(form);

    startTransition(async () => {
      try {
        await runAction(action, transform(payload), successMessage);
        if (action !== "updateAdminProfile") {
          form.reset();
        }
      } catch (error) {
        setNotice(error instanceof Error ? error.message : "Action failed.");
      }
    });
  }

  function actionButton(action: string, payload: Record<string, unknown>, message: string) {
    startTransition(async () => {
      try {
        await runAction(action, payload, message);
      } catch (error) {
        setNotice(error instanceof Error ? error.message : "Action failed.");
      }
    });
  }

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <main className="admin-console" id="dashboard">
      <div className="admin-shell-frame">
        <aside className="admin-sidebar" aria-label="Admin navigation">
          <Link className="admin-brand admin-brand-logo" href="/admin">
            <Image
              alt="AI Invention"
              height={52}
              priority
              src="/images/ai-invention-logo.png"
              style={{ width: 210, height: "auto", objectFit: "contain" }}
              unoptimized
              width={220}
            />
          </Link>

          <nav className="admin-nav">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <a className={index === 0 ? "active" : ""} href={item.href} key={item.href}>
                  <Icon aria-hidden="true" size={18} />
                  {item.label}
                </a>
              );
            })}
          </nav>
        </aside>

        <section className="admin-main">
          <header className="admin-topbar">
            <label className="admin-search">
              <Search aria-hidden="true" size={20} />
              <input
                aria-label="Search admin records"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search..."
                value={query}
              />
            </label>
            <div className="admin-profile-actions">
              <button aria-label="Notifications" className="admin-icon-button" type="button">
                <Bell aria-hidden="true" size={20} />
                <span />
              </button>
              <div className="admin-profile-menu">
                <button
                  aria-expanded={profileOpen}
                  aria-label="Open admin profile menu"
                  className="admin-profile-chip"
                  onClick={() => setProfileOpen((value) => !value)}
                  type="button"
                >
                  {state.settings.adminImageUrl ? (
                    <img alt={state.settings.adminName} src={state.settings.adminImageUrl} />
                  ) : (
                    <UserCircle2 aria-hidden="true" size={25} />
                  )}
                  <strong>{state.settings.adminName}</strong>
                  <ChevronDown aria-hidden="true" size={16} />
                </button>
                {profileOpen && (
                  <div className="admin-profile-dropdown">
                    <a href="#settings" onClick={() => setProfileOpen(false)}>Edit profile</a>
                    <button onClick={logout} type="button"><LogOut aria-hidden="true" size={16} /> Logout</button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <section className="admin-hero-panel">
            <div>
              <h1>AI Invention Admin Command Center</h1>
              <p>Manage AI agents, customer projects, quotations, payments, invoices, and maintenance cycles from one place.</p>
              <div className="admin-chip-row">
                <span>Backend Online</span>
                <span>API Status: Active</span>
                <span>Payment Tracking Active</span>
                <span>Maintenance Status Ready</span>
                <span>Hermes MCP Ready</span>
              </div>
            </div>
            <a className="admin-primary-action" href="#new-lead">
              <Plus aria-hidden="true" size={17} />
              Create New
            </a>
          </section>

          <div className="admin-notice" role="status">
            <span className={isPending ? "admin-pulse" : ""} />
            {notice}
          </div>

          <datalist id="admin-customer-names">
            {state.customers.map((item) => <option key={item.id} value={item.name} />)}
          </datalist>
          <datalist id="admin-package-names">
            {state.packages.map((item) => <option key={item.id} value={item.name} />)}
          </datalist>
          <datalist id="admin-invoice-numbers">
            {state.invoices.map((item) => <option key={item.id} value={item.invoiceNumber}>{item.customerName}</option>)}
          </datalist>

          <section className="admin-stat-grid hero-stats" aria-label="Admin metrics">
            {dashboardStats.map((stat) => (
              <article className="admin-stat-card" key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                <small>{stat.detail}</small>
              </article>
            ))}
          </section>

          <section className="admin-secondary-stat-grid">
            {secondaryStats.map((stat) => (
              <article className="admin-mini-stat" key={stat.label}>
                <Gauge aria-hidden="true" size={17} />
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </article>
            ))}
          </section>

          <section className="admin-panel admin-timeline-panel">
            <div className="admin-panel-head">
              <div>
                <h2>AI Operations Timeline</h2>
                <p>End-to-end workflow from inquiry to maintenance reminder.</p>
              </div>
            </div>
            <div className="admin-timeline">
              {timelineSteps.map((step, index) => (
                <div className="admin-timeline-step" key={step}>
                  <span className={index === 0 ? "active" : ""} />
                  <strong>{step}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="admin-grid admin-grid-wide">
            <article className="admin-panel" id="leads">
              <div className="admin-panel-head">
                <div>
                  <span className="admin-eyebrow">Lead pipeline</span>
                  <h2>Recent Leads</h2>
                </div>
                <a className="admin-ghost-button" href="/api/admin/export/leads">
                  Export CSV
                </a>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Service</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id}>
                        <td>
                          <strong>{lead.name}</strong>
                          <span>{lead.email}</span>
                        </td>
                        <td>{lead.service}</td>
                        <td>
                          <select
                            aria-label={`Update ${lead.name} status`}
                            className={statusClass(lead.status)}
                            disabled={isPending}
                            onChange={(event) => actionButton("updateLeadStatus", { id: lead.id, status: event.target.value }, "Lead status updated.")}
                            value={lead.status}
                          >
                            {["New", "Contacted", "Quoted", "Converted", "Lost"].map((status) => (
                              <option key={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                        <td>{formatDate(lead.createdAt)}</td>
                        <td>
                          <div className="admin-row-actions">
                            <button className="admin-small-button" disabled={isPending} onClick={() => actionButton("createQuotationFromLead", { leadId: lead.id }, "Quotation created.")} type="button">
                              Quote
                            </button>
                            <button className="admin-small-button" disabled={isPending} onClick={() => actionButton("convertLeadToCustomer", { leadId: lead.id }, "Lead converted to customer.")} type="button">
                              Convert
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="admin-panel maintenance-widget" id="maintenance">
              <div className="admin-panel-head">
                <div>
                  <span className="admin-eyebrow">Maintenance Reminder</span>
                  <h2>Upcoming maintenance</h2>
                </div>
                <button className="admin-ghost-button" disabled={isPending} onClick={() => actionButton("queueMaintenanceReminders", {}, "Reminders queued.")} type="button">
                  Queue
                </button>
              </div>
              <div className="admin-record-list compact">
                {state.maintenancePlans.map((plan) => (
                  <div className="admin-reminder-row" key={plan.id}>
                    <CalendarDays aria-hidden="true" size={20} />
                    <div>
                      <strong>{plan.customerName}</strong>
                      <span>{formatMoney(plan.monthlyFee, plan.currency)} due {formatDate(plan.nextDueDate)}</span>
                    </div>
                    <ArrowUpRight aria-hidden="true" size={16} />
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="admin-grid">
            <article className="admin-panel" id="new-lead">
              <div className="admin-panel-head">
                <div>
                  <span className="admin-eyebrow">Create lead</span>
                  <h2>Add inquiry manually</h2>
                </div>
                <Plus aria-hidden="true" size={22} />
              </div>
              <form className="admin-form" onSubmit={(event) => submitForm(event, "createLead", "Lead created.")}>
                <input name="name" placeholder="Client name" required />
                <input name="email" placeholder="Email" required type="email" />
                <input name="phone" placeholder="Phone or WhatsApp" />
                <select name="service" defaultValue="Website + AI Agent Bundle">
                  {state.packages.filter((item) => item.active).map((item) => (
                    <option key={item.id}>{item.name}</option>
                  ))}
                </select>
                <input name="businessType" placeholder="Business type" />
                <textarea name="message" placeholder="Lead notes" rows={4} />
                <button className="admin-primary-action" disabled={isPending} type="submit">Save lead</button>
              </form>
            </article>

            <article className="admin-panel" id="customers">
              <div className="admin-panel-head">
                <div>
                  <span className="admin-eyebrow">Customers</span>
                  <h2>Customer records</h2>
                </div>
                <UsersRound aria-hidden="true" size={22} />
              </div>
              <div className="admin-record-list">
                {state.customers.map((customer) => (
                  <div className="admin-record" key={customer.id}>
                    <div>
                      <strong>{customer.name}</strong>
                      <span>{customer.email}</span>
                      <small>
                        Portal: {customer.portalAccess?.status ?? "Not created"}
                        {customer.portalAccess?.lastLoginAt ? ` - last login ${formatDate(customer.portalAccess.lastLoginAt)}` : ""}
                      </small>
                    </div>
                    <div className="admin-record-actions">
                      <select
                        className={statusClass(customer.status)}
                        disabled={isPending}
                        onChange={(event) => actionButton("updateCustomerStatus", { id: customer.id, status: event.target.value }, "Customer status updated.")}
                        value={customer.status}
                      >
                        {["Active", "Onboarding", "Paused"].map((status) => <option key={status}>{status}</option>)}
                      </select>
                      <button className="admin-small-button" disabled={isPending} onClick={() => actionButton("resetCustomerPortalAccess", { id: customer.id }, "Portal access reset.")} type="button">
                        <KeyRound aria-hidden="true" size={14} />
                        {customer.portalAccess ? "Reset login" : "Create login"}
                      </button>
                      {customer.portalAccess && (
                        <button className="admin-small-button" disabled={isPending} onClick={() => actionButton("toggleCustomerPortalAccess", { id: customer.id }, "Portal access updated.")} type="button">
                          {customer.portalAccess.status === "Enabled" ? "Disable" : "Enable"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="admin-grid" id="packages">
            <article className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <span className="admin-eyebrow">Packages</span>
                  <h2>Service catalog</h2>
                </div>
                <PackageCheck aria-hidden="true" size={22} />
              </div>
              <div className="admin-package-list">
                {state.packages.map((item) => (
                  <div className="admin-package" key={item.id}>
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.includes}</span>
                    </div>
                    <div className="admin-package-side">
                      <small>{formatMoney(item.setupFee, item.currency)} setup / {formatMoney(item.monthlyFee, item.currency)}/mo</small>
                      <button className="admin-small-button" disabled={isPending} onClick={() => actionButton("togglePackage", { id: item.id }, "Package updated.")} type="button">
                        {item.active ? "Active" : "Paused"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <span className="admin-eyebrow">Create package</span>
                  <h2>New service package</h2>
                </div>
                <PackageCheck aria-hidden="true" size={22} />
              </div>
              <form className="admin-form" onSubmit={(event) => submitForm(event, "createPackage", "Package created.", (payload) => ({ ...payload, setupFee: Number(payload.setupFee), monthlyFee: Number(payload.monthlyFee) }))}>
                <input name="name" placeholder="Package name" required />
                <input name="setupFee" placeholder="Setup fee" required type="number" />
                <input name="monthlyFee" placeholder="Monthly fee" required type="number" />
                <input name="currency" defaultValue="USD" placeholder="Currency" />
                <textarea name="includes" placeholder="What is included" rows={4} />
                <button className="admin-primary-action" disabled={isPending} type="submit">Save package</button>
              </form>
            </article>
          </section>

          <section className="admin-grid admin-grid-wide" id="quotations">
            <article className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <span className="admin-eyebrow">Quotations</span>
                  <h2>Quote builder output</h2>
                </div>
                <FileText aria-hidden="true" size={22} />
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>Quote</th><th>Customer</th><th>Amount</th><th>Status</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {state.quotations.map((quote) => (
                      <tr key={quote.id}>
                        <td>{quote.quoteNumber}</td>
                        <td>{quote.customerName}</td>
                        <td>{formatMoney(quote.amount, quote.currency)}</td>
                        <td>
                          <select className={statusClass(quote.status)} disabled={isPending} onChange={(event) => actionButton("updateQuotationStatus", { id: quote.id, status: event.target.value }, "Quotation updated.")} value={quote.status}>
                            {["Draft", "Sent", "Approved", "Rejected"].map((status) => <option key={status}>{status}</option>)}
                          </select>
                        </td>
                        <td>
                          <button className="admin-small-button" disabled={isPending} onClick={() => actionButton("createInvoiceFromQuotation", { id: quote.id }, "Invoice generated from quote.")} type="button">Invoice</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="admin-panel">
              <div className="admin-panel-head"><div><span className="admin-eyebrow">Flow status</span><h2>Automation readiness</h2></div><ShieldCheck aria-hidden="true" size={22} /></div>
              <div className="admin-readiness-grid">
                {["Lead capture", "Quotation", "Invoice", "Payment ledger", "Maintenance queue", "Project status"].map((item) => (
                  <div className="admin-readiness-item" key={item}><CheckCircle2 aria-hidden="true" size={18} />{item}</div>
                ))}
              </div>
            </article>
          </section>

          <section className="admin-grid admin-grid-wide" id="invoices">
            <article className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <span className="admin-eyebrow">Invoices</span>
                  <h2>Manual billing</h2>
                </div>
                <ReceiptText aria-hidden="true" size={22} />
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr><th>Invoice</th><th>Customer</th><th>Amount</th><th>Due</th><th>Status</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {state.invoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td>{invoice.invoiceNumber}</td>
                        <td>{invoice.customerName}</td>
                        <td>{formatMoney(invoice.amount, invoice.currency)}</td>
                        <td>{formatDate(invoice.dueDate)}</td>
                        <td>
                          <select className={statusClass(invoice.status)} disabled={isPending} onChange={(event) => actionButton("updateInvoiceStatus", { id: invoice.id, status: event.target.value }, "Invoice status updated.")} value={invoice.status}>
                            {["Draft", "Pending", "Due soon", "Paid", "Overdue"].map((status) => <option key={status}>{status}</option>)}
                          </select>
                        </td>
                        <td><button className="admin-small-button" disabled={isPending || invoice.status === "Paid"} onClick={() => actionButton("markInvoicePaid", { id: invoice.id }, "Invoice marked paid and payment logged.")} type="button">Mark paid</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="admin-panel">
              <div className="admin-panel-head"><div><span className="admin-eyebrow">Create invoice</span><h2>Manual invoice</h2></div><BadgeDollarSign aria-hidden="true" size={22} /></div>
              <form className="admin-form" onSubmit={(event) => submitForm(event, "createInvoice", "Invoice created.", (payload) => ({ ...payload, amount: Number(payload.amount) }))}>
                <input list="admin-customer-names" name="customerName" placeholder="Company or customer name" required />
                <input list="admin-package-names" name="packageName" placeholder="Package or service name" />
                <input name="amount" placeholder="Amount" required type="number" />
                <input name="dueDate" required type="date" />
                <button className="admin-primary-action" disabled={isPending} type="submit">Generate invoice</button>
              </form>
            </article>
          </section>

          <section className="admin-grid" id="payments">
            <article className="admin-panel">
              <div className="admin-panel-head"><div><span className="admin-eyebrow">Payments</span><h2>Payment ledger</h2></div><CreditCard aria-hidden="true" size={22} /></div>
              <div className="admin-record-list compact">
                {state.payments.map((payment) => (
                  <div className="admin-record" key={payment.id}>
                    <div><strong>{payment.invoiceNumber}</strong><span>{payment.customerName} - {payment.reference}</span></div>
                    <div><span className={statusClass(payment.status)}>{payment.status}</span><small>{formatMoney(payment.amount, payment.currency)}</small></div>
                  </div>
                ))}
              </div>
            </article>

            <article className="admin-panel">
              <div className="admin-panel-head"><div><span className="admin-eyebrow">Record payment</span><h2>Bank transfer entry</h2></div><CreditCard aria-hidden="true" size={22} /></div>
              <form className="admin-form" onSubmit={(event) => submitForm(event, "recordPayment", "Payment recorded.", (payload) => ({ ...payload, amount: Number(payload.amount) }))}>
                <input list="admin-invoice-numbers" name="invoiceNumber" placeholder="Invoice number, e.g. INV-2026-0019" required />
                <input name="amount" placeholder="Amount" required type="number" />
                <input name="reference" placeholder="Bank reference" />
                <input name="receivedAt" type="date" />
                <button className="admin-primary-action" disabled={isPending} type="submit">Record payment</button>
              </form>
            </article>
          </section>

          <section className="admin-grid" id="projects">
            <article className="admin-panel">
              <div className="admin-panel-head"><div><span className="admin-eyebrow">Projects</span><h2>Service delivery</h2></div><FolderKanban aria-hidden="true" size={22} /></div>
              <div className="admin-record-list">
                {state.projects.map((project) => (
                  <div className="admin-project-card" key={project.id}>
                    <div><strong>{project.title}</strong><span>{project.customerName} - due {formatDate(project.dueDate)}</span></div>
                    <select className={statusClass(project.status)} disabled={isPending} onChange={(event) => actionButton("updateProjectStatus", { id: project.id, status: event.target.value }, "Project status updated.")} value={project.status}>
                      {["Planned", "In progress", "Waiting client", "Completed"].map((status) => <option key={status}>{status}</option>)}
                    </select>
                    <ul>{project.tasks.map((task) => <li key={task}>{task}</li>)}</ul>
                  </div>
                ))}
              </div>
            </article>

            <article className="admin-panel">
              <div className="admin-panel-head"><div><span className="admin-eyebrow">Create project</span><h2>Delivery task list</h2></div><FolderKanban aria-hidden="true" size={22} /></div>
              <form className="admin-form" onSubmit={(event) => submitForm(event, "createProject", "Project created.")}>
                <input list="admin-customer-names" name="customerName" placeholder="Customer or company name" required />
                <input name="title" placeholder="Project title" required />
                <input list="admin-package-names" name="packageName" placeholder="Package or service name" />
                <input name="dueDate" type="date" />
                <textarea name="tasks" placeholder="Comma separated tasks" rows={4} />
                <button className="admin-primary-action" disabled={isPending} type="submit">Save project</button>
              </form>
            </article>
          </section>

          <section className="admin-grid" id="settings">
            <article className="admin-panel">
              <div className="admin-panel-head"><div><span className="admin-eyebrow">Reminder logs</span><h2>Email queue</h2></div><BellRing aria-hidden="true" size={22} /></div>
              <div className="admin-record-list compact">
                {state.reminderLogs.length ? state.reminderLogs.slice(0, 8).map((log) => (
                  <div className="admin-record" key={log.id}><div><strong>{log.customerName}</strong><span>{log.subject}</span></div><span className={statusClass(log.status)}>{log.status}</span></div>
                )) : <div className="admin-empty-state">No reminder emails queued yet.</div>}
              </div>
            </article>

            <article className="admin-panel">
              <div className="admin-panel-head"><div><span className="admin-eyebrow">Client support</span><h2>Portal requests</h2></div><LifeBuoy aria-hidden="true" size={22} /></div>
              <div className="admin-record-list compact">
                {state.supportTickets.length ? state.supportTickets.slice(0, 10).map((ticket) => (
                  <div className="admin-record" key={ticket.id}>
                    <div>
                      <strong>{ticket.subject}</strong>
                      <span>{ticket.customerName} - {ticket.message}</span>
                      <small>{formatDate(ticket.createdAt)}</small>
                    </div>
                    <select className={statusClass(ticket.status)} disabled={isPending} onChange={(event) => actionButton("updateSupportTicketStatus", { id: ticket.id, status: event.target.value }, "Support request updated.")} value={ticket.status}>
                      {["Open", "In review", "Resolved"].map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </div>
                )) : <div className="admin-empty-state">No customer support requests yet.</div>}
              </div>
            </article>

            <article className="admin-panel">
              <div className="admin-panel-head"><div><span className="admin-eyebrow">Admin profile</span><h2>Editable admin identity</h2></div><UserCircle2 aria-hidden="true" size={22} /></div>
              <form className="admin-form" onSubmit={(event) => submitForm(event, "updateAdminProfile", "Admin profile updated.")}>
                <input name="adminName" defaultValue={state.settings.adminName} placeholder="Admin display name" />
                <input name="adminImageUrl" defaultValue={state.settings.adminImageUrl} placeholder="Admin image URL" />
                <input name="companyName" defaultValue={state.settings.companyName} placeholder="Company name" />
                <textarea name="invoiceNote" defaultValue={state.settings.invoiceNote} placeholder="Invoice note" rows={4} />
                <button className="admin-primary-action" disabled={isPending} type="submit">Save profile</button>
              </form>
            </article>

            <article className="admin-panel">
              <div className="admin-panel-head"><div><span className="admin-eyebrow">System audit</span><h2>Backend coverage</h2></div><ShieldCheck aria-hidden="true" size={22} /></div>
              <div className="admin-readiness-grid">
                {["Persistent JSON store", "Website lead sync", "CSV export", "Mutation API", "Payment ledger", "Project tracking", "Reminder queue", "Hermes MCP API", "Build verified"].map((item) => (
                  <div className="admin-readiness-item" key={item}><CheckCircle2 aria-hidden="true" size={18} />{item}</div>
                ))}
              </div>
              <div className="admin-mcp-card">
                <strong>Hermes control endpoint</strong>
                <code>POST /api/mcp</code>
                <span>Methods: initialize, tools/list, tools/call, resources/read</span>
              </div>
              <Link className="admin-inline-link" href="/">Back to public website <ArrowUpRight aria-hidden="true" size={16} /></Link>
            </article>
          </section>
        </section>
      </div>
    </main>
  );
}

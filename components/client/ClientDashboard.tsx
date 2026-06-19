"use client";

import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Download,
  FolderKanban,
  LifeBuoy,
  LogOut,
  PackageCheck,
  ReceiptText,
  Send,
} from "lucide-react";
import { FormEvent, useMemo, useState, useTransition } from "react";
import type { ClientPortalState } from "@/lib/admin-store";

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

function statusClass(status: string) {
  const normalized = status.toLowerCase();

  if (normalized.includes("paid") || normalized.includes("active") || normalized.includes("completed") || normalized.includes("resolved")) {
    return "client-status client-status-success";
  }

  if (normalized.includes("pending") || normalized.includes("soon") || normalized.includes("progress") || normalized.includes("waiting") || normalized.includes("review")) {
    return "client-status client-status-warning";
  }

  return "client-status";
}

export function ClientDashboard({ initialState }: { initialState: ClientPortalState }) {
  const [portal, setPortal] = useState(initialState);
  const [notice, setNotice] = useState("Client portal connected.");
  const [isPending, startTransition] = useTransition();

  const unpaidTotal = useMemo(
    () => portal.invoices.filter((invoice) => invoice.status !== "Paid").reduce((sum, invoice) => sum + invoice.amount, 0),
    [portal.invoices],
  );
  const paidTotal = useMemo(
    () => portal.payments.filter((payment) => payment.status === "Confirmed").reduce((sum, payment) => sum + payment.amount, 0),
    [portal.payments],
  );
  const nextMaintenance = portal.maintenancePlans[0]?.nextDueDate || portal.customer.maintenanceDue;

  async function logout() {
    await fetch("/api/client/auth/logout", { method: "POST" });
    window.location.href = "/client/login";
  }

  function submitSupport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    startTransition(async () => {
      setNotice("Sending support request...");
      const response = await fetch("/api/client/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => null)) as {
        ok?: boolean;
        message?: string;
        portal?: ClientPortalState;
      } | null;

      if (!response.ok || !result?.ok || !result.portal) {
        setNotice(result?.message ?? "Support request failed.");
        return;
      }

      setPortal(result.portal);
      setNotice("Support request submitted. Admin can review it now.");
      form.reset();
    });
  }

  return (
    <main className="client-portal">
      <section className="client-hero">
        <div>
          <span className="client-eyebrow">AI Invention Client Portal</span>
          <h1>Welcome back, {portal.customer.name}</h1>
          <p>Track your package, invoices, payment status, project progress, maintenance cycle, and support requests from one clean dashboard.</p>
        </div>
        <div className="client-hero-actions">
          <span>{notice}</span>
          <button className="client-ghost-action" onClick={logout} type="button">
            <LogOut aria-hidden="true" size={17} />
            Logout
          </button>
        </div>
      </section>

      <section className="client-metric-grid" aria-label="Customer summary">
        <article className="client-metric-card">
          <PackageCheck aria-hidden="true" size={23} />
          <span>Current package</span>
          <strong>{portal.customer.packageName}</strong>
          <small>{portal.customer.status}</small>
        </article>
        <article className="client-metric-card">
          <ReceiptText aria-hidden="true" size={23} />
          <span>Unpaid invoices</span>
          <strong>{formatMoney(unpaidTotal)}</strong>
          <small>{portal.invoices.filter((invoice) => invoice.status !== "Paid").length} open invoice(s)</small>
        </article>
        <article className="client-metric-card">
          <CreditCard aria-hidden="true" size={23} />
          <span>Confirmed payments</span>
          <strong>{formatMoney(paidTotal)}</strong>
          <small>{portal.payments.length} payment record(s)</small>
        </article>
        <article className="client-metric-card">
          <CalendarDays aria-hidden="true" size={23} />
          <span>Maintenance due</span>
          <strong>{formatDate(nextMaintenance)}</strong>
          <small>Reminder window: 5 days before due</small>
        </article>
      </section>

      <section className="client-grid client-grid-wide">
        <article className="client-panel">
          <div className="client-panel-head">
            <div>
              <span className="client-eyebrow">Invoices</span>
              <h2>Billing and payment status</h2>
            </div>
            <ReceiptText aria-hidden="true" size={22} />
          </div>
          <div className="client-table-wrap">
            <table className="client-table">
              <thead>
                <tr><th>Invoice</th><th>Package</th><th>Amount</th><th>Due</th><th>Status</th><th>File</th></tr>
              </thead>
              <tbody>
                {portal.invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{invoice.invoiceNumber}</td>
                    <td>{invoice.packageName}</td>
                    <td>{formatMoney(invoice.amount, invoice.currency)}</td>
                    <td>{formatDate(invoice.dueDate)}</td>
                    <td><span className={statusClass(invoice.status)}>{invoice.status}</span></td>
                    <td>
                      <a className="client-small-action" href={`/client/invoice/${invoice.id}`} target="_blank">
                        <Download aria-hidden="true" size={15} />
                        Print
                      </a>
                    </td>
                  </tr>
                ))}
                {!portal.invoices.length && (
                  <tr><td colSpan={6}>No invoices found for this customer yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="client-note">{portal.settings.invoiceNote}</p>
        </article>
      </section>

      <section className="client-grid">
        <article className="client-panel">
          <div className="client-panel-head">
            <div>
              <span className="client-eyebrow">Projects</span>
              <h2>Delivery progress</h2>
            </div>
            <FolderKanban aria-hidden="true" size={22} />
          </div>
          <div className="client-record-list">
            {portal.projects.map((project) => (
              <div className="client-project-card" key={project.id}>
                <div>
                  <strong>{project.title}</strong>
                  <span>{project.packageName} - due {formatDate(project.dueDate)}</span>
                </div>
                <span className={statusClass(project.status)}>{project.status}</span>
                <ul>
                  {project.tasks.map((task) => (
                    <li key={task}><CheckCircle2 aria-hidden="true" size={16} />{task}</li>
                  ))}
                </ul>
              </div>
            ))}
            {!portal.projects.length && <div className="client-empty-state">No active project has been assigned yet.</div>}
          </div>
        </article>

        <article className="client-panel">
          <div className="client-panel-head">
            <div>
              <span className="client-eyebrow">Maintenance</span>
              <h2>Service renewal</h2>
            </div>
            <CalendarDays aria-hidden="true" size={22} />
          </div>
          <div className="client-record-list compact">
            {portal.maintenancePlans.map((plan) => (
              <div className="client-record" key={plan.id}>
                <div>
                  <strong>{plan.packageName}</strong>
                  <span>Next due: {formatDate(plan.nextDueDate)}</span>
                </div>
                <div>
                  <span className={statusClass(plan.status)}>{plan.status}</span>
                  <small>{formatMoney(plan.monthlyFee, plan.currency)}/mo</small>
                </div>
              </div>
            ))}
            {!portal.maintenancePlans.length && <div className="client-empty-state">Maintenance plan not active yet.</div>}
          </div>
        </article>
      </section>

      <section className="client-grid">
        <article className="client-panel">
          <div className="client-panel-head">
            <div>
              <span className="client-eyebrow">Support</span>
              <h2>Ask a question</h2>
            </div>
            <LifeBuoy aria-hidden="true" size={22} />
          </div>
          <form className="client-form" onSubmit={submitSupport}>
            <input name="subject" placeholder="Subject" required />
            <textarea name="message" placeholder="Write your question or support request" required rows={5} />
            <button className="client-primary-action" disabled={isPending} type="submit">
              <Send aria-hidden="true" size={17} />
              {isPending ? "Sending..." : "Submit support request"}
            </button>
          </form>
        </article>

        <article className="client-panel">
          <div className="client-panel-head">
            <div>
              <span className="client-eyebrow">Support history</span>
              <h2>Recent requests</h2>
            </div>
            <LifeBuoy aria-hidden="true" size={22} />
          </div>
          <div className="client-record-list compact">
            {portal.supportTickets.map((ticket) => (
              <div className="client-record" key={ticket.id}>
                <div>
                  <strong>{ticket.subject}</strong>
                  <span>{ticket.message}</span>
                  <small>{formatDate(ticket.createdAt)}</small>
                </div>
                <span className={statusClass(ticket.status)}>{ticket.status}</span>
              </div>
            ))}
            {!portal.supportTickets.length && <div className="client-empty-state">No support requests yet.</div>}
          </div>
        </article>
      </section>
    </main>
  );
}

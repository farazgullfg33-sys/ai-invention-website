"use client";

import { Printer } from "lucide-react";
import type { AdminInvoice, ClientPortalState } from "@/lib/admin-store";

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

export function ClientInvoicePrint({
  invoice,
  portal,
}: {
  invoice: AdminInvoice;
  portal: ClientPortalState;
}) {
  return (
    <main className="client-invoice-page">
      <section className="client-invoice-sheet">
        <header className="client-invoice-head">
          <div>
            <span className="client-eyebrow">Invoice</span>
            <h1>{invoice.invoiceNumber}</h1>
            <p>{portal.settings.companyName}</p>
          </div>
          <button className="client-primary-action no-print" onClick={() => window.print()} type="button">
            <Printer aria-hidden="true" size={17} />
            Print / Save PDF
          </button>
        </header>

        <div className="client-invoice-meta">
          <div>
            <span>Billed to</span>
            <strong>{portal.customer.company || portal.customer.name}</strong>
            <p>{portal.customer.name}</p>
            <p>{portal.customer.email}</p>
          </div>
          <div>
            <span>Issued</span>
            <strong>{formatDate(invoice.issuedAt)}</strong>
            <span>Due date</span>
            <strong>{formatDate(invoice.dueDate)}</strong>
            <span>Status</span>
            <strong>{invoice.status}</strong>
          </div>
        </div>

        <table className="client-invoice-lines">
          <thead>
            <tr><th>Description</th><th>Amount</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>{invoice.packageName}</strong>
                <span>AI Invention service package</span>
              </td>
              <td>{formatMoney(invoice.amount, invoice.currency)}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr><td>Total</td><td>{formatMoney(invoice.amount, invoice.currency)}</td></tr>
          </tfoot>
        </table>

        <footer className="client-invoice-footer">
          <strong>Payment note</strong>
          <p>{portal.settings.invoiceNote}</p>
        </footer>
      </section>
    </main>
  );
}

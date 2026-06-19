import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Database, LockKeyhole, Mail, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "AI Invention privacy policy for website visitors, leads, admin users, customer portal users, support requests, invoices, and AI automation workflows.",
  alternates: { canonical: "https://aiinvention.tech/privacy-policy" },
  robots: { index: true, follow: true },
};

const sections = [
  {
    title: "Information we collect",
    body:
      "We may collect name, email, phone number, company name, business type, service interest, project notes, support requests, invoice records, and messages submitted through website forms, chat, admin workflows, or customer portal forms.",
  },
  {
    title: "How we use information",
    body:
      "We use this information to respond to inquiries, prepare quotations, create invoices, manage projects, provide customer portal access, maintain service records, send reminders, and improve AI automation workflows.",
  },
  {
    title: "AI workflow data",
    body:
      "When a client requests AI agent deployment, business documents, FAQs, policies, and workflow instructions may be used to configure the assistant. Critical business decisions should still be reviewed by a human operator.",
  },
  {
    title: "Admin and customer portal data",
    body:
      "Admin and customer portal records may include customer status, services, invoices, payments, support tickets, maintenance dates, and internal notes needed to operate the service.",
  },
  {
    title: "Data protection",
    body:
      "We use environment-based secrets, protected routes, HTTP-only session cookies, and operational access controls. Production deployments should rotate passwords, protect API keys, and restrict MCP endpoints with strong bearer tokens.",
  },
  {
    title: "Contact",
    body:
      "For privacy questions, data updates, or access requests, contact AI Invention through the contact page or email listed in the website footer.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main>
      <section className="page-hero privacy-hero">
        <div className="section-inner narrow">
          <span className="eyebrow">Privacy Policy</span>
          <h1>How AI Invention handles website, portal, and automation data.</h1>
          <p>
            This policy explains how we collect and use information from visitors, leads, clients, admin workflows,
            customer portal users, support requests, invoices, and AI automation projects.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section-inner privacy-grid">
          <aside className="privacy-summary-card">
            <ShieldCheck aria-hidden="true" size={34} />
            <h2>Privacy principles</h2>
            <p>Collect only useful business data, protect credentials, keep client workflows clear, and use AI systems with human review for important decisions.</p>
            <div>
              <span><LockKeyhole aria-hidden="true" size={17} /> Protected sessions</span>
              <span><Database aria-hidden="true" size={17} /> Operational records</span>
              <span><Mail aria-hidden="true" size={17} /> Contact on request</span>
            </div>
          </aside>
          <div className="privacy-content">
            {sections.map((section) => (
              <article key={section.title}>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="section-inner cta-band">
          <div>
            <span className="eyebrow">Questions</span>
            <h2>Need to update or remove your information?</h2>
          </div>
          <Link className="button-primary" href="/contact">
            Contact us
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "AI Invention terms for website, AI agent deployment, admin panel, customer portal, invoice workflow, maintenance, and automation services.",
  alternates: { canonical: "https://aiinvention.tech/terms-and-conditions" },
};

const terms = [
  {
    title: "Services",
    body:
      "AI Invention provides website builds, AI agent deployment, admin panels, customer portals, invoice workflows, maintenance systems, support workflows, and related automation setup.",
  },
  {
    title: "Client responsibilities",
    body:
      "Clients are responsible for providing accurate business information, required documents, brand assets, policies, credentials, hosting access, payment details, and timely feedback.",
  },
  {
    title: "AI output review",
    body:
      "AI assistants can help answer questions and automate workflows, but important business, legal, medical, financial, or safety decisions should be reviewed by a qualified human operator.",
  },
  {
    title: "Payments and invoices",
    body:
      "Invoices, manual payment references, due dates, maintenance cycles, and payment status may be managed through the admin panel and customer portal when enabled.",
  },
  {
    title: "Maintenance",
    body:
      "Monthly maintenance may include updates, monitoring, reminder checks, workflow adjustments, and support based on the package or agreement selected by the client.",
  },
  {
    title: "Access and security",
    body:
      "Clients should protect passwords, API keys, VPS credentials, admin access, and customer portal credentials. Production deployments should use strong secrets and limited access.",
  },
];

export default function TermsPage() {
  return (
    <main>
      <section className="page-hero privacy-hero">
        <div className="section-inner narrow">
          <span className="eyebrow">Terms and Conditions</span>
          <h1>Clear terms for AI Invention projects and automation services.</h1>
          <p>
            These terms summarize how AI Invention handles website projects, AI agent workflows, admin panels,
            customer portals, invoices, maintenance, and support.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="section-inner legal-list">
          {terms.map((item) => (
            <article key={item.title}>
              <CheckCircle2 aria-hidden="true" size={22} />
              <div>
                <h2>{item.title}</h2>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <div className="section-inner cta-band">
          <div>
            <span className="eyebrow">Project Scope</span>
            <h2>Ready to confirm your website and AI automation build?</h2>
          </div>
          <Link className="button-primary" href="/contact">
            Contact AI Invention
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}

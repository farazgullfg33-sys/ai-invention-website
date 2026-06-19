import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, Clock3, FileText, LifeBuoy, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact AI Invention",
  description:
    "Contact AI Invention to build a landing page, AI agent, admin panel, customer portal, invoice workflow, support system, or Hermes MCP automation.",
  keywords: [
    "contact AI Invention",
    "AI agent project request",
    "customer portal development",
    "admin panel development",
    "AI automation consultation",
  ],
  alternates: { canonical: "https://aiinvention.tech/contact" },
};

const nextSteps = [
  "We review your offer, target customer, and current website or business workflow.",
  "We recommend the right starting package: website, AI agent, or complete platform.",
  "We define lead capture, admin records, invoice flow, customer portal, and support needs.",
  "We prepare the build plan, timeline, required content, and deployment path.",
];

export default function ContactPage() {
  return (
    <main>
      <section className="page-hero contact-pro-hero">
        <div className="section-inner contact-hero-grid">
          <div>
            <span className="eyebrow">Contact AI Invention</span>
            <h1>Tell us what your business system should do.</h1>
            <p>
              Use this page for website builds, AI agents, admin panels, customer portals, invoice tracking, support
              workflows, maintenance systems, and Hermes MCP-controlled automation.
            </p>
            <div className="contact-hero-badges">
              <span><Bot aria-hidden="true" size={16} /> AI agent workflow</span>
              <span><FileText aria-hidden="true" size={16} /> Invoice and project flow</span>
              <span><LifeBuoy aria-hidden="true" size={16} /> Customer support portal</span>
            </div>
          </div>
          <div className="contact-route-card">
            <strong>Best for</strong>
            <ul>
              <li>Service businesses that need lead capture and fast follow-up.</li>
              <li>Agencies that want customer dashboards and invoice visibility.</li>
              <li>Owners who want Hermes or an operator agent to control admin workflows safely.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner contact-layout contact-page-layout">
          <div className="contact-support-panel contact-pro-panel">
            <h2>What happens next?</h2>
            <ol>
              {nextSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <div className="contact-trust-list">
              <span><Clock3 aria-hidden="true" size={18} /> Fast scope review</span>
              <span><ShieldCheck aria-hidden="true" size={18} /> Secure credential planning</span>
              <span><CheckCircle2 aria-hidden="true" size={18} /> Build-ready action plan</span>
            </div>
            <Link className="contact-blog-link" href="/blog">
              Read automation guides
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}

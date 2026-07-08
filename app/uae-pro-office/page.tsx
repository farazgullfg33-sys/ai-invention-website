import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink, Quote } from "lucide-react";

export const metadata: Metadata = {
  title: "AI-Powered PRO Office | AI Invention",
  description:
    "AI Invention deploys a full suite of 18 AI agents to automate UAE PRO office operations — visa processing, company formation, licensing, compliance, and client support.",
  keywords: [
    "AI PRO office UAE",
    "PRO services automation",
    "UAE visa processing AI",
    "company formation AI agent",
    "MOHRE TAMM automation",
  ],
  alternates: { canonical: "https://aiinvention.tech/uae-pro-office" },
};

const agents = [
  { name: "VisaBot Pro", role: "Automates visa applications, renewals, and status tracking." },
  { name: "CompanyFormer AI", role: "Handles new company formation paperwork and filings." },
  { name: "LicenseGuard AI", role: "Tracks license renewals and flags upcoming deadlines." },
  { name: "ComplianceCheck AI", role: "Monitors regulatory compliance across active client files." },
  { name: "DocuAttest AI", role: "Manages document attestation and legalization workflows." },
  { name: "ImmigrationPro AI", role: "Guides immigration case processing end to end." },
  { name: "LabourBot AI", role: "Handles labour contract filings and quota tracking." },
  { name: "TammMaster AI", role: "Automates TAMM portal submissions and follow-ups." },
  { name: "GovtLiaison AI", role: "Coordinates government portal submissions and approvals." },
  { name: "FinanceGuard AI", role: "Tracks billing, invoicing, and client payment status." },
  { name: "IntakeBot AI", role: "Captures and qualifies new client intake requests." },
  { name: "SupportDesk AI", role: "Answers client questions and routes support tickets." },
  { name: "TrackFlow AI", role: "Gives clients real-time status on every open case." },
  { name: "LeadGen AI", role: "Finds and qualifies new PRO service leads." },
  { name: "ContentSEO AI", role: "Writes SEO content to grow organic visibility." },
  { name: "SocialPilot AI", role: "Runs social media posting and engagement." },
  { name: "HRFlow AI", role: "Manages internal HR and payroll workflows." },
  { name: "OpsCommander AI", role: "Oversees daily operations across every agent." },
];

export default function UaeProOfficePage() {
  return (
    <main className="pro-office-page">
      <section className="pro-office-hero">
        <div className="section-inner pro-office-hero-inner">
          <span className="eyebrow">UAE PRO Office Automation</span>
          <h1>AI-Powered PRO Services in UAE</h1>
          <p>
            AI Invention deploys a full team of dedicated AI agents to run a UAE PRO office — visa processing,
            company formation, licensing, compliance, attestation, government liaison, and client support, all
            automated and monitored around the clock.
          </p>
          <div className="pro-office-hero-actions">
            <Link className="button-primary" href="https://pro.aiinvention.tech" target="_blank" rel="noopener noreferrer">
              View Live Demo
              <ExternalLink aria-hidden="true" size={18} />
            </Link>
            <Link className="button-secondary" href="/#contact">
              Talk To Us
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="pro-office-section">
        <div className="section-inner">
          <div className="section-head">
            <span className="eyebrow">Case Study</span>
            <h2>Waqas Bhai&rsquo;s PRO Office, Abu Dhabi</h2>
          </div>
          <div className="pro-office-case-card">
            <p>
              AI Invention partnered with Waqas Bhai&rsquo;s PRO office in Abu Dhabi to replace manual, paper-heavy
              processes with a full suite of AI agents covering visa processing, company formation, licensing,
              compliance, attestation, and client communication.
            </p>
            <p className="pro-office-case-note">Full case study details, metrics, and results coming soon.</p>
          </div>
        </div>
      </section>

      <section className="pro-office-section pro-office-section-alt">
        <div className="section-inner">
          <div className="section-head centered">
            <span className="eyebrow">The Agent Team</span>
            <h2>18 dedicated AI agents running the PRO office.</h2>
            <p>Every function of the business, covered by a purpose-built agent working alongside the team.</p>
          </div>
          <div className="agent-grid">
            {agents.map(({ name, role }) => (
              <article className="agent-card" key={name}>
                <h3>{name}</h3>
                <p>{role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pro-office-section">
        <div className="section-inner">
          <div className="section-head centered">
            <span className="eyebrow">Testimonial</span>
            <h2>What our partner says.</h2>
          </div>
          <div className="pro-office-testimonial-card">
            <Quote aria-hidden="true" size={28} />
            <p>Testimonial from Waqas Bhai coming soon.</p>
            <span className="pro-office-testimonial-name">Waqas Bhai &mdash; PRO Office, Abu Dhabi</span>
          </div>
        </div>
      </section>

      <section className="pro-office-section pro-office-cta-section">
        <div className="section-inner pro-office-cta-inner">
          <div>
            <span className="eyebrow">See It Live</span>
            <h2>Explore the PRO office platform.</h2>
            <p>Visit the live PRO Services platform to see the AI agent team in action.</p>
          </div>
          <Link className="button-primary" href="https://pro.aiinvention.tech" target="_blank" rel="noopener noreferrer">
            Open pro.aiinvention.tech
            <ExternalLink aria-hidden="true" size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}

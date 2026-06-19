import Link from "next/link";
import { Logo } from "@/components/Logo";

type FooterProps = {
  settings: Record<string, unknown>;
};

function readEmail(settings: Record<string, unknown>) {
  const contact = settings.contact as unknown as Record<string, string> | undefined;
  return contact?.email || "hello@aiinvention.tech";
}

export function Footer({ settings }: FooterProps) {
  const email = readEmail(settings);

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-column footer-brand">
            <Logo variant="footer" />
            <p>AI Invention builds AI agents, websites, automation workflows, and digital growth systems for modern businesses.</p>
          </div>
          <div className="footer-column">
            <strong>Company</strong>
            <Link href="/about">About</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-and-conditions">Terms & Conditions</Link>
          </div>
          <div className="footer-column">
            <strong>Services</strong>
            <Link href="/#ai-agent-deployment">AI Agent Deployment</Link>
            <Link href="/#website-agent-bundle">Website + AI Agent Bundle</Link>
            <Link href="/#website-only">Website Only</Link>
          </div>
          <div className="footer-column">
            <strong>Contact</strong>
            <a href={`mailto:${email}`}>{email}</a>
            <span>Malaysia</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>Copyright 2026 AI Invention. All rights reserved.</span>
          <span>
            <Link href="/privacy-policy">Privacy Policy</Link> | <Link href="/terms-and-conditions">Terms & Conditions</Link>
          </span>
        </div>
        <p className="footer-disclaimer">
          AI responses are generated based on your provided documents and may not always be perfect. We recommend human review for critical business decisions.
        </p>
      </div>
    </footer>
  );
}

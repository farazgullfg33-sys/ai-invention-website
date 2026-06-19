"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";

const serviceLinks = [
  { href: "/#ai-agent-deployment", label: "AI Agent Deployment" },
  { href: "/#website-only", label: "Website Only" },
  { href: "/#website-agent-bundle", label: "Website + AI Agent Bundle" },
];

const links = [
  { href: "/", label: "Home" },
  { href: "/#process", label: "How It Works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
];

export function Header() {
  function closeMobileMenu() {
    const menu = document.querySelector<HTMLDetailsElement>("[data-mobile-menu]");
    if (menu) {
      menu.open = false;
    }
  }

  return (
    <header className="site-header">
      <div className="nav-shell">
        <Logo />
        <nav aria-label="Primary navigation" className="site-nav">
          <Link href="/">Home</Link>
          <div className="nav-dropdown">
            <button type="button">
              Services
              <ChevronDown aria-hidden="true" size={16} />
            </button>
            <div className="nav-dropdown-menu">
              {serviceLinks.map((link) => (
                <Link href={link.href} key={link.label}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          {links.slice(1).map((link) => (
            <Link href={link.href} key={link.label}>
              {link.label}
            </Link>
          ))}
        </nav>
        <Link className="nav-cta" href="/#contact">
          Get Started
          <ArrowRight aria-hidden="true" size={17} />
        </Link>
        <details className="mobile-menu-native" data-mobile-menu>
          <summary aria-label="Open navigation menu" className="mobile-menu-toggle">
            <Menu aria-hidden="true" className="menu-open-icon" size={22} />
            <X aria-hidden="true" className="menu-close-icon" size={22} />
          </summary>
          <div className="mobile-menu-overlay" onClick={closeMobileMenu}>
            <aside aria-label="Mobile navigation" className="mobile-menu-panel" onClick={(event) => event.stopPropagation()}>
              <div className="mobile-menu-head">
                <Logo />
                <button aria-label="Close navigation menu" className="mobile-menu-close" onClick={closeMobileMenu} type="button">
                  <X aria-hidden="true" size={22} />
                </button>
              </div>
              <nav className="mobile-menu-links">
                <div className="mobile-service-group">
                  <span>Services</span>
                  {serviceLinks.map((link) => (
                    <Link href={link.href} key={`mobile-${link.label}`} onClick={closeMobileMenu}>
                      {link.label}
                    </Link>
                  ))}
                </div>
                {links.map((link) => (
                  <Link href={link.href} key={link.label} onClick={closeMobileMenu}>
                    {link.label}
                  </Link>
                ))}
              </nav>
              <Link className="mobile-menu-cta" href="/#contact" onClick={closeMobileMenu}>
                Get Started
                <ArrowRight aria-hidden="true" size={17} />
              </Link>
            </aside>
          </div>
        </details>
      </div>
    </header>
  );
}

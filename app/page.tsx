import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileText,
  MessageCircle,
  Server,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ContactModal } from "@/components/ContactModal";

export const metadata: Metadata = {
  title: { absolute: "AI Invention | We Deploy AI Agents For Your Business" },
  description:
    "Done-for-you custom AI agent deployment for hotels, real estate, ecommerce, service businesses, website assistant bots, and internal teams. VPS setup from $200.",
  keywords: [
    "custom AI agent deployment",
    "AI automation agency",
    "VPS AI agent setup",
    "Telegram AI bot service",
    "website assistant bot",
    "hotel booking AI agent",
    "real estate AI assistant",
    "ecommerce AI support agent",
  ],
};

const services = [
  {
    title: "VPS Agent Deployment",
    text: "Your custom AI agent workflow installed on your own VPS with an isolated setup for your business.",
    icon: "/images/service-icons/vps-deployment.png",
  },
  {
    title: "Business Document Loading",
    text: "We load SOPs, FAQs, pricing, PDFs, DOCX files, CSVs, and business knowledge.",
    icon: "/images/service-icons/document-loading.png",
  },
  {
    title: "Telegram AI Access",
    text: "Your team chats with the AI agent from Telegram on mobile or desktop.",
    icon: "/images/service-icons/telegram-agent.png",
  },
  {
    title: "Website Build",
    text: "Professional mobile-ready websites for businesses that need trust before the agent goes live.",
    icon: "/images/service-icons/website-build.png",
  },
  {
    title: "Monthly Maintenance",
    text: "Monitoring, updates, document refreshes, and support after the first 30 days.",
    icon: "/images/service-icons/monitoring-maintenance.png",
  },
  {
    title: "Security & Control",
    text: "Your VPS. Your documents. Your control, with premium model routing available as an upgrade.",
    icon: "/images/service-icons/security-control.png",
  },
];

const fitList = [
  "Service businesses that want AI without hiring a technical team",
  "Hotels, apartments, real estate teams, ecommerce stores, and local service companies",
  "CEOs and managers who need an internal assistant for company knowledge",
  "Businesses without a website that need a professional online presence first",
  "Companies with SOPs, manuals, FAQs, price lists, or documented processes",
  "Teams that want a deployment on their own VPS instead of a shared app",
  "Businesses that tried general chatbots but need business-specific answers",
];

const process = [
  {
    title: "Discovery Call",
    text: "A 30 minute call to understand your business, documents, users, and the first job your agent should handle.",
    Icon: ClipboardList,
  },
  {
    title: "You Share Documents",
    text: "Send SOPs, FAQs, pricing, product info, PDFs, DOCX files, CSVs, website URLs, or exported knowledge files.",
    Icon: FileText,
  },
  {
    title: "We Deploy in 2-3 Days",
    text: "Your AI agent workflow is installed on your VPS, documents are loaded, Telegram is connected, and the agent is tested.",
    Icon: Clock3,
  },
  {
    title: "You Chat via Telegram",
    text: "Your AI agent is live. Ask questions, check process details, and use it from phone or desktop.",
    Icon: MessageCircle,
  },
];

const pricing = [
  {
    id: "ai-agent-deployment",
    title: "AI Agent Deployment",
    subtitle: "For businesses that already have a website",
    price: "$200",
    monthly: "+ $100/mo",
    featured: false,
    features: ["VPS setup and AI agent workflow installation", "Business document knowledge loading", "Telegram bot connection", "30 days support", "Monthly maintenance and updates"],
  },
  {
    id: "website-agent-bundle",
    title: "Website + AI Agent Bundle",
    subtitle: "For businesses starting from scratch",
    price: "$299",
    monthly: "+ $100/mo",
    featured: true,
    features: ["Professional 5-page website", "Domain setup and connection", "Everything from AI Agent package", "Website and agent built to work together", "30 days support"],
  },
  {
    id: "website-only",
    title: "Website Only",
    subtitle: "For businesses that need a professional online presence",
    price: "$179",
    monthly: "",
    featured: false,
    features: ["Professional 5-page website", "Mobile-responsive design", "Domain connection", "Clear service positioning", "30 days support"],
  },
];

const useCases = [
  {
    title: "Hotel & Apartment Booking Agent",
    text: "Answer room, apartment, policy, location, check-in, and availability questions before handing hot leads to your team.",
  },
  {
    title: "Real Estate Agent Assistant",
    text: "Use listings, buyer FAQs, seller notes, pricing guides, and area details to qualify leads and answer property questions.",
  },
  {
    title: "Ecommerce Support Agent",
    text: "Help shoppers with product details, delivery, returns, sizing, order guidance, and common support questions.",
  },
  {
    title: "CEO or Manager Assistant",
    text: "Turn SOPs, reports, policies, meeting notes, and company documents into a private internal knowledge assistant.",
  },
  {
    title: "Website Assistant Bot",
    text: "Add a business-trained assistant to your website that answers visitors, captures leads, and routes serious inquiries.",
  },
  {
    title: "Service Business Agent",
    text: "Explain packages, pricing, onboarding steps, appointment rules, and FAQs for clinics, agencies, consultants, and local teams.",
  },
];

const faqPreview = [
  {
    question: "Do I need technical knowledge?",
    answer: "No. AI Invention handles the VPS setup, AI agent workflow deployment, document loading, Telegram connection, and handoff.",
  },
  {
    question: "What if I do not have a VPS?",
    answer: "We recommend a low-cost KVM/Ubuntu VPS and guide you through buying it. Then we set it up for you.",
  },
  {
    question: "Can the AI agent handle customer support?",
    answer: "Yes, if you provide FAQs, policies, service details, and support process documents for the agent to reference.",
  },
  {
    question: "What happens after 30 days?",
    answer: "You can continue with $100/month maintenance for monitoring, document updates, patches, and connectivity support.",
  },
  {
    question: "Is my business data safe?",
    answer: "Your documents and AI agent workflow stay on your VPS. Premium model providers are optional upgrades.",
  },
];

export default async function HomePage() {
  const headersList = await headers();
  const host = headersList.get("host") || "";

  if (host.startsWith("admin.")) {
    redirect("/admin");
  }
  if (host.startsWith("customer.")) {
    redirect("/client");
  }

  return (
    <main>
      <section className="hero-section">
        <div className="hero-pattern" aria-hidden="true" />
        <div className="section-inner hero-grid">
          <div className="hero-copy">
            <h1>AI Agent Deployed on Your Own VPS</h1>
            <p>
              We deploy a custom AI agent workflow for your business, whether you run bookings, real estate, ecommerce, services, or an internal team.
              We load your documents and connect the agent to Telegram. Your VPS. Your documents. Your control.
            </p>
            <div className="hero-actions">
              <Link className="button-primary" href="#contact">
                Get Your AI Agent
                <ArrowRight aria-hidden="true" size={18} />
              </Link>
              <Link className="button-secondary" href="#process">
                How It Works
              </Link>
            </div>
            <div className="hero-trust-row" aria-label="Key service promises">
              <span>
                <CheckCircle2 aria-hidden="true" size={18} />
                2-3 business day deployment
              </span>
              <span>
                <ShieldCheck aria-hidden="true" size={18} />
                Isolated VPS setup
              </span>
            </div>
          </div>
          <div className="hero-panel hero-video-panel" aria-label="AI agent service video preview">
            <div className="hero-video-shell">
              <video
                aria-label="AI Invention service workflow animation"
                autoPlay
                className="hero-video"
                loop
                muted
                playsInline
                preload="metadata"
              >
                <source src="/videos/ai-service-hero.mp4" type="video/mp4" />
              </video>
              <div className="hero-video-glass">
                <span className="live-dot" aria-hidden="true" />
                <div>
                  <strong>AI Agent Workflow Deployment</strong>
                  <span>VPS + documents + Telegram handoff</span>
                </div>
              </div>
            </div>
            <div className="hero-video-points">
              <span>
                <Server aria-hidden="true" size={18} />
                Client VPS
              </span>
              <span>
                <Bot aria-hidden="true" size={18} />
                Trained on docs
              </span>
              <span>
                <MessageCircle aria-hidden="true" size={18} />
                Telegram ready
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="services">
        <div className="section-inner">
          <div className="section-head">
            <span className="eyebrow">What We Do</span>
            <h2>One service path: deploy, load, and hand off your AI agent.</h2>
          </div>
          <div className="service-visual-shell" aria-label="Animated service icon system">
            <video
              autoPlay
              className="section-loop-video"
              loop
              muted
              playsInline
              poster="/images/service-icons/service-icons-source.jpeg"
              preload="metadata"
            >
              <source src="/videos/service-icons-loop.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="card-grid three service-card-grid">
            {services.map(({ title, text, icon }) => (
              <article className="service-card" key={title}>
                <span className="service-icon-frame">
                  <Image alt={`${title} service icon`} className="service-icon-image" height={180} src={icon} width={180} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="section-inner split-grid">
          <div className="section-head no-margin">
            <span className="eyebrow">Who This Is For</span>
            <h2>Built for businesses that want AI without the complexity.</h2>
            <p>
              This is for teams that need a working business assistant, not another dashboard to configure. We install the system, load the knowledge, and
              hand over Telegram access.
            </p>
          </div>
          <div className="check-list">
            {fitList.map((item) => (
              <div className="check-row" key={item}>
                <CheckCircle2 aria-hidden="true" size={20} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="process">
        <div className="section-inner">
          <div className="section-head centered">
            <span className="eyebrow">How It Works</span>
            <h2>From discovery call to Telegram access in 2-3 business days.</h2>
          </div>
          <div className="timeline-visual-shell" aria-label="Animated AI agent deployment process timeline">
            <video
              autoPlay
              className="section-loop-video timeline-loop-video"
              loop
              muted
              playsInline
              poster="/images/process-timeline-visual.webp"
              preload="metadata"
            >
              <source src="/videos/process-timeline-loop.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="process-grid">
            {process.map(({ title, text, Icon }, index) => (
              <article className="process-card" key={title}>
                <span className="step-number">{String(index + 1).padStart(2, "0")}</span>
                <Icon aria-hidden="true" size={30} />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" id="pricing">
        <div className="section-inner">
          <div className="section-head centered">
            <span className="eyebrow">Pricing</span>
            <h2>Launch pricing for early business clients.</h2>
          </div>
          <div className="pricing-grid">
            {pricing.map(({ id, title, subtitle, price, monthly, features, featured }) => (
              <article className={featured ? "pricing-card featured" : "pricing-card"} id={id} key={title}>
                {featured ? <span className="recommended">Recommended</span> : null}
                <h3>{title}</h3>
                <p>{subtitle}</p>
                <div className="price-row">
                  <strong>{price}</strong>
                  {monthly ? <span>{monthly}</span> : null}
                </div>
                <ul>
                  {features.map((feature) => (
                    <li key={feature}>
                      <CheckCircle2 aria-hidden="true" size={18} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link className={featured ? "button-primary" : "button-secondary"} href="#contact">
                  Get Started
                </Link>
              </article>
            ))}
          </div>
          <div className="maintenance-panel">
            <div>
              <span className="eyebrow">Monthly Maintenance</span>
              <h3>$100/month after the first 30 days</h3>
            </div>
            <p>
              Includes uptime and performance checks, prompt and knowledge updates from new documents, bug fixes, VPS security patches, Telegram connectivity
              support, and a monthly usage summary.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-head">
            <span className="eyebrow">Example Use Cases</span>
            <h2>Custom agents for the way your business actually works.</h2>
            <p>
              We do not sell one generic bot. We shape the agent around your business type, customer questions, documents, handoff process, and daily workflow.
            </p>
          </div>
          <div className="card-grid three">
            {useCases.map(({ title, text }) => (
              <article className="use-card" key={title}>
                <Building2 aria-hidden="true" size={28} />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt trust-section">
        <div className="section-inner split-grid">
          <div className="section-head no-margin">
            <span className="eyebrow">Your Data, Your Control</span>
            <h2>Your VPS. Your documents. Your control.</h2>
          </div>
          <div className="trust-copy">
            <div className="trust-visual-shell" aria-label="Animated secure business document deployment visual">
              <video
                autoPlay
                className="section-loop-video trust-loop-video"
                loop
                muted
                playsInline
                poster="/images/trust-security-visual.webp"
                preload="metadata"
              >
                <source src="/videos/trust-security-loop.mp4" type="video/mp4" />
              </video>
            </div>
            <p>
              Your documents and AI agent workflow stay on your VPS. AI model requests are routed through your configured provider, and premium models like
              OpenAI and Claude are available as upgrades.
            </p>
            <p className="legal-note">
              AI responses are generated from your provided documents and may not always be perfect. Use human review for critical business decisions.
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="contact">
        <div className="section-inner contact-layout">
          <div className="section-head no-margin">
            <span className="eyebrow">Get Started</span>
            <h2>Ready to get your AI agent?</h2>
            <p>
              Send the basics. We will review your business, recommend the right package, and confirm the next practical step.
            </p>
            <div className="contact-mini-card">
              <Sparkles aria-hidden="true" size={22} />
              <span>Best first step: AI Agent Deployment if you already have a website, Bundle if you need the website too.</span>
            </div>
          </div>
          <ContactModal />
        </div>
      </section>

      <section className="section section-alt">
        <div className="section-inner">
          <div className="section-head centered">
            <span className="eyebrow">FAQ</span>
            <h2>Common questions before deployment.</h2>
          </div>
          <div className="faq-preview">
            {faqPreview.map(({ question, answer }) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
          <div className="center-action">
            <Link className="button-secondary" href="/faq">
              View All FAQs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

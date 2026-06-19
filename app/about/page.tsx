import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Gauge,
  LifeBuoy,
  Plug,
  Server,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About AI Invention",
  description:
    "AI Invention is a future-facing AI agency building AI agents, websites, automations, digital growth systems, and intelligent business tools for modern companies.",
  keywords: [
    "AI Invention about",
    "AI agent deployment company",
    "business automation team",
    "customer portal development",
    "Hermes MCP workflow",
  ],
  alternates: { canonical: "https://aiinvention.tech/about" },
};

const operatingPoints = [
  "AI strategy starts with the client's offer, audience, workflow, and business bottlenecks.",
  "Websites are built to explain the service clearly, capture leads, and support future growth.",
  "AI agents and automations are shaped around real customer questions, sales tasks, and support work.",
  "Digital marketing and SEO connect the website to visibility, trust, and qualified demand.",
  "Ongoing optimization keeps the system useful after launch instead of becoming another unused tool.",
];

const team = [
  {
    name: "AI Strategy Lead",
    role: "Maps business workflows into clear AI automation opportunities.",
    image: "/images/team/ai-strategy-lead.webp",
  },
  {
    name: "Automation Engineer",
    role: "Builds agents, workflows, dashboards, integrations, and connected backend tools.",
    image: "/images/team/automation-engineer.webp",
  },
  {
    name: "Experience Designer",
    role: "Shapes premium web interfaces, brand presentation, and conversion-focused user journeys.",
    image: "/images/team/experience-designer.webp",
  },
  {
    name: "Growth Optimizer",
    role: "Improves SEO, campaign performance, lead quality, and post-launch conversion.",
    image: "/images/team/growth-optimizer.webp",
  },
];

const delivery = [
  { icon: Sparkles, title: "AI Solutions", copy: "Custom assistants, knowledge workflows, and AI tools aligned with the way the business operates." },
  { icon: Gauge, title: "Website Development", copy: "Fast, premium, conversion-focused websites that make the offer clear and easy to act on." },
  { icon: Plug, title: "Automation", copy: "Connected workflows for lead routing, follow-up, support, onboarding, reporting, and daily operations." },
  { icon: Users, title: "Digital Marketing", copy: "SEO, content, funnel structure, and campaign support that turn attention into qualified demand." },
];

const leadership = [
  {
    name: "Hazziq Javeed Iqbal",
    role: "Founder & CEO",
    image: "/images/muhammad-hazziq-ceo.webp",
    alt: "Hazziq Javeed Iqbal, Founder and CEO of AI Invention",
    text:
      "Leads AI Invention's vision, partnerships, and long-term direction with a focus on practical AI, premium digital execution, and measurable business value.",
    tags: ["AI Strategy", "Business Vision", "Digital Growth"],
  },
  {
    name: "Muhammad Faraz",
    role: "Manager",
    image: "/images/muhammad-faraz-manager.webp",
    alt: "Muhammad Faraz, Manager at AI Invention",
    text:
      "Manages operations and execution across client delivery, automation builds, website systems, launch support, and ongoing improvement.",
    tags: ["Operations", "Client Delivery", "Digital Systems"],
  },
];

export default function AboutPage() {
  return (
    <main>
      <section className="page-hero about-pro-hero">
        <div className="section-inner about-hero-grid about-hero-single">
          <div>
            <span className="eyebrow">About AI Invention</span>
            <h1>Global AI agency building intelligent systems for modern businesses.</h1>
            <p>
              AI Invention helps companies modernize how they attract, convert, and serve customers through AI
              agents, premium websites, automation workflows, digital marketing, and practical business tools.
            </p>
            <div className="about-hero-actions">
              <Link className="button-primary" href="/contact">
                Start a project
                <ArrowRight aria-hidden="true" size={18} />
              </Link>
              <Link className="button-secondary" href="/blog">
                Read the blog
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-head centered">
            <span className="eyebrow">Leadership</span>
            <h2>Founder-led strategy with hands-on delivery management.</h2>
            <p>
              AI Invention is led by a focused leadership team that combines business vision, AI strategy, design,
              engineering, automation, and growth execution.
            </p>
          </div>
          <div className="about-leadership-grid">
            {leadership.map((leader, index) => (
              <article className="about-leader-card" key={leader.name}>
                <figure>
                  <Image alt={leader.alt} height={620} priority={index === 0} src={leader.image} unoptimized width={520} />
                </figure>
                <div className="about-leader-copy">
                  <span className="leader-index">0{index + 1}</span>
                  <p className="founder-kicker">{leader.name}</p>
                  <h3>{leader.role}</h3>
                  <p>{leader.text}</p>
                  <div className="founder-tags">
                    {leader.tags.map((tag) => (
                      <span className="founder-tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner split-grid">
          <div className="section-head no-margin">
            <span className="eyebrow">Operating System</span>
            <h2>Every service starts with business value, not random technology.</h2>
            <p>
              The goal is simple: help the client get clearer positioning, faster responses, better lead handling,
              smoother operations, and a digital presence that supports sales.
            </p>
          </div>
          <div className="check-list">
            {operatingPoints.map((item) => (
              <div className="check-row" key={item}>
                <CheckCircle2 aria-hidden="true" size={20} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="section-inner">
          <div className="section-head centered">
            <span className="eyebrow">What We Deliver</span>
            <h2>AI, websites, automation, and growth systems under one agency.</h2>
          </div>
          <div className="card-grid four about-delivery-grid">
            {delivery.map((item) => (
              <article className="service-card" key={item.title}>
                <item.icon aria-hidden="true" size={30} />
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner about-proof-grid">
          <article>
            <Server aria-hidden="true" size={30} />
            <strong>Production minded</strong>
            <span>We build with launch, performance, maintainability, and client handoff in mind.</span>
          </article>
          <article>
            <ShieldCheck aria-hidden="true" size={30} />
            <strong>Trust focused</strong>
            <span>We keep the user journey clear, the message honest, and the technical setup practical.</span>
          </article>
          <article>
            <ClipboardCheck aria-hidden="true" size={30} />
            <strong>Workflow focused</strong>
            <span>Automation is planned around real handoffs, repeated questions, and operational pressure points.</span>
          </article>
          <article>
            <LifeBuoy aria-hidden="true" size={30} />
            <strong>Growth ready</strong>
            <span>SEO, content, lead capture, and conversion structure are treated as part of the build.</span>
          </article>
        </div>
      </section>

      <section className="section section-alt">
        <div className="section-inner">
          <div className="section-head centered">
            <span className="eyebrow">Execution Team</span>
            <h2>A lean specialist team built for focused execution.</h2>
          </div>
          <div className="team-grid">
            {team.map((member) => (
              <article className="team-card" key={member.name}>
                <Image
                  alt={`${member.name} for AI Invention`}
                  height={520}
                  loading="eager"
                  src={member.image}
                  unoptimized
                  width={520}
                />
                <div>
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner cta-band">
          <div>
            <span className="eyebrow">Next Step</span>
            <h2>Build your AI agent, website, automation workflow, or growth system with AI Invention.</h2>
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

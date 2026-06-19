import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about AI Invention's AI agent workflow deployment service.",
};

const faqs = [
  {
    question: "Do I need technical knowledge?",
    answer: "No. AI Invention handles the VPS setup, AI agent workflow installation, document loading, Telegram connection, and handoff.",
  },
  {
    question: "What if I do not have a VPS?",
    answer: "We can recommend a low-cost KVM/Ubuntu VPS. You buy it under your own account, then we configure it.",
  },
  {
    question: "What does document loading mean?",
    answer: "We load your SOPs, FAQs, pricing, product information, and process documents so your AI agent can reference them. This is not model fine-tuning.",
  },
  {
    question: "Can the AI agent handle lead capture or support?",
    answer: "Yes, if you provide the right business documents and rules. The first deployment focuses on your approved scope.",
  },
  {
    question: "Can you build agents for different business types?",
    answer:
      "Yes. We customize agents for use cases such as hotel and apartment bookings, real estate, ecommerce support, website assistant bots, service businesses, and internal CEO or manager assistants.",
  },
  {
    question: "How long does deployment take?",
    answer: "Most deployments take 2-3 business days after we receive all required VPS access and documents.",
  },
  {
    question: "What does monthly maintenance include?",
    answer: "Maintenance is $100/month and includes uptime and performance checks, prompt and knowledge updates from new documents, bug fixes, VPS security patches, Telegram connectivity support, and a monthly usage summary.",
  },
  {
    question: "What is not included in maintenance?",
    answer: "New feature development, new integrations, new data sources outside the approved scope, content writing, and 24/7 phone support are not included.",
  },
  {
    question: "Which AI models are used?",
    answer: "AI model routing is included. Premium models such as OpenAI and Claude are available as upgrades during setup.",
  },
  {
    question: "Is my business data safe?",
    answer: "Your documents and AI agent workflow stay on your VPS. AI model requests are routed through your configured provider.",
  },
  {
    question: "Can you build the website too?",
    answer: "Yes. Choose the Website + AI Agent Bundle if your business needs a professional website before the AI agent is deployed.",
  },
];

export default function FaqPage() {
  return (
    <main>
      <section className="page-hero light-hero">
        <div className="section-inner narrow">
          <span className="eyebrow">FAQ</span>
          <h1>Questions about AI agent deployment.</h1>
          <p>Clear answers about VPS setup, document loading, Telegram access, pricing, maintenance, and model routing.</p>
        </div>
      </section>
      <section className="section">
        <div className="section-inner faq-page-list">
          {faqs.map(({ question, answer }) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
        <div className="section-inner center-action">
          <Link className="button-primary" href="/#contact">
            Get Started
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}

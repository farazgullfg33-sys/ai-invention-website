const baseUrl = process.env.APP_URL || "https://aiinvention.tech";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${baseUrl}/#organization`,
  name: "AI Invention",
  url: baseUrl,
  logo: `${baseUrl}/images/ai-invention-logo.png`,
  description:
    "AI Invention deploys AI agent workflows on client VPS infrastructure, loads business documents, connects Telegram access, and maintains the deployment monthly.",
  email: "hello@aiinvention.tech",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kuala Lumpur",
    addressCountry: "MY",
  },
  sameAs: ["https://www.linkedin.com/in/muhammad-faraz-433a73146/"],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${baseUrl}/#website`,
  url: baseUrl,
  name: "AI Invention | We Deploy AI Agents For Your Business",
  description:
    "Done-for-you custom AI agent workflow deployment for bookings, real estate, ecommerce, service businesses, website assistants, and internal teams.",
  publisher: { "@id": `${baseUrl}/#organization` },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${baseUrl}/#service`,
  name: "AI Agent Workflow Deployment Service",
  provider: { "@id": `${baseUrl}/#organization` },
  description:
    "Done-for-you custom AI agent workflow deployment on client VPS infrastructure with document loading, Telegram bot connection, support, and maintenance.",
  serviceType: "Custom AI agent deployment, AI automation, website chatbot, Telegram bot, VPS AI agent setup",
  areaServed: "Worldwide",
  audience: {
    "@type": "BusinessAudience",
    audienceType: "Hotels, apartments, real estate teams, ecommerce stores, service businesses, CEOs, managers, and small business teams",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "AI Invention Services",
    itemListElement: [
      { "@type": "Offer", price: "200", priceCurrency: "USD", itemOffered: { "@type": "Service", name: "AI Agent Deployment" } },
      { "@type": "Offer", price: "299", priceCurrency: "USD", itemOffered: { "@type": "Service", name: "Website + AI Agent Bundle" } },
      { "@type": "Offer", price: "179", priceCurrency: "USD", itemOffered: { "@type": "Service", name: "Website Only" } },
    ],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${baseUrl}/#faq`,
  mainEntity: [
    {
      "@type": "Question",
      name: "What does AI Invention deploy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI Invention deploys custom AI agent workflows on client VPS infrastructure, loads business documents, connects Telegram access, and provides monthly maintenance.",
      },
    },
    {
      "@type": "Question",
      name: "Which business types can use AI Invention agents?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI Invention customizes agents for hotel and apartment bookings, real estate, ecommerce support, website assistant bots, service businesses, and internal CEO or manager assistants.",
      },
    },
    {
      "@type": "Question",
      name: "How much does AI agent deployment cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Launch pricing starts at $200 setup for AI Agent Deployment plus $100/month maintenance after the first 30 days.",
      },
    },
  ],
};

const schemas = [organizationSchema, websiteSchema, serviceSchema, faqSchema];

export function JsonLd() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      id="json-ld-structured-data"
      type="application/ld+json"
    />
  );
}

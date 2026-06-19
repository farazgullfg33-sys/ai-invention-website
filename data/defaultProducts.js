const now = "2026-06-03T00:00:00.000Z";

const defaultProducts = [
  {
    id: "prod_fiverr_seller_mcp_basic",
    title: "Fiverr Seller MCP",
    slug: "fiverr-seller-mcp",
    subtitle: "A guided seller operations copilot for freelance delivery and client communication.",
    description:
      "Fiverr Seller MCP gives freelance operators and small agencies a focused command layer for proposals, delivery checklists, client updates, and repeatable workflows. It helps sellers respond faster, stay consistent, and reduce the admin drag that slows down fulfillment.",
    shortDescription: "Seller workflow copilot for proposals, delivery, and client messaging.",
    features: JSON.stringify([
      "Proposal drafting prompts for common client scenarios",
      "Delivery checklist templates to reduce missed steps",
      "Client communication playbooks for updates and revisions",
      "Offer-specific workflow suggestions for repeatable gigs",
      "Quick-start guidance designed for solo sellers"
    ]),
    price: "$49",
    priceNote: "Basic plan",
    category: "ai-tools",
    icon: "MCP",
    coverImage: "/products/fiverr-seller-mcp-cover",
    url: "/products/fiverr-seller-mcp",
    ctaLabel: "View Product",
    ctaType: "detail",
    featured: false,
    published: true,
    priority: 2,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prod_fiverr_seller_mcp_premium",
    title: "Fiverr Seller MCP Premium",
    slug: "fiverr-seller-mcp-premium",
    subtitle: "Expanded seller system with advanced playbooks, automation ideas, and scaling templates.",
    description:
      "The premium edition expands the Fiverr Seller MCP with deeper operating templates, upsell frameworks, and team-ready workflows. It is designed for top-rated sellers and boutique studios that want faster delivery, better client retention, and cleaner operational standards.",
    shortDescription: "Premium seller system with advanced playbooks and scaling templates.",
    features: JSON.stringify([
      "Everything in the basic version plus premium workflow templates",
      "Upsell and renewal playbooks for increasing order value",
      "Internal SOP drafting prompts for assistants or delivery teams",
      "Escalation and revision handling frameworks",
      "Scaling recommendations for multi-offer seller operations"
    ]),
    price: "$99",
    priceNote: "Premium package",
    category: "ai-tools",
    icon: "MCP+",
    coverImage: "/products/fiverr-seller-mcp-premium-cover",
    url: "/products/fiverr-seller-mcp-premium",
    ctaLabel: "Explore Premium",
    ctaType: "detail",
    featured: false,
    published: true,
    priority: 3,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prod_ai_lead_gen_pipeline",
    title: "AI Lead Gen Pipeline",
    slug: "ai-lead-gen-pipeline",
    subtitle: "An outbound and inbound enrichment system that turns prospects into qualified opportunities.",
    description:
      "AI Lead Gen Pipeline combines scraping, enrichment, categorization, and follow-up logic into one growth-ready engine. It is built for teams that want cleaner leads, faster response times, and a more reliable path from raw contact data to booked opportunities.",
    shortDescription: "AI-assisted lead sourcing, enrichment, and qualification workflow.",
    features: JSON.stringify([
      "Lead sourcing and enrichment workflow design",
      "Qualification logic that prioritizes high-fit prospects",
      "Follow-up messaging prompts and pipeline handoff steps",
      "CRM-ready output structures for cleaner ops",
      "Built-in scoring ideas for faster triage"
    ]),
    price: "$79",
    priceNote: "Pipeline starter",
    category: "ai-tools",
    icon: "LEAD",
    coverImage: "/products/ai-lead-gen-pipeline-cover",
    url: "/products/ai-lead-gen-pipeline",
    ctaLabel: "See Pipeline",
    ctaType: "detail",
    featured: true,
    published: true,
    priority: 1,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prod_ai_chatbot_builder",
    title: "AI Chatbot Builder",
    slug: "ai-chatbot-builder",
    subtitle: "A conversion-ready chatbot setup service for websites, funnels, and customer support flows.",
    description:
      "AI Chatbot Builder is a done-for-you service focused on planning, scripting, and launching a chatbot experience that improves response speed and captures more opportunities. It fits teams who want a branded assistant without spending months piecing the stack together.",
    shortDescription: "Done-for-you chatbot setup for websites and customer support.",
    features: JSON.stringify([
      "Conversation flow design for sales or support use cases",
      "Prompt and knowledge setup aligned to your offer",
      "Website embed guidance and handoff documentation",
      "Lead capture and escalation recommendations",
      "Launch checklist for real-world deployment"
    ]),
    price: "$149",
    priceNote: "Service package",
    category: "fiverr-services",
    icon: "BOT",
    coverImage: "/products/ai-chatbot-builder-cover",
    url: "/products/ai-chatbot-builder",
    ctaLabel: "Book Setup",
    ctaType: "detail",
    featured: false,
    published: true,
    priority: 4,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prod_web_scraping_automation",
    title: "Web Scraping Automation",
    slug: "web-scraping-automation",
    subtitle: "Data extraction workflows that turn scattered web data into usable business inputs.",
    description:
      "Web Scraping Automation is built for teams that need structured information from public websites without manual copy-paste work. The service covers extraction logic, data cleanup, and handoff formats so your downstream systems get useful, repeatable outputs.",
    shortDescription: "Automated public-web data extraction and cleanup workflows.",
    features: JSON.stringify([
      "Scraping workflow design for public web data sources",
      "Data normalization recommendations for cleaner outputs",
      "Scheduling and refresh logic for repeatable collection",
      "Export formats aligned to spreadsheets or CRM workflows",
      "Edge-case planning for changing page structures"
    ]),
    price: "$99",
    priceNote: "Service package",
    category: "fiverr-services",
    icon: "DATA",
    coverImage: "/products/web-scraping-automation-cover",
    url: "/products/web-scraping-automation",
    ctaLabel: "View Service",
    ctaType: "detail",
    featured: false,
    published: true,
    priority: 5,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prod_ai_content_writing_tool",
    title: "AI Content Writing Tool",
    slug: "ai-content-writing-tool",
    subtitle: "A content system for faster drafts, campaign messaging, and repeatable editorial output.",
    description:
      "AI Content Writing Tool helps founders and marketers generate stronger first drafts, repurpose ideas faster, and maintain message consistency across channels. It is ideal for teams that need output speed without losing voice and structure.",
    shortDescription: "Content drafting system for campaigns, landing pages, and editorial workflows.",
    features: JSON.stringify([
      "Structured prompts for blogs, landing pages, and ads",
      "Voice and messaging guidance for more consistent drafts",
      "Repurposing workflows from one idea into multiple assets",
      "Editorial planning suggestions to keep output moving",
      "Simple operating system for fast content execution"
    ]),
    price: "$59",
    priceNote: "Tool access",
    category: "ai-tools",
    icon: "WRITE",
    coverImage: "/products/ai-content-writing-tool-cover",
    url: "/products/ai-content-writing-tool",
    ctaLabel: "Learn More",
    ctaType: "detail",
    featured: false,
    published: true,
    priority: 6,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prod_social_media_auto_poster",
    title: "Social Media Auto-Poster",
    slug: "social-media-auto-poster",
    subtitle: "A simple automation layer for scheduling and publishing content across channels.",
    description:
      "Social Media Auto-Poster helps small teams keep channels active without daily manual publishing. It is built around practical scheduling workflows, reusable posting structures, and lightweight automation that supports consistency.",
    shortDescription: "Post scheduling and publishing automation for lean marketing teams.",
    features: JSON.stringify([
      "Cross-channel posting workflow templates",
      "Scheduling logic for consistent publishing cadence",
      "Content queue structure for easier batching",
      "Lightweight automation ideas for approvals and posting",
      "Use cases for agencies, creators, and service businesses"
    ]),
    price: "$39",
    priceNote: "Starter automation",
    category: "ai-tools",
    icon: "POST",
    coverImage: "/products/social-media-auto-poster-cover",
    url: "/products/social-media-auto-poster",
    ctaLabel: "See Details",
    ctaType: "detail",
    featured: false,
    published: true,
    priority: 7,
    createdAt: now,
    updatedAt: now
  }
];

module.exports = {
  defaultProducts
};

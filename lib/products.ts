export type ProductCategory = "Automation" | "Security" | "Management" | "Deployment";

export type ProductIcon =
  | "briefcase"
  | "search"
  | "shopping-cart"
  | "send"
  | "instagram"
  | "music"
  | "message-square"
  | "shield"
  | "network"
  | "rocket";

export type MarketplaceProduct = {
  slug: string;
  name: string;
  description: string;
  fullDescription: string;
  category: ProductCategory;
  price: string;
  icon: ProductIcon;
  features: string[];
  platformSupport: string;
  licenseType: "PAID" | "Free" | "Open Source";
  techRequirements: string[];
  gumroadUrl?: string;
  githubUrl?: string;
  isComingSoon?: boolean;
  featured?: boolean;
};

export const products: MarketplaceProduct[] = [
  {
    slug: "fiverr-manager",
    name: "Fiverr Manager",
    description: "Auto-login, gig management, order fulfillment, messaging.",
    fullDescription:
      "A Hermes Agent skill package for Fiverr sellers and agencies that need cleaner gig operations, faster customer replies, and repeatable delivery workflows.",
    category: "Automation",
    price: "$49-$99",
    icon: "briefcase",
    features: ["Auto-login with session persistence", "Gig CRUD and analytics", "Order monitoring and fulfillment", "AI-powered buyer messaging", "Delivery checklist automation"],
    platformSupport: "Hermes Agent + Standalone CLI",
    licenseType: "PAID",
    techRequirements: ["Hermes Agent runtime", "Node.js 20+", "Platform account access"],
    gumroadUrl: "#",
    featured: true,
  },
  {
    slug: "upwork-agent",
    name: "Upwork Agent",
    description: "Job search, AI proposals, contract management, messaging.",
    fullDescription:
      "A marketplace operator for finding suitable Upwork jobs, drafting focused proposals, tracking contracts, and keeping client communication organized.",
    category: "Automation",
    price: "$49-$99",
    icon: "search",
    features: ["OAuth 2.0 workflow support", "Job search by keyword and budget", "AI proposal drafting", "Contract and earnings tracking", "Client messaging workflows"],
    platformSupport: "Hermes Agent + Standalone CLI",
    licenseType: "PAID",
    techRequirements: ["Hermes Agent runtime", "Upwork API access where available", "Node.js 20+"],
    gumroadUrl: "#",
    featured: true,
  },
  {
    slug: "gumroad-seller",
    name: "Gumroad Seller",
    description: "Product management, sales analytics, discount codes, email to buyers.",
    fullDescription:
      "A seller operations skill for Gumroad creators who want product updates, sales visibility, buyer messaging, and campaign support in one command layer.",
    category: "Automation",
    price: "$29-$59",
    icon: "shopping-cart",
    features: ["Product CRUD workflows", "Sales analytics summaries", "Discount code management", "Buyer email campaign support", "Launch checklist automation"],
    platformSupport: "Hermes Agent + Standalone CLI",
    licenseType: "PAID",
    techRequirements: ["Hermes Agent runtime", "Gumroad account", "Node.js 20+"],
    gumroadUrl: "#",
  },
  {
    slug: "x-twitter-auto",
    name: "X/Twitter Auto",
    description: "Tweet and thread scheduling, DM automation, trend tracking.",
    fullDescription:
      "A social media automation skill for creators and teams publishing threads, monitoring trends, and responding to inbound messages with consistent workflows.",
    category: "Automation",
    price: "$19-$39",
    icon: "send",
    features: ["Tweet and thread composer", "DM auto-reply workflows", "Hashtag and trend research", "Profile analytics summaries", "Content queue management"],
    platformSupport: "Hermes Agent + Standalone CLI",
    licenseType: "PAID",
    techRequirements: ["Hermes Agent runtime", "Platform API access where available", "Node.js 20+"],
    gumroadUrl: "#",
  },
  {
    slug: "instagram-engine",
    name: "Instagram Engine",
    description: "Content posting, story automation, DM responses.",
    fullDescription:
      "A content operations engine for Instagram posting workflows, response templates, campaign planning, and profile performance tracking.",
    category: "Automation",
    price: "$29-$59",
    icon: "instagram",
    features: ["Post and story scheduler", "DM response workflows", "Follower analytics summaries", "Hashtag strategy support", "Campaign content queues"],
    platformSupport: "Hermes Agent + Standalone CLI",
    licenseType: "PAID",
    techRequirements: ["Hermes Agent runtime", "Instagram account", "Node.js 20+"],
    gumroadUrl: "#",
  },
  {
    slug: "tiktok-studio",
    name: "TikTok Studio",
    description: "Video upload, hashtag research, profile analytics.",
    fullDescription:
      "A TikTok publishing and research skill for managing uploads, content metadata, hashtag strategy, comments, and profile performance.",
    category: "Automation",
    price: "$29-$59",
    icon: "music",
    features: ["Video upload workflows", "Hashtag optimizer", "Profile analytics summaries", "Comment management", "Content calendar support"],
    platformSupport: "Hermes Agent + Standalone CLI",
    licenseType: "PAID",
    techRequirements: ["Hermes Agent runtime", "TikTok account", "Node.js 20+"],
    gumroadUrl: "#",
  },
  {
    slug: "facebook-manager",
    name: "Facebook Manager",
    description: "Page posting, ad management, group engagement.",
    fullDescription:
      "A Facebook page and community operations skill for scheduled posts, group engagement, ad workflow support, and page insight summaries.",
    category: "Automation",
    price: "$29-$59",
    icon: "message-square",
    features: ["Page post scheduler", "Ad campaign workflow support", "Group engagement tools", "Page insights summaries", "Response template library"],
    platformSupport: "Hermes Agent + Standalone CLI",
    licenseType: "PAID",
    techRequirements: ["Hermes Agent runtime", "Facebook page access", "Node.js 20+"],
    gumroadUrl: "#",
  },
  {
    slug: "security-suite",
    name: "Security Suite",
    description: "15 security skills: attestation, integrity, vulnerability scan.",
    fullDescription:
      "An open-source Hermes Agent security bundle for attestation checks, file integrity monitoring, vulnerability scanning, traffic monitoring, and threat reporting.",
    category: "Security",
    price: "Free/Open Source",
    icon: "shield",
    features: ["Attestation guard", "File integrity monitoring", "Vulnerability scanner", "Traffic monitor", "Threat reporting"],
    platformSupport: "Hermes Agent + Standalone CLI",
    licenseType: "Open Source",
    techRequirements: ["Hermes Agent runtime", "Node.js 20+", "Server or local workstation"],
    githubUrl: "#",
    featured: true,
  },
  {
    slug: "meta-operator",
    name: "Meta-Operator",
    description: "Master agent orchestration, skill management, client isolation.",
    fullDescription:
      "A management layer for Hermes Agent operators who need skill inventory, skill gap detection, client isolation, master authentication, and clone protection.",
    category: "Management",
    price: "Free/Open Source",
    icon: "network",
    features: ["Self-inventory system", "Skill gap detection", "Master auth and client isolation", "Clone protection", "Operator reporting"],
    platformSupport: "Hermes Agent",
    licenseType: "Open Source",
    techRequirements: ["Hermes Agent runtime", "Admin access", "Node.js 20+"],
    githubUrl: "#",
    featured: true,
  },
  {
    slug: "vps-deployer",
    name: "VPS Deployer",
    description: "One-command Hermes Agent VPS deployment.",
    fullDescription:
      "A deployment skill for launching Hermes Agent on VPS infrastructure with container setup, HTTPS routing, health monitoring, and production-oriented defaults.",
    category: "Deployment",
    price: "Free/Open Source",
    icon: "rocket",
    features: ["One-command deploy", "Docker and Traefik setup", "Auto HTTPS certificates", "Health monitoring", "Hostinger/cloud VPS support"],
    platformSupport: "Hermes Agent + Standalone CLI",
    licenseType: "Open Source",
    techRequirements: ["Linux VPS", "Domain or subdomain", "SSH access"],
    githubUrl: "#",
  },
];

export const categories: Array<"All" | ProductCategory> = ["All", "Automation", "Security", "Management", "Deployment"];

export const featuredProducts = products.filter((product) => product.featured).slice(0, 4);

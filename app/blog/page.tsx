import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, Search } from "lucide-react";
import { blogArticles } from "@/lib/blog";

export const metadata: Metadata = {
  title: "AI Automation Blog",
  description:
    "AI Invention blog with practical guides on AI agents, chatbots, customer portals, invoice automation, and secure business automation.",
  keywords: [
    "AI automation blog",
    "AI agents for business",
    "website chatbot",
    "customer portal",
    "business automation",
    "AI Invention blog",
  ],
  alternates: { canonical: "https://aiinvention.tech/blog" },
  openGraph: {
    title: "AI Automation Blog | AI Invention",
    description:
      "Practical SEO guides for businesses that want AI agents, lead capture, customer portals, and automation systems.",
    url: "https://aiinvention.tech/blog",
    type: "website",
  },
};

export default function BlogPage() {
  const featured = blogArticles[0];
  const rest = blogArticles.slice(1);

  return (
    <main className="blog-page">
      <section className="blog-hero">
        <div className="section-inner blog-hero-grid">
          <div>
            <span className="eyebrow">AI Invention Blog</span>
            <h1>Business AI automation guides built for real client workflows.</h1>
            <p>
              Learn how to use AI agents, chatbots, customer portals, invoice automation, and secure MCP workflows to
              capture leads and run services more professionally.
            </p>
            <div className="blog-search-pill">
              <Search aria-hidden="true" size={18} />
              SEO topics: AI agents, lead capture, WhatsApp bots, customer portal, invoices, VPS hosting
            </div>
          </div>
          <Link className="blog-featured-card" href={`/blog/${featured.slug}`}>
            <img alt={featured.imageAlt} src={featured.image} />
            <div>
              <span>{featured.category}</span>
              <h2>{featured.title}</h2>
              <p>{featured.description}</p>
              <small>
                <CalendarDays aria-hidden="true" size={15} />
                {featured.date}
                <Clock3 aria-hidden="true" size={15} />
                {featured.readTime}
              </small>
            </div>
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-head">
            <span className="eyebrow">Latest Articles</span>
            <h2>SEO-ready content for AI Invention services</h2>
            <p>Ten practical articles targeting commercial and informational search intent for the new business.</p>
          </div>

          <div className="blog-grid">
            {rest.map((article) => (
              <Link className="blog-card" href={`/blog/${article.slug}`} key={article.slug}>
                <img alt={article.imageAlt} loading="lazy" src={article.image} />
                <div>
                  <span>{article.category}</span>
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                  <small>
                    {article.readTime}
                    <ArrowRight aria-hidden="true" size={15} />
                  </small>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

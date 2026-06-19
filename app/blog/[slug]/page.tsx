import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";
import { blogArticles, getBlogArticle } from "@/lib/blog";

type BlogArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogArticle(slug);

  if (!article) {
    return {};
  }

  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    alternates: { canonical: `https://aiinvention.tech/blog/${article.slug}` },
    openGraph: {
      title: `${article.title} | AI Invention`,
      description: article.description,
      url: `https://aiinvention.tech/blog/${article.slug}`,
      type: "article",
      publishedTime: article.date,
      images: [{ url: article.image, alt: article.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [article.image],
    },
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const article = getBlogArticle(slug);

  if (!article) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      "@type": "Organization",
      name: "AI Invention",
      url: "https://aiinvention.tech",
    },
    publisher: {
      "@type": "Organization",
      name: "AI Invention",
      logo: {
        "@type": "ImageObject",
        url: "https://aiinvention.tech/images/ai-invention-logo.png",
      },
    },
    mainEntityOfPage: `https://aiinvention.tech/blog/${article.slug}`,
  };

  return (
    <main className="blog-article-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="blog-article">
        <Link className="blog-back-link" href="/blog">
          <ArrowLeft aria-hidden="true" size={17} />
          Back to blog
        </Link>
        <header className="blog-article-head">
          <span className="eyebrow">{article.category}</span>
          <h1>{article.title}</h1>
          <p>{article.description}</p>
          <div className="blog-article-meta">
            <span>
              <CalendarDays aria-hidden="true" size={16} />
              {article.date}
            </span>
            <span>
              <Clock3 aria-hidden="true" size={16} />
              {article.readTime}
            </span>
          </div>
        </header>
        <img className="blog-article-image" alt={article.imageAlt} src={article.image} />
        <div className="blog-article-body">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
        <footer className="blog-article-cta">
          <h2>Need this system for your business?</h2>
          <p>AI Invention can build your landing page, admin panel, customer portal, chatbot, and Hermes MCP workflow.</p>
          <Link href="/contact">Start a project</Link>
        </footer>
      </article>
    </main>
  );
}

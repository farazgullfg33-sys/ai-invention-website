# AI Invention — Main Website + Blog + News

## What Codex Built Here
Codex built and maintained the main AI Invention website, blog, and news site. Full prompt history available.

## Active Sites
| Site | URL | Status |
|------|-----|--------|
| Main Website | aiinvention.tech | Next.js 14, Tailwind, dark theme (#03050a, accent cyan #22d3ee) |
| Blog | blog.aiinvention.tech | Next.js 15 static export, light theme, 29 posts, AdSense ready |
| News | news.aiinvention.tech | Next.js, hardcoded TS articles in lib/articles.ts |

## Git Rules
- After EVERY file change, commit + push to origin main
- Use conventional commits: fix:, feat:, style:, refactor:
- NEVER create PRs — push directly to main
- Remote: https://farazgullfg33-sys:TOKEN@github.com/farazgullfg33-sys/ai-invention-website.git

## Main Website (aiinvention.tech)
- **Stack:** Next.js 15 App Router, Prisma + PostgreSQL
- **Pages:** Landing (hero, services, about, contact, FAQ), Admin Panel (/admin), Customer Portal (/client)
- **Admin:** Dashboard with leads, customers, invoices, stats, CSV export
- **API Routes:** /api/admin/*, /api/client/*, /api/capture-lead, /api/chat, /api/hermes-chat, /api/hermes-mcp, /api/mcp
- **Design:** Dark theme, glass morphism cards, gradient buttons, lucide-react icons
- **Database:** Lead, Client, Project, Invoice, Quotation, Payment, MaintenancePlan, ReminderLog, AdminAction

## Blog (blog.aiinvention.tech)
- **Stack:** Next.js 15 static export, TypeScript, gray-matter for markdown
- **Theme:** Light theme — white bg (#FFFFFF), teal accent (#00B4D8), Inter font
- **Content:** 29 posts in content/blog/*.md with YAML frontmatter
- **Features:** Grid layout (3-col), category filter sidebar, search, featured post, ToC, social share, related posts, newsletter signup
- **AdSense:** 5 ad slots with placeholder pub-id ca-pub-3940256099942544
- **SEO:** Schema.org JSON-LD, sitemap.xml, ads.txt, robots.txt, Google verification: googlec0c15c26ec60f6a7
- **Images:** 1200×630px WebP at public/images/blog-*.jpg

## News (news.aiinvention.tech)
- **Stack:** Next.js, hardcoded TypeScript articles in lib/articles.ts
- **⚠️ Important:** Insert new articles at TOP of articles[] array
- **Deploy:** Manual VPS via ssh-workflow heredoc
- **Docker:** Blog serves out -l 3000 (static export), News port different

## Deploy Rules (CRITICAL)
- **Main site:** GitHub Actions ("Deploy to VPS" workflow) → automatic
- **Blog + News:** Manual VPS deploy via ssh-workflow heredoc — LAPTOP NEVER DEPLOYS
- **Blog Dockerfile:** `serve out -l 3000` (static export)
- **News Dockerfile:** separate container, different port
- **VPS Hermes handles ALL deployment**

## Codex Build History (from ~/.codex/)
### Key Sessions:
- "Build AI command centre" (Jun 6) — admin portal
- "Build Next.js news site" (Jun 7) — news site build
- "Fix AI invention website" (Jun 8) — fixes + improvements
- "Add product detail pages" (Jun 3) — product pages
- "Replace homepage with AI agency" (Jun 5) — homepage redesign
- "Add lead capture chat widget" (Jun 5) — chatbot widget
- "Build AI product-job website" (Jun 5) — product showcase

### Key Prompt Files:
- `ai-invention-complete-codex-prompt.md` — Full website build (landing + admin + client portal)
- `ai-invention-admin-portal-codex-prompt.md` — Admin panel build
- `ai-invention-website-codex-rebuild-prompt.md` — Website rebuild
- `blog-codex-prompt.md` — Blog rebuild with light theme + AdSense
- `blog-traffic-codex-prompt.md` — Blog traffic automation skill
- `dashboard-codex-prompt.md` — Dashboard build
- `codex-website-prompt.md` — Website features

## Connected Skills (from Codex)
- Linkedin posting (daily AI news)
- Blog traffic growth automation
- SEO LLM keyword strategy
- Lead generation outreach
- Chatbot receptionist
- Command centre dashboard

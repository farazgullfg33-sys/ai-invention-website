# Delivery Manifest

## Package

AI Invention complete single-project platform:

- Main landing website
- SEO blog with 10 articles
- Admin panel
- Customer portal
- Hermes chat and MCP endpoints
- Docker and PostgreSQL deployment files

## Main Routes

- `/` - public landing page
- `/about` - about page
- `/contact` - contact page
- `/faq` - FAQ page
- `/blog` - SEO blog index
- `/blog/[slug]` - SEO article pages
- `/privacy-policy` - privacy policy
- `/privacy` - redirects to privacy policy
- `/terms-and-conditions` - terms page
- `/admin` - protected admin panel
- `/admin/login` - admin login
- `/client` - redirects to customer dashboard
- `/client/login` - customer login
- `/client/signup` - customer portal access request
- `/client/dashboard` - protected customer portal
- `/client/invoice/[id]` - protected invoice print view
- `/api/health` - health check
- `/api/capture-lead` - landing lead capture
- `/api/chat` - public chat route
- `/api/hermes-chat` - Hermes chat route
- `/api/mcp` - MCP endpoint
- `/api/hermes-mcp` - MCP alias endpoint

## Demo Credentials

Admin:

- Username: `admin`
- Password: `admin123`

Customer:

- Email: `ops@novastack.ai`
- Password: `client123`

## Verification Completed

- Prisma schema validation passed
- Prisma client generation passed
- Next.js production build passed
- Landing route returned 200
- About, contact, FAQ, blog, privacy, and terms routes returned 200
- Admin login and dashboard returned 200
- Customer login and dashboard returned 200
- Customer invoice print returned 200
- Customer support API returned 200 in backup/restore test
- Customer signup page returned 200
- Customer signup API created `client-signup` lead in backup/restore test
- MCP endpoint returned 200
- Hermes MCP alias returned 200
- Unauthenticated admin API returned 401
- Unauthenticated customer dashboard redirects to `/client/login`
- Unauthenticated admin panel redirects to `/admin/login`
- About page has Hazziq Javeed Iqbal as Founder & CEO, Muhammad Faraz as Manager, and local staff/team image references
- Footer Company section includes visible Privacy Policy and Terms & Conditions links
- Blog appears in desktop and mobile navigation
- Poppins is configured as the site display/heading font
- Admin dashboard page returned 200 after login cookie and includes dashboard actions/MCP content
- Browser console error count was 0
- 320px mobile overflow check passed
- Public image alt text check passed

## Production Notes

Change these before deployment:

- `ADMIN_PASSWORD`
- `ADMIN_SESSION_TOKEN`
- `CLIENT_SESSION_SECRET`
- `HERMES_MCP_API_KEY`
- PostgreSQL password in `.env` and `docker-compose.yml`

Run:

```bash
docker compose up -d --build
docker compose exec web npx prisma migrate deploy
```

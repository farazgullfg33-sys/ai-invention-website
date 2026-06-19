# AI Invention Complete Platform

One complete Next.js 15 project containing:

- Landing website at `/`
- Admin panel at `/admin`
- Customer portal at `/client` and `/client/dashboard`
- Invoice print view at `/client/invoice/[id]`
- Lead capture, chat, Hermes chat, and Hermes MCP endpoints

## Local Demo

```powershell
npm install
$env:DATABASE_URL="postgresql://ai_platform:change-me@localhost:5432/ai_invention_platform?schema=public"
npm run dev -- -p 3030
```

Open:

- Landing: `http://127.0.0.1:3030/`
- Admin: `http://127.0.0.1:3030/admin`
- Customer: `http://127.0.0.1:3030/client/login`
- Health: `http://127.0.0.1:3030/api/health`

## Demo Logins

Admin:

- Username: `admin`
- Password: `admin123`

Customer:

- Email: `ops@novastack.ai`
- Password: `client123`

Change all passwords and session secrets before production.

## Important Environment Variables

```env
DATABASE_URL="postgresql://ai_platform:change-me@postgres:5432/ai_invention_platform?schema=public"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="change-me"
ADMIN_SESSION_TOKEN="change-me-long-random-session-token"
CLIENT_SESSION_SECRET="change-me-long-random-client-session-secret"
HERMES_MCP_API_KEY="replace-with-strong-token-in-production"
HERMES_AGENT_API_KEY=""
HERMES_AGENT_WEBHOOK_URL=""
```

## Docker Deploy

```bash
cp .env.example .env
docker compose up -d --build
docker compose exec web npx prisma migrate deploy
```

Traefik labels are included for:

- `aiinvention.tech`
- `www.aiinvention.tech`
- `admin.aiinvention.tech`
- `customer.aiinvention.tech`

## Quality Gate

The combined app includes:

- Protected `/admin/*` routes except `/admin/login`
- Protected `/client/*` routes except `/client/login`
- Admin dashboard, customers, leads, quotations, invoices, payments, projects, maintenance, support
- Client dashboard, invoice print, support ticket submit
- Hermes MCP tools via `/api/mcp` and `/api/hermes-mcp`
- PostgreSQL Prisma schema and initial migration
- Standalone Next output for Docker

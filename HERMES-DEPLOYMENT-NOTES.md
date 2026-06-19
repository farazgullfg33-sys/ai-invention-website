# AI Invention Website Deployment Notes

## Build

```bash
npm install
npm run build
npm run start
```

## Included Features

- Responsive AI Invention landing page.
- Mobile native menu with clickable service package links.
- Contact form opens in a modal instead of showing as a long page form.
- Lead capture API writes to `data/leads.jsonl`.
- WhatsApp widget links to `+60189016974`.

## Environment

The lead API works without SMTP or Telegram variables. It saves leads locally to `data/leads.jsonl`.

Optional future alert variables:

```env
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
LEAD_NOTIFY_EMAIL=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

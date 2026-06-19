# AI Invention Admin MCP Bridge

Hermes can control the admin panel through the JSON-RPC MCP-compatible endpoint:

- Primary endpoint: `POST /api/mcp`
- Alias endpoint: `POST /api/hermes-mcp`
- Health/manifest: `GET /api/mcp`

## Auth

Admin browser access is protected by the admin password cookie:

```env
ADMIN_PASSWORD="change-me"
ADMIN_SESSION_TOKEN="change-me-long-random-session-token"
```

Local development falls back to password `admin123`. Change both values before production.

Set one of these environment variables in production:

```env
HERMES_MCP_API_KEY="replace-with-strong-token"
```

or reuse:

```env
HERMES_AGENT_API_KEY="replace-with-strong-token"
```

Hermes should send:

```http
Authorization: Bearer replace-with-strong-token
```

If no token is configured, the bridge runs in local development open mode.

## Supported MCP Methods

- `initialize`
- `ping`
- `tools/list`
- `tools/call`
- `resources/list`
- `resources/read`

## Tool Coverage

- `admin.dashboard.get`
- `admin.audit.run`
- `admin.profile.update`
- `admin.lead.create`
- `admin.lead.updateStatus`
- `admin.lead.createQuotation`
- `admin.lead.convertToCustomer`
- `admin.customer.create`
- `admin.customer.updateStatus`
- `admin.package.create`
- `admin.package.toggle`
- `admin.quotation.updateStatus`
- `admin.quotation.createInvoice`
- `admin.invoice.create`
- `admin.invoice.updateStatus`
- `admin.invoice.markPaid`
- `admin.payment.record`
- `admin.project.create`
- `admin.project.updateStatus`
- `admin.maintenance.queueReminders`

## Example Tool Call

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "admin.lead.create",
    "arguments": {
      "name": "Client Name",
      "email": "client@example.com",
      "service": "Website + AI Agent Bundle",
      "businessType": "Local service business",
      "message": "Needs website and AI lead follow-up."
    }
  }
}
```

## Audit Call

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "admin.audit.run",
    "arguments": {}
  }
}
```

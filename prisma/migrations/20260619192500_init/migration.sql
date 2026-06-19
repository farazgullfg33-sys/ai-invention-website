CREATE TABLE "Lead" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "company" TEXT,
  "service" TEXT,
  "businessType" TEXT,
  "message" TEXT,
  "status" TEXT NOT NULL DEFAULT 'new',
  "source" TEXT NOT NULL DEFAULT 'website',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Client" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "company" TEXT,
  "phone" TEXT,
  "password" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'active',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Project" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'planned',
  "clientId" TEXT NOT NULL,
  "dueDate" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Invoice" (
  "id" TEXT NOT NULL,
  "number" TEXT NOT NULL,
  "clientId" TEXT NOT NULL,
  "amount" DECIMAL(12,2) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "status" TEXT NOT NULL DEFAULT 'pending',
  "dueDate" TIMESTAMP(3),
  "paidAt" TIMESTAMP(3),
  "items" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Quotation" (
  "id" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "amount" DECIMAL(12,2) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "status" TEXT NOT NULL DEFAULT 'draft',
  "items" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Quotation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Payment" (
  "id" TEXT NOT NULL,
  "invoiceId" TEXT NOT NULL,
  "amount" DECIMAL(12,2) NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "reference" TEXT,
  "receivedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MaintenancePlan" (
  "id" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "plan" TEXT NOT NULL,
  "dueDate" TIMESTAMP(3) NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'active',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MaintenancePlan_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ReminderLog" (
  "id" TEXT NOT NULL,
  "planId" TEXT NOT NULL,
  "sentAt" TIMESTAMP(3),
  "status" TEXT NOT NULL DEFAULT 'queued',
  "message" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ReminderLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AdminAction" (
  "id" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "details" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AdminAction_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Lead_email_idx" ON "Lead"("email");
CREATE INDEX "Lead_status_idx" ON "Lead"("status");
CREATE INDEX "Lead_source_idx" ON "Lead"("source");
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");
CREATE INDEX "Client_email_idx" ON "Client"("email");
CREATE INDEX "Client_status_idx" ON "Client"("status");
CREATE INDEX "Project_clientId_idx" ON "Project"("clientId");
CREATE INDEX "Project_status_idx" ON "Project"("status");
CREATE UNIQUE INDEX "Invoice_number_key" ON "Invoice"("number");
CREATE INDEX "Invoice_clientId_idx" ON "Invoice"("clientId");
CREATE INDEX "Invoice_status_idx" ON "Invoice"("status");
CREATE INDEX "Invoice_dueDate_idx" ON "Invoice"("dueDate");
CREATE INDEX "Quotation_leadId_idx" ON "Quotation"("leadId");
CREATE INDEX "Quotation_status_idx" ON "Quotation"("status");
CREATE INDEX "Payment_invoiceId_idx" ON "Payment"("invoiceId");
CREATE INDEX "Payment_receivedAt_idx" ON "Payment"("receivedAt");
CREATE INDEX "MaintenancePlan_customerId_idx" ON "MaintenancePlan"("customerId");
CREATE INDEX "MaintenancePlan_dueDate_idx" ON "MaintenancePlan"("dueDate");
CREATE INDEX "MaintenancePlan_status_idx" ON "MaintenancePlan"("status");
CREATE INDEX "ReminderLog_planId_idx" ON "ReminderLog"("planId");
CREATE INDEX "ReminderLog_status_idx" ON "ReminderLog"("status");
CREATE INDEX "AdminAction_action_idx" ON "AdminAction"("action");
CREATE INDEX "AdminAction_createdAt_idx" ON "AdminAction"("createdAt");

ALTER TABLE "Project" ADD CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MaintenancePlan" ADD CONSTRAINT "MaintenancePlan_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReminderLog" ADD CONSTRAINT "ReminderLog_planId_fkey" FOREIGN KEY ("planId") REFERENCES "MaintenancePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

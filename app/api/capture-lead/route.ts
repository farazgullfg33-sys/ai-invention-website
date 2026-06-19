import { appendFile, mkdir } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const maxFieldLength = 1200;

function cleanField(value: unknown, maxLength = maxFieldLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

async function sendTelegramAlert(lead: {
  name: string;
  email: string;
  businessType: string;
  service: string;
  message: string;
  telegram: string;
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return;
  }

  const text = [
    "New Lead",
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Service: ${lead.service}`,
    `Business: ${lead.businessType}`,
    `Message: ${lead.message}`,
    lead.telegram ? `Telegram: ${lead.telegram}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  }).catch((error) => {
    console.error("Telegram lead alert failed", error);
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    name?: unknown;
    email?: unknown;
    businessType?: unknown;
    service?: unknown;
    telegram?: unknown;
    message?: unknown;
  } | null;

  const lead = {
    name: cleanField(body?.name, 240),
    email: cleanField(body?.email, 240).toLowerCase(),
    businessType: cleanField(body?.businessType, 240),
    service: cleanField(body?.service, 240),
    telegram: cleanField(body?.telegram, 240),
    message: cleanField(body?.message),
  };

  if (!lead.name || !emailPattern.test(lead.email) || !lead.businessType || !lead.service || !lead.message) {
    return NextResponse.json({ ok: false, message: "Missing or invalid lead details." }, { status: 400 });
  }

  const dataDir = join(process.cwd(), "data");
  const leadPath = join(dataDir, "leads.jsonl");

  await mkdir(dataDir, { recursive: true });
  await appendFile(
    leadPath,
    `${JSON.stringify({
      source: "website-contact-form",
      createdAt: new Date().toISOString(),
      ...lead,
    })}\n`,
    "utf8",
  );

  await sendTelegramAlert(lead);

  return NextResponse.json({ ok: true });
}

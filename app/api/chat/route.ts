import { appendFile, mkdir } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

const model = "deepseek/deepseek-v4-flash";
const maxMessageLength = 1200;
const maxHistoryItems = 10;
const rateLimitWindowMs = 60_000;
const rateLimitMaxRequests = 10;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();
const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;

const systemPrompt = `
You are the AI Invention Assistant for aiinvention.tech.

Business:
- AI Invention is a Malaysia-based service company.
- Main offer: Done-for-you AI Agent Workflow Deployment Service.
- We deploy an AI agent workflow on the client's VPS, load business documents so the AI can reference them, and connect Telegram access.
- Common use cases include hotel or apartment booking agents, real estate assistants, ecommerce support agents, website assistant bots, service business agents, and internal CEO or manager knowledge assistants.
- Launch pricing: AI Agent Deployment is $200 setup + $100/month maintenance. Website + AI Agent Bundle is $299 setup + $100/month maintenance. Website Only is $179.
- AI model routing is included. Premium models such as OpenAI and Claude are available as upgrades.
- Contact email: hello@aiinvention.tech.

Behavior:
- Keep replies concise, helpful, and specific.
- Do not claim custom model fine-tuning.
- Do not say data never leaves. Use: "Your VPS. Your documents. Your control."
- If a visitor shows buying intent, ask them to use the Get Started form or share their email.
`.trim();

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || request.headers.get("x-real-ip") || "local";
}

function checkRateLimit(clientKey: string) {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(clientKey);

  if (!bucket || bucket.resetAt <= now) {
    rateLimitBuckets.set(clientKey, { count: 1, resetAt: now + rateLimitWindowMs });
    return true;
  }

  if (bucket.count >= rateLimitMaxRequests) {
    return false;
  }

  bucket.count += 1;
  return true;
}

function normalizeHistory(history: unknown): ChatMessage[] {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .flatMap((entry) => {
      if (!entry || typeof entry !== "object") {
        return [];
      }

      const message = entry as Partial<ChatMessage>;
      const role = message.role === "assistant" || message.role === "user" ? message.role : null;
      const content = typeof message.content === "string" ? message.content.trim().slice(0, maxMessageLength) : "";

      return role && content ? [{ role, content }] : [];
    })
    .slice(-maxHistoryItems);
}

function fallbackReply(message: string) {
  const lowerMessage = message.toLowerCase();
  const email = message.match(emailPattern)?.[0];

  if (email) {
    return `Thanks, I saved ${email} for follow-up. AI Invention can help you choose the right AI agent or website package.`;
  }

  if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("pricing")) {
    return "Launch pricing: AI Agent Deployment is $200 setup + $100/month maintenance. Website + AI Agent Bundle is $299 setup + $100/month. Website Only is $179.";
  }

  if (lowerMessage.includes("vps")) {
    return "AI Invention deploys a custom AI agent workflow on your VPS. If you do not have one, we recommend a low-cost KVM/Ubuntu VPS and set it up for you.";
  }

  if (lowerMessage.includes("telegram")) {
    return "Your AI agent workflow is connected to Telegram so you can use it from your phone or desktop after handoff.";
  }

  if (lowerMessage.includes("document") || lowerMessage.includes("train")) {
    return "We load your business documents so the AI agent can reference them. This is knowledge loading, not custom model fine-tuning.";
  }

  if (
    lowerMessage.includes("hotel") ||
    lowerMessage.includes("booking") ||
    lowerMessage.includes("apartment") ||
    lowerMessage.includes("real estate") ||
    lowerMessage.includes("ecommerce") ||
    lowerMessage.includes("e-commerce") ||
    lowerMessage.includes("website bot") ||
    lowerMessage.includes("assistant")
  ) {
    return "Yes. AI Invention customizes agents around the business process, such as booking agents, real estate assistants, ecommerce support, website assistant bots, service business agents, and internal manager assistants.";
  }

  return "AI Invention deploys custom AI agent workflows on client VPS infrastructure, loads business documents, connects Telegram access, and maintains the setup monthly. Use the Get Started form to begin.";
}

async function saveConversation(entry: {
  clientKey: string;
  message: string;
  reply: string;
  history: ChatMessage[];
  email?: string;
}) {
  const dataDir = join(process.cwd(), "data");
  const logPath = join(dataDir, "chat-logs.jsonl");

  await mkdir(dataDir, { recursive: true });
  await appendFile(
    logPath,
    `${JSON.stringify({
      source: "aiinvention.tech",
      createdAt: new Date().toISOString(),
      ...entry,
    })}\n`,
    "utf8",
  );
}

export async function POST(request: Request) {
  const clientKey = getClientKey(request);

  if (!checkRateLimit(clientKey)) {
    return NextResponse.json({ reply: "Too many messages in a short time. Please try again in a minute." }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as {
    message?: unknown;
    history?: unknown;
  } | null;

  const message = typeof body?.message === "string" ? body.message.trim().slice(0, maxMessageLength) : "";
  const history = normalizeHistory(body?.history);

  if (!message) {
    return NextResponse.json({ reply: "Please enter a message so I can help." }, { status: 400 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  let reply = "";

  if (apiKey) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://aiinvention.tech",
          "X-Title": "AI Invention Assistant",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "system", content: systemPrompt }, ...history, { role: "user", content: message }],
          temperature: 0.35,
          max_tokens: 420,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as OpenRouterResponse;
      reply = data.choices?.[0]?.message?.content?.trim() || "";

      if (!response.ok || !reply) {
        reply = fallbackReply(message);
      }
    } catch {
      reply = fallbackReply(message);
    }
  } else {
    reply = fallbackReply(message);
  }

  await saveConversation({
    clientKey,
    message,
    reply,
    history,
    email: message.match(emailPattern)?.[0],
  }).catch(() => undefined);

  return NextResponse.json({ reply });
}

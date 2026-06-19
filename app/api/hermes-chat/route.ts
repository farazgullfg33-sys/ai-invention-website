import { NextResponse } from "next/server";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

type HermesResponse = {
  reply?: string;
  message?: string;
  output?: string;
  text?: string;
};

function normalizeHermesReply(data: unknown) {
  if (typeof data === "string") {
    return data;
  }

  if (data && typeof data === "object") {
    const response = data as HermesResponse;
    return response.reply || response.message || response.output || response.text;
  }

  return undefined;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    message?: string;
    history?: ChatMessage[];
    page?: string;
  } | null;

  const message = body?.message?.trim();

  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const hermesWebhookUrl = process.env.HERMES_AGENT_WEBHOOK_URL;
  const hermesApiKey = process.env.HERMES_AGENT_API_KEY;

  if (!hermesWebhookUrl) {
    return NextResponse.json({
      reply:
        "AI agent chat is ready. Connect the agent webhook on the VPS so I can answer customers directly from the AI agent backend.",
    });
  }

  try {
    const response = await fetch(hermesWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(hermesApiKey ? { Authorization: `Bearer ${hermesApiKey}` } : {}),
      },
      body: JSON.stringify({
        source: "aiinvention.tech",
        channel: "website-chat",
        message,
        history: body?.history || [],
        page: body?.page || "https://aiinvention.tech",
      }),
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json") ? await response.json() : await response.text();
    const reply = normalizeHermesReply(data);

    if (!response.ok) {
      return NextResponse.json({ error: reply || "AI agent backend returned an error." }, { status: response.status });
    }

    return NextResponse.json({
      reply: reply || "The AI agent received the message and is ready to continue the conversation.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to reach AI agent backend.",
      },
      { status: 502 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createLead } from "@/lib/admin-store";

function clean(value: unknown, max = 600) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = clean(body.name, 120);
    const email = clean(body.email, 180).toLowerCase();
    const company = clean(body.company, 180);
    const service = clean(body.service, 160) || "Website + AI Agent Bundle";

    if (!name || !email || !company) {
      return NextResponse.json({ ok: false, message: "Name, email, and company are required." }, { status: 400 });
    }

    await createLead({
      name,
      email,
      phone: clean(body.phone, 80),
      service,
      businessType: company,
      source: "client-signup",
      message: [
        "Customer portal signup request.",
        `Company: ${company}`,
        `Requested service: ${service}`,
        clean(body.message, 900),
      ]
        .filter(Boolean)
        .join("\n"),
    });

    return NextResponse.json({
      ok: true,
      message: "Signup request sent. Admin will review it and create portal access credentials.",
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Signup request failed." },
      { status: 500 },
    );
  }
}

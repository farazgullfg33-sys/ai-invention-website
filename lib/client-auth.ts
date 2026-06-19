import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

export const clientSessionCookie = "ai_client_session";

function getClientSessionSecret() {
  return process.env.CLIENT_SESSION_SECRET || process.env.ADMIN_SESSION_TOKEN || "local-client-session";
}

function signCustomerId(customerId: string) {
  return createHmac("sha256", getClientSessionSecret()).update(customerId).digest("base64url");
}

export function createClientSessionToken(customerId: string) {
  return `${Buffer.from(customerId).toString("base64url")}.${signCustomerId(customerId)}`;
}

export function readClientSessionToken(token: string | undefined) {
  if (!token) {
    return "";
  }

  const [encodedCustomerId, signature] = token.split(".");
  if (!encodedCustomerId || !signature) {
    return "";
  }

  const customerId = Buffer.from(encodedCustomerId, "base64url").toString("utf8");
  const expected = signCustomerId(customerId);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (providedBuffer.length !== expectedBuffer.length || !timingSafeEqual(providedBuffer, expectedBuffer)) {
    return "";
  }

  return customerId;
}

export function getClientSessionCustomerId(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const sessionCookie = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${clientSessionCookie}=`));

  return readClientSessionToken(sessionCookie?.slice(clientSessionCookie.length + 1));
}

export function unauthorizedClientResponse() {
  return NextResponse.json({ ok: false, message: "Customer login required." }, { status: 401 });
}

import { NextResponse } from "next/server";

export const adminSessionCookie = "ai_admin_session";

export function getAdminUsername() {
  return process.env.ADMIN_USERNAME || "admin";
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "admin123";
}

export function getAdminSessionToken() {
  return process.env.ADMIN_SESSION_TOKEN || "local-admin-session";
}

export function hasAdminSession(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const expected = `${adminSessionCookie}=${getAdminSessionToken()}`;
  return cookie.split(";").map((part) => part.trim()).includes(expected);
}

export function unauthorizedAdminResponse() {
  return NextResponse.json({ ok: false, message: "Admin login required." }, { status: 401 });
}

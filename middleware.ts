import { NextRequest, NextResponse } from "next/server";
import { adminSessionCookie, getAdminSessionToken } from "@/lib/admin-auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") || "";

  // Domain-based redirect: admin/customer subdomain -> respective path
  if (host.startsWith("admin.") && !pathname.startsWith("/admin")) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin" + pathname;
    return NextResponse.redirect(url);
  }

  if (host.startsWith("customer.") && !pathname.startsWith("/client")) {
    const url = request.nextUrl.clone();
    url.pathname = "/client" + (pathname === "/" ? "" : pathname);
    return NextResponse.redirect(url);
  }

  // Client auth protection
  if (pathname.startsWith("/client") && pathname !== "/client/login" && pathname !== "/client/signup") {
    if (request.cookies.get("ai_client_session")?.value) {
      return NextResponse.next();
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/client/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin auth protection
  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (request.cookies.get(adminSessionCookie)?.value === getAdminSessionToken()) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/client/:path*"],
};

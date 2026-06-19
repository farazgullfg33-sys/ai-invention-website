import { NextRequest, NextResponse } from "next/server";
import { adminSessionCookie, getAdminSessionToken } from "@/lib/admin-auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/client") && pathname !== "/client/login" && pathname !== "/client/signup") {
    if (request.cookies.get("ai_client_session")?.value) {
      return NextResponse.next();
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/client/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

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

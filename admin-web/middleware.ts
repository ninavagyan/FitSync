import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { config as appConfig, isAdminHost } from "@/lib/config";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/register", "/api/auth/login", "/api/auth/register", "/api/auth/logout", "/api/auth/mock-login"];
const PASSTHROUGH_PATH_PREFIXES = ["/_next", "/api", "/favicon.ico"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host");

  if (PASSTHROUGH_PATH_PREFIXES.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.next();
  }

  if (isAdminHost(host) && pathname !== "/" && pathname.startsWith("/admin") === false) {
    const rewrittenUrl = request.nextUrl.clone();
    rewrittenUrl.pathname = `/admin${pathname}`;
    return NextResponse.rewrite(rewrittenUrl);
  }

  if (isAdminHost(host) && pathname === "/") {
    const rewrittenUrl = request.nextUrl.clone();
    rewrittenUrl.pathname = "/admin/dashboard";
    return NextResponse.rewrite(rewrittenUrl);
  }

  if (pathname === "/admin") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/dashboard";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname.startsWith("/admin")) {
    const isPublic = PUBLIC_ADMIN_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
    if (isPublic) {
      return NextResponse.next();
    }

    const role = request.cookies.get(appConfig.roleCookie)?.value;
    if (role === "trainer" || role === "manager" || role === "owner") {
      return NextResponse.next();
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.search = "";
    loginUrl.searchParams.set("redirect", pathname.replace(/^\/admin/, "") || "/dashboard");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};

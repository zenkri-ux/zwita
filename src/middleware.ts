import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, adminPassword, verifySession } from "@/lib/server/auth";

// Gate the admin area. The login page and login endpoint stay public; every
// other /admin page and /api/admin route needs a valid session cookie.

const PUBLIC_PATHS = new Set(["/admin/login", "/api/admin/login"]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next();

  const secret = adminPassword();
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const authed = secret ? await verifySession(token, secret) : false;
  if (authed) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const loginUrl = new URL("/admin/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

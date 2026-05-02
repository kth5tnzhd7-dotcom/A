import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedRoutes = [
    "/dashboard",
    "/url-shortener",
    "/bulk-sms",
    "/website-hosting",
    "/telegram-bot",
    "/api/shorten",
    "/api/sms",
    "/api/hosting",
    "/api/telegram",
  ];

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/url-shortener/:path*",
    "/bulk-sms/:path*",
    "/website-hosting/:path*",
    "/telegram-bot/:path*",
    "/api/shorten/:path*",
    "/api/sms/:path*",
    "/api/hosting/:path*",
    "/api/telegram/:path*",
  ],
};

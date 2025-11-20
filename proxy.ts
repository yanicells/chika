import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Prevent caching for pages that depend on auth state
  if (
    request.nextUrl.pathname.startsWith("/notes") ||
    request.nextUrl.pathname.startsWith("/blog") ||
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/create") ||
    request.nextUrl.pathname === "/"
  ) {
    response.headers.set("Cache-Control", "no-store, must-revalidate");
    response.headers.set("CDN-Cache-Control", "no-store");
    response.headers.set("Vercel-CDN-Cache-Control", "no-store");
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

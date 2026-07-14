import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { clearAccessTokenCookie } from "@/lib/auth-cookie";
import type { UserRole } from "@/types";

const ROUTE_ROLES: Record<string, UserRole> = {
  "/admin": "ADMIN",
  "/auctions": "DEALER",
};

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const requiredRole = Object.entries(ROUTE_ROLES).find(([prefix]) =>
    path.startsWith(prefix),
  )?.[1];

  if (!requiredRole) {
    return NextResponse.next();
  }

  const token = request.cookies.get("access_token")?.value;
  const { verifyAccessToken } = await import("./lib/auth");
  const session = token ? await verifyAccessToken(token) : null;

  if (session?.role !== requiredRole) {
    const response = NextResponse.redirect(new URL("/", request.url));
    clearAccessTokenCookie(response);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

import { clearAccessTokenCookie } from "@/lib/auth-cookie";
import type { UserRole } from "@/types";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ROUTE_ROLES: Record<string, UserRole[]> = {
  "/admin": ["ADMIN"],
  "/auctions": ["DEALER"],
};

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const requiredRoles = Object.entries(ROUTE_ROLES).find(([prefix]) =>
    path.startsWith(prefix),
  )?.[1];

  if (!requiredRoles) {
    return NextResponse.next();
  }

  const token = request.cookies.get("access_token")?.value;

  const { verifyAccessToken } = await import("./lib/auth");
  const session = token ? await verifyAccessToken(token) : null;

  // No valid session -> go to login
  if (!session) {
    const response = NextResponse.redirect(new URL("/", request.url));
    clearAccessTokenCookie(response);
    return response;
  }

  // Authenticated but wrong role -> send to their own area
  if (!requiredRoles.includes(session.role)) {
    const redirectUrl = session.role === "ADMIN" ? "/admin" : "/auctions";

    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

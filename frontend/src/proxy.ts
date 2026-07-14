import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("access_token")?.value;

  let session: { role: "ADMIN" | "DEALER" } | null = null;

  if (token) {
    const { verifyAccessToken } = await import("./lib/auth");
    session = await verifyAccessToken(token);
  }

  const isAdminRoute = path.startsWith("/admin");
  const isAuctionsRoute = path.startsWith("/auctions");

  if (isAdminRoute) {
    if (!session || session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (isAuctionsRoute) {
    if (!session || session.role !== "DEALER") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

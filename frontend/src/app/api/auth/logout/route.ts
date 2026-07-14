import { clearAccessTokenCookie } from "@/lib/auth-cookie";
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  clearAccessTokenCookie(response);
  return response;
}

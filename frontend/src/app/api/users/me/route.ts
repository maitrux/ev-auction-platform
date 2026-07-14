import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3001";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const backendResponse = await fetch(`${BACKEND_URL}/users/me`, {
    headers: {
      Cookie: `access_token=${token}`,
    },
  });

  if (!backendResponse.ok) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const user = await backendResponse.json();
  return NextResponse.json(user);
}

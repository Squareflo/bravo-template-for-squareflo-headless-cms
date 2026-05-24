/**
 * Auth Sign-In API Proxy — SquarefloCMS Bravo Template
 * =====================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Proxies sign-in requests to the CMS auth API and sets the returned
 * access token as an httpOnly cookie. This keeps the API key and token
 * handling server-side — the client never sees the raw token.
 *
 * POST /api/auth/sign-in
 * Body: { email: string, password: string }
 * Response: { user: { ... } } on success, { error: string } on failure
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.SQUAREFLO_API_URL!;
const API_KEY = process.env.SQUAREFLO_API_KEY!;

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  const res = await fetch(`${API_URL}/auth/sign-in`, {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { error: data.error || "Invalid email or password." },
      { status: res.status },
    );
  }

  // Set the access token as an httpOnly cookie
  const cookieStore = await cookies();
  cookieStore.set("sqf_token", data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 72, // 72 hours (matches CMS token expiry)
  });

  return NextResponse.json({ user: data.user });
}

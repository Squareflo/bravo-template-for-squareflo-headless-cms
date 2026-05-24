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

  // Log the full CMS response so we can see the exact structure
  console.log("[sign-in] CMS response:", JSON.stringify(data));

  // Try access_token first, fall back to token
  const token = data.access_token || data.token;
  if (!token) {
    console.error("[sign-in] No token found in CMS response");
    return NextResponse.json(
      { error: "Sign-in succeeded but no token was returned." },
      { status: 500 },
    );
  }

  console.log("[sign-in] Token found, length:", token.length, "Setting cookie...");

  // Set the access token as an httpOnly cookie on the response object
  const response = NextResponse.json({ user: data.user });
  response.cookies.set("sqf_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 72,
  });

  // Log the Set-Cookie header to verify it's present
  console.log("[sign-in] Response Set-Cookie:", response.headers.get("set-cookie"));

  return response;
}

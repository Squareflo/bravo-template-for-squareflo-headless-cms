/**
 * Auth Me API Proxy — SquarefloCMS Bravo Template
 * =================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Validates the current auth cookie by calling GET /auth/me on the CMS API.
 * Returns the user object if valid, or 401 if not.
 *
 * GET /api/auth/me
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.SQUAREFLO_API_URL!;
const API_KEY = process.env.SQUAREFLO_API_KEY!;

export async function GET(req: Request) {
  // Log all cookies to see what's actually present
  const cookieHeader = req.headers.get("cookie");
  console.log("[auth/me] Cookie header:", cookieHeader || "(none)");

  const cookieStore = await cookies();
  const token = cookieStore.get("sqf_token")?.value;

  console.log("[auth/me] sqf_token present:", !!token);

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const res = await fetch(`${API_URL}/auth/me`, {
    headers: {
      "x-api-key": API_KEY,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const data = await res.json();
  return NextResponse.json({ user: data.user });
}

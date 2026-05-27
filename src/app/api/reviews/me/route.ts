/**
 * My Review API Proxy — SquarefloCMS Bravo Template
 * ===================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * GET /api/reviews/me → fetch the current user's review (if any)
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.SQUAREFLO_API_URL!;
const API_KEY = process.env.SQUAREFLO_API_KEY!;

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sqf_token")?.value;

  if (!token) {
    return NextResponse.json({ review: null }, { status: 401 });
  }

  const res = await fetch(`${API_URL}/reviews/me`, {
    headers: {
      "x-api-key": API_KEY,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ review: null }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}

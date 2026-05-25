/**
 * Auth Check-Email API Proxy — SquarefloCMS Bravo Template
 * =========================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Checks if an email address belongs to an existing CMS user.
 *
 * POST /api/auth/check-email
 * Body: { email: string }
 * Response: { exists: boolean }
 */

import { NextResponse } from "next/server";

const API_URL = process.env.SQUAREFLO_API_URL!;
const API_KEY = process.env.SQUAREFLO_API_KEY!;

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json(
      { error: "Email is required." },
      { status: 400 },
    );
  }

  const res = await fetch(`${API_URL}/auth/check-email`, {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { error: data.error || "Failed to check email." },
      { status: res.status },
    );
  }

  return NextResponse.json({ exists: data.exists });
}

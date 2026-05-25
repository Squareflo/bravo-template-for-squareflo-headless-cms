/**
 * Auth Resend Verification API Proxy — SquarefloCMS Bravo Template
 * =================================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Resends the 6-digit verification code to the user's email.
 *
 * POST /api/auth/resend-verification
 * Body: { email: string }
 * Response: { message: string } on success
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

  const res = await fetch(`${API_URL}/auth/resend-verification`, {
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
      { error: data.error || "Failed to resend verification code." },
      { status: res.status },
    );
  }

  return NextResponse.json({ message: data.message || "Verification code resent." });
}

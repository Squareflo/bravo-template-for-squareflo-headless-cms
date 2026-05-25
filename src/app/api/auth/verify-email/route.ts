/**
 * Auth Verify Email API Proxy — SquarefloCMS Bravo Template
 * ==========================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Verifies a user's email address using the 6-digit code sent during sign-up.
 *
 * POST /api/auth/verify-email
 * Body: { email: string, code: string }
 * Response: { message: string } on success
 */

import { NextResponse } from "next/server";

const API_URL = process.env.SQUAREFLO_API_URL!;
const API_KEY = process.env.SQUAREFLO_API_KEY!;

export async function POST(req: Request) {
  const { email, code } = await req.json();

  if (!email || !code) {
    return NextResponse.json(
      { error: "Email and verification code are required." },
      { status: 400 },
    );
  }

  const res = await fetch(`${API_URL}/auth/verify-email`, {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, code }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { error: data.error || "Verification failed." },
      { status: res.status },
    );
  }

  return NextResponse.json({ message: data.message || "Email verified successfully." });
}

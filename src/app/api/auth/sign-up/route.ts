/**
 * Auth Sign-Up API Proxy — SquarefloCMS Bravo Template
 * =====================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Creates a new user account via the CMS auth API.
 * The CMS sends a 6-digit verification code to the user's email.
 *
 * POST /api/auth/sign-up
 * Body: { email, password, first_name, last_name, subscriber_group_ids? }
 * Response: { message: string } on success
 */

import { NextResponse } from "next/server";

const API_URL = process.env.SQUAREFLO_API_URL!;
const API_KEY = process.env.SQUAREFLO_API_KEY!;

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, first_name, last_name, subscriber_group_ids } = body;

  if (!email || !password || !first_name) {
    return NextResponse.json(
      { error: "Email, password, and first name are required." },
      { status: 400 },
    );
  }

  const res = await fetch(`${API_URL}/auth/sign-up`, {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      first_name,
      last_name: last_name || "",
      subscriber_group_ids: subscriber_group_ids || [],
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { error: data.error || "Sign-up failed." },
      { status: res.status },
    );
  }

  return NextResponse.json({ message: data.message || "Account created. Check your email for a verification code." });
}

/**
 * Auth Sign-Out API — SquarefloCMS Bravo Template
 * =================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Clears the auth cookie. The CMS auth is stateless (JWT-based),
 * so sign-out just means discarding the token.
 *
 * POST /api/auth/sign-out
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set("sqf_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ ok: true });
}

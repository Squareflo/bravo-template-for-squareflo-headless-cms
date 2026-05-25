/**
 * Subscriber Groups API Proxy — SquarefloCMS Bravo Template
 * ==========================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Fetches public subscriber groups from the CMS API.
 * These are shown as checkboxes during sign-up so users can
 * opt into mailing lists.
 *
 * GET /api/subscriber-groups
 * Response: { groups: Array<{ id, name, description }> }
 */

import { NextResponse } from "next/server";

const API_URL = process.env.SQUAREFLO_API_URL!;
const API_KEY = process.env.SQUAREFLO_API_KEY!;

export async function GET() {
  const res = await fetch(`${API_URL}/subscriber-groups?public_only=true`, {
    headers: { "x-api-key": API_KEY },
    next: { revalidate: 60 },
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { groups: [] },
      { status: res.status },
    );
  }

  return NextResponse.json({ groups: data.groups || [] });
}

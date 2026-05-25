/**
 * Comments API Proxy — SquarefloCMS Bravo Template
 * ==================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * GET  /api/comments?module_type=blog&module_item_id=<uuid>
 * POST /api/comments  { module_type, module_item_id, content }
 *
 * Proxies to the CMS /comments endpoint, forwarding the user's
 * auth token on POST requests.
 */

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.SQUAREFLO_API_URL!;
const API_KEY = process.env.SQUAREFLO_API_KEY!;

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const moduleType = sp.get("module_type");
  const moduleItemId = sp.get("module_item_id");

  if (!moduleType || !moduleItemId) {
    return NextResponse.json({ error: "module_type and module_item_id are required" }, { status: 400 });
  }

  const url = `${API_URL}/comments?module_type=${encodeURIComponent(moduleType)}&module_item_id=${encodeURIComponent(moduleItemId)}`;
  const res = await fetch(url, {
    headers: { "x-api-key": API_KEY },
    cache: "no-store",
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("sqf_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const res = await fetch(`${API_URL}/comments`, {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

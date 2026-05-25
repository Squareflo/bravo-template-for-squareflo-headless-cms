import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.SQUAREFLO_API_URL!;
const API_KEY = process.env.SQUAREFLO_API_KEY!;

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sqf_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "no sqf_token cookie", cookies: cookieStore.getAll().map(c => c.name) });
  }

  const res = await fetch(`${API_URL}/auth/me`, {
    headers: {
      "x-api-key": API_KEY,
      Authorization: `Bearer ${token}`,
    },
  });

  const raw = await res.text();
  return NextResponse.json({ status: res.status, raw: JSON.parse(raw) });
}

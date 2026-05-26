/**
 * Comment Like/Unlike Proxy — SquarefloCMS Bravo Template
 * ========================================================
 * POST   /api/comments/[id]/like — Like a comment
 * DELETE /api/comments/[id]/like — Unlike a comment
 *
 * Supports both authenticated users (Bearer token) and
 * guests (guest_id in body).
 */

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.SQUAREFLO_API_URL!;
const API_KEY = process.env.SQUAREFLO_API_KEY!;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("sqf_token")?.value;

  const headers: Record<string, string> = {
    "x-api-key": API_KEY,
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    // No body is fine for authenticated users
  }

  const res = await fetch(`${API_URL}/comments/${id}/like`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("sqf_token")?.value;

  const headers: Record<string, string> = {
    "x-api-key": API_KEY,
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    // No body is fine for authenticated users
  }

  const res = await fetch(`${API_URL}/comments/${id}/like`, {
    method: "DELETE",
    headers,
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

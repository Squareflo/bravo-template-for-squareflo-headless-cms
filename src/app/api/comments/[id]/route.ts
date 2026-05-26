/**
 * Comment Delete Proxy — SquarefloCMS Bravo Template
 * ====================================================
 * DELETE /api/comments/[id] — Delete own comment
 */

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.SQUAREFLO_API_URL!;
const API_KEY = process.env.SQUAREFLO_API_KEY!;

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("sqf_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const res = await fetch(`${API_URL}/comments/${id}`, {
    method: "DELETE",
    headers: {
      "x-api-key": API_KEY,
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

import { NextResponse } from "next/server";
import { cms } from "@/lib/cms";

export async function GET() {
  try {
    const data = await cms<any>("/blog");
    return NextResponse.json({ raw: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

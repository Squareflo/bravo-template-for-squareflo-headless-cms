/**
 * Form Proxy Route — SquarefloCMS Bravo Template
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Proxies form fetch requests to the CMS API so client components
 * can load forms by slug (e.g. for design mode form selection).
 */

import { cms } from "@/lib/cms";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const data = await cms<{ form: any }>(`/forms/${slug}`);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ form: null }, { status: 404 });
  }
}

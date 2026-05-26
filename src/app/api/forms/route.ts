/**
 * Forms List Proxy Route — SquarefloCMS Bravo Template
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Proxies form list requests to the CMS API so client components
 * can load the list of available forms (e.g. for design mode dropdowns).
 */

import { cms } from "@/lib/cms";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await cms<{ forms: any[] }>("/forms");
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ forms: [] }, { status: 500 });
  }
}

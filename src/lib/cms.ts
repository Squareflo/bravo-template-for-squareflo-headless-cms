/**
 * SquarefloCMS Headless API Client
 * =================================
 * Powered by SquarefloCMS (https://squareflo.com) — a free headless CMS for developers.
 *
 * This is the single API client used by all server components to fetch data from
 * the SquarefloCMS headless API. It handles authentication via API key and uses
 * Next.js dynamic rendering with no caching so content updates in the CMS
 * appear on the live site immediately on the next page load.
 *
 * Environment variables used:
 *   - SQUAREFLO_API_URL   → CMS API base URL
 *   - SQUAREFLO_API_KEY   → Your site's API key
 *   - SQUAREFLO_DRAFT_KEY → (optional) For draft/preview content
 *
 * These are automatically pushed to your Vercel project by SquarefloCMS.
 * In the CMS dashboard go to: Integrations → Frontend Hosting → connect
 * your Vercel account (API token, Project ID, Team ID) → click
 * "Push Env Vars to Vercel". The CMS also sets up a Deploy Hook URL so
 * content changes in the CMS can trigger a redeploy.
 * For local development, copy these values into a .env.local file.
 *
 * Usage:
 *   const { pages } = await cms<{ pages: Page[] }>("/pages");
 *   const settings = await cms<SiteSettings>("/settings");
 *   const { navigation } = await cms<{ navigation: NavItem[] }>("/navigation", { location: "header" });
 */

const API_URL = process.env.SQUAREFLO_API_URL!;
const API_KEY = process.env.SQUAREFLO_API_KEY!;

export async function cms<T>(
  endpoint: string,
  params?: Record<string, string>,
): Promise<T> {
  const url = new URL(`${API_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    headers: { "x-api-key": API_KEY },
    cache: "no-store", // Always fetch fresh data from CMS on every request
  });

  if (!res.ok) {
    throw new Error(`CMS API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Home Page — SquarefloCMS Bravo Template
 * ==========================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Fetches the home page from the CMS and renders its content blocks.
 * The home page is identified by the `is_home` flag in the CMS.
 *
 * API flow:
 *   1. Try GET /pages?home_only=true (returns the page flagged as home)
 *   2. If no home page is flagged, fall back to the first page in GET /pages
 *   3. Render the page's headless_content blocks via TwoColumnLayout
 *
 * The home page content is managed entirely in the CMS — add headings,
 * paragraphs, images, buttons, columns, etc. using the CMS page editor.
 *
 * Design Reference:
 *   - html-reference/index-r4m7t9w2qx.html (standard home page)
 *   - html-reference/index-fullscreen-r4m7t9w2qx.html (fullscreen hero variant)
 */

import { cms } from "@/lib/cms";
import { TwoColumnLayout } from "@/components/ContentBlock";
import type { Metadata } from "next";

async function getHomePage() {
  try {
    // Try fetching pages with home_only flag first
    const data = await cms<{ pages: any[] }>("/pages", { home_only: "true" });
    if (data.pages.length > 0) return data.pages[0];

    // Fallback: if no home page is explicitly flagged, use the first page
    const all = await cms<{ pages: any[] }>("/pages");
    return all.pages[0] || null;
  } catch {
    return null;
  }
}

/** Per-page SEO metadata — pulled from the CMS page's meta fields */
export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage();
  if (!page) return {};
  return {
    title: page.meta?.title || page.title,
    description: page.meta?.description || undefined,
  };
}

export default async function HomePage() {
  const page = await getHomePage();

  // Show a placeholder if no pages exist in the CMS yet
  if (!page) {
    return (
      <div className="container page">
        <h1>Welcome</h1>
        <p>No home page has been created yet. Add one in the CMS.</p>
      </div>
    );
  }

  // Render the CMS page content using the block-based renderer
  return (
    <div className="container page">
      <TwoColumnLayout content={page.headless_content} />
    </div>
  );
}

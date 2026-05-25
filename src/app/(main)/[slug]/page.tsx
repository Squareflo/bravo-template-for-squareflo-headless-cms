/**
 * Dynamic Page Route — SquarefloCMS Bravo Template
 * ===================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * This is the catch-all route for all CMS-managed pages (e.g., /about, /contact).
 * The slug in the URL maps directly to the page slug in the CMS.
 *
 * Features:
 *   - Static generation via generateStaticParams (pre-builds all known pages)
 *   - Per-page SEO metadata from CMS meta fields
 *   - Two-column layout support (main content + optional sidebar)
 *   - 404 handling for non-existent slugs
 *
 * API flow:
 *   - generateStaticParams: GET /pages → builds static routes for all pages
 *   - generateMetadata: GET /pages/:slug → pulls SEO title/description
 *   - DynamicPage: GET /pages/:slug → fetches and renders content blocks
 *
 * Design Reference:
 *   - Page layout and title styling from html-reference/index-r4m7t9w2qx.html
 *   - Two-column layout (main + sidebar) structure is standard across all
 *     interior pages in the Bravo template
 */

import { cms } from "@/lib/cms";
import { TwoColumnLayout } from "@/components/ContentBlock";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Per-page SEO metadata — title and description from CMS */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { page } = await cms<{ page: any }>(`/pages/${slug}`);
    const ogImage = page.meta?.og_image || undefined;
    return {
      title: page.meta?.title || page.title,
      description: page.meta?.description || undefined,
      ...(ogImage && { openGraph: { images: [ogImage] } }),
      ...(page.meta?.no_index && {
        robots: {
          index: !page.meta.no_index,
          follow: !page.meta.no_follow,
        },
      }),
    };
  } catch {
    return {};
  }
}

/**
 * Pre-build all CMS pages at build time for fast loading.
 * Pages are fetched fresh from the CMS on every request (no caching).
 */
export async function generateStaticParams() {
  try {
    const { pages } = await cms<{ pages: any[] }>("/pages");
    return pages
      .filter((p) => !p.is_home && !p.is_system) // Home page → src/app/page.tsx, system pages have dedicated routes
      .map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;

  let page;
  try {
    const data = await cms<{ page: any }>(`/pages/${slug}`);
    page = data.page;
  } catch {
    notFound();
  }

  if (!page) notFound();

  return (
    <div className="container page">
      {/* Render only CMS content blocks — the page's heading comes from the content editor */}
      <TwoColumnLayout content={page.headless_content} />
    </div>
  );
}

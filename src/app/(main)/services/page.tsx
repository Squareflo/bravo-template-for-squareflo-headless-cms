/**
 * Services Listing Page — SquarefloCMS Bravo Template
 * ==================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Fetches all service feed entries from the CMS and passes them
 * to ServicesPageClient which handles layout switching (list/grid)
 * and sidebar form loading based on edit mode settings.
 *
 * Design Reference:
 *   - html-reference/services-list-b6n3k8q5jw.html
 *   - html-reference/services-grid-b6n3k8q5jw.html
 */

import { cms } from "@/lib/cms";
import type { Metadata } from "next";
import ServicesPageClient from "@/components/ServicesPageClient";

interface FeedEntry {
  id: string;
  title: string;
  slug: string;
  status: string;
  sort_order?: number;
  data: {
    thumbnail?: string;
    main_image?: string;
    h1_heading?: string;
    first_paragraph?: string;
    service_name?: string;
    short_summary?: string;
    additional_content?: any[];
    [key: string]: any;
  };
}

export const metadata: Metadata = {
  title: "Services",
};

export default async function ServicesPage() {
  let entries: FeedEntry[] = [];

  try {
    const data = await cms<{ entries: FeedEntry[] }>("/feed-entries", {
      module: "services",
    });
    entries = (data.entries || []).sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    );
  } catch {}

  return <ServicesPageClient entries={entries} />;
}

/**
 * FAQ Category Page — SquarefloCMS Bravo Template
 * ==================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Shows all FAQs in a given category, using the same layout
 * as the main FAQ listing page with sidebar.
 */

import { cms } from "@/lib/cms";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlogSidebarFormLoader from "@/components/BlogSidebarFormLoader";
import FAQList from "@/components/FAQList";
import "@/styles/faq.css";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = decodeURIComponent(slug);
  return {
    title: `${category} — FAQs`,
    description: `Frequently asked questions about ${category}`,
  };
}

export default async function FAQCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = decodeURIComponent(slug);

  let allFaqs: FAQ[] = [];
  let filteredFaqs: FAQ[] = [];
  let categories: string[] = [];

  // Always fetch all FAQs to get full category list and counts
  try {
    const data = await cms<{ faqs: FAQ[]; categories: string[]; tags: string[] }>("/faqs");
    allFaqs = data.faqs || [];
    categories = data.categories || [];
    filteredFaqs = allFaqs.filter((f) => f.category === category);
  } catch {}

  if (filteredFaqs.length === 0 && !categories.includes(category)) {
    notFound();
  }

  // Sort by sort_order
  filteredFaqs.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  // Count FAQs per category
  const catCounts: Record<string, number> = {};
  allFaqs.forEach((f) => {
    if (f.category) {
      catCounts[f.category] = (catCounts[f.category] || 0) + 1;
    }
  });

  return (
    <div className="container page page--blog">
      <div className="page__layout">
        {/* FAQ COLUMN */}
        <div>
          <h1 className="page-title">{category}</h1>
          <hr className="page-title-rule page-title-rule--blog" />

          <FAQList faqs={filteredFaqs} />
        </div>

        {/* SIDEBAR COLUMN */}
        <aside className="sidebar">
          {categories.length > 0 && (
            <div className="widget">
              <h2 className="widget__title">Categories</h2>
              <ul className="topic-list">
                {categories.map((cat) => (
                  <li key={cat}>
                    <a
                      href={`/faqs/category/${encodeURIComponent(cat)}`}
                      style={cat === category ? { fontWeight: 700 } : undefined}
                    >
                      {cat}
                      {catCounts[cat] ? ` (${catCounts[cat]})` : ""}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <BlogSidebarFormLoader settingsKey="faqs" />
        </aside>
      </div>
    </div>
  );
}

/**
 * FAQ Listing Page — SquarefloCMS Bravo Template
 * ==================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Fetches all public FAQs from the CMS and renders them in a
 * two-column layout with a sidebar (Categories + Contact form).
 */

import { cms } from "@/lib/cms";
import type { Metadata } from "next";
import EditableSection from "@/components/EditableSection";
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

export const metadata: Metadata = {
  title: "FAQs",
};

export default async function FAQsPage() {
  let faqs: FAQ[] = [];
  let categories: string[] = [];

  try {
    const data = await cms<{ faqs: FAQ[]; categories: string[]; tags: string[] }>("/faqs");
    faqs = data.faqs || [];
    categories = data.categories || [];
  } catch (err) {
    console.error("Failed to fetch FAQs:", err);
  }

  // Sort by sort_order
  faqs.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  // Count FAQs per category
  const catCounts: Record<string, number> = {};
  faqs.forEach((f) => {
    if (f.category) {
      catCounts[f.category] = (catCounts[f.category] || 0) + 1;
    }
  });

  // FAQ structured data for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer.replace(/<[^>]*>/g, ""),
      },
    })),
  };

  return (
    <EditableSection id="faqs" label="FAQs Page">
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <div className="container page page--blog">
        <div className="page__layout">
          {/* FAQ COLUMN */}
          <div>
            <h1 className="page-title">Frequently Asked Questions</h1>
            <hr className="page-title-rule page-title-rule--blog" />

            <FAQList faqs={faqs} />
          </div>

          {/* SIDEBAR COLUMN */}
          <aside className="sidebar">
            {categories.length > 0 && (
              <div className="widget">
                <h2 className="widget__title">Categories</h2>
                <ul className="topic-list">
                  {categories.map((cat) => (
                    <li key={cat}>
                      <a href={`/faqs/category/${encodeURIComponent(cat)}`}>
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
    </EditableSection>
  );
}

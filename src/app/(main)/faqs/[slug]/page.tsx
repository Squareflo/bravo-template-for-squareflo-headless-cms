/**
 * FAQ Detail Page — SquarefloCMS Bravo Template
 * ==================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Fetches a single FAQ by slug (derived from question) and renders
 * the full question and answer with sidebar form and related FAQs.
 */

import { cms } from "@/lib/cms";
import { faqSlug } from "@/lib/faq-utils";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlogSidebarFormLoader from "@/components/BlogSidebarFormLoader";
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

async function fetchAllFaqs(): Promise<{ faqs: FAQ[]; categories: string[] }> {
  try {
    const data = await cms<{ faqs: FAQ[]; categories: string[]; tags: string[] }>("/faqs");
    return { faqs: data.faqs || [], categories: data.categories || [] };
  } catch {
    return { faqs: [], categories: [] };
  }
}

function findFaqBySlug(faqs: FAQ[], slug: string): FAQ | undefined {
  return faqs.find((f) => faqSlug(f.question) === slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { faqs } = await fetchAllFaqs();
  const faq = findFaqBySlug(faqs, slug);
  if (!faq) return {};
  return {
    title: faq.question,
    description: faq.answer.replace(/<[^>]*>/g, "").slice(0, 160),
  };
}

export default async function FAQDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { faqs, categories } = await fetchAllFaqs();

  const faq = findFaqBySlug(faqs, slug);
  if (!faq) notFound();

  // Related FAQs: same category, excluding current
  const related = faq.category
    ? faqs.filter((f) => f.id !== faq.id && f.category === faq.category).slice(0, 5)
    : [];

  // Count FAQs per category
  const catCounts: Record<string, number> = {};
  faqs.forEach((f) => {
    if (f.category) {
      catCounts[f.category] = (catCounts[f.category] || 0) + 1;
    }
  });

  // FAQ structured data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer.replace(/<[^>]*>/g, ""),
        },
      },
    ],
  };

  return (
    <div className="container page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="page__layout">
        {/* FAQ CONTENT COLUMN */}
        <article>
          <h1 className="faq-detail__question">{faq.question}</h1>
          <hr className="faq-detail__rule" />

          <div
            className="faq-detail__answer"
            dangerouslySetInnerHTML={{ __html: faq.answer }}
          />

          {(faq.category || faq.tags?.length > 0) && (
            <div className="faq-detail__footer-meta">
              {faq.category && (
                <span className="faq-detail__meta-item">
                  <i className="fas fa-folder-open" />{" "}
                  <a href={`/faqs/category/${encodeURIComponent(faq.category)}`}>
                    {faq.category}
                  </a>
                </span>
              )}
              {faq.tags?.length > 0 && (
                <span className="faq-detail__meta-item">
                  <i className="fas fa-tags" />{" "}
                  {faq.tags.map((tag, i) => (
                    <span key={tag} className="faq-detail__tag">
                      {tag}
                    </span>
                  ))}
                </span>
              )}
            </div>
          )}
        </article>

        {/* SIDEBAR COLUMN */}
        <aside className="sidebar">
          {related.length > 0 && (
            <div className="widget">
              <h2 className="widget__title">Related FAQs</h2>
              <ul className="topic-list">
                {related.map((r) => (
                  <li key={r.id}>
                    <a href={`/faqs/${faqSlug(r.question)}`}>{r.question}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {categories.length > 0 && (
            <div className="widget">
              <h2 className="widget__title">Categories</h2>
              <ul className="topic-list">
                {categories.map((cat) => (
                  <li key={cat}>
                    <a
                      href={`/faqs/category/${encodeURIComponent(cat)}`}
                      style={cat === faq.category ? { fontWeight: 700 } : undefined}
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

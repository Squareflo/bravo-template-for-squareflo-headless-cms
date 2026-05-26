/**
 * FAQ List — SquarefloCMS Bravo Template
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Client component that handles pagination or infinite scroll
 * for FAQ listings based on edit mode settings.
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useEditMode } from "./EditModeProvider";
import Pagination from "./Pagination";

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

interface Props {
  faqs: FAQ[];
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export default function FAQList({ faqs }: Props) {
  const ctx = useEditMode();
  const listMode = ctx?.settings.faqs.listMode || "pagination";
  const itemsPerPage = ctx?.settings.faqs.itemsPerPage || 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Reset when settings change
  useEffect(() => {
    setCurrentPage(1);
    setVisibleCount(itemsPerPage);
  }, [listMode, itemsPerPage]);

  // Infinite scroll observer
  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + itemsPerPage, faqs.length));
  }, [itemsPerPage, faqs.length]);

  useEffect(() => {
    if (listMode !== "infinite") return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [listMode, loadMore]);

  const totalPages = Math.ceil(faqs.length / itemsPerPage);
  const displayFaqs =
    listMode === "pagination"
      ? faqs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      : faqs.slice(0, visibleCount);

  return (
    <>
      {displayFaqs.length === 0 ? (
        <p className="blog-empty">No FAQs yet. Check back soon.</p>
      ) : (
        <div className="faq-list">
          {displayFaqs.map((faq) => {
            const plainAnswer = stripHtml(faq.answer);
            const excerpt =
              plainAnswer.length > 200
                ? plainAnswer.slice(0, 200).replace(/\s+\S*$/, "") + "..."
                : plainAnswer;
            return (
              <article key={faq.id} className="faq-card">
                <h2 className="faq-card__question">
                  <a href={`/faqs/${faq.id}`}>{faq.question}</a>
                </h2>
                {excerpt && (
                  <p className="faq-card__excerpt">
                    {excerpt}{" "}
                    <a href={`/faqs/${faq.id}`} className="faq-card__more">
                      Read more
                    </a>
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}

      {listMode === "pagination" && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {listMode === "infinite" && visibleCount < faqs.length && (
        <div ref={sentinelRef} style={{ height: 1 }} />
      )}
    </>
  );
}

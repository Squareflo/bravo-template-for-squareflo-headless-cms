/**
 * Review List — SquarefloCMS Bravo Template
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Client component that handles pagination or infinite scroll
 * for review listings based on edit mode settings.
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useEditMode } from "./EditModeProvider";
import Pagination from "./Pagination";

interface Review {
  id: string;
  author_name: string;
  author_photo_url: string | null;
  rating: number;
  text: string | null;
  source: string;
  featured: boolean;
  review_time: string | null;
  created_at: string;
  user?: {
    first_name: string;
    last_name: string;
    profile_image: string | null;
  } | null;
}

interface Props {
  reviews: Review[];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderStars(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

export default function ReviewList({ reviews }: Props) {
  const ctx = useEditMode();
  const listMode = ctx?.settings.reviews?.listMode || "pagination";
  const itemsPerPage = ctx?.settings.reviews?.itemsPerPage || 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentPage(1);
    setVisibleCount(itemsPerPage);
  }, [listMode, itemsPerPage]);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + itemsPerPage, reviews.length));
  }, [itemsPerPage, reviews.length]);

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

  const totalPages = Math.ceil(reviews.length / itemsPerPage);
  const displayReviews =
    listMode === "pagination"
      ? reviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      : reviews.slice(0, visibleCount);

  return (
    <>
      {displayReviews.length === 0 ? (
        <p className="blog-empty">No reviews yet. Check back soon.</p>
      ) : (
        <div className="review-list">
          {displayReviews.map((review) => {
            const plainText = review.text || "";
            const isTruncated = plainText.length > 200;
            const excerpt = isTruncated
              ? plainText.slice(0, 200).replace(/\s+\S*$/, "") + "…"
              : plainText;
            const dateStr = review.review_time || review.created_at;
            const avatar = review.author_photo_url || review.user?.profile_image;

            return (
              <article key={review.id} className="review-card">
                <p className="review-card__text">
                  {excerpt}
                  {isTruncated && (
                    <>
                      {" "}
                      <a href={`/reviews/${review.id}`} className="review-card__more">
                        Read more
                      </a>
                    </>
                  )}
                </p>
                <div className="review-card__citation">
                  {avatar ? (
                    <img src={avatar} alt="" className="review-card__avatar" />
                  ) : (
                    <div className="review-card__avatar review-card__avatar--placeholder">
                      <i className="fas fa-user" />
                    </div>
                  )}
                  <div>
                    <div className="review-card__stars">{renderStars(review.rating)}</div>
                    <p className="review-card__name">
                      {review.author_name}
                      {review.source === "google" && (
                        <span className="review-card__source">
                          <i className="fab fa-google" /> Google
                        </span>
                      )}
                    </p>
                    {dateStr && (
                      <p className="review-card__date">{formatDate(dateStr)}</p>
                    )}
                  </div>
                </div>
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

      {listMode === "infinite" && visibleCount < reviews.length && (
        <div ref={sentinelRef} style={{ height: 1 }} />
      )}
    </>
  );
}

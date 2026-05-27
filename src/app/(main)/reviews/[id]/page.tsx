/**
 * Review Detail Page — SquarefloCMS Bravo Template
 * ==================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Fetches a single review by ID and renders the full review
 * text with author info, sidebar form, and comments.
 */

import { cms } from "@/lib/cms";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlogSidebarFormLoader from "@/components/BlogSidebarFormLoader";
import BlogComments from "@/components/BlogComments";
import "@/styles/reviews.css";

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

interface PageProps {
  params: Promise<{ id: string }>;
}

async function fetchAllReviews(): Promise<Review[]> {
  try {
    const data = await cms<{ reviews: Review[] }>("/reviews", { limit: "100" });
    return data.reviews || [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const reviews = await fetchAllReviews();
  const review = reviews.find((r) => r.id === id);
  if (!review) return {};
  return {
    title: `Review by ${review.author_name}`,
    description: review.text?.slice(0, 160) || `${review.rating}-star review by ${review.author_name}`,
  };
}

function formatDate(dateStr: string): string {
  const parsed = /^\d+$/.test(dateStr)
    ? new Date(Number(dateStr) * 1000)
    : new Date(dateStr);
  if (isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderStars(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

export default async function ReviewDetailPage({ params }: PageProps) {
  const { id } = await params;
  const reviews = await fetchAllReviews();

  const review = reviews.find((r) => r.id === id);
  if (!review) notFound();

  const dateStr = review.review_time || review.created_at;
  const avatar = review.author_photo_url || review.user?.profile_image;

  // Other reviews for sidebar-like "More Reviews" below
  const otherReviews = reviews
    .filter((r) => r.id !== review.id)
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      const dateA = a.review_time || a.created_at;
      const dateB = b.review_time || b.created_at;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    })
    .slice(0, 5);

  return (
    <div className="container page">
      <div className="page__layout">
        {/* REVIEW CONTENT COLUMN */}
        <article>
          <h1 className="review-detail__title">Review</h1>
          <hr className="review-detail__rule" />

          {review.text && (
            <p className="review-detail__text">{review.text}</p>
          )}

          <div className="review-detail__citation">
            {avatar ? (
              <img src={avatar} alt="" className="review-detail__avatar" />
            ) : (
              <div className="review-detail__avatar review-detail__avatar--placeholder">
                <i className="fas fa-user" />
              </div>
            )}
            <div>
              <div className="review-detail__stars">{renderStars(review.rating)}</div>
              <p className="review-detail__name">
                {review.author_name}
                {review.source === "google" && (
                  <span className="review-card__source">
                    <i className="fab fa-google" /> Google
                  </span>
                )}
              </p>
              {dateStr && (
                <p className="review-detail__date">{formatDate(dateStr)}</p>
              )}
            </div>
          </div>

          <div className="post-detail__comments">
            <h2 className="post-detail__comments-title">Comments</h2>
            <BlogComments postId={review.id} moduleType="review" />
          </div>
        </article>

        {/* SIDEBAR COLUMN */}
        <aside className="sidebar">
          {otherReviews.length > 0 && (
            <div className="widget">
              <h2 className="widget__title">More Reviews</h2>
              <ul className="topic-list">
                {otherReviews.map((r) => (
                  <li key={r.id}>
                    <a href={`/reviews/${r.id}`}>
                      {"★".repeat(r.rating)} — {r.author_name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <BlogSidebarFormLoader settingsKey="reviews" />
        </aside>
      </div>
    </div>
  );
}

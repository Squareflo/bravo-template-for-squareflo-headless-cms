/**
 * Reviews Listing Page — SquarefloCMS Bravo Template
 * ==================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Fetches all reviews from the CMS and renders them in a
 * two-column layout with a sidebar form.
 */

import { cms } from "@/lib/cms";
import type { Metadata } from "next";
import EditableSection from "@/components/EditableSection";
import BlogSidebarFormLoader from "@/components/BlogSidebarFormLoader";
import ReviewList from "@/components/ReviewList";
import ReviewSubmitForm from "@/components/ReviewSubmitForm";
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

export const metadata: Metadata = {
  title: "Reviews",
};

export default async function ReviewsPage() {
  let reviews: Review[] = [];

  try {
    const data = await cms<{ reviews: Review[]; total: number }>("/reviews", {
      limit: "100",
    });
    reviews = data.reviews || [];
  } catch (err) {
    console.error("Failed to fetch reviews:", err);
  }

  // Compute aggregate stats
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  // Featured reviews first, then by date descending
  reviews.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    const dateA = a.review_time || a.created_at;
    const dateB = b.review_time || b.created_at;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  // Review structured data
  const reviewSchema = totalReviews > 0 ? {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(1),
      reviewCount: totalReviews,
    },
    review: reviews.slice(0, 10).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author_name },
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
      },
      reviewBody: r.text || undefined,
    })),
  } : null;

  return (
    <EditableSection id="reviews" label="Reviews Page">
      {reviewSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
        />
      )}
      <div className="container page page--blog">
        <div className="page__layout">
          {/* REVIEWS COLUMN */}
          <div>
            <h1 className="page-title">Reviews</h1>
            <hr className="page-title-rule page-title-rule--blog" />

            <ReviewList reviews={reviews} />
          </div>

          {/* SIDEBAR COLUMN */}
          <aside className="sidebar">
            <ReviewSubmitForm />
            <BlogSidebarFormLoader settingsKey="reviews" />
          </aside>
        </div>
      </div>
    </EditableSection>
  );
}

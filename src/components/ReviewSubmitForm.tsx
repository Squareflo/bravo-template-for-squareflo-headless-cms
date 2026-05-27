/**
 * Review Submit Form — SquarefloCMS Bravo Template
 * ==================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Client component that lets signed-in users submit a review (1-5 stars + text).
 * Shows a sign-in prompt for guests. If the user already submitted a review,
 * shows their existing review with a message.
 */

"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  first_name?: string;
  last_name?: string;
}

interface ExistingReview {
  id: string;
  rating: number;
  text: string | null;
}

export default function ReviewSubmitForm() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [existingReview, setExistingReview] = useState<ExistingReview | null>(null);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          // Check if user already has a review
          return fetch("/api/reviews/me")
            .then((res) => (res.ok ? res.json() : null))
            .then((d) => {
              if (d?.review) setExistingReview(d.review);
            });
        }
      })
      .catch(() => {})
      .finally(() => setAuthLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, text: text.trim() || undefined }),
      });

      if (res.status === 409) {
        setError("You have already submitted a review.");
        setSubmitting(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to submit review.");
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <div className="widget">
        <h2 className="widget__title">Leave a Review</h2>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>Loading...</p>
      </div>
    );
  }

  // Not signed in
  if (!user) {
    return (
      <div className="widget">
        <h2 className="widget__title">Leave a Review</h2>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", lineHeight: 1.6, margin: "0 0 16px" }}>
          Sign in to share your experience and leave a review.
        </p>
        <a
          href={`/sign-in?redirect=${encodeURIComponent("/reviews")}`}
          className="review-form__signin-btn"
        >
          Sign In
        </a>
      </div>
    );
  }

  // Already submitted
  if (existingReview || submitted) {
    return (
      <div className="widget">
        <h2 className="widget__title">Leave a Review</h2>
        {submitted ? (
          <p style={{ color: "var(--color-text)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
            Thank you for your review!
          </p>
        ) : (
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
            You have already submitted a review. Thank you!
          </p>
        )}
      </div>
    );
  }

  // Show form
  return (
    <div className="widget">
      <h2 className="widget__title">Leave a Review</h2>
      <form onSubmit={handleSubmit} className="review-form">
        <div className="review-form__stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`review-form__star ${star <= (hoverRating || rating) ? "review-form__star--active" : ""}`}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              aria-label={`${star} star${star !== 1 ? "s" : ""}`}
            >
              {star <= (hoverRating || rating) ? "★" : "☆"}
            </button>
          ))}
        </div>

        <textarea
          className="review-form__textarea"
          placeholder="Tell us about your experience..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
        />

        {error && <p className="review-form__error">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="review-form__submit"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}

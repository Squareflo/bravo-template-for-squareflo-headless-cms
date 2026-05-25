/**
 * Blog Comments Section — SquarefloCMS Bravo Template
 * ====================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Client component that checks auth state and renders either:
 *   - A compose form (signed in)
 *   - A sign-in prompt card (signed out)
 *
 * Design Reference:
 *   - html-reference/blog-detail-signed-in-b6n3k8q5jw.html
 *   - html-reference/blog-detail-signed-out-b6n3k8q5jw.html
 */

"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

export default function BlogComments() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  if (user) {
    const displayName = [user.first_name, user.last_name]
      .filter(Boolean)
      .join(" ") || "you";

    return (
      <form
        className="comment-compose"
        onSubmit={(e) => {
          e.preventDefault();
          // TODO: POST comment to CMS API when available
        }}
      >
        <img
          src={user.avatar_url || "/default-avatar.svg"}
          alt="Your avatar"
          className="comment-compose__avatar"
        />
        <div>
          <textarea
            className="comment-compose__textarea"
            placeholder={`Add a comment as ${displayName}\u2026`}
            aria-label="Write a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="comment-compose__actions">
            <p className="comment-compose__hint">
              Be respectful and stay on topic.
            </p>
            <button type="submit" className="btn comment-compose__submit">
              Post Comment
            </button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div className="comment-signin">
      <div className="comment-signin__icon">
        <i className="fas fa-comments" />
      </div>
      <h3 className="comment-signin__title">Join the conversation</h3>
      <p className="comment-signin__text">
        Sign in or create a free account to leave a comment and reply to others.
      </p>
      <div className="comment-signin__actions">
        <a href="/sign-in" className="btn">
          Sign In
        </a>
        <a href="/sign-up" className="btn btn--outline">
          Create Account
        </a>
      </div>
    </div>
  );
}

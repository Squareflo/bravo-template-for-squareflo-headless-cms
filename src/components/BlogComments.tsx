/**
 * Blog Comments Section — SquarefloCMS Bravo Template
 * ====================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Client component that:
 *   1. Fetches existing comments for the blog post
 *   2. Checks auth state and shows compose form (signed in) or sign-in prompt (signed out)
 *   3. Posts new comments via /api/comments proxy
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
  profile_image?: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: {
    first_name: string | null;
    last_name: string | null;
    profile_image: string | null;
  };
}

interface Props {
  postId: string;
}

export default function BlogComments({ postId }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch auth + comments in parallel
    Promise.all([
      fetch("/api/auth/me")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.user) setUser(data.user);
        })
        .catch(() => {}),
      fetch(`/api/comments?module_type=blog&module_item_id=${postId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.comments) setComments(data.comments);
        })
        .catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [postId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim() || posting) return;

    setPosting(true);
    setError("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module_type: "blog",
          module_item_id: postId,
          content: comment.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to post comment");
        return;
      }

      // Add the new comment to the list
      const newComment: Comment = {
        id: data.comment.id,
        content: data.comment.content,
        created_at: data.comment.created_at,
        user: {
          first_name: user?.first_name || null,
          last_name: user?.last_name || null,
          profile_image: user?.avatar_url || user?.profile_image || null,
        },
      };

      if (data.comment.moderation_status === "approved") {
        setComments((prev) => [...prev, newComment]);
      }

      setComment("");

      if (data.comment.moderation_status === "pending_review") {
        setError("Your comment has been submitted and is pending review.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPosting(false);
    }
  }

  if (loading) return null;

  const displayName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(" ") || "you"
    : "";

  return (
    <>
      {comments.length > 0 && (
        <>
          <p className="post-detail__comments-count">
            {comments.length} comment{comments.length !== 1 ? "s" : ""}
          </p>
          <ul className="comment-list">
            {comments.map((c) => {
              const name = [c.user.first_name, c.user.last_name]
                .filter(Boolean)
                .join(" ") || "Anonymous";
              const date = new Date(c.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              return (
                <li key={c.id}>
                  <div className="comment">
                    {c.user.profile_image ? (
                      <img
                        src={c.user.profile_image}
                        alt=""
                        className="comment__avatar"
                      />
                    ) : (
                      <div className="comment__avatar comment__avatar--placeholder">
                        <i className="fas fa-user" />
                      </div>
                    )}
                    <div className="comment__body">
                      <div className="comment__header">
                        <span className="comment__author">{name}</span>
                        <span className="comment__time">{date}</span>
                      </div>
                      <p className="comment__text">{c.content}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {user ? (
        <form className="comment-compose" onSubmit={handleSubmit}>
          {user.avatar_url || user.profile_image ? (
            <img
              src={user.avatar_url || user.profile_image}
              alt="Your avatar"
              className="comment-compose__avatar"
            />
          ) : (
            <div className="comment-compose__avatar comment-compose__avatar--placeholder">
              <i className="fas fa-user" />
            </div>
          )}
          <div>
            <textarea
              className="comment-compose__textarea"
              placeholder={`Add a comment as ${displayName}\u2026`}
              aria-label="Write a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={posting}
            />
            {error && <p className="comment-compose__error">{error}</p>}
            <div className="comment-compose__actions">
              <p className="comment-compose__hint">
                Be respectful and stay on topic.
              </p>
              <button
                type="submit"
                className="btn comment-compose__submit"
                disabled={posting || !comment.trim()}
              >
                {posting ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="comment-signin">
          <div className="comment-signin__icon">
            <i className="fas fa-comments" />
          </div>
          <h3 className="comment-signin__title">Join the conversation</h3>
          <p className="comment-signin__text">
            Sign in or create a free account to leave a comment and reply to
            others.
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
      )}
    </>
  );
}

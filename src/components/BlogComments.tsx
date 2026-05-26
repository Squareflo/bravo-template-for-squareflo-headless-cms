/**
 * Blog Comments Section — SquarefloCMS Bravo Template
 * ====================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Client component that:
 *   1. Fetches existing comments (with likes_count, parent_id, replies)
 *   2. Checks auth state and shows compose form or sign-in prompt
 *   3. Supports liking (auth + guest via fingerprint), replying, and threading
 *
 * Design Reference:
 *   - html-reference/blog-detail-signed-in-b6n3k8q5jw.html
 */

"use client";

import { useEffect, useState, useCallback } from "react";

interface User {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  profile_image?: string;
  role?: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  likes_count: number;
  parent_id: string | null;
  user: {
    id?: string;
    first_name: string | null;
    last_name: string | null;
    profile_image: string | null;
    role?: string;
  };
}

interface Props {
  postId: string;
}

function getGuestId(): string {
  const key = "sqf_guest_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years !== 1 ? "s" : ""} ago`;
}

function isAuthorRole(role?: string): boolean {
  return role === "owner" || role === "webmaster" || role === "editor";
}

export default function BlogComments({ postId }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [postingReply, setPostingReply] = useState(false);
  const [replyError, setReplyError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.user) setUser(data.user);
        })
        .catch(() => {}),
      fetch(`/api/comments?module_type=blog&module_item_id=${postId}&sort=newest`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.comments) setComments(data.comments);
        })
        .catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [postId]);

  const handleDelete = useCallback(async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;

    // Optimistic removal (including any replies to this comment)
    const prev = comments;
    setComments((c) => c.filter((x) => x.id !== commentId && x.parent_id !== commentId));

    try {
      const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        setComments(prev);
      }
    } catch {
      setComments(prev);
    }
  }, [comments]);

  const handleLike = useCallback(async (commentId: string) => {
    const alreadyLiked = likedIds.has(commentId);
    const method = alreadyLiked ? "DELETE" : "POST";

    // Optimistic update
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (alreadyLiked) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, likes_count: c.likes_count + (alreadyLiked ? -1 : 1) }
          : c,
      ),
    );

    try {
      const body: any = {};
      if (!user) body.guest_id = getGuestId();

      await fetch(`/api/comments/${commentId}/like`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch {
      // Revert on failure
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (alreadyLiked) next.add(commentId);
        else next.delete(commentId);
        return next;
      });
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, likes_count: c.likes_count + (alreadyLiked ? 1 : -1) }
            : c,
        ),
      );
    }
  }, [likedIds, user]);

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

      const newComment: Comment = {
        id: data.comment.id,
        content: data.comment.content,
        created_at: data.comment.created_at,
        likes_count: 0,
        parent_id: null,
        user: {
          id: user?.id,
          first_name: user?.first_name || null,
          last_name: user?.last_name || null,
          profile_image: user?.avatar_url || user?.profile_image || null,
          role: user?.role,
        },
      };

      if (data.comment.moderation_status === "approved") {
        setComments((prev) => [newComment, ...prev]);
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

  async function handleReplySubmit(parentId: string) {
    if (!replyText.trim() || postingReply) return;

    setPostingReply(true);
    setReplyError("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module_type: "blog",
          module_item_id: postId,
          content: replyText.trim(),
          parent_id: parentId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setReplyError(data.error || "Failed to post reply");
        return;
      }

      const newReply: Comment = {
        id: data.comment.id,
        content: data.comment.content,
        created_at: data.comment.created_at,
        likes_count: 0,
        parent_id: parentId,
        user: {
          id: user?.id,
          first_name: user?.first_name || null,
          last_name: user?.last_name || null,
          profile_image: user?.avatar_url || user?.profile_image || null,
          role: user?.role,
        },
      };

      if (data.comment.moderation_status === "approved") {
        setComments((prev) => [...prev, newReply]);
      }

      setReplyText("");
      setReplyingTo(null);

      if (data.comment.moderation_status === "pending_review") {
        setReplyError("Your reply has been submitted and is pending review.");
      }
    } catch {
      setReplyError("Something went wrong. Please try again.");
    } finally {
      setPostingReply(false);
    }
  }

  if (loading) return null;

  const displayName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(" ") || "you"
    : "";

  // Separate top-level comments from replies
  const topLevel = comments.filter((c) => !c.parent_id);
  const repliesByParent: Record<string, Comment[]> = {};
  comments.forEach((c) => {
    if (c.parent_id) {
      if (!repliesByParent[c.parent_id]) repliesByParent[c.parent_id] = [];
      repliesByParent[c.parent_id].push(c);
    }
  });

  function renderComment(c: Comment, isReply = false) {
    const name =
      [c.user.first_name, c.user.last_name].filter(Boolean).join(" ") ||
      "Anonymous";
    const liked = likedIds.has(c.id);
    const replies = repliesByParent[c.id] || [];
    const showAuthorBadge = isAuthorRole(c.user.role);

    return (
      <li key={c.id}>
        <div className="comment">
          {c.user.profile_image ? (
            <img src={c.user.profile_image} alt="" className="comment__avatar" />
          ) : (
            <div className="comment__avatar comment__avatar--placeholder">
              <i className="fas fa-user" />
            </div>
          )}
          <div className="comment__body">
            <div className="comment__header">
              <span
                className={`comment__author${showAuthorBadge ? " comment__author--admin" : ""}`}
              >
                {name}
              </span>
              <span className="comment__time">{timeAgo(c.created_at)}</span>
            </div>
            <p className="comment__text">{c.content}</p>
            <div className="comment__actions">
              <button
                type="button"
                className={`comment__action${liked ? " comment__action--liked" : ""}`}
                onClick={() => handleLike(c.id)}
                aria-label={liked ? "Unlike" : "Like"}
              >
                <i className={liked ? "fas fa-heart" : "far fa-heart"} />
                {c.likes_count > 0 && <span>{c.likes_count}</span>}
              </button>
              {user && (
                <button
                  type="button"
                  className="comment__action"
                  onClick={() => {
                    if (replyingTo === c.id) {
                      setReplyingTo(null);
                      setReplyText("");
                      setReplyError("");
                    } else {
                      setReplyingTo(c.id);
                      setReplyText("");
                      setReplyError("");
                    }
                  }}
                >
                  <i className="far fa-comment" />
                  <span>Reply</span>
                </button>
              )}
              {user && c.user.id === user.id && (
                <button
                  type="button"
                  className="comment__action comment__action--delete"
                  onClick={() => handleDelete(c.id)}
                  aria-label="Delete comment"
                >
                  <i className="far fa-trash-alt" />
                </button>
              )}
            </div>

            {/* Inline reply form */}
            {replyingTo === c.id && user && (
              <div className="comment-reply-form">
                <textarea
                  className="comment-reply-form__textarea"
                  placeholder={`Reply to ${[c.user.first_name].filter(Boolean).join("") || "this comment"}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  disabled={postingReply}
                />
                {replyError && (
                  <p className="comment-compose__error">{replyError}</p>
                )}
                <div className="comment-reply-form__actions">
                  <button
                    type="button"
                    className="comment-reply-form__cancel"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyText("");
                      setReplyError("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn comment-reply-form__submit"
                    disabled={postingReply || !replyText.trim()}
                    onClick={() => handleReplySubmit(c.id)}
                  >
                    {postingReply ? "Posting..." : "Reply"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Nested replies */}
        {replies.length > 0 && (
          <ul className="comment-replies">
            {replies.map((r) => renderComment(r, true))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <>
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

      {topLevel.length > 0 && (
        <>
          <p className="post-detail__comments-count">
            {comments.length} comment{comments.length !== 1 ? "s" : ""}
          </p>
          <ul className="comment-list">
            {topLevel.map((c) => renderComment(c))}
          </ul>
        </>
      )}
    </>
  );
}

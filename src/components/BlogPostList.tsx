/**
 * Blog Post List — SquarefloCMS Bravo Template
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Client wrapper that handles pagination or infinite scroll
 * for blog post listings based on edit mode settings.
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useEditMode } from "./EditModeProvider";
import Pagination from "./Pagination";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  thumbnail_image: string | null;
  cover_image: string | null;
  first_paragraph: string | null;
  short_summary: string | null;
  published_at: string;
  categories: { id: string; name: string; slug: string }[];
  tags: { id: string; name: string; slug: string }[];
}

interface Props {
  posts: BlogPost[];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogPostList({ posts }: Props) {
  const ctx = useEditMode();
  const listMode = ctx?.settings.blog.listMode || "pagination";
  const itemsPerPage = ctx?.settings.blog.itemsPerPage || 6;

  const [currentPage, setCurrentPage] = useState(1);
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Reset page when settings change
  useEffect(() => {
    setCurrentPage(1);
    setVisibleCount(itemsPerPage);
  }, [listMode, itemsPerPage]);

  // Infinite scroll observer
  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + itemsPerPage, posts.length));
  }, [itemsPerPage, posts.length]);

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

  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const displayPosts =
    listMode === "pagination"
      ? posts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      : posts.slice(0, visibleCount);

  return (
    <>
      {displayPosts.length === 0 ? (
        <p className="blog-empty">No blog posts yet. Check back soon.</p>
      ) : (
        <div className="post-list">
          {displayPosts.map((post) => {
            const thumb = post.thumbnail_image || post.cover_image;
            const excerpt = post.short_summary || post.first_paragraph;
            return (
              <article
                key={post.id}
                className={`post-card${thumb ? "" : " post-card--no-thumb"}`}
              >
                {thumb && (
                  <a href={`/blog/${post.slug}`}>
                    <img src={thumb} alt="" className="post-card__thumb" />
                  </a>
                )}
                <div className="post-card__body">
                  <h2 className="post-card__title">
                    <a href={`/blog/${post.slug}`}>{post.title}</a>
                  </h2>
                  <div className="post-card__meta">
                    {post.published_at && (
                      <span className="post-card__meta-item">
                        <i className="far fa-calendar-alt" />{" "}
                        {formatDate(post.published_at)}
                      </span>
                    )}
                    {post.categories?.length > 0 && (
                      <span className="post-card__meta-item">
                        <i className="fas fa-folder-open" /> Posted in{" "}
                        {post.categories.map((cat, i) => (
                          <span key={cat.id}>
                            {i > 0 && " / "}
                            {cat.name}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>
                  {excerpt && (
                    <p className="post-card__excerpt">
                      {excerpt.length > 280
                        ? excerpt.slice(0, 280).replace(/\s+\S*$/, "") + "..."
                        : excerpt}
                    </p>
                  )}
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

      {listMode === "infinite" && visibleCount < posts.length && (
        <div ref={sentinelRef} style={{ height: 1 }} />
      )}
    </>
  );
}

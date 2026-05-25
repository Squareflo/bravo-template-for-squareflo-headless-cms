/**
 * Blog Listing Page — SquarefloCMS Bravo Template
 * ==================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Fetches all published blog posts from the CMS and renders them
 * in a two-column layout with a sidebar.
 *
 * Design Reference:
 *   - html-reference/blog-b6n3k8q5jw.html
 */

import { cms } from "@/lib/cms";
import type { Metadata } from "next";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  published_at: string;
  categories: { id: string; name: string; slug: string }[];
  tags: { id: string; name: string; slug: string }[];
}

export const metadata: Metadata = {
  title: "Blog",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPage() {
  let posts: BlogPost[] = [];

  try {
    const data = await cms<{ posts: BlogPost[] } | BlogPost[]>("/blog");
    posts = Array.isArray(data) ? data : data.posts || [];
  } catch (e) {
    console.error("Failed to fetch blog posts:", e);
  }

  return (
    <div className="container page">
      <div className="page__layout">
        {/* POSTS COLUMN */}
        <div>
          <h1 className="page-title">The Latest</h1>
          <hr className="page-title-rule" />

          {posts.length === 0 ? (
            <p className="blog-empty">No blog posts yet. Check back soon.</p>
          ) : (
            <div className="post-list">
              {posts.map((post) => (
                <article key={post.id} className="post-card">
                  {post.featured_image && (
                    <a href={`/blog/${post.slug}`}>
                      <img
                        src={post.featured_image}
                        alt=""
                        className="post-card__thumb"
                      />
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
                          <i className="fas fa-tag" /> Posted in{" "}
                          {post.categories.map((cat, i) => (
                            <span key={cat.id}>
                              {i > 0 && " / "}
                              {cat.name}
                            </span>
                          ))}
                        </span>
                      )}
                    </div>
                    {post.excerpt && (
                      <p className="post-card__excerpt">{post.excerpt}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* SIDEBAR COLUMN */}
        <aside className="sidebar">
          <RecentPostsWidget posts={posts.slice(0, 3)} />
        </aside>
      </div>
    </div>
  );
}

function RecentPostsWidget({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;
  return (
    <div className="widget">
      <h2 className="widget__title">Recent Posts</h2>
      <div className="recent-post-list">
        {posts.map((post) => (
          <div key={post.id} className="recent-post">
            {post.featured_image && (
              <a href={`/blog/${post.slug}`}>
                <img
                  src={post.featured_image}
                  alt=""
                  className="recent-post__thumb"
                />
              </a>
            )}
            <div>
              <h3 className="recent-post__title">
                <a href={`/blog/${post.slug}`}>{post.title}</a>
              </h3>
              {post.published_at && (
                <span className="recent-post__date">
                  <i className="far fa-calendar-alt" />{" "}
                  {formatDate(post.published_at)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

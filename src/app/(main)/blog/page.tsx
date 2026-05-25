/**
 * Blog Listing Page — SquarefloCMS Bravo Template
 * ==================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Fetches all published blog posts from the CMS and renders them
 * in a two-column layout with a sidebar (Topics + Contact form).
 *
 * Design Reference:
 *   - html-reference/blog-b6n3k8q5jw.html
 */

import { cms } from "@/lib/cms";
import { SiteSettings } from "@/lib/types";
import type { Metadata } from "next";
import BlogSidebarContact from "@/components/BlogSidebarContact";

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

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
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
  let categories: BlogCategory[] = [];
  let settings: SiteSettings | null = null;

  const [postsResult, categoriesResult, settingsResult] = await Promise.allSettled([
    cms<{ posts: BlogPost[] }>("/blog"),
    cms<{ categories: BlogCategory[] }>("/blog/categories"),
    cms<SiteSettings>("/settings"),
  ]);

  if (postsResult.status === "fulfilled") {
    const data = postsResult.value;
    posts = Array.isArray(data) ? data : (data as any).posts || [];
  }
  if (categoriesResult.status === "fulfilled") {
    categories = (categoriesResult.value as any).categories || [];
  }
  if (settingsResult.status === "fulfilled") {
    settings = settingsResult.value;
  }

  // Count posts per category
  const catCounts: Record<string, number> = {};
  posts.forEach((p) =>
    p.categories?.forEach((c) => {
      catCounts[c.slug] = (catCounts[c.slug] || 0) + 1;
    })
  );

  const locations = settings?.business?.locations || [];

  return (
    <div className="container page">
      <div className="page__layout">
        {/* POSTS COLUMN */}
        <div>
          <h1 className="page-title">The Latest</h1>
          <hr className="page-title-rule page-title-rule--blog" />

          {posts.length === 0 ? (
            <p className="blog-empty">No blog posts yet. Check back soon.</p>
          ) : (
            <div className="post-list">
              {posts.map((post) => {
                const thumb = post.thumbnail_image || post.cover_image;
                const excerpt = post.short_summary || post.first_paragraph;
                return (
                  <article key={post.id} className={`post-card${thumb ? "" : " post-card--no-thumb"}`}>
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
        </div>

        {/* SIDEBAR COLUMN */}
        <aside className="sidebar">
          {categories.length > 0 && (
            <div className="widget">
              <h2 className="widget__title">Topics</h2>
              <ul className="topic-list">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <a href={`/blog/category/${cat.slug}`}>
                      {cat.name}
                      {catCounts[cat.slug] ? ` (${catCounts[cat.slug]})` : ""}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="widget widget--contact">
            <h2 className="widget__title">Contact Us</h2>
            <BlogSidebarContact locations={locations} />
          </div>
        </aside>
      </div>
    </div>
  );
}

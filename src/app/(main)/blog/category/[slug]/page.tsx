/**
 * Blog Category Page — SquarefloCMS Bravo Template
 * ==================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Shows all blog posts in a given category, using the same layout
 * as the main blog listing page with sidebar (Topics + Contact Us).
 *
 * Design Reference:
 *   - html-reference/blog-b6n3k8q5jw.html (same layout as blog index)
 */

import { cms } from "@/lib/cms";
import { SiteSettings } from "@/lib/types";
import { notFound } from "next/navigation";
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
  meta_title?: string;
  meta_description?: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const catData = await cms<{ categories: BlogCategory[] }>("/blog/categories");
    const cat = catData.categories.find((c) => c.slug === slug);
    if (!cat) return {};
    return {
      title: cat.meta_title || cat.name,
      description: cat.meta_description || `Browse all posts in ${cat.name}`,
    };
  } catch {
    return {};
  }
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogCategoryPage({ params }: PageProps) {
  const { slug } = await params;

  let posts: BlogPost[] = [];
  let allPosts: BlogPost[] = [];
  let categories: BlogCategory[] = [];
  let settings: SiteSettings | null = null;
  let currentCategory: BlogCategory | null = null;

  const [filteredResult, allPostsResult, categoriesResult, settingsResult, formResult] =
    await Promise.allSettled([
      cms<{ posts: BlogPost[] }>("/blog", { category: slug }),
      cms<{ posts: BlogPost[] }>("/blog"),
      cms<{ categories: BlogCategory[] }>("/blog/categories"),
      cms<SiteSettings>("/settings"),
      cms<{ form: any }>("/forms/contact-us"),
    ]);

  if (filteredResult.status === "fulfilled") {
    posts = (filteredResult.value as any).posts || [];
  }
  if (allPostsResult.status === "fulfilled") {
    allPosts = (allPostsResult.value as any).posts || [];
  }
  if (categoriesResult.status === "fulfilled") {
    categories = (categoriesResult.value as any).categories || [];
  }
  if (settingsResult.status === "fulfilled") {
    settings = settingsResult.value;
  }
  const contactForm = formResult.status === "fulfilled"
    ? (formResult.value as any).form || null
    : null;

  currentCategory = categories.find((c) => c.slug === slug) || null;
  if (!currentCategory) notFound();

  // Count posts per category from all posts
  const catCounts: Record<string, number> = {};
  allPosts.forEach((p) =>
    p.categories?.forEach((c) => {
      catCounts[c.slug] = (catCounts[c.slug] || 0) + 1;
    })
  );

  return (
    <div className="container page page--blog">
      <div className="page__layout">
        {/* POSTS COLUMN */}
        <div>
          <h1 className="page-title">{currentCategory.name}</h1>
          <hr className="page-title-rule page-title-rule--blog" />

          {posts.length === 0 ? (
            <p className="blog-empty">
              No posts in this category yet. Check back soon.
            </p>
          ) : (
            <div className="post-list">
              {posts.map((post) => {
                const thumb = post.thumbnail_image || post.cover_image;
                const excerpt = post.short_summary || post.first_paragraph;
                return (
                  <article
                    key={post.id}
                    className={`post-card${thumb ? "" : " post-card--no-thumb"}`}
                  >
                    {thumb && (
                      <a href={`/blog/${post.slug}`}>
                        <img
                          src={thumb}
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
                            ? excerpt.slice(0, 280).replace(/\s+\S*$/, "") +
                              "..."
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
                    <a
                      href={`/blog/category/${cat.slug}`}
                      style={
                        cat.slug === slug
                          ? { fontWeight: 700 }
                          : undefined
                      }
                    >
                      {cat.name}
                      {catCounts[cat.slug] ? ` (${catCounts[cat.slug]})` : ""}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <BlogSidebarContact form={contactForm} />
        </aside>
      </div>
    </div>
  );
}

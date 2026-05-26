/**
 * Blog Tag Page — SquarefloCMS Bravo Template
 * ==================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Shows all blog posts with a given tag, using the same layout
 * as the main blog listing page with sidebar (Topics + Contact Us).
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
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tagName = slug.replace(/-/g, " ");
  return {
    title: `Posts tagged "${tagName}"`,
    description: `Browse all posts tagged with ${tagName}`,
  };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogTagPage({ params }: PageProps) {
  const { slug } = await params;

  let allPosts: BlogPost[] = [];
  let categories: BlogCategory[] = [];
  let settings: SiteSettings | null = null;

  const [postsResult, categoriesResult, settingsResult] =
    await Promise.allSettled([
      cms<{ posts: BlogPost[] }>("/blog", { tag: slug }),
      cms<{ categories: BlogCategory[] }>("/blog/categories"),
      cms<SiteSettings>("/settings"),
    ]);

  let posts: BlogPost[] = [];
  if (postsResult.status === "fulfilled") {
    posts = (postsResult.value as any).posts || [];
  }

  // If the API doesn't support tag filtering, fall back to client-side filter
  if (postsResult.status === "rejected" || posts.length === 0) {
    const allResult = await cms<{ posts: BlogPost[] }>("/blog").catch(() => null);
    if (allResult) {
      allPosts = (allResult as any).posts || [];
      posts = allPosts.filter((p) =>
        p.tags?.some((t) => t.slug === slug)
      );
    }
  } else {
    // Still fetch all posts for category counts
    const allResult = await cms<{ posts: BlogPost[] }>("/blog").catch(() => null);
    if (allResult) {
      allPosts = (allResult as any).posts || [];
    }
  }

  if (categoriesResult.status === "fulfilled") {
    categories = (categoriesResult.value as any).categories || [];
  }
  if (settingsResult.status === "fulfilled") {
    settings = settingsResult.value;
  }

  // Find the tag name from the first post that has it
  let tagName = slug.replace(/-/g, " ");
  for (const p of posts) {
    const match = p.tags?.find((t) => t.slug === slug);
    if (match) {
      tagName = match.name;
      break;
    }
  }

  if (posts.length === 0) notFound();

  // Count posts per category from all posts
  const catCounts: Record<string, number> = {};
  (allPosts.length > 0 ? allPosts : posts).forEach((p) =>
    p.categories?.forEach((c) => {
      catCounts[c.slug] = (catCounts[c.slug] || 0) + 1;
    })
  );

  const locations = settings?.business?.locations || [];

  return (
    <div className="container page page--blog">
      <div className="page__layout">
        {/* POSTS COLUMN */}
        <div>
          <h1 className="page-title">Tagged: {tagName}</h1>
          <hr className="page-title-rule page-title-rule--blog" />

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

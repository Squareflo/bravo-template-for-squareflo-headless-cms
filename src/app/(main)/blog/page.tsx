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
import EditableSection from "@/components/EditableSection";
import BlogSidebarFormLoader from "@/components/BlogSidebarFormLoader";
import BlogPostList from "@/components/BlogPostList";

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

  return (
    <EditableSection id="blog" label="Blog Page">
    <div className="container page page--blog">
      <div className="page__layout">
        {/* POSTS COLUMN */}
        <div>
          <h1 className="page-title">The Latest</h1>
          <hr className="page-title-rule page-title-rule--blog" />

          <BlogPostList posts={posts} />
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

          <BlogSidebarFormLoader settingsKey="blog" />
        </aside>
      </div>
    </div>
    </EditableSection>
  );
}

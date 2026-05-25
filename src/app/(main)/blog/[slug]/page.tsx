/**
 * Blog Detail Page — SquarefloCMS Bravo Template
 * ==================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Fetches a single blog post by slug and renders the full article
 * with title, meta, share buttons, hero image, body, and comments section.
 *
 * Design Reference:
 *   - html-reference/blog-detail-signed-out-b6n3k8q5jw.html
 *   - html-reference/blog-detail-signed-in-b6n3k8q5jw.html
 */

import { cms } from "@/lib/cms";
import { SiteSettings } from "@/lib/types";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlogSidebarContact from "@/components/BlogSidebarContact";

interface BlogPostBlock {
  id: string;
  type: string;
  text?: string;
  url?: string;
  alt?: string;
  level?: number;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  thumbnail_image: string | null;
  cover_image: string | null;
  first_paragraph: string | null;
  short_summary: string | null;
  body: string | BlogPostBlock[];
  published_at: string;
  categories: { id: string; name: string; slug: string }[];
  tags: { id: string; name: string; slug: string }[];
  meta?: {
    title?: string;
    description?: string;
    og_image?: string;
  };
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
  try {
    const data = await cms<{ post: BlogPost }>(`/blog/${slug}`);
    const post = data.post;
    return {
      title: post.meta?.title || post.title,
      description: post.meta?.description || post.first_paragraph || undefined,
      ...(post.meta?.og_image && { openGraph: { images: [post.meta.og_image] } }),
      ...(post.cover_image && !post.meta?.og_image && {
        openGraph: { images: [post.cover_image] },
      }),
    };
  } catch {
    return {};
  }
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function renderBody(body: string | BlogPostBlock[]) {
  if (typeof body === "string") {
    return <div className="post-detail__body" dangerouslySetInnerHTML={{ __html: body }} />;
  }

  return (
    <div className="post-detail__body">
      {body.map((block) => {
        switch (block.type) {
          case "heading":
            return <h2 key={block.id}>{block.text}</h2>;
          case "paragraph":
            return <p key={block.id}>{block.text}</p>;
          case "image":
            return (
              <img
                key={block.id}
                src={block.url || block.text || ""}
                alt={block.alt || ""}
              />
            );
          default:
            return block.text ? <p key={block.id}>{block.text}</p> : null;
        }
      })}
    </div>
  );
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let post: BlogPost;
  let recentPosts: BlogPost[] = [];
  let categories: BlogCategory[] = [];
  let settings: SiteSettings | null = null;

  try {
    const data = await cms<{ post: BlogPost }>(`/blog/${slug}`);
    post = data.post;
  } catch {
    notFound();
  }

  if (!post!) notFound();

  // Fetch sidebar data in parallel
  const [listResult, catResult, settingsResult] = await Promise.allSettled([
    cms<{ posts: BlogPost[] }>("/blog"),
    cms<{ categories: BlogCategory[] }>("/blog/categories"),
    cms<SiteSettings>("/settings"),
  ]);

  if (listResult.status === "fulfilled") {
    const allPosts = (listResult.value as any).posts || [];
    recentPosts = allPosts.filter((p: BlogPost) => p.slug !== slug).slice(0, 3);
  }
  if (catResult.status === "fulfilled") {
    categories = (catResult.value as any).categories || [];
  }
  if (settingsResult.status === "fulfilled") {
    settings = settingsResult.value;
  }

  const heroImage = post.cover_image || post.thumbnail_image;
  const locations = settings?.business?.locations || [];

  // Count posts per category from all posts
  const allPosts = listResult.status === "fulfilled"
    ? ((listResult.value as any).posts || []) as BlogPost[]
    : [];
  const catCounts: Record<string, number> = {};
  allPosts.forEach((p) =>
    p.categories?.forEach((c) => {
      catCounts[c.slug] = (catCounts[c.slug] || 0) + 1;
    })
  );

  return (
    <div className="container page">
      <div className="page__layout">
        {/* POST CONTENT COLUMN */}
        <article>
          <h1 className="post-detail__title">{post.title}</h1>
          <hr className="post-detail__rule" />

          <div className="post-detail__meta">
            {post.published_at && (
              <span className="post-detail__meta-item">
                <i className="far fa-calendar-alt" />{" "}
                {formatDate(post.published_at)}
              </span>
            )}
            {post.categories?.length > 0 && (
              <span className="post-detail__meta-item">
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

          <div className="post-detail__share">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`/blog/${slug}`)}`}
              className="share-btn share-btn--facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook-f" /> Share
            </a>
          </div>

          {heroImage && (
            <img src={heroImage} alt="" className="post-detail__hero" />
          )}

          {renderBody(post.body)}

          {/* Comments section — placeholder until CMS comments table is ready */}
          <div className="post-detail__comments">
            <h2 className="post-detail__comments-title">Comments</h2>
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
          </div>
        </article>

        {/* SIDEBAR COLUMN */}
        <aside className="sidebar">
          {recentPosts.length > 0 && (
            <div className="widget">
              <h2 className="widget__title">Recent Posts</h2>
              <div className="recent-post-list">
                {recentPosts.map((rp) => {
                  const rpThumb = rp.thumbnail_image || rp.cover_image;
                  return (
                    <div key={rp.id} className="recent-post">
                      {rpThumb && (
                        <a href={`/blog/${rp.slug}`}>
                          <img
                            src={rpThumb}
                            alt=""
                            className="recent-post__thumb"
                          />
                        </a>
                      )}
                      <div>
                        <h3 className="recent-post__title">
                          <a href={`/blog/${rp.slug}`}>{rp.title}</a>
                        </h3>
                        {rp.published_at && (
                          <span className="recent-post__date">
                            <i className="far fa-calendar-alt" />{" "}
                            {formatDateShort(rp.published_at)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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

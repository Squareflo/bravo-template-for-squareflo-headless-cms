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
 */

import { cms } from "@/lib/cms";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  featured_image: string | null;
  published_at: string;
  categories: { id: string; name: string; slug: string }[];
  tags: { id: string; name: string; slug: string }[];
  meta?: {
    title?: string;
    description?: string;
    og_image?: string;
  };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await cms<{ post: BlogPost } | BlogPost>(`/blog/${slug}`);
    const post = "post" in data ? data.post : data;
    return {
      title: post.meta?.title || post.title,
      description: post.meta?.description || post.excerpt || undefined,
      ...(post.meta?.og_image && { openGraph: { images: [post.meta.og_image] } }),
      ...(post.featured_image && !post.meta?.og_image && {
        openGraph: { images: [post.featured_image] },
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

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let post: BlogPost;
  let recentPosts: BlogPost[] = [];

  try {
    const data = await cms<{ post: BlogPost } | BlogPost>(`/blog/${slug}`);
    post = "post" in data ? data.post : data;
  } catch {
    notFound();
  }

  if (!post!) notFound();

  // Fetch recent posts for sidebar
  try {
    const listData = await cms<{ posts: BlogPost[] } | BlogPost[]>("/blog");
    const allPosts = Array.isArray(listData) ? listData : listData.posts || [];
    recentPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 3);
  } catch {
    // Sidebar is optional, don't fail the page
  }

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

          <div className="post-detail__share">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`/blog/${slug}`)}`}
              className="share-btn share-btn--facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook-f" /> Share
            </a>
            <button
              className="share-btn share-btn--generic"
              onClick={undefined}
              type="button"
            >
              <i className="fas fa-share-alt" /> Share
            </button>
          </div>

          {post.featured_image && (
            <img
              src={post.featured_image}
              alt=""
              className="post-detail__hero"
            />
          )}

          <div
            className="post-detail__body"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />

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
                {recentPosts.map((rp) => (
                  <div key={rp.id} className="recent-post">
                    {rp.featured_image && (
                      <a href={`/blog/${rp.slug}`}>
                        <img
                          src={rp.featured_image}
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
                          {formatDate(rp.published_at)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

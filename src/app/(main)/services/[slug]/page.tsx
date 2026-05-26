/**
 * Service Detail Page — SquarefloCMS Bravo Template
 * ==================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Fetches a single service feed entry by slug and renders the full
 * detail with title, hero image, body content, inline quote form,
 * and a Related Services sidebar.
 *
 * Design Reference:
 *   - html-reference/service-detail-b6n3k8q5jw.html
 */

import { cms } from "@/lib/cms";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlogSidebarFormLoader from "@/components/BlogSidebarFormLoader";

interface ContentBlock {
  id: string;
  type: string;
  text?: string;
  url?: string;
  src?: string;
  alt?: string;
  level?: number;
}

interface FeedEntry {
  id: string;
  title: string;
  slug: string;
  status: string;
  module_id: string;
  data: {
    thumbnail?: string;
    main_image?: string;
    h1_heading?: string;
    first_paragraph?: string;
    service_name?: string;
    short_summary?: string;
    additional_content?: ContentBlock[];
    [key: string]: any;
  };
  meta?: {
    title?: string;
    description?: string;
  };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function fetchServiceBySlug(slug: string) {
  const data = await cms<{ entries: FeedEntry[] }>("/feed-entries", {
    module: "services",
  });
  const entries = data.entries || [];
  const entry = entries.find((e) => e.slug === slug) || null;
  return { entry, allEntries: entries };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { entry } = await fetchServiceBySlug(slug);
    if (!entry) return {};
    const title =
      entry.meta?.title ||
      entry.data.h1_heading ||
      entry.data.service_name ||
      entry.title;
    const description =
      entry.meta?.description ||
      entry.data.short_summary ||
      entry.data.first_paragraph ||
      undefined;
    return { title, description };
  } catch {
    return {};
  }
}

function renderBody(
  firstParagraph: string | null | undefined,
  blocks: ContentBlock[] | undefined
) {
  return (
    <div className="service-detail__body">
      {firstParagraph && (
        <div dangerouslySetInnerHTML={{ __html: firstParagraph }} />
      )}
      {blocks?.map((block) => {
        switch (block.type) {
          case "heading":
            return <h2 key={block.id}>{block.text}</h2>;
          case "paragraph":
            return block.text ? (
              <div
                key={block.id}
                dangerouslySetInnerHTML={{ __html: block.text }}
              />
            ) : null;
          case "image":
            return (
              <img
                key={block.id}
                src={block.src || block.url || block.text || ""}
                alt={block.alt || ""}
              />
            );
          default:
            return block.text ? (
              <div
                key={block.id}
                dangerouslySetInnerHTML={{ __html: block.text }}
              />
            ) : null;
        }
      })}
    </div>
  );
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let entry: FeedEntry | null = null;
  let allEntries: FeedEntry[] = [];

  try {
    const result = await fetchServiceBySlug(slug);
    entry = result.entry;
    allEntries = result.allEntries;
  } catch {
    notFound();
  }

  if (!entry) notFound();

  const relatedServices = allEntries
    .filter((e) => e.slug !== slug)
    .slice(0, 4);

  const title =
    entry.data.h1_heading || entry.data.service_name || entry.title;
  const heroImage = entry.data.main_image || entry.data.thumbnail;

  return (
    <div className="container page">
      <div className="page__layout">
        {/* SERVICE CONTENT COLUMN */}
        <article>
          <h1 className="service-detail__title">{title}</h1>
          <hr className="service-detail__rule" />

          {heroImage && (
            <img src={heroImage} alt="" className="service-detail__hero" />
          )}

          {renderBody(
            entry.data.first_paragraph,
            entry.data.additional_content
          )}
        </article>

        {/* SIDEBAR COLUMN */}
        <aside className="sidebar">
          <BlogSidebarFormLoader settingsKey="services" />
          {relatedServices.length > 0 && (
            <div className="widget">
              <h2 className="widget__title">Related Services</h2>
              <div className="related-service-list">
                {relatedServices.map((rs) => {
                  const rsThumb = rs.data.thumbnail || rs.data.main_image;
                  const rsTitle =
                    rs.data.h1_heading || rs.data.service_name || rs.title;
                  const rsExcerpt =
                    rs.data.short_summary || rs.data.first_paragraph;
                  return (
                    <div key={rs.id} className="related-service">
                      {rsThumb && (
                        <a href={`/services/${rs.slug}`}>
                          <img
                            src={rsThumb}
                            alt=""
                            className="related-service__thumb"
                          />
                        </a>
                      )}
                      <div>
                        <h3 className="related-service__title">
                          <a href={`/services/${rs.slug}`}>{rsTitle}</a>
                        </h3>
                        {rsExcerpt && (
                          <p className="related-service__excerpt">
                            {rsExcerpt.length > 100
                              ? rsExcerpt
                                  .slice(0, 100)
                                  .replace(/\s+\S*$/, "") + "..."
                              : rsExcerpt}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

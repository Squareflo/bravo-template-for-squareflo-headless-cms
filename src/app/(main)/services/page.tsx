/**
 * Services Listing Page — SquarefloCMS Bravo Template
 * ==================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Fetches all service feed entries from the CMS and renders them
 * in either list view (2-column layout with sidebar) or grid view
 * (full-width 3-column grid). Includes a view toggle and sidebar
 * with a "Request A Quote" contact form.
 *
 * Design Reference:
 *   - html-reference/services-list-b6n3k8q5jw.html (list view)
 *   - html-reference/services-grid-b6n3k8q5jw.html (grid view)
 */

import { cms } from "@/lib/cms";
import type { Metadata } from "next";
import BlogSidebarContact from "@/components/BlogSidebarContact";

interface FeedEntry {
  id: string;
  title: string;
  slug: string;
  status: string;
  data: {
    thumbnail?: string;
    main_image?: string;
    h1_heading?: string;
    first_paragraph?: string;
    service_name?: string;
    short_summary?: string;
    additional_content?: any[];
    [key: string]: any;
  };
}

export const metadata: Metadata = {
  title: "Services",
};

interface PageProps {
  searchParams: Promise<{ view?: string }>;
}

export default async function ServicesPage({ searchParams }: PageProps) {
  const { view } = await searchParams;
  const isGrid = view === "grid";

  let entries: FeedEntry[] = [];

  const [entriesResult, formResult] = await Promise.allSettled([
    cms<{ entries: FeedEntry[] }>("/feed-entries", { module: "services" }),
    cms<{ form: any }>("/forms/contact-us"),
  ]);

  if (entriesResult.status === "fulfilled") {
    entries = (entriesResult.value as any).entries || [];
  }

  const contactForm =
    formResult.status === "fulfilled"
      ? (formResult.value as any).form || null
      : null;

  if (isGrid) {
    return (
      <div className="container page">
        <h1 className="page-title">Services</h1>
        <hr className="page-title-rule" />

        <div className="view-toggle" role="tablist" aria-label="View mode">
          <a
            href="/services"
            className="view-toggle__btn"
            role="tab"
            aria-selected="false"
          >
            <i className="fas fa-list" /> List
          </a>
          <a
            href="/services?view=grid"
            className="view-toggle__btn view-toggle__btn--active"
            role="tab"
            aria-selected="true"
          >
            <i className="fas fa-th" /> Grid
          </a>
        </div>

        {entries.length === 0 ? (
          <p>No services yet. Check back soon.</p>
        ) : (
          <div className="service-grid">
            {entries.map((entry) => {
              const thumb =
                entry.data.thumbnail || entry.data.main_image;
              const title =
                entry.data.h1_heading || entry.data.service_name || entry.title;
              const excerpt =
                entry.data.short_summary || entry.data.first_paragraph;
              return (
                <article key={entry.id} className="service-grid-item">
                  {thumb && (
                    <a href={`/services/${entry.slug}`}>
                      <img
                        src={thumb}
                        alt=""
                        className="service-grid-item__thumb"
                      />
                    </a>
                  )}
                  <h3 className="service-grid-item__title">
                    <a href={`/services/${entry.slug}`}>{title}</a>
                  </h3>
                  {excerpt && (
                    <p className="service-grid-item__excerpt">
                      {excerpt.length > 120
                        ? excerpt.slice(0, 120).replace(/\s+\S*$/, "") + "..."
                        : excerpt}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // LIST VIEW (default) — 2-column layout with sidebar
  return (
    <div className="container page">
      <div className="page__layout">
        <div>
          <h1 className="page-title">Services</h1>
          <hr className="page-title-rule" />

          <div className="view-toggle" role="tablist" aria-label="View mode">
            <a
              href="/services"
              className="view-toggle__btn view-toggle__btn--active"
              role="tab"
              aria-selected="true"
            >
              <i className="fas fa-list" /> List
            </a>
            <a
              href="/services?view=grid"
              className="view-toggle__btn"
              role="tab"
              aria-selected="false"
            >
              <i className="fas fa-th" /> Grid
            </a>
          </div>

          {entries.length === 0 ? (
            <p>No services yet. Check back soon.</p>
          ) : (
            <div className="service-list">
              {entries.map((entry) => {
                const thumb =
                  entry.data.thumbnail || entry.data.main_image;
                const title =
                  entry.data.h1_heading ||
                  entry.data.service_name ||
                  entry.title;
                const excerpt =
                  entry.data.short_summary || entry.data.first_paragraph;
                return (
                  <article key={entry.id} className="service-list-item">
                    {thumb && (
                      <a href={`/services/${entry.slug}`}>
                        <img
                          src={thumb}
                          alt=""
                          className="service-list-item__thumb"
                        />
                      </a>
                    )}
                    <div>
                      <h2 className="service-list-item__title">
                        <a href={`/services/${entry.slug}`}>{title}</a>
                      </h2>
                      {excerpt && (
                        <p className="service-list-item__excerpt">
                          {excerpt.length > 280
                            ? excerpt
                                .slice(0, 280)
                                .replace(/\s+\S*$/, "") + "..."
                            : excerpt}
                        </p>
                      )}
                      <a
                        href={`/services/${entry.slug}`}
                        className="service-list-item__more"
                      >
                        Read more
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <aside className="sidebar">
          <BlogSidebarContact form={contactForm} />
        </aside>
      </div>
    </div>
  );
}

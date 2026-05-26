/**
 * Services Page Client Wrapper — SquarefloCMS Bravo Template
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Reads services settings from EditModeProvider to switch between
 * list and grid layouts, and dynamically loads the sidebar form
 * based on the configured slug.
 */

"use client";

import { useEffect, useState } from "react";
import { useEditMode } from "./EditModeProvider";
import EditableSection from "./EditableSection";
import BlogSidebarContact from "./BlogSidebarContact";

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

interface Props {
  entries: FeedEntry[];
}

export default function ServicesPageClient({ entries }: Props) {
  const ctx = useEditMode();
  const layout = ctx?.settings.services.layout || "list";
  const formSlug = ctx?.settings.services.formSlug || "";

  const [sidebarForm, setSidebarForm] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!formSlug) {
      setSidebarForm(null);
      return;
    }
    setFormLoading(true);
    fetch(`/api/forms/${encodeURIComponent(formSlug)}`)
      .then((r) => r.json())
      .then((data) => setSidebarForm(data.form || null))
      .catch(() => setSidebarForm(null))
      .finally(() => setFormLoading(false));
  }, [formSlug]);

  const isList = layout === "list";

  const content = (
    <>
      <h1 className="page-title">Services</h1>
      <hr className="page-title-rule" />

      {entries.length === 0 ? (
        <p>No services yet. Check back soon.</p>
      ) : isList ? (
        <div className="service-list">
          {entries.map((entry) => {
            const thumb = entry.data.thumbnail || entry.data.main_image;
            const title =
              entry.data.h1_heading || entry.data.service_name || entry.title;
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
                        ? excerpt.slice(0, 280).replace(/\s+\S*$/, "") + "..."
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
      ) : (
        <div className="service-grid">
          {entries.map((entry) => {
            const thumb = entry.data.thumbnail || entry.data.main_image;
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
                <h2 className="service-grid-item__title">
                  <a href={`/services/${entry.slug}`}>{title}</a>
                </h2>
                {excerpt && (
                  <p className="service-grid-item__excerpt">
                    {excerpt.length > 150
                      ? excerpt.slice(0, 150).replace(/\s+\S*$/, "") + "..."
                      : excerpt}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </>
  );

  const wrapped = (
    <EditableSection id="services" label="Services Page">
      {isList ? (
        <div className="container page">
          <div className="page__layout">
            <div>{content}</div>
            <aside className="sidebar">
              {formLoading ? null : sidebarForm ? (
                <BlogSidebarContact form={sidebarForm} />
              ) : null}
            </aside>
          </div>
        </div>
      ) : (
        <div className="container page">{content}</div>
      )}
    </EditableSection>
  );

  return wrapped;
}

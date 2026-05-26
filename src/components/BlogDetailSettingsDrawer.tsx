/**
 * Blog Detail Settings Drawer — SquarefloCMS Bravo Template
 * Powered by SquarefloCMS (https://squareflo.com)
 */

"use client";

import { useEditMode, type BlogCoverLayout } from "./EditModeProvider";
import FormSlugDropdown from "./FormSlugDropdown";

const COVER_OPTIONS: { value: BlogCoverLayout; label: string }[] = [
  { value: "full", label: "Full Width (landscape)" },
  { value: "half", label: "50% Width (square, text wraps)" },
];

export default function BlogDetailSettingsDrawer() {
  const ctx = useEditMode();
  if (!ctx) return null;

  const open = ctx.editMode && ctx.activeSection === "blogDetail";
  const { coverLayout } = ctx.settings.blogDetail;

  return (
    <>
      <div
        className={`section-drawer-backdrop${open ? " section-drawer-backdrop--open" : ""}`}
        onClick={() => ctx.setActiveSection(null)}
      />
      <div className={`section-drawer${open ? " section-drawer--open" : ""}`}>
        <div className="section-drawer__header">
          <h2 className="section-drawer__title">Blog Detail Settings</h2>
          <button
            className="section-drawer__close"
            onClick={() => ctx.setActiveSection(null)}
            type="button"
          >
            <i className="fas fa-times" />
          </button>
        </div>
        <div className="section-drawer__body">
          <div className="drawer-field">
            <div className="drawer-field__label">Cover Image Layout</div>
            <select
              className="drawer-select"
              value={coverLayout}
              onChange={(e) =>
                ctx.updateBlogDetailSettings({
                  coverLayout: e.target.value as BlogCoverLayout,
                })
              }
            >
              {COVER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="drawer-field">
            <label className="drawer-field__label" htmlFor="blog-detail-form-slug">
              Sidebar Form
            </label>
            <FormSlugDropdown
              id="blog-detail-form-slug"
              value={ctx.settings.blogDetail.formSlug}
              onChange={(slug) =>
                ctx.updateBlogDetailSettings({ formSlug: slug })
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}

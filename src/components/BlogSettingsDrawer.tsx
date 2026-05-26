/**
 * Blog Settings Drawer — SquarefloCMS Bravo Template
 * Powered by SquarefloCMS (https://squareflo.com)
 */

"use client";

import { useEditMode } from "./EditModeProvider";
import FormSlugDropdown from "./FormSlugDropdown";

export default function BlogSettingsDrawer() {
  const ctx = useEditMode();
  if (!ctx) return null;

  const open = ctx.editMode && ctx.activeSection === "blog";

  return (
    <>
      <div
        className={`section-drawer-backdrop${open ? " section-drawer-backdrop--open" : ""}`}
        onClick={() => ctx.setActiveSection(null)}
      />
      <div className={`section-drawer${open ? " section-drawer--open" : ""}`}>
        <div className="section-drawer__header">
          <h3 className="section-drawer__title">Blog Page</h3>
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
            <label className="drawer-field__label" htmlFor="blog-form-slug">
              Sidebar Form
            </label>
            <FormSlugDropdown
              id="blog-form-slug"
              value={ctx.settings.blog.formSlug}
              onChange={(slug) =>
                ctx.updateBlogSettings({ formSlug: slug })
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}

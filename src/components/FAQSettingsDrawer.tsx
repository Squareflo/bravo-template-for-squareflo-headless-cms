/**
 * FAQ Settings Drawer — SquarefloCMS Bravo Template
 * Powered by SquarefloCMS (https://squareflo.com)
 */

"use client";

import { useEditMode, type ListMode } from "./EditModeProvider";
import FormSlugDropdown from "./FormSlugDropdown";

export default function FAQSettingsDrawer() {
  const ctx = useEditMode();
  if (!ctx) return null;

  const open = ctx.editMode && ctx.activeSection === "faqs";

  return (
    <>
      <div
        className={`section-drawer-backdrop${open ? " section-drawer-backdrop--open" : ""}`}
        onClick={() => ctx.setActiveSection(null)}
      />
      <div className={`section-drawer${open ? " section-drawer--open" : ""}`}>
        <div className="section-drawer__header">
          <h3 className="section-drawer__title">FAQs Page</h3>
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
            <label className="drawer-field__label" htmlFor="faq-form-slug">
              Sidebar Form
            </label>
            <FormSlugDropdown
              id="faq-form-slug"
              value={ctx.settings.faqs.formSlug}
              onChange={(slug) =>
                ctx.updateFAQSettings({ formSlug: slug })
              }
            />
          </div>

          <div className="drawer-field">
            <label className="drawer-field__label" htmlFor="faq-list-mode">
              Listing Mode
            </label>
            <select
              id="faq-list-mode"
              className="drawer-select"
              value={ctx.settings.faqs.listMode}
              onChange={(e) =>
                ctx.updateFAQSettings({
                  listMode: e.target.value as ListMode,
                })
              }
            >
              <option value="pagination">Pagination</option>
              <option value="infinite">Infinite Scroll</option>
            </select>
          </div>

          {ctx.settings.faqs.listMode === "pagination" && (
            <div className="drawer-field">
              <label className="drawer-field__label" htmlFor="faq-per-page">
                Items Per Page
              </label>
              <input
                id="faq-per-page"
                type="number"
                className="drawer-input"
                min={1}
                max={100}
                value={ctx.settings.faqs.itemsPerPage}
                onChange={(e) =>
                  ctx.updateFAQSettings({
                    itemsPerPage: Math.max(1, parseInt(e.target.value) || 10),
                  })
                }
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

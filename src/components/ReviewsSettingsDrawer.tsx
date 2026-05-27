/**
 * Reviews Settings Drawer — SquarefloCMS Bravo Template
 * Powered by SquarefloCMS (https://squareflo.com)
 */

"use client";

import { useEditMode, type ListMode } from "./EditModeProvider";
import FormSlugDropdown from "./FormSlugDropdown";

export default function ReviewsSettingsDrawer() {
  const ctx = useEditMode();
  if (!ctx) return null;

  const open = ctx.editMode && ctx.activeSection === "reviews";

  return (
    <>
      <div
        className={`section-drawer-backdrop${open ? " section-drawer-backdrop--open" : ""}`}
        onClick={() => ctx.setActiveSection(null)}
      />
      <div className={`section-drawer${open ? " section-drawer--open" : ""}`}>
        <div className="section-drawer__header">
          <h3 className="section-drawer__title">Reviews Page</h3>
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
            <label className="drawer-field__label" htmlFor="reviews-form-slug">
              Sidebar Form
            </label>
            <FormSlugDropdown
              id="reviews-form-slug"
              value={ctx.settings.reviews.formSlug}
              onChange={(slug) =>
                ctx.updateReviewsSettings({ formSlug: slug })
              }
            />
          </div>

          <div className="drawer-field">
            <label className="drawer-field__label" htmlFor="reviews-list-mode">
              Listing Mode
            </label>
            <select
              id="reviews-list-mode"
              className="drawer-select"
              value={ctx.settings.reviews.listMode}
              onChange={(e) =>
                ctx.updateReviewsSettings({
                  listMode: e.target.value as ListMode,
                })
              }
            >
              <option value="pagination">Pagination</option>
              <option value="infinite">Infinite Scroll</option>
            </select>
          </div>

          {ctx.settings.reviews.listMode === "pagination" && (
            <div className="drawer-field">
              <label className="drawer-field__label" htmlFor="reviews-per-page">
                Items Per Page
              </label>
              <input
                id="reviews-per-page"
                type="number"
                className="drawer-input"
                min={1}
                max={100}
                value={ctx.settings.reviews.itemsPerPage}
                onChange={(e) =>
                  ctx.updateReviewsSettings({
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

/**
 * Service Detail Settings Drawer — SquarefloCMS Bravo Template
 * Powered by SquarefloCMS (https://squareflo.com)
 */

"use client";

import { useEditMode, type BlogCoverLayout } from "./EditModeProvider";
import FormSlugDropdown from "./FormSlugDropdown";

const COVER_OPTIONS: { value: BlogCoverLayout; label: string }[] = [
  { value: "full", label: "Full Width (landscape)" },
  { value: "half", label: "50% Width (square, text wraps)" },
];

export default function ServiceDetailSettingsDrawer() {
  const ctx = useEditMode();
  if (!ctx) return null;

  const open = ctx.editMode && ctx.activeSection === "serviceDetail";
  const { coverLayout } = ctx.settings.serviceDetail;

  return (
    <>
      <div
        className={`section-drawer-backdrop${open ? " section-drawer-backdrop--open" : ""}`}
        onClick={() => ctx.setActiveSection(null)}
      />
      <div className={`section-drawer${open ? " section-drawer--open" : ""}`}>
        <div className="section-drawer__header">
          <h3 className="section-drawer__title">Service Detail Page</h3>
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
                ctx.updateServiceDetailSettings({
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
            <label className="drawer-field__label" htmlFor="service-detail-form-slug">
              Sidebar Form
            </label>
            <FormSlugDropdown
              id="service-detail-form-slug"
              value={ctx.settings.serviceDetail.formSlug}
              onChange={(slug) =>
                ctx.updateServiceDetailSettings({ formSlug: slug })
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}

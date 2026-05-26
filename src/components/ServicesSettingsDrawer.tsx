/**
 * Services Settings Drawer — SquarefloCMS Bravo Template
 * Powered by SquarefloCMS (https://squareflo.com)
 */

"use client";

import { useEditMode, type ServicesLayout } from "./EditModeProvider";
import FormSlugDropdown from "./FormSlugDropdown";

const LAYOUT_OPTIONS: { value: ServicesLayout; label: string }[] = [
  { value: "list", label: "List View (2-column with sidebar)" },
  { value: "grid", label: "Gallery View (3-column grid)" },
];

export default function ServicesSettingsDrawer() {
  const ctx = useEditMode();
  if (!ctx) return null;

  const open = ctx.editMode && ctx.activeSection === "services";
  const { layout, formSlug } = ctx.settings.services;

  return (
    <>
      <div
        className={`section-drawer-backdrop${open ? " section-drawer-backdrop--open" : ""}`}
        onClick={() => ctx.setActiveSection(null)}
      />
      <div className={`section-drawer${open ? " section-drawer--open" : ""}`}>
        <div className="section-drawer__header">
          <h3 className="section-drawer__title">Services Page</h3>
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
            <label className="drawer-field__label" htmlFor="services-layout">
              Page Layout
            </label>
            <select
              id="services-layout"
              className="drawer-select"
              value={layout}
              onChange={(e) =>
                ctx.updateServicesSettings({
                  layout: e.target.value as ServicesLayout,
                })
              }
            >
              {LAYOUT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {layout === "list" && (
            <div className="drawer-field">
              <label className="drawer-field__label" htmlFor="services-form-slug">
                Sidebar Form
              </label>
              <FormSlugDropdown
                id="services-form-slug"
                value={formSlug}
                onChange={(slug) =>
                  ctx.updateServicesSettings({ formSlug: slug })
                }
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

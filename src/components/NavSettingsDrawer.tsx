/**
 * Navigation Settings Drawer — SquarefloCMS Bravo Template
 * ==========================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Right-side drawer that opens when the Navigation section is clicked
 * in edit mode. Allows adjusting nav variation (layout), background
 * color (from CMS presets), logo height, and bar padding.
 */

"use client";

import { useEditMode } from "./EditModeProvider";

const VARIATIONS = [
  { value: "classic", label: "Classic — Two-tier with utility bar" },
  { value: "minimal", label: "Minimal — Single bar" },
  { value: "floating", label: "Floating Pill — Rounded with shadow" },
] as const;

export default function NavSettingsDrawer() {
  const ctx = useEditMode();
  if (!ctx) return null;

  const {
    activeSection,
    setActiveSection,
    settings,
    updateNavSettings,
    colorPresets,
  } = ctx;
  const open = activeSection === "navigation";
  const nav = settings.navigation;

  return (
    <>
      <div
        className={`section-drawer-backdrop${open ? " section-drawer-backdrop--open" : ""}`}
        onClick={() => setActiveSection(null)}
      />
      <div className={`section-drawer${open ? " section-drawer--open" : ""}`}>
        <div className="section-drawer__header">
          <h3 className="section-drawer__title">Navigation</h3>
          <button
            className="section-drawer__close"
            onClick={() => setActiveSection(null)}
          >
            <i className="fas fa-times" />
          </button>
        </div>

        <div className="section-drawer__body">
          <div className="drawer-field">
            <label className="drawer-field__label" htmlFor="nav-variation">
              Variation
            </label>
            <select
              id="nav-variation"
              className="drawer-select"
              value={nav.variation}
              onChange={(e) =>
                updateNavSettings({
                  variation: e.target.value as NavSettings["variation"],
                })
              }
            >
              {VARIATIONS.map((v) => (
                <option key={v.value} value={v.value}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          <div className="drawer-field">
            <label className="drawer-field__label">Background Color</label>
            <div className="drawer-swatches">
              <button
                className={`drawer-swatch drawer-swatch--default${!nav.bgColor ? " drawer-swatch--active" : ""}`}
                onClick={() => updateNavSettings({ bgColor: "" })}
                title="Default"
              >
                <span className="drawer-swatch__label">Default</span>
              </button>
              {colorPresets.map((c) => (
                <button
                  key={c.key}
                  className={`drawer-swatch${nav.bgColor === c.value ? " drawer-swatch--active" : ""}`}
                  onClick={() => updateNavSettings({ bgColor: c.value })}
                  title={c.label}
                >
                  <span
                    className="drawer-swatch__color"
                    style={{ background: c.value }}
                  />
                  <span className="drawer-swatch__label">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="drawer-field">
            <label className="drawer-field__label">
              Logo Height{" "}
              <span className="drawer-field__value">{nav.logoHeight}px</span>
            </label>
            <input
              type="range"
              min={24}
              max={80}
              value={nav.logoHeight}
              onChange={(e) =>
                updateNavSettings({ logoHeight: Number(e.target.value) })
              }
              className="drawer-slider"
            />
          </div>

          <div className="drawer-field">
            <label className="drawer-field__label">
              Bar Padding{" "}
              <span className="drawer-field__value">{nav.navPadding}px</span>
            </label>
            <input
              type="range"
              min={4}
              max={40}
              value={nav.navPadding}
              onChange={(e) =>
                updateNavSettings({ navPadding: Number(e.target.value) })
              }
              className="drawer-slider"
            />
          </div>
        </div>
      </div>
    </>
  );
}

type NavSettings = import("./EditModeProvider").NavSettings;

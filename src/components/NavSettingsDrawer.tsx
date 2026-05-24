/**
 * Navigation Settings Drawer — SquarefloCMS Bravo Template
 * ==========================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Right-side drawer that opens when the Navigation section is clicked
 * in edit mode. Allows adjusting nav style, logo height, and bar padding.
 */

"use client";

import { useEditMode } from "./EditModeProvider";

const VARIATIONS = [
  { value: "classic", label: "Classic", desc: "Utility bar + dark nav" },
  { value: "minimal", label: "Minimal", desc: "Dark nav only" },
  { value: "light", label: "Light", desc: "Light background nav" },
] as const;

export default function NavSettingsDrawer() {
  const ctx = useEditMode();
  if (!ctx) return null;

  const { activeSection, setActiveSection, settings, updateNavSettings } = ctx;
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
            <label className="drawer-field__label">Style</label>
            <div className="drawer-variations">
              {VARIATIONS.map((v) => (
                <button
                  key={v.value}
                  className={`drawer-variation${nav.variation === v.value ? " drawer-variation--active" : ""}`}
                  onClick={() => updateNavSettings({ variation: v.value })}
                >
                  <span className="drawer-variation__name">{v.label}</span>
                  <span className="drawer-variation__desc">{v.desc}</span>
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

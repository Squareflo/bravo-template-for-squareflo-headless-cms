/**
 * Navigation Settings Drawer — SquarefloCMS Bravo Template
 * Powered by SquarefloCMS (https://squareflo.com)
 */

"use client";

import { useEditMode, type NavVariation } from "./EditModeProvider";

const VARIATIONS: { value: NavVariation; label: string }[] = [
  { value: "v1",  label: "V1 — Classic Single Bar" },
  { value: "v2",  label: "V2 — Centered Logo, Split Nav" },
  { value: "v3",  label: "V3 — Two-Tier (Utility + Main)" },
  { value: "v4",  label: "V4 — Two-Tier (Location Prominent)" },
  { value: "v5",  label: "V5 — Transparent Overlay" },
  { value: "v6",  label: "V6 — Dark Solid" },
  { value: "v7",  label: "V7 — Centered Logo + Utility Bar" },
  { value: "v8",  label: "V8 — Mega Bar (Everything Visible)" },
  { value: "v10", label: "V10 — Phone Prominent" },
  { value: "v11", label: "V11 — Two CTAs" },
  { value: "v12", label: "V12 — Floating Pill" },
];

const TWO_TIER = new Set<NavVariation>(["v3", "v4", "v7"]);

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
  const isTwoTier = TWO_TIER.has(nav.variation);

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
          {/* Variation */}
          <div className="drawer-field">
            <label className="drawer-field__label" htmlFor="nav-variation">
              Variation
            </label>
            <select
              id="nav-variation"
              className="drawer-select"
              value={nav.variation}
              onChange={(e) =>
                updateNavSettings({ variation: e.target.value as NavVariation })
              }
            >
              {VARIATIONS.map((v) => (
                <option key={v.value} value={v.value}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          {/* Background Color — main bar (or single bar) */}
          <div className="drawer-field">
            <label className="drawer-field__label">
              {isTwoTier ? "Main Bar Color" : "Background Color"}
            </label>
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
                  key={`bg-${c.key}`}
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

          {/* Utility Bar Color — only for two-tier variations */}
          {isTwoTier && (
            <div className="drawer-field">
              <label className="drawer-field__label">Top Bar Color</label>
              <div className="drawer-swatches">
                <button
                  className={`drawer-swatch drawer-swatch--default${!nav.utilityBgColor ? " drawer-swatch--active" : ""}`}
                  onClick={() => updateNavSettings({ utilityBgColor: "" })}
                  title="Default"
                >
                  <span className="drawer-swatch__label">Default</span>
                </button>
                {colorPresets.map((c) => (
                  <button
                    key={`util-${c.key}`}
                    className={`drawer-swatch${nav.utilityBgColor === c.value ? " drawer-swatch--active" : ""}`}
                    onClick={() => updateNavSettings({ utilityBgColor: c.value })}
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
          )}

          {/* Logo Height */}
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

          {/* Bar Padding */}
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

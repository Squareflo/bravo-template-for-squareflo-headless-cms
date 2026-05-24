/**
 * Navigation Settings Drawer — SquarefloCMS Bravo Template
 * Powered by SquarefloCMS (https://squareflo.com)
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { useEditMode, type NavVariation, type NavOverlayMode, type ColorPreset, type ButtonPreset } from "./EditModeProvider";

const VARIATIONS: { value: NavVariation; label: string }[] = [
  { value: "v1",  label: "V1 — Classic Single Bar" },
  { value: "v2",  label: "V2 — Centered Logo, Split Nav" },
  { value: "v3",  label: "V3 — Two-Tier (Utility + Main)" },
  { value: "v4",  label: "V4 — Two-Tier (Location Prominent)" },
  { value: "v6",  label: "V6 — Dark Solid" },
  { value: "v7",  label: "V7 — Centered Logo + Utility Bar" },
  { value: "v8",  label: "V8 — Mega Bar (Everything Visible)" },
  { value: "v10", label: "V10 — Phone Prominent" },
  { value: "v11", label: "V11 — Two CTAs" },
  { value: "v12", label: "V12 — Floating Pill" },
];

const TWO_TIER = new Set<NavVariation>(["v3", "v4", "v7"]);

const CTA_COUNT: Record<NavVariation, number> = {
  v1: 1, v2: 0, v3: 1, v4: 0, v6: 1, v7: 0, v8: 2, v10: 0, v11: 2, v12: 1,
};

function ColorDropdown({
  value,
  presets,
  onChange,
}: {
  value: string;
  presets: ColorPreset[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const selected = value
    ? presets.find((p) => p.value === value)
    : null;

  return (
    <div className="color-dropdown" ref={ref}>
      <button
        className="color-dropdown__trigger"
        onClick={() => setOpen(!open)}
        type="button"
      >
        {selected ? (
          <>
            <span className="color-dropdown__dot" style={{ background: selected.value }} />
            <span className="color-dropdown__name">{selected.label}</span>
          </>
        ) : (
          <span className="color-dropdown__name">Default</span>
        )}
        <i className={`fas fa-caret-${open ? "up" : "down"} color-dropdown__caret`} />
      </button>
      {open && (
        <ul className="color-dropdown__menu">
          <li>
            <button
              className={`color-dropdown__option${!value ? " color-dropdown__option--active" : ""}`}
              onClick={() => { onChange(""); setOpen(false); }}
              type="button"
            >
              <span className="color-dropdown__name">Default</span>
            </button>
          </li>
          {presets.map((p) => (
            <li key={p.key}>
              <button
                className={`color-dropdown__option${value === p.value ? " color-dropdown__option--active" : ""}`}
                onClick={() => { onChange(p.value); setOpen(false); }}
                type="button"
              >
                <span className="color-dropdown__dot" style={{ background: p.value }} />
                <span className="color-dropdown__name">{p.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function NavSettingsDrawer() {
  const ctx = useEditMode();
  if (!ctx) return null;

  const {
    activeSection,
    setActiveSection,
    settings,
    updateNavSettings,
    colorPresets,
    buttonPresets,
  } = ctx;
  const open = activeSection === "navigation";
  const nav = settings.navigation;
  const isTwoTier = TWO_TIER.has(nav.variation);
  const isOverlay = nav.overlayMode === "overlay";
  const ctaCount = CTA_COUNT[nav.variation] ?? 0;

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

          {/* Overlay Mode */}
          <div className="drawer-field">
            <label className="drawer-field__label" htmlFor="nav-overlay">
              Overlay Behavior
            </label>
            <select
              id="nav-overlay"
              className="drawer-select"
              value={nav.overlayMode}
              onChange={(e) =>
                updateNavSettings({ overlayMode: e.target.value as NavOverlayMode })
              }
            >
              <option value="above">Sit Above Content</option>
              <option value="overlay">Overlay Content Below</option>
            </select>
          </div>

          {/* Opacity controls — only when overlay mode */}
          {isOverlay && (
            <>
              <div className="drawer-field">
                <label className="drawer-field__label">
                  {isTwoTier ? "Main Bar Opacity" : "Bar Opacity"}{" "}
                  <span className="drawer-field__value">{nav.mainBarOpacity}%</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={nav.mainBarOpacity}
                  onChange={(e) =>
                    updateNavSettings({ mainBarOpacity: Number(e.target.value) })
                  }
                  className="drawer-slider"
                />
              </div>
              {isTwoTier && (
                <div className="drawer-field">
                  <label className="drawer-field__label">
                    Top Bar Opacity{" "}
                    <span className="drawer-field__value">{nav.utilityBarOpacity}%</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={nav.utilityBarOpacity}
                    onChange={(e) =>
                      updateNavSettings({ utilityBarOpacity: Number(e.target.value) })
                    }
                    className="drawer-slider"
                  />
                </div>
              )}
            </>
          )}

          {/* Background Color */}
          <div className="drawer-field">
            <label className="drawer-field__label">
              {isTwoTier ? "Main Bar Color" : "Background Color"}
            </label>
            <ColorDropdown
              value={nav.bgColor}
              presets={colorPresets}
              onChange={(v) => updateNavSettings({ bgColor: v })}
            />
          </div>

          {/* Utility Bar Color — only for two-tier variations */}
          {isTwoTier && (
            <div className="drawer-field">
              <label className="drawer-field__label">Top Bar Color</label>
              <ColorDropdown
                value={nav.utilityBgColor}
                presets={colorPresets}
                onChange={(v) => updateNavSettings({ utilityBgColor: v })}
              />
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

          {/* Logo Horizontal Offset */}
          <div className="drawer-field">
            <label className="drawer-field__label">
              Logo X Offset{" "}
              <span className="drawer-field__value">{nav.logoOffsetX}px</span>
            </label>
            <input
              type="range"
              min={-40}
              max={40}
              value={nav.logoOffsetX}
              onChange={(e) =>
                updateNavSettings({ logoOffsetX: Number(e.target.value) })
              }
              className="drawer-slider"
            />
          </div>

          {/* Logo Vertical Offset */}
          <div className="drawer-field">
            <label className="drawer-field__label">
              Logo Y Offset{" "}
              <span className="drawer-field__value">{nav.logoOffsetY}px</span>
            </label>
            <input
              type="range"
              min={-20}
              max={20}
              value={nav.logoOffsetY}
              onChange={(e) =>
                updateNavSettings({ logoOffsetY: Number(e.target.value) })
              }
              className="drawer-slider"
            />
          </div>

          {/* CTA Button Presets */}
          {ctaCount >= 1 && buttonPresets.length > 0 && (
            <div className="drawer-field">
              <label className="drawer-field__label" htmlFor="nav-cta1-preset">
                {ctaCount === 1 ? "Button Preset" : "Button 1 Preset"}
              </label>
              <select
                id="nav-cta1-preset"
                className="drawer-select"
                value={nav.ctaPreset1}
                onChange={(e) =>
                  updateNavSettings({ ctaPreset1: e.target.value })
                }
              >
                {buttonPresets.map((bp) => (
                  <option key={bp.key} value={bp.key}>
                    {bp.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {ctaCount >= 2 && buttonPresets.length > 0 && (
            <div className="drawer-field">
              <label className="drawer-field__label" htmlFor="nav-cta2-preset">
                Button 2 Preset
              </label>
              <select
                id="nav-cta2-preset"
                className="drawer-select"
                value={nav.ctaPreset2}
                onChange={(e) =>
                  updateNavSettings({ ctaPreset2: e.target.value })
                }
              >
                {buttonPresets.map((bp) => (
                  <option key={bp.key} value={bp.key}>
                    {bp.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

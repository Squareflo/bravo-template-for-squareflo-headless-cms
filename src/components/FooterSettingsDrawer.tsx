/**
 * Footer Settings Drawer — SquarefloCMS Bravo Template
 * Powered by SquarefloCMS (https://squareflo.com)
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { useEditMode, type ColorPreset, type FooterVariation } from "./EditModeProvider";

const FOOTER_VARIATIONS: { value: FooterVariation; label: string }[] = [
  { value: "ft1", label: "FT1 — Classic 5-Column" },
  { value: "ft2", label: "FT2 — Minimal 2-Column" },
  { value: "ft3", label: "FT3 — Brand-Heavy + Utility" },
  { value: "ft4", label: "FT4 — Multi-Location Cards" },
  { value: "ft5", label: "FT5 — Location Selector" },
  { value: "ft6", label: "FT6 — Full-Width Map" },
  { value: "ft7", label: "FT7 — Centered Minimalist" },
];

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
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const selected = value ? presets.find((p) => p.value === value) : null;

  return (
    <div className="color-dropdown" ref={ref}>
      <button
        className="color-dropdown__trigger"
        onClick={() => setOpen(!open)}
        type="button"
      >
        {selected ? (
          <>
            <span
              className="color-dropdown__dot"
              style={{ background: selected.value }}
            />
            <span className="color-dropdown__name">{selected.label}</span>
          </>
        ) : (
          <span className="color-dropdown__name">Default</span>
        )}
        <i
          className={`fas fa-caret-${open ? "up" : "down"} color-dropdown__caret`}
        />
      </button>
      {open && (
        <ul className="color-dropdown__menu">
          <li>
            <button
              className={`color-dropdown__option${!value ? " color-dropdown__option--active" : ""}`}
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              type="button"
            >
              <span className="color-dropdown__name">Default</span>
            </button>
          </li>
          {presets.map((p) => (
            <li key={p.key}>
              <button
                className={`color-dropdown__option${value === p.value ? " color-dropdown__option--active" : ""}`}
                onClick={() => {
                  onChange(p.value);
                  setOpen(false);
                }}
                type="button"
              >
                <span
                  className="color-dropdown__dot"
                  style={{ background: p.value }}
                />
                <span className="color-dropdown__name">{p.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Which features each variation supports */
const FEATURES: Record<FooterVariation, { newsletter: boolean; dropdown: boolean; headings: boolean; cards: boolean }> = {
  ft1: { newsletter: true,  dropdown: true,  headings: true,  cards: false },
  ft2: { newsletter: false, dropdown: false, headings: false, cards: false },
  ft3: { newsletter: true,  dropdown: true,  headings: true,  cards: false },
  ft4: { newsletter: true,  dropdown: false, headings: true,  cards: true  },
  ft5: { newsletter: true,  dropdown: true,  headings: true,  cards: false },
  ft6: { newsletter: true,  dropdown: true,  headings: true,  cards: false },
  ft7: { newsletter: false, dropdown: false, headings: false, cards: false },
};

export default function FooterSettingsDrawer() {
  const ctx = useEditMode();
  if (!ctx) return null;

  const {
    activeSection,
    setActiveSection,
    settings,
    updateFooterSettings,
    colorPresets,
    buttonPresets,
  } = ctx;
  const open = activeSection === "footer";
  const footer = settings.footer;
  const variation = footer.variation;
  const feat = FEATURES[variation];

  return (
    <>
      <div
        className={`section-drawer-backdrop${open ? " section-drawer-backdrop--open" : ""}`}
        onClick={() => setActiveSection(null)}
      />
      <div className={`section-drawer${open ? " section-drawer--open" : ""}`}>
        <div className="section-drawer__header">
          <h3 className="section-drawer__title">Footer</h3>
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
            <label className="drawer-field__label" htmlFor="footer-variation">
              Variation
            </label>
            <select
              id="footer-variation"
              className="drawer-select"
              value={variation}
              onChange={(e) =>
                updateFooterSettings({ variation: e.target.value as FooterVariation })
              }
            >
              {FOOTER_VARIATIONS.map((v) => (
                <option key={v.value} value={v.value}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          {/* Background Color — all variations */}
          <div className="drawer-field">
            <label className="drawer-field__label">Background Color</label>
            <ColorDropdown
              value={footer.bgColor}
              presets={colorPresets}
              onChange={(v) => updateFooterSettings({ bgColor: v })}
            />
          </div>

          {/* Heading Color — variations with section headings */}
          {feat.headings && (
            <div className="drawer-field">
              <label className="drawer-field__label">Heading Color</label>
              <ColorDropdown
                value={footer.headingColor}
                presets={colorPresets}
                onChange={(v) => updateFooterSettings({ headingColor: v })}
              />
            </div>
          )}

          {/* Dropdown Background — variations with location dropdown */}
          {feat.dropdown && (
            <div className="drawer-field">
              <label className="drawer-field__label">Dropdown Background</label>
              <ColorDropdown
                value={footer.dropdownBgColor}
                presets={colorPresets}
                onChange={(v) => updateFooterSettings({ dropdownBgColor: v })}
              />
            </div>
          )}

          {/* Location Card Background — FT7 only */}
          {feat.cards && (
            <div className="drawer-field">
              <label className="drawer-field__label">Location Card Background</label>
              <ColorDropdown
                value={footer.cardBgColor}
                presets={colorPresets}
                onChange={(v) => updateFooterSettings({ cardBgColor: v })}
              />
            </div>
          )}

          {/* Form Field Background — variations with newsletter */}
          {feat.newsletter && (
            <div className="drawer-field">
              <label className="drawer-field__label">Form Field Background</label>
              <ColorDropdown
                value={footer.inputBgColor}
                presets={colorPresets}
                onChange={(v) => updateFooterSettings({ inputBgColor: v })}
              />
            </div>
          )}

          {/* Subscribe Button Style — variations with newsletter */}
          {feat.newsletter && buttonPresets.length > 0 && (
            <div className="drawer-field">
              <label className="drawer-field__label" htmlFor="footer-btn-preset">
                Subscribe Button Style
              </label>
              <select
                id="footer-btn-preset"
                className="drawer-select"
                value={footer.btnPreset}
                onChange={(e) =>
                  updateFooterSettings({ btnPreset: e.target.value })
                }
              >
                <option value="">Default</option>
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

/**
 * Footer Settings Drawer — SquarefloCMS Bravo Template
 * Powered by SquarefloCMS (https://squareflo.com)
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { useEditMode, type ColorPreset } from "./EditModeProvider";

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

export default function FooterSettingsDrawer() {
  const ctx = useEditMode();
  if (!ctx) return null;

  const {
    activeSection,
    setActiveSection,
    settings,
    updateFooterSettings,
    colorPresets,
  } = ctx;
  const open = activeSection === "footer";
  const footer = settings.footer;

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
          {/* Background Color */}
          <div className="drawer-field">
            <label className="drawer-field__label">Background Color</label>
            <ColorDropdown
              value={footer.bgColor}
              presets={colorPresets}
              onChange={(v) => updateFooterSettings({ bgColor: v })}
            />
          </div>
        </div>
      </div>
    </>
  );
}

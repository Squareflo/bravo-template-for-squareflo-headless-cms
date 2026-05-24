/**
 * Edit Mode Provider — SquarefloCMS Bravo Template
 * ==================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Client-side context provider that manages:
 *   - Edit mode toggle (on/off)
 *   - Active section (which section's drawer is open)
 *   - Section settings (nav variation, bg color, logo height, padding)
 *   - Persists settings to localStorage
 *   - Applies settings as CSS custom properties on :root
 */

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import "@/styles/edit-mode.css";

export interface NavSettings {
  variation: "classic" | "minimal" | "floating";
  bgColor: string;
  logoHeight: number;
  navPadding: number;
}

export interface SectionSettings {
  navigation: NavSettings;
}

export interface ColorPreset {
  key: string;
  label: string;
  value: string;
}

const DEFAULTS: SectionSettings = {
  navigation: {
    variation: "classic",
    bgColor: "",
    logoHeight: 50,
    navPadding: 18,
  },
};

interface EditModeCtx {
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  activeSection: string | null;
  setActiveSection: (id: string | null) => void;
  settings: SectionSettings;
  updateNavSettings: (u: Partial<NavSettings>) => void;
  colorPresets: ColorPreset[];
}

const Ctx = createContext<EditModeCtx | null>(null);
export const useEditMode = () => useContext(Ctx);

const STORAGE_KEY = "sqf_section_settings";

function getLuminance(hex: string): number {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export default function EditModeProvider({
  children,
  colorPresets = [],
}: {
  children: ReactNode;
  colorPresets?: ColorPreset[];
}) {
  const [editMode, setEditMode] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [settings, setSettings] = useState(DEFAULTS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSettings((s) => ({
          ...s,
          navigation: { ...s.navigation, ...parsed.navigation },
        }));
      }
    } catch {}
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    const { navigation: nav } = settings;
    root.style.setProperty("--nav-logo-height", `${nav.logoHeight}px`);
    root.style.setProperty("--nav-main-padding", `${nav.navPadding}px`);
    root.dataset.navVariation = nav.variation;

    if (nav.bgColor) {
      root.style.setProperty("--nav-bg-override", nav.bgColor);
      const textColor = getLuminance(nav.bgColor) > 0.5 ? "#333333" : "#ffffff";
      root.style.setProperty("--nav-text-override", textColor);
      root.dataset.navBgOverride = "true";
    } else {
      root.style.removeProperty("--nav-bg-override");
      root.style.removeProperty("--nav-text-override");
      delete root.dataset.navBgOverride;
    }
  }, [settings, mounted]);

  useEffect(() => {
    if (!editMode) setActiveSection(null);
  }, [editMode]);

  const updateNavSettings = useCallback((updates: Partial<NavSettings>) => {
    setSettings((prev) => {
      const next = {
        ...prev,
        navigation: { ...prev.navigation, ...updates },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <Ctx.Provider
      value={{
        editMode,
        setEditMode,
        activeSection,
        setActiveSection,
        settings,
        updateNavSettings,
        colorPresets,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

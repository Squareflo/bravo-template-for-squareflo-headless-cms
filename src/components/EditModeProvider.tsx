/**
 * Edit Mode Provider — SquarefloCMS Bravo Template
 * Powered by SquarefloCMS (https://squareflo.com)
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

export type NavVariation =
  | "v1" | "v2" | "v3" | "v4"
  | "v6" | "v7" | "v8" | "v10" | "v11" | "v12";

export type NavOverlayMode = "above" | "overlay";

export interface NavSettings {
  variation: NavVariation;
  bgColor: string;
  utilityBgColor: string;
  logoHeight: number;
  navPadding: number;
  logoOffsetX: number;
  logoOffsetY: number;
  overlayMode: NavOverlayMode;
  mainBarOpacity: number;
  utilityBarOpacity: number;
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
    variation: "v3",
    bgColor: "",
    utilityBgColor: "",
    logoHeight: 50,
    navPadding: 18,
    logoOffsetX: 0,
    logoOffsetY: 0,
    overlayMode: "above",
    mainBarOpacity: 100,
    utilityBarOpacity: 100,
  },
};

/** Map legacy variation names to new IDs */
const LEGACY_MAP: Record<string, NavVariation> = {
  classic: "v3",
  minimal: "v6",
  light: "v1",
  floating: "v12",
  v5: "v3",
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
        const nav = { ...DEFAULTS.navigation, ...parsed.navigation };
        // Migrate legacy variation names
        if (LEGACY_MAP[nav.variation]) {
          nav.variation = LEGACY_MAP[nav.variation];
        }
        setSettings((s) => ({ ...s, navigation: nav }));
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
    root.style.setProperty("--nav-logo-offset-x", `${nav.logoOffsetX}px`);
    root.style.setProperty("--nav-logo-offset-y", `${nav.logoOffsetY}px`);
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

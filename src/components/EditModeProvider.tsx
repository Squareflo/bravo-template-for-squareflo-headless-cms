/**
 * Edit Mode Provider — SquarefloCMS Bravo Template
 * ==================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Client-side context provider that manages:
 *   - Edit mode toggle (on/off)
 *   - Active section (which section's drawer is open)
 *   - Section settings (nav variation, logo height, padding)
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
  variation: "classic" | "minimal" | "light";
  logoHeight: number;
  navPadding: number;
}

export interface SectionSettings {
  navigation: NavSettings;
}

const DEFAULTS: SectionSettings = {
  navigation: {
    variation: "classic",
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
}

const Ctx = createContext<EditModeCtx | null>(null);
export const useEditMode = () => useContext(Ctx);

const STORAGE_KEY = "sqf_section_settings";

export default function EditModeProvider({
  children,
}: {
  children: ReactNode;
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
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

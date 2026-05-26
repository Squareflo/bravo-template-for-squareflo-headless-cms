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
  ctaPreset1: string;
  ctaPreset2: string;
}

export type FooterVariation = "ft1" | "ft2" | "ft3" | "ft4" | "ft5" | "ft6" | "ft7";

export interface FooterSettings {
  variation: FooterVariation;
  bgColor: string;
  dropdownBgColor: string;
  inputBgColor: string;
  btnPreset: string;
  headingColor: string;
  cardBgColor: string;
}

export type BlogCoverLayout = "full" | "half";

export interface BlogDetailSettings {
  coverLayout: BlogCoverLayout;
  formSlug: string;
}

export type ListMode = "pagination" | "infinite";

export interface BlogSettings {
  formSlug: string;
  listMode: ListMode;
  itemsPerPage: number;
}

export type ServicesLayout = "list" | "grid";

export interface ServicesSettings {
  layout: ServicesLayout;
  formSlug: string;
  listMode: ListMode;
  itemsPerPage: number;
}

export interface ServiceDetailSettings {
  coverLayout: BlogCoverLayout;
  formSlug: string;
}

export interface FAQSettings {
  formSlug: string;
  listMode: ListMode;
  itemsPerPage: number;
}

export interface SectionSettings {
  navigation: NavSettings;
  footer: FooterSettings;
  blog: BlogSettings;
  blogDetail: BlogDetailSettings;
  services: ServicesSettings;
  serviceDetail: ServiceDetailSettings;
  faqs: FAQSettings;
}

export interface ColorPreset {
  key: string;
  label: string;
  value: string;
}

export interface ButtonPreset {
  key: string;
  label: string;
  fillColor: string;
  fillColorHover: string;
  textColor: string;
  textColorHover: string;
  borderWidth: number;
  borderColor: string;
  borderColorHover: string;
  borderRadius: number;
  paddingH: number;
  paddingV: number;
}

const DEFAULTS: SectionSettings = {
  blog: {
    formSlug: "",
    listMode: "pagination",
    itemsPerPage: 6,
  },
  blogDetail: {
    coverLayout: "full",
    formSlug: "",
  },
  services: {
    layout: "list",
    formSlug: "",
    listMode: "pagination",
    itemsPerPage: 6,
  },
  serviceDetail: {
    coverLayout: "full",
    formSlug: "",
  },
  faqs: {
    formSlug: "",
    listMode: "pagination",
    itemsPerPage: 10,
  },
  footer: {
    variation: "ft1",
    bgColor: "",
    dropdownBgColor: "",
    inputBgColor: "",
    btnPreset: "",
    headingColor: "",
    cardBgColor: "",
  },
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
    ctaPreset1: "primary",
    ctaPreset2: "secondary",
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

/** Map legacy footer variation names (from HTML mockup IDs) to sequential IDs */
const FOOTER_LEGACY_MAP: Record<string, FooterVariation> = {
  ft3: "ft2", ft4: "ft3", ft7: "ft4", ft8: "ft5", ft10: "ft6", ft12: "ft7",
};

interface EditModeCtx {
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  activeSection: string | null;
  setActiveSection: (id: string | null) => void;
  settings: SectionSettings;
  updateNavSettings: (u: Partial<NavSettings>) => void;
  updateFooterSettings: (u: Partial<FooterSettings>) => void;
  updateBlogSettings: (u: Partial<BlogSettings>) => void;
  updateBlogDetailSettings: (u: Partial<BlogDetailSettings>) => void;
  updateServicesSettings: (u: Partial<ServicesSettings>) => void;
  updateServiceDetailSettings: (u: Partial<ServiceDetailSettings>) => void;
  updateFAQSettings: (u: Partial<FAQSettings>) => void;
  colorPresets: ColorPreset[];
  buttonPresets: ButtonPreset[];
}

const Ctx = createContext<EditModeCtx | null>(null);
export const useEditMode = () => useContext(Ctx);

const STORAGE_KEY = "sqf_section_settings";

export default function EditModeProvider({
  children,
  colorPresets = [],
  buttonPresets = [],
}: {
  children: ReactNode;
  colorPresets?: ColorPreset[];
  buttonPresets?: ButtonPreset[];
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
        const footer = { ...DEFAULTS.footer, ...parsed.footer };
        const blog = { ...DEFAULTS.blog, ...parsed.blog };
        const blogDetail = { ...DEFAULTS.blogDetail, ...parsed.blogDetail };
        const services = { ...DEFAULTS.services, ...parsed.services };
        const serviceDetail = { ...DEFAULTS.serviceDetail, ...parsed.serviceDetail };
        const faqs = { ...DEFAULTS.faqs, ...parsed.faqs };
        // Migrate legacy variation names
        if (LEGACY_MAP[nav.variation]) {
          nav.variation = LEGACY_MAP[nav.variation];
        }
        if (FOOTER_LEGACY_MAP[footer.variation]) {
          footer.variation = FOOTER_LEGACY_MAP[footer.variation];
        }
        setSettings((s) => ({ ...s, navigation: nav, footer, blog, blogDetail, services, serviceDetail, faqs }));
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

  const updateFooterSettings = useCallback((updates: Partial<FooterSettings>) => {
    setSettings((prev) => {
      const next = {
        ...prev,
        footer: { ...prev.footer, ...updates },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateBlogSettings = useCallback((updates: Partial<BlogSettings>) => {
    setSettings((prev) => {
      const next = {
        ...prev,
        blog: { ...prev.blog, ...updates },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateBlogDetailSettings = useCallback((updates: Partial<BlogDetailSettings>) => {
    setSettings((prev) => {
      const next = {
        ...prev,
        blogDetail: { ...prev.blogDetail, ...updates },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateServicesSettings = useCallback((updates: Partial<ServicesSettings>) => {
    setSettings((prev) => {
      const next = {
        ...prev,
        services: { ...prev.services, ...updates },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateServiceDetailSettings = useCallback((updates: Partial<ServiceDetailSettings>) => {
    setSettings((prev) => {
      const next = {
        ...prev,
        serviceDetail: { ...prev.serviceDetail, ...updates },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateFAQSettings = useCallback((updates: Partial<FAQSettings>) => {
    setSettings((prev) => {
      const next = {
        ...prev,
        faqs: { ...prev.faqs, ...updates },
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
        updateFooterSettings,
        updateBlogSettings,
        updateBlogDetailSettings,
        updateServicesSettings,
        updateServiceDetailSettings,
        updateFAQSettings,
        colorPresets,
        buttonPresets,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

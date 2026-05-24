/**
 * Main Layout — SquarefloCMS Bravo Template
 * ============================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Layout for all standard pages (home, [slug], etc.).
 * Renders the site header with navigation. Auth pages use a separate
 * (auth) route group and don't get this header.
 */

import { cms } from "@/lib/cms";
import { NavItem, SiteSettings } from "@/lib/types";
import NavRenderer from "@/components/NavRenderer";
import EditModeProvider, { type ColorPreset, type ButtonPreset } from "@/components/EditModeProvider";
import EditableSection from "@/components/EditableSection";
import NavSettingsDrawer from "@/components/NavSettingsDrawer";
import AuthBar from "@/components/AuthBar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings: SiteSettings | null = null;
  let headerNav: NavItem[] = [];

  try {
    [settings, { navigation: headerNav }] = await Promise.all([
      cms<SiteSettings>("/settings"),
      cms<{ navigation: NavItem[] }>("/navigation", { location: "header" }),
    ]);
  } catch (e) {
    console.error("Failed to fetch CMS data:", e);
  }

  const colorPresets: ColorPreset[] = settings
    ? [
        { key: "brand", label: "Brand", value: settings.design.colors.brand },
        { key: "accentLight", label: "Accent Light", value: settings.design.colors.accentLight },
        { key: "accentDark", label: "Accent Dark", value: settings.design.colors.accentDark },
        { key: "bgTextLight", label: "Light", value: settings.design.colors.bgTextLight },
        { key: "bgTextDark", label: "Dark", value: settings.design.colors.bgTextDark },
        { key: "pageBg", label: "Page BG", value: settings.design.colors.pageBg },
        { key: "white", label: "White", value: "#ffffff" },
        { key: "black", label: "Black", value: "#000000" },
      ].filter((c) => c.value)
    : [];

  const buttonPresets: ButtonPreset[] = settings?.design?.buttons
    ? Object.entries(settings.design.buttons).map(([key, btn]) => ({
        key,
        label: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
        fillColor: btn.fillColor,
        fillColorHover: btn.fillColorHover,
        textColor: btn.textColor,
        textColorHover: btn.textColorHover,
        borderWidth: btn.borderWidth,
        borderColor: btn.borderColor,
        borderColorHover: btn.borderColorHover,
        borderRadius: btn.borderRadius,
        paddingH: btn.paddingH,
        paddingV: btn.paddingV,
      }))
    : [];

  return (
    <EditModeProvider colorPresets={colorPresets} buttonPresets={buttonPresets}>
      <AuthBar />
      <div className="nav-and-content">
        {settings && (
          <EditableSection id="navigation" label="Navigation">
            <NavRenderer nav={headerNav} settings={settings} />
          </EditableSection>
        )}
        <main>{children}</main>
      </div>
      <NavSettingsDrawer />
    </EditModeProvider>
  );
}

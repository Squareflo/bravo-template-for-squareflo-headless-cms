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
import Footer from "@/components/Footer";
import FooterSettingsDrawer from "@/components/FooterSettingsDrawer";
import AuthBar from "@/components/AuthBar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings: SiteSettings | null = null;
  let headerNav: NavItem[] = [];
  let footerNav: NavItem[] = [];

  // Fetch independently so one failure doesn't block the others
  const [settingsResult, headerResult, footerResult] = await Promise.allSettled([
    cms<SiteSettings>("/settings"),
    cms<{ navigation: NavItem[] }>("/navigation", { location: "header" }),
    cms<{ navigation: NavItem[] }>("/navigation", { location: "footer" }),
  ]);

  if (settingsResult.status === "fulfilled") settings = settingsResult.value;
  else console.error("Failed to fetch CMS settings:", settingsResult.reason);

  if (headerResult.status === "fulfilled") headerNav = headerResult.value.navigation;
  else console.error("Failed to fetch header nav:", headerResult.reason);

  if (footerResult.status === "fulfilled") footerNav = footerResult.value.navigation;
  else console.error("Failed to fetch footer nav:", footerResult.reason);

  const KNOWN_COLOR_LABELS: Record<string, string> = {
    brand: "Brand",
    accentLight: "Accent Light",
    accentDark: "Accent Dark",
    bgTextLight: "Light",
    bgTextDark: "Dark",
    pageBg: "Page BG",
  };

  const colorPresets: ColorPreset[] = settings
    ? [
        // All CMS colors (known + additional custom colors)
        ...Object.entries(settings.design.colors)
          .filter(([, v]) => v)
          .map(([key, value]) => ({
            key,
            label: KNOWN_COLOR_LABELS[key] || key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
            value,
          })),
        // Always include White and Black
        { key: "white", label: "White", value: "#ffffff" },
        { key: "black", label: "Black", value: "#000000" },
      ]
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
      {settings && (
        <EditableSection id="footer" label="Footer">
          <Footer nav={footerNav} settings={settings} />
        </EditableSection>
      )}
      <NavSettingsDrawer />
      <FooterSettingsDrawer />
    </EditModeProvider>
  );
}

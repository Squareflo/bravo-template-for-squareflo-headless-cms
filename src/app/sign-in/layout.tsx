/**
 * Sign-In Layout — SquarefloCMS Bravo Template
 * ===============================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Standalone layout for the sign-in page. Does NOT include the site header
 * or footer — just a clean, centered auth card. Still loads design tokens
 * and fonts from the CMS so the page matches the site's branding.
 *
 * Design Reference:
 *   - html-reference/sign-in-r4m7t9w2qx.html (body only, no nav/footer)
 */

import { cms } from "@/lib/cms";
import { SiteSettings } from "@/lib/types";
import "@/styles/globals.css";
import "@/styles/pages.css";
import "@/styles/auth.css";

export default async function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings: SiteSettings | null = null;

  try {
    settings = await cms<SiteSettings>("/settings");
  } catch (e) {
    console.error("Failed to fetch CMS settings for sign-in layout:", e);
  }

  // Build design tokens (same logic as root layout)
  const designTokens: Record<string, string> = {};
  if (settings?.design?.colors) {
    designTokens["--color-accent"] = settings.design.colors.brand;
    designTokens["--color-accent-light"] = settings.design.colors.accentLight;
    designTokens["--color-accent-dark"] = settings.design.colors.accentDark;
    designTokens["--color-page-bg"] = settings.design.colors.pageBg;
    designTokens["--color-bg-light"] = settings.design.colors.bgTextLight;
    designTokens["--color-bg-dark"] = settings.design.colors.bgTextDark;
  }
  if (settings?.design?.typography) {
    const typo = settings.design.typography;
    if (typo.h1?.fontFamily) {
      designTokens["--font-heading"] = `"${typo.h1.fontFamily}", sans-serif`;
    }
    const bodyPreset = typo.text || typo.body;
    if (bodyPreset?.fontFamily) {
      designTokens["--font-body"] = `"${bodyPreset.fontFamily}", sans-serif`;
    }
  }
  if (settings?.design?.buttons?.primary) {
    const btn = settings.design.buttons.primary;
    designTokens["--btn-primary-bg"] = btn.fillColor;
    designTokens["--btn-primary-bg-hover"] = btn.fillColorHover;
    designTokens["--btn-primary-text"] = btn.textColor;
    designTokens["--btn-primary-radius"] = btn.borderRadius + "px";
  }

  // Google Fonts
  const fontFamilies = new Set<string>();
  if (settings?.design?.typography) {
    Object.values(settings.design.typography).forEach((t) => {
      if (t?.fontFamily) fontFamilies.add(t.fontFamily);
    });
  }
  const fontsUrl =
    fontFamilies.size > 0
      ? `https://fonts.googleapis.com/css2?${[...fontFamilies]
          .map(
            (f) =>
              `family=${f.replace(/\s+/g, "+")}:wght@400;500;600;700;800`,
          )
          .join("&")}&display=swap`
      : null;

  return (
    <html lang="en" style={designTokens as React.CSSProperties}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {fontsUrl && <link rel="stylesheet" href={fontsUrl} />}
        {settings?.business?.logos?.favicon && (
          <link rel="icon" href={settings.business.logos.favicon} />
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}

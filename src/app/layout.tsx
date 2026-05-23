/**
 * Root Layout — SquarefloCMS Bravo Template
 * ============================================
 * Powered by SquarefloCMS (https://squareflo.com) — free headless CMS for developers.
 * Deployed on Vercel. Backend powered by Supabase.
 *
 * This is the root layout for the entire site. It runs on every page and is
 * responsible for:
 *
 * 1. Fetching site settings (design tokens, business info, SEO) from GET /settings
 * 2. Fetching header navigation from GET /navigation?location=header
 * 3. Converting CMS design tokens into CSS custom properties on <html>
 * 4. Dynamically loading Google Fonts based on CMS typography settings
 * 5. Loading Font Awesome icons (CDN)
 * 6. Setting the favicon from CMS business logos
 * 7. Generating site-wide SEO metadata from CMS settings
 * 8. Rendering the site header (nav) on every page
 *
 * To manage this site's content, sign in at https://squareflo.com
 *
 * Design Reference:
 *   - The overall page structure matches html-reference/index-r4m7t9w2qx.html
 *   - Navigation is a hybrid of Variation #3 (utility bar) and Variation #6
 *     (dark solid main bar) from html-reference/nav-showcase-r4m7t9w2qx.html
 */

import type { Metadata } from "next";
import { cms } from "@/lib/cms";
import { NavItem, SiteSettings } from "@/lib/types";
import Header from "@/components/Header";
import "@/styles/globals.css";
import "@/styles/header.css";
import "@/styles/pages.css";

/**
 * Generate site-wide SEO metadata from CMS settings.
 * Individual pages can override title/description via their own generateMetadata.
 */
export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await cms<SiteSettings>("/settings");
    return {
      title: {
        default: settings.seo.default_title,
        template: settings.seo.title_template,
      },
      description: settings.seo.default_description,
      openGraph: {
        siteName: settings.site.name,
        images: settings.seo.default_og_image
          ? [settings.seo.default_og_image]
          : [],
      },
    };
  } catch {
    return { title: "Bravo Template" };
  }
}

/**
 * Convert CMS design settings into CSS custom properties.
 * These get applied to the <html> element and cascade to all components.
 * This is how the CMS controls the site's visual appearance without
 * any code changes — update colors/fonts in the CMS and the site updates.
 */
function buildDesignTokens(settings: SiteSettings): Record<string, string> {
  const { design } = settings;
  const tokens: Record<string, string> = {};

  // Brand colors → CSS custom properties used throughout all stylesheets
  if (design?.colors) {
    tokens["--color-accent"] = design.colors.brand;
    tokens["--color-accent-light"] = design.colors.accentLight;
    tokens["--color-accent-dark"] = design.colors.accentDark;
    tokens["--color-page-bg"] = design.colors.pageBg;
    tokens["--color-bg-light"] = design.colors.bgTextLight;
    tokens["--color-bg-dark"] = design.colors.bgTextDark;
  }

  // Typography → font family CSS variables (Google Fonts loaded dynamically below)
  if (design?.typography) {
    if (design.typography.h1?.fontFamily) {
      tokens["--font-heading"] = `"${design.typography.h1.fontFamily}", sans-serif`;
    }
    if (design.typography.body?.fontFamily) {
      tokens["--font-body"] = `"${design.typography.body.fontFamily}", sans-serif`;
    }
  }

  // Button presets → CSS variables used by .btn class in pages.css
  if (design?.buttons?.primary) {
    const btn = design.buttons.primary;
    tokens["--btn-primary-bg"] = btn.fillColor;
    tokens["--btn-primary-bg-hover"] = btn.fillColorHover;
    tokens["--btn-primary-text"] = btn.textColor;
    tokens["--btn-primary-radius"] = btn.borderRadius + "px";
  }

  return tokens;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings: SiteSettings | null = null;
  let headerNav: NavItem[] = [];

  // Fetch settings and navigation in parallel for performance
  try {
    [settings, { navigation: headerNav }] = await Promise.all([
      cms<SiteSettings>("/settings"),
      cms<{ navigation: NavItem[] }>("/navigation", { location: "header" }),
    ]);
  } catch (e) {
    console.error("Failed to fetch CMS data:", e);
  }

  // Build CSS custom properties from CMS design tokens
  const designTokens = settings ? buildDesignTokens(settings) : {};
  const styleString = Object.entries(designTokens)
    .map(([k, v]) => `${k}: ${v}`)
    .join("; ");

  // Dynamically build Google Fonts URL from all font families used in CMS typography.
  // This is why we can't use next/font — fonts are configured in the CMS at runtime,
  // not known at build time.
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
              `family=${f.replace(/\s+/g, "+")}:wght@400;500;600;700;800`
          )
          .join("&")}&display=swap`
      : null;

  return (
    <html lang="en" style={designTokens as React.CSSProperties}>
      <head>
        {/* Google Fonts — loaded dynamically based on CMS typography settings */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {fontsUrl && <link rel="stylesheet" href={fontsUrl} />}

        {/* Font Awesome icons — used for nav icons, social links, UI elements */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />

        {/* Favicon from CMS business logos */}
        {settings?.business?.logos?.favicon && (
          <link rel="icon" href={settings.business.logos.favicon} />
        )}
      </head>
      <body>
        {/* Site header with navigation — see Header.tsx for details */}
        {settings && <Header nav={headerNav} settings={settings} />}
        <main>{children}</main>
      </body>
    </html>
  );
}

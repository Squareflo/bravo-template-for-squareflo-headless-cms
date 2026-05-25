/**
 * Root Layout — SquarefloCMS Bravo Template
 * ============================================
 * Powered by SquarefloCMS (https://squareflo.com) — free headless CMS for developers.
 *
 * Minimal root layout that provides design tokens, fonts, and favicon.
 * The header/nav is NOT rendered here — it lives in the (main) group layout.
 * This allows auth pages (sign-in) to have a completely standalone layout
 * without the site header or footer.
 *
 * Route groups:
 *   (main) — standard pages with header/nav (home, [slug], etc.)
 *   (auth) — standalone auth pages (sign-in) without header/nav
 */

import type { Metadata } from "next";
import { cms } from "@/lib/cms";
import { SiteSettings } from "@/lib/types";
import { buildDesignTokens, buildGoogleFontsUrl } from "@/lib/design-tokens";
import "@/styles/globals.css";
import "@/styles/header.css";
import "@/styles/pages.css";
import "@/styles/auth.css";
import "@/styles/footer.css";
import "@/styles/blog.css";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await cms<SiteSettings>("/settings");
    const ogImage = settings.seo.default_og_image
      || settings.business?.logos?.square
      || undefined;

    return {
      title: {
        default: settings.seo.default_title,
        template: settings.seo.title_template,
      },
      description: settings.seo.default_description,
      openGraph: {
        siteName: settings.site.name,
        images: ogImage ? [ogImage] : [],
      },
    };
  } catch {
    return { title: "Bravo Template" };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings: SiteSettings | null = null;

  try {
    settings = await cms<SiteSettings>("/settings");
  } catch (e) {
    console.error("Failed to fetch CMS settings:", e);
  }

  const designTokens = settings ? buildDesignTokens(settings) : {};
  const fontsUrl = settings ? buildGoogleFontsUrl(settings) : null;

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
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        {settings?.business?.logos?.favicon && (
          <link rel="icon" href={settings.business.logos.favicon} />
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}

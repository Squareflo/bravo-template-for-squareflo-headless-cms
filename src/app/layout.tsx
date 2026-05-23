import type { Metadata } from "next";
import { cms } from "@/lib/cms";
import { NavItem, SiteSettings } from "@/lib/types";
import Header from "@/components/Header";
import "@/styles/globals.css";
import "@/styles/header.css";
import "@/styles/pages.css";

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

function buildDesignTokens(settings: SiteSettings): Record<string, string> {
  const { design } = settings;
  const tokens: Record<string, string> = {};

  if (design?.colors) {
    tokens["--color-accent"] = design.colors.brand;
    tokens["--color-accent-light"] = design.colors.accentLight;
    tokens["--color-accent-dark"] = design.colors.accentDark;
    tokens["--color-page-bg"] = design.colors.pageBg;
    tokens["--color-bg-light"] = design.colors.bgTextLight;
    tokens["--color-bg-dark"] = design.colors.bgTextDark;
  }

  if (design?.typography) {
    if (design.typography.h1?.fontFamily) {
      tokens["--font-heading"] = `"${design.typography.h1.fontFamily}", sans-serif`;
    }
    if (design.typography.body?.fontFamily) {
      tokens["--font-body"] = `"${design.typography.body.fontFamily}", sans-serif`;
    }
  }

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

  try {
    [settings, { navigation: headerNav }] = await Promise.all([
      cms<SiteSettings>("/settings"),
      cms<{ navigation: NavItem[] }>("/navigation", { location: "header" }),
    ]);
  } catch (e) {
    console.error("Failed to fetch CMS data:", e);
  }

  const designTokens = settings ? buildDesignTokens(settings) : {};
  const styleString = Object.entries(designTokens)
    .map(([k, v]) => `${k}: ${v}`)
    .join("; ");

  // Build Google Fonts URL from typography settings
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
      <body>
        {settings && <Header nav={headerNav} settings={settings} />}
        <main>{children}</main>
      </body>
    </html>
  );
}

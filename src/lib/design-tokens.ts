/**
 * CMS Design Token Builder — SquarefloCMS Bravo Template
 * ========================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Shared helper that converts CMS design settings into CSS custom properties.
 * Used by both the main layout and the auth layout so design tokens are
 * consistent across all pages.
 *
 * Font resolution: individual typography presets may have an explicit fontFamily,
 * or may leave it empty — in which case we fall back to the site-level
 * font_families list (design.font_families). The first entry is used as
 * the default for both heading and body unless a preset overrides it.
 */

import { SiteSettings } from "@/lib/types";

function mapTypography(
  prefix: string,
  t: Record<string, any> | undefined,
  tokens: Record<string, string>,
  defaultFont: string,
) {
  if (!t) return;
  if (t.size) tokens[`${prefix}-size`] = t.size + "px";
  if (t.weight) tokens[`${prefix}-weight`] = t.weight === "regular" ? "400" : t.weight;
  const family = t.fontFamily || defaultFont;
  if (family) tokens[`${prefix}-family`] = `"${family}", sans-serif`;
  if (t.lineHeight) tokens[`${prefix}-line-height`] = String(t.lineHeight);
  if (t.letterSpacing) tokens[`${prefix}-letter-spacing`] = t.letterSpacing + "px";
  if (t.textCase && t.textCase !== "none") tokens[`${prefix}-text-transform`] = t.textCase;
  if (t.colorLight) tokens[`${prefix}-color`] = t.colorLight;
  if (t.colorDark) tokens[`${prefix}-color-dark`] = t.colorDark;
}

export function buildDesignTokens(settings: SiteSettings): Record<string, string> {
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

  // Site-level default font — first entry in font_families list
  const siteFont = design?.font_families?.[0] || "";

  const typo = design?.typography;
  if (typo) {
    const headingFont = typo.h1?.fontFamily || siteFont;
    const bodyPreset = typo.text || typo.body;
    const bodyFont = bodyPreset?.fontFamily || siteFont;

    if (headingFont) {
      tokens["--font-heading"] = `"${headingFont}", sans-serif`;
    }
    if (bodyFont) {
      tokens["--font-body"] = `"${bodyFont}", sans-serif`;
    }

    mapTypography("--nav-tab", typo.navTabsText, tokens, siteFont);
    mapTypography("--nav-dropdown", typo.navDropdownText, tokens, siteFont);
    mapTypography("--nav-mobile-tab", typo.navMobileTabsText, tokens, siteFont);
    mapTypography("--nav-drawer-heading", typo.navDrawerHeading, tokens, siteFont);
    mapTypography("--typo-h1", typo.h1, tokens, headingFont);
    mapTypography("--typo-h2", typo.h2, tokens, headingFont);
    mapTypography("--typo-body", typo.text, tokens, bodyFont);
    mapTypography("--typo-link", typo.link, tokens, bodyFont);
    mapTypography("--typo-subtitle", typo.subtitle, tokens, bodyFont);
    mapTypography("--typo-small", typo.smallText, tokens, bodyFont);
    mapTypography("--typo-caption", typo.caption, tokens, bodyFont);
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

export function buildGoogleFontsUrl(settings: SiteSettings): string | null {
  const fontFamilies = new Set<string>();

  // Add site-level font families
  if (settings?.design?.font_families) {
    settings.design.font_families.forEach((f) => {
      if (f) fontFamilies.add(f);
    });
  }

  // Add any per-preset overrides
  if (settings?.design?.typography) {
    Object.values(settings.design.typography).forEach((t) => {
      if (t?.fontFamily) fontFamilies.add(t.fontFamily);
    });
  }

  return fontFamilies.size > 0
    ? `https://fonts.googleapis.com/css2?${[...fontFamilies]
        .map((f) => `family=${f.replace(/\s+/g, "+")}:wght@400;500;600;700;800`)
        .join("&")}&display=swap`
    : null;
}

/**
 * CMS Design Token Builder — SquarefloCMS Bravo Template
 * ========================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Shared helper that converts CMS design settings into CSS custom properties.
 * Used by both the main layout and the auth layout so design tokens are
 * consistent across all pages.
 */

import { SiteSettings } from "@/lib/types";

function mapTypography(prefix: string, t: Record<string, any> | undefined, tokens: Record<string, string>) {
  if (!t) return;
  if (t.size) tokens[`${prefix}-size`] = t.size + "px";
  if (t.weight) tokens[`${prefix}-weight`] = t.weight === "regular" ? "400" : t.weight;
  if (t.fontFamily) tokens[`${prefix}-family`] = `"${t.fontFamily}", sans-serif`;
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

  const typo = design?.typography;
  if (typo) {
    if (typo.h1?.fontFamily) {
      tokens["--font-heading"] = `"${typo.h1.fontFamily}", sans-serif`;
    }
    const bodyPreset = typo.text || typo.body;
    if (bodyPreset?.fontFamily) {
      tokens["--font-body"] = `"${bodyPreset.fontFamily}", sans-serif`;
    }

    mapTypography("--nav-tab", typo.navTabsText, tokens);
    mapTypography("--nav-dropdown", typo.navDropdownText, tokens);
    mapTypography("--nav-mobile-tab", typo.navMobileTabsText, tokens);
    mapTypography("--nav-drawer-heading", typo.navDrawerHeading, tokens);
    mapTypography("--typo-h1", typo.h1, tokens);
    mapTypography("--typo-h2", typo.h2, tokens);
    mapTypography("--typo-body", typo.text, tokens);
    mapTypography("--typo-link", typo.link, tokens);
    mapTypography("--typo-subtitle", typo.subtitle, tokens);
    mapTypography("--typo-small", typo.smallText, tokens);
    mapTypography("--typo-caption", typo.caption, tokens);
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

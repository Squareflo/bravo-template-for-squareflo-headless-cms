/**
 * SquarefloCMS API Type Definitions
 * ===================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * TypeScript interfaces for all data shapes returned by the SquarefloCMS
 * headless API. These match the JSON responses from:
 *   - GET /settings      → SiteSettings
 *   - GET /navigation    → NavItem[]
 *   - GET /pages         → pages with headless_content blocks
 *
 * If the CMS adds new fields, update these interfaces to match.
 * Check the CMS API documentation for the latest field definitions.
 */

/** Navigation item — returned by GET /navigation?location=header|footer */
export interface NavItem {
  id: string;
  label: string;
  type: string;
  url: string;
  open_in_new_tab: boolean;
  location: "header" | "footer";
  sort_order: number;
  children: NavItem[]; // Nested items for dropdown menus
}

/** Social link — returned in GET /settings → social_links[] */
export interface SocialLink {
  platform: string;   // e.g., "facebook", "x", "instagram", "linkedin", "youtube", "tiktok"
  label: string;      // Display name, e.g., "X (Twitter)"
  url: string;        // Full URL to the social profile
  icon: string | null; // Custom FA icon class override, null = use default for platform
}

/** Root settings object — returned by GET /settings */
export interface SiteSettings {
  social_links: SocialLink[];
  site: {
    name: string;
    domain: string;
    description: string;
  };
  business: {
    name: string;
    short_description: string;
    phone: string;
    email: string;
    timezone: string;
    location_count: number;
    locations: Location[];
    logos: {
      rectangular: string; // Main logo (used in nav bar)
      square: string;      // Square logo (used for favicons, social)
      favicon: string;     // Browser tab icon
    };
  };
  design: {
    colors: {
      brand: string;        // Primary accent color (→ --color-accent)
      accentLight: string;  // Light accent variant
      accentDark: string;   // Dark accent variant
      bgTextLight: string;  // Light background for text sections
      bgTextDark: string;   // Dark background for text sections
      pageBg: string;       // Page background color
      [key: string]: string; // Additional custom colors from CMS
    };
    typography: Record<string, TypographyToken>; // Keys: h1, h2, h3, body, etc.
    buttons: Record<string, ButtonToken>;        // Keys: primary, secondary, etc.
    forms: FormToken;
  };
  seo: {
    default_title: string;
    title_template: string;       // e.g., "%s | Site Name"
    default_description: string;
    default_og_image: string;
  };
}

/** Physical business location — part of SiteSettings.business.locations[] */
export interface Location {
  id: string;
  name: string;
  street_address: string;
  unit: string;
  city: string;
  state_province: string;
  postal_code: string;
  phone: string;
  email: string;
  place_id: string | null;
  google_places: {
    rating: number;
    total_reviews: number;
    business_status: string;
    google_maps_url: string;
    website: string;
    phone: string;
    phone_international: string;
    hours: string[];       // e.g., ["Monday: 9:00 AM – 5:00 PM", ...]
    open_now: boolean;
    types: string[];
    lat: number;
    lng: number;
  } | null;
}

/** Typography design token — one per text style (h1, h2, body, etc.) */
export interface TypographyToken {
  fontFamily: string;      // Google Font name, e.g., "Quicksand"
  weight: string;
  size: number;
  lineHeight: number;
  letterSpacing: number;
  textCase: string;
  colorLight: string;
  colorDark: string;
  colorMode: string;
}

/** Button design token — defines appearance for button presets */
export interface ButtonToken {
  fillColor: string;       // → --btn-primary-bg
  fillColorHover: string;  // → --btn-primary-bg-hover
  textColor: string;       // → --btn-primary-text
  textColorHover: string;
  borderWidth: number;
  borderColor: string;
  borderColorHover: string;
  borderRadius: number;    // → --btn-primary-radius
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  paddingH: number;
  paddingV: number;
  textCase: string;
}

/** Form styling token — defines appearance for form fields */
export interface FormToken {
  fieldBgColor: string;
  fieldBorderColor: string;
  fieldBorderColorFocus: string;
  fieldTextColor: string;
  fieldFontFamily: string;
  fieldFontSize: number;
  fieldFontWeight: string;
  fieldHeight: number;
  fieldBorderRadius: number;
  fieldPaddingH: number;
  placeholderColor: string;
  labelColor: string;
  labelFontFamily: string;
  labelFontSize: number;
  labelFontWeight: string;
  wrapperBgColor: string;
  wrapperBgOpacity: number;
  fieldBgOpacity: number;
  submitButtonPreset: string;
}

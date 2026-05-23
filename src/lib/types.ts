export interface NavItem {
  id: string;
  label: string;
  type: string;
  url: string;
  open_in_new_tab: boolean;
  location: "header" | "footer";
  sort_order: number;
  children: NavItem[];
}

export interface SiteSettings {
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
      rectangular: string;
      square: string;
      favicon: string;
    };
  };
  design: {
    colors: {
      brand: string;
      accentLight: string;
      accentDark: string;
      bgTextLight: string;
      bgTextDark: string;
      pageBg: string;
    };
    typography: Record<string, TypographyToken>;
    buttons: Record<string, ButtonToken>;
    forms: FormToken;
  };
  seo: {
    default_title: string;
    title_template: string;
    default_description: string;
    default_og_image: string;
  };
}

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
    hours: string[];
    open_now: boolean;
    types: string[];
    lat: number;
    lng: number;
  } | null;
}

export interface TypographyToken {
  fontFamily: string;
  weight: string;
  size: number;
  lineHeight: number;
  letterSpacing: number;
  textCase: string;
  colorLight: string;
  colorDark: string;
  colorMode: string;
}

export interface ButtonToken {
  fillColor: string;
  fillColorHover: string;
  textColor: string;
  textColorHover: string;
  borderWidth: number;
  borderColor: string;
  borderColorHover: string;
  borderRadius: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  paddingH: number;
  paddingV: number;
  textCase: string;
}

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

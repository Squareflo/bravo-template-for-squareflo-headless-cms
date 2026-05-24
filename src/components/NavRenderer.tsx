// NavRenderer — renders all navigation variations (V1-V12, except V9)
// based on edit mode context settings, replacing Header.tsx as primary nav renderer.

"use client";

import Link from "next/link";
import { NavItem, SiteSettings, SocialLink } from "@/lib/types";
import MobileNav from "./MobileNav";
import { useEditMode } from "./EditModeProvider";

interface NavRendererProps {
  nav: NavItem[];
  settings: SiteSettings;
}

const SOCIAL_ICONS: Record<string, string> = {
  facebook: "fab fa-facebook-f",
  instagram: "fab fa-instagram",
  x: "fab fa-x-twitter",
  twitter: "fab fa-x-twitter",
  linkedin: "fab fa-linkedin-in",
  youtube: "fab fa-youtube",
  tiktok: "fab fa-tiktok",
  pinterest: "fab fa-pinterest-p",
  snapchat: "fab fa-snapchat",
  threads: "fab fa-threads",
  whatsapp: "fab fa-whatsapp",
  yelp: "fab fa-yelp",
  google: "fab fa-google",
};

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function hexToLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function hexToRgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

function Logo({ prefix, url, name }: { prefix: string; url?: string; name: string }) {
  return (
    <Link href="/" className={`${prefix}-logo`}>
      {url ? (
        <img src={url} alt={name} className={`${prefix}-logo__img`} />
      ) : (
        <span className={`${prefix}-logo__text`}>{name}</span>
      )}
    </Link>
  );
}

function NLink({
  item,
  className,
  children,
}: {
  item: NavItem;
  className: string;
  children: React.ReactNode;
}) {
  if (!item.url) {
    return <span className={`${className} ${className}--disabled`}>{children}</span>;
  }
  return (
    <a
      href={item.url}
      className={className}
      target={item.open_in_new_tab ? "_blank" : undefined}
      rel={item.open_in_new_tab ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
}

function NavList({
  items,
  prefix,
  textStyle,
}: {
  items: NavItem[];
  prefix: string;
  textStyle?: React.CSSProperties;
}) {
  return (
    <>
      {items.map((item) => (
        <li key={item.id} className={`${prefix}-item`}>
          {item.children.length > 0 ? (
            <>
              <NLink item={item} className={`${prefix}-link`}>
                <span style={textStyle}>
                  {item.label}{" "}
                  <i
                    className={`fas fa-caret-down ${prefix}-caret`}
                    style={{ fontSize: "0.65rem" }}
                  />
                </span>
              </NLink>
              <ul className={`${prefix}-dropdown`}>
                {item.children.map((child) => (
                  <li key={child.id}>
                    <NLink item={child} className={`${prefix}-dropdown__link`}>
                      {child.label}
                    </NLink>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <NLink item={item} className={`${prefix}-link`}>
              <span style={textStyle}>{item.label}</span>
            </NLink>
          )}
        </li>
      ))}
    </>
  );
}

function SocialLinks({
  links,
  prefix,
  textStyle,
}: {
  links: SocialLink[];
  prefix: string;
  textStyle?: React.CSSProperties;
}) {
  if (!links.length) return null;
  return (
    <>
      {links.map((link) => (
        <a
          key={link.platform}
          href={link.url}
          className={`${prefix}-social__link`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          style={textStyle}
        >
          <i className={link.icon || SOCIAL_ICONS[link.platform] || "fas fa-link"} />
        </a>
      ))}
    </>
  );
}

export default function NavRenderer({ nav, settings }: NavRendererProps) {
  const editCtx = useEditMode();

  const navSettings = editCtx?.settings.navigation;
  const variation = (navSettings?.variation as string) || "v3";
  const bgColor = navSettings?.bgColor || "";
  const utilityBgColor = navSettings?.utilityBgColor || "";
  const overlayMode = navSettings?.overlayMode || "above";
  const mainBarOpacity = navSettings?.mainBarOpacity ?? 100;
  const utilityBarOpacity = navSettings?.utilityBarOpacity ?? 100;
  const ctaPreset1Key = navSettings?.ctaPreset1 || "primary";
  const ctaPreset2Key = navSettings?.ctaPreset2 || "secondary";
  const buttonPresets = editCtx?.buttonPresets || [];

  // --- Compute navigation data ---
  const { business } = settings;
  const primary = business.locations[0];
  const phone = primary?.phone || business.phone;

  let hoursText = "";
  if (primary?.google_places?.hours) {
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const today = dayNames[new Date().getDay()];
    const todayHours = primary.google_places.hours.find((h) =>
      h.startsWith(today)
    );
    if (todayHours) {
      const timeRange = todayHours.split(": ")[1];
      if (timeRange && timeRange !== "Closed") {
        const closingTime =
          timeRange.split(" – ")[1] || timeRange.split(" - ")[1];
        hoursText = closingTime ? `Open until ${closingTime} today` : timeRange;
      } else {
        hoursText = "Closed today";
      }
    }
  }

  const logoUrl = business.logos?.rectangular;
  const logoName = business.name;
  const socialLinks = settings.social_links || [];
  const address = primary
    ? `${primary.street_address}, ${primary.city}, ${primary.state_province}`
    : "";

  // --- CTA counts per variation ---
  let ctaCount = 0;
  switch (variation) {
    case "v1":
    case "v3":
    case "v6":
    case "v12":
      ctaCount = 1;
      break;
    case "v8":
    case "v11":
      ctaCount = 2;
      break;
    case "v2":
    case "v4":
    case "v7":
    case "v10":
      ctaCount = 0;
      break;
    default:
      ctaCount = 1;
      break;
  }

  const safeCtaCount = Math.min(ctaCount, nav.length);
  const regularItems = nav.slice(0, nav.length - safeCtaCount);
  const ctaItems = safeCtaCount > 0 ? nav.slice(nav.length - safeCtaCount) : [];

  // --- Style overrides ---
  const isOverlay = overlayMode === "overlay";

  const mainBarStyle: React.CSSProperties = {};
  if (bgColor && isOverlay && mainBarOpacity < 100) {
    mainBarStyle.background = hexToRgba(bgColor, mainBarOpacity / 100);
  } else if (bgColor) {
    mainBarStyle.background = bgColor;
  } else if (isOverlay && mainBarOpacity < 100) {
    // No custom color — fade the default bg (assume dark ~#1a1a2e)
    mainBarStyle.background = `rgba(0,0,0,${mainBarOpacity / 100})`;
  }
  const hasMainBarStyle = Object.keys(mainBarStyle).length > 0;

  const computedTextColor = bgColor
    ? hexToLuminance(bgColor) > 0.5
      ? "#333"
      : "#fff"
    : isOverlay
      ? "#fff"
      : undefined;

  const textStyle: React.CSSProperties | undefined = computedTextColor
    ? { color: computedTextColor }
    : undefined;

  const utilityBarStyle: React.CSSProperties = {};
  if (utilityBgColor && isOverlay && utilityBarOpacity < 100) {
    utilityBarStyle.background = hexToRgba(utilityBgColor, utilityBarOpacity / 100);
  } else if (utilityBgColor) {
    utilityBarStyle.background = utilityBgColor;
  } else if (isOverlay && utilityBarOpacity < 100) {
    utilityBarStyle.background = `rgba(0,0,0,${utilityBarOpacity / 100})`;
  }
  const hasUtilityBarStyle = Object.keys(utilityBarStyle).length > 0;

  const computedUtilityTextColor = utilityBgColor
    ? hexToLuminance(utilityBgColor) > 0.5
      ? "#333"
      : "#fff"
    : isOverlay
      ? "#fff"
      : undefined;

  const utilityTextStyle: React.CSSProperties | undefined = computedUtilityTextColor
    ? { color: computedUtilityTextColor }
    : undefined;

  if (computedUtilityTextColor) {
    utilityBarStyle.color = computedUtilityTextColor;
  }
  if (hasUtilityBarStyle) {
    utilityBarStyle.borderBottom = "none";
  }

  // Prefix for class names
  const prefixMap: Record<string, string> = {
    v1: "nv1",
    v2: "nv2",
    v3: "nv3",
    v4: "nv4",
    v6: "nv6",
    v7: "nv7",
    v8: "nv8",
    v10: "nv10",
    v11: "nv11",
    v12: "nv12",
  };
  const prefix = prefixMap[variation] || "nv3";

  // Common MobileNav props
  const mobileNavProps = {
    nav,
    businessName: logoName,
    phone,
    hoursText,
    socialLinks,
    ctaCount: safeCtaCount,
    hamburgerClass: `${prefix}-hamburger`,
  };

  // --- Overlay wrapper ---
  function wrapOverlay(header: React.ReactElement) {
    if (!isOverlay) return header;
    return (
      <div className="nav-overlay-wrap">
        {header}
      </div>
    );
  }

  // --- CTA preset styles ---
  const preset1 = buttonPresets.find((p) => p.key === ctaPreset1Key);
  const preset2 = buttonPresets.find((p) => p.key === ctaPreset2Key);

  function ctaStyle(preset: typeof preset1): React.CSSProperties | undefined {
    if (!preset) return undefined;
    return {
      background: preset.fillColor,
      color: preset.textColor,
      borderRadius: `${preset.borderRadius}px`,
      padding: `${preset.paddingV}px ${preset.paddingH}px`,
      border: preset.borderWidth
        ? `${preset.borderWidth}px solid ${preset.borderColor}`
        : "none",
      display: "inline-block",
      textDecoration: "none",
      lineHeight: "1.2",
      whiteSpace: "nowrap",
    };
  }

  const cta1Style = ctaStyle(preset1);
  const cta2Style = ctaStyle(preset2);

  // --- Variation renderers ---

  if (variation === "v1") {
    return wrapOverlay(
      <header className="nav-v1" style={hasMainBarStyle ? mainBarStyle : undefined}>
        <div className="nav-v1__inner">
          <Logo prefix="nv1" url={logoUrl} name={logoName} />
          <nav className="nv1-nav">
            <ul className="nv1-list">
              <NavList items={regularItems} prefix="nv1" textStyle={textStyle} />
              {ctaItems[0] && (
                <li className="nv1-item">
                  <NLink item={ctaItems[0]} className={cta1Style ? "nv1-link" : "nv1-link nv1-link--cta"}>
                    <span style={cta1Style || textStyle}>{ctaItems[0].label}</span>
                  </NLink>
                </li>
              )}
            </ul>
            <MobileNav {...mobileNavProps} />
          </nav>
        </div>
      </header>
    );
  }

  if (variation === "v2") {

    const half = Math.ceil(nav.length / 2);
    const leftItems = nav.slice(0, half);
    const rightItems = nav.slice(half);
    return wrapOverlay(
      <header className="nav-v2" style={hasMainBarStyle ? mainBarStyle : undefined}>
        <div className="nav-v2__inner">
          <ul className="nv2-list nv2-list--left">
            <NavList items={leftItems} prefix="nv2" textStyle={textStyle} />
          </ul>
          <Logo prefix="nv2" url={logoUrl} name={logoName} />
          <ul className="nv2-list nv2-list--right">
            <NavList items={rightItems} prefix="nv2" textStyle={textStyle} />
          </ul>
          <MobileNav {...mobileNavProps} />
        </div>
      </header>
    );
  }

  if (variation === "v3") {
    return wrapOverlay(
      <header className="nav-v3">
        <div className="nav-v3__utility" style={hasUtilityBarStyle ? utilityBarStyle : undefined}>
          <div className="nav-v3__utility-inner">
            <div className="nv3-utility-left" style={utilityTextStyle}>
              {phone && (
                <span>
                  <i className="fas fa-phone-alt" style={utilityTextStyle} /> {phone}
                </span>
              )}
              {hoursText && (
                <span>
                  <i className="far fa-clock" style={utilityTextStyle} /> {hoursText}
                </span>
              )}
            </div>
            <div className="nv3-utility-right">
              <div className="nv3-social">
                <SocialLinks links={socialLinks} prefix="nv3" />
              </div>
            </div>
          </div>
        </div>
        <div className="nav-v3__main" style={hasMainBarStyle ? mainBarStyle : undefined}>
          <div className="nav-v3__main-inner">
            <Logo prefix="nv3" url={logoUrl} name={logoName} />
            <nav className="nv3-nav">
              <ul className="nv3-list">
                <NavList items={regularItems} prefix="nv3" textStyle={textStyle} />
                {ctaItems[0] && (
                  <li className="nv3-item">
                    <NLink item={ctaItems[0]} className={cta1Style ? "nv3-link" : "nv3-link nv3-link--cta"}>
                      <span style={cta1Style || textStyle}>{ctaItems[0].label}</span>
                    </NLink>
                  </li>
                )}
              </ul>
              <MobileNav {...mobileNavProps} />
            </nav>
          </div>
        </div>
      </header>
    );
  }

  if (variation === "v4") {
    return wrapOverlay(
      <header className="nav-v4">
        <div className="nav-v4__utility" style={hasUtilityBarStyle ? utilityBarStyle : undefined}>
          <div className="nav-v4__utility-inner">
            <div className="nv4-utility-item" style={utilityTextStyle}>
              <i className="fas fa-map-marker-alt" style={utilityTextStyle} /> {address}
            </div>
            {hoursText && (
              <div className="nv4-utility-item" style={utilityTextStyle}>
                <i className="far fa-clock" style={utilityTextStyle} /> {hoursText}
              </div>
            )}
            {phone && (
              <div className="nv4-utility-item" style={utilityTextStyle}>
                <i className="fas fa-phone-alt" style={utilityTextStyle} />{" "}
                <a href={`tel:${phone.replace(/\D/g, "")}`} style={utilityTextStyle}>{phone}</a>
              </div>
            )}
          </div>
        </div>
        <div className="nav-v4__main" style={hasMainBarStyle ? mainBarStyle : undefined}>
          <div className="nav-v4__main-inner">
            <Logo prefix="nv4" url={logoUrl} name={logoName} />
            <nav className="nv4-nav">
              <ul className="nv4-list">
                <NavList items={nav} prefix="nv4" textStyle={textStyle} />
              </ul>
              <MobileNav {...mobileNavProps} />
            </nav>
          </div>
        </div>
      </header>
    );
  }

  if (variation === "v6") {
    return wrapOverlay(
      <header className="nav-v6" style={hasMainBarStyle ? mainBarStyle : undefined}>
        <div className="nav-v6__inner">
          <Logo prefix="nv6" url={logoUrl} name={logoName} />
          <nav className="nv6-nav">
            <ul className="nv6-list">
              <NavList items={regularItems} prefix="nv6" textStyle={textStyle} />
              {ctaItems[0] && (
                <li className="nv6-item">
                  <NLink item={ctaItems[0]} className={cta1Style ? "nv6-link" : "nv6-link nv6-link--cta"}>
                    <span style={cta1Style || textStyle}>{ctaItems[0].label}</span>
                  </NLink>
                </li>
              )}
            </ul>
            <MobileNav {...mobileNavProps} />
          </nav>
        </div>
      </header>
    );
  }

  if (variation === "v7") {
    const half = Math.ceil(nav.length / 2);
    const leftItems = nav.slice(0, half);
    const rightItems = nav.slice(half);
    return wrapOverlay(
      <header className="nav-v7">
        <div className="nav-v7__utility" style={hasUtilityBarStyle ? utilityBarStyle : undefined}>
          <div className="nav-v7__utility-inner">
            <div className="nv7-utility-left" style={utilityTextStyle}>
              {phone && (
                <span>
                  <i className="fas fa-phone-alt" style={utilityTextStyle} /> {phone}
                </span>
              )}
              {hoursText && (
                <span>
                  <i className="far fa-clock" style={utilityTextStyle} /> {hoursText}
                </span>
              )}
            </div>
            <div className="nv7-utility-right">
              <div className="nv7-social">
                <SocialLinks links={socialLinks} prefix="nv7" />
              </div>
            </div>
          </div>
        </div>
        <div className="nav-v7__main" style={hasMainBarStyle ? mainBarStyle : undefined}>
          <div className="nav-v7__main-inner">
            <ul className="nv7-list nv7-list--left">
              <NavList items={leftItems} prefix="nv7" textStyle={textStyle} />
            </ul>
            <Logo prefix="nv7" url={logoUrl} name={logoName} />
            <ul className="nv7-list nv7-list--right">
              <NavList items={rightItems} prefix="nv7" textStyle={textStyle} />
            </ul>
            <MobileNav {...mobileNavProps} />
          </div>
        </div>
      </header>
    );
  }

  if (variation === "v8") {
    return wrapOverlay(
      <header className="nav-v8" style={hasMainBarStyle ? mainBarStyle : undefined}>
        <div className="nav-v8__inner">
          <div className="nav-v8__brand">
            <Logo prefix="nv8" url={logoUrl} name={logoName} />
            <div className="nv8-contact-stack">
              {address && (
                <div className="nv8-contact-line">
                  <i className="fas fa-map-marker-alt" /> {address}
                </div>
              )}
              <div className="nv8-contact-line">
                <i className="fas fa-phone-alt" /> {phone}
                {hoursText ? ` \u00B7 ${hoursText}` : ""}
              </div>
            </div>
          </div>
          <div className="nav-v8__nav-wrap">
            <nav className="nv8-nav">
              <ul className="nv8-list">
                <NavList items={regularItems} prefix="nv8" textStyle={textStyle} />
              </ul>
            </nav>
            <div className="nav-v8__actions">
              <div className="nv8-social">
                <SocialLinks links={socialLinks} prefix="nv8" />
              </div>
              {ctaItems[0] && (
                <NLink item={ctaItems[0]} className={cta1Style ? "" : "btn btn--sm btn--secondary"}>
                  <span style={cta1Style}>{ctaItems[0].label}</span>
                </NLink>
              )}
              {ctaItems[1] && (
                <NLink item={ctaItems[1]} className={cta2Style ? "" : "btn btn--sm"}>
                  <span style={cta2Style}>{ctaItems[1].label}</span>
                </NLink>
              )}
            </div>
          </div>
          <MobileNav {...mobileNavProps} />
        </div>
      </header>
    );
  }

  if (variation === "v10") {
    return wrapOverlay(
      <header className="nav-v10" style={hasMainBarStyle ? mainBarStyle : undefined}>
        <div className="nav-v10__inner">
          <Logo prefix="nv10" url={logoUrl} name={logoName} />
          <nav className="nv10-nav">
            <ul className="nv10-list">
              <NavList items={nav} prefix="nv10" textStyle={textStyle} />
            </ul>
          </nav>
          {phone && (
            <div className="nv10-phone">
              <div className="nv10-phone__group">
                <span className="nv10-phone__label" style={textStyle}>
                  Call us today
                </span>
                <a
                  href={`tel:${phone.replace(/\D/g, "")}`}
                  className="nv10-phone__number"
                  style={textStyle}
                >
                  {phone}
                </a>
              </div>
              <a
                href={`tel:${phone.replace(/\D/g, "")}`}
                className="btn nv10-phone__cta"
              >
                <i className="fas fa-phone-alt" /> Call Now
              </a>
            </div>
          )}
          <MobileNav {...mobileNavProps} />
        </div>
      </header>
    );
  }

  if (variation === "v11") {
    return wrapOverlay(
      <header className="nav-v11" style={hasMainBarStyle ? mainBarStyle : undefined}>
        <div className="nav-v11__inner">
          <Logo prefix="nv11" url={logoUrl} name={logoName} />
          <nav className="nv11-nav">
            <ul className="nv11-list">
              <NavList items={regularItems} prefix="nv11" textStyle={textStyle} />
              {ctaItems[0] && (
                <li className="nv11-item">
                  <NLink
                    item={ctaItems[0]}
                    className={cta1Style ? "nv11-link" : "nv11-link nv11-link--cta-secondary"}
                  >
                    <span style={cta1Style}>{ctaItems[0].label}</span>
                  </NLink>
                </li>
              )}
              {ctaItems[1] && (
                <li className="nv11-item">
                  <NLink
                    item={ctaItems[1]}
                    className={cta2Style ? "nv11-link" : "nv11-link nv11-link--cta-primary"}
                  >
                    <span style={cta2Style}>{ctaItems[1].label}</span>
                  </NLink>
                </li>
              )}
            </ul>
            <MobileNav {...mobileNavProps} />
          </nav>
        </div>
      </header>
    );
  }

  if (variation === "v12") {
    const pillStyle: React.CSSProperties | undefined = hasMainBarStyle
      ? { ...mainBarStyle, borderRadius: "999px" }
      : undefined;
    return wrapOverlay(
      <div className="nav-v12-wrap">
        <header className="nav-v12" style={pillStyle}>
          <Logo prefix="nv12" url={logoUrl} name={logoName} />
          <nav className="nv12-nav">
            <ul className="nv12-list">
              <NavList items={regularItems} prefix="nv12" textStyle={textStyle} />
            </ul>
          </nav>
          {ctaItems[0] && (
            <NLink item={ctaItems[0]} className={cta1Style ? "nv12-cta" : "btn btn--sm nv12-cta"}>
              <span style={cta1Style ? { ...cta1Style, borderRadius: "100px" } : undefined}>{ctaItems[0].label}</span>
            </NLink>
          )}
          <MobileNav {...mobileNavProps} />
        </header>
      </div>
    );
  }

  // Fallback: render V3 (default)
  return wrapOverlay(
    <header className="nav-v3">
      <div className="nav-v3__utility" style={hasUtilityBarStyle ? utilityBarStyle : undefined}>
        <div className="nav-v3__utility-inner">
          <div className="nv3-utility-left" style={utilityTextStyle}>
            {phone && (
              <span>
                <i className="fas fa-phone-alt" style={utilityTextStyle} /> {phone}
              </span>
            )}
            {hoursText && (
              <span>
                <i className="far fa-clock" style={utilityTextStyle} /> {hoursText}
              </span>
            )}
          </div>
          <div className="nv3-utility-right">
            <div className="nv3-social">
              <SocialLinks links={socialLinks} prefix="nv3" />
            </div>
          </div>
        </div>
      </div>
      <div className="nav-v3__main" style={hasMainBarStyle ? mainBarStyle : undefined}>
        <div className="nav-v3__main-inner">
          <Logo prefix="nv3" url={logoUrl} name={logoName} />
          <nav className="nv3-nav">
            <ul className="nv3-list">
              <NavList items={regularItems} prefix="nv3" textStyle={textStyle} />
              {ctaItems[0] && (
                <li className="nv3-item">
                  <NLink item={ctaItems[0]} className="nv3-link nv3-link--cta">
                    <span style={textStyle}>{ctaItems[0].label}</span>
                  </NLink>
                </li>
              )}
            </ul>
            <MobileNav {...mobileNavProps} />
          </nav>
        </div>
      </div>
    </header>
  );
}

/**
 * Site Header — SquarefloCMS Bravo Template
 * ============================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * This is a server component that renders the site header on every page.
 * All data comes from the CMS — navigation items, business info, logos.
 *
 * Navigation Design — Hybrid of Two Variations:
 *   - TOP TIER: Variation #3's utility bar (dark strip with phone, hours, social)
 *     See html-reference/nav-showcase-r4m7t9w2qx.html → "Variation 3"
 *   - MAIN BAR: Variation #6's dark solid style (dark background, white links)
 *     See html-reference/nav-showcase-r4m7t9w2qx.html → "Variation 6"
 *
 * We combined these two variations because the utility bar from V3 provides
 * useful business info (phone, hours) while V6's dark solid main bar gives
 * a premium, grounded appearance. The CSS class names use the "nv3-" prefix
 * (from V3) throughout for consistency, but the main bar's visual styling
 * (dark background, white text) comes from V6.
 *
 * Features:
 *   - Phone number from CMS business locations or business.phone fallback
 *   - Dynamic open/closed hours from Google Places data (if connected)
 *   - Logo from CMS (image or text fallback)
 *   - Desktop dropdown menus for nav items with children
 *   - Defensive rendering: nav items with null/empty URLs render as <span>
 *   - Last nav item rendered as CTA button (V6 style)
 *   - Mobile hamburger menu (see MobileNav.tsx)
 *
 * Icons: Font Awesome 6 (CDN) — required for CMS-driven icon classes in nav items
 *
 * CSS: src/styles/header.css
 */

import Link from "next/link";
import { NavItem, SiteSettings, SocialLink } from "@/lib/types";
import MobileNav from "./MobileNav";
import AuthBar from "./AuthBar";

/** Map CMS platform slugs to Font Awesome icon classes */
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

interface HeaderProps {
  nav: NavItem[];
  settings: SiteSettings;
}

/**
 * Renders a nav link or a disabled span depending on whether the URL exists.
 * When URL is null/empty (placeholder, deleted page, half-finished CMS state),
 * renders a <span> with --disabled modifier instead of a broken <a>.
 */
function NavLink({
  item,
  className,
  children,
}: {
  item: NavItem;
  className: string;
  children: React.ReactNode;
}) {
  if (!item.url) {
    return (
      <span className={`${className} ${className}--disabled`}>
        {children}
      </span>
    );
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

export default function Header({ nav, settings }: HeaderProps) {
  const { business } = settings;
  const primary = business.locations[0];
  const phone = primary?.phone || business.phone;

  // Calculate today's business hours from Google Places data (if available).
  // This shows "Open until 5:00 PM today" or "Closed today" in the utility bar.
  let hoursText = "";
  if (primary?.google_places?.hours) {
    const now = new Date();
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const today = dayNames[now.getDay()];
    const todayHours = primary.google_places.hours.find((h) =>
      h.startsWith(today)
    );
    if (todayHours) {
      const timeRange = todayHours.split(": ")[1];
      if (timeRange && timeRange !== "Closed") {
        const closingTime = timeRange.split(" – ")[1] || timeRange.split(" - ")[1];
        hoursText = closingTime ? `Open until ${closingTime} today` : timeRange;
      } else {
        hoursText = "Closed today";
      }
    }
  }

  return (
    <header className="nav-v3">
      {/* Auth bar — shown when a CMS user is signed in */}
      <AuthBar />

      {/* ================================================================
          UTILITY BAR (top tier) — from Nav Variation #3
          Dark strip showing phone number, hours, and social links.
          See: html-reference/nav-showcase-r4m7t9w2qx.html → Variation 3
          ================================================================ */}
      <div className="nav-v3__utility">
        <div className="nav-v3__utility-inner">
          <div className="nv3-utility-left">
            {phone && (
              <span>
                <i className="fas fa-phone-alt" /> {phone}
              </span>
            )}
            {hoursText && (
              <span>
                <i className="far fa-clock" /> {hoursText}
              </span>
            )}
          </div>
          {settings.social_links?.length > 0 && (
            <div className="nv3-utility-right">
              <div className="nv3-social">
                {settings.social_links.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    className="nv3-social__link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                  >
                    <i className={link.icon || SOCIAL_ICONS[link.platform] || "fas fa-link"} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================================================================
          MAIN NAV BAR (bottom tier) — styled as Nav Variation #6 (Dark Solid)
          Dark background with white text and accent hover color.
          Uses V3 class names but V6 visual styling (see header.css).
          See: html-reference/nav-showcase-r4m7t9w2qx.html → Variation 6
          ================================================================ */}
      <div className="nav-v3__main">
        <div className="nav-v3__main-inner">
          {/* Logo — uses rectangular logo from CMS, falls back to business name text */}
          <Link href="/" className="nv3-logo">
            {business.logos?.rectangular ? (
              <img
                src={business.logos.rectangular}
                alt={business.name}
                className="nv3-logo__img"
              />
            ) : (
              <span className="nv3-logo__text">{business.name}</span>
            )}
          </Link>

          {/* Desktop navigation — items come from CMS GET /navigation?location=header */}
          <nav className="nv3-nav">
            <ul className="nv3-list">
              {nav.map((item, index) => {
                const isLast = index === nav.length - 1;
                const linkClass = `nv3-link${isLast ? " nv3-link--cta" : ""}`;
                return (
                  <li key={item.id} className="nv3-item">
                    {item.children.length > 0 ? (
                      <>
                        {/* Parent item with dropdown — shows caret icon */}
                        <NavLink item={item} className={linkClass}>
                          {item.label}{" "}
                          <i className="fas fa-caret-down nv3-caret" />
                        </NavLink>
                        {/* Dropdown menu — appears on hover (CSS-driven) */}
                        <ul className="nv3-dropdown">
                          {item.children.map((child) => (
                            <li key={child.id}>
                              <NavLink item={child} className="nv3-dropdown__link">
                                {child.label}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      /* Last item renders as CTA button (V6 style), rest are plain links */
                      <NavLink item={item} className={linkClass}>
                        {item.label}
                      </NavLink>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Mobile hamburger menu — only visible on screens < 768px */}
          <MobileNav
            nav={nav}
            businessName={business.name}
            phone={phone}
            hoursText={hoursText}
            socialLinks={settings.social_links || []}
          />
        </div>
      </div>
    </header>
  );
}

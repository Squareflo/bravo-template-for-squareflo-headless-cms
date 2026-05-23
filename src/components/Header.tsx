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
 *   - Mobile hamburger menu (see MobileNav.tsx)
 *
 * CSS: src/styles/header.css
 */

import Link from "next/link";
import { NavItem, SiteSettings } from "@/lib/types";
import MobileNav from "./MobileNav";

interface HeaderProps {
  nav: NavItem[];
  settings: SiteSettings;
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
          <div className="nv3-utility-right">
            <div className="nv3-social">
              {/* Social links would come from settings if available */}
            </div>
          </div>
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
                return (
                  <li key={item.id} className="nv3-item">
                    {item.children.length > 0 ? (
                      <>
                        {/* Parent item with dropdown — shows caret icon */}
                        <a
                          href={item.url || "#"}
                          className={`nv3-link${isLast ? " nv3-link--cta" : ""}`}
                          target={item.open_in_new_tab ? "_blank" : undefined}
                          rel={item.open_in_new_tab ? "noopener noreferrer" : undefined}
                        >
                          {item.label}{" "}
                          <i className="fas fa-caret-down nv3-caret" />
                        </a>
                        {/* Dropdown menu — appears on hover (CSS-driven) */}
                        <ul className="nv3-dropdown">
                          {item.children.map((child) => (
                            <li key={child.id}>
                              <a
                                href={child.url}
                                className="nv3-dropdown__link"
                                target={child.open_in_new_tab ? "_blank" : undefined}
                                rel={child.open_in_new_tab ? "noopener noreferrer" : undefined}
                              >
                                {child.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      /* Last item renders as CTA button (V6 style), rest are plain links */
                      <a
                        href={item.url}
                        className={`nv3-link${isLast ? " nv3-link--cta" : ""}`}
                        target={item.open_in_new_tab ? "_blank" : undefined}
                        rel={item.open_in_new_tab ? "noopener noreferrer" : undefined}
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Mobile hamburger menu — only visible on screens < 768px */}
          <MobileNav nav={nav} businessName={business.name} />
        </div>
      </div>
    </header>
  );
}

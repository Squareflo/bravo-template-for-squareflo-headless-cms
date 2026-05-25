/**
 * Mobile Navigation — SquarefloCMS Bravo Template
 * ==================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Client component ("use client") for the mobile hamburger menu.
 * This is the only client component in the header — everything else
 * is a server component for better performance and SEO.
 *
 * Features:
 *   - Hamburger button (hidden on desktop, visible on mobile via CSS)
 *   - Full-screen overlay with slide-in drawer from the right
 *   - Expandable sub-items for nav items with children
 *   - Auto-closes when a link is clicked
 *   - Defensive rendering: items with null/empty URLs render as <span>
 *   - aria-controls + aria-expanded for accessibility
 *
 * Icons: Font Awesome 6 (CDN) — bars, times, chevron-up, chevron-down
 *
 * CSS: src/styles/header.css (mobile-nav-overlay, mobile-nav__* classes)
 */

"use client";

import { useState, useEffect } from "react";
import { NavItem, SocialLink } from "@/lib/types";

const MOBILE_NAV_ID = "mobile-nav-drawer";

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

interface MobileNavProps {
  nav: NavItem[];
  businessName: string;
  phone?: string;
  hoursText?: string;
  socialLinks: SocialLink[];
  ctaCount?: number;
  hamburgerClass?: string;
}

export default function MobileNav({ nav, businessName, phone, hoursText, socialLinks, ctaCount = 1, hamburgerClass = "nv3-hamburger" }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "same-origin" })
      .then((res) => res.json())
      .then((data) => { if (data?.user?.id) setSignedIn(true); })
      .catch(() => {});
  }, []);

  function toggleExpanded(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <>
      {/* Hamburger button — hidden on desktop, shown on mobile (via CSS) */}
      <button
        className={hamburgerClass}
        aria-label="Menu"
        aria-expanded={open}
        aria-controls={MOBILE_NAV_ID}
        onClick={() => setOpen(!open)}
      >
        <i className={open ? "fas fa-times" : "fas fa-bars"} />
      </button>

      {/* Mobile menu overlay + drawer */}
      {open && (
        <div className="mobile-nav-overlay" onClick={() => setOpen(false)}>
          <nav
            id={MOBILE_NAV_ID}
            className="mobile-nav"
            onClick={(e) => e.stopPropagation()}
            aria-label={`${businessName} mobile navigation`}
          >
            <ul className="mobile-nav__list">
              {(() => {
                const safeCtaCount = Math.min(ctaCount, nav.length);
                const regularItems = safeCtaCount > 0 ? nav.slice(0, nav.length - safeCtaCount) : nav;
                const ctaItems = safeCtaCount > 0 ? nav.slice(nav.length - safeCtaCount) : [];
                return (
                  <>
                    {regularItems.map((item) => (
                      <li key={item.id} className="mobile-nav__item">
                        {item.children.length > 0 ? (
                          <>
                            <button
                              className="mobile-nav__link mobile-nav__link--parent"
                              onClick={() => toggleExpanded(item.id)}
                              aria-expanded={expandedIds.has(item.id)}
                            >
                              {item.label}
                              <i
                                className={`fas fa-chevron-${expandedIds.has(item.id) ? "up" : "down"} mobile-nav__chevron`}
                              />
                            </button>
                            {expandedIds.has(item.id) && (
                              <ul className="mobile-nav__sub">
                                {item.url && item.url !== "#" && (
                                  <li>
                                    <a
                                      href={item.url}
                                      className="mobile-nav__sub-link"
                                      onClick={() => setOpen(false)}
                                    >
                                      All {item.label}
                                    </a>
                                  </li>
                                )}
                                {item.children.map((child) => (
                                  <li key={child.id}>
                                    {child.url ? (
                                      <a
                                        href={child.url}
                                        className="mobile-nav__sub-link"
                                        target={child.open_in_new_tab ? "_blank" : undefined}
                                        rel={child.open_in_new_tab ? "noopener noreferrer" : undefined}
                                        onClick={() => setOpen(false)}
                                      >
                                        {child.label}
                                      </a>
                                    ) : (
                                      <span className="mobile-nav__sub-link mobile-nav__sub-link--disabled">
                                        {child.label}
                                      </span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </>
                        ) : item.url ? (
                          <a
                            href={item.url}
                            className="mobile-nav__link"
                            target={item.open_in_new_tab ? "_blank" : undefined}
                            rel={item.open_in_new_tab ? "noopener noreferrer" : undefined}
                            onClick={() => setOpen(false)}
                          >
                            {item.label}
                          </a>
                        ) : (
                          <span className="mobile-nav__link mobile-nav__link--disabled">
                            {item.label}
                          </span>
                        )}
                      </li>
                    ))}
                    {ctaItems.map((cta) => (
                      <li key={cta.id} className="mobile-nav__item mobile-nav__cta">
                        <a
                          href={signedIn ? "/my-account" : (cta.url || "/sign-in")}
                          className="btn btn--block"
                          onClick={() => setOpen(false)}
                        >
                          {signedIn ? "My Account" : cta.label}
                        </a>
                      </li>
                    ))}
                  </>
                );
              })()}
            </ul>

            {/* Utility bar info — phone, hours, social links (from top tier) */}
            {(phone || hoursText || socialLinks.length > 0) && (
              <div className="mobile-nav__utility">
                {phone && (
                  <div className="mobile-nav__utility-item">
                    <i className="fas fa-phone-alt" /> {phone}
                  </div>
                )}
                {hoursText && (
                  <div className="mobile-nav__utility-item">
                    <i className="far fa-clock" /> {hoursText}
                  </div>
                )}
                {socialLinks.length > 0 && (
                  <div className="mobile-nav__social">
                    {socialLinks.map((link) => (
                      <a
                        key={link.platform}
                        href={link.url}
                        className="mobile-nav__social-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.label}
                      >
                        <i className={link.icon || SOCIAL_ICONS[link.platform] || "fas fa-link"} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      )}
    </>
  );
}

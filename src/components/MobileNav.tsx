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
 *
 * The mobile nav design is custom — it wasn't taken from a specific HTML
 * mockup file, but follows the dark-drawer pattern common in the Bravo
 * template's mobile breakpoints (see html-reference/styles-r4m7t9w2qx.css
 * responsive sections).
 *
 * CSS: src/styles/header.css (mobile-nav-overlay, mobile-nav__* classes)
 */

"use client";

import { useState } from "react";
import { NavItem } from "@/lib/types";

interface MobileNavProps {
  nav: NavItem[];
  businessName: string;
}

export default function MobileNav({ nav, businessName }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

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
        className="nv3-hamburger"
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <i className={open ? "fas fa-times" : "fas fa-bars"} />
      </button>

      {/* Mobile menu overlay + drawer */}
      {open && (
        <div className="mobile-nav-overlay" onClick={() => setOpen(false)}>
          <nav
            className="mobile-nav"
            onClick={(e) => e.stopPropagation()}
            aria-label={`${businessName} mobile navigation`}
          >
            <ul className="mobile-nav__list">
              {nav.map((item) => (
                <li key={item.id} className="mobile-nav__item">
                  {item.children.length > 0 ? (
                    <>
                      {/* Parent item — tap to expand/collapse children */}
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
                      {/* Sub-items — shown when parent is expanded */}
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
                              <a
                                href={child.url}
                                className="mobile-nav__sub-link"
                                target={child.open_in_new_tab ? "_blank" : undefined}
                                rel={child.open_in_new_tab ? "noopener noreferrer" : undefined}
                                onClick={() => setOpen(false)}
                              >
                                {child.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    /* Simple nav link */
                    <a
                      href={item.url}
                      className="mobile-nav__link"
                      target={item.open_in_new_tab ? "_blank" : undefined}
                      rel={item.open_in_new_tab ? "noopener noreferrer" : undefined}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}

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
      <button
        className="nv3-hamburger"
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <i className={open ? "fas fa-times" : "fas fa-bars"} />
      </button>

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

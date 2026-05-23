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

  // Determine open/closed status text
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
      {/* Utility bar */}
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

      {/* Main nav bar */}
      <div className="nav-v3__main">
        <div className="nav-v3__main-inner">
          {/* Logo */}
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

          {/* Desktop nav */}
          <nav className="nv3-nav">
            <ul className="nv3-list">
              {nav.map((item) => (
                <li key={item.id} className="nv3-item">
                  {item.children.length > 0 ? (
                    <>
                      <a
                        href={item.url || "#"}
                        className="nv3-link"
                        target={item.open_in_new_tab ? "_blank" : undefined}
                        rel={item.open_in_new_tab ? "noopener noreferrer" : undefined}
                      >
                        {item.label}{" "}
                        <i className="fas fa-caret-down nv3-caret" />
                      </a>
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
                    <a
                      href={item.url}
                      className="nv3-link"
                      target={item.open_in_new_tab ? "_blank" : undefined}
                      rel={item.open_in_new_tab ? "noopener noreferrer" : undefined}
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile hamburger */}
          <MobileNav nav={nav} businessName={business.name} />
        </div>
      </div>
    </header>
  );
}

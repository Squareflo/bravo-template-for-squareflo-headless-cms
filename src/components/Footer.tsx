/**
 * Site Footer — SquarefloCMS Bravo Template
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Classic 4-column footer (FT1 from footer-showcase):
 *   Col 1: Logo, description, social links
 *   Col 2: Quick Links (footer nav from CMS)
 *   Col 3: Contact info (default location)
 *   Col 4: Newsletter signup
 *   Bottom bar: copyright + credit
 *
 * CSS: src/styles/footer.css
 */

"use client";

import Link from "next/link";
import { NavItem, SiteSettings, SocialLink, Location } from "@/lib/types";
import { useEditMode } from "./EditModeProvider";

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

interface FooterProps {
  nav: NavItem[];
  settings: SiteSettings;
}

function getDefaultLocation(locations: Location[]): Location | null {
  if (!locations.length) return null;
  return locations.find((l) => l.is_default) || locations[0];
}

function getHoursText(location: Location | null): string {
  if (!location?.google_places?.hours) return "";
  const dayNames = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday",
  ];
  const today = dayNames[new Date().getDay()];
  const todayHours = location.google_places.hours.find((h) =>
    h.startsWith(today)
  );
  if (!todayHours) return "";
  const timeRange = todayHours.split(": ")[1];
  if (!timeRange || timeRange === "Closed") return "Closed today";
  const closingTime = timeRange.split(" – ")[1] || timeRange.split(" - ")[1];
  return closingTime ? `Open until ${closingTime} today` : timeRange;
}

export default function Footer({ nav, settings }: FooterProps) {
  const editCtx = useEditMode();
  const footerSettings = editCtx?.settings.footer;
  const bgColor = footerSettings?.bgColor || "";

  const { business } = settings;
  const location = getDefaultLocation(business.locations);
  const phone = location?.phone || business.phone;
  const email = location?.email || "";
  const hoursText = getHoursText(location);
  const socialLinks = settings.social_links || [];
  const year = new Date().getFullYear();

  const footerStyle: React.CSSProperties | undefined = bgColor
    ? { background: bgColor }
    : undefined;

  return (
    <footer className="ft1" style={footerStyle}>
      <div className="ft1__inner">
        {/* Column 1: Brand */}
        <div className="ft1__col">
          <Link href="/" className="ft-logo">
            {business.logos?.rectangular ? (
              <img
                src={business.logos.rectangular}
                alt={business.name}
                className="ft-logo__img"
              />
            ) : (
              <span className="ft-logo__text ft-logo__text--light">
                {business.name}
              </span>
            )}
          </Link>
          {socialLinks.length > 0 && (
            <div className="ft1-social">
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  className="ft1-social__link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                >
                  <i
                    className={
                      link.icon ||
                      SOCIAL_ICONS[link.platform] ||
                      "fas fa-link"
                    }
                  />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Quick Links */}
        <div className="ft1__col">
          <h3 className="ft1__heading">Quick Links</h3>
          <ul className="ft1__list">
            {nav.map((item) => (
              <li key={item.id}>
                {item.url ? (
                  <a
                    href={item.url}
                    target={item.open_in_new_tab ? "_blank" : undefined}
                    rel={
                      item.open_in_new_tab ? "noopener noreferrer" : undefined
                    }
                  >
                    {item.label}
                  </a>
                ) : (
                  <span>{item.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div className="ft1__col">
          <h3 className="ft1__heading">Contact</h3>
          {location && (
            <p className="ft1__contact-line">
              <i className="fas fa-map-marker-alt" />
              <span>
                {location.street_address}
                {location.unit ? `, ${location.unit}` : ""}
                <br />
                {location.city}, {location.state_province}{" "}
                {location.postal_code}
              </span>
            </p>
          )}
          {phone && (
            <p className="ft1__contact-line">
              <i className="fas fa-phone-alt" />
              <a href={`tel:${phone.replace(/\D/g, "")}`}>{phone}</a>
            </p>
          )}
          {email && (
            <p className="ft1__contact-line">
              <i className="fas fa-envelope" />
              <a href={`mailto:${email}`}>{email}</a>
            </p>
          )}
          {hoursText && (
            <p className="ft1__contact-line">
              <i className="far fa-clock" />
              <span>{hoursText}</span>
            </p>
          )}
        </div>

        {/* Column 4: Newsletter */}
        <div className="ft1__col">
          <h3 className="ft1__heading">Newsletter</h3>
          <p className="ft1__text ft1__text--sm">
            Get our latest updates. No spam, ever.
          </p>
          <form
            className="ft1-newsletter"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              className="ft1-newsletter__input"
              placeholder="Email address"
              aria-label="Email"
            />
            <button type="submit" className="ft1-newsletter__btn">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="ft1__bottom">
        <div className="ft1__bottom-inner">
          <span>
            &copy; {year} {business.name}. All rights reserved.
          </span>
          <span>
            Built with{" "}
            <a
              href="https://squareflo.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Squareflo
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

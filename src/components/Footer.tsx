/**
 * Site Footer — SquarefloCMS Bravo Template
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Classic 5-column footer (FT1 from footer-showcase):
 *   Col 1: Logo, social links
 *   Col 2: Navigate (footer nav from CMS)
 *   Col 3: Contact info (selected location)
 *   Col 4: Hours (selected location)
 *   Col 5: Newsletter signup
 *   Bottom bar: copyright + credit
 *
 * Multi-location: shows location selector tabs when > 1 location.
 *
 * CSS: src/styles/footer.css
 */

"use client";

import { useState } from "react";
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

function getDefaultIndex(locations: Location[]): number {
  if (!locations.length) return -1;
  const idx = locations.findIndex((l) => l.is_default);
  return idx >= 0 ? idx : 0;
}

export default function Footer({ nav, settings }: FooterProps) {
  const editCtx = useEditMode();
  const footerSettings = editCtx?.settings.footer;
  const bgColor = footerSettings?.bgColor || "";

  const { business } = settings;
  const locations = business.locations || [];
  const hasMultiple = locations.length > 1;

  const [selectedIdx, setSelectedIdx] = useState(() => getDefaultIndex(locations));

  const location = selectedIdx >= 0 ? locations[selectedIdx] : null;
  const phone = location?.phone || business.phone;
  const email = location?.email || "";
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

        {/* Column 2: Navigate */}
        <div className="ft1__col">
          <h3 className="ft1__heading">Navigate</h3>
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
          {hasMultiple && (
            <div className="ft1-loc-tabs">
              {locations.map((loc, i) => (
                <button
                  key={loc.name}
                  type="button"
                  className={`ft1-loc-tabs__btn${i === selectedIdx ? " ft1-loc-tabs__btn--active" : ""}`}
                  onClick={() => setSelectedIdx(i)}
                >
                  {loc.name}
                </button>
              ))}
            </div>
          )}
          {location && (
            <>
              {!hasMultiple && (
                <p className="ft1__contact-line ft1__contact-line--name">
                  <strong>{location.name}</strong>
                </p>
              )}
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
            </>
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
        </div>

        {/* Column 4: Hours */}
        {location?.google_places?.hours && (
          <div className="ft1__col">
            <h3 className="ft1__heading">Hours</h3>
            <ul className="ft1__hours">
              {location.google_places.hours.map((line) => {
                const [day, time] = line.split(": ");
                return (
                  <li key={day} className="ft1__hours-row">
                    <span className="ft1__hours-day">{day}</span>
                    <span className="ft1__hours-time">{time}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Column 5: Newsletter */}
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
          <span className="ft1__powered">
            Powered by{" "}
            <a
              href="https://squareflo.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Squareflo"
            >
              <svg
                className="ft1__sqf-logo"
                viewBox="0 0 1599 295"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <g transform="translate(-200.82,1147.89) scale(0.1,-0.1)" fill="currentColor">
                  <path d="M13715 11474c-11-2-45-9-75-15-139-28-286-132-359-254-47-77-87-196-102-296-8-61-11-334-10-989 1-497 3-905 4-907 2-1 177-3 390-5l387-3 0 453 0 452 316 0 317 0-7 77c-3 42-6 105-6 140l0 63-308 0-309 0-12 43c-22 74-63 137-129 198-53 50-98 77-259 157-126 63-209 110-234 134-38 37-39 40-39 105 0 126 52 169 195 161 101-5 138-22 370-168 313-197 460-252 680-253 141-1 206 15 305 73 98 58 172 146 234 280l23 49 6-187c4-103 7-506 7-897 0-390 3-747 7-792l6-83 387 0 387 0 6 167c4 91 7 239 7 327l0 161 33-75c62-142 199-309 315-387 197-130 415-193 673-193 574 0 978 315 1064 829 39 230-10 499-127 695-49 83-170 212-256 273-67 48-221 120-312 146-227 65-528 63-744-3-276-86-483-256-601-496l-42-85-7 253c-4 139-9 277-13 306-6 62-32 104-90 148-44 34-87 46-302 85-118 21-190 50-228 91-28 30-60 102-69 156l-7 42-67 0-67 0-7-51c-13-95-64-164-142-189-53-18-194-7-274 20-35 12-143 57-239 101-195 89-261 111-388 134-80 14-238 19-288 9z m2925-667c166-78 469-461 708-893 154-279 215-516 163-629-56-120-175-146-320-70-124 66-301 266-506 575-353 533-456 903-283 1017 73 49 135 49 238 0z" />
                  <path d="M2845 11034c-16-2-70-9-120-15-230-28-466-143-568-277-92-119-127-222-127-372 0-173 40-269 156-380 114-108 224-154 571-235 291-68 353-97 353-165 0-49-35-75-125-95-169-38-485 20-698 127l-78 39-53-113c-29-62-77-170-106-241-63-150-69-135 85-196 226-89 459-131 725-132 179 0 281 15 425 63 206 68 339 177 425 346 17 34 34 62 38 62 4 0 19-18 34-38 117-167 313-303 546-381 90-30 97-34 210-138 162-149 239-205 368-269 145-72 248-94 434-95 162 0 251 19 372 83 76 39 198 138 198 160 0 11-37 58-150 191-41 49-83 100-93 113-10 13-24 24-30 24-6 0-36-17-67-39-64-45-142-71-216-71-61 0-96 11-142 47l-34 25 93 50c203 107 328 235 446 455l49 92 18-67c9-37 38-110 63-162 40-83 58-107 147-196 88-88 113-107 198-147 171-83 329-112 566-104 253 9 416 59 577 178 143 105 234 247 295 456l28 98 1 638 1 637-323 0-324 0-6-292c-4-161-7-440-7-620 0-322 0-328-24-381-49-111-121-164-235-174-142-12-232 36-291 153l-35 69-3 623-4 622-329 0-329 0-2-272c0-150-1-282 0-293l2-20-16 20c-9 11-26 41-39 66-36 69-137 200-200 257-300 275-804 364-1217 216-333-120-571-374-653-698-12-50-26-119-30-153-4-35-10-63-13-63-4 0-32 16-62 35-98 63-223 103-525 170-239 53-315 89-315 150 0 29 33 71 73 93 27 14 59 17 197 17 188-1 234-10 414-81 60-24 111-42 112-41 14 17 115 239 170 376 39 95 37 100-30 130-104 47-267 94-406 117-87 14-311 26-365 18z m2062-591c160-95 233-236 233-447 0-149-44-259-140-356-31-30-80-68-110-85-53-29-59-30-185-30-129 0-130 0-195 35-162 87-243 236-244 450 0 193 76 342 218 425 85 50 112 56 237 52 116-3 116-3 186-44z" />
                  <path d="M8116 10627c-88-199-205-468-262-597-56-129-174-399-261-600-88-201-163-375-167-387l-7-23 335 0 335 0 67 172 67 171 285-6c157-4 327-7 378-7l93 0 19-52c68-181 106-267 121-273 9-4 269-9 579-12l562-6 0 135c0 74 3 189 6 254l7 120 78 1c45 1 84-3 93-10 9-7 87-118 175-247l159-235 1131-3 1131-2 0 250 0 250-490 0-490 0 0 130 0 130 415 0 415 0 0 240 0 240-415 0-416 0 3 110 3 110 468 1 467 0 0 254 0 255-800 0-800 0 0-232 0-233-28 50c-54 96-80 131-139 185-76 70-151 115-261 156-173 65-181 65-804 71l-568 5-1-238c-1-132-5-469-8-750l-6-511-325 742-324 742-120 7c-65 3-214 6-330 6l-211 0-159-363z m2477-162c103-9 179-99 179-213 0-97-38-164-117-205-35-18-62-21-217-25l-178-4 0 231 0 231 143-5c78-3 163-7 190-10z m-1909-355c42-107 81-205 86-218 23-52 24-52-168-52-98 0-181 3-185 6-7 7 15 70 103 292 40 101 76 180 81 175 4-4 42-96 83-203z m2716-551c0-236-4-388-9-384-5 3-65 87-132 188-68 100-136 200-152 222l-28 40 22 15c119 78 225 185 270 273 11 20 22 37 24 37 3 0 5-176 5-391z" />
                </g>
              </svg>
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

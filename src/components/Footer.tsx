/**
 * Site Footer — SquarefloCMS Bravo Template
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Supports multiple footer variations selected via edit mode:
 *   FT1 — Classic 5-column (brand, nav, contact, hours, newsletter)
 *   FT2 — Minimal 2-column (brand left, nav + copyright right)
 *   FT3 — Brand-heavy + utility (big brand left, 3 utility cols right)
 *   FT4 — Multi-location cards (location cards band + brand/nav/newsletter)
 *   FT5 — Location selector (4-col with dropdown location picker)
 *   FT6 — Full-width map (Google Maps iframe + 4-col)
 *   FT7 — Centered minimalist (single centered column)
 *
 * CSS: src/styles/footer.css
 */

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { NavItem, SiteSettings, Location } from "@/lib/types";
import { useEditMode, type FooterVariation, type ButtonPreset } from "./EditModeProvider";
import NewsletterForm from "./NewsletterForm";

function autoTextColor(hex: string): string {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  const toLinear = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const L = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return L > 0.5 ? "#333" : "#fff";
}

function getHoursText(location: Location | null): string {
  if (!location?.google_places?.hours) return "";
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = dayNames[new Date().getDay()];
  const todayHours = location.google_places.hours.find((h) => h.startsWith(today));
  if (!todayHours) return "";
  const timeRange = todayHours.split(": ")[1];
  if (!timeRange || timeRange === "Closed") return "Closed today";
  const closingTime = timeRange.split(" – ")[1] || timeRange.split(" - ")[1];
  return closingTime ? `Open until ${closingTime} today` : timeRange;
}

const SOCIAL_ICONS: Record<string, string> = {
  facebook: "fab fa-facebook-f", instagram: "fab fa-instagram",
  x: "fab fa-x-twitter", twitter: "fab fa-x-twitter",
  linkedin: "fab fa-linkedin-in", youtube: "fab fa-youtube",
  tiktok: "fab fa-tiktok", pinterest: "fab fa-pinterest-p",
  snapchat: "fab fa-snapchat", threads: "fab fa-threads",
  whatsapp: "fab fa-whatsapp", yelp: "fab fa-yelp", google: "fab fa-google",
};

const SQF_LOGO = (
  <svg className="ft-sqf-logo" viewBox="0 0 1599 295" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g transform="translate(-200.82,1147.89) scale(0.1,-0.1)" fill="currentColor">
      <path d="M13715 11474c-11-2-45-9-75-15-139-28-286-132-359-254-47-77-87-196-102-296-8-61-11-334-10-989 1-497 3-905 4-907 2-1 177-3 390-5l387-3 0 453 0 452 316 0 317 0-7 77c-3 42-6 105-6 140l0 63-308 0-309 0-12 43c-22 74-63 137-129 198-53 50-98 77-259 157-126 63-209 110-234 134-38 37-39 40-39 105 0 126 52 169 195 161 101-5 138-22 370-168 313-197 460-252 680-253 141-1 206 15 305 73 98 58 172 146 234 280l23 49 6-187c4-103 7-506 7-897 0-390 3-747 7-792l6-83 387 0 387 0 6 167c4 91 7 239 7 327l0 161 33-75c62-142 199-309 315-387 197-130 415-193 673-193 574 0 978 315 1064 829 39 230-10 499-127 695-49 83-170 212-256 273-67 48-221 120-312 146-227 65-528 63-744-3-276-86-483-256-601-496l-42-85-7 253c-4 139-9 277-13 306-6 62-32 104-90 148-44 34-87 46-302 85-118 21-190 50-228 91-28 30-60 102-69 156l-7 42-67 0-67 0-7-51c-13-95-64-164-142-189-53-18-194-7-274 20-35 12-143 57-239 101-195 89-261 111-388 134-80 14-238 19-288 9z m2925-667c166-78 469-461 708-893 154-279 215-516 163-629-56-120-175-146-320-70-124 66-301 266-506 575-353 533-456 903-283 1017 73 49 135 49 238 0z" />
      <path d="M2845 11034c-16-2-70-9-120-15-230-28-466-143-568-277-92-119-127-222-127-372 0-173 40-269 156-380 114-108 224-154 571-235 291-68 353-97 353-165 0-49-35-75-125-95-169-38-485 20-698 127l-78 39-53-113c-29-62-77-170-106-241-63-150-69-135 85-196 226-89 459-131 725-132 179 0 281 15 425 63 206 68 339 177 425 346 17 34 34 62 38 62 4 0 19-18 34-38 117-167 313-303 546-381 90-30 97-34 210-138 162-149 239-205 368-269 145-72 248-94 434-95 162 0 251 19 372 83 76 39 198 138 198 160 0 11-37 58-150 191-41 49-83 100-93 113-10 13-24 24-30 24-6 0-36-17-67-39-64-45-142-71-216-71-61 0-96 11-142 47l-34 25 93 50c203 107 328 235 446 455l49 92 18-67c9-37 38-110 63-162 40-83 58-107 147-196 88-88 113-107 198-147 171-83 329-112 566-104 253 9 416 59 577 178 143 105 234 247 295 456l28 98 1 638 1 637-323 0-324 0-6-292c-4-161-7-440-7-620 0-322 0-328-24-381-49-111-121-164-235-174-142-12-232 36-291 153l-35 69-3 623-4 622-329 0-329 0-2-272c0-150-1-282 0-293l2-20-16 20c-9 11-26 41-39 66-36 69-137 200-200 257-300 275-804 364-1217 216-333-120-571-374-653-698-12-50-26-119-30-153-4-35-10-63-13-63-4 0-32 16-62 35-98 63-223 103-525 170-239 53-315 89-315 150 0 29 33 71 73 93 27 14 59 17 197 17 188-1 234-10 414-81 60-24 111-42 112-41 14 17 115 239 170 376 39 95 37 100-30 130-104 47-267 94-406 117-87 14-311 26-365 18z m2062-591c160-95 233-236 233-447 0-149-44-259-140-356-31-30-80-68-110-85-53-29-59-30-185-30-129 0-130 0-195 35-162 87-243 236-244 450 0 193 76 342 218 425 85 50 112 56 237 52 116-3 116-3 186-44z" />
      <path d="M8116 10627c-88-199-205-468-262-597-56-129-174-399-261-600-88-201-163-375-167-387l-7-23 335 0 335 0 67 172 67 171 285-6c157-4 327-7 378-7l93 0 19-52c68-181 106-267 121-273 9-4 269-9 579-12l562-6 0 135c0 74 3 189 6 254l7 120 78 1c45 1 84-3 93-10 9-7 87-118 175-247l159-235 1131-3 1131-2 0 250 0 250-490 0-490 0 0 130 0 130 415 0 415 0 0 240 0 240-415 0-416 0 3 110 3 110 468 1 467 0 0 254 0 255-800 0-800 0 0-232 0-233-28 50c-54 96-80 131-139 185-76 70-151 115-261 156-173 65-181 65-804 71l-568 5-1-238c-1-132-5-469-8-750l-6-511-325 742-324 742-120 7c-65 3-214 6-330 6l-211 0-159-363z m2477-162c103-9 179-99 179-213 0-97-38-164-117-205-35-18-62-21-217-25l-178-4 0 231 0 231 143-5c78-3 163-7 190-10z m-1909-355c42-107 81-205 86-218 23-52 24-52-168-52-98 0-181 3-185 6-7 7 15 70 103 292 40 101 76 180 81 175 4-4 42-96 83-203z m2716-551c0-236-4-388-9-384-5 3-65 87-132 188-68 100-136 200-152 222l-28 40 22 15c119 78 225 185 270 273 11 20 22 37 24 37 3 0 5-176 5-391z" />
    </g>
  </svg>
);

interface FooterProps {
  nav: NavItem[];
  settings: SiteSettings;
}

/* ------------------------------------------------------------------ */
/*  Shared sub-components                                              */
/* ------------------------------------------------------------------ */

function Logo({ business, prefix }: { business: SiteSettings["business"]; prefix: string }) {
  return (
    <Link href="/" className="ft-logo">
      {business.logos?.rectangular ? (
        <img src={business.logos.rectangular} alt={business.name} className="ft-logo__img" />
      ) : (
        <span className="ft-logo__text ft-logo__text--light">{business.name}</span>
      )}
    </Link>
  );
}

function SocialLinks({ links, prefix }: { links: SiteSettings["social_links"]; prefix: string }) {
  if (!links?.length) return null;
  return (
    <div className={`${prefix}-social`}>
      {links.map((link) => (
        <a key={link.platform} href={link.url} className={`${prefix}-social__link`}
          target="_blank" rel="noopener noreferrer" aria-label={link.label}>
          <i className={link.icon || SOCIAL_ICONS[link.platform] || "fas fa-link"} />
        </a>
      ))}
    </div>
  );
}

function NavList({ nav, prefix }: { nav: NavItem[]; prefix: string }) {
  return (
    <ul className={`${prefix}__list`}>
      {nav.map((item) => (
        <li key={item.id}>
          {item.url ? (
            <a href={item.url} target={item.open_in_new_tab ? "_blank" : undefined}
              rel={item.open_in_new_tab ? "noopener noreferrer" : undefined}>{item.label}</a>
          ) : (
            <span>{item.label}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

function Newsletter({ prefix, inputBgColor, btnPreset }: { prefix: string; inputBgColor: string; btnPreset?: ButtonPreset }) {
  const textColor = inputBgColor ? autoTextColor(inputBgColor) : undefined;
  const inputStyle: React.CSSProperties | undefined = inputBgColor
    ? { background: inputBgColor, borderColor: inputBgColor, "--ft-input-color": textColor } as React.CSSProperties
    : undefined;
  const btnStyle: React.CSSProperties | undefined = btnPreset
    ? {
        background: btnPreset.fillColor,
        color: btnPreset.textColor,
        borderRadius: `${btnPreset.borderRadius}px`,
        padding: `${btnPreset.paddingV}px ${btnPreset.paddingH}px`,
        border: btnPreset.borderWidth
          ? `${btnPreset.borderWidth}px solid ${btnPreset.borderColor}`
          : "none",
      }
    : undefined;
  return (
    <NewsletterForm prefix={prefix} inputStyle={inputStyle} btnStyle={btnStyle} />
  );
}

function ContactBlock({
  prefix, location, phone, email, hasMultiple, locations, selectedIdx,
  setSelectedIdx, locOpen, setLocOpen, locRef, dropdownBgColor,
}: {
  prefix: string; location: Location | null; phone: string; email: string;
  hasMultiple: boolean; locations: Location[]; selectedIdx: number;
  setSelectedIdx: (i: number) => void; locOpen: boolean;
  setLocOpen: (v: boolean) => void; locRef: React.RefObject<HTMLDivElement | null>;
  dropdownBgColor: string;
}) {
  const ddStyle = dropdownBgColor
    ? { background: dropdownBgColor, color: autoTextColor(dropdownBgColor) }
    : undefined;

  return (
    <>
      {location && (
        <>
          {hasMultiple ? (
            <div className="ft-loc-select" ref={locRef}>
              <button type="button" className="ft-loc-select__trigger" onClick={() => setLocOpen(!locOpen)}>
                <strong>{location.name}</strong>
                <i className={`fas fa-caret-${locOpen ? "up" : "down"} ft-loc-select__caret`} />
              </button>
              {locOpen && (
                <ul className="ft-loc-select__menu" style={ddStyle}>
                  {locations.map((loc, i) => (
                    <li key={loc.name}>
                      <button type="button"
                        className={`ft-loc-select__option${i === selectedIdx ? " ft-loc-select__option--active" : ""}`}
                        onClick={() => { setSelectedIdx(i); setLocOpen(false); }}>
                        {loc.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <p className={`${prefix}__contact-line ${prefix}__contact-line--name`}>
              <strong>{location.name}</strong>
            </p>
          )}
          <p className={`${prefix}__contact-line`}>
            <i className="fas fa-map-marker-alt" />
            <span>
              {location.street_address}{location.unit ? `, ${location.unit}` : ""}<br />
              {location.city}, {location.state_province} {location.postal_code}
            </span>
          </p>
        </>
      )}
      {phone && (
        <p className={`${prefix}__contact-line`}>
          <i className="fas fa-phone-alt" />
          <a href={`tel:${phone.replace(/\D/g, "")}`}>{phone}</a>
        </p>
      )}
      {email && (
        <p className={`${prefix}__contact-line`}>
          <i className="fas fa-envelope" />
          <a href={`mailto:${email}`}>{email}</a>
        </p>
      )}
    </>
  );
}

function HoursBlock({ prefix, location }: { prefix: string; location: Location | null }) {
  if (!location?.google_places?.hours) return null;
  return (
    <ul className={`${prefix}__hours`}>
      {location.google_places.hours.map((line) => {
        const [day, time] = line.split(": ");
        return (
          <li key={day} className={`${prefix}__hours-row`}>
            <span className={`${prefix}__hours-day`}>{day}</span>
            <span className={`${prefix}__hours-time`}>{time}</span>
          </li>
        );
      })}
    </ul>
  );
}

function AccountLinks() {
  const [signedIn, setSignedIn] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "same-origin" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.id) setSignedIn(true);
      })
      .catch(() => {})
      .finally(() => setChecked(true));
  }, []);

  if (!checked) return null;

  return (
    <div className="ft-account">
      <span className="ft-account__label">My Account</span>
      {signedIn ? (
        <button
          className="ft-account-link"
          onClick={async () => {
            await fetch("/api/auth/sign-out", { method: "POST" });
            window.location.reload();
          }}
        >
          Sign Out
        </button>
      ) : (
        <>
          <a href="/sign-in" className="ft-account-link">Sign In</a>
          <a href="/sign-up" className="ft-account-link">Create Account</a>
        </>
      )}
    </div>
  );
}

function BottomBar({ prefix, businessName, year }: { prefix: string; businessName: string; year: number }) {
  return (
    <div className={`${prefix}__bottom`}>
      <div className={`${prefix}__bottom-inner`}>
        <span>&copy; {year} {businessName}. All rights reserved.</span>
        <span className="ft-powered">
          Powered by{" "}
          <a href="https://squareflo.com" target="_blank" rel="noopener noreferrer" aria-label="Squareflo">
            {SQF_LOGO}
          </a>
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Footer component                                              */
/* ------------------------------------------------------------------ */

export default function Footer({ nav, settings }: FooterProps) {
  const editCtx = useEditMode();
  const footerSettings = editCtx?.settings.footer;
  const variation: FooterVariation = footerSettings?.variation || "ft1";
  const bgColor = footerSettings?.bgColor || "";
  const dropdownBgColor = footerSettings?.dropdownBgColor || "";
  const inputBgColor = footerSettings?.inputBgColor || "";
  const headingColor = footerSettings?.headingColor || "";
  const cardBgColor = footerSettings?.cardBgColor || "";
  const btnPresetKey = footerSettings?.btnPreset || "";
  const btnPreset = btnPresetKey ? editCtx?.buttonPresets.find((p) => p.key === btnPresetKey) : undefined;
  const headingStyle: React.CSSProperties | undefined = headingColor ? { color: headingColor } : undefined;
  const cardStyle: React.CSSProperties | undefined = cardBgColor
    ? { background: cardBgColor, color: autoTextColor(cardBgColor) }
    : undefined;

  const { business } = settings;
  const locations = business.locations || [];
  const hasMultiple = locations.length > 1;

  const [selectedIdx, setSelectedIdx] = useState(() => {
    if (!locations.length) return -1;
    const idx = locations.findIndex((l) => l.is_default);
    return idx >= 0 ? idx : 0;
  });
  const [locOpen, setLocOpen] = useState(false);
  const locRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!locOpen) return;
    function close(e: MouseEvent) {
      if (locRef.current && !locRef.current.contains(e.target as Node)) setLocOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [locOpen]);

  const location = selectedIdx >= 0 ? locations[selectedIdx] : null;
  const phone = location?.phone || business.phone;
  const email = location?.email || "";
  const socialLinks = settings.social_links || [];
  const year = new Date().getFullYear();
  const footerStyle: React.CSSProperties | undefined = bgColor ? { background: bgColor } : undefined;

  const contactProps = {
    location, phone, email, hasMultiple, locations, selectedIdx,
    setSelectedIdx, locOpen, setLocOpen, locRef, dropdownBgColor,
  };

  /* FT2 — Minimal 2-Column */
  if (variation === "ft2") {
    return (
      <footer className="ft2" style={footerStyle}>
        <div className="ft2__inner">
          <div className="ft2__brand">
            <Logo business={business} prefix="ft2" />
            <SocialLinks links={socialLinks} prefix="ft2" />
          </div>
          <div className="ft2__nav">
            <NavList nav={nav} prefix="ft2" />
          </div>
        </div>
        <BottomBar prefix="ft2" businessName={business.name} year={year} />
      </footer>
    );
  }

  /* FT3 — Brand-Heavy + Utility */
  if (variation === "ft3") {
    return (
      <footer className="ft3" style={footerStyle}>
        <div className="ft3__inner">
          <div className="ft3__brand">
            <Logo business={business} prefix="ft3" />
            <SocialLinks links={socialLinks} prefix="ft3" />
          </div>
          <div className="ft3__utility">
            <div className="ft3__col">
              <h4 className="ft3__col-heading" style={headingStyle}>Navigate</h4>
              <NavList nav={nav} prefix="ft3" />
              <AccountLinks />
            </div>
            <div className="ft3__col">
              <h4 className="ft3__col-heading" style={headingStyle}>Contact</h4>
              <ContactBlock prefix="ft3" {...contactProps} />
            </div>
            <div className="ft3__col">
              <h4 className="ft3__col-heading" style={headingStyle}>Newsletter</h4>
              <Newsletter prefix="ft3" inputBgColor={inputBgColor} btnPreset={btnPreset} />
            </div>
          </div>
        </div>
        <BottomBar prefix="ft3" businessName={business.name} year={year} />
      </footer>
    );
  }

  /* FT4 — Multi-Location Cards */
  if (variation === "ft4") {
    return (
      <footer className="ft4" style={footerStyle}>
        {locations.length > 0 && (
          <div className="ft4__locations-band">
            <div className="ft4__locations-inner">
              <div className="ft4__locations-header">
                <span className="ft4__locations-kicker">Visit us</span>
                <h3 className="ft4__locations-title" style={headingStyle}>Our locations</h3>
              </div>
              <div className="ft4__locations-grid">
                {locations.map((loc) => {
                  const locPhone = loc.phone || business.phone;
                  const hoursText = getHoursText(loc);
                  return (
                    <div key={loc.name} className="ft4-location" style={cardStyle}>
                      <h4 className="ft4-location__name">{loc.name}</h4>
                      <p className="ft4-location__line">
                        <i className="fas fa-map-marker-alt" />
                        <span>
                          {loc.street_address}{loc.unit ? `, ${loc.unit}` : ""}<br />
                          {loc.city}, {loc.state_province} {loc.postal_code}
                        </span>
                      </p>
                      {locPhone && (
                        <p className="ft4-location__line">
                          <i className="fas fa-phone-alt" />
                          <a href={`tel:${locPhone.replace(/\D/g, "")}`}>{locPhone}</a>
                        </p>
                      )}
                      {hoursText && (
                        <p className="ft4-location__line">
                          <i className="far fa-clock" /> {hoursText}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        <div className="ft4__main">
          <div className="ft4__main-inner">
            <div className="ft4__col">
              <Logo business={business} prefix="ft4" />
              <SocialLinks links={socialLinks} prefix="ft4" />
            </div>
            <div className="ft4__col">
              <h3 className="ft4__heading" style={headingStyle}>Navigate</h3>
              <NavList nav={nav} prefix="ft4" />
              <AccountLinks />
            </div>
            <div className="ft4__col">
              <h3 className="ft4__heading" style={headingStyle}>Newsletter</h3>
              <Newsletter prefix="ft4" inputBgColor={inputBgColor} btnPreset={btnPreset} />
            </div>
          </div>
        </div>
        <BottomBar prefix="ft4" businessName={business.name} year={year} />
      </footer>
    );
  }

  /* FT5 — Location Selector (4-col) */
  if (variation === "ft5") {
    return (
      <footer className="ft5" style={footerStyle}>
        <div className="ft5__inner">
          <div className="ft5__col ft5__col--brand">
            <Logo business={business} prefix="ft5" />
            <SocialLinks links={socialLinks} prefix="ft5" />
          </div>
          <div className="ft5__col">
            <h3 className="ft5__heading" style={headingStyle}>Navigate</h3>
            <NavList nav={nav} prefix="ft5" />
            <AccountLinks />
          </div>
          <div className="ft5__col ft5__col--location">
            <h3 className="ft5__heading" style={headingStyle}>Find a location</h3>
            <ContactBlock prefix="ft5" {...contactProps} />
            {location?.google_places?.hours && (
              <p className="ft5__contact-line" style={{ marginTop: 8 }}>
                <i className="far fa-clock" /> {getHoursText(location)}
              </p>
            )}
          </div>
          <div className="ft5__col">
            <h3 className="ft5__heading" style={headingStyle}>Newsletter</h3>
            <Newsletter prefix="ft5" inputBgColor={inputBgColor} btnPreset={btnPreset} />
          </div>
        </div>
        <BottomBar prefix="ft5" businessName={business.name} year={year} />
      </footer>
    );
  }

  /* FT6 — Full-Width Map */
  if (variation === "ft6") {
    const mapQuery = location
      ? encodeURIComponent(`${location.street_address}, ${location.city}, ${location.state_province} ${location.postal_code}`)
      : "";
    return (
      <footer className="ft6" style={footerStyle}>
        {mapQuery && (
          <iframe
            className="ft6__map"
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed&iwloc=near`}
            loading="lazy"
            title="Map"
          />
        )}
        <div className="ft6__main">
          <div className="ft6__main-inner">
            <div className="ft6__col">
              <Logo business={business} prefix="ft6" />
              <SocialLinks links={socialLinks} prefix="ft6" />
            </div>
            <div className="ft6__col">
              <h3 className="ft6__heading" style={headingStyle}>Navigate</h3>
              <NavList nav={nav} prefix="ft6" />
              <AccountLinks />
            </div>
            <div className="ft6__col">
              <h3 className="ft6__heading" style={headingStyle}>Contact</h3>
              <ContactBlock prefix="ft6" {...contactProps} />
            </div>
            <div className="ft6__col">
              <h3 className="ft6__heading" style={headingStyle}>Newsletter</h3>
              <Newsletter prefix="ft6" inputBgColor={inputBgColor} btnPreset={btnPreset} />
            </div>
          </div>
        </div>
        <BottomBar prefix="ft6" businessName={business.name} year={year} />
      </footer>
    );
  }

  /* FT7 — Centered Minimalist */
  if (variation === "ft7") {
    return (
      <footer className="ft7" style={footerStyle}>
        <div className="ft7__inner">
          <Logo business={business} prefix="ft7" />
          <NavList nav={nav} prefix="ft7" />
          <SocialLinks links={socialLinks} prefix="ft7" />
        </div>
        <BottomBar prefix="ft7" businessName={business.name} year={year} />
      </footer>
    );
  }

  /* FT1 — Classic 5-Column (default) */
  return (
    <footer className="ft1" style={footerStyle}>
      <div className="ft1__inner">
        <div className="ft1__col">
          <Logo business={business} prefix="ft1" />
          <SocialLinks links={socialLinks} prefix="ft1" />
        </div>
        <div className="ft1__col">
          <h3 className="ft1__heading" style={headingStyle}>Navigate</h3>
          <NavList nav={nav} prefix="ft1" />
          <AccountLinks />
        </div>
        <div className="ft1__col">
          <h3 className="ft1__heading" style={headingStyle}>Contact</h3>
          <ContactBlock prefix="ft1" {...contactProps} />
        </div>
        {location?.google_places?.hours && (
          <div className="ft1__col">
            <h3 className="ft1__heading" style={headingStyle}>Hours</h3>
            <HoursBlock prefix="ft1" location={location} />
          </div>
        )}
        <div className="ft1__col">
          <h3 className="ft1__heading" style={headingStyle}>Newsletter</h3>
          <p className="ft1__text ft1__text--sm">Get our latest updates. No spam, ever.</p>
          <Newsletter prefix="ft1" inputBgColor={inputBgColor} btnPreset={btnPreset} />
        </div>
      </div>
      <BottomBar prefix="ft1" businessName={business.name} year={year} />
    </footer>
  );
}

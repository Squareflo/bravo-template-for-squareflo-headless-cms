/**
 * Blog Sidebar Contact Form — SquarefloCMS Bravo Template
 * ========================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Client component that renders a contact form in the blog sidebar.
 * Matches the contact widget from html-reference/blog-b6n3k8q5jw.html.
 */

"use client";

import { useState } from "react";
import { Location } from "@/lib/types";

interface Props {
  locations: Location[];
}

export default function BlogSidebarContact({ locations }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState(locations[0]?.name || "");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: POST to CMS forms API when available
    setSubmitted(true);
  }

  if (submitted) {
    return <p>Thank you for your message. We will be in touch shortly.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {locations.length > 1 && (
        <div className="form-field">
          <label htmlFor="blog-contact-location" className="form-field__label">
            Location
          </label>
          <select
            id="blog-contact-location"
            className="form-field__select"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="form-field">
        <label htmlFor="blog-contact-name" className="form-field__label">
          Name
        </label>
        <input
          id="blog-contact-name"
          type="text"
          className="form-field__input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="blog-contact-phone" className="form-field__label">
          Phone#
        </label>
        <input
          id="blog-contact-phone"
          type="tel"
          className="form-field__input"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label htmlFor="blog-contact-email" className="form-field__label">
          E-mail
        </label>
        <input
          id="blog-contact-email"
          type="email"
          className="form-field__input"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="blog-contact-message" className="form-field__label">
          Message
        </label>
        <textarea
          id="blog-contact-message"
          className="form-field__textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn">
        Submit
      </button>
    </form>
  );
}

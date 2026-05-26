/**
 * Blog Sidebar Contact Widget — SquarefloCMS Bravo Template
 * ========================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Renders the contact form widget in the blog sidebar only if the CMS
 * has a form with slug "contact-us". Otherwise shows an edit-mode hint
 * or nothing at all. Includes its own wrapper div + heading.
 */

"use client";

import { useState } from "react";
import { useEditMode } from "./EditModeProvider";

interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
}

interface CmsForm {
  id: string;
  name: string;
  slug: string;
  fields: FormField[];
}

interface Props {
  form: CmsForm | null;
}

export default function BlogSidebarContact({ form }: Props) {
  const ctx = useEditMode();
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!form) {
    if (ctx?.editMode) {
      return (
        <div className="widget widget--contact">
          <h2 className="widget__title">Contact Us</h2>
          <div className="sidebar-hint">
            <i className="fas fa-info-circle" />
            <p>
              To show a contact form here, create a form in the CMS using the
              <strong> Forms</strong> module with the slug <code>contact-us</code>.
            </p>
          </div>
        </div>
      );
    }
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: POST to CMS forms submission API
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="widget widget--contact">
        <h2 className="widget__title">Contact Us</h2>
        <p>Thank you for your message. We will be in touch shortly.</p>
      </div>
    );
  }

  function setValue(fieldId: string, val: string) {
    setValues((prev) => ({ ...prev, [fieldId]: val }));
  }

  return (
    <div className="widget widget--contact">
      <h2 className="widget__title">Contact Us</h2>
      <form onSubmit={handleSubmit}>
        {form.fields.map((field) => (
          <div key={field.id} className="form-field">
            <label htmlFor={`form-${field.id}`} className="form-field__label">
              {field.label}
            </label>
            {field.type === "select" && field.options ? (
              <select
                id={`form-${field.id}`}
                className="form-field__select"
                value={values[field.id] || ""}
                onChange={(e) => setValue(field.id, e.target.value)}
                required={field.required}
              >
                <option value="">{field.placeholder || "Select..."}</option>
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                id={`form-${field.id}`}
                className="form-field__textarea"
                placeholder={field.placeholder}
                value={values[field.id] || ""}
                onChange={(e) => setValue(field.id, e.target.value)}
                required={field.required}
              />
            ) : (
              <input
                id={`form-${field.id}`}
                type={field.type || "text"}
                className="form-field__input"
                placeholder={field.placeholder}
                value={values[field.id] || ""}
                onChange={(e) => setValue(field.id, e.target.value)}
                required={field.required}
              />
            )}
          </div>
        ))}

        <button type="submit" className="btn">
          Submit
        </button>
      </form>
    </div>
  );
}

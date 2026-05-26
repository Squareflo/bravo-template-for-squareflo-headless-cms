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
  options?: (string | { label: string; value: string })[];
  includeOther?: boolean;
}

interface CmsForm {
  id: string;
  name: string;
  slug: string;
  fields: FormField[];
  submit_label?: string;
  success_message?: string;
}

interface Props {
  form: CmsForm | null;
}

export default function BlogSidebarContact({ form }: Props) {
  const ctx = useEditMode();
  const [values, setValues] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, Set<string>>>({});
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
        <h2 className="widget__title">{form.name}</h2>
        <p>{form.success_message || "Thank you! Your submission has been received."}</p>
      </div>
    );
  }

  function setValue(fieldId: string, val: string) {
    setValues((prev) => ({ ...prev, [fieldId]: val }));
  }

  function toggleCheck(fieldId: string, val: string) {
    setChecked((prev) => {
      const set = new Set(prev[fieldId] || []);
      if (set.has(val)) set.delete(val);
      else set.add(val);
      return { ...prev, [fieldId]: set };
    });
  }

  function optionLabel(opt: string | { label: string; value: string }): string {
    return typeof opt === "string" ? opt : opt.label;
  }

  function optionValue(opt: string | { label: string; value: string }): string {
    return typeof opt === "string" ? opt : opt.value;
  }

  return (
    <div className="widget widget--contact">
      <h2 className="widget__title">{form.name}</h2>
      <form onSubmit={handleSubmit}>
        {form.fields.map((field) => {
          const allOptions = [
            ...(field.options || []),
            ...(field.includeOther ? ["Other"] : []),
          ];

          if (
            (field.type === "checkbox" || field.type === "radio") &&
            allOptions.length > 0
          ) {
            const fieldChecked = checked[field.id] || new Set<string>();
            return (
              <fieldset key={field.id} className="form-field form-field--group">
                <legend className="form-field__label">{field.label}</legend>
                {allOptions.map((opt) => {
                  const val = optionValue(opt);
                  const lbl = optionLabel(opt);
                  const uid = `form-${field.id}-${val}`;
                  return (
                    <label key={val} className="form-field__check-label" htmlFor={uid}>
                      <input
                        id={uid}
                        type={field.type}
                        name={`form-${field.id}`}
                        value={val}
                        checked={
                          field.type === "checkbox"
                            ? fieldChecked.has(val)
                            : values[field.id] === val
                        }
                        onChange={() =>
                          field.type === "checkbox"
                            ? toggleCheck(field.id, val)
                            : setValue(field.id, val)
                        }
                      />
                      {lbl}
                    </label>
                  );
                })}
              </fieldset>
            );
          }

          if (field.type === "select" && allOptions.length > 0) {
            return (
              <div key={field.id} className="form-field">
                <label htmlFor={`form-${field.id}`} className="form-field__label">
                  {field.label}
                </label>
                <select
                  id={`form-${field.id}`}
                  className="form-field__select"
                  value={values[field.id] || ""}
                  onChange={(e) => setValue(field.id, e.target.value)}
                  required={field.required}
                >
                  <option value="">{field.placeholder || "Select..."}</option>
                  {allOptions.map((opt) => (
                    <option key={optionValue(opt)} value={optionValue(opt)}>
                      {optionLabel(opt)}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if (field.type === "textarea") {
            return (
              <div key={field.id} className="form-field">
                <label htmlFor={`form-${field.id}`} className="form-field__label">
                  {field.label}
                </label>
                <textarea
                  id={`form-${field.id}`}
                  className="form-field__textarea"
                  placeholder={field.placeholder}
                  value={values[field.id] || ""}
                  onChange={(e) => setValue(field.id, e.target.value)}
                  required={field.required}
                />
              </div>
            );
          }

          return (
            <div key={field.id} className="form-field">
              <label htmlFor={`form-${field.id}`} className="form-field__label">
                {field.label}
              </label>
              <input
                id={`form-${field.id}`}
                type={field.type || "text"}
                className="form-field__input"
                placeholder={field.placeholder}
                value={values[field.id] || ""}
                onChange={(e) => setValue(field.id, e.target.value)}
                required={field.required}
              />
            </div>
          );
        })}

        <button type="submit" className="btn">
          {form.submit_label || "Submit"}
        </button>
      </form>
    </div>
  );
}

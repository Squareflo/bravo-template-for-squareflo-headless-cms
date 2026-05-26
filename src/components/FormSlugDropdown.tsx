/**
 * Form Slug Dropdown — SquarefloCMS Bravo Template
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Fetches all available forms from the CMS and renders a dropdown
 * for selecting which form to display. Used in settings drawers.
 */

"use client";

import { useEffect, useState } from "react";

interface CmsFormSummary {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  id?: string;
  value: string;
  onChange: (slug: string) => void;
}

export default function FormSlugDropdown({ id, value, onChange }: Props) {
  const [forms, setForms] = useState<CmsFormSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/forms")
      .then((r) => r.json())
      .then((data) => setForms(data.forms || []))
      .catch(() => setForms([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <select
      id={id}
      className="drawer-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={loading}
    >
      <option value="">
        {loading ? "Loading forms..." : "None (hide form)"}
      </option>
      {forms.map((f) => (
        <option key={f.id} value={f.slug}>
          {f.name}
        </option>
      ))}
    </select>
  );
}

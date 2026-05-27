/**
 * Blog Sidebar Form Loader — SquarefloCMS Bravo Template
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Dynamically loads a CMS form by slug (from edit mode settings)
 * and renders it using BlogSidebarContact. Used on blog listing
 * and blog detail pages.
 */

"use client";

import { useEffect, useState } from "react";
import { useEditMode } from "./EditModeProvider";
import BlogSidebarContact from "./BlogSidebarContact";

interface Props {
  settingsKey: "blog" | "blogDetail" | "services" | "serviceDetail" | "faqs" | "reviews";
}

export default function BlogSidebarFormLoader({ settingsKey }: Props) {
  const ctx = useEditMode();
  const formSlug = ctx?.settings[settingsKey]?.formSlug || "";

  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    if (!formSlug) {
      setForm(null);
      return;
    }
    fetch(`/api/forms/${encodeURIComponent(formSlug)}`)
      .then((r) => r.json())
      .then((data) => setForm(data.form || null))
      .catch(() => setForm(null));
  }, [formSlug]);

  if (!formSlug) return null;
  if (!form) return null;

  return <BlogSidebarContact form={form} />;
}

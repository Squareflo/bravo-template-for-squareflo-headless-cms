/**
 * Editable Section Wrapper — SquarefloCMS Bravo Template
 * ========================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Wraps a page section. When edit mode is active, adds a dashed outline,
 * hover highlight, label badge, and opens the settings drawer on click.
 * All pointer events on children are disabled so links/buttons don't fire.
 */

"use client";

import { useEditMode } from "./EditModeProvider";
import type { ReactNode } from "react";

interface Props {
  id: string;
  label: string;
  children: ReactNode;
}

export default function EditableSection({ id, label, children }: Props) {
  const ctx = useEditMode();

  if (!ctx?.editMode) return <>{children}</>;

  return (
    <div
      className="editable-section"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        ctx.setActiveSection(id);
      }}
    >
      <div className="editable-section__label">{label}</div>
      <div className="editable-section__content">{children}</div>
    </div>
  );
}

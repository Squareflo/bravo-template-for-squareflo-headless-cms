/**
 * Service Cover Image — SquarefloCMS Bravo Template
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Renders the cover image in either:
 *   - "full" — full-width, landscape
 *   - "half" — 50% width floated left, text wraps around it
 */

"use client";

import { useEditMode } from "./EditModeProvider";
import type { ReactNode } from "react";

interface Props {
  src: string | null;
  children: ReactNode;
}

export default function ServiceCoverImage({ src, children }: Props) {
  const ctx = useEditMode();
  const layout = ctx?.settings.serviceDetail.coverLayout || "full";

  if (layout === "half") {
    return (
      <div className="service-detail__body-wrap">
        {src && (
          <img
            src={src}
            alt=""
            className="service-detail__hero service-detail__hero--half"
          />
        )}
        {children}
      </div>
    );
  }

  return (
    <>
      {src && (
        <img src={src} alt="" className="service-detail__hero" />
      )}
      {children}
    </>
  );
}

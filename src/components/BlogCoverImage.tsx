/**
 * Blog Cover Image — SquarefloCMS Bravo Template
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * Renders the cover image in either:
 *   - "full" — full-width, landscape aspect ratio (16:9)
 *   - "half" — 50% width floated left, square (1:1), text wraps around it
 *              On small devices: always full width
 *
 * When "half" mode, the image must be inside the body flow container
 * so that text wraps around the float. This component renders both the
 * image and the body content to control the DOM structure.
 */

"use client";

import { useEditMode } from "./EditModeProvider";
import type { ReactNode } from "react";

interface Props {
  src: string | null;
  children: ReactNode; // The body content that wraps around the image
}

export default function BlogCoverImage({ src, children }: Props) {
  const ctx = useEditMode();
  const layout = ctx?.settings.blogDetail.coverLayout || "full";

  if (layout === "half") {
    return (
      <div className="post-detail__body-wrap">
        {src && (
          <img
            src={src}
            alt=""
            className="post-detail__hero post-detail__hero--half"
          />
        )}
        {children}
      </div>
    );
  }

  return (
    <>
      {src && (
        <img src={src} alt="" className="post-detail__hero" />
      )}
      {children}
    </>
  );
}

/**
 * CMS Content Block Renderer — SquarefloCMS Bravo Template
 * ===========================================================
 * Powered by SquarefloCMS (https://squareflo.com)
 *
 * This component renders the headless content blocks that come from the CMS
 * page editor. When a user creates a page in SquarefloCMS, they build it
 * using blocks (headings, paragraphs, images, buttons, etc.). This component
 * takes those blocks and renders them as HTML.
 *
 * Supported block types:
 *   - heading    → <h2>–<h6> (never <h1> — reserved for the page's primary heading)
 *   - paragraph  → Rich HTML text (sanitised with DOMPurify)
 *   - image      → <figure> with <img> (null src omits the element)
 *   - video      → <video> with controls
 *   - button     → Styled link (solid or outline); null URL renders <span>
 *   - spacer     → Empty div with configurable height
 *   - columns    → CSS grid with nested blocks in each column
 *   - section    → Placeholder for reusable CMS sections
 *
 * Also exports TwoColumnLayout — renders the CMS page's two-column structure
 * (main content on the left, optional sidebar on the right).
 *
 * Heading Hierarchy:
 *   Content blocks never render <h1>. The page's <h1> is owned by either
 *   the Hero section (when present) or the page title. All block headings
 *   start at <h2> minimum, regardless of what the CMS sends.
 *
 * Design Reference:
 *   - Block styling comes from src/styles/pages.css
 *   - The two-column layout matches the interior page pattern used across
 *     all Bravo template pages (see html-reference/index-r4m7t9w2qx.html)
 *   - Button styles (.btn, .btn--outline) match the button patterns in
 *     html-reference/styles-r4m7t9w2qx.css
 */

/**
 * Pass through CMS HTML. The content comes from the trusted CMS editor
 * so no client-side sanitisation is needed. (isomorphic-dompurify was
 * removed because its jsdom dependency crashes in Vercel serverless.)
 */
function sanitise(html: string | undefined): string {
  if (!html) return "";
  return html;
}

/** Shape of a content block from the CMS headless_content API response */
interface Block {
  id: string;
  type: string;
  text?: string;
  content?: string;
  src?: string;
  alt?: string;
  layout?: string;
  aspectRatio?: string;
  clickAction?: string;
  linkType?: string;
  linkValue?: string;
  style?: string;        // Button style: "solid" | "outline"
  align?: string;        // Button alignment: "left" | "center" | "right"
  height?: number;       // Spacer height in pixels
  level?: number;        // Heading level: 1–6
  count?: number;        // Number of columns
  columns?: { blocks: Block[] }[];  // Nested blocks within each column
  section_slug?: string;
  section_name?: string;
  fields?: { key: string; label: string; type: string; value: string; locked: boolean; source_field?: string }[];
}

/**
 * Renders a heading tag (h2–h6) based on the block's level property.
 * Content block headings never render <h1> — that is reserved for the
 * page's primary heading (Hero section or page title).
 */
function HeadingBlock({ block, isFirst }: { block: Block; isFirst: boolean }) {
  const rawLevel = block.level || 2;
  const level = Math.max(2, Math.min(6, rawLevel)) as 2 | 3 | 4 | 5 | 6;
  const Tag = `h${level}` as "h2" | "h3" | "h4" | "h5" | "h6";
  return (
    <>
      <Tag
        className={isFirst ? "page-title" : undefined}
        dangerouslySetInnerHTML={{ __html: sanitise(block.text) }}
      />
      {isFirst && <hr className="page-title-rule" />}
    </>
  );
}

/**
 * Main block renderer — takes a single CMS block and returns the
 * appropriate React element. Add new block types here as the CMS evolves.
 */
export default function ContentBlock({ block, isFirstHeading = false }: { block: Block; isFirstHeading?: boolean }) {
  switch (block.type) {
    case "heading":
      return <HeadingBlock block={block} isFirst={isFirstHeading} />;

    case "paragraph":
      if (!block.text) return null;
      return (
        <div
          className="cms-paragraph"
          dangerouslySetInnerHTML={{ __html: sanitise(block.text) }}
        />
      );

    case "image":
      if (!block.src) return null;
      return (
        <figure className="cms-image">
          <img src={block.src} alt={block.alt || ""} />
        </figure>
      );

    case "video":
      if (!block.src) return null;
      return (
        <div className="cms-video">
          <video src={block.src} controls />
        </div>
      );

    case "button": {
      const btnClass = `btn${block.style === "outline" ? " btn--outline" : ""}`;
      const wrapClass = `cms-button-wrap${block.align ? ` cms-button-wrap--${block.align}` : ""}`;
      if (!block.linkValue) {
        return (
          <div className={wrapClass}>
            <span className={`${btnClass} btn--disabled`}>{block.text}</span>
          </div>
        );
      }
      return (
        <div className={wrapClass}>
          <a href={block.linkValue} className={btnClass}>
            {block.text}
          </a>
        </div>
      );
    }

    case "spacer":
      return <div style={{ height: block.height || 32 }} />;

    case "columns":
      return (
        <div
          className="cms-columns"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${block.count || 2}, 1fr)`,
            gap: "30px",
          }}
        >
          {block.columns?.map((col, i) => (
            <div key={i}>
              {col.blocks.map((b) => (
                <ContentBlock key={b.id} block={b} />
              ))}
            </div>
          ))}
        </div>
      );

    case "section":
      return (
        <div className="cms-section-placeholder">
          <p><em>Section: {block.section_name || block.section_slug}</em></p>
        </div>
      );

    default:
      return null;
  }
}

/**
 * Two-Column Layout
 * ===================
 * Renders the CMS page's headless_content structure, which supports
 * two columns: left (main content) and right (sidebar).
 *
 * If there are no right-column blocks, it renders a single full-width column.
 * If both columns have blocks, it uses a CSS grid layout (see pages.css).
 *
 * This matches the standard interior page layout used across all Bravo
 * template HTML mockups.
 */
/** Renders a list of blocks, styling the first heading with the page-title rule */
function BlockList({ blocks }: { blocks: Block[] }) {
  const firstHeadingId = blocks.find((b) => b.type === "heading")?.id;
  return (
    <>
      {blocks.map((b) => (
        <ContentBlock
          key={b.id}
          block={b}
          isFirstHeading={b.id === firstHeadingId}
        />
      ))}
    </>
  );
}

export function TwoColumnLayout({ content }: { content: { left?: { blocks: Block[] }; right?: { blocks: Block[] } } }) {
  const left = content?.left?.blocks || [];
  const right = content?.right?.blocks || [];
  const hasRight = right.length > 0;

  if (left.length === 0 && !hasRight) return null;

  // Single column — no sidebar content
  if (!hasRight) {
    return (
      <div>
        <BlockList blocks={left} />
      </div>
    );
  }

  // Two columns — main content + sidebar
  return (
    <div className="page__layout">
      <div className="page__main">
        <BlockList blocks={left} />
      </div>
      <aside className="sidebar">
        <BlockList blocks={right} />
      </aside>
    </div>
  );
}

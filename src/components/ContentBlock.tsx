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
  style?: string;
  align?: string;
  height?: number;
  level?: number;
  count?: number;
  columns?: { blocks: Block[] }[];
  section_slug?: string;
  section_name?: string;
  fields?: { key: string; label: string; type: string; value: string; locked: boolean; source_field?: string }[];
}

function HeadingBlock({ block }: { block: Block }) {
  const level = block.level || 2;
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <Tag dangerouslySetInnerHTML={{ __html: block.text || "" }} />;
}

export default function ContentBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "heading":
      return <HeadingBlock block={block} />;

    case "paragraph":
      return (
        <div
          className="cms-paragraph"
          dangerouslySetInnerHTML={{ __html: block.text || "" }}
        />
      );

    case "image":
      return (
        <figure className="cms-image">
          <img src={block.src} alt={block.alt || ""} />
        </figure>
      );

    case "video":
      return (
        <div className="cms-video">
          <video src={block.src} controls />
        </div>
      );

    case "button":
      return (
        <div className={`cms-button-wrap${block.align ? ` cms-button-wrap--${block.align}` : ""}`}>
          <a
            href={block.linkValue || "#"}
            className={`btn${block.style === "outline" ? " btn--outline" : ""}`}
          >
            {block.text}
          </a>
        </div>
      );

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

export function TwoColumnLayout({ content }: { content: { left?: { blocks: Block[] }; right?: { blocks: Block[] } } }) {
  const left = content?.left?.blocks || [];
  const right = content?.right?.blocks || [];
  const hasRight = right.length > 0;

  if (!hasRight) {
    return (
      <div>
        {left.map((b) => (
          <ContentBlock key={b.id} block={b} />
        ))}
      </div>
    );
  }

  return (
    <div className="page__layout">
      <div className="page__main">
        {left.map((b) => (
          <ContentBlock key={b.id} block={b} />
        ))}
      </div>
      <aside className="sidebar">
        {right.map((b) => (
          <ContentBlock key={b.id} block={b} />
        ))}
      </aside>
    </div>
  );
}

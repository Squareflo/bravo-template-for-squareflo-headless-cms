# Frontend Development Guidelines

These patterns are non-negotiable for every page and component in this project. The goal is SEO performance and discoverability by AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google AI Overview) alongside human users.

## Heading Hierarchy

- Every page has exactly ONE `<h1>` — the page's primary heading.
- When a Hero section is present on a page, the Hero's main heading is the `<h1>`. No other section, block, or component on that page may render an `<h1>`. All other headings start at `<h2>` and descend.
- On pages without a Hero, the first content heading is the `<h1>`.
- Use `<h2>` through `<h6>` in descending order. Do not skip levels.
- The HTML tag is determined by document structure, NOT by visual size. If the design calls for a small primary heading, use `<h1>` and style it smaller with CSS. Never downgrade tags for visual reasons.
- When building any new section or block that could appear anywhere on a page, default its top heading to `<h2>`. Never assume your section is the only one on the page.

## Semantic HTML

- Use `<main>`, `<article>`, `<section>`, `<nav>`, `<header>`, `<footer>`, `<aside>` correctly. They are not interchangeable with `<div>`.
- `<article>` for self-contained content (blog post, product card, event).
- `<section>` for thematically grouped content within a page.
- `<nav>` only for primary, secondary, or footer navigation — not for every group of links.
- Every page has one `<main>` containing the primary content.
- Buttons that perform actions are `<button>`. Links that navigate are `<a href="...">`. Never use `<div onClick>` for either.
- Never ship `<a>` tags without an `href`. If there's no destination, render a different element.

## Defensive CMS Rendering

The CMS is operated by non-technical owners who will save half-finished states, delete pages with dangling references, and leave optional fields empty. The frontend must be resilient to all of it.

- **Never assume a CMS field is populated.** Every optional field needs a fallback path.
- **URLs (nav items, buttons, CTAs, links):** If null or empty, render a `<span>` instead of an `<a>`. Optionally add a visual disabled state during development so editors can see what's incomplete.
- **Images:** If null, either omit the `<img>` entirely or render a placeholder. Never render `<img src="">` or `<img src={null}>` — both produce broken requests.
- **Meta fields (title, description, OG image):** Fall back to defaults from the `/settings` endpoint. Never render empty meta tags.
- **Rich text / HTML fields:** Check the field has content before rendering. Sanitise before injecting with `dangerouslySetInnerHTML`.
- **Arrays (entries, FAQs, reviews):** Always handle the empty case explicitly. Don't render an empty `<section>` with just a heading and no content.
- **Nested fields:** Use optional chaining (`?.`) for any CMS-provided object path. Don't trust the shape.

The principle: a broken or half-built CMS state should produce a graceful, partially-rendered page — not 500 errors, console errors, or broken HTML.

## Images

- Every `<img>` has a meaningful `alt` attribute. Decorative images use `alt=""` (empty, but present).
- Use Next.js `<Image>` for any image not coming from a pre-optimised CDN.
- For CMS images served from ImageKit/Cloudinary, use the CDN's transformation parameters (width, format=auto, quality).
- Set `width` and `height` (or `aspect-ratio` in CSS) on every image to prevent Cumulative Layout Shift.
- Lazy-load below-the-fold images (`loading="lazy"`). The hero/LCP image is the exception — preload it and do NOT lazy-load.

## Metadata

- Every page implements `generateMetadata()` in the App Router.
- Pull every field from `page.meta` returned by the CMS API: title, description, og_title, og_description, og_image, canonical_url, no_index, no_follow.
- If `page.meta.structured_data` is present, render it as a JSON-LD script tag in the page head. Do not hand-craft structured data.
- If `page.meta.canonical_url` is null, default the canonical to the current page URL.

## Structured Data (JSON-LD)

- All JSON-LD comes from the CMS API. Do not write schema.org markup by hand in components.
- Render as: `<script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(data)}} />`
- Place inside the page `<head>` via Next.js metadata or in the page body before the closing of `<main>`.

## Design Tokens

- All visual styling — colors, typography, button styles, form styles — comes from the CMS `/settings` endpoint under `design`.
- These are applied as CSS custom properties at the root level.
- The static stylesheet must reference tokens via `var(--token-name)`. Never hardcode a color, font-size, border-radius, or any other value configurable in the CMS dashboard.
- When adding new styled elements, check Settings > Site Style first to see if a token already exists. Add new tokens to the CMS schema rather than introducing hardcoded values.

## Performance — Core Web Vitals

- Target LCP < 2.5s, INP < 200ms, CLS < 0.1.
- Preload the hero/LCP image with `<link rel="preload" as="image">`.
- Preconnect to external domains used for critical resources.
- Avoid large external CSS files for tiny use cases (don't load full Font Awesome for three icons).
- Tree-shake every npm dependency. Check bundle output regularly.
- Use `next/font` for web fonts to prevent FOIT/FOUT and layout shift.
- Defer non-critical JavaScript with `strategy="lazyOnload"` or `"afterInteractive"`.

## Server vs Client Components

- Default to Server Components. Mark a file `"use client"` only when it needs interactivity.
- Keep client component trees as small as possible. A `"use client"` wrapper does NOT need to wrap the entire page — wrap only the interactive piece.
- Fetch CMS data in Server Components. Do not call the CMS from the browser unless data is user-specific or real-time.

## Crawler Accessibility

- All primary content must be in the initial server-rendered HTML.
- Do not block rendering on client-side fetches for content that exists in the CMS at build/request time.
- Test pages with JavaScript disabled — primary content should still be readable.

## Accessibility

- All interactive elements must be keyboard-navigable.
- Use `aria-label`, `aria-expanded`, `aria-controls` on toggle buttons.
- Forms have proper `<label>` elements associated with inputs via `htmlFor` / `id`.
- Color contrast must meet WCAG AA at minimum (4.5:1 for body text).
- Skip-to-content link at the top of every page for screen readers.

## Rich Text from the CMS

- The CMS returns rich text as HTML strings in fields like `body` and `cms-paragraph` blocks.
- Always sanitise CMS HTML before rendering with `dangerouslySetInnerHTML`. Use DOMPurify (server-side preferred). Never render raw CMS HTML without sanitisation.

## URL and Routing

- All URLs lowercase, hyphenated, no trailing slashes.
- Slugs come from the CMS. Never hardcode page paths.
- 404s render a proper not-found page with status 404, not a soft 200.
- Redirects (when a page slug changes) are configured in the CMS or `next.config.js` — never via client-side redirects for SEO content.

## Checklist Before Shipping a New Page or Feature

- [ ] Exactly one `<h1>` per page (from the Hero if present, otherwise the first content heading)
- [ ] No section other than the Hero ever renders an `<h1>`
- [ ] Heading levels don't skip
- [ ] Semantic HTML throughout (no `<div>` soup)
- [ ] Every image has alt text and explicit dimensions
- [ ] All optional CMS fields handled defensively (null-safe rendering)
- [ ] No `<a>` tags rendered without `href`
- [ ] generateMetadata() pulls all fields from CMS
- [ ] JSON-LD structured data rendered if provided by CMS
- [ ] All visual styling uses CSS variables, no hardcoded values
- [ ] Works with JavaScript disabled (primary content visible)
- [ ] Keyboard-navigable
- [ ] Lighthouse score > 90 on Performance, SEO, Accessibility
- [ ] No console errors or warnings

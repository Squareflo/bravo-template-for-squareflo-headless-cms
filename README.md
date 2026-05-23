# Bravo Template for SquarefloCMS (Headless)

> **Powered by [SquarefloCMS](https://squareflo.com)** — a free headless CMS for developers.
> Built with [Next.js](https://nextjs.org) and deployed on [Vercel](https://vercel.com).
> Data stored in [Supabase](https://supabase.com).

This is a production-ready website template that pulls all its content, navigation,
design tokens (colors, fonts, buttons), and SEO settings from SquarefloCMS's headless API.
Everything you see on the site is managed through the CMS — no hardcoded content.

**Live site:** [https://bravotemplate.com](https://bravotemplate.com)

---

## How This Site Works

```
┌──────────────────────┐      API calls       ┌──────────────────────┐
│                      │  ─────────────────►   │                      │
│   This Next.js App   │   /settings           │   SquarefloCMS API   │
│   (Vercel)           │   /navigation         │   squareflo.com/api  │
│                      │   /pages              │   (Supabase backend) │
│                      │  ◄─────────────────   │                      │
└──────────────────────┘      JSON responses   └──────────────────────┘
```

1. **Design tokens** (colors, fonts, buttons) come from `GET /settings` and are injected as CSS custom properties on `<html>`
2. **Navigation** comes from `GET /navigation?location=header` — fully dynamic, managed in the CMS
3. **Pages** come from `GET /pages` and `GET /pages/:slug` — content is a block-based structure (headings, paragraphs, images, buttons, columns, etc.)
4. **SEO metadata** is generated per-page from CMS data
5. **Google Fonts** are loaded dynamically based on the typography settings in the CMS

---

## Quick Start (Clone This Site)

### 1. Create your site in SquarefloCMS

1. Go to [squareflo.com](https://squareflo.com) and sign up (free)
2. Create a new site
3. Configure your site using the CMS documentation:
   - **Settings** — business info, logos, design tokens (colors, typography, buttons)
   - **Navigation** — add your menu items
   - **Pages** — create pages with the headless content editor
### 2. Connect your Vercel project

1. Push this repo to your own GitHub account
2. Go to [vercel.com](https://vercel.com) and import the repo as a new project
3. **IMPORTANT: Set the Framework Preset to "Next.js"** in Vercel → Project Settings → General → Framework Preset. If this is left as "Other" or auto-detected incorrectly, the site will build but return 404 on all pages.
4. Note your **Project ID** (found in Vercel → Project Settings → General) and **Team ID**

### 3. Connect SquarefloCMS to Vercel

In the CMS dashboard, go to **Integrations → Frontend Hosting**:

1. **Vercel API Token** — create one at [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. **Project ID** — paste your Vercel project ID
3. **Team ID** — paste your Vercel team ID (optional for personal accounts)
4. Click **"Test Connection"** to verify
5. **Deploy Hook URL** — create a deploy hook in Vercel (Settings → Git → Deploy Hooks), name it "SquarefloCMS", and paste the URL here. This lets the CMS trigger a redeploy when content changes.
6. Click **"Push Env Vars to Vercel"** — this automatically sets the required environment variables on your Vercel project:
   - `SQUAREFLO_API_URL` — CMS API base URL
   - `SQUAREFLO_API_KEY` — your site's API key
   - `SQUAREFLO_DRAFT_KEY` — for draft/preview content
7. **Git Repository** — paste your repo URL so the CMS knows where the code lives

### 4. Run locally

```bash
git clone https://github.com/Squareflo/bravo-template-for-squareflo-headless-cms.git
cd bravo-template-for-squareflo-headless-cms
npm install
```

Create a `.env.local` file for local development (copy the values from the CMS
integrations page or from your Vercel project settings):

```env
SQUAREFLO_API_URL=https://squareflo.com/api/v1
SQUAREFLO_API_KEY=your_api_key_here
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site.

### 5. Set up your custom domain

You can configure a custom domain for your site through the CMS:

1. In the CMS dashboard, go to **Settings → Domain**
2. Enter your custom domain (e.g., `yourbusiness.com`)
3. Expand **DNS Settings** — it will show you the DNS records to add:
   - Add a **CNAME** record pointing `@` to `cname.vercel-dns.com.`
   - Or click **"Auto-configure via Cloudflare"** if your DNS is on Cloudflare
4. Also add the domain in **Vercel → Project Settings → Domains**

The CMS settings page also lets you configure Business Info, Logos, Site Style
(colors, typography, buttons & forms), AI Context, and enabled Modules.

### 6. Deploy

Your site deploys automatically in two ways:
- **Code changes:** Every push to `main` triggers a Vercel production deploy
- **Content changes:** The CMS deploy hook triggers a redeploy when you update content

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout — fetches design tokens + nav from CMS
│   ├── page.tsx            # Home page — renders CMS home page content
│   └── [slug]/
│       └── page.tsx        # Dynamic pages — renders any CMS page by slug
├── components/
│   ├── Header.tsx          # Site header — utility bar + main nav (server component)
│   ├── MobileNav.tsx       # Mobile hamburger menu (client component)
│   └── ContentBlock.tsx    # CMS content block renderer + two-column layout
├── lib/
│   ├── cms.ts              # API client for SquarefloCMS headless API
│   └── types.ts            # TypeScript interfaces for all CMS data shapes
└── styles/
    ├── globals.css          # CSS reset, base styles, design token fallbacks
    ├── header.css           # Navigation styles (hybrid V3 utility + V6 dark solid)
    └── pages.css            # Page content, two-column layout, CMS block styles

html-reference/             # Original HTML mockup files — use as design reference
├── nav-showcase-*.html     # All 10+ navigation variations
├── index-*.html            # Home page designs
├── blog-*.html             # Blog listing and detail pages
├── services-*.html         # Services listing and detail pages
├── products-*.html         # Products and e-commerce pages
├── testimonials-*.html     # Testimonials listing and detail pages
├── team-*.html             # Team listing and detail pages
├── contact-*.html          # Contact page
├── sign-in-*.html          # Auth pages (sign in, sign up, verify)
├── footer-showcase-*.html  # Footer variations
└── styles-*.css            # Complete CSS for all HTML mockups
```

---

## HTML Reference Files

The `html-reference/` folder contains the original static HTML mockup files for the
Bravo template. These are **design references only** — they are not served by the app.

When building new sections, open the relevant HTML file to see the exact markup and
CSS class names used, then replicate the design in a React component. The CSS from
`styles-r4m7t9w2qx.css` in that folder contains every style used across all mockups.

---

## How Design Tokens Work

The CMS `GET /settings` endpoint returns design configuration including colors,
typography, and button presets. The root layout (`src/app/layout.tsx`) converts
these into CSS custom properties and applies them to the `<html>` element:

```
CMS Setting              →  CSS Variable            →  Used By
─────────────────────────────────────────────────────────────────
design.colors.brand      →  --color-accent          →  Links, buttons, accents
design.typography.h1     →  --font-heading          →  All headings, nav links
design.typography.body   →  --font-body             →  Body text
design.buttons.primary   →  --btn-primary-bg, etc.  →  All .btn elements
```

This means changing your brand color in the CMS instantly updates the entire site.

---

## CMS API Endpoints Used

| Endpoint                          | Used In           | Purpose                              |
|-----------------------------------|-------------------|--------------------------------------|
| `GET /settings`                   | `layout.tsx`      | Design tokens, business info, SEO    |
| `GET /navigation?location=header` | `layout.tsx`      | Header navigation items              |
| `GET /pages?home_only=true`       | `page.tsx`        | Home page content                    |
| `GET /pages`                      | `[slug]/page.tsx` | All pages (for static generation)    |
| `GET /pages/:slug`                | `[slug]/page.tsx` | Individual page content              |

All API calls use ISR (Incremental Static Regeneration) with a 60-second revalidation,
so content updates in the CMS appear on the live site within a minute.

---

## Navigation Design

The header uses a **hybrid navigation pattern**:

- **Top tier:** Variation #3's utility bar (dark strip with phone number, business hours, social links)
- **Main bar:** Variation #6's dark solid style (dark background, white text, accent color on hover)

See `html-reference/nav-showcase-r4m7t9w2qx.html` for all 10+ navigation variations
available in the Bravo template. To switch variations, update the CSS in `src/styles/header.css`
and the markup in `src/components/Header.tsx`.

---

## Tech Stack

| Layer      | Technology                                                     |
|------------|----------------------------------------------------------------|
| Framework  | [Next.js 16](https://nextjs.org) (App Router, React 19)       |
| CMS        | [SquarefloCMS](https://squareflo.com) (headless API)           |
| Hosting    | [Vercel](https://vercel.com) (auto-deploy from GitHub)         |
| Database   | [Supabase](https://supabase.com) (powers SquarefloCMS backend)|
| Icons      | [Font Awesome 6](https://fontawesome.com) (CDN)               |
| Fonts      | [Google Fonts](https://fonts.google.com) (dynamic from CMS)   |

---

## For AI Agents & Developers

This template is designed to be easily cloned and customized. Here's what you need to know:

1. **All content is dynamic** — never hardcode text, images, or navigation
2. **All styling flows from CSS variables** — the CMS is the single source of truth for design
3. **The HTML reference files are your design bible** — every section we build matches those mockups
4. **ISR keeps the site fast** — pages are statically generated and revalidated every 60 seconds
5. **The CMS API is documented** — check SquarefloCMS documentation for all available endpoints
6. **Environment variables are required** — `SQUAREFLO_API_URL` and `SQUAREFLO_API_KEY` must be set

To add a new section (e.g., blog, services, testimonials):
1. Find the relevant HTML mockup in `html-reference/`
2. Study the markup structure and CSS classes
3. Create a new route in `src/app/` and a component in `src/components/`
4. Fetch data from the appropriate CMS API endpoint
5. Style it using classes from `html-reference/styles-r4m7t9w2qx.css`

---

## Troubleshooting

### Site returns 404 after deploying

**Cause:** The Vercel project's Framework Preset is not set to "Next.js".

**Fix:** Go to Vercel → Project Settings → General → Framework Preset → select
**Next.js**, then redeploy. This is the #1 issue when setting up the project for
the first time, especially if the repo was initially created with static HTML files
before being converted to Next.js.

### Pages show "No home page has been created yet"

**Cause:** No pages exist in the CMS yet, or no page is flagged as the home page.

**Fix:** In the CMS dashboard, go to Pages → create a page and set it as the home page.

### Styles look wrong / no brand colors

**Cause:** The CMS design tokens haven't been configured, so CSS fallback values are used.

**Fix:** In the CMS dashboard, go to Settings → Site Style and configure your brand
colors, typography, and button presets.

### Environment variables not working

**Cause:** Env vars haven't been pushed to Vercel from the CMS.

**Fix:** In the CMS dashboard, go to Integrations → Frontend Hosting → click
**"Push Env Vars to Vercel"**. For local development, copy them into `.env.local`.

---

## License

This template is provided by [SquarefloCMS](https://squareflo.com) for use with the
SquarefloCMS headless CMS platform. Free to use, modify, and deploy.

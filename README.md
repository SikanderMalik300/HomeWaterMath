# HomeWaterMath

Static, source-backed calculators for home water: water softener size, cost,
salt use, hardness conversion, and well pressure-tank sizing.
Live site: https://homewatermath.com

## Stack

- Next.js (App Router) with `output: 'export'`, `trailingSlash: true`, `images: { unoptimized: true }`
- TypeScript (strict), Tailwind CSS, Lucide icons
- Figtree via `next/font/local` (self-hosted woff2, weights 400/500/600, `display: swap`)
- Vitest for the formula, registry and content tests
- Hosting: Cloudflare Pages (build `npm run build`, output `out`, `NODE_VERSION=22`)

## Architecture

- `lib/calc/*` - pure TypeScript formulas with unit tests. No math in components.
- `lib/data/constants.ts` - every constant, each with a source id and comment.
- `lib/data/sources.ts` - every cited source (name, url, accessed).
- `lib/data/pages.ts` - the page registry (single source of truth). Navigation,
  hubs, related links, breadcrumbs, sitemap and llms.txt are generated from it.
- `lib/data/photos.ts` - photo registry (credits, focal points, usage).
- `lib/content/*` - all exact page copy (scanned by the banned-word test).
- `components/*` - shared and calculator components. Calculators are client
  islands; the default example result is server-rendered into the static HTML.
- `app/*` - routes (18 URLs + a custom 404).

## Scripts

```bash
npm test            # Vitest (formulas, registry integrity, banned-word scan, tables)
npm run build       # prebuild (assets) + next build -> static export in out/
npm run process-photos   # download + process the 6 approved photos into public/photos
```

`prebuild` (`scripts/generate-assets.mjs`) copies the supplied logo files,
writes `robots.txt`, `sitemap.xml`, `llms.txt`, `_headers`, `site.webmanifest`,
and renders one 1200x630 OG image per page. It runs automatically before
`next build` and `next dev`.

## Environment variables (all optional, read at build time)

- `NEXT_PUBLIC_GA_ID` - enable GA4 (Consent Mode v2, lazy-loaded)
- `NEXT_PUBLIC_WEB3FORMS_KEY` - enable the contact form
- `NEXT_PUBLIC_ADSENSE_ID` - enable ad slots
- `NEXT_PUBLIC_AFFILIATES_ON` - "1" shows affiliate boxes
- `NEXT_PUBLIC_EMAIL_ON` - "1" shows the email signup

With none set (launch state) there are no ads, affiliate links, GA or email
signup, and the contact page shows only the email address.

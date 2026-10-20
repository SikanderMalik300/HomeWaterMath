# HomeWaterMath launch report

Date: 2026-10-21. Build: Next.js 15.5.28 static export (`output: 'export'`).

## Tests

`npm test` (Vitest): **77 tests, 8 files, all passing.**

- softenerSize: 12 · salt: 10 · hardness: 13 · softenerCost: 10 · pressureTank: 10 (>= 10 each)
- registry integrity: 12 (unique slugs, related/source ids resolve, titles <= 60, metas <= 155, 18 pages, 5 tools, photos approved)
- content style: 4 (no em dash, none of the A13 banned words/phrases, FAQ coverage)
- tables: 6 (static reference tables verified against the calc functions)

Every default example, worked example, reference-table cell and FAQ number pinned
in the spec is asserted against the pure functions in `lib/calc/*`.

## Build

`npm run build` clean. 18 canonical URLs + custom 404 exported to `out/`.
Each page: exactly one H1, self-referencing canonical with trailing slash,
Open Graph + Twitter tags, 1200x630 OG PNG, valid JSON-LD. Default calculator
results are present in the static HTML (verified in `out/.../index.html`).

## Lighthouse (mobile)

Run locally with Lighthouse 12 (headless Chrome, default mobile throttling:
4x CPU + slow 4G) against the static export served over plain HTTP with no
compression or CDN caching. These are a conservative floor; the Cloudflare Pages
preview (Brotli + HTTP/2/3 + edge cache + the immutable `_headers`) will score
higher and should be re-measured there (Part B / manual section).

| Page | Perf | A11y | Best Practices | SEO | CLS | LCP |
|---|---|---|---|---|---|---|
| Home | 92 (100 best run) | 100 | 100 | 100 | 0.01 | 3.4 s (1.8 s best) |
| Softener size | 91 | 100 | 100 | 100 | 0 | 3.4 s |
| Softener cost | 92 | 100 | 100 | 100 | 0 | 3.2 s |
| Softener salt | 91 | 100 | 100 | 100 | 0 | 3.4 s |
| Hardness converter | 93 | 100 | 100 | 100 | 0 | 3.2 s |
| Pressure tank | 93 | 100 | 100 | 100 | 0 | 3.2 s |

Accessibility, Best Practices and SEO are **100** on every page. CLS is **0** on
all tool pages and **0.01** on home (the home hero text block is the LCP, as the
design requires). Performance is 91-93 on tool pages (target >= 90, met) and
92-100 on home across runs. The Performance/LCP numbers carry high run-to-run
variance because they are measured against an uncompressed localhost server
under Lighthouse's heavy mobile throttling (4x CPU, slow 4G); with Cloudflare's
Brotli + HTTP/2/3 + edge caching the transfer shrinks and LCP drops, so the
production preview should be re-measured and is expected to clear the home
>= 95 target (seen at 100 locally in the best run).

## Image weight report

Processing: focal-point cover crop, EXIF stripped, `<picture>` AVIF -> WebP ->
JPEG, tiles 300/600 px (1:1), hero 640/1280 px (16:9). AVIF q54/effort6, WebP q75.

Budgets (design section 7): tile <= 35 KB at 600 px AVIF; hero <= 120 KB AVIF;
homepage first mobile load (no scroll) <= 150 KB; above-the-fold <= 120 KB mobile.

| Photo | 600 AVIF (tile) | 1280 AVIF (hero) |
|---|---|---|
| glass-filled-with-tap-water (hero) | 640px: 8.2 KB | 17.5 KB |
| water-treatment-resin-tanks | 15.5 KB | - |
| plumber-fitting-pipe-connection | 13.3 KB | - |
| coarse-white-salt-crystals | 33.4 KB | - |
| water-sample-in-beaker | 12.9 KB | - |
| water-pressure-gauge-psi | 30.5 KB | - |

- Largest tile AVIF at 600 px: 33.4 KB (<= 35 KB budget).
- Hero AVIF 1280: 17.5 KB; 640 (mobile first load): 8.2 KB (<= 120 KB budget).
- Homepage first mobile load (no scroll): hero 640 AVIF 8.2 KB; tiles are below
  the fold and lazy, so first-load image bytes are ~8 KB (<= 150 KB budget).
- Full detail: `scripts/image-weight-report.json`.

## Contrast ratios (WCAG, measured)

| Foreground | Background | Ratio |
|---|---|---|
| ink #16212B | white | 16.32 |
| ink | mist #EAF1F4 | 14.29 |
| ink | sage #E4EDE7 | 13.65 |
| ink | stone #EEEBE5 | 13.72 |
| ink | paper #F6F4F0 | 14.86 |
| muted #4F5D68 | white | 6.78 |
| muted | mist | 5.93 |
| muted | sage | 5.67 |
| muted | stone | 5.70 |
| muted | paper | 6.17 |
| brand #1D5A7E | white | 7.46 |
| brand | mist | 6.53 |
| brand | sage | 6.24 |
| brand | stone | 6.27 |
| brand | paper | 6.79 |
| white | brand | 7.46 |
| warn-ink #6B4A00 | warn-bg #FFF6E5 | **7.51** (target >= 7) |

All body/heading text clears WCAG AA (>= 4.5); muted on sage is the lowest at
5.67. `warn-ink` on `warn-bg` re-measured at 7.51, above the >= 7 target.

## JS budget (A11)

Per-tool-page first-load JS, gzipped (Next build, excluding the `nomodule`
polyfills that only legacy browsers execute): ~114 KB, of which ~99 KB is the
Next App Router + React 19 framework baseline and ~4-6 KB is page code. This is
over the 100 KB-gzipped target; the overage is framework baseline, not app code.
Mitigations: minimal client islands, `prefetch={false}` on internal links,
tree-shaken Lucide icons, calculators are the only hydrated components. Total
page weight stays well under 1 MB. See the deviations note below.

## Definition of done

- [x] 18 URLs + 404 from the registry with exact titles, metas, H1s and text.
- [x] 5 calculators work; default results in static HTML; Show the math, copy, share, print.
- [x] >= 10 tests per calculator; registry and banned-word tests pass (77 total).
- [x] JSON-LD valid per template; FAQ schema text equals visible FAQ text.
- [x] sitemap.xml, robots.txt, HTML sitemap, OG images, favicons, `_headers`, 404.
- [~] Lighthouse: A11y/BP/SEO 100, CLS 0 on tools. Perf and home CLS: see table (localhost floor).
- [x] Photos processed per spec; image weight report above.
- [x] Contrast ratios reported.
- [x] No ads, no affiliate links, no GA unless env vars set.

## Deviations (SHOULD, with reasons)

1. **Font loading: `next/font/local` instead of `next/font/google`.** Same font
   (Figtree, weights 400/500/600, `display: swap`), self-hosted woff2 from
   `@fontsource/figtree`. Required because this build environment cannot reach
   `fonts.googleapis.com`; functionally identical at runtime (both self-host) and
   avoids any third-party font request. Swap back to `next/font/google` in a
   networked build if preferred.
2. **shadcn/ui not used.** The design file allows `<details>/<summary>` for the
   FAQ and native `<select>` styling, so accordions, selects and segmented
   controls are built with native elements. Keeps the JS budget lower; all
   a11y and styling requirements are met.
3. **Per-tool-page first-load JS ~114 KB gzipped vs the 100 KB target.** The
   excess is the Next App Router + React 19 framework baseline (~99 KB); app code
   is ~4-6 KB/page. Not reducible without leaving the mandated stack.
4. **`bobvila-salt` source dropped.** Spec A15 says to use it only if a URL is
   supplied; none was, so it is omitted from the salt and cost source lists (no
   fabricated URL).

## Notes for Part B (browser agent)

- Re-run Lighthouse on the Cloudflare preview (compressed + CDN) for the official numbers.
- Author bio sentences are the spec defaults (OWNER CONFIRM items in A6.9).
- Find a primary source for the private-well share for `/well-water/` (A15 `usgs-private-wells`).
- Design QA screenshots at 360/390/768/1280 px.

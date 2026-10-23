# HomeWaterMath embed spec: embeddable calculators

Date: 2026-10-22. Written by: browser agent, following the backlinks playbook section 4.1. For: the coding agent.
Goal: other sites can put our calculators on their pages with one line of code, and each embed carries a visible credit link back to us.

## 1. Which calculators (4)

| Embed URL | Source tool | Why |
|---|---|---|
| `/embed/water-softener-size-calculator/` | size calculator | Highest-intent tool; writers explain sizing math by hand (Bob Vila, Family Handyman, real estate guides) |
| `/embed/water-hardness-converter/` | hardness converter | Every county/state well page and utility report gives hardness in mg/L; owners need gpg |
| `/embed/water-softener-salt-calculator/` | salt calculator | Chloride-reduction programs (MN, WI) want households to cut salt |
| `/embed/well-pressure-tank-size-calculator/` | pressure tank calculator | Well-owner programs and inspectors explain short-cycling with no sizing tool |

Cost calculators are not embeddable (their prices change and dealers won't host them).

## 2. Embed page (`app/embed/[tool]/page.tsx`, static export)

- Content: a one-line title (the tool's H1 text, 18 px / 600), then the same calculator card the tool page uses (inputs, result card, "Show the math"). Reuse the existing calculator component; don't fork the formula code.
- Nothing else: no site header, nav, footer, quick answer, photos, FAQ, ads, cookie or consent banner.
- At the bottom inside the frame, one muted line: `Open the full calculator, with sources, on HomeWaterMath` linking to the tool page with `target="_blank" rel="noopener"`.
- Default result is rendered in the static HTML, same as the tool page. Share params (`?people=4&hardness=15` etc.) prefill the inputs, so a host can set defaults.
- Layout: full width of the iframe, min width 300 px, white background, 16 px padding, no horizontal scroll at 300 to 800 px.
- Removed for embeds: Copy, Share and Print buttons (they confuse inside a frame), the mobile sticky result bar.
- Performance budget: under 60 KB gzipped JS for the page, no images, Figtree from our own domain (already self-hosted). Lighthouse performance ≥ 95 when opened directly.

## 3. No tracking, noindex, framing

- No GA4, no `track()` events, no Cloudflare Web Analytics beacon inside embeds. Our code: don't render the analytics component on `/embed/*`. Cloudflare injects its beacon automatically, so add these headers for `/embed/*` in `public/_headers` (Cloudflare Pages):
  ```
  /embed/*
    X-Robots-Tag: noindex
    Cache-Control: public, max-age=3600, no-transform
    Content-Security-Policy: frame-ancestors *
    Referrer-Policy: strict-origin-when-cross-origin
  ```
  `no-transform` stops Cloudflare from rewriting the HTML (including beacon injection). Verify in the built and deployed page that `static.cloudflareinsights.com` is not requested; report the result.
- Also add `<meta name="robots" content="noindex">` and `<link rel="canonical">` pointing to the full tool page.
- Make sure no `X-Frame-Options` header is sent for `/embed/*` (check the existing `_headers`; if a site-wide `X-Frame-Options: DENY/SAMEORIGIN` exists, scope it to exclude `/embed/*`).
- Exclude `/embed/*` from sitemap.xml, llms.txt, IndexNow, the registry's page lists, and internal search. Don't disallow it in robots.txt.

## 4. Auto-height (optional script, no tracking)

Embed pages post their height to the parent on load and on every result change:
`parent.postMessage({ type: 'hwm-embed-height', tool: '<slug>', height: document.documentElement.scrollHeight }, '*')`.
Provide `public/embed.js` (under 1 KB, no network calls, no cookies) that listens for that message and sets the matching iframe's height. The snippet works without it (fixed height); the script only removes the scrollbar.

## 5. "Get this calculator for your site" box (on the 4 tool pages)

Place it after "Related calculators" and before "Sources". A `<details>` element, closed by default:
- Summary: `Add this calculator to your site (free)`
- Text (exact): "Free to use on your website, newsletter platform or intranet. No sign-up, no tracking inside the frame. Paste this code where you want the calculator to appear:"
- A read-only `<textarea>` with the snippet below (monospace 13 px, 4 rows) and a "Copy code" button (fires GA4 event `embed_code_copied` with `tool` = slug, on our page only).
- Note under it (exact): "Please keep the credit line under the calculator. Questions? hello@homewatermath.com"

Snippet (one line; per tool, swap slug, title and height):
```html
<iframe src="https://homewatermath.com/embed/water-softener-size-calculator/" title="Water softener size calculator" width="100%" height="720" style="border:0;max-width:680px" loading="lazy"></iframe><p style="font:14px/1.4 sans-serif;margin:6px 0 0">Calculator by <a href="https://homewatermath.com/water-softener-size-calculator/">HomeWaterMath</a></p><script src="https://homewatermath.com/embed.js" async></script>
```
Heights (fixed fallback): size 720, hardness 520, salt 640, pressure tank 680. Measure the real default heights at 680 px wide and adjust; report the values.
Credit link rules: brand anchor "HomeWaterMath" only (no keyword anchors), plain followed link, outside the iframe, linking to the matching full tool page.

## 6. Landing page for outreach: `/calculators-for-your-site/`

Indexable page in the registry (category: none; linked from the footer "Site" column as "Free calculators for your site"):
- Title: `Free Water Calculators for Your Website | HomeWaterMath` (55)
- Meta: `Add our free, sourced water softener, hardness, salt and well pressure tank calculators to your website with one line of code. No sign-up or tracking.` (150)
- H1: `Free water calculators for your website`
- Intro (exact): "Our calculators are free to embed on any website: county and extension pages, utility sites, blogs and community groups. Every number is sourced, the math is shown, and nothing inside the frame tracks your visitors."
- For each of the 4 tools: H2 with the tool name, one-line description (registry `cardBlurb`), a live embed preview (lazy iframe), and the same copy-code box.
- H2 "Terms (exact)": "Free for any non-misleading use. Keep the credit line visible. Don't change the results or present them as your own. We may update formulas when sources change; embeds update automatically."
- Schema: WebPage + Person + BreadcrumbList (per fix-04).

## 7. Tests

- Each embed route builds, contains the calculator's default result, has `noindex` meta and canonical to the tool page, and renders no analytics component.
- `_headers` contains the `/embed/*` block; no `X-Frame-Options` applies to `/embed/*`.
- `/embed/*` absent from sitemap.xml, llms.txt and the IndexNow URL list.
- Snippet text on each tool page matches the snippet generator (single source of truth in `lib/embed.ts`).
- embed.js: unit test that a message sets the iframe height for the matching src only.
- Heading order and title/meta limits pass on `/calculators-for-your-site/`.

## Report back

Commit, tests passed/total, embed heights measured, confirmation that the deployed embed page makes no request to static.cloudflareinsights.com or google-analytics.com, and a screenshot of each embed at 360 px and 680 px.

# HomeWaterMath design (v1)

Date: 2026-10-20. Written by: browser agent. Scope: whole site at launch.
Goal: looks like a calm, trusted independent publisher. Real photos, white space, one font, soft bands. Never like a generic AI-made site.

## 1. References

Borrow patterns only (never code, text, logos or photos): split hero with a soft colour block and one real photo; square photo tiles with a name and one muted line; full-width soft bands per category; thin-bordered white cards; quiet tables. (Browser agent will add 3 to 5 reference screenshots to the sheet's Design references tab when the browser is available; they don't change anything below.)

## 2. Typography

- Font: **Figtree** via `next/font/google`, `display: 'swap'`, `subsets: ['latin']`, weights 400, 500, 600.
- H1: 40 px / 500 desktop, 30 px mobile, line-height 1.15, letter-spacing -0.01em.
- H2: 28 px / 500 desktop, 24 px mobile, line-height 1.2.
- H3: 20 px / 500.
- Tile and card names: 16 px / 500.
- Body: 16 px / 400, line-height 1.6. Max line length 68ch.
- Small text, captions, dates: 14 px. Never under 12 px.
- Big result numbers: 32 px desktop / 28 px mobile, weight 600, `font-variant-numeric: tabular-nums`. Tables also tabular-nums.
- Sentence case for every heading and button. Left-aligned text.

## 3. Colour tokens (CSS variables on `:root`)

| Token | Hex | Use |
|---|---|---|
| `--bg` | #FFFFFF | Page |
| `--surface` | #FFFFFF | Cards, inputs |
| `--ink` | #16212B | Headings, body |
| `--muted` | #4F5D68 | Descriptions, captions, dates |
| `--line` | #E1E4E6 | Borders, table row lines |
| `--brand` | #1D5A7E | Links, buttons, focus rings, arrows, active segments |
| `--brand-hover` | #174A68 | Hover on buttons/links |
| `--band-1` (mist) | #EAF1F4 | Hero block, Water softeners band |
| `--band-2` (sage) | #E4EDE7 | Well water band |
| `--band-3` (stone) | #EEEBE5 | Spare |
| `--band-4` (paper) | #F6F4F0 | Popular answers band, footer |
| `--warn-bg` | #FFF6E5 | Warning notes in results |
| `--warn-ink` | #6B4A00 | Warning text |

Measured contrast (WCAG): ink on white 16.3, on mist 14.3, on sage 13.7, on stone 13.7, on paper 14.9. Muted on white 6.8, mist 5.9, sage 5.7, stone 5.7, paper 6.2. Brand on white 7.5, mist 6.5, sage 6.2, stone 6.3, paper 6.8. White on brand 7.5. The coding agent must re-measure `--warn-ink` on `--warn-bg` (target >= 7) and report all ratios.
No dark mode at launch.

## 4. Layout and spacing

- 8 px grid. Container max 1200 px; side padding 16 px (mobile) / 24 px (tablet) / 40 px (desktop).
- Section spacing 64 px desktop, 40 px mobile. Bands are full width, content inside the container.
- Radius: photos 4 px; cards, result card, tables, inputs 12 px; pills (search, chips, segmented controls) 999 px; buttons 999 px.
- Borders 1 px `--line` on all sides of cards. Shadow at most `0 1px 2px rgba(0,0,0,.04)`.
- Tool pages: single column, content width 760 px max, calculator card can go to 860 px. Desktop may add a right column only for "On this page" links (optional, sticky, 220 px) if it doesn't hurt LCP or CLS.

## 5. Components

- **Header**: logo left (icon + two-tone wordmark, see Logo below), links "Water softeners", "Well water", "How we calculate", "About"; search icon opening the same filter as the homepage search. White, 1 px bottom line, not sticky. Mobile: wordmark + menu button opening a simple sheet.
- **Footer** (paper band): three columns: Calculators (5 links), Site (About, How we calculate, Editorial policy, Contact, Sitemap), Legal (Privacy, Terms, Disclaimer, Affiliate disclosure). Bottom line: "© 2026 HomeWaterMath · Sikander Mushtaq · hello@homewatermath.com" and "Estimates only. Check your equipment's spec sheet and local plumbing code." (Use a middle dot, not an em dash.)
- **Hero (home)**: split. Mist block about 55% with H1, intro, search pill, 4 chips; real photo about 45% full height (440 px desktop), edge to edge, no radius. Mobile (< 768 px): block first (so H1 is LCP), then photo at 4:3, max 220 px tall, lazy.
- **Search pill**: 48 px tall, white, 1 px line border, magnifier icon left, visible aria-label "Search calculators". Client-side filter of tiles; all tiles visible without JS. Results area `aria-live="polite"`.
- **Chips**: pill links 40 px tall (44 px hit area), white, 1 px border, 14 px / 500, wrap to max 2 lines on mobile.
- **Photo tile** (one shared component): whole tile is one `<a>`. Photo 1:1, radius 4 px, `object-fit: cover` with focal point from photos.ts. Below: name 16/500 ink + 16 px line arrow icon; one muted 14 px line (registry `cardBlurb`). Hover: photo scale 1.02 over 200 ms inside overflow-hidden wrapper, name underlines. Focus: 2 px brand ring, 2 px offset. 4 per row desktop, 2 per row mobile.
- **Answer card**: white, 1 px border, radius 12, padding 24; key number 28 px / 600; one sentence; one text link with arrow.
- **Quick answer box** (tool pages): mist background, radius 12, padding 20 to 24, left-aligned text 17 px. No left-border accent, no icon.
- **Calculator card**: white, 1 px border, radius 12, padding 24 (16 on mobile). Labels above fields (14/500 ink). Number inputs 48 px tall, 16 px text, `inputMode` per spec. Segmented controls: pill group, selected = brand background + white text. Selects: native `<select>` styled, 48 px.
- **Result card**: directly under the inputs inside the calculator card, separated by a 1 px line and 24 px space. Headline number 32/600 brand-ink (#16212B), sub-line muted. Rows as a definition list with 1 px lines. Warnings in `--warn-bg` box with `--warn-ink` text, 14 px. Buttons under it: "Show the math" (text button with chevron), "Copy result", "Share", "Print" (secondary pill buttons with Lucide icons copy, share-2, printer).
- **Sticky result bar** (mobile only): 56 px, white, top 1 px line, shows headline result + "Back to calculator". Appears after the result card scrolls out of view. Reserve nothing in layout (position fixed) and don't cover the footer links (add bottom padding to body equal to bar height only while visible).
- **Tables**: full width inside a horizontally scrollable wrapper on mobile; header row 14/500 muted; 1 px row lines; no zebra stripes; numbers right-aligned, tabular-nums; caption or heading above.
- **FAQ**: accordion with plus/minus icon, question 17/500, answers in the HTML (hidden with `hidden`/`details` only visually). Use `<details><summary>` if simplest.
- **Author box**: 56 px round photo or initials circle (mist background, brand initials), name link, one line "Founder of HomeWaterMath. Builds and checks every calculator.", "Last updated: Oct 20, 2026" (format `MMM d, yyyy`), link "Editorial policy".
- **Breadcrumbs**: 14 px muted, `/` separators, last item not a link, same text as BreadcrumbList schema.
- **Buttons**: primary = brand bg, white text, pill, 44 px min height; secondary = white, 1 px line border, ink text.
- **Icons**: Lucide only, 1.5 px stroke, 16 to 20 px: search, arrow-right, chevron-down, copy, share-2, printer, plus, minus, menu, x. No emoji anywhere.
- **Ad slots** (off at launch): reserved boxes blend in, no "Advertisement" banner bigger than 12 px muted label.
- **Logo (final, supplied in `logo/` folder; copy into `public/brand/`)**: same pattern as the owner's other sites. Icon = brand-blue rounded square (radius 12 on 48) with a white line water drop and ruler ticks. Wordmark = Figtree 600, two-tone: "HomeWater" in `--brand` #1D5A7E, "Math" in `--ink` #16212B.
  - Header: `<img src="/brand/icon.svg" width="32" height="32" alt="">` + `<span class="text-[22px] font-semibold leading-none"><span class="text-brand">HomeWater</span><span class="text-ink">Math</span></span>` (live text in Figtree, like HitchMath). `logo.svg` (text outlined to paths) is for places without the web font.
  - Files: `icon.svg`, `logo.svg`, `logo-on-dark.svg`, `logo-512.png` (Organization logo in schema; served at `/logo-512.png`), `favicon-48.png`, `favicon-96.png`, `icon-192.png`, `apple-touch-icon.png` (180), `logo-wordmark.png` (large lockup). Use `icon.svg` as the SVG favicon.
  - Header wordmark replaces the plain "HomeWaterMath" ink wordmark described above.

## 6. Motion

Hover/focus only, 150 to 200 ms ease-out. `prefers-reduced-motion: reduce` turns off the tile scale and transitions. No carousels, sliders, auto-play, parallax, animated counters or spinners on static content. Results update instantly as the user types (debounced 150 ms) with no layout shift.

## 7. Photos

All rules in `homewatermath-photos.md`. Summary: real photographs only (Unsplash/Pexels License or owner's own), `<picture>` AVIF → WebP → JPEG, explicit width/height, tiles 300/600 px, hero 640/1280 px, AVIF quality about 60, WebP about 75, EXIF stripped, focal-point crop, descriptive lowercase hyphenated file names, `<img>` not CSS backgrounds, image sitemap entries.
Budgets: above-the-fold images <= 120 KB mobile / 180 KB desktop; each tile <= 35 KB at 600 px AVIF; hero <= 120 KB AVIF; total homepage image bytes on first mobile load (no scroll) <= 150 KB. Desktop hero `fetchpriority="high"`, not lazy; everything below the fold `loading="lazy" decoding="async"`. Mobile LCP must be the H1 or intro, not a photo.
Credits: 12 px muted caption under the hero ("Photo: Name / Unsplash") and a "Photo credits" list at the bottom of the homepage, both generated from `photos.ts`.
Until a slot's photo is verified (status "approved" in the photos file), render the tile with a plain mist square and the tool name, no stock or AI image.

## 8. Page layouts

- **Homepage**: header; hero; Most popular (white, 4 tiles); Water softeners (mist band, H2 + "View all" + intro line + 4 tiles); Well water (sage band, H2 + "View all" + intro + 1 to 3 tiles); Popular answers (paper band, 3 answer cards, 1 per row on mobile); Why trust these calculators (white, 3 columns, no icons); Latest updates (rows: title left, date right, 1 px lines); Photo credits (small); footer.
- **Hub**: breadcrumbs, H1, intro text, "Which calculator do I need?" table, tiles grid, FAQ, author box.
- **Tool**: spec A5 order.
- **Trust pages**: breadcrumbs, H1, text column 68ch, "Last updated".

## 9. Never use

Gradients; purple, violet or neon; glow; glassmorphism; blurred blobs; emoji; sparkle, rocket, magic-wand or robot icons; icon-in-circle feature grids; AI-generated, 3D, drawn or stock-illustration images; mascots; "Welcome to…" or "Your ultimate guide" heroes; three identical icon cards as the hero; left-border accent cards; zebra stripes; heavy shadows; carousels; sliders; auto-play; parallax; scroll-jacking; animated counters; fake testimonials, ratings, logos or user counts; ALL CAPS paragraphs; bold everywhere; centered body text; em dashes in any text; any third-party script beyond Cloudflare analytics and (optional) GA4.

## 10. Accessibility

WCAG 2.2 AA. Contrast per section 3. Visible 2 px brand focus ring + 2 px offset on every link, chip, input, segmented control and button. Touch targets >= 44 x 44 px. Every input has a visible label. Result areas `aria-live="polite"`. Tiles are single links with descriptive text. Alt text on every photo. Reduced-motion respected. Skip-to-content link.

## 11. Design QA (part of Definition of Done)

Screenshots at 360, 390, 768 and 1280 px of the homepage, `/water-softeners/` and `/water-softener-size-calculator/`. No horizontal page scroll at any width; chips wrap to at most 2 lines; tables scroll inside their wrapper; focus rings visible when tabbing; sticky result bar works on mobile; PageSpeed mobile: home >= 95, tools >= 90, CLS 0, LCP < 2.5 s and the LCP element is the H1 or intro text. Report contrast ratios.

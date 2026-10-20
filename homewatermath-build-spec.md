# HomeWaterMath build spec (v1)

Date: 2026-10-20. Written by: browser agent. For: coding agent (Part A) and browser agent (Part B).
Site: https://homewatermath.com. Repo: https://github.com/SikanderMalik300/HomeWaterMath (push to `main`, Cloudflare Pages auto-deploys).
Author/owner (public): Sikander Mushtaq.
Read with: `homewatermath-design.md` (look and components) and `homewatermath-photos.md` (every photo).

MUST = required. SHOULD = do unless there is a clear reason not to, and say why in your report.
Ask the owner before changing any formula, constant, URL, title, H1 or page text in this file.

---

# PART A: coding agent

## A0. Non-negotiables (MUST)

1. Static pre-rendered HTML. Every heading, paragraph, table, FAQ answer and the calculator's default example result is in the initial HTML (view-source shows it). The calculator then updates on the client.
2. All maths runs in the browser. Formulas live in `lib/calc/*.ts` as pure TypeScript functions with unit tests. No maths inside React components.
3. Every number on the site comes from `lib/data/constants.ts` (or is computed from it). Each constant has a comment with source name, URL and access date (copy from section A15).
4. US units first (gallons, gpg, psi, gpm, pounds, US dollars). Hardness converter covers metric units.
5. No fake reviews, ratings, testimonials, user counts or "as seen on" logos. No AggregateRating, Review or HowTo schema.
6. No ad code, no affiliate links at launch. Build the components (A10) switched off by config.
7. Page text in this file is final. Copy it word for word. No em dashes anywhere in site text.
8. Lighthouse mobile: Performance >= 95 on the homepage, >= 90 on tool pages; Accessibility, Best Practices, SEO = 100; CLS = 0.

## A1. Stack (MUST)

- Next.js (App Router, latest stable 15.x or 16.x), TypeScript `strict`, Tailwind CSS, shadcn/ui primitives only where needed (Accordion, Tabs/Toggle Group, Select), Lucide icons, `next/font/google` (Figtree), Vitest.
- `next.config`: `output: 'export'`, `trailingSlash: true`, `images: { unoptimized: true }`.
- Hosting: Cloudflare Pages. Build command `npm run build`, output dir `out`, `NODE_VERSION=22`.
- Env vars (read at build time, all optional): `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_WEB3FORMS_KEY`, `NEXT_PUBLIC_ADSENSE_ID`, `NEXT_PUBLIC_AFFILIATES_ON` ("1" to show affiliate boxes).
- Node scripts: `npm test` (Vitest), `npm run build` (next build + sitemap/llms generation if done by script).

## A2. Architecture (MUST)

- Flat keyword URLs with trailing slash. The full list of launch URLs is in A6.
- `lib/data/pages.ts` is the page registry and single source of truth: `{ slug, type: 'tool'|'hub'|'trust'|'home', title, metaDescription, h1, category: 'softeners'|'well'|null, related: string[], lastUpdated: 'YYYY-MM-DD', published: 'YYYY-MM-DD', sources: SourceId[], photoId: string|null, ownerNote: string|null, notCovered: string[] }`. Navigation, hubs, related links, breadcrumbs, sitemap.xml, the HTML sitemap and llms.txt are all generated from it.
- `lib/data/sources.ts`: every source as `{ id, name, url, accessed }`. Pages list source ids; the Sources block renders from this.
- `lib/data/constants.ts`: all constants (A15).
- `lib/data/photos.ts`: per design file.
- `lib/calc/`: `hardness.ts`, `softenerSize.ts`, `salt.ts`, `softenerCost.ts`, `pressureTank.ts`, `round.ts` (shared helpers).
- Components: `Calculator*` client components per tool (one per tool), shared `ResultCard`, `ShowTheMath`, `CopyShareBar`, `ReferenceTable`, `Faq`, `RelatedTools`, `SourcesBlock`, `AuthorBox`, `NotCovered`, `Breadcrumbs`, `AdSlot`, `AffiliateBox`, `EmailSignup`, `PhotoTile`, `JsonLd`.
- Categories: `softeners` (hub `/water-softeners/`), `well` (hub `/well-water/`).

## A3. Technical SEO (MUST)

- `<title>` and meta description exactly as in A6 (titles <= 60 chars, metas <= 155 chars; already counted).
- Title format: page title then ` | HomeWaterMath`. The suffix is included in the strings below where it fits; do not add it twice.
- One H1 per page, matching A6. Logical H2/H3 order.
- Self-referencing canonical with trailing slash on every page: `https://homewatermath.com/<slug>/`.
- Open Graph + Twitter card tags. `og:image` 1200x630 PNG per page generated at build time (brand colour block, page H1, domain; no emoji, no gradients). Store in `public/og/<slug>.png`.
- `robots.txt`:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://homewatermath.com/sitemap.xml
  ```
  (No special rules for Googlebot, Bingbot, Mediapartners-Google, OAI-SearchBot, PerplexityBot: they are allowed by `*`. Owner has not asked to block training bots.)
- `sitemap.xml`: only canonical 200 URLs, `lastmod` = registry `lastUpdated`. Include image entries for each page's main photo.
- `llms.txt` (optional, low priority): site name, one-line description, list of tool URLs with one line each.
- Tool inputs MAY be reflected in the URL query string for sharing (`?people=4&hardness=15...`). Every page's canonical stays the clean URL. Never link a parameter URL internally. Add `<meta name="robots" content="noindex">` dynamically only if you render a different page for parameters (you shouldn't: same page, same HTML).
- Custom 404 page (`app/not-found.tsx`) that Cloudflare serves with a real 404 status (`out/404.html`).
- No `nosnippet`, no `max-snippet:0`.
- `public/_headers` (Cloudflare Pages):
  ```
  /*
    Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
    X-Content-Type-Options: nosniff
    Referrer-Policy: strict-origin-when-cross-origin
    Permissions-Policy: camera=(), microphone=(), geolocation=()
    X-Frame-Options: SAMEORIGIN
  /_next/static/*
    Cache-Control: public, max-age=31536000, immutable
  /photos/*
    Cache-Control: public, max-age=31536000, immutable
  ```
- Favicon: use the supplied files in `logo/` (copy to `public/` and `public/brand/`): `icon.svg` as SVG favicon, `favicon-48.png`, `favicon-96.png`, `icon-192.png`, `apple-touch-icon.png` (180). Do not redraw the logo.
- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`, `<table>` with `<caption>` or a heading, `<figure>/<figcaption>` for photos.
- Site name everywhere: "HomeWaterMath" (one word, capital H, W, M).

## A4. Structured data (MUST)

Render JSON-LD with a shared `JsonLd` component. Schema must match visible content.

- Site-wide (in layout): `Organization` (`@id: https://homewatermath.com/#org`, name HomeWaterMath, url, logo `https://homewatermath.com/logo-512.png`, email `hello@homewatermath.com`, founder `{ "@id": "https://homewatermath.com/authors/sikander-mushtaq/#person" }`, `sameAs: []` (add profiles later)) and `WebSite` (`@id: #website`, name, url, publisher #org).
- Tool pages: `WebApplication` (name = H1, url, applicationCategory "UtilitiesApplication", operatingSystem "Any", browserRequirements "Requires JavaScript", isAccessibleForFree true, offers `{ "@type":"Offer", "price":"0", "priceCurrency":"USD" }`, author → Person @id, publisher → #org, dateModified) + `BreadcrumbList` + `FAQPage` (questions and answers identical to the visible FAQ text).
- Hubs: `CollectionPage` + `BreadcrumbList` + `FAQPage` (hub FAQ).
- Author page: `ProfilePage` with `mainEntity` Person (`@id .../authors/sikander-mushtaq/#person`, name "Sikander Mushtaq", url, jobTitle "Founder and calculator builder", worksFor #org).
- Trust pages: `WebPage` + `BreadcrumbList`.
- Home: `WebSite` + `Organization` only.
- Never: AggregateRating, Review, HowTo, Product.
- Validate every template in the Rich Results Test / Schema.org validator before reporting done.

(Note: FAQ rich results no longer show in Google since May 2026. Keep FAQPage markup and the visible FAQ anyway.)

## A5. Tool page layout (MUST, in this order)

1. Breadcrumbs (Home / Hub / Page).
2. H1.
3. Quick answer box (text in A6), rendered server-side outside the client calculator component.
4. Calculator card: inputs, then the result card directly under them with the default example already computed in the HTML. Under the result: "Show the math" (expandable, shows the formula with the user's numbers), Copy result, Share link (copies URL with query params), Print.
5. "How to use this calculator" (numbered steps).
6. "The formula" + two worked examples.
7. "What this calculator doesn't cover" (bullets).
8. Reference table(s).
9. Owner note slot ("From Sikander"): render only if `ownerNote` is set in the registry. Empty at launch.
10. Tips.
11. FAQ (accordion; all answer text in the HTML).
12. Related calculators (3 cards).
13. Sources (name, link, accessed date) from the registry.
14. Author box (photo or initials circle, name linking to `/authors/sikander-mushtaq/`, one line, "Last updated: <date>", link to Editorial policy).
15. Disclaimer line: "Estimates only. Check your equipment's spec sheet and local plumbing code before you buy or install."

Mobile: the calculator card sits right after the quick answer. Once the user scrolls past the result card, show a slim sticky bar at the bottom with the main result (e.g. "48,000-grain softener") and a "Back to calculator" link. No ads between inputs and result, ever.

Input rules: labels above fields, `inputMode="decimal"` (or `numeric` for whole numbers), 16 px font, min 44 px targets, unit selects as segmented controls where there are <= 3 options. Results update on input (debounced 150 ms). Invalid or empty input shows the last valid result greyed with a short message, never NaN.

Number formatting: thousands separators, grains as whole numbers, pounds 1 decimal, gallons 1 decimal, dollars whole numbers with $ and commas. Use `ceilCount` for anything you buy as whole units (bags, tanks): `const ceilCount = (x: number) => Math.ceil(Math.round(x * 1e6) / 1e6)`.

## A6. Launch pages

Launch set (13 pages + 404):
1. `/` home
2. `/water-softeners/` hub
3. `/well-water/` hub
4. `/water-softener-size-calculator/`
5. `/water-softener-cost/`
6. `/water-softener-salt-calculator/`
7. `/water-hardness-converter/`
8. `/well-pressure-tank-size-calculator/`
9. `/about/`, `/how-we-calculate/`, `/editorial-policy/`, `/authors/sikander-mushtaq/`, `/contact/`, `/privacy/`, `/terms/`, `/disclaimer/`, `/affiliate-disclosure/`, `/sitemap/`

(That is 18 URLs plus 404. All in the registry and sitemap.)

---

### A6.1 `/water-softener-size-calculator/`

- Title: `Water Softener Size Calculator | HomeWaterMath`
- Meta: `Find the right water softener size in grains from your household, hardness and iron, with real capacity at your salt setting, not just the label.`
- H1: `Water Softener Size Calculator`
- Category: softeners. Related: `/water-softener-salt-calculator/`, `/water-hardness-converter/`, `/water-softener-cost/`.
- Keywords: what size water softener do i need (1,000 / KD 27), water softener size chart (590 / 13), water softener sizing (590 / 23), water softener size calculator (480 / 15), water softener sizing chart (480 / 15), how to size a water softener (390 / 26).
- Information gain: shows real capacity at the chosen salt setting (labels assume about 15 lb per cubic foot), includes iron allowance, prints a household x hardness size chart, and flags iron above 2 ppm. Brand calculators in the top 10 push their own models and skip the salt-setting effect.
- Experience element (owner): after launch, run 3 households through Culligan's or a Clack dealer's online sizing tool and compare (Part B task). Owner note slot stays empty until then.
- Photo: slot `tool-softener-size` (see photos file).

**Quick answer (exact text):**
A family of 4 with 15 gpg hard water needs about 31,500 grains between regenerations (4 people × 75 gallons × 15 gpg × 7 days). At an efficient 9 lb salt setting, a 32,000-grain softener only delivers about 25,000 grains, so the better pick is a 48,000-grain unit with 1.5 cubic feet of resin.

**Inputs (defaults in brackets):**
- People in your home: whole number 1 to 12 [4]
- Water use per person per day: segmented `60 gal` / `75 gal` / `80 gal` [75]. Helper text: "75 is the figure softener makers size with. Pick 60 for a low-flow home, 80 to match EPA's average including outdoor use."
- Water hardness: number [15] + unit select `gpg` / `mg/L (ppm)` / `°dH` / `°fH` / `mmol/L` [gpg]. Convert to gpg with `lib/calc/hardness.ts`.
- Iron (ppm, from your water test): number 0 to 10, step 0.1 [0]
- Iron allowance: segmented `4 gpg per ppm` / `5 gpg per ppm` [4]. Helper: "Makers add 4 or 5 gpg of hardness for every 1 ppm of clear-water iron."
- Days between regenerations: whole number 3 to 14 [7]
- Salt setting: select `6 lb per cu ft (most salt-efficient)` / `9 lb per cu ft (balanced)` / `12 lb per cu ft` / `15 lb per cu ft (maximum capacity)` [9]

**Formula (`lib/calc/softenerSize.ts`):**
```
compensatedGpg = hardnessGpg + ironPpm × ironAllowance            // 4 or 5
grainsPerDay   = people × galPerPerson × compensatedGpg
grainsNeeded   = grainsPerDay × daysBetweenRegen
capacityPerCuFt(setting) = {6: 20000, 9: 25000, 12: 27500, 15: 30000}
sizes = [ {label: 24000, cuFt: 0.75}, {32000, 1.0}, {48000, 1.5}, {64000, 2.0}, {80000, 2.5}, {96000, 3.0} ]
realCapacity(size) = size.cuFt × capacityPerCuFt(setting)
recommended = first size where realCapacity >= grainsNeeded
daysItLasts = realCapacity(recommended) / grainsPerDay              // 1 decimal
saltPerRegenLb = recommended.cuFt × setting                         // 1 decimal
```
Edge cases:
- `compensatedGpg < 1`: result headline "Your water is already soft (under 1 gpg). A softener won't change much." Still show the table.
- `ironPpm > 2`: warning "Most softeners are rated for up to 2 ppm of iron. Above that, treat the iron first with an iron filter, then soften."
- No size fits (grainsNeeded > 3.0 × capacityPerCuFt): headline "Larger than a standard 96,000-grain tank at this setting." Show: "A 96,000-grain unit at this setting lasts {floor(realCapacity96 / grainsPerDay)} days for your home. Shorten the days between regenerations to that number, raise the salt setting, or ask a dealer about a twin-tank system." If that floor is below 3, show only the twin-tank suggestion.
- People 0 or empty, hardness empty or negative: invalid state rule (A5).

**Outputs (result card):**
- Headline: `{label with comma}-grain softener` + sub-line `{cuFt} cu ft of resin`.
- Rows: Grains needed between regenerations `{grainsNeeded}`; Grains used per day `{grainsPerDay}`; Hardness used (with iron allowance) `{compensatedGpg} gpg`; Real capacity of this size at {setting} lb `{realCapacity}` grains; Lasts about `{daysItLasts}` days in your home; Salt per regeneration `{saltPerRegenLb}` lb.
- Under it: a compact table of all six sizes with real capacity at the chosen setting and "days it lasts" for this household; the recommended row highlighted, rows that fall short marked "Too small".

Default render (4, 75, 15 gpg, 0 iron, 4, 7 days, 9 lb) MUST show: 48,000-grain, 1.5 cu ft, 31,500 grains needed, 4,500 per day, 15 gpg, 37,500 real capacity, 8.3 days, 13.5 lb.

**How to use this calculator (exact text):**
1. Enter how many people live in the home.
2. Leave water use at 75 gallons unless you know your home uses much less or much more.
3. Enter your hardness. Use a test strip result or the "total hardness" line in your water utility's annual report, and pick the unit it's given in.
4. If a water test shows iron, enter it in ppm (the same as mg/L).
5. Keep 7 days between regenerations unless your dealer or manual says otherwise.
6. Choose the salt setting you plan to run. The result shows the smallest standard size that covers your home at that setting.

**The formula (exact text):**
Softener size comes down to how many grains of hardness your home sends through the resin before each regeneration.

Grains per day = people × gallons per person per day × hardness in gpg

Grains needed = grains per day × days between regenerations

If your water has iron, add 4 gpg to the hardness for every 1 ppm of iron first. Then pick the smallest softener whose real capacity at your salt setting is at least the grains needed.

*Example 1: family of 4, 15 gpg, no iron.* 4 × 75 × 15 = 4,500 grains a day. Over 7 days that's 31,500 grains. At 9 lb of salt per cubic foot, resin holds about 25,000 grains per cubic foot. A 32,000-grain unit (1 cu ft) gives 25,000, which falls short. A 48,000-grain unit (1.5 cu ft) gives 37,500 and lasts about 8.3 days. It uses 13.5 lb of salt each time it regenerates.

*Example 2: couple, 10 gpg, 1 ppm iron.* Hardness with iron is 10 + (1 × 4) = 14 gpg. 2 × 75 × 14 = 2,100 grains a day, or 14,700 over 7 days. The smallest standard unit, 24,000 grains with 0.75 cu ft of resin, holds 18,750 at 9 lb. That lasts about 8.9 days and uses 6.8 lb of salt per regeneration.

(Display 6.75 as 6.8 lb in prose; the calculator shows 6.8.)

**What this calculator doesn't cover (exact bullets):**
- Peak flow. A big home with 3 or more bathrooms running at once may need a larger valve or tank than the grain math says. Check the valve's rated gallons per minute.
- Iron above 2 ppm, manganese, hydrogen sulfide (rotten-egg smell) or tannins. These need their own treatment.
- Salt-free conditioners. They don't remove hardness, so they have no grain capacity to size.
- Homes that need more than one 96,000-grain tank.
- The exact rating of a specific brand. Use the result to shortlist, then check the model's spec sheet.

**Reference table 1: "Real capacity per cubic foot of resin by salt setting"**
| Salt setting (lb per cu ft) | Capacity (grains per cu ft) | Grains per lb of salt |
|---|---|---|
| 6 | 20,000 | 3,333 |
| 9 | 25,000 | 2,778 |
| 12 | 27,500 | 2,292 |
| 15 | 30,000 | 2,000 |
Caption under table: "Based on A.O. Smith's published ratings at 6, 10 and 15 lb and a 2004 Water Conditioning & Purification design guide. Label sizes (32,000 and so on) assume about 32,000 grains per cubic foot at a high salt dose."

**Reference table 2: "Water softener size chart (75 gal per person, 7 days, 9 lb salt setting)"**
| People | 5 gpg | 10 gpg | 15 gpg | 20 gpg | 25 gpg |
|---|---|---|---|---|---|
| 1 | 24,000 | 24,000 | 24,000 | 24,000 | 24,000 |
| 2 | 24,000 | 24,000 | 24,000 | 32,000 | 48,000 |
| 3 | 24,000 | 24,000 | 32,000 | 48,000 | 64,000 |
| 4 | 24,000 | 32,000 | 48,000 | 64,000 | 80,000 |
| 5 | 24,000 | 48,000 | 64,000 | 80,000 | 96,000 |
| 6 | 24,000 | 48,000 | 64,000 | 96,000 | Over 96,000 |
Generate this table from the same functions at build time (test that it equals the above).

**Reference table 3: "Standard softener sizes"**
| Label size (grains) | Resin (cu ft) | Real capacity at 6 lb | at 9 lb | at 15 lb |
|---|---|---|---|---|
| 24,000 | 0.75 | 15,000 | 18,750 | 22,500 |
| 32,000 | 1.0 | 20,000 | 25,000 | 30,000 |
| 48,000 | 1.5 | 30,000 | 37,500 | 45,000 |
| 64,000 | 2.0 | 40,000 | 50,000 | 60,000 |
| 80,000 | 2.5 | 50,000 | 62,500 | 75,000 |
| 96,000 | 3.0 | 60,000 | 75,000 | 90,000 |

**Tips (exact text):**
- City water reports usually list hardness in mg/L. Divide by 17.1 to get gpg, or use the [hardness converter](/water-hardness-converter/).
- Buy for the salt setting you'll actually run. At 6 to 9 lb per cubic foot you get 20,000 to 25,000 grains per cubic foot, well below the label.
- A metered (demand-initiated) valve regenerates only when the resin is nearly used. NSF/ANSI 44 efficiency ratings don't accept time-clock valves.
- A typical 1 cubic foot residential unit is rated for about 9 to 11 gallons per minute. If your home often runs two showers and a washer together, ask about the valve's flow rating.
- If you're on a well, get iron and manganese tested before you buy. Those numbers can change the size or the whole system.

**FAQ (exact text; 7 items):**
1. Q: What size water softener do I need for a family of 4?
   A: It depends on hardness. At 75 gallons per person and 7 days between regenerations, a family of 4 with 10 gpg water needs about 21,000 grains, which a 32,000-grain unit covers at a 9 lb salt setting. At 15 gpg the need rises to 31,500 grains, and a 48,000-grain unit is the right size.
2. Q: How do I calculate water softener size?
   A: Multiply people by gallons per person per day (75 is the usual figure) and by your hardness in gpg. That's grains per day. Multiply by the days between regenerations, often 7. Then choose the smallest softener whose real capacity at your salt setting is at least that number.
3. Q: Is a 32,000-grain water softener enough?
   A: At a 9 lb salt setting a 32,000-grain unit delivers about 25,000 grains, or roughly 3,570 grains a day over 7 days. That covers 2 people with water just under 24 gpg, 3 people just under 16 gpg and 4 people just under 12 gpg. Above that, go up a size.
4. Q: What happens if my water softener is too small?
   A: It runs out of capacity before its next regeneration, so hard water gets through. A metered valve will regenerate more often to keep up, which means more salt and water per week. A timer valve won't adjust, so you'll notice scale and spots.
5. Q: Can a water softener be too big?
   A: It costs more upfront and, on a timer valve, can regenerate before the resin is used up, which wastes salt. With a metered valve, a slightly larger tank just regenerates less often. Sizing for about a week between regenerations is a common target.
6. Q: How many grains per gallon is considered hard water?
   A: The Water Quality Association rates 7 to 10.5 gpg as hard and anything above 10.5 gpg as very hard. In mg/L, the USGS calls 121 to 180 hard and over 180 very hard. Under 1 gpg counts as soft water under NSF/ANSI 44.
7. Q: Does iron in my water change the softener size?
   A: Yes. Softener makers add 4 or 5 gpg to your hardness for every 1 ppm of clear-water iron, so 1 ppm of iron can raise the size you need. Most softeners are rated for no more than 2 ppm of iron. Above that, put an iron filter in front of the softener.

**Sources (ids → see A15):** wqa-design-2025, nelsen-sizing, csi-manual, aosmith-c43, wcp-slovak-2004, unl-g1274, usgs-hardness, pnnl-softeners, whirlpool-manual, aosmith-lowes-manual, aquatell-clack-ws1, freshwater-fleck-48k.

**Tests (minimum, `softenerSize.test.ts`):**
1. Default case → 48,000 / 1.5 / 31,500 / 4,500 / 37,500 / 8.3 days / 13.5 lb.
2. Example 2 (2, 75, 10 gpg, 1 ppm Fe, ×4) → compensated 14, 2,100/day, 14,700, 24,000, 18,750, 8.9 days, 6.75 lb.
3. Same as default at 15 lb setting → still 48,000 (32,000 gives 30,000 < 31,500), real 45,000, salt 22.5 lb.
4. 4 people, 10 gpg → 32,000 (needs 21,000; 32k gives 25,000).
5. Iron allowance 5: 2 people, 10 gpg, 1 ppm → compensated 15.
6. Hardness entered as 256.77 mg/L → 15.00 gpg → same as default.
7. 6 people, 25 gpg → "over 96,000" state; 96k at 9 lb = 75,000; grains/day 11,250; lasts floor(6.67) = 6 days message.
8. Hardness 0.5 gpg → "already soft" headline.
9. Iron 2.5 ppm → iron warning shown.
10. Size chart table generated equals Reference table 2 exactly (30 cells).
11. Empty/zero people → invalid state, no NaN in output strings.
12. FAQ number checks: 25,000/7 = 3,571.4; /150 = 23.8; /225 = 15.9; /300 = 11.9.

---

### A6.2 `/water-softener-salt-calculator/`

- Title: `Water Softener Salt Calculator: Bags a Year | HomeWaterMath`
- Meta: `Estimate how much salt your water softener uses per month and year, how many 40 lb bags to buy and the yearly cost, from your hardness and settings.`
- H1: `Water Softener Salt Calculator`
- Category: softeners. Related: `/water-softener-size-calculator/`, `/water-softener-cost/`, `/water-hardness-converter/`.
- Keywords: how much salt does a water softener use, water softener salt usage, how often add salt to water softener, water softener salt per month (cluster about 5,000/mo; KD under 30).
- Information gain: computes salt from the actual regeneration math (metered vs timer valve), shows bags per year and cost, and shows how much the salt setting changes yearly use. Top results are Reddit threads and dealer blogs with one rough number.
- Experience element (owner): none required at launch. Later: owner note comparing the result with a manufacturer's salt estimate (Part B).
- Photo: slot `tool-salt`.

**Quick answer (exact text):**
A family of 4 with 15 gpg water and a 48,000-grain softener set to 9 lb of salt per cubic foot uses about 590 lb of salt a year, close to 50 lb a month. That's 15 bags of 40 lb, or about $105 a year at $7 a bag. A timer valve set to every 7 days uses about 700 lb.

**Inputs (defaults):**
- People [4]; Water use per person `60 / 75 / 80` [75]; Hardness [15] + unit [gpg]; Iron ppm [0]; Iron allowance [4].
- Softener size: select `24,000 (0.75 cu ft)`, `32,000 (1.0)`, `48,000 (1.5)`, `64,000 (2.0)`, `80,000 (2.5)`, `96,000 (3.0)` [48,000]. Link under it: "Not sure? Use the size calculator."
- Salt setting: `6 / 9 / 12 / 15 lb per cu ft` [9]
- Valve type: segmented `Metered (regenerates when needed)` / `Timer (fixed schedule)` [Metered]
- If Timer: Regenerates every N days, whole number 1 to 14 [7]
- Bag size: `40 lb` / `50 lb` [40]
- Price per bag ($): number [7]

**Formula (`lib/calc/salt.ts`):**
```
grainsPerDay = people × galPerPerson × (hardnessGpg + ironPpm × ironAllowance)
capacity     = cuFt × capacityPerCuFt(setting)                   // same table as size calculator
regensPerYear = metered ? 365 × grainsPerDay / capacity : 365 / timerDays
saltPerRegenLb = cuFt × setting
saltPerYearLb  = regensPerYear × saltPerRegenLb
saltPerMonthLb = saltPerYearLb / 12
bagsPerYear    = ceilCount(saltPerYearLb / bagLb)
costPerYear    = bagsPerYear × pricePerBag
daysBetween    = metered ? capacity / grainsPerDay : timerDays
```
Edge: if metered and daysBetween > 14, add note "At this size your softener would go more than 2 weeks between regenerations. Many makers recommend regenerating at least every 2 weeks; check your manual's maximum days setting." If grainsPerDay × timerDays > capacity (timer), add warning "Your timer interval is longer than the softener can cover. Hard water will get through before it regenerates. Shorten the interval to {floor(capacity / grainsPerDay)} days or less."

**Outputs:**
- Headline: `{saltPerYearLb rounded to whole lb} lb of salt a year`
- Rows: About `{saltPerMonthLb}` lb a month; `{bagsPerYear}` bags of {bagLb} lb a year; About `${costPerYear}` a year; `{regensPerYear}` regenerations a year (1 decimal), every `{daysBetween}` days (1 decimal); `{saltPerRegenLb}` lb per regeneration.
- Comparison strip: the same home at 6, 9, 12 and 15 lb settings (salt per year each, metered).

Default render MUST show: 591 lb a year; 49.3 lb a month; 15 bags; $105; 43.8 regenerations, every 8.3 days; 13.5 lb per regeneration.

**How to use (exact text):**
1. Enter your household and water hardness. Add iron if a test showed any.
2. Pick your softener's size. It's on the tank label or in the manual, often as grains (for example 32,000) or cubic feet of resin.
3. Pick the salt setting from your control valve. If you don't know, leave 9 lb.
4. Choose metered if your valve counts gallons, or timer if it regenerates on set days.
5. Enter your bag size and what you pay per bag to see the yearly cost.

**The formula (exact text):**
Your softener uses salt every time it regenerates, so yearly salt is regenerations per year times salt per regeneration.

Salt per regeneration = cubic feet of resin × salt setting (lb per cubic foot)

Regenerations per year (metered valve) = 365 × grains per day ÷ softener capacity at that salt setting

A timer valve regenerates on its schedule no matter how much water you used, so it's simply 365 ÷ the days between regenerations.

*Example 1: family of 4, 15 gpg, 48,000-grain softener, 9 lb setting, metered.* The home uses 4,500 grains a day. At 9 lb the 1.5 cubic feet of resin holds 37,500 grains, so the softener regenerates about every 8.3 days, or 43.8 times a year. Each regeneration uses 1.5 × 9 = 13.5 lb of salt. That's 591 lb a year, or 15 bags of 40 lb. On a timer set to every 7 days the same softener regenerates 52 times and uses about 704 lb.

*Example 2: couple, 10 gpg, 1 ppm iron, 24,000-grain softener, 6 lb setting, metered.* Hardness with iron is 14 gpg, so the home uses 2,100 grains a day. At 6 lb, 0.75 cubic feet of resin holds 15,000 grains, about 7.1 days of water. That's 51.1 regenerations a year at 4.5 lb each, or 230 lb of salt: 6 bags.

**What this calculator doesn't cover:**
- Your valve's reserve setting. Metered valves keep some capacity in reserve, so real use can be a little higher than shown.
- Potassium chloride. It takes about 13 to 15% more by weight to do the same job as sodium chloride.
- Salt bridges or mushing in the brine tank. If the level never drops, check for a bridge before adding more salt.
- Water used for regeneration (backwash and rinse), which this page doesn't count.
- Iron above 2 ppm or other problems that shorten resin capacity.

**Reference table: "Yearly salt by household and hardness (48,000-grain softener, 9 lb setting, metered, 75 gal per person)"**
Generate at build time from `salt.ts` for people 2, 3, 4, 5 and hardness 5, 10, 15, 20, 25 gpg; cell = lb per year (whole number) and bags of 40 lb in brackets. Add a test that pins at least these cells: 4 people/15 gpg = 591 (15); 2 people/10 gpg = 197 (5). (Check: 2×75×10 = 1,500 gr/day; 365×1500/37500 = 14.6 regens × 13.5 = 197.1 lb; 4.93 bags → 5.)

**Reference table 2: "Salt per regeneration by size and setting (lb)"**
| Size | 6 lb | 9 lb | 12 lb | 15 lb |
|---|---|---|---|---|
| 24,000 (0.75 cu ft) | 4.5 | 6.8 | 9.0 | 11.3 |
| 32,000 (1.0) | 6.0 | 9.0 | 12.0 | 15.0 |
| 48,000 (1.5) | 9.0 | 13.5 | 18.0 | 22.5 |
| 64,000 (2.0) | 12.0 | 18.0 | 24.0 | 30.0 |
| 80,000 (2.5) | 15.0 | 22.5 | 30.0 | 37.5 |
| 96,000 (3.0) | 18.0 | 27.0 | 36.0 | 45.0 |
(6.75 shows as 6.8 and 11.25 as 11.3: round half up to 1 decimal.)

**Tips (exact text):**
- Lower salt settings get more softening per pound. At 6 lb per cubic foot resin softens about 3,333 grains per pound of salt; at 15 lb it's about 2,000.
- NSF/ANSI 44 counts a softener as efficient at 3,350 grains or more per pound of salt, and it must use a metered valve.
- Keep the brine tank at least a quarter full and the salt level a few inches above the water.
- Use pellets or crystals made for softeners. Rock salt leaves more insoluble residue in the tank.
- If your salt use suddenly drops to zero, look for a hard crust (a salt bridge) and break it up gently with a broom handle.

(Tips 3 to 5 are general practice; keep them exactly as written, no extra claims.)

**FAQ (exact text):**
1. Q: How much salt does a water softener use per month?
   A: Most homes use roughly 20 to 80 lb a month. A family of 4 with 15 gpg water on a 48,000-grain metered softener at 9 lb per cubic foot uses about 49 lb a month. A couple with 10 gpg water on a smaller unit at 6 lb can use under 20 lb.
2. Q: How often should I add salt to my water softener?
   A: Check the brine tank once a month and top it up when it's about a quarter full. With typical use that's one or two 40 lb bags a month for a family.
3. Q: Why is my water softener using so much salt?
   A: The usual causes are a high salt setting, a timer valve that regenerates on a fixed schedule whatever you use, a hardness setting higher than your real water, or a leak or running toilet that sends more water through. Check the setting against a fresh hardness test.
4. Q: Does a lower salt setting save money?
   A: Yes per pound, but the softener regenerates more often. Resin set to 6 lb per cubic foot softens about 3,333 grains per pound of salt, against about 2,000 at 15 lb, so yearly salt use is usually lower at the efficient setting.
5. Q: How many bags of salt does a water softener use in a year?
   A: For a family of 4 with 15 gpg water, about 15 bags of 40 lb on a metered 48,000-grain softener at 9 lb per cubic foot. On a timer set to every 7 days it's about 18 bags.
6. Q: Can I use potassium chloride instead of salt?
   A: Yes, most softeners accept it, but it takes about 13 to 15% more by weight to do the same work, and it costs several times more per bag. Raise the setting slightly when you switch.
7. Q: How much does softener salt cost per year?
   A: At $5 to $10 for a 40 lb bag, most homes spend about $50 to $150 a year on salt. Potassium chloride costs much more.

**Sources:** aosmith-c43, wcp-slovak-2004, pnnl-softeners, wqa-getting-smart-2024, alberta-agdex, ndsu-wq1031, thisoldhouse-cost, homeguide-cost, ace-salt, lowes-salt-40lb.

**Tests (min 10):** default case values above; timer 7 days → 52.14 regens, 703.9 lb, 18 bags, $126; example 2 → 2,100/day, 15,000 capacity, 51.1 regens, 230.0 lb, 6 bags; 50 lb bags default home → 591.3/50 = 11.83 → 12 bags; KCl not in calc (no test); timer interval too long warning (4 people 15 gpg 48k timer 9 days → 40,500 > 37,500 → warn, suggest 8); metered > 14 days note (1 person 5 gpg 24k → 50 days → note); table cells pinned; 6/9/12/15 comparison for default home (6 lb: capacity 30,000, regens 54.75, salt/regen 9, 492.75 lb; 12 lb: 41,250 cap, 39.82 regens, 18 lb → 716.7 lb; 15 lb: 45,000, 36.5, 22.5 → 821.25 lb); empty input → no NaN.

---

### A6.3 `/water-hardness-converter/`

- Title: `Water Hardness Converter: gpg, ppm, mg/L | HomeWaterMath`
- Meta: `Convert water hardness between grains per gallon, ppm (mg/L as CaCO3), mmol/L, German and French degrees, and see where your water falls on the scale.`
- H1: `Water Hardness Converter`
- Category: softeners. Related: `/water-softener-size-calculator/`, `/water-softener-salt-calculator/`, `/water-softener-cost/`.
- Keywords: ppm to gpg, gpg to ppm, water hardness ppm, water hardness scale ppm, water hardness gpg, grains per gallon (combined about 2,000/mo, KD 18 to 29).
- Information gain: one input, five units at once, both the USGS and WQA scales side by side, plus the sodium a softener would add at that hardness.
- Photo: slot `tool-hardness`.

**Quick answer (exact text):**
1 grain per gallon (gpg) equals 17.1 mg/L, also written as 17.1 ppm, of hardness as calcium carbonate. To convert ppm to gpg, divide by 17.1. So 171 ppm is 10 gpg, and 15 gpg is about 257 ppm. Water above 7 gpg (120 ppm) counts as hard.

**Input:** one number [15] + unit segmented/select `gpg` / `mg/L (ppm)` / `mmol/L` / `°dH` / `°fH` [gpg].
**Outputs:** all five units (gpg 2 decimals, mg/L 1 decimal, mmol/L 3 decimals, °dH 2 decimals, °fH 1 decimal); WQA class; USGS class; "If you soften this water, it adds about {gpg × 7.864, whole number} mg of sodium per liter."
Default MUST show: 15.00 gpg = 256.8 mg/L = 2.565 mmol/L = 14.39 °dH = 25.7 °fH; WQA "Very hard"; USGS "Very hard"; sodium 118 mg/L.

**Formula (`lib/calc/hardness.ts`):** convert input to mg/L as CaCO3, then out:
```
MG_PER_GPG = 17.1181   // 64.79891 mg per grain / 3.785411784 L per gallon
MG_PER_MMOL = 100.087
MG_PER_DH  = 17.848
MG_PER_FH  = 10
WQA (mg/L): < 17.1 Soft; <= 60 Slightly hard; <= 120 Moderately hard; <= 180 Hard; > 180 Very hard
USGS (mg/L): <= 60 Soft; <= 120 Moderately hard; <= 180 Hard; > 180 Very hard
sodiumAddedMgPerL = gpg × 7.864
```

**How to use (exact text):**
1. Type the hardness number from your test strip, lab report or water utility report.
2. Pick the unit it's given in. Utility reports in the US usually use mg/L or ppm. Softener manuals use gpg.
3. Read the other units and where your water sits on both hardness scales.

**The formula (exact text):**
Every unit here measures the same thing, the calcium and magnesium in your water expressed as calcium carbonate. A grain is 64.8 mg and a gallon is 3.785 liters, so 1 gpg = 17.1 mg/L.

gpg = mg/L ÷ 17.1

mg/L = gpg × 17.1

mmol/L = mg/L ÷ 100.1

German degrees (°dH) = mg/L ÷ 17.85

French degrees (°fH) = mg/L ÷ 10

*Example 1:* 15 gpg × 17.1181 = 256.8 mg/L. That's 2.57 mmol/L, 14.4 °dH or 25.7 °fH. It's very hard on both scales.

*Example 2:* a city report shows 120 mg/L. 120 ÷ 17.1181 = 7.0 gpg, which sits at the top of "moderately hard" on both the USGS and WQA scales.

**What this converter doesn't cover:**
- Test strips that report in their own color steps. Use the number printed next to the matching color.
- "Hardness as calcium" (not as calcium carbonate). Multiply calcium mg/L by 2.5 first.
- TDS (total dissolved solids) readings. TDS meters don't measure hardness.
- Temporary versus permanent hardness.

**Reference table: "Water hardness scale"**
| Class (WQA) | gpg | mg/L (ppm) | USGS class |
|---|---|---|---|
| Soft | under 1.0 | under 17.1 | Soft |
| Slightly hard | 1.0 to 3.5 | 17.1 to 60 | Soft |
| Moderately hard | 3.5 to 7.0 | 60 to 120 | Moderately hard |
| Hard | 7.0 to 10.5 | 120 to 180 | Hard |
| Very hard | over 10.5 | over 180 | Very hard |

**Reference table 2: "Quick conversions"** rows for 1, 3, 5, 7, 10, 12, 15, 20, 25, 30 gpg → mg/L (1 decimal), mmol/L (2 decimals), °dH (1 decimal). Generate from code; pin 10 gpg = 171.2 mg/L, 1.71 mmol/L, 9.6 °dH.

**Tips (exact text):**
- US water utilities publish hardness in their yearly Consumer Confidence Report. Search your utility's name plus "water quality report".
- Softener controls ask for gpg. If your report says 200 mg/L, enter 11.7 gpg.
- Well water can change with the seasons. Test again after a wet spring or a drought.
- If you add iron to the hardness setting on your softener, add 4 to 5 gpg for every 1 ppm of iron.

**FAQ (exact text):**
1. Q: How do I convert ppm to gpg?
   A: Divide ppm by 17.1. For example, 200 ppm ÷ 17.1 = 11.7 gpg. This works when the ppm figure is hardness as calcium carbonate, which is how US water reports list it.
2. Q: Is ppm the same as mg/L for water hardness?
   A: For water, yes. One liter of water weighs about one kilogram, so 1 mg per liter is 1 part per million.
3. Q: What is a good water hardness level?
   A: Under 1 gpg (17.1 mg/L) is soft. Between 1 and 7 gpg most homes see few problems. Above 7 gpg (120 mg/L) is hard, and above 10.5 gpg (180 mg/L) is very hard, where scale builds up quickly.
4. Q: What is 300 ppm hardness in gpg?
   A: 300 ÷ 17.1 = 17.5 gpg. That's very hard water on both the USGS and Water Quality Association scales.
5. Q: How do I convert German degrees of hardness to gpg?
   A: Multiply °dH by 1.043. So 10 °dH is about 10.4 gpg. One German degree equals 17.85 mg/L as calcium carbonate.
6. Q: How much sodium does softened water contain?
   A: A salt-based softener adds about 7.9 mg of sodium per liter for every gpg of hardness it removes. Softening 15 gpg water adds about 118 mg per liter.

**Sources:** nist-hb44, wqa-ion-exchange, usgs-hardness, unl-g1274, psu-softening, sigma-hardness, unl-g1274 (sodium), psu-softening (sodium).

**Tests (min 10):** 15 gpg → outputs above; 120 mg/L → 7.01 gpg, Moderately hard both; 17.0 mg/L → WQA Soft; 17.1 mg/L → WQA Slightly hard; 60 → WQA Slightly hard, USGS Soft; 60.5 → Moderately hard (both); 180 → Hard; 180.1 → Very hard; 10 °dH → 178.48 mg/L → 10.43 gpg; 2 mmol/L → 200.17 mg/L → 11.69 gpg; 25 °fH → 250 mg/L → 14.60 gpg; FAQ: 200/17.1181 = 11.68 (text says 11.7); 300 → 17.53; sodium 15 gpg → 117.96 → 118; 0 input → all zeros, "Soft"; negative → invalid state.

---

### A6.4 `/water-softener-cost/`

- Title: `Water Softener Cost Calculator, Installed | HomeWaterMath`
- Meta: `Estimate water softener cost for your home: unit price, installation, salt and service, with a 10-year total. Compare DIY, plumber and dealer installs.`
- H1: `Water Softener Cost Calculator`
- Category: softeners. Related: `/water-softener-size-calculator/`, `/water-softener-salt-calculator/`, `/water-hardness-converter/`.
- Keywords: water softener cost (74,000 / KD 26), how much is a water softener (60,500 / 28), how much does a water softener cost (6,600 / 26), water softener price (4,400 / 27), whole house water softener cost (1,900 / 28), cost of water softener (1,600 / 15).
- Information gain: the top 10 (Reddit, retailers, local dealers) give one vague range. This page splits cost by who installs it, adds the yearly salt and service your home will actually need, gives a 10-year total, and checks a quote against typical ranges.
- Experience element (owner): later, owner collects 2 to 3 real online prices (Home Depot, Lowe's, a dealer quote form) for the recommended size and adds a dated note.
- Photo: slot `tool-cost`.

**Quick answer (exact text):**
A water softener costs about $1,200 to $3,800 for a standard salt-based system installed by a dealer. Buying a single-tank unit yourself costs about $500 to $1,700, plus $150 to $1,000 if a plumber installs it. Salt adds roughly $50 to $150 a year. The calculator below adds it up for your home over 10 years.

**Inputs (defaults):**
- System type: `Salt-based, single tank` / `Salt-based, dual tank` / `Salt-free conditioner` [single]
- Who installs it: `I'll install it (DIY)` / `Plumber installs a unit I buy` / `Dealer supplies and installs` [Plumber]
- People [4]; Hardness [15] + unit [gpg] (hidden for salt-free, since no salt is used)
- Salt price per 40 lb bag [$7] (salt-based only)
- Yearly service: `I'll do it myself` / `Pro service each year` [myself]
- Optional: "Quote you received ($)" [empty]

**Data (`constants.ts`, all with sources):**
```
unitOnly = { single: [500, 1700], dual: [1000, 5000], saltFree: [800, 4000] }   // This Old House 2026
diyKit = 175          // Pentair install kit, Home Depot
labor = [150, 1000], laborTypical = 600   // This Old House / Fixr; TOH "most $500-$700"
dealerInstalled = { single: [1200, 3800], dual: [1700, 5000], saltFree: [1500, 4500] }  // HomeGuide
proService = [100, 300], proServiceTypical = 200   // HomeGuide / Bob Vila / TOH
lifespanYears = 10 to 15   // Culligan
```
**Formula (`lib/calc/softenerCost.ts`):**
```
DIY:     low = unitLow + diyKit;  high = unitHigh + diyKit;  typical = (unitLow + unitHigh)/2 + diyKit
Plumber: low = unitLow + 150;     high = unitHigh + 1000;    typical = (unitLow + unitHigh)/2 + 600
Dealer:  low/high = dealerInstalled[type]; typical = midpoint
size (salt-based) = softenerSize(people, 75, hardness, 0, 4, 7 days, 9 lb)   // reuse
salt (salt-based) = salt(... size.cuFt, 9 lb, metered).costPerYear            // reuse, price input
yearly = salt + (pro ? 200 : 0)       // show pro range 100-300 in text
tenYear = typical + 10 × yearly
quoteCheck: quote < low → "below the usual range (ask what's included)"; low..high → "within the usual range"; > high → "above the usual range"
```
Note for salt-free: "Salt-free conditioners use no salt. Cartridge or media replacement isn't included here; check the maker's schedule."

**Outputs:** Upfront typical (headline, `$1,700`) with range `$650 to $2,700`; Recommended size (salt-based) `48,000 grains`; Salt about `$105` a year (`15` bags); Service `$0` or `$200` a year (range $100 to $300); 10-year total `$2,750`; quote check line if a quote is entered. Also a small 3-row comparison of DIY / Plumber / Dealer typical upfront and 10-year totals for the chosen type and household.

Default render MUST show: $1,700 typical; $650 to $2,700; 48,000 grains; $105 salt (15 bags); $0 service; $2,750 over 10 years. Comparison rows (single tank, default home, no pro service): DIY $1,275 / $2,325; Plumber $1,700 / $2,750; Dealer $2,500 / $3,550.

**How to use (exact text):**
1. Choose the type of system you're pricing. Most homes buy a single-tank salt-based softener.
2. Choose who will install it.
3. Enter your household and hardness so the calculator can size the softener and work out your salt.
4. Enter what you pay for a 40 lb bag of salt.
5. If you have a quote, enter it to see how it compares with typical prices.

**The formula (exact text):**
Upfront cost is the unit plus installation. Running cost is salt plus any service you pay for. The 10-year total adds both, because a softener usually lasts 10 to 15 years.

10-year cost = upfront + 10 × (yearly salt + yearly service)

The typical upfront figure is the middle of the unit price range plus $600 of plumber labor, the middle of the range most installs fall in.

*Example 1: single-tank, plumber-installed, family of 4, 15 gpg.* The unit is $500 to $1,700 and labor is $150 to $1,000, so upfront is $650 to $2,700, typically about $1,700. The home needs a 48,000-grain softener that uses about 15 bags of salt a year, $105 at $7 a bag. With no paid service, 10 years costs $1,700 + 10 × $105 = $2,750.

*Example 2: dual-tank from a dealer, family of 5, 20 gpg, yearly pro service.* Dealer-installed dual-tank systems run $1,700 to $5,000, typically $3,350. The home needs about 52,500 grains between regenerations, so an 80,000-grain size. Salt is about 25 bags a year ($175) and service about $200, so $375 a year. Over 10 years: $3,350 + 10 × $375 = $7,100.

**What this calculator doesn't cover:**
- Plumbing changes when your home has no softener loop, long pipe runs or needs a new drain or outlet. These push labor toward the top of the range.
- Permits, where your city requires one.
- Water used during regeneration.
- Iron filters, whole-house filters or reverse osmosis bought with the softener.
- Dealer financing, rental plans or service contracts.
- Prices outside the US.

**Reference table 1: "Water softener cost by type (US, 2026)"**
| System | Unit only | Installed by a dealer |
|---|---|---|
| Salt-based, single tank | $500 to $1,700 | $1,200 to $3,800 |
| Salt-based, dual tank | $1,000 to $5,000 | $1,700 to $5,000 |
| Salt-free conditioner | $800 to $4,000 | $1,500 to $4,500 |
Caption: "Unit prices: This Old House (updated June 2026). Installed prices: HomeGuide (2025). Plumber labor for installing a unit you buy: $150 to $1,000, most often $500 to $700."

**Reference table 2: "Running costs"**
| Item | Typical cost |
|---|---|
| Softener salt, 40 lb bag | $5 to $10 |
| Salt per year (most homes) | $50 to $150 |
| Pro service visit, per year | $100 to $300 |
| DIY install kit (bypass and fittings) | about $175 |
| Lifespan | 10 to 15 years, sometimes 20 |

**Tips (exact text):**
- Size first, then price. A unit that's too small regenerates more often and burns salt; one that's too big costs more upfront.
- Ask every installer what's included: loop work, drain line, bypass valve, removal of an old unit and the first bags of salt.
- Dealer quotes bundle the unit, installation and often a service plan, so they look high next to a big-box price tag. Compare the 10-year totals, not the stickers.
- A metered valve uses less salt than a timer valve. That saving adds up over 10 years.
- If your water has more than 2 ppm of iron, price an iron filter too. Most softeners aren't rated above that.

**FAQ (exact text):**
1. Q: How much does a water softener cost?
   A: A typical salt-based softener costs $1,200 to $3,800 installed by a dealer. The unit alone is about $500 to $1,700 for a single tank, and a plumber charges about $150 to $1,000 to install one you buy yourself.
2. Q: How much does it cost to install a water softener?
   A: Labor usually runs $150 to $1,000, and most installs land between $500 and $700. Homes without a softener loop or a nearby drain cost more.
3. Q: Is a water softener worth the cost?
   A: In hard water it usually is. Above about 7 gpg, scale builds up in water heaters and fixtures and soap works poorly. Over 10 years, a plumber-installed single-tank softener for a family of 4 costs about $2,750 including salt.
4. Q: How much does it cost to run a water softener per year?
   A: Mostly salt: about $50 to $150 a year for most homes, plus $100 to $300 if you pay for a yearly service visit.
5. Q: Are salt-free water softeners cheaper?
   A: Not upfront. Installed salt-free conditioners run about $1,500 to $4,500, but they need no salt. They also don't remove hardness minerals, so they aren't a direct swap for a softener.
6. Q: How long does a water softener last?
   A: Usually 10 to 15 years, and some last 20. The resin bed wears faster if your water has chlorine or iron.
7. Q: Why are dealer water softener quotes so high?
   A: Dealer prices include the unit, installation, setup and often a service plan, and many use premium valves and tanks. Ask for an itemized quote and compare the 10-year total with a store-bought unit plus a plumber.

**Sources:** thisoldhouse-cost, homeguide-cost, fixr-cost, angi-chicago, hd-pentair-kit, freshwater-clack-bypass, culligan-lifespan, homeserve-cost, wcp-michaud-2011, bobvila-salt.

**Tests (min 10):** default (single, plumber, 4, 15) → $1,700 / $650–$2,700 / 48k / 15 bags / $105 / $2,750; DIY single → $1,275 ($675–$1,875), 10-yr $2,325; Dealer single → $2,500 ($1,200–$3,800), $3,550; example 2 (dual, dealer, 5 people, 20 gpg, pro) → $3,350, 80k, 25 bags $175, yearly $375, 10-yr $7,100; salt-free plumber → typical $3,000 ($950–$5,000), salt $0; quote $4,200 single dealer → "above"; quote $1,000 single dealer → "below"; quote $2,000 → "within"; salt price $10 default home → $150/yr; empty people → no NaN.

---

### A6.5 `/well-pressure-tank-size-calculator/`

- Title: `Well Pressure Tank Size Calculator | HomeWaterMath`
- Meta: `Size a well pressure tank from your pump's gallons per minute, horsepower and pressure switch setting. Shows drawdown, tank size and pump cycles.`
- H1: `Well Pressure Tank Size Calculator`
- Category: well. Related: `/water-hardness-converter/`, `/water-softener-size-calculator/`, `/water-softener-cost/`.
- Keywords: well pressure tank size (720 / KD 19), sizing pressure tank for well (590 / 14), well pressure tank size calculator, pressure tank drawdown, well pressure tank psi (590 / 13).
- Information gain: computes drawdown from the gas law for the actual switch setting (20/40, 30/50, 40/60) with pre-charge 2 psi below cut-in, applies the 1 or 2 minute minimum run time by horsepower, and shows the matching manufacturer drawdown figures. Top results are single-brand calculators.
- Photo: slot `tool-pressure-tank`.

**Quick answer (exact text):**
Size a well pressure tank so the pump runs at least 1 minute each cycle (2 minutes for pumps over 3/4 hp). A 10 gpm, 1 hp pump needs 20 gallons of drawdown. On a 40/60 switch a tank gives about 26% of its volume as drawdown, so you need about 78 gallons: an 86-gallon tank.

**Inputs (defaults):**
- Pump flow rate (gallons per minute): number 1 to 40 [10]
- Pump horsepower: `1/2`, `3/4`, `1`, `1 1/2`, `2` [1]. Over 3/4 hp → minimum run time 2 minutes; otherwise 1 minute.
- Override run time (optional): `Use the rule` / `1 minute` / `2 minutes` [Use the rule]
- Pressure switch: `20/40` / `30/50` / `40/60` [40/60]

**Formula (`lib/calc/pressureTank.ts`):**
```
ATM = 14.7                        // psi, sea level
preCharge = cutIn - 2
factor = (preCharge + ATM)/(cutIn + ATM) - (preCharge + ATM)/(cutOut + ATM)
runMinutes = override ?? (hp > 0.75 ? 2 : 1)
drawdownNeeded = gpm × runMinutes
tankNeeded = drawdownNeeded / factor
standardTanks = [20, 26, 32, 44, 62, 86, 119]      // gallons, total volume
recommended = first tank >= tankNeeded (if none: "More than one 119-gallon tank": ceilCount(tankNeeded / 119) tanks of 119)
drawdownOfRecommended = recommended × factor
```
Factors (test): 20/40 → 0.3446; 30/50 → 0.2953; 40/60 → 0.2579.

**Outputs:** Headline `{recommended}-gallon tank`; rows: Drawdown needed `{drawdownNeeded}` gal; Usable drawdown at {switch} `{factor as %}` of tank volume (1 decimal %); Minimum tank volume `{tankNeeded}` gal (1 decimal); This tank's drawdown about `{drawdownOfRecommended}` gal (1 decimal); Pre-charge (air) pressure `{preCharge}` psi with the tank empty of water.
Default MUST show: 86-gallon; 20 gal; 25.8%; 77.5 gal; 22.2 gal; 38 psi.

**How to use (exact text):**
1. Enter your pump's flow rate in gallons per minute. It's on the pump paperwork or the well driller's report.
2. Pick the pump horsepower. Pumps over 3/4 hp should run at least 2 minutes per cycle.
3. Pick your pressure switch setting. It's printed inside the switch cover, for example 40/60.
4. Read the tank size and set the tank's air pre-charge to the number shown, with the water drained.

**The formula (exact text):**
A pressure tank stores water above an air cushion. Drawdown is the water you can use between the pump shutting off and turning back on. The pump should run long enough each time to cool its motor, which means the tank's drawdown must be at least the pump's flow times the minimum run time.

Drawdown needed = pump gpm × minimum run time (1 minute up to 3/4 hp, 2 minutes above)

The share of the tank you can use depends on the switch setting. With the pre-charge 2 psi below the cut-in pressure, it's about 34% at 20/40, 30% at 30/50 and 26% at 40/60.

Tank size = drawdown needed ÷ that share

*Example 1: 10 gpm, 1 hp, 40/60 switch.* The pump needs 2 minutes, so 10 × 2 = 20 gallons of drawdown. 20 ÷ 0.258 = 77.5 gallons. The next standard size is 86 gallons, which gives about 22.2 gallons of drawdown. Set the pre-charge to 38 psi.

*Example 2: 7 gpm, 1/2 hp, 30/50 switch.* The pump needs 1 minute, so 7 gallons of drawdown. 7 ÷ 0.295 = 23.7 gallons, so a 26-gallon tank, giving about 7.7 gallons of drawdown. Pre-charge: 28 psi.

**What this calculator doesn't cover:**
- Constant-pressure (variable speed) pumps. They need much smaller tanks; follow the pump maker's chart.
- Homes at high altitude. Air pressure is lower, which changes drawdown slightly.
- Tanks piped together. Add their drawdowns.
- Irrigation or livestock demand that runs the pump for long periods.
- Brand-specific ratings. Manufacturers publish their own drawdown tables, which can differ by a few percent.

**Reference table 1: "Drawdown by tank size and switch setting (gallons)"**
| Tank (gal) | 20/40 | 30/50 | 40/60 |
|---|---|---|---|
| 20 | 6.9 | 5.9 | 5.2 |
| 26 | 9.0 | 7.7 | 6.7 |
| 32 | 11.0 | 9.4 | 8.3 |
| 44 | 15.2 | 13.0 | 11.3 |
| 62 | 21.4 | 18.3 | 16.0 |
| 86 | 29.6 | 25.4 | 22.2 |
| 119 | 41.0 | 35.1 | 30.7 |
Caption: "Calculated with Boyle's law, pre-charge 2 psi below cut-in, at sea level. Goulds publishes 5.3 gallons for its 19.9-gallon tank at 40/60 and 22.8 for its 84.9-gallon tank."
(Generate from code; pin all cells in a test.)

**Reference table 2: "Minimum tank size for common pumps (1 minute up to 3/4 hp, 2 minutes above)"**
Rows: 5 gpm 1/2 hp; 7 gpm 1/2 hp; 10 gpm 3/4 hp; 10 gpm 1 hp; 12 gpm 1 hp; 15 gpm 1.5 hp; 20 gpm 2 hp. Columns: 30/50 and 40/60 → recommended standard tank (or "2 × 119" etc.). Generate from code and pin in tests.

**Tips (exact text):**
- Check the pre-charge with the pump off and the tank drained, using a tire gauge on the air valve.
- A waterlogged tank makes the pump click on and off every few seconds. That short-cycling wears out the pump and the switch.
- Bigger is fine. A larger tank only lengthens each cycle and the time between starts.
- If you raise the switch from 30/50 to 40/60, raise the pre-charge too, to 38 psi.

**FAQ (exact text):**
1. Q: What size pressure tank do I need for my well?
   A: Multiply your pump's gpm by its minimum run time (1 minute up to 3/4 hp, 2 minutes above) to get the drawdown you need. Then divide by the usable share at your switch setting: about 0.30 at 30/50 or 0.26 at 40/60. A 10 gpm, 1 hp pump on 40/60 needs an 86-gallon tank.
2. Q: What is pressure tank drawdown?
   A: It's the amount of water the tank delivers between the pump shutting off at cut-out pressure and turning back on at cut-in. It's always much smaller than the tank's total size: about 26% of the volume at a 40/60 setting.
3. Q: What should the air pressure be in my well pressure tank?
   A: Set it 2 psi below the pump's cut-in pressure with the tank drained of water. That's 28 psi for a 30/50 switch and 38 psi for 40/60.
4. Q: Is a bigger pressure tank better?
   A: Usually. A bigger tank means longer, fewer pump cycles, which is easier on the motor. It costs more and takes more space, but it doesn't lower your water pressure.
5. Q: What happens if my pressure tank is too small?
   A: The pump starts and stops too often, called short-cycling. Each start heats the motor and wears the switch, so pumps on undersized tanks fail sooner.
6. Q: How long should a well pump run each cycle?
   A: At least 1 minute for pumps up to 3/4 hp and at least 2 minutes for larger pumps. Goulds calls 1 minute adequate and 2 minutes recommended.

**Sources:** amtrol-mc10188, goulds-crsgtank, goulds-brhptank, driller-pelikan-2006, fws-tank-blog, amtrol-older-chart.

**Tests (min 10):** factors 0.3446 / 0.2953 / 0.2579; default → 86, 20, 77.5, 22.2, 38 psi; example 2 → 26, 7, 23.7, 7.7, 28 psi; 12 gpm 1 hp 40/60 → 24 → 93.0 → 119 (30.7); 20 gpm 2 hp 40/60 → 40 → 155.1 → 2 × 119 message; 3/4 hp boundary → 1 minute; override 2 min with 1/2 hp; drawdown table cells pinned (21 cells); 0 gpm → invalid state.

---

### A6.6 Home `/`

- Title: `HomeWaterMath: Water Softener and Well Water Calculators`
- Meta: `Free calculators for home water: softener size, softener cost, salt use, hardness conversions and well pressure tanks. Every formula and source shown.`
- H1: `Water softener and well water calculators`
- Layout: design file section "Homepage". Sections and exact text:

**Hero intro (exact):** Size a water softener, price it, work out your salt and convert hardness units, all with the math shown. Every number comes from manufacturer spec sheets, extension services and industry standards, and each page lists its sources.
Search placeholder: `Try "softener size", "salt" or "pressure tank"`
Chips (links): Softener size → `/water-softener-size-calculator/`; Softener cost → `/water-softener-cost/`; Salt use → `/water-softener-salt-calculator/`; Hardness converter → `/water-hardness-converter/`.

**Section "Most popular"** (white): tiles for the 4 softener tools in this order: size, cost, salt, hardness. Tile text = registry `cardBlurb`:
- Size: "Grains you need from your household and hardness, at your real salt setting."
- Cost: "Unit, install, salt and service, with a 10-year total and a quote check."
- Salt: "Pounds per month, bags per year and yearly cost for your softener."
- Hardness: "gpg, ppm, mg/L, mmol/L and German or French degrees in one step."

**Section "Water softeners"** (band 1): intro "Hard water above 7 gpg leaves scale in heaters and fixtures. Start with your hardness, then size, price and run your softener." + tiles (same 4) + "View all" → `/water-softeners/`. (Same photos as the popular tiles: reuse, don't duplicate files.)

**Section "Well water"** (band 2): intro "Private well? Size the pressure tank so your pump runs long enough each cycle." + tile: Pressure tank → `/well-pressure-tank-size-calculator/` blurb "Tank size and pre-charge from your pump's gpm, horsepower and switch setting." + "View all" → `/well-water/`.

**Section "Popular answers"** (paper band), 3 answer cards:
1. **48,000 grains**: "A family of 4 with 15 gpg water needs a 48,000-grain softener at a 9 lb salt setting." Link: "Size yours" → size calculator.
2. **17.1**: "1 grain per gallon equals 17.1 ppm (mg/L) of hardness." Link: "Convert yours" → converter.
3. **About 590 lb**: "Salt a family of 4 with 15 gpg water uses in a year on a metered softener." Link: "Work out yours" → salt calculator.

**Section "Why trust these calculators"** (white), 3 columns:
- H3 "Sources on every page": "Each calculator lists the spec sheets, standards and extension guides its numbers come from, with the date we checked them."
- H3 "The math is shown": "Open "Show the math" under any result to see the formula with your own numbers."
- H3 "Tested before publishing": "Every formula has automated tests built from the worked examples, tables and FAQ numbers on its page."
Links under: "How we calculate" → `/how-we-calculate/`, "About" → `/about/`.

**Section "Latest updates"**: rows from the registry, sorted by `lastUpdated` desc, max 6: title left, date right.

**Photo credits**: per design file.

### A6.7 Hub `/water-softeners/`

- Title: `Water Softener Calculators: Size, Cost, Salt | HomeWaterMath`
- Meta: `Water softener calculators for US homes: what size you need, what it costs installed, how much salt it uses and how to convert hardness units.`
- H1: `Water softener calculators`
- Intro (exact, 150 to 250 words):
  A water softener swaps the calcium and magnesium in hard water for sodium or potassium as water passes through a tank of resin beads. When the beads are full, the softener rinses them with brine from the salt tank. That cycle is called regeneration, and it's what every number on these pages is built around.

  Start with your hardness. Your water utility's yearly water quality report lists it, usually in mg/L. On a well, use a test strip or a lab test. Then size the softener from your household and hardness, check what it should cost to buy and install, and work out the salt it will use each year.

  Three numbers decide most of it: hardness in grains per gallon, the number of people in the home, and the salt setting on the control valve. A lower salt setting softens more water per pound of salt but needs a slightly larger tank. The calculators below let you see that trade-off for your own home.
- Table "Which calculator do I need?":
  | If you want to know | Use |
  |---|---|
  | What size softener to buy | Water softener size calculator |
  | What it will cost, installed and over 10 years | Water softener cost calculator |
  | How much salt it will use | Water softener salt calculator |
  | How to turn ppm or mg/L into gpg | Water hardness converter |
- Tile grid of the 4 tools.
- Hub FAQ (exact; also FAQPage schema):
  1. Q: Do I need a water softener? A: If your water is above about 7 gpg (120 mg/L), a softener usually pays off in less scale, longer water heater life and less soap. Below 3.5 gpg most homes don't need one.
  2. Q: How do I find my water hardness? A: City water customers can find it in the utility's yearly Consumer Confidence Report. Well owners can use hardness test strips or send a sample to a certified lab.
  3. Q: What's the difference between a water softener and a water filter? A: A softener removes hardness minerals by ion exchange. A filter removes particles, chlorine, chemicals or other contaminants depending on its media. Many homes with hard, chlorinated water use both.

### A6.8 Hub `/well-water/`

- Title: `Well Water Calculators | HomeWaterMath`
- Meta: `Calculators for private well owners, starting with pressure tank sizing from your pump's flow rate, horsepower and pressure switch setting.`
- H1: `Well water calculators`
- Intro (exact):
  Millions of American homes get their water from a private well, and the owners are responsible for its pump, tank and treatment. The calculators here cover the parts that are easy to get wrong.

  The pressure tank is the first. A tank that's too small makes the pump start and stop every few seconds, which wears it out. Size the tank from your pump's flow rate and horsepower, set the air pre-charge correctly, and the pump runs long enough each cycle to stay cool. Well water also tends to be harder and more likely to carry iron than city water, so the water softener calculators apply here too.
- Table "Which calculator do I need?": pressure tank size → Well pressure tank size calculator; hardness on a well → Water hardness converter; softener for well water → Water softener size calculator.
- Tiles: pressure tank, size calculator, hardness converter.
- Hub FAQ:
  1. Q: How often should I test my well water? A: The EPA and most state health departments advise testing at least once a year for bacteria, nitrates and anything common in your area, and after floods or repairs.
  2. Q: What size pressure tank do most homes have? A: Many homes use tanks between 20 and 86 gallons. The right size depends on the pump's flow rate and horsepower, not the size of the house.
  3. Q: Does well water need a softener? A: Only if it's hard. Test hardness and iron first. If it's above about 7 gpg, or has iron, a softener or iron filter is worth pricing.

### A6.9 Trust and legal pages (A7)

All use the simple article layout (breadcrumbs, H1, text, "Last updated"). Exact text below. Anything marked OWNER CONFIRM must be confirmed by the owner before launch; the browser agent will ask.

**`/about/`**
- Title: `About HomeWaterMath`; Meta: `Who runs HomeWaterMath, why it exists and how the calculators are built, checked and paid for.`
- H1: `About HomeWaterMath`
- Text:
  HomeWaterMath is an independent site of calculators for home water treatment: water softeners, hardness, salt, and private well systems. It's run by Sikander Mushtaq.

  Most answers online about softener sizes or costs are a single rough number, or a calculator from a company that sells the product. We wanted tools that show their math, use published figures, and tell you where each number comes from.

  How we work: every calculator starts from manufacturer spec sheets, extension-service guides from US universities, and industry standards such as NSF/ANSI 44. Each formula is tested with the worked examples printed on its page before it goes live. When a source changes or we find a mistake, we fix it and log it on our [editorial policy](/editorial-policy/) page.

  What we don't do: we don't sell water treatment equipment, we don't accept payment to change a result, and we don't publish reviews of products we haven't used.

  How the site is paid for: the site may show ads and may link to retailers or manufacturers through affiliate programs. If we earn a commission from a link, the page says so. It never changes what a calculator recommends.

  Contact: [hello@homewatermath.com](mailto:hello@homewatermath.com) or the [contact form](/contact/).

**`/how-we-calculate/`**
- Title: `How We Calculate | HomeWaterMath`; Meta: `The formulas, constants and sources behind every HomeWaterMath calculator, with the date each source was checked.`
- H1: `How we calculate`
- Text: one short intro paragraph ("Every calculator on HomeWaterMath uses the formulas and constants below. Each one links to its source and the date we last checked it."), then one H2 per calculator with its formula (same as the page's "The formula" block, formula lines only) and a constants table generated from `constants.ts` (Constant, Value, Unit, Source, Checked). Then H2 "How we round": "Grains and dollars are shown as whole numbers, pounds and gallons to 1 decimal. Anything you buy as a whole item, such as bags of salt or tanks, is rounded up." Then H2 "Assumptions you can change" listing the defaults (75 gal per person, 7 days, 9 lb, 4 gpg per ppm iron, sea-level air pressure, $7 per bag).

**`/editorial-policy/`**
- Title: `Editorial Policy | HomeWaterMath`; Meta: `How HomeWaterMath researches, builds, checks and corrects its calculators and guides, how we use AI tools and how the site makes money.`
- H1: `Editorial policy`
- Text:
  Who writes and builds: Sikander Mushtaq writes and builds the calculators and pages on HomeWaterMath.

  Sources: we use manufacturer spec sheets and manuals, US government and university extension publications, and industry standards. Cost ranges come from named national cost surveys and retailer listings, with the date we checked them. Each page lists its sources.

  How calculators are checked: every formula is written as code with automated tests built from the worked examples, tables and FAQ numbers on its page. Where a manufacturer publishes its own calculator or table, we compare our results with it and note the comparison on the page.

  AI tools: we use AI tools to help with research, drafting and code. A person checks every number, formula and sentence before it's published.

  Updates: prices and constants are reviewed at least once a year. A page's "Last updated" date changes only when its content changes.

  Corrections: if you find an error, email [hello@homewatermath.com](mailto:hello@homewatermath.com). We fix confirmed errors and list them below.

  Ads and affiliate links: see our [affiliate disclosure](/affiliate-disclosure/). Commissions never change a calculator's result.

  H2 "Corrections log": table (Date, Page, What changed) rendered from `lib/data/corrections.ts`; empty state text: "No corrections yet."

**`/authors/sikander-mushtaq/`**
- Title: `Sikander Mushtaq, Founder | HomeWaterMath`; Meta: `Sikander Mushtaq builds the calculators on HomeWaterMath and checks each formula against manufacturer specs, standards and extension guides.`
- H1: `Sikander Mushtaq`
- Text (OWNER CONFIRM every sentence; add real background in one sentence if the owner provides it):
  Sikander Mushtaq is the founder of HomeWaterMath. He builds the site's calculators and checks every formula and number against manufacturer spec sheets, extension-service guides and industry standards before a page goes live.

  He started HomeWaterMath because water softener and well questions were getting answered with guesses or sales pitches, and the math behind them isn't hard once it's laid out.

  Pages by Sikander: list of all registry pages (title + link).
  Contact: hello@homewatermath.com
- Photo: owner's real photo if supplied (`public/authors/sikander-mushtaq.jpg`, 400x400); otherwise the initials circle "SM".

**`/contact/`**
- Title: `Contact HomeWaterMath`; Meta: `Send a question, correction or suggestion to HomeWaterMath. We read every message.`
- H1: `Contact`
- Text: "Questions, corrections and calculator ideas are welcome. Use the form or email hello@homewatermath.com. We usually reply within a few days." Form fields: Name, Email, Message, hidden honeypot `botcheck`, Submit. Web3Forms endpoint with `NEXT_PUBLIC_WEB3FORMS_KEY`; success and error messages inline (no page reload). If the key is missing, show only the email address.

**`/privacy/`**
- Title: `Privacy Policy | HomeWaterMath`; Meta: `What HomeWaterMath collects, which services process it, and your choices.`
- H1: `Privacy policy`
- Text (sections): Who we are (HomeWaterMath, hello@homewatermath.com). What we collect: calculator inputs stay in your browser and are not sent to us, except that they appear in the page address if you use Share. Analytics: Cloudflare Web Analytics (no cookies, aggregate data). Google Analytics 4 when enabled: cookies, IP anonymization by Google, data kept 14 months; in the EEA, UK and Switzerland it only runs after you accept (Consent Mode). Contact form: messages are sent through Web3Forms and delivered to our email. Hosting: Cloudflare (logs, security). Advertising and affiliates: section present but text "We don't show ads or use affiliate links yet. This section will be updated before that changes." Your choices: decline or withdraw consent, block cookies, opt out of Google Analytics with Google's browser add-on (link https://tools.google.com/dlpage/gaoptout). Children: not directed at children under 13. Changes: date at the top. Contact.

**`/terms/`**: Title `Terms of Use | HomeWaterMath`; H1 `Terms of use`. Plain sections: use of the site, estimates only, no professional advice, accuracy not guaranteed, links to other sites, changes, contact. (Write 150 to 300 words in the style rules.)

**`/disclaimer/`**: Title `Disclaimer | HomeWaterMath`; H1 `Disclaimer`. Text: "HomeWaterMath's calculators give estimates based on published figures and the inputs you enter. They don't replace a water test, the manufacturer's instructions or a licensed plumber or well contractor. Local plumbing codes, permits and your specific equipment can change the right answer. Drinking water safety questions should go to your local health department or a certified lab. We're not responsible for decisions made from these estimates."

**`/affiliate-disclosure/`**: Title `Affiliate Disclosure | HomeWaterMath`; H1 `Affiliate disclosure`. Text: "Some pages may link to retailers or manufacturers through affiliate programs. If you buy through one of those links, we may earn a commission at no extra cost to you. Affiliate links are marked, and they never change a calculator's result or what we recommend. As of the date above, HomeWaterMath has no active affiliate links."

**`/sitemap/`** (HTML): Title `Sitemap | HomeWaterMath`; H1 `Sitemap`; grouped lists (Calculators by category, Guides (empty), About pages) with one-line descriptions from the registry.

**404**: H1 `Page not found`; text "That page doesn't exist or has moved. Try one of these calculators:" + the 5 tool links + search box.

## A8. AI search visibility

Nothing special beyond good SEO: the quick answers, question H2s in FAQs, exact numbers with units, tables and inline sources above. Keep the entity consistent (HomeWaterMath, Sikander Mushtaq, hello@homewatermath.com).

## A9. Analytics (MUST)

- Cloudflare Web Analytics is turned on in Cloudflare (Part B); no code needed if automatic. If not automatic, add the beacon with `defer`.
- GA4 only when `NEXT_PUBLIC_GA_ID` is set: gtag via `next/script` with `strategy="lazyOnload"`. Consent Mode v2: default `analytics_storage` and `ad_storage` = denied for EEA, UK and CH visitors (region list), granted elsewhere; show a small consent banner only in those regions (use Cloudflare's `CF-IPCountry` is not available on static pages, so use the timezone heuristic `Intl.DateTimeFormat().resolvedOptions().timeZone` starting with `Europe/` as the trigger). Banner: "We use analytics cookies to see which calculators help. Accept / Decline." Store choice in localStorage (try/catch).
- Events (only if GA is on): `tool_used` (first input change per page view, param `tool`), `tool_result_shown` (debounced), `copy_result`, `share_link`, `outbound_click` (param `url`).

## A10. Monetization-ready (build now, switched off)

- `AdSlot` with reserved min-height (mobile 280 px, desktop 250 px) that renders nothing (and reserves no space) unless `NEXT_PUBLIC_ADSENSE_ID` is set. Placements when on: after "The formula" section and after the FAQ. Never between inputs and result, never above the calculator on mobile.
- `public/ads.txt`: create only when the owner has a publisher ID (Part B gives it).
- `AffiliateBox` (renders only when `NEXT_PUBLIC_AFFILIATES_ON=1`): a calm card under the result card's "Show the math": "Systems in this size" with up to 3 product links (`rel="sponsored nofollow noopener"`, `target="_blank"`), and a one-line disclosure "We may earn a commission if you buy through these links. It doesn't change the result." Content from `lib/data/affiliates.ts` (empty at launch).
- `EmailSignup` block (off by default, flag `NEXT_PUBLIC_EMAIL_ON`): "Get a reminder when it's time to add salt" + email field + consent line "We'll only email you salt and maintenance reminders. Unsubscribe any time." Provider decided later.

## A11. Performance (MUST)

- Core Web Vitals (mobile, p75): LCP <= 2.5 s, INP <= 200 ms, CLS 0.
- JS budget per tool page <= 100 KB gzipped before ads. Total page weight <= 1 MB.
- H1 and quick answer are server components outside the client calculator.
- `prefetch={false}` on footer, related, hub, breadcrumb and tile links.
- `next/font` Figtree, weights 400/500/600 only, `display: 'swap'`.
- No third-party scripts except Cloudflare beacon and (optional) GA4 lazyOnload.
- Images per the design file (AVIF/WebP/JPEG `<picture>`, lazy below the fold, explicit width/height).

## A12. Tests and launch checks (MUST)

- Vitest: the tests listed under each tool (at least 10 per tool) plus: every FAQ and table number on each page checked against the calc functions; registry integrity (every slug unique, every related slug exists, every source id exists, titles <= 60, metas <= 155).
- Build checks: `next build` clean, no TypeScript errors, no console errors in the browser, every page has exactly one H1, a canonical, og:image and valid JSON-LD.
- Run Lighthouse mobile on `/` and each tool page and report the scores.
- Check at 360 px wide: no horizontal scroll, sticky result bar works, tables scroll inside their wrapper.
- `curl -I https://<preview>/does-not-exist/` returns 404.

## A13. Content style (for any text you have to write yourself, e.g. Terms)

Follow the owner's manual A13: answer first, plain verbs, contractions, real numbers, sentence-case headings, no em dashes, no exclamation marks, and none of the banned words (delve, dive in, tapestry, testament, realm, landscape, navigate, journey, embark, unlock, unleash, elevate, empower, harness, leverage, utilize, foster, streamline, supercharge, seamless, robust, comprehensive, ultimate, crucial, pivotal, vital, essential, cutting-edge, game-changer, versatile, myriad, plethora, bustling, vibrant, meticulous, nuanced, intricate, Indeed, Moreover, Furthermore, Additionally, Notably, Ultimately, Overall, In conclusion, In summary, To sum up, "In today's fast-paced world", "Whether you're a beginner or a pro", "Look no further", "It's important to note", "It's worth noting", "When it comes to"). Add a test that scans all page text in `lib/content/**` for these words and for "—".

## A14. Definition of done

- [ ] All 18 URLs + 404 built from the registry with the exact titles, metas, H1s and text above.
- [ ] 5 calculators work, default results present in the static HTML, "Show the math", copy, share, print work.
- [ ] >= 10 tests per calculator, all passing; registry and banned-word tests pass.
- [ ] JSON-LD valid on every template; FAQ schema text equals visible FAQ text.
- [ ] sitemap.xml, robots.txt, HTML sitemap, OG images, favicons, `_headers`, 404.
- [ ] Lighthouse mobile: home >= 95, tools >= 90, A11y/BP/SEO 100, CLS 0. Report numbers.
- [ ] Design QA from the design file (360/390/768/1280 px screenshots attached to the report).
- [ ] Photos processed per the design and photos files; image weight report.
- [ ] Contrast ratios reported.
- [ ] No ads, no affiliate links, no GA unless env vars set.

## A15. Constants and sources (copy into `constants.ts` and `sources.ts`)

Constants (value, unit, source id):
- MG_PER_GPG = 17.1181 mg/L as CaCO3 per gpg (derived from nist-hb44: 1 grain = 64.79891 mg, 1 gal = 3.785411784 L). Industry rounding 17.1 (wqa-ion-exchange).
- MG_PER_MMOL = 100.087 (CaCO3 molar mass, derived). MG_PER_DH = 17.848 (sigma-hardness / dGH definition 10 mg/L CaO). MG_PER_FH = 10 (sigma-hardness).
- WQA classes (mg/L): <17.1 soft; 17.1-60 slightly; 60-120 moderately; 120-180 hard; >180 very hard (unl-g1274; psu-softening). USGS classes: 0-60 soft; 61-120 moderately; 121-180 hard; >180 very hard (usgs-hardness).
- SOFT_WATER_GPG = 1 (wqa-dummies, NSF/ANSI 44).
- GAL_PER_PERSON_DEFAULT = 75 (wqa-design-2025; nelsen-sizing; csi-manual). Options 60 (wqa-design-2025 "65 or even 60") and 80 (epa-watersense-stats: 82 total home use).
- IRON_ALLOWANCE = 4 gpg per ppm (nelsen-sizing; csi-manual), alt 5 (whirlpool-manual; aosmith-lowes-manual). IRON_MAX_PPM = 2 (nelsen-sizing).
- DAYS_BETWEEN_REGEN_DEFAULT = 7 (convention; range 3-14; psu-softening example 6-7 days; nelsen-sizing 3-5). Label as "common default" in How we calculate.
- CAPACITY_PER_CUFT = {6: 20000, 9: 25000, 12: 27500, 15: 30000} (aosmith-c43 6/10/15 lb = 20k/25k/30k; wcp-slovak-2004 for 9 and 12 lb, adjusted).
- SIZES (label grains → cu ft): 24000→0.75, 32000→1.0, 48000→1.5, 64000→2.0, 80000→2.5, 96000→3.0 (aquatell-clack-ws1; csi-manual).
- NSF_EFFICIENCY_GRAINS_PER_LB = 3350 (pnnl-softeners). KCL_EXTRA = 13-15% (wqa-getting-smart-2024).
- SODIUM_MG_PER_L_PER_GPG = 7.864 (derived; matches unl-g1274 "about 8 mg/L", psu-softening 7.5 mg per quart).
- SALT_BAG_LB = 40 (lowes-salt-40lb). SALT_PRICE_DEFAULT = 7 (range 5-10: ndsu-wq1031, thisoldhouse-cost; ace-salt $8.99 sale).
- Cost data: see A6.4 (thisoldhouse-cost, homeguide-cost, fixr-cost, hd-pentair-kit $175, freshwater-clack-bypass $35.28, culligan-lifespan 10-15 yr).
- PRESSURE_TANK: ATM 14.7 psi; pre-charge = cut-in - 2 (goulds-crsgtank; driller-pelikan-2006); min run 1 min <= 3/4 hp, 2 min above (amtrol-mc10188; goulds-crsgtank); TANKS [20, 26, 32, 44, 62, 86, 119] gal (amtrol-mc10188 sizes 20/26/32/44/62/86/119).

Sources (id, name, url, accessed 2026-10-20 for all):
- nist-hb44: NIST Handbook 44 (2026), Appendix C: https://www.nist.gov/document/2026-nist-handbook-44-appendix-c
- wqa-ion-exchange: WQA Ion Exchange Fact Sheet: https://wqa.org/wp-content/uploads/2023/10/Ion-Exchange-Fact-Sheet.pdf
- wqa-dummies: WQA, Water Treatment for Dummies, 2nd ed.: https://wqa.org/wp-content/uploads/2022/09/Water-Treatment-for-Dummies-2nd-Edition.pdf
- wqa-design-2025: WQA, Residential Water Treatment Design (2025): https://wqa.org/wp-content/uploads/2025/03/Article-2-Residential-Water-Treatment-Design-w-tables-2025.pdf
- wqa-getting-smart-2024: WQA, Getting Smart with Softeners (2024): https://wqa.org/wp-content/uploads/2024/06/GettingSmartSofteners.pdf
- usgs-hardness: USGS Water Science School, Hardness of Water: https://www.usgs.gov/water-science-school/science/hardness-water
- unl-g1274: University of Nebraska-Lincoln Extension, NebGuide G1274 (2016): https://extensionpubs.unl.edu/publication/g1274/2016/pdf/view/g1274-2016.pdf
- psu-softening: Penn State Extension, Water Softening: https://extension.psu.edu/water-softening
- ndsu-wq1031: NDSU Extension WQ1031: https://ndsu.edu/agriculture/node/2527
- alberta-agdex: Alberta Agriculture, Agdex 716(D32) Water Softening: https://www1.agric.gov.ab.ca/$department/deptdocs.nsf/all/agdex9354
- sigma-hardness: Sigma-Aldrich, water hardness test (product 37194): https://sigmaaldrich.com/JP/en/product/sial/37194
- epa-watersense-stats: EPA WaterSense, Statistics and Facts: https://www.epa.gov/watersense/statistics-and-facts
- nelsen-sizing: Nelsen Corp., Softener Sizing: https://nelsencorp.com/tech/softener-sizing
- csi-manual: CSI Water Treatment CT24/CT32 softener manual: https://inspectapedia.com/plumbing/CSI-CT24-CT32-Water-Softener-Manual.pdf
- whirlpool-manual: Whirlpool WHES40/WHES44 owner's manual: https://www.whirlpool.com/content/dam/global/documents/202107/owners-manual-w11484759-reva.pdf
- aosmith-lowes-manual: A.O. Smith AO-WH-SOFT-350 manual: https://www.aosmithatlowes.com/media/1148/ao-wh-soft-350_ownersmanual.pdf
- aosmith-c43: A.O. Smith C43 Series spec sheet: https://assets.aosmith.com/damroot/Original/10017/C43%20Series%201.0-1.25%20inch%20Spec%20Sheet.pdf
- wcp-slovak-2004: Water Conditioning & Purification, Guidelines for Designing Water Softeners (2004): https://wcponline.com/2004/03/14/learn-right-first-time-guidelines-designing-water-softeners/
- wcp-michaud-2011: WC&P, The Role of Cross-Linking in Ion Exchange Resins (2011): https://wcponline.com/2011/06/07/role-cross-linking-ion-exchange-resins/
- pnnl-softeners: PNNL Building America Solution Center, Water Softeners: https://basc.pnnl.gov/resource-guides/water-softeners
- aquatell-clack-ws1: Aquatell, Clack WS1 water softener listing: https://www.aquatell.ca/collections/clack/products/clack-ws1-water-softener
- freshwater-fleck-48k: Fresh Water Systems, Fleck 5600SXT listing: https://freshwatersystems.com/products/fleck-5600sxt-electronic-meter-32-000-grain-water-softener
- lowes-salt-40lb: Lowe's, 40 lb water softener salt: https://www.lowes.com/pl/water-filtration-water-softeners/water-softener-salt/40-lb/4294822069-4294704372
- ace-salt: Ace Hardware, Diamond Crystal Bright & Soft 40 lb: https://www.acehardware.com/p/7036692
- thisoldhouse-cost: This Old House, Water Softener System Cost (updated 2026-06-16): https://thisoldhouse.com/plumbing/reviews/water-softener-system-cost
- homeguide-cost: HomeGuide, Water Softener Cost: https://homeguide.com/costs/water-softener-cost
- fixr-cost: Fixr, Water Softener Installation Cost: https://www.fixr.com/costs/water-softener-installation
- angi-chicago: Angi, Water Softener Installation Cost (Chicago, 2026): https://www.angi.com/articles/how-much-does-water-softener-installation-cost/il/chicago
- homeserve-cost: HomeServe, Water Softener Installation Cost: https://www.homeserve.com/en-us/blog/cost-guide/water-softener-installation
- hd-pentair-kit: Home Depot, Pentair water softener install kit: https://www.homedepot.com/p/205803612
- freshwater-clack-bypass: Fresh Water Systems, Clack WS1 bypass valve: https://freshwatersystems.com/products/clack-ws1-v3006-bypass-for-1-valve
- culligan-lifespan: Culligan, When to Replace Your Water Softener: https://www.culligan.com/blog/when-to-replace-your-water-softener
- bobvila-salt: (cost of salt) Bob Vila: use only if the browser agent supplies a URL; otherwise drop this id.
- amtrol-mc10188: AMTROL Well-X-Trol brochure MC 10188: https://assets.freshwatersystems.com/image/upload/s--8yoD6F34--/fmfb0fru4ngsk446ug51.pdf
- amtrol-older-chart: AMTROL Well-X-Trol sizing chart: https://inspectapedia.com/water/Well-X-Trol-Tank-Sizing-Chart-AMTROL.pdf
- goulds-crsgtank: Goulds Water Technology, HYDRO-PRO tank sizing guide (2025): https://prod.xylem.com/siteassets/brand/goulds-water-technology/resources/guideline/crsgtank-r2.pdf
- goulds-brhptank: Goulds Water Technology, HYDRO-PRO brochure (2025): https://prod.xylem.com/siteassets/brand/goulds-water-technology/resources/brochure/brhptank.pdf
- driller-pelikan-2006: The Driller, How to Calculate and Control Pressure Tank Drawdown (2006): https://thedriller.com/articles/84709-how-to-calculate-and-control-pressure-tank-drawdown
- fws-tank-blog: Fresh Water Systems, How to Size a Well Pressure Tank: https://www.freshwatersystems.com/blogs/blog/how-to-size-a-well-pressure-tank
- usgs-private-wells: (browser agent will supply; until then use the fallback sentence in A6.8)

---

# PART B: browser agent tasks (not for the coding agent)

1. Cloudflare: zone added (done 2026-10-20). After the first push: create Pages project from the GitHub repo (build `npm run build`, output `out`, `NODE_VERSION=22`), add custom domains `homewatermath.com` and `www.homewatermath.com`, SSL Full (strict), Always Use HTTPS, redirect rule www → apex 301, Web Analytics on, Email Address Obfuscation off, Bot Fight Mode off, Email Routing hello@ → owner's Gmail.
2. Web3Forms access key → Cloudflare env var `NEXT_PUBLIC_WEB3FORMS_KEY`; live test.
3. Owner confirmations: author bio sentences, author photo (optional), WHOIS privacy and auto-renew at Hostinger.
4. Photos: pick and verify every slot in `homewatermath-photos.md` (blocked until the browser is available again).
5. Verify the live site (manual section 10), then Search Console (DNS TXT), Bing (import from GSC), GA4, IndexNow workflow spec.
6. After launch: manufacturer comparisons (size calculator vs a dealer sizing tool; pressure tank vs Goulds table) → owner notes.
7. Find a primary source for the private-well share (USGS/EPA) for `/well-water/`.

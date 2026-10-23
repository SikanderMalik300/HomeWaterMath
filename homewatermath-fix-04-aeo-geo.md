# HomeWaterMath fix file 04: AEO / GEO checklist fixes

Date: 2026-10-22. Written by: browser agent, after running the playbook's AEO/GEO checklist (section 6) against all 24 live URLs.
Main build spec rules still apply (no em dashes, sentence case, tests, CLS 0). Do this together with batch 03 (the new guide pages must follow the same rules).

## Checklist result

| Check | Result |
|---|---|
| Direct answers in the first lines | Pass on all tools and hubs (quick answer box under the H1) |
| FAQPage schema from the page's own text | Pass on all tools and hubs |
| Author (Person) + datePublished + dateModified on a WebPage node | **Fail on all 24 pages** (see 1) |
| Data tables are real `<table>` with `<caption>` | **Fail: 28 of 31 tables have no caption** (see 2) |
| Visible sources + "Updated" date | **Fail on 3 pages** (see 3) |
| robots.txt allows Googlebot, Bingbot, OAI-SearchBot, PerplexityBot | Pass (`User-agent: * Allow: /`); Cloudflare AI bot policies all "Allow" |
| IndexNow on deploy | Pass (HTTP 202 = accepted; keep treating 200 and 202 as success) |
| Unique titles 30–60, descriptions 110–160 | Titles unique. **5 titles and 4 descriptions too short** (see 4) |

## 1. Structured data: WebPage + Person + dates (all pages)

Today the graph has Organization + WebSite (+ WebApplication / CollectionPage / BreadcrumbList / FAQPage). The tool node's `author` is only `{"@id": ".../authors/sikander-mushtaq/#person"}`, but no Person node with that `@id` exists anywhere, and no page has `datePublished`.

Fix in the shared schema builder:
- Add a `Person` node to every page's `@graph`:
  `{"@type":"Person","@id":"https://homewatermath.com/authors/sikander-mushtaq/#person","name":"Sikander Mushtaq","url":"https://homewatermath.com/authors/sikander-mushtaq/","jobTitle":"Founder","worksFor":{"@id":"https://homewatermath.com/#org"}}`
- Add a `WebPage` node to every page (use the more specific subtype where it fits: `CollectionPage` for hubs, `AboutPage` for /about/, `ContactPage` for /contact/, `ProfilePage` for the author page; tools and guides use plain `WebPage`):
  `{"@type":"WebPage","@id":"<url>#webpage","url":"<url>","name":"<title without the | HomeWaterMath suffix>","isPartOf":{"@id":"https://homewatermath.com/#website"},"breadcrumb":{"@id":"<url>#breadcrumb"},"author":{"@id":".../#person"},"publisher":{"@id":"https://homewatermath.com/#org"},"datePublished":"<registry publishedDate>","dateModified":"<registry lastUpdated>","inLanguage":"en-US","primaryImageOfPage":{"@id":"<url>#primaryimage"}}` (omit primaryImageOfPage if the page has no photo).
- On tools, set `mainEntity` of the WebPage to the WebApplication node (`"mainEntity":{"@id":"<url>#app"}`) and give the WebApplication an `@id`. On guides (batch 03), the Article node keeps author/datePublished/dateModified and the WebPage's `mainEntity` points to it.
- Registry: add `publishedDate`. Values: launch pages 2026-10-20; batch 02 pages and /water-filters/ 2026-10-21; batch 03 pages 2026-10-22.
- On the author page add `ProfilePage` with `mainEntity` = the Person node.
- Test: every built page has exactly one WebPage-type node with author, datePublished and dateModified, and every `@id` reference resolves to a node in the same graph.

## 2. Table captions (28 tables)

Each table already has a visible heading or label right above it (for example "Water softener cost by type (US, 2026)"). Move that text into a real `<caption>` inside the `<table>` and remove the duplicate heading. Keep the look: style `caption` as the old heading (left-aligned, `caption-side: top`, same font size and weight). If a table has no label today (for example the hub "Which calculator do I need?" table), use that H2 text as the caption and keep the H2. The existing source caption text under tables stays as a `<p>` after the table (or a second line inside the caption if that's simpler).
Pages: /water-softeners/ (1), /well-water/ (1), /water-filters/ (1), /water-softener-size-calculator/ (3 of 4), /water-softener-cost/ (2 of 3), /water-softener-salt-calculator/ (2), /water-hardness-converter/ (2), /well-pressure-tank-size-calculator/ (2), /well-pump-replacement-cost/ (4), /water-softener-vs-salt-free-cost/ (2), /reverse-osmosis-system-cost/ (3), /whole-house-water-filter-cost/ (2), /water-softener-installation-cost/ (1), /how-we-calculate/ (1).
Test: every `<table>` inside `<main>` on every built page has a non-empty `<caption>`.

## 3. Visible sources and "Updated" date

- `/water-softeners/` and `/water-filters/`: add a "Sources" block (same component as tools) listing the sources used in the hub intro and FAQ: for softeners `usgs-hardness`, `unl-g1274`, `wqa-dummies`; for filters `epa-ccr`, `cdc-well-testing`, `nsf-standards` (add: NSF, "Standards for water treatment systems", https://www.nsf.org/consumer-resources/articles/standards-water-treatment-systems).
- `/how-we-calculate/`: add a "Sources" block at the end listing every source id used in its constants tables (generate from `constants.ts` source ids, deduplicated).
- Homepage: add a small "Last updated: Oct 22, 2026" line (muted, 14 px) above "Photo credits", driven by the newest `lastUpdated` in the registry.

## 4. Titles and descriptions (exact)

| Page | New title | New description |
|---|---|---|
| /about/ | About HomeWaterMath: Who We Are and How We Work | Who runs HomeWaterMath, why it exists, and how its free water calculators are built, checked against published sources and paid for. |
| /contact/ | Contact HomeWaterMath: Questions and Corrections | Send a question, correction or calculator idea to HomeWaterMath by form or email. We read every message and usually reply within a few days. |
| /terms/ | Terms of Use for HomeWaterMath Calculators | (keep current) |
| /disclaimer/ | Disclaimer: Estimates Only | HomeWaterMath | (keep current) |
| /privacy/ | (keep current) | How HomeWaterMath handles your data: what Cloudflare and Google Analytics collect, what the contact form stores, and the choices you have. |
| /sitemap/ | Sitemap: All HomeWaterMath Pages and Calculators | Every page on HomeWaterMath in one place: water softener, well water and water filter calculators, guides, and our trust and policy pages. |

Lengths checked: titles 42 to 48 characters, descriptions 132 to 140. Change the registry test to enforce titles 30–60 and descriptions 110–160 on every page (it currently allows shorter).

## 5. llms.txt

It lists the 10 calculators but not the hubs, guides or trust pages. Generate it from the registry with sections: "Calculators", "Guides" (batch 03 onward), "Category pages" (3 hubs), "About this site" (/about/, /how-we-calculate/, /editorial-policy/, /authors/sikander-mushtaq/). One line each: `- [Title](url): one-sentence description` (use the registry `cardBlurb`).

## 6. robots.txt (clarity only)

Keep `User-agent: * Allow: /` and the sitemap line. Add explicit groups after it so the intent is obvious to anyone auditing:
```
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /
```
Don't disallow `/embed/` (see the embed spec: those pages use noindex, which needs crawling to work).

## Report back

Commit, tests passed/total, the schema test output for 3 sample pages (one tool, one hub, the author page), the caption test result, and the new llms.txt.

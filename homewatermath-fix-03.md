# HomeWaterMath fix file 03

Date: 2026-10-21. Written by: browser agent, after verifying batch 02 live (commit 0b57722).
Batch 02 passed: all 6 URLs return 200, every default value is in the HTML, schema present (WebApplication + BreadcrumbList + FAQPage), nav and homepage bands correct, no horizontal scroll, PageSpeed mobile on the salt vs salt-free page 96 (LCP 2.4 s, CLS 0). The shortened title and meta are approved; keep them.
Three small items below. Do them, run tests and build, push to `main`, reply with the report.

## 1. Heading order on `/water-softener-vs-salt-free-cost/` (accessibility 93 → 100)

PageSpeed flags "Heading elements are not in a sequentially-descending order": the two result columns use `<h3>` ("Salt-based softener", "Salt-free conditioner") directly after the H1, before any H2.
Fix: render those two column titles as `<p class="text-[16px] font-medium text-ink">` (same look), not headings. Check every tool page with a quick script: inside `<main>`, no heading level may jump by more than 1 from the previous heading. Add that check to the existing content tests so it can't come back.

## 2. Alt text on the install photo

`tool-softener-install` alt says "under a sink", but the photo shows a utility area with foil insulation. Change the alt to: "Hands tightening a brass fitting on a water pipe". Update `photos.ts` and `docs/photos-batch02.md`.

## 3. Well pump photo (slot `tool-well-pump`)

You were right to leave the mist square. Search again with a different subject that still fits the page honestly:
- an outdoor spigot or yard hydrant running water at a house, or
- a rural home with a lawn (well country), shot in daylight, no people as the subject, or
- a pressure switch or pump control box on a basement wall.
Same rules as the batch-02 photos addendum (free license, look at it yourself, no brands or faces, not used on the site, at least 1,600 px). If nothing fits, keep the mist square and say so.

## Report back

- Commit hash, tests passed / total
- Heading-order script output for all tool pages (should be all "ok")
- Well pump photo: page URL, photographer, size, alt, focal point, why it fits (or "kept mist square")

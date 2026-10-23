# HomeWaterMath fix file 05

Date: 2026-10-23. Written by: browser agent, after verifying batch 03 (f09b7c1), fix 04 (954cdff) and embeds (d547d61) live.

## Verified live (no action)
- All 5 guides return 200 with the default widget results in the HTML; schema on each guide is Organization + WebSite + Person + Article + WebPage + BreadcrumbList + FAQPage; every table has a caption; titles 49 to 60, descriptions 143 to 155; no em dashes.
- `/calculators-for-your-site/` is live and in the sitemap (30 URLs); `/embed/*` is not in the sitemap.
- Embeds: `X-Robots-Tag: noindex`, `Content-Security-Policy: frame-ancestors *`, `Cache-Control: ... no-transform`, no `X-Frame-Options`. On the deployed embed page the browser loaded only homewatermath.com resources: no cloudflareinsights, google-analytics or googletagmanager requests. Tested the hardness snippet on another origin (example.com): it frames correctly and embed.js resized it to 722 px.

## 1. Error codes on `/water-softener-not-working/` (accuracy)

- Fleck: the Pentair 5600SXT manual 42684 labels it "Error 2 (Regen Failure)": "The system has not regenerated for more than 99 days (or 7 days if the Control Type has been set to Day-of-Week)". Change our wording from "Err 2" to: "On Fleck 5600SXT valves, Error 2 means the system hasn't regenerated in more than 99 days."
- Clack: the "E1 to E3" wording could not be confirmed from the Clack manual (scanned PDF). Remove the Clack sentence and use instead (exact): "On other valves, including Clack WS1, look the code up in your valve's manual; most codes point to the motor or drive."
- Apply the same change anywhere else the codes appear (symptom 7 of the checker, body text, FAQ if present). Update the test that checks the symptom 7 text.

## 2. Embed height for the size calculator

The size embed is about 1,360 px tall at 680 px wide because it shows the full six-size table. Hosts will find that too tall.
In `embed` mode only:
- Put the "all six sizes" table inside a closed `<details>` with summary "Compare all sizes".
- Put the result rows after the first four (grains needed, grains per day, hardness used, real capacity) inside the same pattern if needed, so the default embed height is under about 900 px.
- Same rule for the salt calculator's comparison strip ("Compare salt settings").
Re-measure the default heights at 680 px and update the snippet fallback heights in `lib/embed.ts`. The full tool pages don't change.

## 3. Photos for the 4 empty guide slots (try again with these subjects)

Same rules as before (free license, look at it yourself, no brand or face, not already on the site, at least 1,600 px). Pick one per slot; if nothing fits, keep the mist square and say so.
| Slot | New subject ideas |
|---|---|
| guide-softener-troubleshoot | Hands holding an adjustable wrench at a pipe valve; a utility-room water line with valves; a plumber's toolbox opened on a floor |
| guide-softener-lifespan | A clean basement or utility room with a water heater and pipes; an hourglass or calendar beside plumbing is not OK (staged); prefer a real utility space |
| guide-iron-filter | A glass of slightly orange or cloudy water held against light; rusty old pipe close-up; iron-stained stone or water (natural) if clean and bright |
| guide-hardness-test | Unbranded test strips beside a glass of water; a test tube of water held in a hand; a pipette dropping into a small sample cup (not the beaker scene used on the converter) |

## Report back
Commit, tests passed/total, new embed heights, and the photo choices (page, photographer, size, alt, focal point, why it fits) or "kept mist square".

# HomeWaterMath batch 02: photos (addendum)

Date: 2026-10-21. Written by: browser agent. For: the coding agent.
From now on you choose and download photos yourself. The browser agent checks them on the live site after you push.

## Approved already (download and use these)

| Slot id | Download URL | Photographer (profile) | Photo page | Alt text | Focal X/Y | File name |
|---|---|---|---|---|---|---|
| tool-ro | https://images.unsplash.com/photo-1629078692818-c5a0443f4ae3?fm=jpg&q=90&w=2560 | Steven Ungermann (https://unsplash.com/@steveungermann) | https://unsplash.com/photos/stainless-steel-faucet-turned-off-IcNpBCQS3fk | Chrome kitchen faucet over a stainless steel double sink | 35% / 50% | chrome-kitchen-faucet-double-sink |
| tool-whole-house-filter | https://images.unsplash.com/photo-1698724624855-e9dbc5a0bddb?fm=jpg&q=90&w=2560 | natalia menin (https://unsplash.com/@nmenin) | https://unsplash.com/photos/a-shower-head-with-a-lot-of-water-coming-out-of-it-kvNXrgbmCGM | Water falling from a round rain shower head | 50% / 40% (portrait original, crop) | rain-shower-head-water |

## You choose these 3

| Slot id | Page | What the photo should show | Avoid |
|---|---|---|---|
| tool-salt-free | `/water-softener-vs-salt-free-cost/` | Scale or water spots on a chrome faucet, shower glass or kettle; or clean water droplets on chrome. Candidate to check first: https://unsplash.com/photos/silver-faucet-with-water-droplets-4kCCcfGdgiU (Erik Mclean) | Salt pellets (used on the salt calculator), product boxes |
| tool-well-pump | `/well-pump-replacement-cost/` | A modern US residential well system: well head or well cap in a yard, a pump house with pressure switch and piping, or a submersible pump being pulled | Old hand pumps, farm irrigation pumps, oil pumps (wrong system, misleading) |
| tool-softener-install | `/water-softener-installation-cost/` | Plumbing work in a home utility area: copper or PEX pipes with valves, a plumber's hands on a fitting, a utility room water line | The gloved-hands pipe photo already used on `/water-softener-cost/` (Pexels 29226620) |

## Rules (same as `homewatermath-photos.md`, all MUST)

1. Source: Unsplash (Unsplash License, never Unsplash+) or Pexels (Pexels License). Use the Unsplash or Pexels API or the photo page. Never iStock or "sponsored" results.
2. Open each image after download and look at it yourself before using it: a real photograph (no AI, 3D or illustration), no watermark, no readable brand logo or product label at tile or hero size, no face as the main subject, bright and clean.
3. At least 1,600 px on the long side.
4. Don't reuse any photo already on the site.
5. Process per the photos file: `<picture>` AVIF → WebP → JPEG, tiles 300/600, hero 640/1280, EXIF stripped, focal-point crop, descriptive lowercase file names, entry in `lib/data/photos.ts` with sourceUrl, photographer, photographerUrl, source, license, alt, focal, usedOn. Credits on the homepage "Photo credits" list.
6. If no photo meets every rule for a slot, leave the mist square and say so in your report. Never ship a weak photo just to fill a slot.

## Report back (add to your batch 02 report)

For each of the 3 slots you chose: photo page URL, photographer and profile URL, original size, alt text, focal point, and one line on why it fits. Also update `homewatermath-photos.md` in the repo (or `docs/photos.md`) with the same rows marked "approved by coding agent, pending browser check".

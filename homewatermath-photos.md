# HomeWaterMath photos (v1)

Date: 2026-10-20. Written by: browser agent.
Status: all 6 slots approved (table at the bottom). The coding agent downloads them itself from the Download URL column.

## Rules (every photo)

- Source: Unsplash (Unsplash License, not Unsplash+) or Pexels (Pexels License), or the owner's own photo. Check the license on the photo's own page.
- Real photograph: natural light, real textures. Reject anything AI-generated or composited (garbled labels or numbers, warped hands or tools, impossible reflections, plastic-smooth surfaces). The photographer's profile must show a real body of work.
- No watermarks, no readable brand logos or product labels, no face as the main subject.
- Bright, clean, not moody or heavily filtered. A reader instantly understands the topic.
- Works cropped to 1:1 (tiles) and to the hero ratio. At least 1600 px on the long side.
- One photo per page. Reuse a page's photo where that page appears again (homepage tiles, hubs).
- Never present a free-license photo as the owner's own test or setup.

## Processing (coding agent)

`<picture>` AVIF → WebP → JPEG; tiles 300 and 600 px, hero 640 and 1280 px; AVIF q about 60, WebP q about 75; strip EXIF; crop to focal point; file names lowercase, hyphenated, descriptive (e.g. `water-softener-salt-pellets.avif`); record each in `lib/data/photos.ts`:
`{ id, file, sourceUrl, photographer, photographerUrl, source: 'Unsplash'|'Pexels'|'Owner', license, alt, focalX, focalY, usedOn }`.

## Slots (all approved 2026-10-20 by the browser agent)

The coding agent downloads each file from the "Download URL" column, then processes it per the rules above. Keep the credit fields exactly as written.

| Slot id | Used on | Source | Photo page | Download URL | Photographer (profile) | Original size | Alt text | Focal X/Y | Suggested file name |
|---|---|---|---|---|---|---|---|---|---|
| hero-home | Homepage hero | Unsplash (Unsplash License) | https://unsplash.com/photos/a-hand-holding-a-glass-of-water-MUOhSYEqbHo | https://images.unsplash.com/photo-1669139470813-827cbcf54b20?fm=jpg&q=90&w=2560 | Swanky Fella (https://unsplash.com/@swankyfella) | 3892x2965 | A glass being filled with tap water at a kitchen sink | 55% / 50% | glass-filled-with-tap-water.jpg |
| tool-softener-size | Size calculator; homepage and hub tiles | Pexels (Pexels License) | https://www.pexels.com/photo/purifiers-at-a-water-treatment-plant-12726229/ | https://images.pexels.com/photos/12726229/pexels-photo-12726229.jpeg | Alexey Demidov (https://www.pexels.com/@alexeydemidov/) | 6000x4000 | Row of resin treatment tanks with control valves and blue piping | 50% / 45% | water-treatment-resin-tanks.jpg |
| tool-cost | Cost calculator; tiles | Pexels (Pexels License) | https://www.pexels.com/photo/professional-plumber-installing-a-radiator-pipe-29226620/ | https://images.pexels.com/photos/29226620/pexels-photo-29226620.jpeg | Sergei Starostin (https://www.pexels.com/@sejio402/) | 6000x4000 | Gloved hands fitting a threaded pipe connection during an installation | 45% / 60% | plumber-fitting-pipe-connection.jpg |
| tool-salt | Salt calculator; tiles | Unsplash (Unsplash License) | https://unsplash.com/photos/white-snow-on-brown-sand-sSLI7KXPwzU | https://images.unsplash.com/photo-1604697976327-4f28ff459803?fm=jpg&q=90&w=2560 | Charles Deluvio (https://unsplash.com/@charlesdeluvio) | 4480x6720 | Close-up of coarse white salt crystals | 50% / 45% | coarse-white-salt-crystals.jpg |
| tool-hardness | Hardness converter; tiles | Unsplash (Unsplash License) | https://unsplash.com/photos/three-clear-beakers-placed-on-tabletop-lQGJCMY5qcM | https://images.unsplash.com/photo-1532094349884-543bc11b234d?fm=jpg&q=90&w=2560 | Hans Reniers (https://unsplash.com/@hansreniers) | 5472x3648 | Water sample in a glass beaker with a pipette | 45% / 60% | water-sample-in-beaker.jpg |
| tool-pressure-tank | Pressure tank calculator; well hub tile | Unsplash (Unsplash License) | https://unsplash.com/photos/a-close-up-of-a-pressure-gauge-on-a-machine-iQprhuG2ALk | https://images.unsplash.com/photo-1674471361523-195aa08e69b5?fm=jpg&q=90&w=2560 | Anton Savinov (https://unsplash.com/@tonchik) | 5923x3949 | Water pressure gauge in psi on a plumbing manifold | 55% / 50% | water-pressure-gauge-psi.jpg |

Checks passed for every photo (2026-10-20): license shown on the photo page (Unsplash License "Free to use" / Pexels "Free"), not Unsplash+; real photograph by an established photographer (views from 160K to 373M); no watermark; no readable brand logo at tile or hero size (crop the pressure gauge photo to the focal point so the small solenoid label at top left falls outside 1:1 tiles); no face as the subject; bright, clean light; at least 2,900 px on the short side.
Rejected: a dark faucet close-up and a dark shower photo (too moody), Tekton pliers (brand name printed on the tool), the Unsplash+ copy of the treatment-tank photo (paid license).
Credits caption under the hero: "Photo: Swanky Fella / Unsplash". Homepage "Photo credits" lists all six with links.

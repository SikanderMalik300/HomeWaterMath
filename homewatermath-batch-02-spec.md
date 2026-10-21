# HomeWaterMath batch 02 spec: 5 cost calculators + Water filters hub

Date: 2026-10-21. Written by: browser agent. For: the coding agent.
Everything in the main build spec still applies (A0 to A5 layout, A9 analytics events, A11 performance, A12 tests, A13 style, A14 Definition of Done, design file, photos file). This file adds pages; it does not change existing ones except where section 7 says so.
No em dashes anywhere. Sentence case. Dollars are whole numbers with commas. "Typical" is always the midpoint of the range unless a line says otherwise.

## 0. What to build

| # | URL | H1 | Category | Photo slot |
|---|---|---|---|---|
| 1 | `/well-pump-replacement-cost/` | Well Pump Replacement Cost Calculator | well | `tool-well-pump` |
| 2 | `/water-softener-vs-salt-free-cost/` | Salt vs Salt-Free Water Softener Cost Calculator | softeners | `tool-salt-free` |
| 3 | `/reverse-osmosis-system-cost/` | Reverse Osmosis System Cost Calculator | filters | `tool-ro` |
| 4 | `/whole-house-water-filter-cost/` | Whole House Water Filter Cost Calculator | filters | `tool-whole-house-filter` |
| 5 | `/water-softener-installation-cost/` | Water Softener Installation Cost Calculator | softeners | `tool-softener-install` |
| 6 | `/water-filters/` hub | Water filter calculators | filters (new) | reuses tiles |

Photos: the browser agent will add the 5 slots to `homewatermath-photos.md` as a separate update. Until a slot is "approved" there, render the plain mist square per design section 7. Don't block the build on photos.

All 5 tools: `lastUpdated` 2026-10-21, author Sikander Mushtaq, A5 layout, registry entries, sitemap, BreadcrumbList + WebApplication (or SoftwareApplication, whichever the launch tools use) + FAQPage schema exactly as on launch tools, A9 events (`tool_used`, `tool_result_shown`, `copy_result`, `share_link`) with `tool` = path.

Shared helper (new, `lib/calc/range.ts`): `type Range = { low: number; high: number; typical: number }`, `addRanges(...r)`, `mid(a, b)`. Round only for display.

---

## 1. `/well-pump-replacement-cost/`

- Title: `Well Pump Replacement Cost Calculator (2026) | HomeWaterMath`
- Meta: `Estimate well pump replacement cost by pump type and well depth, with pipe, wire, pressure tank and emergency call-out. Plus a repair-or-replace check.`
- Breadcrumbs: Home / Well water / Well pump replacement cost
- Keywords: well pump replacement (6,600 / KD 28), well pump replacement cost (4,400 / 7), well pump cost (1,300 / 17).
- Information gain: the cost guides give one national range and no tool. This page prices by pump type, adds drop pipe and wire per foot of depth from real retail prices, adds a pressure tank and after-hours labor if needed, and runs the common 50% repair-or-replace rule against the user's repair quote.
- Related: `/well-pressure-tank-size-calculator/`, `/water-hardness-converter/`, `/whole-house-water-filter-cost/`.

**Quick answer (exact text):**
Replacing a well pump usually costs $1,000 to $2,500 for a submersible pump, $400 to $1,400 for a jet pump and $2,000 to $5,000 for a constant-pressure system, installed. Deep wells cost more when the drop pipe and wire are replaced too, which adds about $3.40 to $8.74 per foot of depth in materials. The calculator below adds it up for your well.

**Inputs (defaults):**
- Pump type: `Submersible` / `Shallow-well jet` / `Deep-well jet` / `Constant-pressure submersible` [Submersible]
- Well depth to the pump, feet: whole number 10 to 1,000 [200]
- Replace the drop pipe and wire too: `No` / `Yes` [No]
- Replace the pressure tank at the same time: `No` / `Yes` [No]
- After-hours or weekend call-out: `No` / `Yes` [No]
- Pump age, years: whole number 0 to 50 [12]
- Optional: "Repair quote you received ($)" [empty]
- Optional: "Replacement quote you received ($)" [empty]

**Data (`constants.ts`, with source ids):**
```
PUMP_INSTALLED = {
  submersible:     [1000, 2500],   // homeguide-pump; ahs-pump
  shallowJet:      [400, 1000],    // homeguide-pump; forbes-pump ($300-$1,000)
  deepJet:         [500, 1400],    // homeguide-pump; ahs-pump
  constantPressure:[2000, 5000],   // homeguide-pump; forbes-pump; homeadvisor-pump; ahs-pump
}
PIPE_PER_FT = [1.48, 4.74]   // hd-poly-pipe ($147.91 / 100 ft); supplyhouse-poly-pipe ($473.90 / 100 ft), 1-1/4 in 160 psi PE
WIRE_PER_FT = [1.92, 4.00]   // nassau-103-wire (1,000 ft reel price); backwoods-103-wire, 10/3 submersible pump cable
TANK_INSTALLED = [200, 1500], TANK_TYPICAL = 850   // forbes-tank ($200-$1,100, avg $700); homeguide-tank ($800-$1,500, avg $1,000); typical = mean of the two averages
AFTER_HOURS = [250, 1000]    // labor is $250-$1,000 (homeadvisor-pump; homeguide-pump); homeadvisor-repair: after-hours "usually double" -> add one more labor range
SHALLOW_JET_MAX_FT = 25      // goulds-residential (practical suction lift at sea level)
DEEP_JET_MAX_FT = 150        // homeadvisor-pump (deep jet up to 150 ft)
HOIST_FT = 200               // thumbtack-pump (hoist usually needed at 200 ft or deeper)
LIFESPAN = [8, 15]           // homeadvisor-pump; forbes-pump; homeguide-repair
```
**Formula (`lib/calc/wellPumpCost.ts`):**
```
pump      = PUMP_INSTALLED[type]                      typical = mid
pipeWire  = pipeWireYes ? depth × (1.48+1.92) .. depth × (4.74+4.00), typical = mid
tank      = tankYes ? 200..1500, typical 850
afterHrs  = afterHoursYes ? 250..1000, typical 625
total     = sum of the lines (low, high, typical)
repairCheck (only if repair quote entered):
  ratio = repairQuote / total.typical
  age >= 10 or ratio >= 0.5 → "Replace" message; else → "Repair" message
quoteCheck (replacement quote): < low "below the usual range (ask what's included)"; within; > high "above the usual range"
```
Warnings:
- Shallow-well jet and depth > 25: "Shallow-well jet pumps can lift water only about 25 ft at sea level. For a deeper water level you need a deep-well jet or a submersible pump."
- Deep-well jet and depth > 150: "Deep-well jet pumps are usually used to about 150 ft. Most deeper wells use a submersible pump."
- Submersible or constant-pressure and depth >= 200: info note "At 200 ft or deeper most crews use a pump hoist or truck to pull the pump, which can push labor toward the top of the range."

**Outputs:** headline typical `$1,750` with range `$1,000 to $2,500`; itemized rows (Pump installed; Drop pipe and wire, {depth} ft; Pressure tank; After-hours call-out) with only the selected lines; repair check line; quote check line; "A pump usually lasts 8 to 15 years. Yours is {age}."

Default render MUST show: `$1,750`, `$1,000 to $2,500`, one row (Pump installed, submersible), info note about 200 ft, lifespan line "Yours is 12".

Repair messages (exact):
- Replace: "A ${repair} repair is {pct}% of a typical ${typical} replacement{age >= 10 ? ` on a ${age}-year-old pump` : ''}. Replacing usually makes more sense: repairs on an old pump tend to repeat."
- Repair: "A ${repair} repair is {pct}% of a typical ${typical} replacement. If the rest of the system is sound, repairing is usually the better deal."
(Rule from homeguide-repair: replace if older than 10 to 15 years or repeat repairs; repair if one part failed and the fix is under 50% of replacement.)

**How to use (exact text):**
1. Choose your pump type. If you're not sure, a pump inside the well casing is a submersible, and a pump in the basement or a pump house is a jet pump.
2. Enter how deep the pump sits. Your well log or the last service invoice usually lists it.
3. Choose whether the pipe and wire should be replaced too. On older or deeper wells many crews replace them while the pump is out.
4. Add a pressure tank or an after-hours call-out if they apply.
5. Enter your pump's age and any quotes to see whether repair or replacement makes more sense.

**The formula (exact text):**
Total cost = pump installed + drop pipe and wire (if replaced) + pressure tank (if replaced) + after-hours labor (if any)

Pipe and wire are priced per foot of depth from current retail prices: 1-1/4 inch polyethylene drop pipe at $1.48 to $4.74 per foot and 10/3 submersible pump cable at $1.92 to $4.00 per foot.

*Example 1: submersible pump at 200 ft, pipe and wire replaced.* The pump costs $1,000 to $2,500 installed. Pipe and wire for 200 ft add $680 to $1,748. The total is $1,680 to $4,248, typically about $2,964.

*Example 2: constant-pressure system at 300 ft, with new pipe, wire and pressure tank.* The pump costs $2,000 to $5,000, pipe and wire for 300 ft $1,020 to $2,622, and a new tank $200 to $1,500. The total is $3,220 to $9,122, typically about $6,171.

**What this calculator doesn't cover:**
- Drilling a new well or deepening an old one.
- Electrical work beyond the pump circuit, such as a new panel breaker or a long trench to the well.
- Water treatment you may want once the system is open, like a sediment filter.
- Permits ($50 to $200 where required, per HomeAdvisor) and local service-call minimums.
- Solar pumps ($1,500 to $6,500 installed).
- Prices outside the US.

**Reference table 1: "Well pump replacement cost by type (US, installed)"**
| Pump type | Usual depth | Installed cost |
|---|---|---|
| Shallow-well jet | to about 25 ft | $400 to $1,000 |
| Deep-well jet | about 25 to 150 ft | $500 to $1,400 |
| Submersible | most wells, any depth | $1,000 to $2,500 |
| Constant-pressure submersible | any depth | $2,000 to $5,000 |
| Solar | off-grid | $1,500 to $6,500 |
Caption: "HomeGuide (2025), Forbes Home (2025), HomeAdvisor (2026). Most homeowners pay $975 to $2,825; the average is about $1,900 (Angi, ConsumerAffairs, 2026)."

**Reference table 2: "Submersible pump prices by horsepower (pump only, Oct 2026)"**
| Horsepower | Example pump | Rated depth | Price |
|---|---|---|---|
| 1/2 hp | Everbilt EFSUB5-123HD, 10 gpm | about 125 ft | $449 |
| 3/4 hp | Everbilt EFSUB7-122HD, 10 gpm | about 150 ft | $569 |
| 1 hp | Everbilt EFSUB10-122HD, 10 gpm | about 250 ft | $639 |
| 1-1/2 hp | ECO-FLO EFSUB15-123, 8.1 gpm | about 300 ft | $682 |
Caption: "Home Depot listings checked Oct 21, 2026. Brand-name pumps (Goulds, Franklin) cost more. Prices change; check before you buy." No affiliate links in this table at launch.

**Reference table 3: "How much water does a home need?"**
| Home | Pump flow |
|---|---|
| Minimum for any home | 6 gpm |
| 3 bedrooms, 2 baths | 12 gpm |
| 4 bedrooms, 3 baths | 16 gpm |
Caption: "Penn State Extension, Water System Planning (2025)."

**Reference table 4: "Common repairs (parts and labor)"**
| Repair | Typical cost |
|---|---|
| Pressure switch | $120 to $200 |
| Start capacitor | $100 to $300 |
| Control box | $200 to $600 |
| Foot valve (jet pumps) | $150 to $400 |
Caption: "HomeGuide (2025) and HomeAdvisor (2026)."

**Tips (exact text):**
- Ask whether the quote includes new drop pipe, wire, a check valve and a new pressure switch. Those parts are cheap while the pump is out and expensive to pull for later.
- If the pump is short-cycling, check the pressure tank first. A waterlogged tank can kill a new pump fast. Use our pressure tank calculator to check the size and pre-charge.
- Match the pump to your flow need and depth, not just the old pump's label. Upsizing horsepower without checking the well's yield can pull the water level down to the pump.
- Constant-pressure systems cost more but give steady pressure and soft starts, which can help a pump last.
- Get the depth and pump model from your well log before you call. Quotes are faster and more accurate.

**FAQ (exact text):**
1. Q: How much does it cost to replace a well pump? A: Most homeowners pay about $975 to $2,825, around $1,900 on average. A submersible pump runs $1,000 to $2,500 installed, a jet pump $400 to $1,400 and a constant-pressure system $2,000 to $5,000.
2. Q: How long does a well pump last? A: Usually 8 to 15 years. Pumps in wells with a lot of sand or sediment wear out sooner, and frequent short-cycling shortens their life.
3. Q: Should I repair or replace my well pump? A: A common rule is to replace a pump older than 10 to 15 years or one that keeps needing repairs, and to repair a single failed part when the fix costs less than half of a replacement.
4. Q: How much does labor cost to replace a well pump? A: Labor usually runs $250 to $1,000, and the job takes about 3 to 6 hours. After-hours and weekend calls usually cost about double.
5. Q: Does well depth change the cost? A: Yes, mostly through the pipe and wire. At current retail prices they add about $3.40 to $8.74 per foot when replaced, and deep pumps need more horsepower and often a pump hoist.
6. Q: What size well pump do I need? A: Size for your home's flow need and the depth to the water. Penn State Extension suggests at least 6 gpm for any home, about 12 gpm for 3 bedrooms and 2 baths, and 16 gpm for 4 bedrooms and 3 baths.

**Sources:** homeguide-pump, homeguide-repair, forbes-pump, homeadvisor-pump, homeadvisor-repair, angi-pump, consumeraffairs-pump, ahs-pump, thisoldhouse-pump, hd-poly-pipe, supplyhouse-poly-pipe, nassau-103-wire, backwoods-103-wire, hd-everbilt-pumps, hd-ecoflo-15, homeguide-tank, forbes-tank, psu-water-needs, goulds-residential, thumbtack-pump.

**Tests (min 12):** default → 1750 / 1000–2500; sub 200 ft + pipe/wire → 1680–4248, typ 2964; example 2 → 3220–9122, typ 6171; shallow jet 20 ft → 400–1000, typ 700, no warning; shallow jet 40 ft → warning; deep jet 100 ft + after-hours → 750–2400, typ 1575; deep jet 200 ft → warning; sub 400 ft + all options → 2810–8496, typ 5653; repair $900 on default (age 12) → Replace, 51%; repair $500 age 5 → Repair, 29%; repair $900 age 5 → Replace (ratio ≥ 0.5); replacement quote $3,000 default → above; depth empty → no NaN.

---

## 2. `/water-softener-vs-salt-free-cost/`

- Title: `Salt vs Salt-Free Water Softener: 10-Year Cost | HomeWaterMath`
- Meta: `Compare the 10-year cost of a salt-based softener and a salt-free conditioner for your home: install, salt, water, media and filters, plus what each one does.`
- Breadcrumbs: Home / Water softeners / Salt vs salt-free cost
- Keywords: no salt water softener (5,400 / 6), salt free water softeners (3,600 / 29), salt free water softener vs water softener (cluster).
- Information gain: most top results are sellers of one type. This page prices both for the user's home over 10 years with the same assumptions, counts regeneration water and media replacement, and states plainly from independent tests what salt-free systems do and don't do.
- Related: `/water-softener-cost/`, `/water-softener-salt-calculator/`, `/water-hardness-converter/`.

**Quick answer (exact text):**
A salt-free conditioner doesn't soften water. It changes hardness minerals so they form less scale, and in independent tests the best type (TAC) cut scale by more than 88%, while your water still tests just as hard. Upfront it costs more than a salt-based softener, but it needs no salt. For a family of 4 with 15 gpg water, a plumber-installed salt softener costs about $2,750 over 10 years and a salt-free system about $4,818, mostly because of one media replacement.

**Inputs (defaults):**
- People [4]; Hardness [15] + unit [gpg] (reuse the hardness unit control)
- Iron, ppm [0]
- Who installs: `DIY` / `Plumber` / `Dealer` [Plumber]
- Salt price per 40 lb bag [$7]
- Water per regeneration, gallons [50] (helper text: "Most softeners use 20 to 70 gallons. Check your manual.")
- Your water and sewer rate, $ per 1,000 gallons [empty] (helper text: "On your water bill. Leave empty to skip.")
- Salt-free media life, gallons [1,000,000]; Salt-free media replacement cost [$1,548]; Pre-filter cost per year [$27]

**Data and reuse:**
- Upfront costs: reuse `softenerCost` (A6.4): salt-based single tank and salt-free, same installer. Defaults give $1,700 and $3,000.
- Salt and regenerations: reuse `salt.ts` (metered, 9 lb setting, size from `softenerSize`). Defaults: 48,000 grains, 43.8 regenerations, 15 bags, $105 a year.
```
SALT_FREE_MEDIA_GAL = 1_000_000, SALT_FREE_MEDIA_COST = 1548   // aquasana-simplysoft, aquasana-simplysoft-media (10 years or 1,000,000 gal)
PREFILTER_PER_YEAR = 27        // waterfilterguru-futuresoft: about $20 every 9 months (20 × 12 / 9 = 26.7)
REGEN_GAL_DEFAULT = 50; REGEN_GAL_RANGE = [20, 70]   // epa-watersense-softener-2026
CONTROLLER_WATTS = 3           // pentair-autotrol-368 → 26 kWh a year
SALT_FREE_MAX_GPG = 75; SALT_FREE_MAX_IRON = 0.3     // watts-oneflow; springwell-futuresoft
TAC_SCALE_REDUCTION = ">88%"   // wrrf-08-06 (Fox et al., 2014)
```
**Formula (`lib/calc/saltVsSaltFree.ts`):**
```
salt:
  upfront   = softenerCost(single, installer).typical
  regenGal  = regensPerYear × waterPerRegen
  waterCost = rate ? regenGal / 1000 × rate : 0
  yearly    = saltCostPerYear + waterCost
  tenYear   = upfront + 10 × yearly
saltFree:
  upfront   = softenerCost(saltFree, installer).typical
  gal10     = people × 75 × 365 × 10
  media     = floor(gal10 / mediaLife) × mediaCost          // replacements inside 10 years
  mediaYear = mediaLife / (people × 75 × 365)               // shown as "first media change in year X.X"
  tenYear   = upfront + 10 × prefilter + media
difference  = |salt.tenYear − saltFree.tenYear|, cheaper = the lower one
```
Warnings:
- Hardness above 75 gpg: "Salt-free systems are usually rated to about 75 gpg. Above that, a salt-based softener is the safer choice."
- Iron above 0.3 ppm: "Salt-free systems need iron at or below 0.3 ppm. Treat the iron first, or choose a salt-based softener (rated to about 2 ppm)."
- Iron above 2 ppm: reuse the launch iron warning.

**Outputs:** two side-by-side columns (stack on mobile): Salt-based softener / Salt-free conditioner, each with Upfront, Per year, 10-year total; under them one line "Over 10 years the {cheaper} costs about ${difference} less." Then rows: Softener size `48,000 grains`; Regenerations `43.8` a year using about `2,190` gallons of water ({waterCost or "enter your water rate to price it"}); Salt `15` bags, `$105` a year; Electricity "about 26 kWh a year for the softener's valve"; Salt-free media "first change in year {mediaYear}, ${media} inside 10 years"; Does it soften? "Salt-based: yes, to under 1 gpg. Salt-free: no, hardness stays {hardness} gpg."

Default render MUST show: salt-based $1,700 upfront, $105 a year, $2,750 over 10 years; salt-free $3,000 upfront, $27 a year, $4,818 over 10 years; difference $2,068 in favor of salt-based; 2,190 gallons; first media change in year 9.1.

**How to use (exact text):**
1. Enter your household, hardness and any iron from a water test.
2. Choose who will install it. The same installer is used for both systems so the comparison is fair.
3. Enter your salt price and, if you know it, your water and sewer rate from your bill.
4. Check the salt-free media life and price against the model you're looking at, and change them if they differ.

**The formula (exact text):**
Both systems: 10-year cost = upfront cost + 10 years of running costs.

Salt-based running cost = salt + water used for regeneration. Salt-free running cost = pre-filters + any media replacement that falls inside the 10 years.

Regeneration water = regenerations per year × gallons per regeneration. The salt-free media lasts a set number of gallons, so a bigger household reaches its first media change sooner.

*Example 1: family of 4, 15 gpg, plumber install, water at $12 per 1,000 gallons.* The salt softener is a 48,000-grain unit at $1,700 installed. It regenerates 43.8 times a year using 2,190 gallons, $26 of water, plus $105 of salt: $131 a year, $3,013 over 10 years. The salt-free system costs $3,000 installed and $27 a year in pre-filters. The household uses 1,095,000 gallons in 10 years, so the 1,000,000-gallon media needs one $1,548 change: $4,818 in total.

*Example 2: couple, 10 gpg, plumber install.* The salt softener is a 24,000-grain unit: $1,700 installed and $35 of salt a year, $2,050 over 10 years. The salt-free system uses 547,500 gallons in 10 years, so no media change: $3,000 + $270 = $3,270.

**What this calculator doesn't cover:**
- Soap, cleaning and appliance savings from truly soft water. A salt-free system doesn't give those.
- Electricity cost in dollars (it's small: about 26 kWh a year for a typical softener valve).
- Local rules. Some California areas restrict salt-based softeners that drain to the sewer, such as the Santa Clarita Valley.
- Potassium chloride instead of salt (it costs more and needs about 13 to 15% more by weight).
- Electronic or magnetic descalers, which performed worse than TAC in independent tests.

**Reference table 1: "Salt-based softener vs salt-free conditioner"**
| | Salt-based softener | Salt-free conditioner (TAC) |
|---|---|---|
| Removes hardness | Yes, to under 1 gpg | No, hardness stays the same |
| Scale reduction in tests | About 94% | More than 88% |
| Uses salt | Yes | No |
| Uses water to regenerate | Yes, 20 to 70 gal each time | No |
| Needs electricity | A few watts for the valve | No |
| Hardness limit | High (size to your water) | About 75 gpg |
| Iron limit | About 2 ppm | 0.3 ppm |
| Certification to look for | NSF/ANSI 44 | DVGW W512 or IAPMO Z601 (80% scale reduction to pass) |
Caption: "Scale results: WateReuse Research Foundation project 08-06, Fox et al. (2014). Limits: Watts OneFlow and SpringWell FutureSoft spec sheets. Water per regeneration: EPA WaterSense (2026)."

**Reference table 2: "Salt-free media life and cost (examples)"**
| System | Media life | Replacement |
|---|---|---|
| Aquasana whole-house salt-free | 10 years or 1,000,000 gal | $1,548 |
| Watts OneFlow | about 3 years | varies by size |
| SpringWell FutureSoft | 5+ years | price not listed |
Caption: "Manufacturer pages checked Oct 21, 2026."

**Tips (exact text):**
- Test before you choose. If you need soft water for soap, skin or a water heater warranty, only a salt-based softener does that.
- If you want scale control without salt, look for a TAC system tested to DVGW W512 or IAPMO Z601. Electronic and magnetic devices did much worse in independent tests.
- Check iron, manganese and pH limits. A salt-free system can fail quickly on well water with iron.
- Compare media life in gallons, not years. A big household can reach the gallon limit years before the "10-year" label.
- A metered salt softener with an efficient salt setting narrows the running-cost gap.

**FAQ (exact text):**
1. Q: Is a salt-free water softener as good as a salt-based one? A: Not for softening. A salt-free conditioner leaves the hardness in the water and reduces scale instead. In independent tests the best type (TAC) cut scale by more than 88%, close to ion exchange at about 94%, but your water still tests hard.
2. Q: Which is cheaper over 10 years? A: For most homes the salt-based softener. For a family of 4 with 15 gpg water and a plumber install, it's about $2,750 against about $4,818 for a salt-free system, because the salt-free media needs replacing once. Small households can avoid that change, which narrows the gap.
3. Q: How long does salt-free media last? A: It depends on the brand. Aquasana rates its whole-house media at 10 years or 1,000,000 gallons, Watts says to replace OneFlow media about every 3 years, and SpringWell says 5 or more years.
4. Q: Do salt-free water softeners work on well water? A: Only if iron is at or below about 0.3 ppm and manganese at or below 0.05 ppm. Many wells exceed that, so test first.
5. Q: How much water does a salt-based softener waste? A: Each regeneration uses about 20 to 70 gallons. A family of 4 with 15 gpg water uses about 2,190 gallons a year at 50 gallons per regeneration.
6. Q: Are salt-based softeners banned anywhere? A: Some California areas restrict softeners that drain brine to the sewer. In the Santa Clarita Valley, voters approved a ban in 2008 and about 7,300 units were removed.

**Sources:** wrrf-08-06, wrrf-08-06-report, wcp-z601-2014, epa-trm-softeners, epa-watersense-softener-2026, watts-oneflow, springwell-futuresoft, springwell-fs-manual, aquasana-simplysoft, aquasana-simplysoft-media, waterfilterguru-futuresoft, pentair-autotrol-368, wateronline-scv-2011, plus reuse thisoldhouse-cost, homeguide-cost, wqa-getting-smart-2024.

**Tests (min 10):** default → salt 1700 / 105 / 2750, free 3000 / 27 / 4818, diff 2068, 2,190 gal, year 9.1; rate 12 → salt 3013, water $26; couple 10 gpg → 2050 vs 3270, 0 media; 5 people 20 gpg dealer rate 10 → salt 2500 up, 25 bags $175, water $22, 10-yr 4469; free 3000 + 270 + 1548 = 4818; 6 people → 64,000 grains, 23 bags; hardness 80 → warning; iron 0.5 → salt-free warning; DIY → 1275 and 2575 upfront; empty rate → no water cost, no NaN.

---

## 3. `/reverse-osmosis-system-cost/`

- Title: `Reverse Osmosis System Cost Calculator | HomeWaterMath`
- Meta: `Estimate reverse osmosis system cost: unit, install, filters and the water sent to drain, with a 10-year total and cost per gallon of RO water.`
- Breadcrumbs: Home / Water filters / Reverse osmosis system cost
- Keywords: how much does reverse osmosis cost (880 / 29), cost of RO system (590 / 24), whole house RO cost (590 / 18), reverse osmosis system cost (cluster ~13k).
- Information gain: no top result has a calculator. This page prices under-sink, tankless and countertop RO with install extras, counts filter changes, and uses EPA WaterSense efficiency figures to show how many gallons go down the drain for your household, plus a cost per gallon.
- Related: `/whole-house-water-filter-cost/`, `/water-hardness-converter/`, `/water-softener-cost/`.

**Quick answer (exact text):**
An under-sink reverse osmosis system costs about $150 to $350 for the unit, or $300 to $700 installed by a plumber. Tankless models run $300 to $600, or $450 to $950 installed. Filters add roughly $50 to $100 a year. A typical older system sends about 4 to 9 gallons to the drain for every gallon of filtered water; WaterSense-labeled systems send about 2.3 or less.

**Inputs (defaults):**
- System: `Under-sink with tank` / `Tankless under-sink` / `Countertop` [Under-sink with tank]
- Who installs: `DIY` / `Plumber` [Plumber] (hidden for Countertop: always DIY)
- People [4]; RO water per person per day, gallons [1] (helper: "Drinking and cooking. EPA uses 1 gallon.")
- Efficiency: `Standard (about 15%)` / `WaterSense labeled (30%)` / `Enter drain ratio` [Standard]; when "Enter drain ratio": "Gallons to drain per gallon of RO water" [3]
- Filters per year, $ [50]
- Your water and sewer rate, $ per 1,000 gallons [empty]
- Extras (checkboxes): `Refrigerator or ice maker line` / `Faucet hole drilled in a stone countertop` / `New drain line` [none]

**Data (`constants.ts`):**
```
RO = {
  tank:     { unit: [150, 350], installed: [300, 700] },   // homeguide-ro
  tankless: { unit: [300, 600], installed: [450, 950] },   // homeguide-ro; angi-ro unit $250-$900
  counter:  { unit: [200, 700] },                          // angi-ro
}
RO_EXTRAS = { fridge: [75, 130], stoneHole: [50, 250], drain: [300, 800] }   // angi-ro; slabwise-quartz; homeguide-ro
RO_FILTERS_PER_YEAR = 50     // apec-ro-sets: pre-filter set $29.95 yearly + complete set $79.99 every 3 years = $46.63; cost guides $50-$100 (forbes-ro)
RO_EFF_STANDARD = 0.15       // epa-ro-statement: typical POU RO 10-20% efficiency
RO_EFF_WATERSENSE = 0.30     // epa-ro-spec (2024): tank systems at least 30% efficient
RO_GAL_PER_PERSON_DAY = 1    // epa-ro-statement assumption
WHOLE_HOUSE_RO = [1000, 4800] and [4800, 8000]   // thisoldhouse-ro, angi-ro / homeguide-ro (table only)
```
**Formula (`lib/calc/roCost.ts`):**
```
upfront   = (installer == DIY || counter ? unit : installed) + selected extras   // low/high, typical = mid
product   = people × galPerPersonDay × 365
drainRatio= custom ?? (1 / efficiency − 1)        // 15% → 5.67, 30% → 2.33
toDrain   = product × drainRatio
waterCost = rate ? toDrain / 1000 × rate : 0
yearly    = filters + waterCost
tenYear   = upfront.typical + 10 × yearly
centsPerGal = tenYear / (10 × product) × 100      // 1 decimal
```
**Outputs:** headline upfront typical `$500` with range `$300 to $700`; rows: Filters `$50` a year; RO water `1,460` gallons a year; Sent to drain `8,273` gallons a year (`5.7` gal per gal) with water cost if rate given; 10-year total `$1,000`; Cost per gallon of RO water `6.8¢`; a one-line comparison "A WaterSense-labeled system would send about {x} gallons a year to the drain instead." (hide when WaterSense is selected).

Default render MUST show: $500; $300 to $700; $50; 1,460; 8,273; 5.7; $1,000; 6.8¢; WaterSense line 3,407.

**How to use (exact text):**
1. Choose the type of system and who will install it.
2. Enter your household. One gallon per person a day covers drinking and cooking for most homes.
3. Choose the efficiency. If the box shows a WaterSense label, choose that; if the maker lists a drain ratio, enter it.
4. Add your water rate to price the drain water, and tick any extras your kitchen needs.

**The formula (exact text):**
10-year cost = upfront cost + 10 × (filters + water sent to drain)

Water sent to drain = RO water × drain ratio. A system that's 15% efficient sends about 5.7 gallons to the drain for every gallon you drink. At the 30% WaterSense minimum, that falls to about 2.3 gallons.

*Example 1: under-sink with tank, plumber, family of 4, standard efficiency, water at $12 per 1,000 gallons.* Upfront is $300 to $700, typically $500. The family makes 1,460 gallons of RO water a year and sends 8,273 gallons to the drain, about $99 of water. With $50 of filters, that's $149 a year and $1,993 over 10 years, about 13.6¢ per gallon. A WaterSense-labeled system would send 3,407 gallons ($41) and total $1,409.

*Example 2: tankless with a 1:1 drain ratio, plumber, fridge line added.* Upfront is $525 to $1,080, typically about $803. With $50 of filters a year, 10 years costs about $1,303 (8.9¢ per gallon), before any water charge.

(Display rule: typical dollars are rounded to whole dollars, so $802.50 shows as $803 and the 10-year total as $1,303.)

**What this calculator doesn't cover:**
- Whole-house reverse osmosis. It's a different system: $1,000 to $4,800 installed per This Old House and Angi, or $4,800 to $8,000 per HomeGuide, plus pumps, storage and often a softener in front.
- Remineralization or UV add-on stages.
- Booster pumps for low water pressure (needed below about 40 to 45 psi).
- Bottled water you'd stop buying.

**Reference table 1: "Reverse osmosis cost by type"**
| Type | Unit only | Installed |
|---|---|---|
| Under-sink with tank | $150 to $350 | $300 to $700 |
| Tankless under-sink | $300 to $600 | $450 to $950 |
| Countertop | $200 to $700 | no install |
| Whole-house | n/a | $1,000 to $8,000 |
Caption: "HomeGuide (2025), Angi (2026), This Old House (2026). Sources disagree on whole-house RO; the range covers both."

**Reference table 2: "Filter schedule"**
| Stage | How often | Typical cost |
|---|---|---|
| Sediment and carbon pre-filters | every 6 to 12 months | about $30 a set |
| RO membrane | every 2 to 4 years | $30 to $100 |
| Carbon post-filter | every 12 months or with the membrane | included in most sets |
Caption: "APEC and Express Water filter pages (Oct 2026); Angi (2026)."

**Reference table 3: "Water sent to drain per gallon of RO water"**
| System | Efficiency | Gallons to drain |
|---|---|---|
| Typical older under-sink | 10 to 20% | about 4 to 9 |
| WaterSense labeled (tank) | 30% or better | 2.3 or less |
| High-efficiency tankless (maker claims) | 25 to 50% | about 1 to 3 |
Caption: "EPA WaterSense specification and supporting statement for RO systems (Nov 2024); maker figures vary, check the spec sheet."

**Tips (exact text):**
- Test your water first. RO is great for nitrate, arsenic, PFAS and dissolved solids, but you don't need it for chlorine taste alone; a carbon filter does that.
- Look for the WaterSense label. It means the system wastes less water and is certified to NSF/ANSI 58.
- Low water pressure slows output and raises waste. Below about 40 psi, ask about a booster pump.
- Buy filters as yearly sets. They're cheaper than single cartridges and easier to keep on schedule.
- If your countertop is stone, ask the installer to use the existing sprayer or soap hole for the RO faucet and skip drilling.

**FAQ (exact text):**
1. Q: How much does a reverse osmosis system cost? A: Most under-sink systems cost $150 to $350 for the unit and $300 to $700 installed. Tankless models cost $300 to $600, or $450 to $950 installed. Whole-house systems cost $1,000 to $8,000 installed depending on the source and system.
2. Q: How much does it cost to maintain a reverse osmosis system? A: About $50 to $100 a year for filters. Pre-filters are changed every 6 to 12 months and the membrane every 2 to 4 years.
3. Q: How much water does reverse osmosis waste? A: EPA says typical point-of-use systems run at 10 to 20% efficiency, which sends about 4 to 9 gallons to the drain for each gallon of filtered water. WaterSense-labeled systems must be at least 30% efficient, about 2.3 gallons or less.
4. Q: Is reverse osmosis worth it? A: If your water has nitrate, arsenic, lead, PFAS or high dissolved solids, it's one of the most effective home options. For a family of 4 it works out to roughly 7 to 14 cents per gallon over 10 years, including filters.
5. Q: Can I install a reverse osmosis system myself? A: Yes, most under-sink systems are made for DIY install with basic tools. A plumber typically charges $150 to $350 and more if you need a new drain line or a fridge line.
6. Q: Do I need whole-house reverse osmosis? A: Rarely. Most homes only need RO water for drinking and cooking, so an under-sink system is enough.

**Sources:** homeguide-ro, angi-ro, thisoldhouse-ro, forbes-ro, epa-ro-spec, epa-ro-statement, apec-ro-sets, apec-faq, ispring-f7, expresswater-ro-sets, expresswater-membrane, slabwise-quartz, filmtec-tw30.

**Tests (min 10):** default → 500 / 300–700 / 1460 / 8273 / 5.67 / 1000 / 6.8¢ / WaterSense 3407; WaterSense → 3407, no comparison line; rate 12 → water $99.28 → 10-yr 1993, 13.6¢; WaterSense + rate 12 → 1409, 9.6¢; tankless ratio 1 + fridge → 525–1080, typ 802.5, 10-yr 1302.5 (display $1,303), 8.9¢; countertop 2 people → 200–700, 450, 730 gal, 4137 drain, 950, 13.0¢; DIY tank → 150–350, 250, 750, 5.1¢; all extras on tank plumber → 725–1880; people empty → no NaN.

---

## 4. `/whole-house-water-filter-cost/`

- Title: `Whole House Water Filter Cost Calculator | HomeWaterMath`
- Meta: `Estimate whole house water filter cost by type: installed price, cartridge or media changes based on your household's water use, and a 10-year total.`
- Breadcrumbs: Home / Water filters / Whole house water filter cost
- Keywords: whole house water filter cost (1,300 / 25), whole house water filtration system cost (1,000 / 28), installation cost (720 / 21).
- Information gain: cost guides give type ranges only. This page ties cartridge and media changes to the household's gallons (cartridges rated about 100,000 gallons; carbon tanks 1,000,000 gallons or 10 years), so the running cost and replacement year fit the home.
- Related: `/reverse-osmosis-system-cost/`, `/water-softener-cost/`, `/well-pump-replacement-cost/`.

**Quick answer (exact text):**
A whole house water filter costs about $500 to $1,200 for a cartridge system and $800 to $1,500 for a carbon tank system on city water, and $1,000 to $4,000 for a well water system, installed. Adding UV costs $500 to $1,500 more. Cartridges cost about $75 to $150 a year for most families; carbon tanks need new media after about 1,000,000 gallons or 10 years.

**Inputs (defaults):**
- System: `Cartridge filters, sediment + carbon (city water)` / `Carbon tank (city water)` / `Well water system (iron, sulfur, sediment)` [Cartridge]
- Add UV disinfection: `No` / `Yes` [No]
- People [4]; Gallons per person per day [82] (helper: "EPA average for all home use.")

**Data:**
```
WHF_INSTALLED = { cartridge: [500, 1200], carbonTank: [800, 1500], well: [1000, 4000] }   // homeadvisor-wf (3-stage, activated carbon, well); bobvila-wf, waterfilterguru-wf (well)
UV_ADD = [500, 1500]          // homeadvisor-wf; bobvila-wf; waterfilterguru-wf
LABOR = [200, 600]            // homeguide-wf (for the "DIY saves" line)
CARTRIDGE_SET = 76.98         // expresswater sediment 4.5x20 $32.99 + carbon block $43.99
CARTRIDGE_GAL = 100_000       // expresswater; ispring-f4wgb22b (6-12 months or 100k gal)
SEDIMENT_ONLY = 32.99         // well systems: sediment pre-filter
CARBON_TANK_GAL = 1_000_000, CARBON_TANK_YEARS = 10, CARBON_TANK_MEDIA = 1898   // aquasana-rhino-media
UV_LAMP = 125.99              // aquasana-uv-lamp, every 12 months
GAL_PER_PERSON = 82           // epa-watersense-stats
```
**Formula (`lib/calc/wholeHouseFilterCost.ts`):**
```
gal        = people × galPerPerson × 365
upfront    = WHF_INSTALLED[type] (+ UV_ADD if UV); typical = mid
cartridge: sets = max(1, gal / 100000); yearly = sets × 76.98
carbonTank: yearly = 0; mediaYears = min(10, 1000000 / gal); media = (gal × 10 > 1000000) ? 1898 : 0
well:      yearly = max(1, gal / 100000) × 32.99   (media replacement not priced; see note)
UV:        yearly += 125.99
tenYear    = upfront.typical + 10 × yearly + media
```
**Outputs:** headline upfront typical `$850` with range `$500 to $1,200`; rows: Water through the filter `119,720` gallons a year; Cartridge sets `1.2` a year, `$92`; 10-year total `$1,772`; line "Installing it yourself saves the labor, usually $200 to $600." For carbon tank: "Media change due in year {mediaYears, 1 decimal}: $1,898." For well: note "Well systems also need media replaced every 5 to 12 years depending on type. Ask for the media price with your quote." For UV: "UV lamp: $126 a year."

Default render MUST show: $850; $500 to $1,200; 119,720; 1.2 sets; $92; $1,772; DIY line.

**How to use (exact text):**
1. Choose the type of system. Cartridge and carbon tank systems are for city water; well systems also handle iron, sulfur and sediment.
2. Add UV if your water comes from a well and has tested positive for bacteria, or if you want protection against it.
3. Enter your household. The calculator works out how fast you'll use up cartridges or media.

**The formula (exact text):**
10-year cost = installed price + 10 × yearly cartridges or lamps + any media change inside 10 years

Gallons per year = people × 82 gallons a day × 365. Cartridges are rated about 100,000 gallons or 12 months, whichever comes first. Carbon tanks are rated about 1,000,000 gallons or 10 years.

*Example 1: cartridge system, family of 4.* Installed price is $500 to $1,200, typically $850. The home runs 119,720 gallons a year through the filter, 1.2 cartridge sets at $76.98, about $92 a year. Over 10 years: $850 + $920 = $1,772 (exact: $1,771.60).

*Example 2: carbon tank, family of 4.* Installed price is $800 to $1,500, typically $1,150. No cartridges to buy, but the home reaches 1,000,000 gallons in year 8.4, so the media is replaced once for $1,898. Over 10 years: $3,048.

**What this calculator doesn't cover:**
- Water softening. A filter doesn't remove hardness; see our softener calculators.
- Drinking-water contaminants that need reverse osmosis, such as nitrate or high dissolved solids.
- Pipe extensions ($150 to $850), a new drain ($300 to $800), an outlet for UV ($150 to $350) or permits ($30 to $600), per HomeGuide and Bob Vila.
- Water testing ($50 to $300), which you should do first on a well.

**Reference table 1: "Whole house water filter cost by type (installed)"**
| Type | Installed cost | Yearly upkeep |
|---|---|---|
| Sediment + carbon cartridges | $500 to $1,200 | cartridges every 6 to 12 months |
| Carbon tank | $800 to $1,500 | media every 1,000,000 gal or 10 years |
| Well water (iron, sulfur) | $1,000 to $4,000 | pre-filter + media every 5 to 12 years |
| UV add-on | +$500 to $1,500 | lamp every 12 months |
Caption: "HomeAdvisor (2026), Bob Vila, Water Filter Guru (2024), HomeGuide (2025). Labor is usually $200 to $600 of the price."

**Reference table 2: "Replacement parts (examples, Oct 2026)"**
| Part | Rated life | Price |
|---|---|---|
| 4.5 x 20 in sediment cartridge | 100,000 gal or 6 to 12 months | $32.99 |
| 4.5 x 20 in carbon block cartridge | 100,000 gal or 6 to 12 months | $43.99 |
| Carbon tank replacement (1M gal) | 1,000,000 gal or 10 years | $1,898 |
| UV lamp | 12 months | $125.99 |
Caption: "Express Water and Aquasana product pages, checked Oct 21, 2026."

**Tips (exact text):**
- Test before you buy. Pick the filter for what's in your water, not the most stages.
- Put a sediment pre-filter first on any system. It protects the carbon and is the cheapest part to change.
- Change cartridges by date as well as gallons. A carbon cartridge left too long can grow bacteria.
- On a well, treat iron before a UV lamp or a carbon tank. Iron coats the UV sleeve and clogs carbon.
- Install a bypass valve so you can change cartridges and service the system without shutting off the house.

**FAQ (exact text):**
1. Q: How much does a whole house water filter cost? A: Most systems cost $500 to $1,500 installed for city water and $1,000 to $4,000 for well water. UV adds $500 to $1,500.
2. Q: How much does it cost to install a whole house water filter? A: Labor usually runs $200 to $600, more if the plumber needs to extend pipes, add a drain or install an outlet.
3. Q: How often do you change a whole house water filter? A: Cartridges every 6 to 12 months or about 100,000 gallons. Carbon tanks every 1,000,000 gallons or about 10 years. UV lamps every 12 months.
4. Q: How much does a whole house water filter cost per year? A: For a family of 4 on a cartridge system, about $92 a year for cartridges. Carbon tank systems cost little each year but need a media change worth about $1,900 after around 8 years for a family of 4.
5. Q: Is a whole house water filter worth it? A: If you want chlorine or chloramine taste and smell out of every tap and shower, or you're on a well with sediment, iron or sulfur, it usually is. For drinking water alone, an under-sink filter or RO system is cheaper.

**Sources:** homeadvisor-wf, homeguide-wf, angi-wf, bobvila-wf, waterfilterguru-wf, expresswater-sediment, expresswater-carbon, ispring-f4wgb22b, aquasana-rhino, aquasana-rhino-media, aquasana-uv-lamp, epa-watersense-stats.

**Tests (min 9):** default → 850 / 500–1200 / 119,720 / 1.2 / 92.16 / 1772; 2 people cartridge → 59,860 gal, 1 set (minimum), 76.98, 1620; 6 people → 1.8 sets, 138.24, 2232; carbon tank 4 → 1150, year 8.4, media 1898, 3048; carbon tank 2 → no media (year 10.0 not inside), 1150; well + UV 4 → 1500–5500, typ 3500, yearly 165.49, 10-yr 5155; people empty → no NaN.

---

## 5. `/water-softener-installation-cost/`

- Title: `Water Softener Installation Cost Calculator | HomeWaterMath`
- Meta: `Estimate water softener installation cost itemized: plumber labor, softener loop, drain, outlet, removal and permit. Check a quote against typical prices.`
- Breadcrumbs: Home / Water softeners / Water softener installation cost
- Keywords: cost to install water softener (2,900 / 14), water softener install cost (1,300 / 20), water softener replacement cost (1,600 / 13).
- Information gain: guides give one labor range. This page itemizes the parts that move the price (loop, drain, outlet, removal, permit) so the user can see why quotes differ. It covers labor only; the full system price is on `/water-softener-cost/` (link to it in the quick answer and the tips).
- Related: `/water-softener-cost/`, `/water-softener-size-calculator/`, `/water-softener-vs-salt-free-cost/`.
- Cannibalization guard: this page's H1, title and FAQ focus on installation labor and extras. Don't repeat the unit price tables from `/water-softener-cost/`; link to them.

**Quick answer (exact text):**
Installing a water softener usually costs $150 to $1,000 in labor, and most installs land between $500 and $700 when the home already has a softener loop. With no loop, adding one costs $200 to $2,000 more, and a new drain or outlet adds more again. The calculator below itemizes your install. For the softener itself, see our [water softener cost calculator](/water-softener-cost/).

**Inputs (defaults):**
- Your setup: `Replacing an old softener` / `Loop in place, no softener yet` / `No softener loop` [Replacing]
- Drain within reach (floor drain, laundry standpipe or sink): `Yes` / `No` [Yes]
- Outlet near the softener: `Yes` / `No` [Yes]
- Permit fee, $ [0] (helper: "Check your city. Examples: $37 in La Habra, CA; from $84 in St. Paul, MN.")
- Optional: "Quote you received ($)" [empty]

**Data:**
```
BASE_LABOR = [150, 1000], BASE_TYPICAL = 600   // thisoldhouse-cost ("most $500-$700"); fixr-cost; angi-install
REMOVAL = [50, 100]          // fixr-cost; homeguide-repair-softener
LOOP = [200, 2000], LOOP_TYPICAL = 900   // thisoldhouse-cost $200-$800; fixr-cost $600-$2,000; typical = mean of the two midpoints
DRAIN = [300, 800]           // homeguide-ro; homeguide-wf (new drain line)
OUTLET = [150, 300]          // homeguide-outlet
HOURS = [2, 4]               // angi-install; homeadvisor-install
PLUMBER_RATE = [45, 200]     // angi-plumber
```
**Formula (`lib/calc/softenerInstallCost.ts`):**
```
lines = [labor]
replace → + removal
no loop → + loop
drain No → + drain
outlet No → + outlet
total = sum (low, high, typical) + permit
quoteCheck as in A6.4
```
**Outputs:** headline typical `$675` with range `$200 to $1,100`; itemized rows; line "Most installs take 2 to 4 hours. At $45 to $200 an hour, that's $90 to $800 of time; the rest of a quote is parts, travel and setup." Quote check line.

Default render MUST show: $675; $200 to $1,100; rows Labor $150 to $1,000 and Removal of the old unit $50 to $100.

**How to use (exact text):**
1. Choose your setup. A softener loop is a pair of pipes, usually near the water heater or where the main line enters, that's already plumbed for a softener.
2. Say whether there's a drain and an outlet near the spot. The softener needs both.
3. Add your city's permit fee if one applies.
4. If you have a quote, enter it to see how it compares.

**The formula (exact text):**
Installation cost = labor + removal of an old unit + loop (if none) + drain (if needed) + outlet (if needed) + permit

The typical figures are $600 of labor, $75 for removal, $900 for a new loop, $550 for a drain line and $225 for an outlet.

*Example 1: no loop, drain and outlet in reach.* Labor is $150 to $1,000 and a new loop $200 to $2,000. The total is $350 to $3,000, typically about $1,500.

*Example 2: no loop, no drain, no outlet, $84 permit.* Labor $150 to $1,000, loop $200 to $2,000, drain $300 to $800, outlet $150 to $300, plus $84. The total is $884 to $4,184, typically about $2,359.

**What this calculator doesn't cover:**
- The softener itself and salt. See the water softener cost calculator.
- Moving the main water line, or installs outdoors (many installers won't install outdoors in freezing areas).
- Extra pipe beyond a short run, priced at $0.50 to $8 per foot by Angi.
- Water heater or fixture repairs found during the job.

**Reference table: "What changes an installation quote"**
| Item | Typical cost |
|---|---|
| Plumber labor, home with a loop | $150 to $1,000 (most $500 to $700) |
| New softener loop | $200 to $2,000 |
| New drain line | $300 to $800 |
| New 120 V outlet | $150 to $300 |
| Remove the old softener | $50 to $100 |
| Plumber hourly rate | $45 to $200 |
| Permit (where required) | about $35 to $100+ |
Caption: "This Old House (2026), Fixr (2025), Angi (2026), HomeGuide (2025); permit examples from La Habra, CA and St. Paul, MN."

**Tips (exact text):**
- Ask for an itemized quote: labor, loop work, drain, outlet, bypass valve and removal. Then compare line by line.
- A home built with a softener loop saves the biggest item on the list. Look for capped pipes near the water heater before you call.
- Keep the softener close to the drain and the outlet. Long runs add pipe and time.
- If you're installing it yourself, you'll need a bypass valve and fittings; an install kit runs about $175 at Home Depot.
- Size the softener before you book the plumber. The connection size and tank height change the install.

**FAQ (exact text):**
1. Q: How much does it cost to install a water softener? A: Labor usually runs $150 to $1,000, and most installs land between $500 and $700 when the home has a softener loop. Replacing an old unit adds about $50 to $100 for removal.
2. Q: How much does it cost to add a water softener loop? A: About $200 to $2,000. This Old House puts it at $200 to $800, and Fixr at $600 to $2,000 when more pipe has to be run.
3. Q: How long does it take to install a water softener? A: Usually 2 to 4 hours for a home with a loop. Adding a loop, drain or outlet takes longer.
4. Q: Do you need a permit to install a water softener? A: It depends on your city. Many treat it as a plumbing permit; examples range from about $37 in La Habra, California to $84 or more in St. Paul, Minnesota.
5. Q: Can I install a water softener myself? A: If your home has a loop, a drain and an outlet nearby, many homeowners do. You'll need a bypass valve and fittings, about $175 for an install kit. Without a loop, it's a plumbing job.

**Sources:** thisoldhouse-cost, fixr-cost, angi-install, homeadvisor-install, homeguide-cost, homeguide-repair-softener, homeguide-ro, homeguide-wf, homeguide-outlet, angi-plumber, lahabra-permit, stpaul-permit, hd-pentair-kit.

**Tests (min 8):** default → 675 / 200–1100; loop no softener → 600 / 150–1000; no loop → 1500 / 350–3000; no loop + no drain + no outlet + 84 → 2359 / 884–4184; no loop + no drain → 2050 / 650–3800; quote 1,500 default → above; quote 150 → below; empty permit → 0.

---

## 6. `/water-filters/` hub

- Title: `Water Filter Cost Calculators | HomeWaterMath`
- Meta: `Calculators for home water filters: reverse osmosis and whole house filter cost, including filters, media changes and water use over 10 years.`
- H1: `Water filter calculators`
- Intro (exact):
  A filter removes things from your water; a softener removes hardness. Which filter you need depends on what's in your water, so start with a test from a certified lab or your utility's yearly water quality report.

  The calculators here price the two most common choices: an under-sink reverse osmosis system for drinking water, and a whole house filter for every tap. Both include the running costs that make up much of the real price: cartridges, media changes and, for reverse osmosis, the water sent to the drain.
- Table "Which calculator do I need?": drinking and cooking water only → Reverse osmosis system cost; chlorine taste and smell at every tap → Whole house water filter cost; well water with sediment, iron or sulfur → Whole house water filter cost; hard water and scale → Water softener cost.
- Tiles: RO cost, whole house filter cost, softener cost (cross-link).
- Hub FAQ:
  1. Q: What's the difference between a water filter and a water softener? A: A softener swaps hardness minerals for sodium or potassium so scale doesn't form. A filter removes other things, such as sediment, chlorine, lead or bacteria, depending on its type. Many homes on hard water use both.
  2. Q: Do I need a whole house filter or an under-sink filter? A: If the problem is taste, smell or sediment at every tap, a whole house filter. If you only want cleaner drinking and cooking water, an under-sink filter or reverse osmosis system is cheaper.
  3. Q: Should I test my water before buying a filter? A: Yes. On city water, read your utility's annual water quality report. On a well, test at least once a year with a certified lab.

## 7. Changes to existing pages

1. Registry: add category `filters` with hub `/water-filters/`.
2. Header nav: "Water softeners", "Well water", "Water filters", "How we calculate", "About". Mobile sheet the same.
3. Footer "Calculators" column: list all 10 calculators.
4. Homepage:
   - "Water softeners" band: keep 4 tiles (size, cost, salt, hardness); "View all" now shows 6 on the hub.
   - "Well water" band: 4 tiles in this order: pressure tank, well pump replacement cost, size calculator, hardness converter.
   - New band "Water filters" (band-3 stone) after Well water: intro "Drinking water or every tap? Price a reverse osmosis system or a whole house filter, filters included." + 2 tiles (RO, whole house) + "View all" → `/water-filters/`.
   - Chips under the search: add "Well pump cost" and "RO cost" (keep max 2 lines on mobile; drop "Hardness converter" chip if it would wrap to a 3rd line).
   - Latest updates: new pages appear automatically from the registry.
5. `/water-softeners/` hub: add tiles and table rows for installation cost and salt vs salt-free. Table rows: "what installation will cost" → Water softener installation cost; "salt or salt-free" → Salt vs salt-free cost.
6. `/well-water/` hub: add the pump tile and table row "pump replacement cost" → Well pump replacement cost. Update the meta to mention pump costs: `Calculators for private well owners: pressure tank sizing and well pump replacement cost, plus water hardness and softener sizing for well water.`
7. `/water-softener-cost/`: in "What this calculator doesn't cover", change the first bullet to: "Plumbing changes when your home has no softener loop, long pipe runs or needs a new drain or outlet. Our [installation cost calculator](/water-softener-installation-cost/) itemizes these." Change the salt-free FAQ answer's last sentence to: "They also don't remove hardness minerals, so they aren't a direct swap for a softener. [Compare the 10-year cost](/water-softener-vs-salt-free-cost/)." Don't change `lastUpdated` beyond today's date on that page.
8. `/well-pressure-tank-size-calculator/`: add `/well-pump-replacement-cost/` to Related (replace the weakest current related card).
9. `/how-we-calculate/`: add one H2 per new calculator with its formula lines and constants table (generated from `constants.ts`).
10. Contact form (Web3Forms): the owner reports the key is shared with another site of theirs, so add hidden fields `subject` = "New message from HomeWaterMath" and `from_name` = "HomeWaterMath contact form" so messages can be told apart in the shared inbox. Keep the honeypot. The form still renders only when `NEXT_PUBLIC_WEB3FORMS_KEY` is set at build time.

## 8. New sources (add to `sources.ts`, accessed 2026-10-21 unless noted)

- homeguide-pump: HomeGuide, Well Pump Cost (2025-08-07): https://homeguide.com/costs/well-pump-cost
- homeguide-repair: HomeGuide, Well Pump Repair Cost (2025-08-06): https://homeguide.com/costs/well-pump-repair-cost
- forbes-pump: Forbes Home, Well Pump Installation and Replacement Cost (2025-02-10): https://www.forbes.com/home-improvement/plumbing/well-pump-installation-replacement-cost/
- homeadvisor-pump: HomeAdvisor, Cost to Replace a Well Pump (2026-06-17): https://www.homeadvisor.com/cost/plumbing/replace-a-well-pump
- homeadvisor-repair: HomeAdvisor, Well Pump Repair Cost (2026-06-19): https://www.homeadvisor.com/cost/plumbing/repair-a-well-pump/
- angi-pump: Angi, Well Pump Replacement Cost (2026-08-31): https://www.angi.com/articles/how-much-does-well-pump-replacement-cost.htm
- consumeraffairs-pump: ConsumerAffairs, Cost to Replace a Well Pump (2026-05-11): https://www.consumeraffairs.com/homeowners/cost-to-replace-well-pump.html
- ahs-pump: American Home Shield, Cost to Replace a Well Pump (2026-02-06): https://www.ahs.com/home-matters/repair-maintenance/what-is-the-cost-to-replace-a-well-pump/
- thisoldhouse-pump: This Old House, Well Pump Cost (2026-03-05): https://thisoldhouse.com/plumbing/reviews/well-pump-cost
- hd-poly-pipe: Home Depot, 1-1/4 in x 100 ft 160 psi poly pipe: https://www.homedepot.com/p/Advanced-Drainage-Systems-1-1-4-in-x-100-ft-IPS-160-psi-NSF-Poly-Pipe-X2-125160100/205903466
- supplyhouse-poly-pipe: SupplyHouse, Oil Creek 1-1/4 in Aqua Jet poly pipe, 100 ft: https://www.supplyhouse.com/Oil-Creek-AJ1612100-1-1-4-Black-Aqua-Jet-Poly-Pipe-PE-4710-160-PSI-100-ft-Coil
- nassau-103-wire: Nassau National Cable, 10/3 flat submersible pump cable: https://nassaunationalcable.com/collections/flat-yellow-with-ground-submersible-pump-cable/products/10-3-flat-yellow-with-ground-submersible-pump-cable
- backwoods-103-wire: Backwoods Solar, 10/3 flat submersible pump cable: https://backwoodssolar.com/products/10-3-flat-submersible-pump-cable
- hd-everbilt-pumps: Home Depot, Everbilt submersible well pumps (EFSUB5-123HD, EFSUB7-122HD, EFSUB10-122HD): https://www.homedepot.com/p/Everbilt-3-4-HP-Submersible-2-Wire-Motor-10-GPM-Deep-Well-Potable-Water-Pump-EFSUB7-122HD/205618055
- hd-ecoflo-15: Home Depot, ECO-FLO 1-1/2 HP submersible EFSUB15-123: https://homedepot.com/p/ECO-FLO-1-1-2-HP-4-in-3-Wire-Submersible-Well-Pump-EFSUB15-123/207063131
- homeguide-tank: HomeGuide, Cost to Replace a Well Pressure Tank (2025-07-25): https://homeguide.com/costs/cost-to-replace-well-pressure-tank
- forbes-tank: Forbes Home, Well Pressure Tank Cost (2025-02-10): https://www.forbes.com/home-improvement/plumbing/well-pressure-tank-cost/
- psu-water-needs: Penn State Extension, Water System Planning: Estimating Water Needs (2025-05-29): https://extension.psu.edu/water-system-planning-estimating-water-needs
- goulds-residential: Goulds Pumps, Residential Water Systems guide (hosted by Pump Fundamentals): https://pumpfundamentals.com/goulds%20residential%20pump%20guide.pdf
- thumbtack-pump: Thumbtack, Water Pump Replacement Cost: https://thumbtack.com/p/water-pump-replacement-cost
- wrrf-08-06: WateReuse Research Foundation, Project 08-06, Evaluation of Alternatives to Domestic Ion Exchange Water Softeners (2014): https://watereuse.org/watereuse-research/08-06-evaluation-of-alternatives-to-domestic-ion-exchange-water-softeners/
- wrrf-08-06-report: Full report PDF (Fox, Wiest, Thomure, Lee, 2014): https://waterboards.ca.gov/water_issues/programs/grants_loans/water_recycling/research/ion_exchange_water_softeners.pdf
- wcp-z601-2014: WC&P, New Standard for Evaluation of Scale Control Equipment (2014-10-14): https://wcponline.com/2014/10/14/new-standard-evaluation-scale-control-equipment/
- epa-trm-softeners: EPA WaterSense, Water Softeners tech sheet (2023): https://www.epa.gov/system/files/documents/2023-08/ws-homes-TRM-9-WaterSoftenersTechSheet.pdf
- epa-watersense-softener-2026: EPA WaterSense, Water Softener fact sheet (2026-05): https://www.epa.gov/system/files/documents/2026-05/ws-products-water-softener-factsheet.pdf
- watts-oneflow: Watts OneFlow engineering specification: https://watts.ca/dfsmedia/0533dbba17714b1ab581ab07a4cbb521/12457-source/es-of744-844-948-1054-1252
- springwell-futuresoft: SpringWell, Salt-free water softeners: https://www.springwellwater.com/product/water-softeners/salt-free-water-softeners/
- springwell-fs-manual: SpringWell FutureSoft installation manual (2019): https://www.springwellwater.com/wp-content/uploads/2019/01/Installation-Manual-FS-SaltFreeSoftener-v1.pdf
- aquasana-simplysoft: Aquasana, Whole House Salt-Free Water Conditioner: https://www.aquasana.com/salt-free-water-softeners/whole-house-simplysoft
- aquasana-simplysoft-media: Aquasana, SimplySoft tank replacement: https://www.aquasana.com/water-filter-replacements/whole-house-salt-free-conditioner-replacements/simplysoft-tank-replacement-100237306.html
- waterfilterguru-futuresoft: Water Filter Guru, SpringWell FutureSoft review (2024-07-05): https://waterfilterguru.com/springwell-futuresoft-salt-free-water-softener-review/
- pentair-autotrol-368: Pentair Autotrol 368 spec sheet: https://www.pentair.com/content/dam/extranet/web/nam/autotrol/spec-sheets/4002013-auotrol-368-spec-sheet.pdf
- wateronline-scv-2011: Water Online, Santa Clarita Valley Sanitation District (2011-08-08): https://www.wateronline.com/doc/santa-clarita-valley-sanitation-district-0001
- homeguide-ro: HomeGuide, Reverse Osmosis System Cost (2025-07-14): https://homeguide.com/costs/reverse-osmosis-system-cost
- angi-ro: Angi, Reverse Osmosis Water Filter Cost (2026-09-24): https://www.angi.com/articles/reverse-osmosis-water-filter-cost.htm
- thisoldhouse-ro: This Old House, Reverse Osmosis System Cost (2026-03-30): https://thisoldhouse.com/plumbing/reverse-osmosis-system-cost
- forbes-ro: Forbes Home, Reverse Osmosis System Cost (2025-02-10): https://www.forbes.com/home-improvement/home/reverse-osmosis-system-cost/
- epa-ro-spec: EPA WaterSense, Specification for Point-of-Use Reverse Osmosis Systems (2024-11): https://www.epa.gov/system/files/documents/2024-11/ws-products-watersense-ro-systems-specification.pdf
- epa-ro-statement: EPA WaterSense, RO Systems Specification Supporting Statement (2024-11): https://www.epa.gov/system/files/documents/2024-11/ws-products-ro-systems-spec-supporting-statement_508.pdf
- apec-ro-sets: APEC, Reverse osmosis filter sets: https://apecwater.com/collections/reverse-osmosis-filter-sets
- apec-faq: APEC, FAQ: https://apecwater.com/pages/faq
- ispring-f7: iSpring, F7-GAC 1-year filter set: https://ispringfilter.com/products/ispring-7pk-gac-f7-gac-filter-replacement-supply-set-for-5-stage-reverse-osmosis-ro-water-filtration-systems-1-year-supply
- expresswater-ro-sets: Express Water, RO system filter sets: https://expresswater.com/collections/ro-system-filter-sets
- expresswater-membrane: Express Water, RO membrane: https://expresswater.com/products/reverse-osmosis-membrane
- slabwise-quartz: Slabwise, Cost to Drill a Hole in a Quartz Countertop (2026-07-09): https://slabwise.com/guides/cost-to-drill-hole-in-quartz-countertop
- filmtec-tw30: DuPont FilmTec TW30-1812 datasheet: https://assets.freshwatersystems.com/images/pletrmmgex9lv8cki2o1/TW30-1812-50.pdf
- homeadvisor-wf: HomeAdvisor, Water Treatment and Purification System Cost (2026-06-19): https://www.homeadvisor.com/cost/environmental-safety/install-a-water-treatment-and-purification-system/
- homeguide-wf: HomeGuide, Water Filtration System Cost (2025-09-17): https://homeguide.com/costs/water-filtration-system-cost
- angi-wf: Angi, Whole House Water Filtration System Cost (2026-09-24): https://www.angi.com/articles/whole-house-water-filtration-system-cost.htm
- bobvila-wf: Bob Vila, Home Water Filtration System Cost (2022-08-16): https://www.bobvila.com/articles/home-water-filtration-system-cost/
- waterfilterguru-wf: Water Filter Guru, Whole Home Water Filtration System Cost (2024-07-05): https://waterfilterguru.com/whole-home-water-filtration-system-cost/
- expresswater-sediment: Express Water, 4.5 x 20 sediment filter: https://expresswater.com/products/sediment-whole-house-filter
- expresswater-carbon: Express Water, 4.5 x 20 activated carbon block: https://expresswater.com/products/activated-carbon-block-whole-house
- ispring-f4wgb22b: Home Depot, iSpring F4WGB22B cartridge set: https://www.homedepot.com/p/303694421
- aquasana-rhino: Aquasana, Whole house water filters: https://www.aquasana.com/whole-house-water-filters/
- aquasana-rhino-media: Aquasana, Rhino 1,000,000 gallon tank replacement: https://www.aquasana.com/water-filter-replacements/whole-house-water-filter-replacements/rhino-1-million-gallons-tank-replacement-100237131.html
- aquasana-uv-lamp: Aquasana, UV lamp replacement: https://www.aquasana.com/water-filter-replacements/uv-lamp-replacement-100236803.html
- angi-install: Angi, Water Softener Installation Cost (2026-08-03): https://www.angi.com/articles/how-much-does-water-softener-installation-cost.htm
- homeadvisor-install: HomeAdvisor, Water Softener Installation Cost (2026-06-17): https://www.homeadvisor.com/cost/kitchens/water-softener-installation-costs/
- homeguide-repair-softener: HomeGuide, Water Softener Repair Cost: https://homeguide.com/costs/water-softener-repair-cost
- homeguide-outlet: HomeGuide, Cost to Install an Electrical Outlet (2025-08-29): https://homeguide.com/costs/cost-to-install-electrical-outlet
- angi-plumber: Angi, Plumber Cost (2026-10-14): https://www.angi.com/articles/plumber-cost.htm
- lahabra-permit: City of La Habra, Plumbing Permit Fees FY 2025-2026: https://lahabraca.gov/DocumentCenter/View/15573/Plumbing-Permit-Fees-FY-2025-2026
- stpaul-permit: City of St. Paul, Plumbing permit application: https://www.stpaul.gov/sites/default/files/Media%20Root/Safety%20%26%20Inspections/dsi.plumbingpermitapplication.pdf

Before publishing, the coding agent must open every URL in this section once (a simple HEAD/GET check in a script is fine) and list any that don't return 200 in the report. Don't remove a source on its own; report it and the browser agent will replace it.

## 9. Definition of done (this batch)

- All 5 tools render their "Default render MUST show" values in the static HTML.
- Every test listed passes; total test count reported.
- The 6 new URLs are in the registry, sitemap, homepage/hubs as described, and IndexNow submits them on push.
- Every new page passes the same checks as launch: schema valid, FAQ text equals schema, no horizontal scroll at 360/390/768/1280, PageSpeed mobile ≥ 90 for tools, CLS 0.
- Report: commit hash, tests passed/total, URL check results from section 8, screenshots of each new tool at 390 px and the homepage at 1440 px, and anything you couldn't do.

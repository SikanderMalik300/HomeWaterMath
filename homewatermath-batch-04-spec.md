# HomeWaterMath batch 04 spec: 1 calculator + 4 guides

Date: 2026-10-25. Written by: browser agent. For: the coding agent.
Keyword data: Semrush US (self-hosted instance), pulled 2026-10-25. All rules from the main spec, batch 03 (GuideLayout, Article schema) and fix 04 (WebPage + Person + dates, table captions, title 30–60 / description 110–160, no em dashes) apply. `publishedDate` and `lastUpdated` 2026-10-25 for all five.

| # | URL | Type | H1 | Hub | Main keywords (US vol / KD) | Photo slot |
|---|---|---|---|---|---|---|
| 1 | `/water-softener-settings/` | tool (A5 layout) | Water Softener Settings Calculator | softeners | water softener settings 1,000 / 10; how often should a water softener regenerate 1,000 / 4; water softener regeneration 1,000 / 18; water softener hardness setting 320 / 20; how to set water softener 170 / 18 | `tool-softener-settings` |
| 2 | `/water-softener-cleaner/` | guide | Water Softener Cleaner: How Much to Use and How Often | softeners | water softener cleaner 6,600 / 15; water softener resin cleaner 1,600 / 28; how to clean water softener 720 / 20; how to clean water softener resin tank 90 / 7 | `guide-softener-cleaner` |
| 3 | `/tds-meter-chart/` | guide | TDS Meter Chart: What Your Reading Means | filters | tds meter 9,900 / 26; tds water tester 1,600 / 16; tds levels in water 140 / 24; tds chart 110 / 16 | `guide-tds` |
| 4 | `/hard-water-vs-soft-water/` | guide | Hard Water vs Soft Water: What Actually Changes | softeners | hard water vs soft water 4,400 / 22; soft water vs hard water 1,300 / 27 | `guide-hard-vs-soft` |
| 5 | `/can-you-drink-softened-water/` | guide | Can You Drink Softened Water? | softeners | can you drink softened water 1,000 / 11; is softened water safe to drink 590 / 10; sodium in softened water 40 / 22 | `guide-drink-softened` |

Photos: you pick (photo rules unchanged; if nothing fits, mist square). Ideas: 1 a softener control valve display or hands adjusting a dial without a brand; 2 a measuring cup pouring clear liquid; 3 a hand holding a pen-style TDS meter in a glass of water (no brand legible); 4 soap lather in hands, or spotted vs clean glassware; 5 a glass of water on a kitchen counter (not the hero or well-test shots).

---

## 1. `/water-softener-settings/` (calculator)

- Title: `Water Softener Settings Calculator | HomeWaterMath` (50)
- Meta: `Work out what to enter on your water softener: hardness setting with iron, capacity, reserve, days between regenerations and salt per regeneration.` (147)
- Related: `/water-softener-size-calculator/`, `/water-softener-salt-calculator/`, `/water-softener-not-working/`.
- Information gain: top results are vendor pages telling you to "set it to your hardness". This page gives every number a metered or timer valve asks for, from the household, the iron and the real capacity at the chosen salt setting, and shows the math.

**Quick answer (exact):**
Set the hardness to your water's hardness in grains per gallon, plus 4 gpg for every ppm of iron. For a family of 4 with 15 gpg water and a 48,000-grain softener at a 9 lb salt setting, that's a hardness setting of 15, a capacity of 37,500 grains, a reserve of about 300 gallons and a regeneration about every 7 to 8 days. The calculator below works it out for your home.

**Inputs (defaults):**
- People [4]; Water use per person per day `60 gal` / `75 gal` / `80 gal` [75] (same control as the size calculator)
- Hardness [15] + unit [gpg] (reuse unit control); Iron, ppm [0]; Iron allowance `4 gpg per ppm` / `5 gpg per ppm` [4]
- Softener size `24,000` / `32,000` / `48,000` / `64,000` / `80,000` / `96,000` grains [48,000] (maps to cu ft per `SIZES`)
- Salt setting `6` / `9` / `12` / `15` lb per cu ft [9]
- Valve type `Metered (demand)` / `Timer (set days)` [Metered]

**Formula (`lib/calc/softenerSettings.ts`, reuse constants):**
```
hardnessSetting = ceilCount(hardnessGpg + ironPpm × ironAllowance)      // whole gpg, round up
capacity        = cuFt × CAPACITY_PER_CUFT[saltSetting]                // grains, the number to enter as capacity
gallonsBetween  = capacity / hardnessSetting
dailyGallons    = people × galPerPerson
reserve         = min(dailyGallons, gallonsBetween / 2)                // one day of water; Fleck caps reserve at half of capacity
usableGallons   = gallonsBetween − reserve
dayOverride     = clamp(floor(usableGallons / dailyGallons), 1, 14)     // metered: max days between regenerations
timerDays       = clamp(floor(capacity / (dailyGallons × hardnessSetting)), 1, 14)
saltPerRegen    = cuFt × saltSetting
```
Warnings:
- timerDays < 3 (or dayOverride < 3): "This softener is small for your home at this salt setting. It would regenerate every {n} days or more often. Check the [size calculator](/water-softener-size-calculator/) or raise the salt setting."
- iron > 2: reuse the launch iron warning (iron filter).
- floor(...) hits 14: note "Many makers recommend regenerating at least every 14 days, so we cap it there."

**Outputs (metered):** headline `Hardness setting: 15 gpg`; rows: Capacity to enter `37,500 grains`; Gallons between regenerations `2,500`; Reserve `300 gallons (one day of water)`; Regenerates about every `7` days (day override); Salt per regeneration `13.5 lb`. A small panel "Where these go on common valves" (exact text): "Fleck 5600SXT: Feed Water Hardness, System Capacity, Reserve (gallons) and Day Override. Clack WS1: Hardness and Capacity in the installer settings. Many big-box softeners (Whirlpool, GE, Morton) ask only for hardness; enter the hardness setting above."
**Outputs (timer):** headline `Regenerate every 8 days`; rows: Hardness setting 15 gpg; Capacity 37,500 grains; Salt per regeneration 13.5 lb.

Default render MUST show (metered): 15 gpg; 37,500 grains; 2,500 gallons; 300 gallons; 7 days; 13.5 lb.

**How to use (exact):**
1. Enter your household and water use. 75 gallons per person a day is the usual sizing figure.
2. Enter your hardness from a test, plus any iron.
3. Choose your softener's size (on the label or manual) and the salt setting you plan to run.
4. Choose your valve type. Metered valves measure water and regenerate when the capacity runs low; timer valves regenerate on a set schedule.
5. Enter the results on your softener's control. Your manual shows where each one goes.

**The formula (exact):**
Hardness setting = hardness in gpg + (iron in ppm × 4), rounded up

Capacity = cubic feet of resin × grains per cubic foot at your salt setting (20,000 at 6 lb, 25,000 at 9 lb, 27,500 at 12 lb, 30,000 at 15 lb)

Gallons between regenerations = capacity ÷ hardness setting. A metered valve keeps about one day of water in reserve, so it regenerates when the remaining gallons drop to that reserve.

*Example 1: family of 4, 15 gpg, no iron, 48,000-grain softener at 9 lb, metered.* Hardness setting 15. The 1.5 cubic feet of resin hold 37,500 grains at 9 lb, so the softener treats 2,500 gallons between regenerations. The home uses 300 gallons a day, so the reserve is 300 gallons and the softener regenerates about every 7 days, using 13.5 lb of salt each time.

*Example 2: couple, 10 gpg, 1 ppm iron, 24,000-grain softener at 6 lb, timer.* Hardness setting 10 + 4 = 14. Capacity is 0.75 × 20,000 = 15,000 grains. The home uses 150 gallons × 14 gpg = 2,100 grains a day, so set the timer to every 7 days. Each regeneration uses 4.5 lb of salt.

**What this calculator doesn't cover:**
- Brine draw, backwash and rinse times. Leave these at your valve's defaults unless your installer changes them.
- Manganese, which some makers ask you to add to the hardness as well.
- Twin-tank softeners, which don't need a reserve.
- Softeners that learn your water use automatically.

**Reference table: "Capacity by size and salt setting (grains)"** (generated from `SIZES` × `CAPACITY_PER_CUFT`, 6 sizes × 4 settings), caption required.

**Tips (exact):**
- Test your hardness again after moving or if your water source changes, and update the setting.
- If you still get hard water just before regeneration, raise the reserve, not the hardness setting.
- Use a lower salt setting with more frequent regenerations to save salt; the [salt calculator](/water-softener-salt-calculator/) shows the difference.
- Reset the clock after a power cut longer than about 8 hours, or the softener regenerates at the wrong time.

**FAQ (exact):**
1. Q: What number should I set my water softener to? A: Your water's hardness in grains per gallon, plus 4 gpg for each ppm of iron. If your test is in mg/L or ppm, divide by 17.1 to get gpg.
2. Q: How often should a water softener regenerate? A: Usually every 3 to 14 days, depending on the softener's capacity, your hardness and your water use. A family of 4 with 15 gpg water and a 48,000-grain softener at a 9 lb salt setting regenerates about every 7 days.
3. Q: Should I set my softener hardness higher than my water test? A: Only to account for iron, about 4 gpg per ppm. Setting it much higher wastes salt and water.
4. Q: What is the reserve setting on a water softener? A: The gallons the softener keeps in reserve before it regenerates, so you don't run out of soft water. About one day of household water use is typical.
5. Q: What capacity should I enter? A: The grains your softener actually holds at your salt setting, not the number on the label. A 48,000-grain softener holds about 37,500 grains at 9 lb of salt per cubic foot.

**Sources:** fleck-5600sxt-manual, clack-ws1-manual, whirlpool-manual, aosmith-lowes-manual, nelsen-sizing, csi-manual, aosmith-c43, wcp-slovak-2004 (all existing).

**Tests (min 10):** default → 15 / 37,500 / 2,500 / 300 / 7 / 13.5; timer default → 8 days; example 2 → hardness 14, capacity 15,000, timer 7, salt 4.5; 5 people 20 gpg 80,000 @9 → hardness 20, capacity 62,500, 3,125 gal, reserve 375, day override 7; 6 people 25 gpg 2 ppm iron allowance 5, 64,000 @12 → hardness 35, capacity 55,000, day override 2 → small-softener warning; 1 person 8 gpg 48,000 @9 → day override capped 14 + cap note; mg/L input 256.8 → 15 gpg; reserve never above half the gallons; empty people → no NaN.

---

## 2. `/water-softener-cleaner/` (guide)

- Title: `Water Softener Cleaner: Dose and How Often | HomeWaterMath` (58)
- Meta: `How much water softener cleaner to use for your resin, how often, and which kind: label doses for Res Care, Res-Up and Iron OUT, with a dose calculator.` (152)
- Related: `/water-softener-not-working/`, `/iron-filter-for-well-water/`, `/water-softener-settings/`.

**Quick answer (exact):**
Most liquid resin cleaners use about 4 ounces per cubic foot of resin for a first, deep clean, then about ½ to 1 ounce per cubic foot before each regeneration if your water has iron. Pour it into the brine well, not on top of the salt, and start a regeneration. A typical 48,000-grain softener has 1.5 cubic feet of resin, so a first clean takes about 6 ounces.

**Widget: dose calculator (`lib/guides/cleanerDose.ts`)**
Inputs: Product `Res Care (liquid)` / `Res-Up (liquid)` / `Iron OUT (powder)` / `OUT Filter Mate Heavy Duty (liquid)` [Res Care]; Softener size (grains → cu ft, same list as settings) [48,000]; Dose `First (deep) clean` / `Maintenance (each regeneration)` [First]; Regenerations per year [44] (helper: "From the salt calculator; about 44 for a family of 4 at 15 gpg").
Data (label doses):
```
resCare:   first 4 oz/cuft; maintenance 0.5 oz/cuft per regen          // pro-res-care-label
resUp:     first 3–4 oz/cuft (use 4); maintenance 0.5–1 oz/cuft (use 0.5, show range)   // resup-instructions
ironOut:   first 1 cup dissolved in ½ gal cold water (per treatment, not per cu ft); maintenance ¼ cup per 40 lb of salt   // ironout-summit
filterMate: first 4 oz/cuft; maintenance 1–2 oz/cuft (use 1, show range)   // outfiltermate-summit
```
Outputs: First clean: `{oz} oz ({cups} cups)`; Maintenance: `{oz} oz per regeneration`, `{oz × regens} oz a year`, and "A 1-gallon bottle lasts about {128 / yearOz, 1 decimal} years at this rate" (liquids). Iron OUT maintenance: "¼ cup with every 40 lb bag of salt" (no per-regeneration math).
Default render MUST show: Res Care, 1.5 cu ft, first clean 6 oz (¾ cup). Maintenance check for the same softener: 0.75 oz per regeneration, 33 oz a year, a gallon lasts about 3.9 years.
Show 1 cup = 8 oz in the output.

**Body (exact):**

H2 "When a softener needs cleaner"
Resin cleaner removes iron, manganese and other fouling that salt alone can't. If your water has iron, if softened water turns slightly hard before the next regeneration, or if water pressure has dropped, a cleaning often helps. On city water with no iron, many softeners never need it.

H2 "How to clean a water softener"
1. Check the label. Some cleaners aren't for every resin type; Pro Res Care, for example, isn't for gel zeolite.
2. Find the brine well, the round tube inside the salt tank, and pour the measured cleaner into it.
3. Start a manual regeneration. The cleaner is drawn through the resin with the brine and rinsed to the drain.
4. For ongoing iron, add the maintenance dose before each regeneration, or use a cleaner feeder.

H2 "Cleaners compared"
| Cleaner | Type | First clean | Maintenance | Price | NSF |
|---|---|---|---|---|---|
| Res Care | Liquid | 4 oz per cu ft | ½ oz per cu ft per regeneration | about $21 a gallon | NSF/ANSI/CAN 60 |
| Res-Up | Liquid | 3 to 4 oz per cu ft | ½ to 1 oz per cu ft per regeneration | about $32 a gallon | not stated |
| Iron OUT | Powder | 1 cup in ½ gal water | ¼ cup per 40 lb of salt | varies | not stated |
| OUT Filter Mate HD | Liquid | 4 oz per cu ft | 1 to 2 oz per cu ft per regeneration | varies | maker says NSF certified |
Caption: "Manufacturer labels and listings, checked Oct 2026 (Pro Products, Res-Up form 1677, Summit Brands, Nelsen, Fresh Water Systems, WECO)."

H2 "Sanitizing with bleach"
Cleaner isn't the same as sanitizing. If a manual tells you to sanitize, for example after a long shutdown, GE's manual uses about ¾ ounce (1½ tablespoons) of 5.25% household bleach poured into the brine well, followed by a regeneration. Follow your own manual's amount.

H2 "Iron above 3 ppm"
Cleaners keep resin clean when iron is low. Above about 3 ppm, the University of Minnesota advises a separate iron filter; see our [iron filter guide](/iron-filter-for-well-water/).

**FAQ (exact):**
1. Q: How much water softener cleaner should I use? A: For most liquid cleaners, about 4 ounces per cubic foot of resin for a first clean, then about ½ to 1 ounce per cubic foot before each regeneration if your water has iron.
2. Q: How often should I clean my water softener? A: Only when needed on city water. With iron, use a maintenance dose before each regeneration, or a full clean every few months; Whirlpool's warranty, for example, asks for one bottle of its cleaner every 4 months.
3. Q: Where do I put water softener cleaner? A: In the brine well, the tube inside the salt tank, then start a regeneration.
4. Q: Can I use Iron OUT in my water softener? A: Yes. The maker's directions are 1 cup dissolved in ½ gallon of cold water poured into the brine well, then a regeneration, and ¼ cup per 40 lb of salt for maintenance.
5. Q: Is water softener cleaner safe for drinking water? A: Use a product certified to NSF/ANSI/CAN Standard 60, such as Res Care, and rinse it out with a full regeneration before drinking the water.

**Sources:** pro-res-care-label, nelsen-rescare, fws-rescare, resup-instructions, weco-resup, ironout-summit, ironout-sds, outfiltermate-summit, whirlpool-whes48-warranty (existing), fleck-5600sxt-manual (existing), ge-gxsf27b-manual, umn-softening (existing).

---

## 3. `/tds-meter-chart/` (guide)

- Title: `TDS Meter Chart: What Your Reading Means | HomeWaterMath` (56)
- Meta: `What your TDS meter reading means for drinking water: the EPA 500 mg/L guideline, taste bands, what TDS can't tell you, and how to check an RO system.` (150)
- Related: `/reverse-osmosis-system-cost/`, `/water-hardness-converter/`, `/whole-house-water-filter-cost/`.

**Quick answer (exact):**
A TDS meter shows total dissolved solids in ppm (mg/L). EPA's guideline for drinking water is 500 mg/L or less, and taste panels rate water under 300 as excellent. TDS says how much is dissolved, not what it is, so a low reading doesn't mean water is safe and a high one doesn't mean it's harmful. A working reverse osmosis system should cut TDS by at least 75%.

**Widget: reading checker (`lib/guides/tds.ts`)**
Inputs: Your reading, ppm [180]; optional "Reading before an RO or filter, ppm" [empty]; "My meter shows µS/cm (EC)" toggle with factor slider 0.50–0.82 [0.50] (helper: "Most pocket TDS meters use about 0.5.").
Logic: band (WHO taste bands): <300 Excellent; 300–600 Good; 600–900 Fair; 900–1,200 Poor; >1,200 Unacceptable taste. Compare with 500 EPA guideline ("below / above EPA's 500 mg/L guideline"). If before value: reduction % = (before − after)/before; ≥75 → "Your RO is removing {pct}% of dissolved solids. Certified RO systems remove at least 75%."; <75 → "Below the 75% that certified RO systems must reach. Check the membrane and filters." If EC: ppm = EC × factor.
Default render MUST show: 180 ppm, Excellent taste band, below EPA's 500 mg/L guideline. Example in docs/tests: before 180, after 12 → 93%.

**Body (exact):**

H2 "TDS chart"
| TDS (ppm, mg/L) | Taste rating | Notes |
|---|---|---|
| Under 300 | Excellent | Very low TDS (RO water) can taste flat |
| 300 to 600 | Good | Below EPA's 500 mg/L guideline up to 500 |
| 600 to 900 | Fair | Above EPA's 500 mg/L guideline |
| 900 to 1,200 | Poor | Salty or mineral taste likely |
| Over 1,200 | Unacceptable | Treatment usually needed |
Caption: "Taste bands: WHO background document on TDS (2003). Guideline: EPA secondary standard, 500 mg/L. WHO sets no health-based limit for TDS."

H2 "What a TDS meter can't tell you"
A TDS meter measures how well water conducts electricity and converts it to an estimate of dissolved solids. It can't tell calcium from sodium, or harmless minerals from lead, nitrate or arsenic, which may be present at very low levels. For anything health-related, use a lab test; see our [well water testing guide](/well-water-test-kit/).

H2 "Checking a reverse osmosis system"
Measure the tap water going in and the RO water coming out. Certified systems (NSF/ANSI 58 and EPA WaterSense) must remove at least 75% of TDS. If yours removes much less, the membrane or filters are probably due; price replacements with our [RO cost calculator](/reverse-osmosis-system-cost/).

H2 "µS/cm to ppm"
Some meters show electrical conductivity (EC) in µS/cm instead of TDS. Multiply EC by about 0.5 for fresh water; the factor rises toward 0.8 for very salty water.

H2 "TDS meters"
Pocket TDS meters are cheap: the HM Digital TDS-3, for example, reads 0 to 9,990 ppm with ±2% accuracy and sells for about $20. Rinse the probe, test water at room temperature, and calibrate with a standard solution if the maker recommends it.

**FAQ (exact):**
1. Q: What is a good TDS level for drinking water? A: Under 300 ppm rates as excellent in taste tests, and EPA's guideline is 500 ppm or less. TDS alone doesn't tell you whether water is safe.
2. Q: Is high TDS dangerous? A: Not by itself. WHO sets no health-based limit for TDS; high readings mostly affect taste and scaling. Test for specific contaminants if you're concerned.
3. Q: Can a TDS meter detect lead? A: No. It can't identify individual substances. Use a certified lab test for lead.
4. Q: How much TDS should an RO system remove? A: At least 75%. That's the minimum for NSF/ANSI 58 and EPA WaterSense certification.
5. Q: Is 0 ppm water good to drink? A: It's safe, but very low TDS can taste flat.

**Sources:** epa-secondary (existing), who-tds-background, who-tds-factsheet, ndsu-wq1923, vce-442-666, epa-ro-performance-2024, hmdigital-tds3.

---

## 4. `/hard-water-vs-soft-water/` (guide)

- Title: `Hard Water vs Soft Water: What Changes | HomeWaterMath` (54)
- Meta: `Hard vs soft water compared with measured results: scale in water heaters, detergent use, skin, health and sodium. Check whether your water needs a softener.` (157)
- Related: `/water-hardness-converter/`, `/water-softener-size-calculator/`, `/can-you-drink-softened-water/`.

**Quick answer (exact):**
Hard water carries calcium and magnesium, which leave scale in water heaters, pipes and fixtures and make soap work less well. It isn't a health risk. Soft water has had those minerals removed, usually by swapping them for sodium. In industry-funded tests, softened water heaters kept their efficiency while hard-water units clogged with scale, and laundry needed about half the detergent. Water above 7 gpg (120 mg/L) is considered hard.

**Widget: "Do I need a softener?" (`lib/guides/needSoftener.ts`)**
Inputs: Hardness [15] + unit (reuse); Iron, ppm [0].
Logic: gpg = converted; class (WQA scale from the converter). Recommendation: < 3.5 gpg → "Soft or slightly hard. You don't need a softener."; 3.5–7 → "Moderately hard. A softener is optional; you'll notice some spotting and scale."; > 7 → "Hard. A softener is usually worth it; size one with our calculator." (link). Iron > 0.3 adds: "Your iron is above the 0.3 ppm staining level; see the iron filter guide." Always add: "Softening this water adds about {gpg × 7.864, whole} mg of sodium per liter."
Default render MUST show: 15 gpg, Very hard (WQA), "Hard. A softener is usually worth it", about 118 mg of sodium per liter.

**Body (exact):**

H2 "Hard vs soft water at a glance"
| | Hard water | Soft water |
|---|---|---|
| Minerals | Calcium and magnesium | Mostly sodium (or potassium) instead |
| Scale | Builds up in heaters, pipes, showerheads | Little or none |
| Soap | Less lather, more detergent needed | Lathers easily |
| Taste | Often preferred, slightly mineral | Slightly salty at high hardness |
| Health | Not a health concern | Adds sodium; see below |
Caption: "USGS, University of Nebraska-Lincoln Extension, Battelle and WQRF studies (industry-funded)."

H2 "What the tests found"
A Battelle study for the Water Quality Association found that water heaters on softened water kept their efficiency essentially constant, while none of the unsoftened units finished the test because scale blocked them. Gas heaters built up about 528 grams of scale a year on hard water against 7 grams on soft water. A separate study found laundry needed about half the detergent with soft water, and 60°F soft water cleaned as well as 100°F hard water. Both studies were funded by the water treatment industry.

H2 "Health and skin"
USGS describes hard water as a nuisance, not a health concern. WHO notes that studies link harder water with lower heart disease rates but hasn't found the link to be causal. For eczema, a randomized trial of 336 children found no benefit from installing a softener.

H2 "How hard is hard?"
| Class | gpg | mg/L |
|---|---|---|
| Soft | under 1 | under 17.1 |
| Slightly hard | 1 to 3.5 | 17.1 to 60 |
| Moderately hard | 3.5 to 7 | 60 to 120 |
| Hard | 7 to 10.5 | 120 to 180 |
| Very hard | over 10.5 | over 180 |
Caption: "Water Quality Association classes (UNL Extension G1274)."

**FAQ (exact):**
1. Q: Is hard water or soft water better? A: For plumbing and cleaning, soft water: less scale and less detergent. For drinking, hard water is fine and often tastes better; soft water adds some sodium.
2. Q: Is hard water bad for you? A: No. USGS calls it a nuisance, not a health concern.
3. Q: Does soft water help eczema? A: A randomized trial of 336 children found no benefit from water softeners.
4. Q: Does hard water damage water heaters? A: Yes, over time. In industry-funded tests, hard water built up about 528 grams of scale a year in gas heaters against 7 grams with soft water.
5. Q: How do I know if I have hard water? A: Test it with strips or a drop-count kit, or check your utility's water quality report. Above 7 gpg (120 mg/L) is hard.

**Sources:** usgs-hardness, unl-g1274 (existing), battelle-wqp-2010, wqrf-laundry-2011, swet-nottingham-2011, who-hardness-2003.

---

## 5. `/can-you-drink-softened-water/` (guide)

- Title: `Can You Drink Softened Water? Sodium Math | HomeWaterMath` (57)
- Meta: `Yes for most people. See how much sodium your softener adds from your hardness, how it compares with daily limits, and when to keep an unsoftened tap.` (150)
- Related: `/hard-water-vs-soft-water/`, `/water-softener-vs-salt-free-cost/`, `/water-softener-salt-calculator/`.

**Quick answer (exact):**
Yes, for most people. A softener adds about 8 mg of sodium per liter for every grain per gallon of hardness it removes. With 15 gpg water, drinking 2 liters a day adds about 236 mg of sodium, roughly 10% of the 2,300 mg daily limit. If you're on a low-sodium diet, ask your doctor, keep one unsoftened cold tap for drinking, or use potassium chloride instead of salt.

**Widget: sodium calculator (`lib/guides/sodium.ts`)**
Inputs: Hardness removed [15] + unit (reuse); Water you drink per day, liters [2].
Formula: mgPerL = gpg × 7.864 (`SODIUM_MG_PER_L_PER_GPG`); mgPerDay = mgPerL × liters; pct2300 = mgPerDay / 2300; pct1500 = mgPerDay / 1500.
Outputs: `{mgPerL, 1 decimal} mg/L of sodium`; `{mgPerDay} mg a day`; `{pct2300}% of 2,300 mg` and `{pct1500}% of the 1,500 mg ideal`; flags: mgPerL > 20 → "Above EPA's 20 mg/L guidance level for people on a strict 500 mg a day sodium diet."; mgPerL > 60 → "May taste slightly salty (EPA: 30 to 60 mg/L)."
Default render MUST show: 118.0 mg/L; 236 mg a day; 10% of 2,300 mg; 16% of 1,500 mg; both flags.

**Body (exact):**

H2 "How much sodium a softener adds"
| Hardness removed | Sodium added | 2 liters a day |
|---|---|---|
| 5 gpg | about 39 mg/L | about 79 mg |
| 10 gpg | about 79 mg/L | about 157 mg |
| 15 gpg | about 118 mg/L | about 236 mg |
| 20 gpg | about 157 mg/L | about 315 mg |
| 25 gpg | about 197 mg/L | about 393 mg |
Caption: "About 7.9 mg/L per gpg (Penn State Extension; UNL and NDSU give about 8 mg/L). Daily limit: American Heart Association."
(Generate the table from the same formula; verify 20 gpg = 157.3 mg/L and 315 mg.)

H2 "Who should be careful"
EPA's guidance is 20 mg/L of sodium for people on a strict 500 mg a day diet, so anyone on a doctor-ordered low-sodium diet should ask their doctor before drinking softened water. The Minnesota Department of Health, NDSU and UNL all suggest keeping one cold tap unsoftened for drinking and cooking. Softened water isn't recommended for watering houseplants or gardens.

H2 "Potassium chloride instead of salt"
Potassium chloride replaces sodium with potassium. It costs more, up to about $25 per 40 lb bag against $5 to $10 for salt, and you need roughly 10% more of it, according to NDSU. Compare total costs with our [salt calculator](/water-softener-salt-calculator/).

H2 "Babies"
We found no US agency guidance specific to softened water and infant formula. The simplest choice is to make formula with water from an unsoftened tap, and to test well water for nitrate first (babies under 6 months shouldn't drink water above 10 mg/L nitrate).

**FAQ (exact):**
1. Q: Is it safe to drink softened water? A: Yes, for most people. It adds about 8 mg of sodium per liter for each gpg of hardness removed.
2. Q: How much sodium is in softened water? A: Multiply your hardness in gpg by about 8. Water softened from 15 gpg has about 118 mg of sodium per liter.
3. Q: Can I drink softened water on a low-sodium diet? A: Ask your doctor. EPA's guidance for people on a strict 500 mg a day diet is 20 mg/L, which most softened water exceeds.
4. Q: Does potassium chloride make softened water safer? A: It replaces sodium with potassium, so it avoids the added sodium, but it costs more and you need about 10% more.
5. Q: Should I keep an unsoftened tap for drinking? A: It's a common recommendation from state health departments and extension services, especially for people watching sodium.

**Sources:** psu-softening, unl-g1274, ndsu-wq1031 (existing), epa-sodium-2003, aha-sodium, mdh-softening, epa-infants-wells.

---

## 6. Hub and registry changes
- `/water-softeners/` hub: settings calculator joins the calculator tiles and table ("what to enter on your softener" → Water softener settings calculator); the 3 softener guides join "Guides".
- `/water-filters/` hub: TDS guide joins a new "Guides" section (create it on this hub).
- Footer Calculators column: add the settings calculator (11 calculators).
- Size and salt calculators: add `/water-softener-settings/` to Related (replace the weakest card).
- `/water-softener-not-working/`: in "Start with the five free checks", item 4, link "the setting" to `/water-softener-settings/`.

## 7. New sources (accessed 2026-10-25 unless noted)
- pro-res-care-label: Pro Products, Pro Res Care label: https://cdn.shopify.com/s/files/1/0891/9214/files/Pro-Res-Care.pdf
- nelsen-rescare: Nelsen, Res Care (NSF/ANSI/CAN 60): https://www.nelsencorp.com/itemdetail/RES%20CARE-64
- fws-rescare: Fresh Water Systems, Res Care 1 gal ($20.69): https://freshwatersystems.com/products/rescare-liquid-resin-cleaner-1-gal
- resup-instructions: Res-Up feeder instructions, form 1677 (2010): https://assets.freshwatersystems.com/images/xrgdzghan02d0cqqa9ou/resupfeeder.pdf
- weco-resup: WECO, Res-Up 1 gallon ($31.99): https://www.wecofilters.com/res-up-water-softener-cleaner-1-gallon-bottle.html
- ironout-summit: Summit Brands, Iron OUT powder: https://summitbrands.com/iron-out-rust-stain-removers/powder/
- ironout-sds: Iron OUT powder SDS (2018): https://images.homedepot-static.com/catalog/pdfImages/de/de4f2aa6-e1f6-4fcf-8661-9e85166ceac3.pdf
- outfiltermate-summit: Summit Brands, OUT Filter Mate Heavy Duty: https://summitbrands.com/out-filter-mate/heavy-duty-water-softener-cleaner/
- ge-gxsf27b-manual: GE GXSF27B manual (sanitizing): https://manualslib.mx/manual/137341/Ge-Gxsf27B.html?page=10
- who-tds-background: WHO, TDS background document WHO/SDE/WSH/03.04/16: https://www.who.int/docs/default-source/wash-documents/wash-chemicals/total-dissolved-solids-background-document.pdf
- who-tds-factsheet: WHO, TDS fact sheet: https://cdn.who.int/media/docs/default-source/wash-documents/wash-chemicals/total-dissolved-solids-fs-new.pdf
- ndsu-wq1923: NDSU Extension WQ1923, Using electrical conductivity (rev. Jan 2024): https://ndsu.edu/agriculture/sites/default/files/2025-01/WQ1923%20Using%20Electrical%20Conductivity%20-%20Water%20Quality.pdf
- vce-442-666: Virginia Cooperative Extension 442-666, Total Dissolved Solids: https://extension.umd.edu/sites/extension.umd.edu/files/2022-05/Total%20Dissolved%20Solids.pdf
- epa-ro-performance-2024: EPA WaterSense, RO systems performance summary (Dec 2024): https://www.epa.gov/system/files/documents/2025-01/ws-products-ro-systems-performance-summary_508.pdf
- hmdigital-tds3: Hydrobuilder, HM Digital TDS-3 ($19.94): https://hydrobuilder.com/products/hm-digital-tds-3-handheld-tds-ec-temp-meter
- battelle-wqp-2010: Water Quality Products, Battelle softened water study (2010-04-23): https://www.waterworld.com/residential-commercial/article/14307772/battelle-benefits
- wqrf-laundry-2011: Water Online, Studies show washing with softened water (2011-03-03): https://www.wateronline.com/doc/studies-show-washing-with-softened-water-0001
- swet-nottingham-2011: University of Nottingham, SWET eczema trial (2011-02-15): https://nottingham.ac.uk/news/pressreleases/2011/february/watersoftenerseczema.aspx
- who-hardness-2003: WHO, Hardness in drinking-water (2003): https://cdn.who.int/media/docs/default-source/wash-documents/wash-chemicals/hardness2003.pdf
- epa-sodium-2003: EPA 822-R-03-006, Drinking water advisory: sodium (2003): https://www.epa.gov/sites/default/files/2014-09/documents/support_cc1_sodium_dwreport.pdf
- aha-sodium: American Heart Association, How much sodium should I eat per day (reviewed 2025-07-15): https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/sodium/how-much-sodium-should-i-eat-per-day
- mdh-softening: Minnesota Department of Health, Home water softening (2022-10-03): https://www.health.state.mn.us/communities/environment/water/factsheet/softening.html
- epa-infants-wells: EPA, Private wells and drinking water safety for infants (2026-10-20): https://www.epa.gov/children/private-wells-and-drinking-water-safety-and-infants
- psu-softening already exists; update its accessed date.

## 8. Definition of done
All five live, default values in static HTML, schema per fix 04 (tool: WebPage + WebApplication; guides: WebPage + Article), captions on every table, title/meta limits, heading order, no em dashes, IndexNow submits on push, PageSpeed mobile ≥ 90, CLS 0.
Report: commit, tests passed/total, photo choices, URL check results, screenshots of each page at 390 px.

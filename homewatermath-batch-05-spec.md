# HomeWaterMath batch 05 spec: 1 calculator + 3 guides

Date: 2026-11-03. Written by: browser agent. For: the coding agent.
Keyword data: Semrush US (self-hosted), pulled 2026-10-25. Research notes: `homewatermath-batch-05-research.md`.
All rules from the main spec, batch 03 (GuideLayout, Article schema), fix 04 (WebPage + Person + dates, table captions, title 30–60 / description 110–160, no em dashes) and batch 04 apply. Set `publishedDate` and `lastUpdated` to the day you ship.

| # | URL | Type | H1 | Hub | Main keywords (US vol / KD) | Photo slot |
|---|---|---|---|---|---|---|
| 1 | `/well-shock-chlorination-calculator/` | tool (A5 layout) | Well Shock Chlorination Calculator | wells | how to shock a well 1,000 / 32; shock chlorination; how much bleach to shock a well | `tool-well-shock` |
| 2 | `/water-softener-salt-types/` | guide | Water Softener Salt Types: Which One to Buy | softeners | best water softener salt 1,900 / 19; potassium chloride water softener 1,000 / 20; water softener salt types 320 / 12 | `guide-salt-types` |
| 3 | `/water-softener-salt-bridge/` | guide | Water Softener Salt Bridge: How to Spot and Fix It | softeners | water softener salt bridge 1,900 / 23 | `guide-salt-bridge` |
| 4 | `/uv-light-for-well-water/` | guide | UV Light for Well Water: Sizing, Pre-Treatment and Cost | wells | uv light for well water 1,000 / 16 | `guide-uv-well` |

Photos: you pick (photo rules unchanged; if nothing fits, mist square). Ideas: 1 a well cap in a yard or a gloved hand near a well head (no faces); 2 white salt pellets or crystals close up, or a bag being poured (no brand legible); 3 the inside of a salt tank or a hand with a broom handle near a tank; 4 a stainless steel UV chamber on a basement water line (no brand legible), or a glass of well water held to the light.

---

## 1. `/well-shock-chlorination-calculator/` (calculator)

- Title: `Well Shock Chlorination Calculator | HomeWaterMath` (50)
- Meta: `How much bleach to shock your well: gallons of water in the well and plumbing, bleach for your target strength, plus steps, safety and when to retest.` (150)
- Related: `/well-water-test-kit/`, `/well-pressure-tank-size-calculator/`, `/uv-light-for-well-water/`.
- Information gain: the one existing calculator (welldrillingpros.com) counts only the well and a fixed 100 gallons. Ours adds the pressure tank, water heater and toilets (University of Nevada method), lets the user pick the target strength by the agency that recommends it, handles 8.25% and pool bleach, and gives retest timing.

**Quick answer (exact):**
To shock a well, mix enough plain unscented bleach to reach about 100 to 200 ppm chlorine in all the water in the well and your plumbing, run it to every tap, leave it 12 to 24 hours, then flush and retest. A 200 ft, 6-inch well with water at 50 ft, plus a typical house, holds about 307 gallons and needs about ½ gallon (8 cups) of 6% bleach for 100 ppm. The calculator below works it out for your well.

**Inputs (defaults):**
- Well depth, ft [200]
- Depth to water (static water level), ft [50] (helper: "From your well log or a water level meter. If you don't know it, enter 0 to assume a full well; you'll use a little more bleach.")
- Casing diameter `2 in` / `4 in` / `5 in` / `6 in` / `8 in` / `24 in (dug)` / `36 in (dug)` [6 in]
- Pressure tank size, gal [20]; Water heater, gal [50]; Toilets [2]
- Target strength `50 ppm` / `100 ppm` / `150 ppm` / `200 ppm` / `250 ppm` [100 ppm], with the agency line under the select (exact): "Minnesota Dept. of Health: 50 to 200 ppm. Wisconsin DNR: 100 ppm. CDC: over 100 ppm. Pennsylvania DEP: 100 to 150 ppm. Oregon State: 50 to 100 ppm. Texas A&M: 200 ppm. University of Nevada: 250 ppm. Follow your state's guidance if it has one."
- Bleach strength `5.25%` / `6%` / `8.25%` / `12.5% (pool chlorine)` [6%]

**Constants (`lib/calc/wellShock.ts`):**
```
GAL_PER_FT = { 2: 0.163, 4: 0.653, 5: 1.02, 6: 1.47, 8: 2.61, 24: 23.5, 36: 52.9 }   // UGA C858-4, Univ. Nevada FS-06-69 (2 in = geometric value)
GAL_PER_TOILET = 3; PLUMBING_GAL = 10                                                     // Univ. Nevada FS-06-69
```
**Formula:**
```
waterColumnFt = wellDepth − staticLevel             // error if staticLevel >= wellDepth
wellGal       = waterColumnFt × GAL_PER_FT[dia]
houseGal      = tankGal + heaterGal + toilets × 3 + 10
totalGal      = wellGal + houseGal
bleachGal     = totalGal × ppm ÷ (bleachPct × 10,000)
bleachQt      = bleachGal × 4; bleachCups = bleachGal × 16
```
Display: gallons to 2 decimals, quarts and cups to 1 decimal, and "Round up to the next cup." If bleachGal ≥ 1, lead with gallons; else lead with cups.
Warnings:
- ppm ≥ 250: "This is above the Minnesota Dept. of Health's 200 ppm maximum. Very strong chlorine can damage pumps, pipes and bladder pressure tanks."
- dia ≥ 24: "Dug wells hold a lot of water and often let surface water in. Shocking may only help for a while; have the well inspected."
- staticLevel 0: "Assuming the casing is full of water. Enter the depth to water for a closer number."

**Outputs:** headline `Bleach needed: 8.2 cups (0.51 gal) of 6% bleach`; rows: Water in the well `220.5 gal` (150 ft of water × 1.47 gal/ft); Water in your house `86 gal` (tank 20 + heater 50 + toilets 6 + pipes 10); Total `306.5 gal`; Strength `100 ppm`; Contact time `12 to 24 hours`; Retest `7 to 14 days after flushing`.
Default render MUST show: 220.5 gal; 86 gal; 306.5 gal; 0.51 gal; 8.2 cups.

**How to use (exact):**
1. Enter the well depth and the depth to water from your well log.
2. Choose the casing diameter. Most drilled wells are 4 or 6 inches; dug wells are 2 to 3 feet across.
3. Enter your pressure tank and water heater sizes and the number of toilets.
4. Choose the strength your state recommends and the bleach on the label.
5. Buy a little more bleach than the result, and follow the steps below.

**The formula (exact):**
Water in the well = (well depth − depth to water) × gallons per foot of casing

Water in the house = pressure tank + water heater + 3 gallons per toilet + 10 gallons for pipes

Bleach (gallons) = total gallons × target ppm ÷ (bleach % × 10,000)

*Example 1: 200 ft, 6-inch well, water at 50 ft, 100 ppm, 6% bleach.* 150 ft × 1.47 = 220.5 gallons in the well, plus 86 in the house, is 306.5 gallons. 306.5 × 100 ÷ 60,000 = 0.51 gallons, about 8 cups.

*Example 2: 150 ft, 4-inch well, water at 30 ft, 200 ppm, 8.25% bleach.* 120 ft × 0.653 = 78.4 gallons, plus 86 in the house, is 164.4 gallons. 164.4 × 200 ÷ 82,500 = 0.40 gallons, about 6.4 cups.

**Reference table: "Gallons of water per foot of casing"** (from `GAL_PER_FT`), caption: "Source: University of Georgia Extension C858-4 and University of Nevada FS-06-69; 2 in is calculated."

**Body (exact), under the tool:**

H2 "How to shock a well"
1. Turn off or bypass water treatment: softeners, RO systems and filters (cartridges can be removed). Chlorine can damage them.
2. Turn off power to the pump before you open the well cap.
3. Mix the bleach into 3 to 5 gallons of water and pour it into the well.
4. Turn the power back on. Run a hose from an outside tap back into the well for 10 to 30 minutes to mix the water.
5. Open every tap, hot and cold, one at a time, until you smell chlorine, then close it. Flush toilets once.
6. Leave the chlorinated water in the system for 12 to 24 hours without using it.
7. Flush the water out through an outside hose, away from lawns, gardens, streams and your septic system, until the chlorine smell is gone.
8. Retest for coliform bacteria 7 to 14 days later.

H2 "Safety"
Wear goggles and rubber gloves. Never mix bleach with ammonia or other cleaners. Don't climb into a well pit; fumes collect there. Use plain, unscented household bleach with no additives, not splashless or scented bleach. Bleach weakens over time, so use a fresh, unopened bottle.

H2 "When to shock a well"
After a test finds coliform bacteria, after flooding, when a well is new or has had work done (a new pump, for example), and after the system has been opened. It isn't a routine treatment. If bacteria come back after shocking, the well likely has a defect, such as a cracked casing or a loose cap, and needs a well contractor; a [UV system](/uv-light-for-well-water/) can treat ongoing bacteria once the source is checked.

H2 "What it costs"
Doing it yourself costs a few dollars of bleach. A professional well shock costs about $80 to $200, with an average around $140. A coliform bacteria test costs about $10 to $30 at many labs; state labs vary.

**FAQ (exact):**
1. Q: How much bleach do I need to shock a well? A: It depends on the water in the well and your plumbing. A 200 ft, 6-inch well with water at 50 ft and a typical house needs about ½ gallon of 6% bleach for 100 ppm.
2. Q: How long should bleach stay in a well? A: At least 12 hours, and 24 hours is common. Minnesota's health department gives a 2-hour minimum but prefers 6 hours or overnight.
3. Q: How long after shocking a well can I drink the water? A: After you've flushed it until you can't smell chlorine, and after a retest shows no coliform bacteria. Use bottled water until then.
4. Q: Can I use pool chlorine to shock a well? A: Plain liquid pool chlorine (sodium hypochlorite) works, but it's about twice as strong as household bleach, so use about half as much. Choose 12.5% in the calculator.
5. Q: Will shocking a well hurt my septic system? A: Large amounts of chlorinated water can. Flush most of it outside, away from the septic system; the University of Georgia suggests no more than 100 gallons to the septic tank.
6. Q: Why did my well test positive again after shocking? A: Shocking kills bacteria present at the time, but doesn't fix how they got in. Penn State found it solved the problem in only about 15% of positive wells. Have the well cap, casing and seal checked.

**Sources:** uga-c858-4, nevada-fs-06-69, wi-dnr-dg120, mdh-well-disinfection, cdc-well-disinfection, tamu-scs-2002-04, pa-dep-well-disinfection, osu-oregon-shock, ohio-aex-318, psu-shock-chlorination, psu-coliform, angi-shock-cost, wsc-splashless.

**Tests (min 10):** default → 220.5 / 86 / 306.5 / 0.51 gal / 8.2 cups; example 2 → 164.4 gal, 0.40 gal, 6.4 cups; UGA check: 100 gal (well only: set house to 0) at 200 ppm 6% → 0.33 gal ≈ 2.7 pints; WI check: 100 gal at 200 ppm 5.25% → 1.52 qt; static ≥ depth → error, no NaN; static 0 → full-casing note; 250 ppm → MDH warning; 36 in dug well 20 ft deep water at 5 ft → 793.5 gal in well + dug-well warning; pool 12.5% at default → 0.25 gal; empty inputs → no NaN.

---

## 2. `/water-softener-salt-types/` (guide)

- Title: `Water Softener Salt Types: Which One to Buy | HomeWaterMath` (59)
- Meta: `Pellets, solar, rock or potassium chloride: purity, what softener manuals allow, and a yearly cost calculator by salt type with current 2026 prices.` (148)
- Related: `/water-softener-salt-calculator/`, `/water-softener-salt-bridge/`, `/can-you-drink-softened-water/`.
- Information gain: no ranking page compares the yearly cost of each salt type, reconciles how much more potassium chloride you need, or shows what the softener manuals actually allow.

**Quick answer (exact):**
For most softeners, evaporated salt pellets are the best buy: about 99.7% pure, allowed by every manual we checked, and about 22 cents a pound. Solar salt is a close second. Avoid rock salt unless your manual allows it, because its insoluble dirt builds up in the tank. Potassium chloride avoids adding sodium but costs more than five times as much a year, since it's pricier and you need 13 to 15% more.

**Widget: yearly cost by salt type (`lib/guides/saltTypes.ts`)**
Inputs: Salt used per year, lb [600] (helper: "A family of 4 at 15 gpg uses about 600 lb a year at a 9 lb salt setting. Get yours from the [salt calculator](/water-softener-salt-calculator/)."); editable price per 40 lb bag for each row (defaults below).
Data:
```
pellets:  $8.76 / 40 lb, factor 1.00      // Walmart Morton Clean & Protect, Home Depot, TSC 2026-10-26 ($8.58–$8.99)
solar:    $8.76 / 40 lb, factor 1.00      // solar crystals $8.76–$8.99
ironPell: $9.99 / 40 lb, factor 1.00      // Diamond Crystal Iron Fighter $9.99–$10.58
kcl:      $41.99 / 40 lb, factor 1.14     // Diamond Crystal Sodium Shield $39.99–$43.99 (TSC); WQA: 13–15% more
```
Outputs per row: pounds a year (lb × factor), bags a year (ceil(lb × factor ÷ 40)), cost a year (lb × factor × price ÷ 40), rounded to whole dollars.
Default render MUST show: pellets 15 bags, $131; solar 15 bags, $131; iron-fighting pellets 15 bags, $150; potassium chloride 684 lb, 18 bags, $718.
Note under table (exact): "Prices are 40 lb bags at Home Depot, Walmart and Tractor Supply on October 26, 2026. Your store may differ; edit the prices above."

**Body (exact):**

H2 "Salt types compared"
| Type | Purity | Notes | Allowed by most manuals |
|---|---|---|---|
| Evaporated pellets | 99.7% to 99.99% | Cleanest; least residue | Yes |
| Solar salt (crystals) | 99.6% to 99.8% | Slightly more insolubles than pellets | Yes (GE asks for coarse solar of 99.5% or more) |
| Rock salt | 95% to over 98.5% | Leaves dirt; needs regular tank cleanouts | No: Fleck, GE, Whirlpool and EcoPure say not to use it |
| Block salt | 99.8% | Only for softeners made for blocks | No, unless your softener takes blocks |
| Potassium chloride | about 99% | No sodium; costs more; bridges more easily | Yes, with a setting change |
Caption: "Purity: Cargill product information. Manual rules: Fleck 7000SXT, GE, Whirlpool and EcoPure owner's manuals."

H2 "What softener manuals say"
Fleck's 7000SXT manual says not to use granulated or rock salt. GE asks for nugget, pellet or coarse solar salt at least 99.5% pure, and no rock, block, granulated or ice cream salt. Whirlpool allows nugget, pellet or coarse solar salt with less than 1% impurities. If your manual and this page disagree, follow the manual.

H2 "Potassium chloride: how much more you need"
Potassium chloride replaces sodium with potassium, so softened water adds no sodium. The Water Quality Association says you need a 13 to 15% higher concentration, so set your softener's salt type to potassium if it has that option, or raise the salt amount. Potassium chloride also cakes more readily in humid basements; Whirlpool says not to fill it above level 4 and to check it monthly. It doesn't reduce the chloride a softener sends to the drain.

H2 "Salt for iron"
Iron-fighting pellets, such as Diamond Crystal Iron Fighter and Morton Rust Defense, add a cleaner that helps keep iron from fouling the resin. Diamond Crystal says its additive works only up to about 2 ppm of iron; above that, use an [iron filter](/iron-filter-for-well-water/). GE warns that some iron additives can release corrosive fumes, so check your manual.

H2 "Which salt to buy"
- Most homes: evaporated pellets.
- Tight budget, manual allows it: solar salt.
- Some iron in the water: iron-fighting pellets, plus a [resin cleaner](/water-softener-cleaner/) if needed.
- On a low-sodium diet: potassium chloride, or keep one unsoftened tap for drinking ([details](/can-you-drink-softened-water/)).
Don't mix salt types in the tank; it can cause bridging and mush.

**FAQ (exact):**
1. Q: What is the best salt for a water softener? A: Evaporated salt pellets for most homes. They're the purest common type and every softener manual we checked allows them.
2. Q: Is potassium chloride better than salt for a water softener? A: Only if you want to avoid sodium. It works, but it costs more than five times as much a year and you need 13 to 15% more.
3. Q: Can I use rock salt in my water softener? A: Usually not. Fleck, GE, Whirlpool and EcoPure manuals say not to, because its insoluble dirt builds up in the brine tank.
4. Q: Can I mix different types of softener salt? A: It's best not to. Mixing salt types can cause bridging and mush. Let the tank run low before you switch.
5. Q: How much salt does a water softener use a year? A: A family of 4 with 15 gpg water uses about 600 lb a year at a 9 lb salt setting. The [salt calculator](/water-softener-salt-calculator/) works out yours.

**Sources:** cargill-salt-faq, fleck-7000sxt-manual, ge-gxsh40v-manual, whirlpool-whes40-manual, ecopure-manual (if not reachable, drop the EcoPure mentions), unl-g1491, wqa-smart-softeners, diamond-crystal-faq, diamond-crystal-iron-fighter, morton-kcl, tsc-softener-salt, hd-softener-salt, walmart-morton-pellets.

---

## 3. `/water-softener-salt-bridge/` (guide)

- Title: `Water Softener Salt Bridge: Spot and Fix It | HomeWaterMath` (59)
- Meta: `Is your softener salt bridged or mushy? A 1-minute check, how to break a salt bridge safely, how to clear salt mush, and how to stop it coming back.` (148)
- Related: `/water-softener-not-working/`, `/water-softener-salt-types/`, `/water-softener-salt-calculator/`.

**Quick answer (exact):**
A salt bridge is a hard crust of salt that forms above the water in the brine tank, leaving an empty space underneath. The salt level stops dropping and your water turns hard because the softener can't make brine. Break it by pushing a broom handle into the crust in several places, never with a sharp or metal tool, then add a gallon of warm (not hot) water. Keeping the tank no more than about half full and using pellets helps stop it coming back.

**Widget: bridge or mush? (`lib/guides/saltBridge.ts`)**
Four yes/no questions (default all "No"):
1. Has the salt level stayed the same for 2 weeks or more?
2. Is your water hard even though the tank looks full of salt?
3. When you push a broom handle down, does it hit a hard layer with empty space or loose salt below?
4. Is there a thick sludge layer at the bottom of the tank?
Logic (first match wins): Q4 yes → "Salt mush"; Q3 yes → "Salt bridge"; Q1 yes and Q2 yes → "Probably a salt bridge. Do the broom handle check."; Q2 yes only → "Probably not a salt problem. See [why softeners stop working](/water-softener-not-working/)."; all no → "No sign of a bridge. Check again in a month."
Each result links to the matching H2 below. Default render MUST show: "No sign of a bridge. Check again in a month."

**Body (exact):**

H2 "Salt bridge or salt mush?"
| | Salt bridge | Salt mush |
|---|---|---|
| What it is | A hard crust above the water, with empty space below | Dissolved salt that recrystallized into sludge at the bottom |
| Main sign | Salt level doesn't drop; water turns hard | Water level stays high; brine isn't drawn |
| Common causes | Humidity, overfilling, wrong salt | Low-purity or fine salt, mixing salt types |
| Fix | Break the crust carefully | Scoop the sludge out and refill |
Caption: "Based on GE, Whirlpool and Culligan owner and troubleshooting guides, and the Diamond Crystal and Cargill salt FAQs."

H2 "The broom handle check"
Mark a broom handle at the height of the tank's rim. Push it straight down through the salt until it stops, and mark the handle at the rim again. If it stops on something hard well above the bottom and then breaks through, or if the distance doesn't match where the salt should be, you have a bridge.

H2 "How to break a salt bridge"
1. Push a broom handle into the crust in several places to crack it. Don't use sharp or metal tools, and don't pound the tank.
2. Once it's broken up, pour about a gallon of warm (not hot) water over the salt to help loosen it.
3. Scoop out any large chunks, and remove salt that isn't the type your manual recommends.
4. Refill with pellets, keeping the salt a few inches above the water.

H2 "How to clear salt mush"
Scoop out the good pellets and set them aside, remove the sludge from the bottom, rinse the tank, and refill.

H2 "How to stop it coming back"
- Keep the tank about half full, and add salt when it drops to about a quarter. Keep it lower in humid basements.
- Keep the salt a few inches above the water level.
- Use evaporated pellets; they're less likely to bridge than fine or low-purity salt ([salt types](/water-softener-salt-types/)).
- Don't mix salt types.
- Check every 2 to 3 weeks until you know your softener's pattern, then monthly.
- With high-purity salt, brine tank cleaning is rarely needed. With rock salt, Cargill suggests cleaning 2 to 3 times a year.

**FAQ (exact):**
1. Q: How do I know if my water softener has a salt bridge? A: The salt level doesn't drop for weeks and your water turns hard. A broom handle pushed into the salt hits a hard crust with empty space below.
2. Q: Can I use hot water to break a salt bridge? A: Use warm, not hot, water. GE's manual suggests about a gallon of warm water after breaking the crust.
3. Q: How often should I check for a salt bridge? A: Every 2 to 3 weeks at first, then monthly once you know your usage.
4. Q: Does potassium chloride bridge more than salt? A: It can. It hardens more easily with humidity and temperature changes, so Whirlpool says to keep it lower in the tank and check it monthly.
5. Q: Should water be in my brine tank? A: Yes, a few inches is normal on most softeners. Keep the salt above the water level.

**Sources:** diamond-crystal-faq, cargill-salt-faq, ge-gxsh40v-manual, whirlpool-whes40-manual, culligan-troubleshooting, culligan-best-salt, morton-kcl, fleck-7000sxt-manual, unl-g1491.

---

## 4. `/uv-light-for-well-water/` (guide)

- Title: `UV Light for Well Water: Sizing and Cost | HomeWaterMath` (56)
- Meta: `How to size a UV system for well water, the iron, hardness and tannin limits it needs, Class A vs Class B, and a 10-year cost calculator with lamp prices.` (154)
- Related: `/well-shock-chlorination-calculator/`, `/iron-filter-for-well-water/`, `/well-water-test-kit/`.
- Information gain: no ranking page checks a user's test results against the pre-treatment limits, sizes at the 40 mJ/cm² dose, and totals 10 years of lamps, sleeves and power.

**Quick answer (exact):**
A UV system kills bacteria, viruses and parasites in well water without chemicals, but it only works on clear water. Size it at the 40 mJ/cm² dose (NSF/ANSI 55 Class A) for your pump's flow rate, add a 5-micron sediment filter, and treat iron, manganese, hardness and tannins first if they're above the limits. A typical whole-house system costs $700 to $2,500 installed, plus about $135 a year for a new lamp.

**Widget: pre-treatment check + 10-year cost (`lib/guides/uvWell.ts`)**
Part A, pre-treatment check. Inputs (from a water test, all optional): Iron, ppm [0.1]; Manganese, ppm [0]; Hardness, gpg [5]; Tannins, ppm [0]; Turbidity, NTU [empty]; UV transmittance, % [empty].
Limits (VIQUA FAQ): iron < 0.3; manganese < 0.05; hardness < 7; tannins < 0.1; turbidity < 1; UVT > 75.
Each row shows OK or "Treat first: {fix}". Fixes: iron/manganese → "[iron filter](/iron-filter-for-well-water/)"; hardness → "[water softener](/water-softener-size-calculator/)"; tannins → "tannin filter"; turbidity → "sediment filter"; UVT → "find out why: tannins, iron or turbidity are usual causes". Empty fields show "Not tested".
Default render MUST show: iron OK, manganese OK, hardness OK, tannins OK, turbidity Not tested, UVT Not tested.

Part B, size and 10-year cost. Inputs: Pump flow, gpm [7] (helper: "Pick a system rated for at least this flow at 40 mJ/cm²."); UV unit price [$685] (helper: "VIQUA VH200, 7 gpm at 40 mJ/cm², at ESP Water, Oct 2026"); Installation `DIY` / `Plumber` [Plumber → $500]; New GFCI outlet needed `No` / `Yes` [No; Yes adds $250]; Lamp, $ a year [135]; Sleeve, $ every 3 years [49]; Lamp watts [35]; Electricity, $ per kWh [0.17] (helper: "Check your bill.").
```
lampsOver10   = 9 × lampPrice                    // lamp yearly; the first lamp comes with the unit
sleevesOver10 = 3 × sleevePrice                  // years 4, 7, 10
power10       = watts × 8.76 × rate × 10         // kWh a year = W × 8,760 h ÷ 1,000
total10       = unit + install + outlet + lampsOver10 + sleevesOver10 + power10
```
Default render MUST show: lamps $1,215; sleeves $147; power $521; 10-year total $3,068; about $307 a year.

**Body (exact):**

H2 "What UV does and doesn't do"
UV light damages the DNA of bacteria, viruses and parasites such as Giardia and Cryptosporidium so they can't multiply. It adds nothing to the water and leaves no residual, so it only treats water at the moment it passes the lamp. It doesn't remove iron, lead, nitrate, arsenic or any other chemical, and it doesn't fix a well that lets surface water in. If a test finds E. coli, or bacteria keep coming back, have the well checked and [shock it](/well-shock-chlorination-calculator/) before relying on UV.

H2 "Class A vs Class B"
| | Class A | Class B |
|---|---|---|
| UV dose | 40 mJ/cm² | 16 mJ/cm² |
| Use | Water that may contain bacteria, viruses and parasites | Extra protection for water that already tests safe |
| Right for a well with a positive test | Yes | No |
Caption: "Source: NSF/ANSI 55 (2024), as summarized by ANSI and NSF."

H2 "Pre-treatment limits"
| Test | Limit for UV | If it's higher |
|---|---|---|
| Iron | under 0.3 ppm | Iron filter |
| Manganese | under 0.05 ppm | Iron/manganese filter |
| Hardness | under 7 gpg | Water softener |
| Tannins | under 0.1 ppm | Tannin filter |
| Turbidity | under 1 NTU | Sediment filter |
| UV transmittance | over 75% | Find and treat the cause |
Caption: "Source: VIQUA UV system FAQ (2025). Some makers set stricter limits; check your system's manual."
Iron and hardness coat the quartz sleeve, and cloudy or tea-colored water shades the bacteria from the light. Every UV system should have a 5-micron sediment filter in front of it.

H2 "Sizing a UV system"
Choose a system rated for at least your pump's flow rate at 40 mJ/cm². Ratings at lower doses look bigger: the VIQUA VH200, for example, is rated 7 gpm at 40 mJ/cm² but 16 gpm at 16 mJ/cm². If you don't know your pump's flow, time how long a 5-gallon bucket takes to fill at a tap near the pressure tank: 300 ÷ seconds = gallons per minute.

H2 "Installation"
UV goes after the pressure tank and any softener or filters, and before the water splits to the house. It needs a grounded GFCI outlet, a bypass valve for servicing, and the lamp on all the time. After installing, disinfect the plumbing downstream once, since UV won't clean bacteria already in the pipes. Retest for coliform bacteria after installation.

H2 "Maintenance"
Replace the lamp every year (about 9,000 hours), even if it still glows; its UV output fades. Clean the quartz sleeve every 3 to 12 months and replace it every 2 to 3 years. Change the sediment filter on schedule.

H2 "Example systems and prices"
| System | Flow at 40 mJ/cm² | Price | Yearly lamp |
|---|---|---|---|
| VIQUA VH200 | 7 gpm | $685 | $135 |
| VIQUA VH410 | 14 gpm | $1,205 | not checked |
| VIQUA PRO10 (Class A certified) | 10 gpm | $3,175 | $310 (every 2 years) |
Caption: "Prices from ESP Water, Hydrobuilder and VIQUA retailers on October 26, 2026. Examples, not recommendations."

**FAQ (exact):**
1. Q: Does a UV light work for well water? A: Yes, for bacteria, viruses and parasites, if the water is clear and pre-treated. It doesn't remove chemicals like iron, nitrate or arsenic.
2. Q: What size UV system do I need for my well? A: One rated for at least your pump's flow rate at 40 mJ/cm². A 7 gpm system suits many homes with one pump.
3. Q: How much does a UV system for well water cost? A: About $700 to $2,500 installed, plus about $135 a year for a lamp and a few dollars a month for power.
4. Q: Do I need a softener before a UV system? A: If your hardness is 7 gpg or more, yes, or the sleeve will scale up and block the light.
5. Q: How often do you change a UV bulb? A: Every year, about 9,000 hours, even if it still lights up.
6. Q: Is UV better than chlorine for well water? A: UV adds no chemicals and doesn't change taste, but it leaves no residual in the pipes. Chlorination does, but needs dosing and contact time. Many homes with ongoing bacteria use UV after fixing the well.

**Sources:** viqua-faq, viqua-vh-spec, springwell-uv-manual, ct-dph-uv, cdc-home-treatment, ansi-nsf55-2024, esp-viqua-vh200, homeguide-well-filtration, homeguide-uv, angi-uv.

---

## 5. Hub and registry changes
- `/well-water/` hub: shock chlorination calculator joins the calculator tiles and table ("how much bleach to shock a well" → Well shock chlorination calculator); UV guide joins "Guides".
- `/water-softeners/` hub: salt types and salt bridge guides join "Guides".
- Footer Calculators column: add the shock chlorination calculator (12 calculators).
- `/well-water-test-kit/`: where it covers a positive coliform result, link "shock the well" to `/well-shock-chlorination-calculator/`.
- `/water-softener-not-working/`: in the salt-related check, link "salt bridge" to `/water-softener-salt-bridge/`.
- `/water-softener-salt-calculator/`: add `/water-softener-salt-types/` to Related (replace the weakest card).
- Embeds: no new embed this batch.

## 6. New sources (accessed 2026-10-26 unless noted)
- uga-c858-4: University of Georgia Extension C858-4, Disinfecting your well water: shock chlorination (rev. 2026-04-17): https://fieldreport.caes.uga.edu/publications/C858-4/disinfecting-your-well-water-shock-chlorination/
- nevada-fs-06-69: University of Nevada Cooperative Extension FS-06-69, Shock chlorination: estimating the amount of bleach needed: https://www.oem.nv.gov/uploadedFiles/demnvgov/content/Resources/NVCoop%20Ext_Shock%20Chlorination_Estimating%20the%20Amount%20of%20Bleach%20Needed.pdf
- wi-dnr-dg120: Wisconsin DNR DG-120, Disinfecting your well (2025): https://dnr.wisconsin.gov/sites/default/files/topic/DrinkingWater/Publications/DG120.pdf
- mdh-well-disinfection: Minnesota Department of Health, Well disinfection (2024-10-18): https://www.health.mn.gov/communities/environment/water/wells/waterquality/disinfection.html
- cdc-well-disinfection: CDC, How to disinfect wells after an emergency (2025-05-29): https://www.cdc.gov/water-emergency/about/how-to-disinfect-wells-after-an-emergency.html
- tamu-scs-2002-04: Texas A&M AgriLife SCS-2002-04, Shock chlorination of wells: https://legacy.research.agrilife.org/wp-content/uploads/sites/3/2011/10/scs-2002-04-2.pdf
- pa-dep-well-disinfection: Pennsylvania DEP, Disinfection of home wells and springs: https://www.pa.gov/agencies/dep/residents/my-water/private-wells/disinfection-of-home-wells-and-springs
- osu-oregon-shock: Oregon State University Well Water Program, Shock chlorination (2025): https://wellwater.oregonstate.edu/well-water/bacteria/shock-chlorination
- ohio-aex-318: Ohio State University AEX-318 (2019): https://ohioline.osu.edu/factsheet/aex-318
- psu-shock-chlorination: Penn State Extension, Shock chlorination of wells and springs (2025): https://extension.psu.edu/shock-chlorination-of-wells-and-springs
- psu-coliform: Penn State Extension, Coliform bacteria (2025-09-08): https://extension.psu.edu/coliform-bacteria
- angi-shock-cost: Angi, Cost to shock a well (2026-07-09): https://angi.com/articles/cost-to-shock-a-well.htm
- wsc-splashless: Water Systems Council, Well disinfection and splashless bleach (2026): https://www.watersystemscouncil.org/well-disinfection-and-splashless-bleach/
- cargill-salt-faq: Cargill, Water softener salt FAQ: https://www.cargill.com/industrial/water-softener-salt-faq
- diamond-crystal-faq: Diamond Crystal, Water softener salt FAQs: https://www.diamondcrystalsalt.com/water-softener-salt-faqs
- diamond-crystal-iron-fighter: Diamond Crystal Iron Fighter product page (find the current URL on diamondcrystalsalt.com; if not found, cite diamond-crystal-faq)
- fleck-7000sxt-manual: Pentair Fleck 7000SXT manual 42775: https://www.pentair.com/content/dam/extranet/web/nam/fleck/manuals/42775-fleck-7000sxt-manual.pdf
- ge-gxsh40v-manual: GE GXSH40V owner's manual: https://images.homedepot-static.com/catalog/pdfImages/ef/ef792180-cd7a-4017-ad70-a9888b4ab4ac.pdf
- whirlpool-whes40-manual: Whirlpool WHES40 owner's manual W11484759: https://www.whirlpool.com/content/dam/global/documents/202107/owners-manual-w11484759-reva.pdf
- culligan-troubleshooting: Culligan, Water softener troubleshooting: https://www.culligan.com/blog/water-softener-troubleshooting-common-problems-and-solutions
- culligan-best-salt: Culligan, What is the best water softener salt: https://www.culligan.com/blog/what-is-the-best-water-softener-salt
- wqa-smart-softeners: Water Quality Association, Getting smart with softeners: https://wqa.org/wp-content/uploads/2024/06/GettingSmartSofteners.pdf
- unl-g1491: University of Nebraska–Lincoln G1491, Water softening (2014): https://extensionpubs.unl.edu/publication/g1491/2014/html/view
- morton-kcl: Morton, Potassium chloride pellets: https://www.mortonsalt.com/home-product/morton-potassium-chloride-pellets
- tsc-softener-salt: Tractor Supply, Water softener salt (prices 2026-10-26): https://www.tractorsupply.com/tsc/catalog/water-softener-salt
- hd-softener-salt: Home Depot, Water softener salt (prices 2026-10-26): https://www.homedepot.com/b/Plumbing-Water-Filters-Water-Softeners-Water-Softener-Salt/N-5yc1vZc6se
- walmart-morton-pellets: Walmart, Morton Clean and Protect pellets 40 lb ($8.76): https://www.walmart.com/ip/Morton-Clean-and-Protect-Water-Softener-Pellets-40-lb/16674414
- ecopure-manual: EcoPure softener owner's manual (salt guidance); find the current PDF, or drop the EcoPure mentions.
- viqua-faq: VIQUA, FAQs (2025-10-20): https://viqua.com/resources-24/faqs/
- viqua-vh-spec: VIQUA VH200/VH410 spec sheet: https://viqua.com/wp-content/uploads/SpecSheet_VH200-F10_VH410-F20-1.pdf
- springwell-uv-manual: SpringWell UV system manual: https://www.springwellwater.com/wp-content/uploads/2019/07/Blackcomb_UV-Manual-1.pdf
- ct-dph-uv: Connecticut DPH Publication 25, UV treatment of private drinking water (2009): https://portal.ct.gov/-/media/departments-and-agencies/dph/dph/environmental_health/pdf/25ultrvioletradiationtreatmentofpdwspdf.pdf
- cdc-home-treatment: CDC, About home water treatment systems (2024-04-10): https://www.cdc.gov/drinking-water/about/about-home-water-treatment-systems.html
- ansi-nsf55-2024: ANSI blog, NSF/ANSI 55-2024 UV water treatment: https://blog.ansi.org/ansi/nsf-ansi-55-2024-ultraviolet-uv-water-treatment/
- esp-viqua-vh200: ESP Water Products, VIQUA VH200 ($685): https://espwaterproducts.com/collections/viqua-vh200-9-gpm
- homeguide-well-filtration: HomeGuide, Well water filtration system cost (2026-04-24); use the existing source if already in the registry, otherwise find the URL on homeguide.com.
- homeguide-uv: HomeGuide, UV water purifier cost (2025-09-17); find the URL on homeguide.com.
- angi-uv: Angi, UV water purifier cost (2026-09-24); find the URL on angi.com.

## 7. Definition of done
All four live, default values in static HTML, schema per fix 04 (tool: WebPage + WebApplication; guides: WebPage + Article; FAQPage on all), captions on every table, title/meta limits, heading order, no em dashes, IndexNow submits on push, PageSpeed mobile ≥ 90, CLS 0.
Report: commit, tests passed/total, photo choices, URL check results (every source URL, note any that fail), screenshots of each page at 390 px.

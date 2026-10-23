# HomeWaterMath batch 03 spec: 5 guide pages

Date: 2026-10-21. Written by: browser agent. For: the coding agent.
Everything in the main build spec still applies (A0 non-negotiables, A3 SEO limits: title ≤ 60, meta ≤ 155, A11 performance, A12 tests, A13 style, design file, photos rules, heading-order test). No em dashes. Sentence case. All exact text below is final; don't rewrite it. Where a value has a source id, add the source to `sources.ts` (section 8) and list it in the page's Sources block.

## 0. What to build

| # | URL | H1 | Category (hub) | Widget | Photo slot |
|---|---|---|---|---|---|
| 1 | `/water-softener-not-working/` | Water Softener Not Working? Find the Cause | softeners | Symptom checker | `guide-softener-troubleshoot` |
| 2 | `/iron-filter-for-well-water/` | Iron Filter for Well Water: Which Type and Size | well | Iron treatment picker | `guide-iron-filter` |
| 3 | `/how-to-test-water-hardness/` | How to Test Water Hardness at Home | softeners | Test strip reader | `guide-hardness-test` |
| 4 | `/well-water-test-kit/` | Well Water Testing: What to Test and What It Costs | well | "Do I need to test now?" checker | `guide-well-test` |
| 5 | `/how-long-do-water-softeners-last/` | How Long Do Water Softeners Last? | softeners | Repair or replace check | `guide-softener-lifespan` |

## 1. Guide page layout (new, `GuideLayout`)

Order:
1. Breadcrumbs (Home / Hub / Page).
2. H1.
3. "Last updated" + author line (same as tools, under the H1).
4. Quick answer box (mist, server-rendered, exact text below).
5. Widget card (client component, default state rendered in HTML; same card styles as calculators; result area `aria-live="polite"`).
6. Body sections: H2 + text + tables exactly as given.
7. Owner note slot (empty at launch, same as tools).
8. FAQ (accordion, all answers in HTML).
9. Related (3 cards: tools first).
10. Sources (from registry).
11. Author box.
12. Disclaimer line: "General information only. Check your equipment's manual, and use a certified lab for health-related water tests."

Schema per guide page: `Article` (headline = H1, author Person linking to author page, publisher Organization, datePublished and dateModified 2026-10-21, image = page photo or OG image) + `BreadcrumbList` + `FAQPage` (text equals visible FAQ). Not `WebApplication`.
Registry: add `type: 'guide'`. Guides appear on their hub under a new H2 "Guides" (tiles, after the calculators) and in the footer only via the hubs (don't add guides to the footer Calculators column). Homepage: no change except "Latest updates" (automatic).
Analytics: widgets fire `tool_used` (first interaction) and `tool_result_shown` with `tool` = path, same helper as tools.
Photos: coding agent picks per section 7.

---

## 2. `/water-softener-not-working/`

- Title: `Water Softener Not Working? Causes and Fixes | HomeWaterMath`
- Meta: `Why your water softener isn't softening, with fixes from Fleck, Clack and GE manuals and typical repair costs. Use the checker to find the cause.`
- Keywords: water softener repair (40,500 / KD 19), water softener not working, water softener problems (cluster ~45k).
- Related: `/how-long-do-water-softeners-last/`, `/water-softener-size-calculator/`, `/water-hardness-converter/`.

**Quick answer (exact):**
Most softeners that stop softening have one of five simple causes: no salt or a salt bridge, the bypass valve left on, a clock that lost its time after a power cut, a clogged injector or brine line, or a hardness setting that's too low. Check those first; they cost nothing to fix. A repair visit usually costs $150 to $600, and if a fix would cost more than half the price of a new softener, replacing it is usually the better deal.

**Widget: symptom checker (`lib/guides/softenerTroubleshoot.ts`)**
Input: one select "What's happening?" with these options, default the first:
1. `Water is hard again`
2. `Salt level never goes down`
3. `Brine tank is full of water`
4. `Softener runs all the time or won't stop`
5. `Water tastes salty`
6. `Low water pressure`
7. `Error code on the display`
8. `Beads or sand at the faucets`

Output: an ordered checklist for the chosen symptom (rows: Check / How / If that's it), then "Typical repair cost if you call a pro" line. Content (exact):

| Symptom | Checks in order | Pro cost line |
|---|---|---|
| 1 Water is hard again | (a) Salt: is there salt, and is it a hard crust over empty space (a salt bridge)? Break the crust with a broom handle, then start a manual regeneration. (b) Bypass: is the bypass valve in "service", not "bypass"? (c) Clock: after a power cut longer than about 8 hours, reset the time of day. (d) Hardness setting: does it match a fresh test? Set it to your hardness in gpg plus 4 for each ppm of iron. (e) Hot water during regeneration: avoid using hot water while it regenerates. (f) Injector or venturi: remove and rinse the small screen and nozzle. | "A service call is about $40 to $100; most fixes land between $150 and $600." |
| 2 Salt level never goes down | (a) Salt bridge (break it up as above). (b) Clogged injector or brine line: clean the injector screen and nozzle and check the brine line for kinks. (c) Low water pressure: many valves need at least 20 to 25 psi to draw brine. (d) Not regenerating: check the clock, the days setting and any error code. | "Injector and brine line fixes are usually under $200; a control valve repair can cost more." |
| 3 Brine tank is full of water | (a) Plugged drain line flow control or drain hose: check the hose isn't kinked, too long or raised too high. (b) Plugged injector. (c) Brine line flow control or float stuck. (d) Timer not advancing through the cycle. Normal water in the salt tank is only a few inches. | "Expect $150 to $300 for a valve cleaning or new brine parts." |
| 4 Runs all the time or won't stop | (a) Timer or control fault: unplug for 30 seconds and restart, then reset the time. (b) Motor or position error code: see the manual's code list. (c) Internal valve leak (water running to drain all the time). | "Motor and control board repairs often cost $200 to $500." |
| 5 Water tastes salty | (a) Too much water in the brine tank (see symptom 3). (b) Rinse step too short or interrupted. (c) Plugged drain line. | "Usually a cleaning or a setting change, under $200." |
| 6 Low water pressure | (a) Resin fouled with iron or sediment: clean it with a resin cleaner and check for a sediment pre-filter. (b) Resin beads in the plumbing (see symptom 8). (c) Undersized softener for your flow. | "Resin cleaning is cheap; new resin costs about $200 to $400." |
| 7 Error code | Look up the code in your manual. On Fleck 5600SXT valves, Err 2 means no regeneration in over 99 days. On Clack WS1 valves, codes E1 to E3 point to motor faults. Power-cycle once; if the code returns, call for service. | "Motor or board replacement often costs $200 to $500." |
| 8 Beads or sand at faucets | Resin beads at the taps mean a broken distributor or riser inside the resin tank. Bypass the softener and have the distributor replaced. | "Distributor or resin replacement usually costs $200 to $400." |

Note: check both error-code statements against the manuals (Fleck "Err 2" in Pentair manual 42684; Clack "E1 to E3" in Clack V3115-99). If a manual's wording differs, use the manual's exact codes and report it.

**Body (exact):**

H2 "Start with the five free checks"
Most "broken" softeners aren't broken. Before you call anyone, check these in order. They take about 15 minutes in total.
1. Salt. Look in the brine tank. If the salt looks full but the level never drops, push a broom handle down through it. A hard crust with empty space under it is a salt bridge: the softener can't make brine, so it can't regenerate.
2. Bypass. The bypass valve sits on the pipes at the back of the control valve. If it was turned during a plumbing job, water goes around the softener.
3. Clock. Fleck and Clack valves keep time for about 8 hours without power. After a longer outage they regenerate at the wrong time until you reset the time of day.
4. Hardness setting. Test your water again and compare it with the setting. Add 4 gpg for every ppm of iron.
5. Injector. The injector (venturi) is a small nozzle and screen that pulls brine from the tank. It clogs with sediment and is the most common reason a softener stops drawing salt.

H2 "Typical repair costs"
Table:
| Repair | Typical cost |
|---|---|
| Service call | $40 to $100 |
| Most repairs | $150 to $600 (average about $430) |
| Brine tank replacement | $150 to $500 |
| Resin replacement | $200 to $400 |
| Plumber labor | $45 to $150 an hour, usually 1 to 3 hours |
Caption: "HomeGuide (2025) and HomeAdvisor (2026)."

H2 "Repair or replace?"
A common rule is to replace the softener if a repair would cost more than half the price of a new one. A new softener averages about $1,500 installed, so a repair above about $750 usually isn't worth it, especially on a unit more than 10 to 15 years old. See [how long water softeners last](/how-long-do-water-softeners-last/) and price a new one with our [water softener cost calculator](/water-softener-cost/).

H2 "When to call a pro"
Call for service if water is leaking from the valve, the display shows the same error after a restart, resin beads come out of the taps, or the softener still doesn't soften after all five free checks.

**FAQ (exact):**
1. Q: Why is my water softener full of water? A: Usually a plugged injector, a blocked drain line flow control or a timer that isn't advancing. A salt tank normally holds only a few inches of water.
2. Q: Why does my softener have salt but the water is still hard? A: The most common causes are a salt bridge, the bypass valve left on, a hardness setting that's too low, or a clogged injector.
3. Q: Do I need to reset my softener after a power outage? A: Yes, if the outage lasted longer than about 8 hours. Fleck and Clack valves keep time for about 8 hours without power.
4. Q: How much does it cost to repair a water softener? A: Most repairs cost $150 to $600, about $430 on average. A service call alone is about $40 to $100.
5. Q: Should I repair or replace my water softener? A: Replace it if the repair would cost more than half the price of a new softener, which averages about $1,500 installed.
6. Q: How do I break up a salt bridge? A: Push a broom handle down through the salt to crack the crust, scoop out the loose pieces, then start a manual regeneration.

**Sources:** fleck-5600sxt-manual, clack-ws1-manual, ge-softener-manual, homeguide-softener-repair, homeadvisor-softener-repair, angi-softener-replace, morton-faq.

---

## 3. `/iron-filter-for-well-water/`

- Title: `Iron Filter for Well Water: Type and Size Picker | HomeWaterMath`
- Meta: `Pick the right iron filter for your well from your test: iron, manganese, sulfur smell, pH and flow. Treatment ranges from Penn State, MDH and spec sheets.`
- Keywords: iron filter for well water (3,600 / 19), iron water softener (880 / 4), water iron test (880 / 12).
- Related: `/water-softener-size-calculator/`, `/well-water-test-kit/`, `/whole-house-water-filter-cost/`.

**Quick answer (exact):**
Clear-water iron up to about 2 ppm can usually be handled by a water softener. From about 2 to 10 ppm, an oxidizing filter such as an air-injection or greensand-type filter is the usual choice. Above about 10 ppm of iron and manganese combined, most guides recommend chlorine or another oxidizer followed by a filter. Size the filter by your peak flow and check that your well can supply its backwash flow.

**Widget: iron treatment picker (`lib/guides/ironPicker.ts`)**
Inputs: Iron, ppm [3]; Manganese, ppm [0]; Rotten-egg smell (hydrogen sulfide): `No` / `Yes` [No]; pH [7.0]; Red or brown slime in the toilet tank: `No` / `Yes` [No]; Peak flow, gpm [9].
Logic (in this order):
```
combined = iron + manganese
if slime → note "Possible iron bacteria. Shock-chlorinate the well first; filters alone won't fix it." (always shown, then continue)
if iron <= 0.3 and manganese <= 0.05 → "Below EPA's taste and staining guideline. No iron treatment needed."
else if combined > 10 → "Chlorine (or another oxidizer) injection followed by a filter."
else if iron <= 2 and !h2s and manganese <= 0.3 → "A water softener can usually handle this, if the iron is clear-water (dissolved) iron and pH is above 6.7. Size it with the iron included."  (+ link to size calculator)
else if h2s → "Air-injection oxidizing (AIO) filter. Many are rated up to about 10 ppm iron and 3 ppm hydrogen sulfide."
else → "Air-injection oxidizing filter or a manganese dioxide (greensand-type) filter."
birmCheck: show "Birm media isn't a fit" if pH < 6.8 or h2s = Yes; otherwise "Birm media is an option (needs pH 6.8 or higher and no hydrogen sulfide)."
manganeseNote: if manganese > 0.05 → "Manganese above 0.05 ppm stains black. Oxidizing filters remove it; Birm needs pH 8 to 9 for manganese."
tank (filters only, from the Fleck AIO table): peak <= 6 → 9 x 48 in, 1 cu ft, needs 7 gpm to backwash; <= 9 → 10 x 54 in, 1.5 cu ft, 10 gpm; <= 12 → 12 x 52 in, 2 cu ft, 15 gpm; > 12 → "Larger than standard residential tanks. Ask for a commercial sizing."
backwash line: "Your well pump must supply {backwash} gpm during backwash. Check your pump's flow before you buy."
cost line (filters): "Installed iron filters usually cost $1,000 to $3,500."
```
Default render MUST show (iron 3, Mn 0, no H2S, pH 7, no slime, 9 gpm): "Air-injection oxidizing filter or a manganese dioxide (greensand-type) filter."; Birm is an option; tank 10 x 54 in, 1.5 cu ft, 10 gpm backwash; cost line.

**Body (exact):**

H2 "Which kind of iron do you have?"
Fill a clear glass from a cold tap and let it stand for a few hours.
- Clear at first, then cloudy or rusty: ferrous (clear-water) iron. Softeners and oxidizing filters can remove it.
- Red or brown right away: ferric (red-water) iron, already oxidized. It needs filtering; it fouls softener resin.
- Red or brown slime in the toilet tank: iron bacteria. They aren't harmful to people, but they make iron problems worse and clog filters. Shock-chlorinate the well first.

H2 "Treatment by iron level"
Table:
| Iron and manganese | Usual treatment | Notes |
|---|---|---|
| Under 0.3 ppm iron | None needed | EPA's taste and staining guideline is 0.3 ppm |
| Up to about 2 ppm, clear-water | Water softener | pH above 6.7; some makers allow more |
| About 2 to 10 ppm | Air-injection or greensand-type oxidizing filter | AIO filters also handle some sulfur smell |
| Over 10 ppm combined | Chlorine or other oxidizer + filter | Pressure aeration can work up to about 25 ppm |
| Under 1 ppm, high oxygen | Catalytic carbon | Needs at least 4 mg/L dissolved oxygen |
Caption: "Penn State Extension (2025), Minnesota Department of Health (2025), UMass Extension. Sources give different upper limits for softeners, from 2 to 10 ppm; we use the conservative figure."

H2 "Filter media at a glance"
| Media | Works when | Watch out for |
|---|---|---|
| Air injection (AIO) | Iron up to about 10 ppm, H2S up to about 3 ppm | Needs enough backwash flow |
| Birm | pH 6.8 or higher, oxygen at least 15% of the iron | No hydrogen sulfide or oil |
| Manganese dioxide (Katalox, greensand types) | pH about 5.8 to 10.5 | Higher backwash rate |
Caption: "Clack Birm data (2026), Fleck AIO specification (Watts, 2025), Katalox Light specification (Nelsen)."

H2 "Sizing and backwash"
Filters clean themselves by backwashing, and backwash needs more flow than normal use. A 10 x 54 inch tank with 1.5 cubic feet of media handles about 9 gpm of peak flow but needs about 10 gpm to backwash. If your pump can't supply that, the media slowly clogs. Measure your pump's flow by timing how long it takes to fill a 5-gallon bucket at an outdoor spigot.

H2 "Cost"
Installed iron and manganese filters usually cost $1,000 to $3,500. Air-injection equipment alone runs about $800 to $2,500, greensand-type filters about $600 to $1,800, and chemical feed systems $500 to $2,000 plus about $10 to $30 a month for chemicals.
Caption-free; sources HomeGuide (2026), Angi (2026).

**FAQ (exact):**
1. Q: Can a water softener remove iron? A: Yes, clear-water (dissolved) iron up to about 2 ppm on most softeners, and more on some. Red-water iron fouls the resin and needs a filter.
2. Q: Is iron in well water harmful? A: Usually not. The 0.3 ppm EPA level is a guideline for taste and staining, not health.
3. Q: What's the best iron filter for high iron? A: Above about 10 ppm of iron and manganese combined, chlorine or another oxidizer followed by a filter is the usual choice.
4. Q: Do iron bacteria make you sick? A: No, but they make iron problems worse and clog filters. Shock-chlorinate the well before installing treatment.
5. Q: How much does an iron filter cost? A: Usually $1,000 to $3,500 installed.
6. Q: Why does my iron filter need a strong well pump? A: Filters backwash to clean themselves, and that takes more flow than daily use. A 1.5 cubic foot filter needs about 10 gpm.

**Sources:** mdh-iron, psu-iron-manganese, umass-iron-manganese, ndsu-wq1031 (existing), clack-birm, watts-fleck-aio, nelsen-katalox, homeguide-well-filtration, angi-well-treatment, epa-secondary.

---

## 4. `/how-to-test-water-hardness/`

- Title: `How to Test Water Hardness at Home: 4 Ways | HomeWaterMath`
- Meta: `Test strips, drop-count kits, a lab or your utility's report: how each one works, how accurate it is and what it costs, plus a strip reading decoder.`
- Keywords: water hardness test kit (9,900 / 19), water hardness test strips (4,400 / 22), water hardness test (2,400 / 12), how to test water hardness (1,600 / 20).
- Related: `/water-hardness-converter/`, `/water-softener-size-calculator/`, `/water-softener-salt-calculator/`.

**Quick answer (exact):**
The easiest way is a hardness test strip: dip it, match the color and read a number in ppm. Strips only give a range, so for sizing a softener use a drop-count titration kit, where each drop equals 1 grain per gallon, or a lab test. On city water, your utility's yearly water quality report often lists hardness for free.

**Widget: strip reading decoder (`lib/guides/stripDecoder.ts`)**
Input: segmented "Your strip's color block" with values `0` `40` `80` `120` `180` `250` `425` `1000` ppm [120].
Logic: the true value lies between the midpoints of the neighbouring blocks: low = (prev + this)/2 (0 for the first), high = (this + next)/2 (no upper bound for 1000, show "1000+"). Convert both to gpg (÷ 17.1, 1 decimal) and give the hardness class of the block value (reuse hardness classes from the converter). Line: "For softener sizing, confirm with a drop-count kit or lab."
Default render MUST show: "120 ppm (7.0 gpg) means somewhere between 100 and 150 ppm, about 5.8 to 8.8 gpg." and class "Moderately hard" for 120 ppm on the USGS scale (61 to 120). Use the converter's existing class function and whichever scale it shows by default; report which.
Note in small text under the widget: "Block values from Industrial Test Systems WaterWorks strips. Other brands use different blocks; check your bottle."

**Body (exact):**

H2 "Four ways to test, compared"
| Method | How precise | Cost | Best for |
|---|---|---|---|
| Test strips | A range, such as 80 to 150 ppm | about $10 to $21 for 50 | A quick check |
| Drop-count titration kit | 1 gpg per drop | about $34 | Sizing a softener |
| Certified lab | Exact | varies; often part of a wider test | Wells and full water tests |
| Utility water quality report | Exact, averaged | free | City water |
Caption: "Industrial Test Systems, Hach (Oct 2026 prices from Core & Main and USABlueBook), EPA."

H2 "Using a test strip"
Dip the strip in cold water for the time on the bottle, usually a second or two, shake it once and compare the pad with the color chart right away. Use cold water from a tap that doesn't go through a softener. Strips jump between color blocks, so a reading of 120 ppm can mean anything from about 100 to 150 ppm. The decoder above shows the range for your block.

H2 "Using a drop-count kit"
Fill the tube to the line, add the buffer and indicator, then add titrant one drop at a time, swirling after each. Count the drops until the color changes from red or pink to blue. On kits like the Hach 5-B, each drop equals 1 gpg (17.1 mg/L). That's precise enough to size a softener.

H2 "Finding your city's hardness for free"
Water utilities must send customers a yearly water quality report (Consumer Confidence Report) by July 1. Many list hardness. Look up yours with EPA's [Find Your Local CCR tool](https://sdwis.epa.gov/ords/safewater/f?p=136:102) or ask your utility. Some reports list hardness in mg/L; convert it with our [hardness converter](/water-hardness-converter/).

H2 "What the number means"
| Hardness | gpg | mg/L (ppm) |
|---|---|---|
| Soft | under 1 | under 17.1 |
| Slightly hard | 1 to 3.5 | 17.1 to 60 |
| Moderately hard | 3.5 to 7 | 60 to 120 |
| Hard | 7 to 10.5 | 120 to 180 |
| Very hard | over 10.5 | over 180 |
Caption: "University of Nebraska-Lincoln Extension (2016), Water Quality Association classes. EPA has no health standard for hardness."

**FAQ (exact):**
1. Q: How accurate are water hardness test strips? A: They give a range, not an exact number. Strip colors jump in blocks, such as 80, 120 and 180 ppm, so use a drop-count kit or lab test when you need a precise figure.
2. Q: How do I convert ppm to grains per gallon? A: Divide ppm (mg/L) by 17.1. For example, 171 ppm is 10 gpg.
3. Q: What hardness level is considered hard water? A: Above 7 gpg (120 mg/L) is hard and above 10.5 gpg (180 mg/L) is very hard.
4. Q: Where can I find my city's water hardness? A: In your utility's yearly water quality report. EPA's Find Your Local CCR tool links to most of them.
5. Q: Is hard water a health concern? A: No. USGS calls it a nuisance, and EPA has no health standard for it.

**Sources:** usgs-hardness (existing), unl-g1274 (existing), hach-5b, coreandmain-5b, usabluebook-hach-strips, its-waterworks-hardness, epa-ccr, epa-ccr-lookup, morton-faq.

---

## 5. `/well-water-test-kit/`

- Title: `Well Water Testing: What to Test and Cost | HomeWaterMath`
- Meta: `What to test your well for and when, EPA limits, and what DIY kits, mail-in labs and county labs cost. Includes a quick "do I need to test now?" checker.`
- Keywords: well water test kit (8,100 / 26), water tests for wells (4,400 / 21).
- Related: `/iron-filter-for-well-water/`, `/well-pressure-tank-size-calculator/`, `/reverse-osmosis-system-cost/`.

**Quick answer (exact):**
Test a private well at least once a year for total coliform bacteria, nitrate, total dissolved solids and pH, and test again right away after a flood, well repair or a change in taste, color or smell. Use a state-certified lab for anything health-related; home kits are fine for a quick look. County health labs often charge about $20 to $50 per test, and full mail-in panels cost around $200.

**Widget: "Do I need to test now?" (`lib/guides/wellTestChecker.ts`)**
Inputs: Months since last lab test [12+] (select: `Under 12` / `12 or more` / `Never`); checkboxes: `Flooding or heavy rain near the well` / `Well repair or new pump` / `Change in taste, color or smell` / `Someone pregnant, or a baby in the home` / `Nearby construction, farming or septic work`.
Logic: if months ≥ 12 or never or any box ticked → "Yes, test now." plus list of tests: always total coliform, nitrate, pH, TDS; if baby/pregnant → add "Nitrate is the priority: babies under 6 months shouldn't drink water above 10 mg/L"; if taste/color/smell → add iron, manganese, hardness, sulfate; if flooding or repair → "Test for bacteria after disinfecting." Else → "No urgent need. Next routine test: within 12 months of your last one."
Default render MUST show (12 or more, no boxes): "Yes, test now." with the four core tests.

**Body (exact):**

H2 "What to test for"
| Test | How often | EPA limit or guide |
|---|---|---|
| Total coliform and E. coli | Every year | None should be present |
| Nitrate | Every year | 10 mg/L (as nitrogen) |
| pH | Every year | 6.5 to 8.5 (guideline) |
| Total dissolved solids | Every year | 500 mg/L (guideline) |
| Arsenic | Every 3 to 5 years, or if common locally | 0.010 mg/L |
| Lead | If you have older plumbing | 15 ppb action level, 10 ppb from Nov 1, 2027 |
| Manganese | If water stains black | 0.05 mg/L guideline; 0.3 mg/L health advisory |
| Uranium | If common locally | 30 µg/L |
| Iron, hardness | Before buying treatment | 0.3 mg/L iron guideline; no limit for hardness |
Caption: "CDC (2024), EPA (2026). EPA limits legally apply to public water systems; for private wells they're the benchmarks to use. Ask your county health department which contaminants are common where you live."

H2 "Home kit, mail-in lab or county lab?"
| Option | Cost | Good for |
|---|---|---|
| Home test kit | about $30 to $35 | A quick first look at many items; only one bacteria test |
| County or state health lab | about $20 to $50 per test | Bacteria and nitrate, certified |
| Mail-in lab panel (54 items) | about $209 | A full picture before buying treatment |
Caption: "Examples: Safe Home Ultimate (Target, Oct 2026), Dakota County MN and Ashland County WI lab fees, Tap Score Essential Well Water Test (Oct 2026). Penn State Extension puts typical bacteria tests at $20 to $40."
Text under the table: Use a lab certified by your state for anything that affects health. EPA keeps a [list of state certification programs](https://www.epa.gov/dwlabcert/contact-information-certification-programs-and-certified-laboratories-drinking-water), and your county health department can usually take samples or sell a sample kit.

H2 "When to test again right away"
Test again, even if you tested this year, after flooding near the well, after any well repair or new pump, when the water's taste, color or smell changes, when someone in the home is pregnant or a baby arrives, or after nearby construction, farming or septic work. If a test finds bacteria, disinfect the well and test again.

**FAQ (exact):**
1. Q: How often should I test my well water? A: At least once a year for total coliform bacteria, nitrate, total dissolved solids and pH, and again after floods, repairs or changes in taste, color or smell.
2. Q: Are home well water test kits accurate? A: They're useful for a quick look, but for health-related results use a state-certified lab. Many home kits include only one bacteria test.
3. Q: What is a safe nitrate level in well water? A: Below 10 mg/L (as nitrogen), EPA's limit. Babies under 6 months shouldn't drink water above that level.
4. Q: How much does it cost to test well water? A: County health labs often charge about $20 to $50 per test, and a full mail-in panel costs around $200.
5. Q: Where can I get my well water tested? A: At a lab certified by your state. EPA lists each state's certification program, and county health departments often run or recommend a lab.

**Sources:** cdc-well-testing, epa-private-wells-protect, epa-lab-cert, epa-npdwr, epa-secondary, mass-manganese, psu-private-water-faq, tapscore-essential, safehome-target, dakota-county-wells, ashland-county-wells, govinfo-lcri.

---

## 6. `/how-long-do-water-softeners-last/`

- Title: `How Long Do Water Softeners Last? Life by Part | HomeWaterMath`
- Meta: `Water softeners last about 10 to 15 years. What wears out first, how chlorine and iron shorten resin life, warranty terms, and when to replace.`
- Keywords: how long do water softeners last (1,300 / 4), how long does a water softener last (880 / 5).
- Related: `/water-softener-cost/`, `/water-softener-not-working/`, `/water-softener-size-calculator/`.

**Quick answer (exact):**
Most water softeners last about 10 to 15 years, and well-kept units can reach 20. The resin usually lasts more than 10 years on clean water but wears out faster on chlorinated city water or water with iron. The control valve is often the first major part to fail, and many valves carry a 5-year warranty. If a repair would cost more than half the price of a new unit, replacing it usually makes more sense.

**Widget: repair or replace check (`lib/guides/repairOrReplace.ts`)**
Inputs: Softener age, years [12]; Repair quote, $ [500]; Price of a new softener, $ [1,500] (helper: "About $1,500 installed on average; see our cost calculator.").
Logic: ratio = repair / newPrice. If ratio > 0.5 → "Replace: the repair is {pct}% of a new softener." Else if age >= 15 → "Consider replacing: the repair is only {pct}% of a new unit, but at {age} years other parts may follow." Else if age >= 10 → "Repair, but start budgeting: the repair is {pct}% of a new softener, and at {age} years the softener is in its last third." Else → "Repair: the repair is {pct}% of a new softener and the unit is {age} years old."
Default render MUST show: "Repair, but start budgeting: the repair is 33% of a new softener, and at 12 years the softener is in its last third."

**Body (exact):**

H2 "How long each part lasts"
| Part | Typical life | Notes |
|---|---|---|
| Whole softener | 10 to 15 years, up to 20 | With regular salt and maintenance |
| Resin | over 10 years on clean water | Shorter with chlorine or iron |
| Control valve | often 5 to 15 years | Seals, motor and board wear |
| Resin tank | 10 years to lifetime | Fiberglass tanks rarely fail |
| Brine tank | 10 years or more | Cheap to replace |
Caption: "HomeGuide (2025), Angi (2026), InterNACHI, Purolite; warranty terms below."

H2 "What shortens resin life"
Chlorine is the main one. Purolite, a resin maker, says each 1 ppm of chlorine can cut resin life by about half, and the University of Minnesota notes that 2 ppm can halve it. City water usually carries some chlorine, so a carbon filter before the softener can help. Iron also fouls resin; softeners handle up to about 2 to 3 ppm, and higher levels need an [iron filter](/iron-filter-for-well-water/). Resin with a higher crosslink (10% instead of 8%) resists chlorine better, though makers don't publish how many extra years it adds.

H2 "Warranty terms (examples)"
| Brand | Valve | Resin tank | Brine tank |
|---|---|---|---|
| Fleck (Pentair) | 5 years | 5 to 10 years | 5 years |
| Clack WS1 | 5 years | n/a (valve only) | n/a |
| EcoWater ESS1152 | 3 years | lifetime (original owner) | 10 years |
| Whirlpool WHES48 | 3 years (board), 2 years parts and labor | 10 years | 10 years |
Caption: "Manufacturer warranty documents, checked Oct 2026. Terms change; read your own warranty."

H2 "Signs your softener is wearing out"
Hard water even with salt in the tank, stiff laundry and spotty dishes, a softener that regenerates constantly or never, a brine tank that's too full or empty, salty-tasting water, resin beads at the faucets, low water pressure and leaks. Work through the free checks in our [troubleshooting guide](/water-softener-not-working/) first; many of these have simple fixes.

H2 "Replace the resin or the whole unit?"
If the valve and tanks are sound and only the resin is worn, new resin costs about $200 to $400 installed. HomeGuide suggests replacing resin every 10 or more years on city water, or every 5 to 10 years on wells with iron or manganese. If the valve is failing too, a new softener is usually the better buy; price one with our [water softener cost calculator](/water-softener-cost/).

**FAQ (exact):**
1. Q: How long does a water softener last? A: Usually 10 to 15 years, and up to 20 with good maintenance.
2. Q: How long does water softener resin last? A: More than 10 years on clean water, less on chlorinated water or water with iron.
3. Q: Does chlorine damage softener resin? A: Yes. A resin maker says each 1 ppm of chlorine can cut resin life by about half.
4. Q: How much does it cost to replace softener resin? A: About $200 to $400.
5. Q: When should I replace my water softener? A: When a repair would cost more than half the price of a new one, or when an older unit keeps needing repairs.

**Sources:** internachi-life, homeguide-softener-repair, angi-softener-replace, purolite-resin-life, umn-softening, resintech-cg10, pentair-warranty, clack-ws1-manual, ecowater-ess1152, whirlpool-whes48-warranty.

---

## 7. Photos (you pick, per `homewatermath-batch-02-photos.md` rules)

| Slot | What to show | Avoid |
|---|---|---|
| guide-softener-troubleshoot | A brine tank or softener in a utility room, or hands checking a salt tank | Brand names on the unit |
| guide-iron-filter | Orange iron staining in a sink, tub or toilet bowl, or rusty-looking water in a glass | Dirty or gross-looking scenes |
| guide-hardness-test | A test strip or test tube with a water sample, or a glass of tap water held up to light | Lab scenes already used on the hardness converter |
| guide-well-test | A water sample bottle or someone filling a glass from an outdoor or kitchen tap in a rural home | Faces as the subject |
| guide-softener-lifespan | An older softener and brine tank in a basement, or a calendar/time concept with plumbing | Product shots with logos |

If nothing fits a slot, leave the mist square and say so.

## 8. New sources (accessed 2026-10-21 unless noted)

- fleck-5600sxt-manual: Pentair Fleck 5600SXT Downflow manual 42684 Rev L: https://www.pentair.com/content/dam/extranet/web/nam/fleck/manuals/42684-fleck-5600sxt-downflow-manual.pdf
- clack-ws1-manual: Clack WS1 drawings and service manual V3115-99 (2025-10-24): https://www.clackcorp.com/wp-content/uploads/2026/01/V3115-99-WS1-1.25-DRAWINGS-AND-SERVICE-MANUAL.pdf
- ge-softener-manual: GE GXSH40V owner's manual: https://images.homedepot-static.com/catalog/pdfImages/32/3298dd24-6d0d-4971-84e1-97c689100340.pdf
- homeguide-softener-repair: HomeGuide, Water Softener Repair Cost (2025-07-14): https://homeguide.com/costs/water-softener-repair-cost
- homeadvisor-softener-repair: HomeAdvisor, Water Treatment System Repair Cost (2026-06-19): https://www.homeadvisor.com/cost/environmental-safety/repair-a-water-treatment-and-purification-system
- angi-softener-replace: Angi, Should I Repair or Replace My Water Softener? (2026-07-09): https://www.angi.com/articles/should-i-repair-or-replace-my-water-softener.htm
- morton-faq: Morton Salt, Water Softener FAQ (2026-09-30): https://www.mortonsalt.com/article/morton-water-softeners-faq/
- mdh-iron: Minnesota Department of Health, Iron in Well Water (2025-08-01): https://www.health.state.mn.us/communities/environment/water/wells/waterquality/iron.html
- psu-iron-manganese: Penn State Extension, Iron and Manganese in Private Water Systems (2025-05-29): https://extension.psu.edu/iron-and-manganese-in-private-water-systems
- umass-iron-manganese: UMass Extension, Iron and Manganese in Private Drinking Water Wells: https://www.umass.edu/agriculture-food-environment/cafe/fact-sheets/iron-manganese-in-private-drinking-water-wells
- clack-birm: Clack, Birm filter media (2026-01-16): https://www.clackcorp.com/filter-media/birm-2/
- watts-fleck-aio: Watts/Fleck AIO filter specification (2025): https://www.watts.com/dfsmedia/0533dbba17714b1ab581ab07a4cbb521/668054-source/639087482760000000/es-wq-fllaio-125-2552.pdf
- nelsen-katalox: Nelsen, Katalox Light specifications: https://www.nelsencorp.com/customer/docs/skudocs/KATALOX_Product%20Specs.pdf
- homeguide-well-filtration: HomeGuide, Well Water Filtration System Cost (2026-04-24): https://homeguide.com/costs/well-water-filtration-system-cost
- angi-well-treatment: Angi, Well Water Treatment Systems Cost (2026-05-02): https://www.angi.com/articles/well-water-treatment-systems-cost.htm
- epa-secondary: EPA, Secondary Drinking Water Standards (2026-05-26): https://www.epa.gov/sdwa/secondary-drinking-water-standards-guidance-nuisance-chemicals
- hach-5b: Hach, Total Hardness Test Kit Model 5-B (145300): https://www.hach.com/p-dropcount-titration-test-kits/145300
- coreandmain-5b: Core & Main, Hach 5-B kit listing ($34.25): https://supply.coreandmain.com/Hach-Total-Hardness-Test-Kit-Model-5-B-145300
- usabluebook-hach-strips: USABlueBook, Hach total hardness test strips 0-425 mg/L ($20.39): https://usabluebook.com/lab-instruments-equipment-supplies/additional-testing-parameters/hardness-testing/hach-total-hardness-test-strips-0-425-mg-3-l-50-3-41266
- its-waterworks-hardness: Industrial Test Systems, WaterWorks Total Hardness strips ($10.49 / 50): https://sensafe.com/waterworks-total-hardness/
- epa-ccr: EPA, Consumer Confidence Reports (2026-09-09): https://www.epa.gov/ccr
- epa-ccr-lookup: EPA, Find Your Local CCR: https://sdwis.epa.gov/ords/safewater/f?p=136:102
- cdc-well-testing: CDC, Guidelines for Testing Well Water (2024-07-01): https://www.cdc.gov/drinking-water/safety/guidelines-for-testing-well-water.html
- epa-private-wells-protect: EPA, Protect Your Home's Water (2026-02-26): https://www.epa.gov/privatewells/protect-your-homes-water
- epa-lab-cert: EPA, State drinking water lab certification contacts (2026-08-11): https://www.epa.gov/dwlabcert/contact-information-certification-programs-and-certified-laboratories-drinking-water
- epa-npdwr: EPA, National Primary Drinking Water Regulations (2026-08-31): https://www.epa.gov/ground-water-and-drinking-water/national-primary-drinking-water-regulations
- govinfo-lcri: Federal Register, Lead and Copper Rule Improvements (2024-10-30): https://govinfo.gov/content/pkg/FR-2024-10-30/pdf/2024-23549.pdf
- mass-manganese: MassDEP, Manganese in Drinking Water: https://www.mass.gov/info-details/manganese-in-drinking-water
- psu-private-water-faq: Penn State Extension, Private Water Systems FAQs (2025-10-13): https://extension.psu.edu/private-water-systems-faqs
- tapscore-essential: Tap Score, Essential Well Water Test ($209): https://mytapscore.com/products/essential-well-water-test
- safehome-target: Target, Safe Home Ultimate DIY Water Test Kit ($29.99): https://www.target.com/p/safe-home-ultimate-diy-water-test-kit/-/A-90275482
- dakota-county-wells: Dakota County MN, Testing Wells (2026-08-19): https://dakotacountymn.gov/residents/land-water/wells-drinking-water/testing-wells
- ashland-county-wells: Ashland County WI, Well Water Testing: https://ashlandcountywi.gov/wellwatertesting
- internachi-life: InterNACHI, Standard Estimated Life Expectancy Chart: https://www.nachi.org/life-expectancy.htm
- purolite-resin-life: Purolite, Factors affecting softening resin performance and life: https://www.purolite.com/ja/index/core-technologies/application/softening/factors-effect-softening-resin-performance-life
- umn-softening: University of Minnesota Water Resources Center, Residential Softening: https://wrc.umn.edu/residentialsoftening
- resintech-cg10: ResinTech CG10: https://www.resintech.com/products/sac-resins/cg10
- pentair-warranty: Pentair, Water Softener Components Warranty (Rev P 2026): https://www.pentair.com/content/dam/extranet/web/nam/pentair/business-documents/40957-pws-components-warranty.pdf
- ecowater-ess1152: EcoWater ESS1152 spec sheet: https://www.ecowater.com/wp-content/uploads/2024/01/0602982_ESS1152SpecSheet.pdf
- whirlpool-whes48-warranty: Whirlpool WHES48 warranty (Lowe's PDF): https://pdf.lowes.com/productdocuments/4495683a-7173-4673-8971-d537e675aa9f/69908253.pdf

Run the same URL check script as batch 02 and report non-200s (403 from bot-blocking sites is expected).

## 9. Definition of done

- 5 guides live with the exact text, widgets render their default results in static HTML, hub "Guides" sections added, registry/sitemap/llms.txt updated, IndexNow submits on push.
- Schema: Article + BreadcrumbList + FAQPage valid; FAQ text equals schema.
- Tests: widget logic (min 6 tests per widget, including the default render values), heading order, title/meta limits, no em dashes.
- PageSpeed mobile ≥ 90, CLS 0, no horizontal scroll at 360/390/768/1280.
- Report: commit, tests passed/total, the Clack error-code check result, the strip decoder hardness scale used, photo choices (page, photographer, size, alt, focal, why), URL check results, screenshots of each guide at 390 px.

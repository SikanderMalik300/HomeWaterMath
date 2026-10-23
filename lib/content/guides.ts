// Exact copy for the batch-03 guide pages, plus the text shown by their
// widgets. Text is final and copied word for word. No em dashes.

import type { SimpleTable, FaqItem } from './types';

export type GuideBlock =
  | { kind: 'p'; text: string }
  | { kind: 'ol'; items: string[] }
  | { kind: 'ul'; items: string[] }
  | { kind: 'h2'; text: string }
  | { kind: 'table'; table: SimpleTable };

export interface GuideCopy {
  quickAnswer: string;
  body: GuideBlock[];
  faq: FaqItem[];
}

// ===========================================================================
// 1. Water softener not working
// ===========================================================================

export interface Symptom {
  id: number;
  label: string;
  checks: string;
  proCost: string;
}

export const SOFTENER_SYMPTOMS: Symptom[] = [
  {
    id: 1,
    label: 'Water is hard again',
    checks:
      '(a) Salt: is there salt, and is it a hard crust over empty space (a salt bridge)? Break the crust with a broom handle, then start a manual regeneration. (b) Bypass: is the bypass valve in "service", not "bypass"? (c) Clock: after a power cut longer than about 8 hours, reset the time of day. (d) Hardness setting: does it match a fresh test? Set it to your hardness in gpg plus 4 for each ppm of iron. (e) Hot water during regeneration: avoid using hot water while it regenerates. (f) Injector or venturi: remove and rinse the small screen and nozzle.',
    proCost: 'A service call is about $40 to $100; most fixes land between $150 and $600.',
  },
  {
    id: 2,
    label: 'Salt level never goes down',
    checks:
      '(a) Salt bridge (break it up as above). (b) Clogged injector or brine line: clean the injector screen and nozzle and check the brine line for kinks. (c) Low water pressure: many valves need at least 20 to 25 psi to draw brine. (d) Not regenerating: check the clock, the days setting and any error code.',
    proCost: 'Injector and brine line fixes are usually under $200; a control valve repair can cost more.',
  },
  {
    id: 3,
    label: 'Brine tank is full of water',
    checks:
      "(a) Plugged drain line flow control or drain hose: check the hose isn't kinked, too long or raised too high. (b) Plugged injector. (c) Brine line flow control or float stuck. (d) Timer not advancing through the cycle. Normal water in the salt tank is only a few inches.",
    proCost: 'Expect $150 to $300 for a valve cleaning or new brine parts.',
  },
  {
    id: 4,
    label: "Softener runs all the time or won't stop",
    checks:
      '(a) Timer or control fault: unplug for 30 seconds and restart, then reset the time. (b) Motor or position error code: see the manual\'s code list. (c) Internal valve leak (water running to drain all the time).',
    proCost: 'Motor and control board repairs often cost $200 to $500.',
  },
  {
    id: 5,
    label: 'Water tastes salty',
    checks:
      '(a) Too much water in the brine tank (see symptom 3). (b) Rinse step too short or interrupted. (c) Plugged drain line.',
    proCost: 'Usually a cleaning or a setting change, under $200.',
  },
  {
    id: 6,
    label: 'Low water pressure',
    checks:
      '(a) Resin fouled with iron or sediment: clean it with a resin cleaner and check for a sediment pre-filter. (b) Resin beads in the plumbing (see symptom 8). (c) Undersized softener for your flow.',
    proCost: 'Resin cleaning is cheap; new resin costs about $200 to $400.',
  },
  {
    id: 7,
    label: 'Error code on the display',
    checks:
      'Look up the code in your manual. On Fleck 5600SXT valves, Err 2 means no regeneration in over 99 days. On Clack WS1 valves, codes E1 to E3 point to motor faults. Power-cycle once; if the code returns, call for service.',
    proCost: 'Motor or board replacement often costs $200 to $500.',
  },
  {
    id: 8,
    label: 'Beads or sand at the faucets',
    checks:
      'Resin beads at the taps mean a broken distributor or riser inside the resin tank. Bypass the softener and have the distributor replaced.',
    proCost: 'Distributor or resin replacement usually costs $200 to $400.',
  },
];

export const SOFTENER_NOT_WORKING: GuideCopy = {
  quickAnswer:
    "Most softeners that stop softening have one of five simple causes: no salt or a salt bridge, the bypass valve left on, a clock that lost its time after a power cut, a clogged injector or brine line, or a hardness setting that's too low. Check those first; they cost nothing to fix. A repair visit usually costs $150 to $600, and if a fix would cost more than half the price of a new softener, replacing it is usually the better deal.",
  body: [
    { kind: 'h2', text: 'Start with the five free checks' },
    { kind: 'p', text: "Most \"broken\" softeners aren't broken. Before you call anyone, check these in order. They take about 15 minutes in total." },
    {
      kind: 'ol',
      items: [
        "Salt. Look in the brine tank. If the salt looks full but the level never drops, push a broom handle down through it. A hard crust with empty space under it is a salt bridge: the softener can't make brine, so it can't regenerate.",
        'Bypass. The bypass valve sits on the pipes at the back of the control valve. If it was turned during a plumbing job, water goes around the softener.',
        'Clock. Fleck and Clack valves keep time for about 8 hours without power. After a longer outage they regenerate at the wrong time until you reset the time of day.',
        'Hardness setting. Test your water again and compare it with the setting. Add 4 gpg for every ppm of iron.',
        'Injector. The injector (venturi) is a small nozzle and screen that pulls brine from the tank. It clogs with sediment and is the most common reason a softener stops drawing salt.',
      ],
    },
    { kind: 'h2', text: 'Typical repair costs' },
    {
      kind: 'table',
      table: {
        caption: 'Typical water softener repair costs',
        captionBelow: 'HomeGuide (2025) and HomeAdvisor (2026).',
        headers: ['Repair', 'Typical cost'],
        rows: [
          ['Service call', '$40 to $100'],
          ['Most repairs', '$150 to $600 (average about $430)'],
          ['Brine tank replacement', '$150 to $500'],
          ['Resin replacement', '$200 to $400'],
          ['Plumber labor', '$45 to $150 an hour, usually 1 to 3 hours'],
        ],
      },
    },
    { kind: 'h2', text: 'Repair or replace?' },
    { kind: 'p', text: 'A common rule is to replace the softener if a repair would cost more than half the price of a new one. A new softener averages about $1,500 installed, so a repair above about $750 usually isn\'t worth it, especially on a unit more than 10 to 15 years old. See [how long water softeners last](/how-long-do-water-softeners-last/) and price a new one with our [water softener cost calculator](/water-softener-cost/).' },
    { kind: 'h2', text: 'When to call a pro' },
    { kind: 'p', text: 'Call for service if water is leaking from the valve, the display shows the same error after a restart, resin beads come out of the taps, or the softener still doesn\'t soften after all five free checks.' },
  ],
  faq: [
    { q: 'Why is my water softener full of water?', a: "Usually a plugged injector, a blocked drain line flow control or a timer that isn't advancing. A salt tank normally holds only a few inches of water." },
    { q: 'Why does my softener have salt but the water is still hard?', a: 'The most common causes are a salt bridge, the bypass valve left on, a hardness setting that\'s too low, or a clogged injector.' },
    { q: 'Do I need to reset my softener after a power outage?', a: 'Yes, if the outage lasted longer than about 8 hours. Fleck and Clack valves keep time for about 8 hours without power.' },
    { q: 'How much does it cost to repair a water softener?', a: 'Most repairs cost $150 to $600, about $430 on average. A service call alone is about $40 to $100.' },
    { q: 'Should I repair or replace my water softener?', a: 'Replace it if the repair would cost more than half the price of a new softener, which averages about $1,500 installed.' },
    { q: 'How do I break up a salt bridge?', a: 'Push a broom handle down through the salt to crack the crust, scoop out the loose pieces, then start a manual regeneration.' },
  ],
};

// ===========================================================================
// 2. Iron filter for well water
// ===========================================================================

export const IRON_FILTER: GuideCopy = {
  quickAnswer:
    'Clear-water iron up to about 2 ppm can usually be handled by a water softener. From about 2 to 10 ppm, an oxidizing filter such as an air-injection or greensand-type filter is the usual choice. Above about 10 ppm of iron and manganese combined, most guides recommend chlorine or another oxidizer followed by a filter. Size the filter by your peak flow and check that your well can supply its backwash flow.',
  body: [
    { kind: 'h2', text: 'Which kind of iron do you have?' },
    { kind: 'p', text: 'Fill a clear glass from a cold tap and let it stand for a few hours.' },
    {
      kind: 'ul',
      items: [
        'Clear at first, then cloudy or rusty: ferrous (clear-water) iron. Softeners and oxidizing filters can remove it.',
        'Red or brown right away: ferric (red-water) iron, already oxidized. It needs filtering; it fouls softener resin.',
        'Red or brown slime in the toilet tank: iron bacteria. They aren\'t harmful to people, but they make iron problems worse and clog filters. Shock-chlorinate the well first.',
      ],
    },
    { kind: 'h2', text: 'Treatment by iron level' },
    {
      kind: 'table',
      table: {
        caption: 'Treatment by iron and manganese level',
        captionBelow: "Penn State Extension (2025), Minnesota Department of Health (2025), UMass Extension. Sources give different upper limits for softeners, from 2 to 10 ppm; we use the conservative figure.",
        headers: ['Iron and manganese', 'Usual treatment', 'Notes'],
        rows: [
          ['Under 0.3 ppm iron', 'None needed', "EPA's taste and staining guideline is 0.3 ppm"],
          ['Up to about 2 ppm, clear-water', 'Water softener', 'pH above 6.7; some makers allow more'],
          ['About 2 to 10 ppm', 'Air-injection or greensand-type oxidizing filter', 'AIO filters also handle some sulfur smell'],
          ['Over 10 ppm combined', 'Chlorine or other oxidizer + filter', 'Pressure aeration can work up to about 25 ppm'],
          ['Under 1 ppm, high oxygen', 'Catalytic carbon', 'Needs at least 4 mg/L dissolved oxygen'],
        ],
      },
    },
    { kind: 'h2', text: 'Filter media at a glance' },
    {
      kind: 'table',
      table: {
        caption: 'Filter media at a glance',
        captionBelow: 'Clack Birm data (2026), Fleck AIO specification (Watts, 2025), Katalox Light specification (Nelsen).',
        headers: ['Media', 'Works when', 'Watch out for'],
        rows: [
          ['Air injection (AIO)', 'Iron up to about 10 ppm, H2S up to about 3 ppm', 'Needs enough backwash flow'],
          ['Birm', 'pH 6.8 or higher, oxygen at least 15% of the iron', 'No hydrogen sulfide or oil'],
          ['Manganese dioxide (Katalox, greensand types)', 'pH about 5.8 to 10.5', 'Higher backwash rate'],
        ],
      },
    },
    { kind: 'h2', text: 'Sizing and backwash' },
    { kind: 'p', text: 'Filters clean themselves by backwashing, and backwash needs more flow than normal use. A 10 x 54 inch tank with 1.5 cubic feet of media handles about 9 gpm of peak flow but needs about 10 gpm to backwash. If your pump can\'t supply that, the media slowly clogs. Measure your pump\'s flow by timing how long it takes to fill a 5-gallon bucket at an outdoor spigot.' },
    { kind: 'h2', text: 'Cost' },
    { kind: 'p', text: 'Installed iron and manganese filters usually cost $1,000 to $3,500. Air-injection equipment alone runs about $800 to $2,500, greensand-type filters about $600 to $1,800, and chemical feed systems $500 to $2,000 plus about $10 to $30 a month for chemicals.' },
  ],
  faq: [
    { q: 'Can a water softener remove iron?', a: 'Yes, clear-water (dissolved) iron up to about 2 ppm on most softeners, and more on some. Red-water iron fouls the resin and needs a filter.' },
    { q: 'Is iron in well water harmful?', a: 'Usually not. The 0.3 ppm EPA level is a guideline for taste and staining, not health.' },
    { q: "What's the best iron filter for high iron?", a: 'Above about 10 ppm of iron and manganese combined, chlorine or another oxidizer followed by a filter is the usual choice.' },
    { q: 'Do iron bacteria make you sick?', a: 'No, but they make iron problems worse and clog filters. Shock-chlorinate the well before installing treatment.' },
    { q: 'How much does an iron filter cost?', a: 'Usually $1,000 to $3,500 installed.' },
    { q: 'Why does my iron filter need a strong well pump?', a: 'Filters backwash to clean themselves, and that takes more flow than daily use. A 1.5 cubic foot filter needs about 10 gpm.' },
  ],
};

// ===========================================================================
// 3. How to test water hardness
// ===========================================================================

export const HARDNESS_TEST: GuideCopy = {
  quickAnswer:
    "The easiest way is a hardness test strip: dip it, match the color and read a number in ppm. Strips only give a range, so for sizing a softener use a drop-count titration kit, where each drop equals 1 grain per gallon, or a lab test. On city water, your utility's yearly water quality report often lists hardness for free.",
  body: [
    { kind: 'h2', text: 'Four ways to test, compared' },
    {
      kind: 'table',
      table: {
        caption: 'Four ways to test water hardness, compared',
        captionBelow: 'Industrial Test Systems, Hach (Oct 2026 prices from Core & Main and USABlueBook), EPA.',
        headers: ['Method', 'How precise', 'Cost', 'Best for'],
        rows: [
          ['Test strips', 'A range, such as 80 to 150 ppm', 'about $10 to $21 for 50', 'A quick check'],
          ['Drop-count titration kit', '1 gpg per drop', 'about $34', 'Sizing a softener'],
          ['Certified lab', 'Exact', 'varies; often part of a wider test', 'Wells and full water tests'],
          ['Utility water quality report', 'Exact, averaged', 'free', 'City water'],
        ],
      },
    },
    { kind: 'h2', text: 'Using a test strip' },
    { kind: 'p', text: "Dip the strip in cold water for the time on the bottle, usually a second or two, shake it once and compare the pad with the color chart right away. Use cold water from a tap that doesn't go through a softener. Strips jump between color blocks, so a reading of 120 ppm can mean anything from about 100 to 150 ppm. The decoder above shows the range for your block." },
    { kind: 'h2', text: 'Using a drop-count kit' },
    { kind: 'p', text: 'Fill the tube to the line, add the buffer and indicator, then add titrant one drop at a time, swirling after each. Count the drops until the color changes from red or pink to blue. On kits like the Hach 5-B, each drop equals 1 gpg (17.1 mg/L). That\'s precise enough to size a softener.' },
    { kind: 'h2', text: "Finding your city's hardness for free" },
    { kind: 'p', text: 'Water utilities must send customers a yearly water quality report (Consumer Confidence Report) by July 1. Many list hardness. Look up yours with EPA\'s [Find Your Local CCR tool](https://sdwis.epa.gov/ords/safewater/f?p=136:102) or ask your utility. Some reports list hardness in mg/L; convert it with our [hardness converter](/water-hardness-converter/).' },
    { kind: 'h2', text: 'What the number means' },
    {
      kind: 'table',
      table: {
        caption: 'What the hardness number means',
        captionBelow: 'University of Nebraska-Lincoln Extension (2016), Water Quality Association classes. EPA has no health standard for hardness.',
        headers: ['Hardness', 'gpg', 'mg/L (ppm)'],
        rows: [
          ['Soft', 'under 1', 'under 17.1'],
          ['Slightly hard', '1 to 3.5', '17.1 to 60'],
          ['Moderately hard', '3.5 to 7', '60 to 120'],
          ['Hard', '7 to 10.5', '120 to 180'],
          ['Very hard', 'over 10.5', 'over 180'],
        ],
      },
    },
  ],
  faq: [
    { q: 'How accurate are water hardness test strips?', a: 'They give a range, not an exact number. Strip colors jump in blocks, such as 80, 120 and 180 ppm, so use a drop-count kit or lab test when you need a precise figure.' },
    { q: 'How do I convert ppm to grains per gallon?', a: 'Divide ppm (mg/L) by 17.1. For example, 171 ppm is 10 gpg.' },
    { q: 'What hardness level is considered hard water?', a: 'Above 7 gpg (120 mg/L) is hard and above 10.5 gpg (180 mg/L) is very hard.' },
    { q: "Where can I find my city's water hardness?", a: "In your utility's yearly water quality report. EPA's Find Your Local CCR tool links to most of them." },
    { q: 'Is hard water a health concern?', a: 'No. USGS calls it a nuisance, and EPA has no health standard for it.' },
  ],
};

// ===========================================================================
// 4. Well water test kit
// ===========================================================================

export const WELL_TEST: GuideCopy = {
  quickAnswer:
    'Test a private well at least once a year for total coliform bacteria, nitrate, total dissolved solids and pH, and test again right away after a flood, well repair or a change in taste, color or smell. Use a state-certified lab for anything health-related; home kits are fine for a quick look. County health labs often charge about $20 to $50 per test, and full mail-in panels cost around $200.',
  body: [
    { kind: 'h2', text: 'What to test for' },
    {
      kind: 'table',
      table: {
        caption: 'What to test a private well for',
        captionBelow: "CDC (2024), EPA (2026). EPA limits legally apply to public water systems; for private wells they're the benchmarks to use. Ask your county health department which contaminants are common where you live.",
        headers: ['Test', 'How often', 'EPA limit or guide'],
        rows: [
          ['Total coliform and E. coli', 'Every year', 'None should be present'],
          ['Nitrate', 'Every year', '10 mg/L (as nitrogen)'],
          ['pH', 'Every year', '6.5 to 8.5 (guideline)'],
          ['Total dissolved solids', 'Every year', '500 mg/L (guideline)'],
          ['Arsenic', 'Every 3 to 5 years, or if common locally', '0.010 mg/L'],
          ['Lead', 'If you have older plumbing', '15 ppb action level, 10 ppb from Nov 1, 2027'],
          ['Manganese', 'If water stains black', '0.05 mg/L guideline; 0.3 mg/L health advisory'],
          ['Uranium', 'If common locally', '30 µg/L'],
          ['Iron, hardness', 'Before buying treatment', '0.3 mg/L iron guideline; no limit for hardness'],
        ],
      },
    },
    { kind: 'h2', text: 'Home kit, mail-in lab or county lab?' },
    {
      kind: 'table',
      table: {
        caption: 'Home kit, mail-in lab or county lab',
        captionBelow: 'Examples: Safe Home Ultimate (Target, Oct 2026), Dakota County MN and Ashland County WI lab fees, Tap Score Essential Well Water Test (Oct 2026). Penn State Extension puts typical bacteria tests at $20 to $40.',
        headers: ['Option', 'Cost', 'Good for'],
        rows: [
          ['Home test kit', 'about $30 to $35', 'A quick first look at many items; only one bacteria test'],
          ['County or state health lab', 'about $20 to $50 per test', 'Bacteria and nitrate, certified'],
          ['Mail-in lab panel (54 items)', 'about $209', 'A full picture before buying treatment'],
        ],
      },
    },
    { kind: 'p', text: 'Use a lab certified by your state for anything that affects health. EPA keeps a [list of state certification programs](https://www.epa.gov/dwlabcert/contact-information-certification-programs-and-certified-laboratories-drinking-water), and your county health department can usually take samples or sell a sample kit.' },
    { kind: 'h2', text: 'When to test again right away' },
    { kind: 'p', text: "Test again, even if you tested this year, after flooding near the well, after any well repair or new pump, when the water's taste, color or smell changes, when someone in the home is pregnant or a baby arrives, or after nearby construction, farming or septic work. If a test finds bacteria, disinfect the well and test again." },
  ],
  faq: [
    { q: 'How often should I test my well water?', a: 'At least once a year for total coliform bacteria, nitrate, total dissolved solids and pH, and again after floods, repairs or changes in taste, color or smell.' },
    { q: 'Are home well water test kits accurate?', a: "They're useful for a quick look, but for health-related results use a state-certified lab. Many home kits include only one bacteria test." },
    { q: 'What is a safe nitrate level in well water?', a: "Below 10 mg/L (as nitrogen), EPA's limit. Babies under 6 months shouldn't drink water above that level." },
    { q: 'How much does it cost to test well water?', a: 'County health labs often charge about $20 to $50 per test, and a full mail-in panel costs around $200.' },
    { q: 'Where can I get my well water tested?', a: 'At a lab certified by your state. EPA lists each state\'s certification program, and county health departments often run or recommend a lab.' },
  ],
};

export const WELL_TEST_CORE = ['total coliform', 'nitrate', 'pH', 'total dissolved solids (TDS)'];

// ===========================================================================
// 5. How long do water softeners last
// ===========================================================================

export const SOFTENER_LIFESPAN: GuideCopy = {
  quickAnswer:
    'Most water softeners last about 10 to 15 years, and well-kept units can reach 20. The resin usually lasts more than 10 years on clean water but wears out faster on chlorinated city water or water with iron. The control valve is often the first major part to fail, and many valves carry a 5-year warranty. If a repair would cost more than half the price of a new unit, replacing it usually makes more sense.',
  body: [
    { kind: 'h2', text: 'How long each part lasts' },
    {
      kind: 'table',
      table: {
        caption: 'How long each softener part lasts',
        captionBelow: 'HomeGuide (2025), Angi (2026), InterNACHI, Purolite; warranty terms below.',
        headers: ['Part', 'Typical life', 'Notes'],
        rows: [
          ['Whole softener', '10 to 15 years, up to 20', 'With regular salt and maintenance'],
          ['Resin', 'over 10 years on clean water', 'Shorter with chlorine or iron'],
          ['Control valve', 'often 5 to 15 years', 'Seals, motor and board wear'],
          ['Resin tank', '10 years to lifetime', 'Fiberglass tanks rarely fail'],
          ['Brine tank', '10 years or more', 'Cheap to replace'],
        ],
      },
    },
    { kind: 'h2', text: 'What shortens resin life' },
    { kind: 'p', text: 'Chlorine is the main one. Purolite, a resin maker, says each 1 ppm of chlorine can cut resin life by about half, and the University of Minnesota notes that 2 ppm can halve it. City water usually carries some chlorine, so a carbon filter before the softener can help. Iron also fouls resin; softeners handle up to about 2 to 3 ppm, and higher levels need an [iron filter](/iron-filter-for-well-water/). Resin with a higher crosslink (10% instead of 8%) resists chlorine better, though makers don\'t publish how many extra years it adds.' },
    { kind: 'h2', text: 'Warranty terms (examples)' },
    {
      kind: 'table',
      table: {
        caption: 'Softener warranty terms (examples)',
        captionBelow: 'Manufacturer warranty documents, checked Oct 2026. Terms change; read your own warranty.',
        headers: ['Brand', 'Valve', 'Resin tank', 'Brine tank'],
        rows: [
          ['Fleck (Pentair)', '5 years', '5 to 10 years', '5 years'],
          ['Clack WS1', '5 years', 'n/a (valve only)', 'n/a'],
          ['EcoWater ESS1152', '3 years', 'lifetime (original owner)', '10 years'],
          ['Whirlpool WHES48', '3 years (board), 2 years parts and labor', '10 years', '10 years'],
        ],
      },
    },
    { kind: 'h2', text: 'Signs your softener is wearing out' },
    { kind: 'p', text: 'Hard water even with salt in the tank, stiff laundry and spotty dishes, a softener that regenerates constantly or never, a brine tank that\'s too full or empty, salty-tasting water, resin beads at the faucets, low water pressure and leaks. Work through the free checks in our [troubleshooting guide](/water-softener-not-working/) first; many of these have simple fixes.' },
    { kind: 'h2', text: 'Replace the resin or the whole unit?' },
    { kind: 'p', text: 'If the valve and tanks are sound and only the resin is worn, new resin costs about $200 to $400 installed. HomeGuide suggests replacing resin every 10 or more years on city water, or every 5 to 10 years on wells with iron or manganese. If the valve is failing too, a new softener is usually the better buy; price one with our [water softener cost calculator](/water-softener-cost/).' },
  ],
  faq: [
    { q: 'How long does a water softener last?', a: 'Usually 10 to 15 years, and up to 20 with good maintenance.' },
    { q: 'How long does water softener resin last?', a: 'More than 10 years on clean water, less on chlorinated water or water with iron.' },
    { q: 'Does chlorine damage softener resin?', a: 'Yes. A resin maker says each 1 ppm of chlorine can cut resin life by about half.' },
    { q: 'How much does it cost to replace softener resin?', a: 'About $200 to $400.' },
    { q: 'When should I replace my water softener?', a: 'When a repair would cost more than half the price of a new one, or when an older unit keeps needing repairs.' },
  ],
};

export const GUIDE_FAQ: Record<string, FaqItem[]> = {
  '/water-softener-not-working/': SOFTENER_NOT_WORKING.faq,
  '/iron-filter-for-well-water/': IRON_FILTER.faq,
  '/how-to-test-water-hardness/': HARDNESS_TEST.faq,
  '/well-water-test-kit/': WELL_TEST.faq,
  '/how-long-do-water-softeners-last/': SOFTENER_LIFESPAN.faq,
};

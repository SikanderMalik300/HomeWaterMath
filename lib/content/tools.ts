// Exact tool-page copy. Text is final and copied word for word from the build
// spec. No em dashes. Reference-table data that is generated from code lives in
// the components; static reference tables live here.

import type { ToolCopy, SimpleTable } from './types';

export const SIZE: ToolCopy = {
  quickAnswer:
    'A family of 4 with 15 gpg hard water needs about 31,500 grains between regenerations (4 people × 75 gallons × 15 gpg × 7 days). At an efficient 9 lb salt setting, a 32,000-grain softener only delivers about 25,000 grains, so the better pick is a 48,000-grain unit with 1.5 cubic feet of resin.',
  howToUse: [
    'Enter how many people live in the home.',
    'Leave water use at 75 gallons unless you know your home uses much less or much more.',
    'Enter your hardness. Use a test strip result or the "total hardness" line in your water utility\'s annual report, and pick the unit it\'s given in.',
    'If a water test shows iron, enter it in ppm (the same as mg/L).',
    'Keep 7 days between regenerations unless your dealer or manual says otherwise.',
    'Choose the salt setting you plan to run. The result shows the smallest standard size that covers your home at that setting.',
  ],
  formulaIntro:
    'Softener size comes down to how many grains of hardness your home sends through the resin before each regeneration.',
  formulaEquations: [
    'Grains per day = people × gallons per person per day × hardness in gpg',
    'Grains needed = grains per day × days between regenerations',
  ],
  formulaAfter:
    'If your water has iron, add 4 gpg to the hardness for every 1 ppm of iron first. Then pick the smallest softener whose real capacity at your salt setting is at least the grains needed.',
  examples: [
    {
      lead: 'Example 1: family of 4, 15 gpg, no iron.',
      body: "4 × 75 × 15 = 4,500 grains a day. Over 7 days that's 31,500 grains. At 9 lb of salt per cubic foot, resin holds about 25,000 grains per cubic foot. A 32,000-grain unit (1 cu ft) gives 25,000, which falls short. A 48,000-grain unit (1.5 cu ft) gives 37,500 and lasts about 8.3 days. It uses 13.5 lb of salt each time it regenerates.",
    },
    {
      lead: 'Example 2: couple, 10 gpg, 1 ppm iron.',
      body: 'Hardness with iron is 10 + (1 × 4) = 14 gpg. 2 × 75 × 14 = 2,100 grains a day, or 14,700 over 7 days. The smallest standard unit, 24,000 grains with 0.75 cu ft of resin, holds 18,750 at 9 lb. That lasts about 8.9 days and uses 6.8 lb of salt per regeneration.',
    },
  ],
  exampleNote: '(Display 6.75 as 6.8 lb in prose; the calculator shows 6.8.)',
  notCovered: [
    "Peak flow. A big home with 3 or more bathrooms running at once may need a larger valve or tank than the grain math says. Check the valve's rated gallons per minute.",
    'Iron above 2 ppm, manganese, hydrogen sulfide (rotten-egg smell) or tannins. These need their own treatment.',
    "Salt-free conditioners. They don't remove hardness, so they have no grain capacity to size.",
    'Homes that need more than one 96,000-grain tank.',
    "The exact rating of a specific brand. Use the result to shortlist, then check the model's spec sheet.",
  ],
  tips: [
    'City water reports usually list hardness in mg/L. Divide by 17.1 to get gpg, or use the [hardness converter](/water-hardness-converter/).',
    'Buy for the salt setting you\'ll actually run. At 6 to 9 lb per cubic foot you get 20,000 to 25,000 grains per cubic foot, well below the label.',
    'A metered (demand-initiated) valve regenerates only when the resin is nearly used. NSF/ANSI 44 efficiency ratings don\'t accept time-clock valves.',
    'A typical 1 cubic foot residential unit is rated for about 9 to 11 gallons per minute. If your home often runs two showers and a washer together, ask about the valve\'s flow rating.',
    "If you're on a well, get iron and manganese tested before you buy. Those numbers can change the size or the whole system.",
  ],
  faq: [
    {
      q: 'What size water softener do I need for a family of 4?',
      a: 'It depends on hardness. At 75 gallons per person and 7 days between regenerations, a family of 4 with 10 gpg water needs about 21,000 grains, which a 32,000-grain unit covers at a 9 lb salt setting. At 15 gpg the need rises to 31,500 grains, and a 48,000-grain unit is the right size.',
    },
    {
      q: 'How do I calculate water softener size?',
      a: "Multiply people by gallons per person per day (75 is the usual figure) and by your hardness in gpg. That's grains per day. Multiply by the days between regenerations, often 7. Then choose the smallest softener whose real capacity at your salt setting is at least that number.",
    },
    {
      q: 'Is a 32,000-grain water softener enough?',
      a: 'At a 9 lb salt setting a 32,000-grain unit delivers about 25,000 grains, or roughly 3,570 grains a day over 7 days. That covers 2 people with water just under 24 gpg, 3 people just under 16 gpg and 4 people just under 12 gpg. Above that, go up a size.',
    },
    {
      q: 'What happens if my water softener is too small?',
      a: "It runs out of capacity before its next regeneration, so hard water gets through. A metered valve will regenerate more often to keep up, which means more salt and water per week. A timer valve won't adjust, so you'll notice scale and spots.",
    },
    {
      q: 'Can a water softener be too big?',
      a: 'It costs more upfront and, on a timer valve, can regenerate before the resin is used up, which wastes salt. With a metered valve, a slightly larger tank just regenerates less often. Sizing for about a week between regenerations is a common target.',
    },
    {
      q: 'How many grains per gallon is considered hard water?',
      a: 'The Water Quality Association rates 7 to 10.5 gpg as hard and anything above 10.5 gpg as very hard. In mg/L, the USGS calls 121 to 180 hard and over 180 very hard. Under 1 gpg counts as soft water under NSF/ANSI 44.',
    },
    {
      q: 'Does iron in my water change the softener size?',
      a: 'Yes. Softener makers add 4 or 5 gpg to your hardness for every 1 ppm of clear-water iron, so 1 ppm of iron can raise the size you need. Most softeners are rated for no more than 2 ppm of iron. Above that, put an iron filter in front of the softener.',
    },
  ],
};

export const SIZE_TABLE_CAPACITY: SimpleTable = {
  caption: 'Real capacity per cubic foot of resin by salt setting',
  captionBelow:
    "Based on A.O. Smith's published ratings at 6, 10 and 15 lb and a 2004 Water Conditioning & Purification design guide. Label sizes (32,000 and so on) assume about 32,000 grains per cubic foot at a high salt dose.",
  headers: ['Salt setting (lb per cu ft)', 'Capacity (grains per cu ft)', 'Grains per lb of salt'],
  rows: [
    ['6', '20,000', '3,333'],
    ['9', '25,000', '2,778'],
    ['12', '27,500', '2,292'],
    ['15', '30,000', '2,000'],
  ],
  numericCols: [0, 1, 2],
};

export const SIZE_TABLE_STANDARD: SimpleTable = {
  caption: 'Standard softener sizes',
  headers: ['Label size (grains)', 'Resin (cu ft)', 'Real capacity at 6 lb', 'at 9 lb', 'at 15 lb'],
  rows: [
    ['24,000', '0.75', '15,000', '18,750', '22,500'],
    ['32,000', '1.0', '20,000', '25,000', '30,000'],
    ['48,000', '1.5', '30,000', '37,500', '45,000'],
    ['64,000', '2.0', '40,000', '50,000', '60,000'],
    ['80,000', '2.5', '50,000', '62,500', '75,000'],
    ['96,000', '3.0', '60,000', '75,000', '90,000'],
  ],
  numericCols: [0, 1, 2, 3, 4],
};

// ---------------------------------------------------------------------------

export const SALT: ToolCopy = {
  quickAnswer:
    "A family of 4 with 15 gpg water and a 48,000-grain softener set to 9 lb of salt per cubic foot uses about 590 lb of salt a year, close to 50 lb a month. That's 15 bags of 40 lb, or about $105 a year at $7 a bag. A timer valve set to every 7 days uses about 700 lb.",
  howToUse: [
    'Enter your household and water hardness. Add iron if a test showed any.',
    "Pick your softener's size. It's on the tank label or in the manual, often as grains (for example 32,000) or cubic feet of resin.",
    "Pick the salt setting from your control valve. If you don't know, leave 9 lb.",
    'Choose metered if your valve counts gallons, or timer if it regenerates on set days.',
    'Enter your bag size and what you pay per bag to see the yearly cost.',
  ],
  formulaIntro:
    'Your softener uses salt every time it regenerates, so yearly salt is regenerations per year times salt per regeneration.',
  formulaEquations: [
    'Salt per regeneration = cubic feet of resin × salt setting (lb per cubic foot)',
    'Regenerations per year (metered valve) = 365 × grains per day ÷ softener capacity at that salt setting',
  ],
  formulaAfter:
    "A timer valve regenerates on its schedule no matter how much water you used, so it's simply 365 ÷ the days between regenerations.",
  examples: [
    {
      lead: 'Example 1: family of 4, 15 gpg, 48,000-grain softener, 9 lb setting, metered.',
      body: 'The home uses 4,500 grains a day. At 9 lb the 1.5 cubic feet of resin holds 37,500 grains, so the softener regenerates about every 8.3 days, or 43.8 times a year. Each regeneration uses 1.5 × 9 = 13.5 lb of salt. That\'s 591 lb a year, or 15 bags of 40 lb. On a timer set to every 7 days the same softener regenerates 52 times and uses about 704 lb.',
    },
    {
      lead: 'Example 2: couple, 10 gpg, 1 ppm iron, 24,000-grain softener, 6 lb setting, metered.',
      body: 'Hardness with iron is 14 gpg, so the home uses 2,100 grains a day. At 6 lb, 0.75 cubic feet of resin holds 15,000 grains, about 7.1 days of water. That\'s 51.1 regenerations a year at 4.5 lb each, or 230 lb of salt: 6 bags.',
    },
  ],
  notCovered: [
    'Your valve\'s reserve setting. Metered valves keep some capacity in reserve, so real use can be a little higher than shown.',
    'Potassium chloride. It takes about 13 to 15% more by weight to do the same job as sodium chloride.',
    'Salt bridges or mushing in the brine tank. If the level never drops, check for a bridge before adding more salt.',
    "Water used for regeneration (backwash and rinse), which this page doesn't count.",
    'Iron above 2 ppm or other problems that shorten resin capacity.',
  ],
  tips: [
    'Lower salt settings get more softening per pound. At 6 lb per cubic foot resin softens about 3,333 grains per pound of salt; at 15 lb it\'s about 2,000.',
    'NSF/ANSI 44 counts a softener as efficient at 3,350 grains or more per pound of salt, and it must use a metered valve.',
    'Keep the brine tank at least a quarter full and the salt level a few inches above the water.',
    'Use pellets or crystals made for softeners. Rock salt leaves more insoluble residue in the tank.',
    'If your salt use suddenly drops to zero, look for a hard crust (a salt bridge) and break it up gently with a broom handle.',
  ],
  tipsNote: '(Tips 3 to 5 are general practice; keep them exactly as written, no extra claims.)',
  faq: [
    {
      q: 'How much salt does a water softener use per month?',
      a: 'Most homes use roughly 20 to 80 lb a month. A family of 4 with 15 gpg water on a 48,000-grain metered softener at 9 lb per cubic foot uses about 49 lb a month. A couple with 10 gpg water on a smaller unit at 6 lb can use under 20 lb.',
    },
    {
      q: 'How often should I add salt to my water softener?',
      a: "Check the brine tank once a month and top it up when it's about a quarter full. With typical use that's one or two 40 lb bags a month for a family.",
    },
    {
      q: 'Why is my water softener using so much salt?',
      a: 'The usual causes are a high salt setting, a timer valve that regenerates on a fixed schedule whatever you use, a hardness setting higher than your real water, or a leak or running toilet that sends more water through. Check the setting against a fresh hardness test.',
    },
    {
      q: 'Does a lower salt setting save money?',
      a: 'Yes per pound, but the softener regenerates more often. Resin set to 6 lb per cubic foot softens about 3,333 grains per pound of salt, against about 2,000 at 15 lb, so yearly salt use is usually lower at the efficient setting.',
    },
    {
      q: 'How many bags of salt does a water softener use in a year?',
      a: 'For a family of 4 with 15 gpg water, about 15 bags of 40 lb on a metered 48,000-grain softener at 9 lb per cubic foot. On a timer set to every 7 days it\'s about 18 bags.',
    },
    {
      q: 'Can I use potassium chloride instead of salt?',
      a: 'Yes, most softeners accept it, but it takes about 13 to 15% more by weight to do the same work, and it costs several times more per bag. Raise the setting slightly when you switch.',
    },
    {
      q: 'How much does softener salt cost per year?',
      a: 'At $5 to $10 for a 40 lb bag, most homes spend about $50 to $150 a year on salt. Potassium chloride costs much more.',
    },
  ],
};

export const SALT_TABLE_PER_REGEN: SimpleTable = {
  caption: 'Salt per regeneration by size and setting (lb)',
  captionBelow: '(6.75 shows as 6.8 and 11.25 as 11.3: round half up to 1 decimal.)',
  headers: ['Size', '6 lb', '9 lb', '12 lb', '15 lb'],
  rows: [
    ['24,000 (0.75 cu ft)', '4.5', '6.8', '9.0', '11.3'],
    ['32,000 (1.0)', '6.0', '9.0', '12.0', '15.0'],
    ['48,000 (1.5)', '9.0', '13.5', '18.0', '22.5'],
    ['64,000 (2.0)', '12.0', '18.0', '24.0', '30.0'],
    ['80,000 (2.5)', '15.0', '22.5', '30.0', '37.5'],
    ['96,000 (3.0)', '18.0', '27.0', '36.0', '45.0'],
  ],
  numericCols: [1, 2, 3, 4],
};

// ---------------------------------------------------------------------------

export const HARDNESS: ToolCopy = {
  quickAnswer:
    '1 grain per gallon (gpg) equals 17.1 mg/L, also written as 17.1 ppm, of hardness as calcium carbonate. To convert ppm to gpg, divide by 17.1. So 171 ppm is 10 gpg, and 15 gpg is about 257 ppm. Water above 7 gpg (120 ppm) counts as hard.',
  howToUse: [
    'Type the hardness number from your test strip, lab report or water utility report.',
    'Pick the unit it\'s given in. Utility reports in the US usually use mg/L or ppm. Softener manuals use gpg.',
    'Read the other units and where your water sits on both hardness scales.',
  ],
  formulaIntro:
    'Every unit here measures the same thing, the calcium and magnesium in your water expressed as calcium carbonate. A grain is 64.8 mg and a gallon is 3.785 liters, so 1 gpg = 17.1 mg/L.',
  formulaEquations: [
    'gpg = mg/L ÷ 17.1',
    'mg/L = gpg × 17.1',
    'mmol/L = mg/L ÷ 100.1',
    'German degrees (°dH) = mg/L ÷ 17.85',
    'French degrees (°fH) = mg/L ÷ 10',
  ],
  examples: [
    {
      lead: 'Example 1:',
      body: "15 gpg × 17.1181 = 256.8 mg/L. That's 2.57 mmol/L, 14.4 °dH or 25.7 °fH. It's very hard on both scales.",
    },
    {
      lead: 'Example 2:',
      body: 'a city report shows 120 mg/L. 120 ÷ 17.1181 = 7.0 gpg, which sits at the top of "moderately hard" on both the USGS and WQA scales.',
    },
  ],
  notCovered: [
    'Test strips that report in their own color steps. Use the number printed next to the matching color.',
    '"Hardness as calcium" (not as calcium carbonate). Multiply calcium mg/L by 2.5 first.',
    "TDS (total dissolved solids) readings. TDS meters don't measure hardness.",
    'Temporary versus permanent hardness.',
  ],
  tips: [
    'US water utilities publish hardness in their yearly Consumer Confidence Report. Search your utility\'s name plus "water quality report".',
    'Softener controls ask for gpg. If your report says 200 mg/L, enter 11.7 gpg.',
    'Well water can change with the seasons. Test again after a wet spring or a drought.',
    'If you add iron to the hardness setting on your softener, add 4 to 5 gpg for every 1 ppm of iron.',
  ],
  faq: [
    {
      q: 'How do I convert ppm to gpg?',
      a: 'Divide ppm by 17.1. For example, 200 ppm ÷ 17.1 = 11.7 gpg. This works when the ppm figure is hardness as calcium carbonate, which is how US water reports list it.',
    },
    {
      q: 'Is ppm the same as mg/L for water hardness?',
      a: 'For water, yes. One liter of water weighs about one kilogram, so 1 mg per liter is 1 part per million.',
    },
    {
      q: 'What is a good water hardness level?',
      a: 'Under 1 gpg (17.1 mg/L) is soft. Between 1 and 7 gpg most homes see few problems. Above 7 gpg (120 mg/L) is hard, and above 10.5 gpg (180 mg/L) is very hard, where scale builds up quickly.',
    },
    {
      q: 'What is 300 ppm hardness in gpg?',
      a: "300 ÷ 17.1 = 17.5 gpg. That's very hard water on both the USGS and Water Quality Association scales.",
    },
    {
      q: 'How do I convert German degrees of hardness to gpg?',
      a: 'Multiply °dH by 1.043. So 10 °dH is about 10.4 gpg. One German degree equals 17.85 mg/L as calcium carbonate.',
    },
    {
      q: 'How much sodium does softened water contain?',
      a: 'A salt-based softener adds about 7.9 mg of sodium per liter for every gpg of hardness it removes. Softening 15 gpg water adds about 118 mg per liter.',
    },
  ],
};

export const HARDNESS_TABLE_SCALE: SimpleTable = {
  caption: 'Water hardness scale',
  headers: ['Class (WQA)', 'gpg', 'mg/L (ppm)', 'USGS class'],
  rows: [
    ['Soft', 'under 1.0', 'under 17.1', 'Soft'],
    ['Slightly hard', '1.0 to 3.5', '17.1 to 60', 'Soft'],
    ['Moderately hard', '3.5 to 7.0', '60 to 120', 'Moderately hard'],
    ['Hard', '7.0 to 10.5', '120 to 180', 'Hard'],
    ['Very hard', 'over 10.5', 'over 180', 'Very hard'],
  ],
  numericCols: [1, 2],
};

// ---------------------------------------------------------------------------

export const COST: ToolCopy = {
  quickAnswer:
    'A water softener costs about $1,200 to $3,800 for a standard salt-based system installed by a dealer. Buying a single-tank unit yourself costs about $500 to $1,700, plus $150 to $1,000 if a plumber installs it. Salt adds roughly $50 to $150 a year. The calculator below adds it up for your home over 10 years.',
  howToUse: [
    'Choose the type of system you\'re pricing. Most homes buy a single-tank salt-based softener.',
    'Choose who will install it.',
    'Enter your household and hardness so the calculator can size the softener and work out your salt.',
    'Enter what you pay for a 40 lb bag of salt.',
    'If you have a quote, enter it to see how it compares with typical prices.',
  ],
  formulaIntro:
    'Upfront cost is the unit plus installation. Running cost is salt plus any service you pay for. The 10-year total adds both, because a softener usually lasts 10 to 15 years.',
  formulaEquations: ['10-year cost = upfront + 10 × (yearly salt + yearly service)'],
  formulaAfter:
    'The typical upfront figure is the middle of the unit price range plus $600 of plumber labor, the middle of the range most installs fall in.',
  examples: [
    {
      lead: 'Example 1: single-tank, plumber-installed, family of 4, 15 gpg.',
      body: 'The unit is $500 to $1,700 and labor is $150 to $1,000, so upfront is $650 to $2,700, typically about $1,700. The home needs a 48,000-grain softener that uses about 15 bags of salt a year, $105 at $7 a bag. With no paid service, 10 years costs $1,700 + 10 × $105 = $2,750.',
    },
    {
      lead: 'Example 2: dual-tank from a dealer, family of 5, 20 gpg, yearly pro service.',
      body: 'Dealer-installed dual-tank systems run $1,700 to $5,000, typically $3,350. The home needs about 52,500 grains between regenerations, so an 80,000-grain size. Salt is about 25 bags a year ($175) and service about $200, so $375 a year. Over 10 years: $3,350 + 10 × $375 = $7,100.',
    },
  ],
  notCovered: [
    'Plumbing changes when your home has no softener loop, long pipe runs or needs a new drain or outlet. These push labor toward the top of the range.',
    'Permits, where your city requires one.',
    'Water used during regeneration.',
    'Iron filters, whole-house filters or reverse osmosis bought with the softener.',
    'Dealer financing, rental plans or service contracts.',
    'Prices outside the US.',
  ],
  tips: [
    'Size first, then price. A unit that\'s too small regenerates more often and burns salt; one that\'s too big costs more upfront.',
    'Ask every installer what\'s included: loop work, drain line, bypass valve, removal of an old unit and the first bags of salt.',
    'Dealer quotes bundle the unit, installation and often a service plan, so they look high next to a big-box price tag. Compare the 10-year totals, not the stickers.',
    'A metered valve uses less salt than a timer valve. That saving adds up over 10 years.',
    'If your water has more than 2 ppm of iron, price an iron filter too. Most softeners aren\'t rated above that.',
  ],
  faq: [
    {
      q: 'How much does a water softener cost?',
      a: 'A typical salt-based softener costs $1,200 to $3,800 installed by a dealer. The unit alone is about $500 to $1,700 for a single tank, and a plumber charges about $150 to $1,000 to install one you buy yourself.',
    },
    {
      q: 'How much does it cost to install a water softener?',
      a: 'Labor usually runs $150 to $1,000, and most installs land between $500 and $700. Homes without a softener loop or a nearby drain cost more.',
    },
    {
      q: 'Is a water softener worth the cost?',
      a: 'In hard water it usually is. Above about 7 gpg, scale builds up in water heaters and fixtures and soap works poorly. Over 10 years, a plumber-installed single-tank softener for a family of 4 costs about $2,750 including salt.',
    },
    {
      q: 'How much does it cost to run a water softener per year?',
      a: 'Mostly salt: about $50 to $150 a year for most homes, plus $100 to $300 if you pay for a yearly service visit.',
    },
    {
      q: 'Are salt-free water softeners cheaper?',
      a: "Not upfront. Installed salt-free conditioners run about $1,500 to $4,500, but they need no salt. They also don't remove hardness minerals, so they aren't a direct swap for a softener.",
    },
    {
      q: 'How long does a water softener last?',
      a: 'Usually 10 to 15 years, and some last 20. The resin bed wears faster if your water has chlorine or iron.',
    },
    {
      q: 'Why are dealer water softener quotes so high?',
      a: 'Dealer prices include the unit, installation, setup and often a service plan, and many use premium valves and tanks. Ask for an itemized quote and compare the 10-year total with a store-bought unit plus a plumber.',
    },
  ],
};

export const COST_TABLE_BY_TYPE: SimpleTable = {
  caption: 'Water softener cost by type (US, 2026)',
  captionBelow:
    'Unit prices: This Old House (updated June 2026). Installed prices: HomeGuide (2025). Plumber labor for installing a unit you buy: $150 to $1,000, most often $500 to $700.',
  headers: ['System', 'Unit only', 'Installed by a dealer'],
  rows: [
    ['Salt-based, single tank', '$500 to $1,700', '$1,200 to $3,800'],
    ['Salt-based, dual tank', '$1,000 to $5,000', '$1,700 to $5,000'],
    ['Salt-free conditioner', '$800 to $4,000', '$1,500 to $4,500'],
  ],
};

export const COST_TABLE_RUNNING: SimpleTable = {
  caption: 'Running costs',
  headers: ['Item', 'Typical cost'],
  rows: [
    ['Softener salt, 40 lb bag', '$5 to $10'],
    ['Salt per year (most homes)', '$50 to $150'],
    ['Pro service visit, per year', '$100 to $300'],
    ['DIY install kit (bypass and fittings)', 'about $175'],
    ['Lifespan', '10 to 15 years, sometimes 20'],
  ],
};

// ---------------------------------------------------------------------------

export const PRESSURE: ToolCopy = {
  quickAnswer:
    'Size a well pressure tank so the pump runs at least 1 minute each cycle (2 minutes for pumps over 3/4 hp). A 10 gpm, 1 hp pump needs 20 gallons of drawdown. On a 40/60 switch a tank gives about 26% of its volume as drawdown, so you need about 78 gallons: an 86-gallon tank.',
  howToUse: [
    "Enter your pump's flow rate in gallons per minute. It's on the pump paperwork or the well driller's report.",
    'Pick the pump horsepower. Pumps over 3/4 hp should run at least 2 minutes per cycle.',
    "Pick your pressure switch setting. It's printed inside the switch cover, for example 40/60.",
    "Read the tank size and set the tank's air pre-charge to the number shown, with the water drained.",
  ],
  formulaIntro:
    'A pressure tank stores water above an air cushion. Drawdown is the water you can use between the pump shutting off and turning back on. The pump should run long enough each time to cool its motor, which means the tank\'s drawdown must be at least the pump\'s flow times the minimum run time.',
  formulaEquations: [
    'Drawdown needed = pump gpm × minimum run time (1 minute up to 3/4 hp, 2 minutes above)',
    'Tank size = drawdown needed ÷ that share',
  ],
  formulaAfter:
    'The share of the tank you can use depends on the switch setting. With the pre-charge 2 psi below the cut-in pressure, it\'s about 34% at 20/40, 30% at 30/50 and 26% at 40/60.',
  examples: [
    {
      lead: 'Example 1: 10 gpm, 1 hp, 40/60 switch.',
      body: 'The pump needs 2 minutes, so 10 × 2 = 20 gallons of drawdown. 20 ÷ 0.258 = 77.5 gallons. The next standard size is 86 gallons, which gives about 22.2 gallons of drawdown. Set the pre-charge to 38 psi.',
    },
    {
      lead: 'Example 2: 7 gpm, 1/2 hp, 30/50 switch.',
      body: 'The pump needs 1 minute, so 7 gallons of drawdown. 7 ÷ 0.295 = 23.7 gallons, so a 26-gallon tank, giving about 7.7 gallons of drawdown. Pre-charge: 28 psi.',
    },
  ],
  notCovered: [
    'Constant-pressure (variable speed) pumps. They need much smaller tanks; follow the pump maker\'s chart.',
    'Homes at high altitude. Air pressure is lower, which changes drawdown slightly.',
    'Tanks piped together. Add their drawdowns.',
    'Irrigation or livestock demand that runs the pump for long periods.',
    'Brand-specific ratings. Manufacturers publish their own drawdown tables, which can differ by a few percent.',
  ],
  tips: [
    'Check the pre-charge with the pump off and the tank drained, using a tire gauge on the air valve.',
    'A waterlogged tank makes the pump click on and off every few seconds. That short-cycling wears out the pump and the switch.',
    'Bigger is fine. A larger tank only lengthens each cycle and the time between starts.',
    'If you raise the switch from 30/50 to 40/60, raise the pre-charge too, to 38 psi.',
  ],
  faq: [
    {
      q: 'What size pressure tank do I need for my well?',
      a: "Multiply your pump's gpm by its minimum run time (1 minute up to 3/4 hp, 2 minutes above) to get the drawdown you need. Then divide by the usable share at your switch setting: about 0.30 at 30/50 or 0.26 at 40/60. A 10 gpm, 1 hp pump on 40/60 needs an 86-gallon tank.",
    },
    {
      q: 'What is pressure tank drawdown?',
      a: "It's the amount of water the tank delivers between the pump shutting off at cut-out pressure and turning back on at cut-in. It's always much smaller than the tank's total size: about 26% of the volume at a 40/60 setting.",
    },
    {
      q: 'What should the air pressure be in my well pressure tank?',
      a: "Set it 2 psi below the pump's cut-in pressure with the tank drained of water. That's 28 psi for a 30/50 switch and 38 psi for 40/60.",
    },
    {
      q: 'Is a bigger pressure tank better?',
      a: "Usually. A bigger tank means longer, fewer pump cycles, which is easier on the motor. It costs more and takes more space, but it doesn't lower your water pressure.",
    },
    {
      q: 'What happens if my pressure tank is too small?',
      a: 'The pump starts and stops too often, called short-cycling. Each start heats the motor and wears the switch, so pumps on undersized tanks fail sooner.',
    },
    {
      q: 'How long should a well pump run each cycle?',
      a: 'At least 1 minute for pumps up to 3/4 hp and at least 2 minutes for larger pumps. Goulds calls 1 minute adequate and 2 minutes recommended.',
    },
  ],
};

// Exact copy for the batch-02 cost calculators. Text is final and copied word
// for word from the batch-02 spec. No em dashes.

import type { ToolCopy, SimpleTable } from './types';

// ---------------------------------------------------------------------------
// 1. Well pump replacement cost
// ---------------------------------------------------------------------------

export const WELL_PUMP: ToolCopy = {
  quickAnswer:
    'Replacing a well pump usually costs $1,000 to $2,500 for a submersible pump, $400 to $1,400 for a jet pump and $2,000 to $5,000 for a constant-pressure system, installed. Deep wells cost more when the drop pipe and wire are replaced too, which adds about $3.40 to $8.74 per foot of depth in materials. The calculator below adds it up for your well.',
  howToUse: [
    "Choose your pump type. If you're not sure, a pump inside the well casing is a submersible, and a pump in the basement or a pump house is a jet pump.",
    'Enter how deep the pump sits. Your well log or the last service invoice usually lists it.',
    'Choose whether the pipe and wire should be replaced too. On older or deeper wells many crews replace them while the pump is out.',
    'Add a pressure tank or an after-hours call-out if they apply.',
    'Enter your pump\'s age and any quotes to see whether repair or replacement makes more sense.',
  ],
  formulaIntro: '',
  formulaEquations: [
    'Total cost = pump installed + drop pipe and wire (if replaced) + pressure tank (if replaced) + after-hours labor (if any)',
  ],
  formulaAfter:
    'Pipe and wire are priced per foot of depth from current retail prices: 1-1/4 inch polyethylene drop pipe at $1.48 to $4.74 per foot and 10/3 submersible pump cable at $1.92 to $4.00 per foot.',
  examples: [
    {
      lead: 'Example 1: submersible pump at 200 ft, pipe and wire replaced.',
      body: 'The pump costs $1,000 to $2,500 installed. Pipe and wire for 200 ft add $680 to $1,748. The total is $1,680 to $4,248, typically about $2,964.',
    },
    {
      lead: 'Example 2: constant-pressure system at 300 ft, with new pipe, wire and pressure tank.',
      body: 'The pump costs $2,000 to $5,000, pipe and wire for 300 ft $1,020 to $2,622, and a new tank $200 to $1,500. The total is $3,220 to $9,122, typically about $6,171.',
    },
  ],
  notCovered: [
    'Drilling a new well or deepening an old one.',
    'Electrical work beyond the pump circuit, such as a new panel breaker or a long trench to the well.',
    'Water treatment you may want once the system is open, like a sediment filter.',
    'Permits ($50 to $200 where required, per HomeAdvisor) and local service-call minimums.',
    'Solar pumps ($1,500 to $6,500 installed).',
    'Prices outside the US.',
  ],
  tips: [
    'Ask whether the quote includes new drop pipe, wire, a check valve and a new pressure switch. Those parts are cheap while the pump is out and expensive to pull for later.',
    'If the pump is short-cycling, check the pressure tank first. A waterlogged tank can kill a new pump fast. Use our pressure tank calculator to check the size and pre-charge.',
    "Match the pump to your flow need and depth, not just the old pump's label. Upsizing horsepower without checking the well's yield can pull the water level down to the pump.",
    'Constant-pressure systems cost more but give steady pressure and soft starts, which can help a pump last.',
    'Get the depth and pump model from your well log before you call. Quotes are faster and more accurate.',
  ],
  faq: [
    { q: 'How much does it cost to replace a well pump?', a: 'Most homeowners pay about $975 to $2,825, around $1,900 on average. A submersible pump runs $1,000 to $2,500 installed, a jet pump $400 to $1,400 and a constant-pressure system $2,000 to $5,000.' },
    { q: 'How long does a well pump last?', a: 'Usually 8 to 15 years. Pumps in wells with a lot of sand or sediment wear out sooner, and frequent short-cycling shortens their life.' },
    { q: 'Should I repair or replace my well pump?', a: 'A common rule is to replace a pump older than 10 to 15 years or one that keeps needing repairs, and to repair a single failed part when the fix costs less than half of a replacement.' },
    { q: 'How much does labor cost to replace a well pump?', a: 'Labor usually runs $250 to $1,000, and the job takes about 3 to 6 hours. After-hours and weekend calls usually cost about double.' },
    { q: 'Does well depth change the cost?', a: 'Yes, mostly through the pipe and wire. At current retail prices they add about $3.40 to $8.74 per foot when replaced, and deep pumps need more horsepower and often a pump hoist.' },
    { q: 'What size well pump do I need?', a: "Size for your home's flow need and the depth to the water. Penn State Extension suggests at least 6 gpm for any home, about 12 gpm for 3 bedrooms and 2 baths, and 16 gpm for 4 bedrooms and 3 baths." },
  ],
};

export const WELL_PUMP_TABLE_TYPE: SimpleTable = {
  caption: 'Well pump replacement cost by type (US, installed)',
  captionBelow:
    'HomeGuide (2025), Forbes Home (2025), HomeAdvisor (2026). Most homeowners pay $975 to $2,825; the average is about $1,900 (Angi, ConsumerAffairs, 2026).',
  headers: ['Pump type', 'Usual depth', 'Installed cost'],
  rows: [
    ['Shallow-well jet', 'to about 25 ft', '$400 to $1,000'],
    ['Deep-well jet', 'about 25 to 150 ft', '$500 to $1,400'],
    ['Submersible', 'most wells, any depth', '$1,000 to $2,500'],
    ['Constant-pressure submersible', 'any depth', '$2,000 to $5,000'],
    ['Solar', 'off-grid', '$1,500 to $6,500'],
  ],
};

export const WELL_PUMP_TABLE_HP: SimpleTable = {
  caption: 'Submersible pump prices by horsepower (pump only, Oct 2026)',
  captionBelow:
    'Home Depot listings checked Oct 21, 2026. Brand-name pumps (Goulds, Franklin) cost more. Prices change; check before you buy.',
  headers: ['Horsepower', 'Example pump', 'Rated depth', 'Price'],
  rows: [
    ['1/2 hp', 'Everbilt EFSUB5-123HD, 10 gpm', 'about 125 ft', '$449'],
    ['3/4 hp', 'Everbilt EFSUB7-122HD, 10 gpm', 'about 150 ft', '$569'],
    ['1 hp', 'Everbilt EFSUB10-122HD, 10 gpm', 'about 250 ft', '$639'],
    ['1-1/2 hp', 'ECO-FLO EFSUB15-123, 8.1 gpm', 'about 300 ft', '$682'],
  ],
  numericCols: [3],
};

export const WELL_PUMP_TABLE_WATER: SimpleTable = {
  caption: 'How much water does a home need?',
  captionBelow: 'Penn State Extension, Water System Planning (2025).',
  headers: ['Home', 'Pump flow'],
  rows: [
    ['Minimum for any home', '6 gpm'],
    ['3 bedrooms, 2 baths', '12 gpm'],
    ['4 bedrooms, 3 baths', '16 gpm'],
  ],
};

export const WELL_PUMP_TABLE_REPAIRS: SimpleTable = {
  caption: 'Common repairs (parts and labor)',
  captionBelow: 'HomeGuide (2025) and HomeAdvisor (2026).',
  headers: ['Repair', 'Typical cost'],
  rows: [
    ['Pressure switch', '$120 to $200'],
    ['Start capacitor', '$100 to $300'],
    ['Control box', '$200 to $600'],
    ['Foot valve (jet pumps)', '$150 to $400'],
  ],
};

// ---------------------------------------------------------------------------
// 2. Salt vs salt-free cost
// ---------------------------------------------------------------------------

export const SALT_FREE: ToolCopy = {
  quickAnswer:
    "A salt-free conditioner doesn't soften water. It changes hardness minerals so they form less scale, and in independent tests the best type (TAC) cut scale by more than 88%, while your water still tests just as hard. Upfront it costs more than a salt-based softener, but it needs no salt. For a family of 4 with 15 gpg water, a plumber-installed salt softener costs about $2,750 over 10 years and a salt-free system about $4,818, mostly because of one media replacement.",
  howToUse: [
    'Enter your household, hardness and any iron from a water test.',
    'Choose who will install it. The same installer is used for both systems so the comparison is fair.',
    'Enter your salt price and, if you know it, your water and sewer rate from your bill.',
    "Check the salt-free media life and price against the model you're looking at, and change them if they differ.",
  ],
  formulaIntro:
    'Both systems: 10-year cost = upfront cost + 10 years of running costs.\n\nSalt-based running cost = salt + water used for regeneration. Salt-free running cost = pre-filters + any media replacement that falls inside the 10 years.\n\nRegeneration water = regenerations per year × gallons per regeneration. The salt-free media lasts a set number of gallons, so a bigger household reaches its first media change sooner.',
  formulaEquations: [],
  formulaLines: [
    '10-year cost = upfront + 10 × running costs',
    'Salt-based running cost = salt + regeneration water',
    'Salt-free running cost = pre-filters + media replacements inside 10 years',
    'Regeneration water = regenerations per year × gallons per regeneration',
  ],
  examples: [
    {
      lead: 'Example 1: family of 4, 15 gpg, plumber install, water at $12 per 1,000 gallons.',
      body: 'The salt softener is a 48,000-grain unit at $1,700 installed. It regenerates 43.8 times a year using 2,190 gallons, $26 of water, plus $105 of salt: $131 a year, $3,013 over 10 years. The salt-free system costs $3,000 installed and $27 a year in pre-filters. The household uses 1,095,000 gallons in 10 years, so the 1,000,000-gallon media needs one $1,548 change: $4,818 in total.',
    },
    {
      lead: 'Example 2: couple, 10 gpg, plumber install.',
      body: 'The salt softener is a 24,000-grain unit: $1,700 installed and $35 of salt a year, $2,050 over 10 years. The salt-free system uses 547,500 gallons in 10 years, so no media change: $3,000 + $270 = $3,270.',
    },
  ],
  notCovered: [
    "Soap, cleaning and appliance savings from truly soft water. A salt-free system doesn't give those.",
    'Electricity cost in dollars (it\'s small: about 26 kWh a year for a typical softener valve).',
    'Local rules. Some California areas restrict salt-based softeners that drain to the sewer, such as the Santa Clarita Valley.',
    'Potassium chloride instead of salt (it costs more and needs about 13 to 15% more by weight).',
    'Electronic or magnetic descalers, which performed worse than TAC in independent tests.',
  ],
  tips: [
    'Test before you choose. If you need soft water for soap, skin or a water heater warranty, only a salt-based softener does that.',
    'If you want scale control without salt, look for a TAC system tested to DVGW W512 or IAPMO Z601. Electronic and magnetic devices did much worse in independent tests.',
    'Check iron, manganese and pH limits. A salt-free system can fail quickly on well water with iron.',
    'Compare media life in gallons, not years. A big household can reach the gallon limit years before the "10-year" label.',
    'A metered salt softener with an efficient salt setting narrows the running-cost gap.',
  ],
  faq: [
    { q: 'Is a salt-free water softener as good as a salt-based one?', a: 'Not for softening. A salt-free conditioner leaves the hardness in the water and reduces scale instead. In independent tests the best type (TAC) cut scale by more than 88%, close to ion exchange at about 94%, but your water still tests hard.' },
    { q: 'Which is cheaper over 10 years?', a: "For most homes the salt-based softener. For a family of 4 with 15 gpg water and a plumber install, it's about $2,750 against about $4,818 for a salt-free system, because the salt-free media needs replacing once. Small households can avoid that change, which narrows the gap." },
    { q: 'How long does salt-free media last?', a: 'It depends on the brand. Aquasana rates its whole-house media at 10 years or 1,000,000 gallons, Watts says to replace OneFlow media about every 3 years, and SpringWell says 5 or more years.' },
    { q: 'Do salt-free water softeners work on well water?', a: 'Only if iron is at or below about 0.3 ppm and manganese at or below 0.05 ppm. Many wells exceed that, so test first.' },
    { q: 'How much water does a salt-based softener waste?', a: 'Each regeneration uses about 20 to 70 gallons. A family of 4 with 15 gpg water uses about 2,190 gallons a year at 50 gallons per regeneration.' },
    { q: 'Are salt-based softeners banned anywhere?', a: 'Some California areas restrict softeners that drain brine to the sewer. In the Santa Clarita Valley, voters approved a ban in 2008 and about 7,300 units were removed.' },
  ],
};

export const SALT_FREE_TABLE_COMPARE: SimpleTable = {
  caption: 'Salt-based softener vs salt-free conditioner',
  captionBelow:
    'Scale results: WateReuse Research Foundation project 08-06, Fox et al. (2014). Limits: Watts OneFlow and SpringWell FutureSoft spec sheets. Water per regeneration: EPA WaterSense (2026).',
  headers: ['', 'Salt-based softener', 'Salt-free conditioner (TAC)'],
  rows: [
    ['Removes hardness', 'Yes, to under 1 gpg', 'No, hardness stays the same'],
    ['Scale reduction in tests', 'About 94%', 'More than 88%'],
    ['Uses salt', 'Yes', 'No'],
    ['Uses water to regenerate', 'Yes, 20 to 70 gal each time', 'No'],
    ['Needs electricity', 'A few watts for the valve', 'No'],
    ['Hardness limit', 'High (size to your water)', 'About 75 gpg'],
    ['Iron limit', 'About 2 ppm', '0.3 ppm'],
    ['Certification to look for', 'NSF/ANSI 44', 'DVGW W512 or IAPMO Z601 (80% scale reduction to pass)'],
  ],
};

export const SALT_FREE_TABLE_MEDIA: SimpleTable = {
  caption: 'Salt-free media life and cost (examples)',
  captionBelow: 'Manufacturer pages checked Oct 21, 2026.',
  headers: ['System', 'Media life', 'Replacement'],
  rows: [
    ['Aquasana whole-house salt-free', '10 years or 1,000,000 gal', '$1,548'],
    ['Watts OneFlow', 'about 3 years', 'varies by size'],
    ['SpringWell FutureSoft', '5+ years', 'price not listed'],
  ],
};

// ---------------------------------------------------------------------------
// 3. Reverse osmosis system cost
// ---------------------------------------------------------------------------

export const RO_COPY: ToolCopy = {
  quickAnswer:
    'An under-sink reverse osmosis system costs about $150 to $350 for the unit, or $300 to $700 installed by a plumber. Tankless models run $300 to $600, or $450 to $950 installed. Filters add roughly $50 to $100 a year. A typical older system sends about 4 to 9 gallons to the drain for every gallon of filtered water; WaterSense-labeled systems send about 2.3 or less.',
  howToUse: [
    'Choose the type of system and who will install it.',
    'Enter your household. One gallon per person a day covers drinking and cooking for most homes.',
    'Choose the efficiency. If the box shows a WaterSense label, choose that; if the maker lists a drain ratio, enter it.',
    'Add your water rate to price the drain water, and tick any extras your kitchen needs.',
  ],
  formulaIntro: '',
  formulaEquations: ['10-year cost = upfront cost + 10 × (filters + water sent to drain)'],
  formulaAfter:
    "Water sent to drain = RO water × drain ratio. A system that's 15% efficient sends about 5.7 gallons to the drain for every gallon you drink. At the 30% WaterSense minimum, that falls to about 2.3 gallons.",
  examples: [
    {
      lead: 'Example 1: under-sink with tank, plumber, family of 4, standard efficiency, water at $12 per 1,000 gallons.',
      body: 'Upfront is $300 to $700, typically $500. The family makes 1,460 gallons of RO water a year and sends 8,273 gallons to the drain, about $99 of water. With $50 of filters, that\'s $149 a year and $1,993 over 10 years, about 13.6¢ per gallon. A WaterSense-labeled system would send 3,407 gallons ($41) and total $1,409.',
    },
    {
      lead: 'Example 2: tankless with a 1:1 drain ratio, plumber, fridge line added.',
      body: 'Upfront is $525 to $1,080, typically about $803. With $50 of filters a year, 10 years costs about $1,303 (8.9¢ per gallon), before any water charge.',
    },
  ],
  exampleNote:
    '(Display rule: typical dollars are rounded to whole dollars, so $802.50 shows as $803 and the 10-year total as $1,303.)',
  notCovered: [
    "Whole-house reverse osmosis. It's a different system: $1,000 to $4,800 installed per This Old House and Angi, or $4,800 to $8,000 per HomeGuide, plus pumps, storage and often a softener in front.",
    'Remineralization or UV add-on stages.',
    'Booster pumps for low water pressure (needed below about 40 to 45 psi).',
    "Bottled water you'd stop buying.",
  ],
  tips: [
    "Test your water first. RO is great for nitrate, arsenic, PFAS and dissolved solids, but you don't need it for chlorine taste alone; a carbon filter does that.",
    'Look for the WaterSense label. It means the system wastes less water and is certified to NSF/ANSI 58.',
    'Low water pressure slows output and raises waste. Below about 40 psi, ask about a booster pump.',
    "Buy filters as yearly sets. They're cheaper than single cartridges and easier to keep on schedule.",
    'If your countertop is stone, ask the installer to use the existing sprayer or soap hole for the RO faucet and skip drilling.',
  ],
  faq: [
    { q: 'How much does a reverse osmosis system cost?', a: 'Most under-sink systems cost $150 to $350 for the unit and $300 to $700 installed. Tankless models cost $300 to $600, or $450 to $950 installed. Whole-house systems cost $1,000 to $8,000 installed depending on the source and system.' },
    { q: 'How much does it cost to maintain a reverse osmosis system?', a: 'About $50 to $100 a year for filters. Pre-filters are changed every 6 to 12 months and the membrane every 2 to 4 years.' },
    { q: 'How much water does reverse osmosis waste?', a: 'EPA says typical point-of-use systems run at 10 to 20% efficiency, which sends about 4 to 9 gallons to the drain for each gallon of filtered water. WaterSense-labeled systems must be at least 30% efficient, about 2.3 gallons or less.' },
    { q: 'Is reverse osmosis worth it?', a: "If your water has nitrate, arsenic, lead, PFAS or high dissolved solids, it's one of the most effective home options. For a family of 4 it works out to roughly 7 to 14 cents per gallon over 10 years, including filters." },
    { q: 'Can I install a reverse osmosis system myself?', a: 'Yes, most under-sink systems are made for DIY install with basic tools. A plumber typically charges $150 to $350 and more if you need a new drain line or a fridge line.' },
    { q: 'Do I need whole-house reverse osmosis?', a: 'Rarely. Most homes only need RO water for drinking and cooking, so an under-sink system is enough.' },
  ],
};

export const RO_TABLE_TYPE: SimpleTable = {
  caption: 'Reverse osmosis cost by type',
  captionBelow:
    'HomeGuide (2025), Angi (2026), This Old House (2026). Sources disagree on whole-house RO; the range covers both.',
  headers: ['Type', 'Unit only', 'Installed'],
  rows: [
    ['Under-sink with tank', '$150 to $350', '$300 to $700'],
    ['Tankless under-sink', '$300 to $600', '$450 to $950'],
    ['Countertop', '$200 to $700', 'no install'],
    ['Whole-house', 'n/a', '$1,000 to $8,000'],
  ],
};

export const RO_TABLE_FILTERS: SimpleTable = {
  caption: 'Filter schedule',
  captionBelow: 'APEC and Express Water filter pages (Oct 2026); Angi (2026).',
  headers: ['Stage', 'How often', 'Typical cost'],
  rows: [
    ['Sediment and carbon pre-filters', 'every 6 to 12 months', 'about $30 a set'],
    ['RO membrane', 'every 2 to 4 years', '$30 to $100'],
    ['Carbon post-filter', 'every 12 months or with the membrane', 'included in most sets'],
  ],
};

export const RO_TABLE_DRAIN: SimpleTable = {
  caption: 'Water sent to drain per gallon of RO water',
  captionBelow:
    'EPA WaterSense specification and supporting statement for RO systems (Nov 2024); maker figures vary, check the spec sheet.',
  headers: ['System', 'Efficiency', 'Gallons to drain'],
  rows: [
    ['Typical older under-sink', '10 to 20%', 'about 4 to 9'],
    ['WaterSense labeled (tank)', '30% or better', '2.3 or less'],
    ['High-efficiency tankless (maker claims)', '25 to 50%', 'about 1 to 3'],
  ],
};

// ---------------------------------------------------------------------------
// 4. Whole house water filter cost
// ---------------------------------------------------------------------------

export const WHOLE_HOUSE: ToolCopy = {
  quickAnswer:
    'A whole house water filter costs about $500 to $1,200 for a cartridge system and $800 to $1,500 for a carbon tank system on city water, and $1,000 to $4,000 for a well water system, installed. Adding UV costs $500 to $1,500 more. Cartridges cost about $75 to $150 a year for most families; carbon tanks need new media after about 1,000,000 gallons or 10 years.',
  howToUse: [
    'Choose the type of system. Cartridge and carbon tank systems are for city water; well systems also handle iron, sulfur and sediment.',
    'Add UV if your water comes from a well and has tested positive for bacteria, or if you want protection against it.',
    "Enter your household. The calculator works out how fast you'll use up cartridges or media.",
  ],
  formulaIntro: '',
  formulaEquations: [
    '10-year cost = installed price + 10 × yearly cartridges or lamps + any media change inside 10 years',
  ],
  formulaAfter:
    'Gallons per year = people × 82 gallons a day × 365. Cartridges are rated about 100,000 gallons or 12 months, whichever comes first. Carbon tanks are rated about 1,000,000 gallons or 10 years.',
  examples: [
    {
      lead: 'Example 1: cartridge system, family of 4.',
      body: 'Installed price is $500 to $1,200, typically $850. The home runs 119,720 gallons a year through the filter, 1.2 cartridge sets at $76.98, about $92 a year. Over 10 years: $850 + $920 = $1,772 (exact: $1,771.60).',
    },
    {
      lead: 'Example 2: carbon tank, family of 4.',
      body: 'Installed price is $800 to $1,500, typically $1,150. No cartridges to buy, but the home reaches 1,000,000 gallons in year 8.4, so the media is replaced once for $1,898. Over 10 years: $3,048.',
    },
  ],
  notCovered: [
    'Water softening. A filter doesn\'t remove hardness; see our softener calculators.',
    'Drinking-water contaminants that need reverse osmosis, such as nitrate or high dissolved solids.',
    'Pipe extensions ($150 to $850), a new drain ($300 to $800), an outlet for UV ($150 to $350) or permits ($30 to $600), per HomeGuide and Bob Vila.',
    'Water testing ($50 to $300), which you should do first on a well.',
  ],
  tips: [
    'Test before you buy. Pick the filter for what\'s in your water, not the most stages.',
    'Put a sediment pre-filter first on any system. It protects the carbon and is the cheapest part to change.',
    'Change cartridges by date as well as gallons. A carbon cartridge left too long can grow bacteria.',
    'On a well, treat iron before a UV lamp or a carbon tank. Iron coats the UV sleeve and clogs carbon.',
    'Install a bypass valve so you can change cartridges and service the system without shutting off the house.',
  ],
  faq: [
    { q: 'How much does a whole house water filter cost?', a: 'Most systems cost $500 to $1,500 installed for city water and $1,000 to $4,000 for well water. UV adds $500 to $1,500.' },
    { q: 'How much does it cost to install a whole house water filter?', a: 'Labor usually runs $200 to $600, more if the plumber needs to extend pipes, add a drain or install an outlet.' },
    { q: 'How often do you change a whole house water filter?', a: 'Cartridges every 6 to 12 months or about 100,000 gallons. Carbon tanks every 1,000,000 gallons or about 10 years. UV lamps every 12 months.' },
    { q: 'How much does a whole house water filter cost per year?', a: 'For a family of 4 on a cartridge system, about $92 a year for cartridges. Carbon tank systems cost little each year but need a media change worth about $1,900 after around 8 years for a family of 4.' },
    { q: 'Is a whole house water filter worth it?', a: "If you want chlorine or chloramine taste and smell out of every tap and shower, or you're on a well with sediment, iron or sulfur, it usually is. For drinking water alone, an under-sink filter or RO system is cheaper." },
  ],
};

export const WHOLE_HOUSE_TABLE_TYPE: SimpleTable = {
  caption: 'Whole house water filter cost by type (installed)',
  captionBelow:
    'HomeAdvisor (2026), Bob Vila, Water Filter Guru (2024), HomeGuide (2025). Labor is usually $200 to $600 of the price.',
  headers: ['Type', 'Installed cost', 'Yearly upkeep'],
  rows: [
    ['Sediment + carbon cartridges', '$500 to $1,200', 'cartridges every 6 to 12 months'],
    ['Carbon tank', '$800 to $1,500', 'media every 1,000,000 gal or 10 years'],
    ['Well water (iron, sulfur)', '$1,000 to $4,000', 'pre-filter + media every 5 to 12 years'],
    ['UV add-on', '+$500 to $1,500', 'lamp every 12 months'],
  ],
};

export const WHOLE_HOUSE_TABLE_PARTS: SimpleTable = {
  caption: 'Replacement parts (examples, Oct 2026)',
  captionBelow: 'Express Water and Aquasana product pages, checked Oct 21, 2026.',
  headers: ['Part', 'Rated life', 'Price'],
  rows: [
    ['4.5 x 20 in sediment cartridge', '100,000 gal or 6 to 12 months', '$32.99'],
    ['4.5 x 20 in carbon block cartridge', '100,000 gal or 6 to 12 months', '$43.99'],
    ['Carbon tank replacement (1M gal)', '1,000,000 gal or 10 years', '$1,898'],
    ['UV lamp', '12 months', '$125.99'],
  ],
};

// ---------------------------------------------------------------------------
// 5. Water softener installation cost
// ---------------------------------------------------------------------------

export const SOFTENER_INSTALL: ToolCopy = {
  quickAnswer:
    'Installing a water softener usually costs $150 to $1,000 in labor, and most installs land between $500 and $700 when the home already has a softener loop. With no loop, adding one costs $200 to $2,000 more, and a new drain or outlet adds more again. The calculator below itemizes your install. For the softener itself, see our [water softener cost calculator](/water-softener-cost/).',
  howToUse: [
    "Choose your setup. A softener loop is a pair of pipes, usually near the water heater or where the main line enters, that's already plumbed for a softener.",
    'Say whether there\'s a drain and an outlet near the spot. The softener needs both.',
    "Add your city's permit fee if one applies.",
    'If you have a quote, enter it to see how it compares.',
  ],
  formulaIntro: '',
  formulaEquations: [
    'Installation cost = labor + removal of an old unit + loop (if none) + drain (if needed) + outlet (if needed) + permit',
  ],
  formulaAfter:
    'The typical figures are $600 of labor, $75 for removal, $900 for a new loop, $550 for a drain line and $225 for an outlet.',
  examples: [
    {
      lead: 'Example 1: no loop, drain and outlet in reach.',
      body: 'Labor is $150 to $1,000 and a new loop $200 to $2,000. The total is $350 to $3,000, typically about $1,500.',
    },
    {
      lead: 'Example 2: no loop, no drain, no outlet, $84 permit.',
      body: 'Labor $150 to $1,000, loop $200 to $2,000, drain $300 to $800, outlet $150 to $300, plus $84. The total is $884 to $4,184, typically about $2,359.',
    },
  ],
  notCovered: [
    'The softener itself and salt. See the water softener cost calculator.',
    'Moving the main water line, or installs outdoors (many installers won\'t install outdoors in freezing areas).',
    'Extra pipe beyond a short run, priced at $0.50 to $8 per foot by Angi.',
    'Water heater or fixture repairs found during the job.',
  ],
  tips: [
    'Ask for an itemized quote: labor, loop work, drain, outlet, bypass valve and removal. Then compare line by line.',
    'A home built with a softener loop saves the biggest item on the list. Look for capped pipes near the water heater before you call.',
    'Keep the softener close to the drain and the outlet. Long runs add pipe and time.',
    "If you're installing it yourself, you'll need a bypass valve and fittings; an install kit runs about $175 at Home Depot.",
    'Size the softener before you book the plumber. The connection size and tank height change the install.',
  ],
  faq: [
    { q: 'How much does it cost to install a water softener?', a: 'Labor usually runs $150 to $1,000, and most installs land between $500 and $700 when the home has a softener loop. Replacing an old unit adds about $50 to $100 for removal.' },
    { q: 'How much does it cost to add a water softener loop?', a: 'About $200 to $2,000. This Old House puts it at $200 to $800, and Fixr at $600 to $2,000 when more pipe has to be run.' },
    { q: 'How long does it take to install a water softener?', a: 'Usually 2 to 4 hours for a home with a loop. Adding a loop, drain or outlet takes longer.' },
    { q: 'Do you need a permit to install a water softener?', a: 'It depends on your city. Many treat it as a plumbing permit; examples range from about $37 in La Habra, California to $84 or more in St. Paul, Minnesota.' },
    { q: 'Can I install a water softener myself?', a: "If your home has a loop, a drain and an outlet nearby, many homeowners do. You'll need a bypass valve and fittings, about $175 for an install kit. Without a loop, it's a plumbing job." },
  ],
};

export const SOFTENER_INSTALL_TABLE: SimpleTable = {
  caption: 'What changes an installation quote',
  captionBelow:
    'This Old House (2026), Fixr (2025), Angi (2026), HomeGuide (2025); permit examples from La Habra, CA and St. Paul, MN.',
  headers: ['Item', 'Typical cost'],
  rows: [
    ['Plumber labor, home with a loop', '$150 to $1,000 (most $500 to $700)'],
    ['New softener loop', '$200 to $2,000'],
    ['New drain line', '$300 to $800'],
    ['New 120 V outlet', '$150 to $300'],
    ['Remove the old softener', '$50 to $100'],
    ['Plumber hourly rate', '$45 to $200'],
    ['Permit (where required)', 'about $35 to $100+'],
  ],
};
